import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { getAnalysisResultUrl, putApiCallback } from "../../api/api";
import { closeModal } from "../../redux/actions/modal";
import PopupModal from "../modal";

const InconclusiveModal = (props) => {
  const { setError } = props;
  const [radioValue, setradioValue] = useState("");
  const history = useHistory();
  const analysisData = useLocation()?.state?.data || {};
  const [isVisible, setisVisible] = useState(false);
  const [reason, setReason] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    radioValue === "other" ? setisVisible(true) : setisVisible(false);
  }, [radioValue]);

  const onInconclusiveConfirm = async () => {
    try {
      await putApiCallback(getAnalysisResultUrl(analysisData.measurement_id), {
        "inconclusive": radioValue === "other" ? reason : radioValue,
      });
      history.push("/");
      dispatch(closeModal());
    } catch (err) {
      setError(err.response.statusText);
      dispatch(closeModal());
    }
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  }
  return (
    <PopupModal okText="Confirm" cancelText="Back" onOk={onInconclusiveConfirm} title="Please Specify the Reson" onCancel={() => {}}>
      <div style={{ marginTop: "1rem" }}>
        <FormControl fullWidth>
          <RadioGroup
            value={radioValue}
            defaultValue="wrongImage"
            onChange={(event) => {
              setradioValue(event.target.value);
            }}
          >
            <FormControlLabel
              value="wrongImage"
              control={<Radio />}
              label="Wrong Image"
            />
            <FormControlLabel value="glare" control={<Radio />} label="Glare" />
            <FormControlLabel
              value="badFocus"
              control={<Radio />}
              label="Bad Focus"
            />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
            {isVisible && (
              <TextField
                label="Other Reason"
                variant="outlined"
                size="small"
                fullWidth
                onChange={handleReasonChange}
                style={{ marginTop: "10px", marginBottom: "16px" }}
              ></TextField>
            )}
          </RadioGroup>
        </FormControl>
      </div>
    </PopupModal>
  );
};

export default InconclusiveModal;
