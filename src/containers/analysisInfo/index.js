import { Box, Button, CircularProgress, FormControl } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import {
  RadioGroup,
  FormControlLabel,
  SnackbarContent,
} from "@material-ui/core";
import {
  getAnalysisInfo,
  getCheckpointData,
  getResults,
  resetAnalysisInfo,
} from "../../redux/actions/analysisInfo";
import PopupModal from "../../components/modal";
import { closeModal, openModal } from "../../redux/actions/modal";
import InconclusiveModal from "../../components/inconclusiveModal";
import { Radio } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import {
  setCheckPoint,
  onConfirmInconclusive,
  getPendingAnalysis,
} from "../../redux/actions/analysis";
import {
  getAnalysisResultUrl,
  GET_ANALYSIS_URL,
  putApiCallback,
} from "../../api/api";
import { analysisActionTypes } from "../../redux/constants/analysis";
import { beautifyName } from "../../helper";

const AnalysisInfo = () => {
  const { id } = useParams();
  const analysisData = useLocation()?.state?.data || {};
  const dispatch = useDispatch();
  const [formValue, setFormValue] = useState({});
  const analysisInfo = useSelector((state) => state.analysisInfo);
  const robotsAnalysis = useSelector((state) => state.robotsAnalysis);
  const isCheckpointError = useSelector(
    (state) => state.robotsAnalysis.isCheckpointError
  );
  const [currentButton, setcurrentButton] = useState("");
  const [error, setError] = useState(null);
  const [radioValue, setradioValue] = useState("");
  const history = useHistory();

  useEffect(() => {
    if (analysisData.processed) {
      dispatch(getResults(analysisData));
    }
  }, [analysisData, dispatch]);

  useEffect(() => {
    if (analysisInfo.currentAnalysisResult)
      setFormValue(analysisInfo.currentAnalysisResult);
    // debugger;
    if(analysisInfo.analysisInfo?.fields?.fields && analysisInfo.analysisInfo?.fields?.fields.length > 0) {
      setcurrentButton("analyticsForm")
      dispatch(openModal());
    }
  }, [analysisInfo.currentAnalysisResult, analysisInfo.analysisInfo, dispatch]);

  useEffect(() => {
    if (
      !robotsAnalysis?.pendingAnalysis ||
      !robotsAnalysis?.processedAnalysis
    ) {
      dispatch(getPendingAnalysis());
    }
    if (!analysisInfo?.checkpoint) {
      dispatch(getCheckpointData());
    }
  }, [
    dispatch,
    id,
    analysisInfo?.checkpoint,
    robotsAnalysis?.pendingAnalysis,
    robotsAnalysis?.processedAnalysis,
  ]);

  useEffect(() => {
    if (analysisInfo?.checkpoint && analysisData.checkpoint_type)
      dispatch(getAnalysisInfo(analysisData));
    if (!analysisData.checkpoint_type) {
      setcurrentButton("checkpoint");
      dispatch(openModal());
    }
    return () => {
      dispatch(resetAnalysisInfo());
    };
  }, [analysisInfo?.checkpoint, analysisData, dispatch]);

  const onConfirmHandler = () => {
    setError(null);
    if (Object.keys(formValue).length === 0) {
      setError("Fill Reading Data Carefully");
      return;
    }
    setcurrentButton("confirm");
    dispatch(openModal());
  };
  const onINconclusiveHandler = () => {
    setcurrentButton("inconclusive");
    dispatch(openModal());
  };

  const onValueChange = (event) => {
    setFormValue((prevValue) => {
      return {
        ...prevValue,
        [event.target.name]: event.target.value,
      };
    });
  };
  const onAnalysis = async () => {
    try {
      await putApiCallback(
        getAnalysisResultUrl(analysisData.measurement_id),
        formValue
      );
      dispatch({
        type: analysisActionTypes.SET_SUCCESS_RESULT,
        measurement_id: analysisData.measurement_id,
      });
      dispatch(closeModal());
      history.push("/");
    } catch (err) {
      setError(err.response.statusText);
      dispatch(closeModal());
    }
  };

  const setCheckpoint = () => {
    if (radioValue === "unknown") {
      dispatch(
        onConfirmInconclusive(radioValue, analysisData, () => {
          history.push("/");
        })
      );
    } else {
      dispatch(
        setCheckPoint(radioValue, analysisData, () => {
          setcurrentButton("analyticsForm")
          dispatch(openModal());
        })
      );
    }
  };

  const backClick = () => {
    history.push("/");
  };
  if (analysisInfo?.isGetResultsLoading) {
    return (
      <div className="loader-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      {currentButton === "confirm" && (
        <PopupModal
          okText="Ok"
          cancelText="Cancel"
          onOk={onAnalysis}
          title="Are You Sure You want to input?"
        >
          <div style={{ fontSize: 16, marginBottom: "30px" }}>
            <div className="formdata">
              {Object.entries(formValue).map((formData) => {
                return (
                  <div style={{ fontWeight: 500 }}>
                    <span className="formdata-tag">{formData[0]}</span> :{" "}
                    {formData[1]}
                  </div>
                );
              })}
            </div>
          </div>
        </PopupModal>
      )}
      {currentButton === "checkpoint" && (
        <PopupModal okText="Ok" onOk={setCheckpoint} title="What kind of checkpoint does this measurement refer to?">
          <div style={{ fontSize: 16, marginBottom: "30px" }}>
            <div className="formdata">
              <FormControl fullWidth>
                <RadioGroup
                  value={radioValue}
                  onChange={(event) => {
                    setradioValue(event.target.value);
                  }}
                >
                  {(analysisInfo?.checkpoint || []).map((checkpoint) => {
                    return (
                      <FormControlLabel
                        value={checkpoint.type}
                        control={<Radio />}
                        label={beautifyName(checkpoint.type)}
                      />
                    );
                  })}
                  <FormControlLabel
                    value="unknown"
                    control={<Radio />}
                    label="Unknown"
                  />
                </RadioGroup>
              </FormControl>
            </div>
          </div>
          {isCheckpointError && (
            <SnackbarContent elevation={0} message={isCheckpointError} />
          )}
        </PopupModal>
      )}
      {currentButton === "inconclusive" && (
        <InconclusiveModal setError={setError} />
      )}
      {analysisInfo.isProgress && (
        <div className="loader-center">
          <CircularProgress />
        </div>
      )}
      {currentButton === "analyticsForm" && (
        <PopupModal title="Analysis Form" isFooter={false}>
          <div className="analysisInfo-wrap">
            <FormControl fullWidth className="analysisInfo-form">
              {(analysisInfo.analysisInfo?.fields?.fields || []).map(
                (field, index) => {
                  const name = field.text.toLowerCase();
                  switch (field.object) {
                    case "TextBox":
                      return (
                        <>
                          <div>
                            <TextField
                              name={name}
                              label={field.text}
                              value={formValue[`${name}`]}
                              variant="outlined"
                              onChange={onValueChange}
                              fullWidth
                            ></TextField>
                          </div>
                        </>
                      );
                    case "textarea":
                      return (
                        <>
                          <div>
                            <TextField
                              name={name}
                              label={field.text}
                              value={formValue[`${name}`]}
                              multiline
                              rows={4}
                              variant="outlined"
                              onChange={onValueChange}
                              fullWidth
                            ></TextField>
                          </div>
                        </>
                      );
                    case "RadioButton":
                      return (
                        <>
                          <div style={{ margin: 5 }}>
                            <span
                              style={{
                                fontWeight: 600,
                                marginBottom: "30px",
                              }}
                            >
                              {field.text}
                            </span>
                            <RadioGroup
                              name={name}
                              value={formValue[`${name}`]}
                              onChange={onValueChange}
                              title={field.text}
                              style={{ margin: "10px" }}
                            >
                              {field.options.map((option) => {
                                return (
                                  <FormControlLabel
                                    value={option}
                                    control={<Radio />}
                                    label={option}
                                  />
                                );
                              })}
                            </RadioGroup>
                          </div>
                        </>
                      );
                    default:
                      return null;
                  }
                }
              )}
              {error && (
                <SnackbarContent
                  elevation={0}
                  message={<>{error}</>}
                  className="alert-danger"
                />
              )}
            </FormControl>

            {analysisInfo.analysisInfo?.fields?.fields ? (
              <Box mt={4} textAlign="right">
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ margin: 4 }}
                  onClick={backClick}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ margin: 4 }}
                  onClick={onINconclusiveHandler}
                >
                  Inconclusive
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ margin: 4 }}
                  onClick={onConfirmHandler}
                >
                  Confirm
                </Button>
              </Box>
            ) : (
              <></>
            )}
          </div>
        </PopupModal>
      )}

      {!analysisInfo.isProgress && (
        <Grid container spacing={2} style={{ padding: "1rem" }}>
          <Grid item xs={2}>
            <IconButton aria-label="delete" size="small" onClick={backClick}>
              <ArrowBackIcon fontSize="inherit" />
            </IconButton>
          </Grid>
          <Grid item xs={8}>
            <div style={{ textAlign: "center" }}>
              <img
                alt={analysisData.robot}
                src={`${GET_ANALYSIS_URL}/measurement/${analysisData.measurement_id}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
              />
            </div>
          </Grid>
          {/* <Grid item xs={5}>
            <div className="analysisInfo-wrap">
              <FormControl fullWidth className="analysisInfo-form">
                {(analysisInfo.analysisInfo?.fields?.fields || []).map(
                  (field, index) => {
                    const name = field.text.toLowerCase();
                    switch (field.object) {
                      case "TextBox":
                        return (
                          <>
                            <div>
                              <TextField
                                name={name}
                                label={field.text}
                                value={formValue[`${name}`]}
                                variant="outlined"
                                onChange={onValueChange}
                                fullWidth
                              ></TextField>
                            </div>
                          </>
                        );
                      case "textarea":
                        return (
                          <>
                            <div>
                              <TextField
                                name={name}
                                label={field.text}
                                value={formValue[`${name}`]}
                                multiline
                                rows={4}
                                variant="outlined"
                                onChange={onValueChange}
                                fullWidth
                              ></TextField>
                            </div>
                          </>
                        );
                      case "RadioButton":
                        return (
                          <>
                            <div style={{ margin: 5 }}>
                              <span
                                style={{
                                  fontWeight: 600,
                                  marginBottom: "30px",
                                }}
                              >
                                {field.text}
                              </span>
                              <RadioGroup
                                name={name}
                                value={formValue[`${name}`]}
                                onChange={onValueChange}
                                title={field.text}
                                style={{ margin: "10px" }}
                              >
                                {field.options.map((option) => {
                                  return (
                                    <FormControlLabel
                                      value={option}
                                      control={<Radio />}
                                      label={option}
                                    />
                                  );
                                })}
                              </RadioGroup>
                            </div>
                          </>
                        );
                      default:
                        return null;
                    }
                  }
                )}
                {error && (
                  <SnackbarContent
                    elevation={0}
                    message={<>{error}</>}
                    className="alert-danger"
                  />
                )}
              </FormControl>

              {analysisInfo.analysisInfo?.fields?.fields ? (
                <div>
                  <Button
                    variant="outlined"
                    color="primary"
                    style={{ margin: 4 }}
                    onClick={backClick}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    style={{ margin: 4 }}
                    onClick={onINconclusiveHandler}
                  >
                    Unknown
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    style={{ margin: 4 }}
                    onClick={onConfirmHandler}
                  >
                    Confirm
                  </Button>
                </div>
              ) : (
                <></>
              )}
            </div>
          </Grid> */}
        </Grid>
      )}
    </>
  );
};

export default AnalysisInfo;
