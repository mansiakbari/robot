import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { DataGrid } from "@material-ui/data-grid";
import { useEffect, useState } from "react";
import { getPendingAnalysis } from "../../redux/actions/analysis";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import { getCheckpointData } from "../../redux/actions/analysisInfo";
import { beautifyName, formatDate } from "../../helper";
import { ToastContainer } from "react-toastify";

const AnalysisScreen = () => {
  const [value, setValue] = useState(0);
  const history = useHistory();
  const dispatch = useDispatch();
  const robotsAnalysis = useSelector((state) => state.robotsAnalysis);
  const robotsCheckpoint = useSelector(
    (state) => state.analysisInfo.checkpoint
  );
  useEffect(() => {
    if (!robotsCheckpoint) {
      dispatch(getCheckpointData());
    }
  }, [dispatch, robotsCheckpoint]);

  useEffect(() => {
    dispatch(getPendingAnalysis());
    const analysisInterval = setInterval(() => {
      dispatch(getPendingAnalysis());
    }, 10000);
    return () => {
      clearInterval(analysisInterval);
    };
  }, [dispatch]);

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`wrapped-tabpanel-${index}`}
        aria-labelledby={`wrapped-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  const columns = [
    { field: "id", hide: true },
    {
      field: "robot",
      headerName: "Robot Name",
      headerAlign: "center",
      width: 200,
      renderCell: (cellValues) => {
        return (
          <span className="link-text">{beautifyName(cellValues?.value)}</span>
        );
      },
    },
    {
      field: "measurement_id",
      headerName: "Robot Analysis",
      headerAlign: "center",
      width: 200,
      renderCell: (cellValues) => <span>{cellValues?.value || "---"}</span>,
    },
    {
      field: "checkpoint_type",
      headerName: "Checkpoint",
      headerAlign: "center",
      width: 200,
      renderCell: (cellValues) => {
        return <span>{beautifyName(cellValues?.value) || "---"}</span>;
      },
    },
    {
      field: "date",
      headerName: "Date",
      headerAlign: "center",
      width: 200,
      renderCell: (cellValues) => (
        <span>{formatDate(cellValues?.value) || "---"}</span>
      ),
    },
  ];

  const setSelection = (value) => {
    console.log(value);
    history.push({
      pathname: "/analysis/" + value.row.measurement_id,
      state: { data: value.row },
    });
  };

  const onTabChange = (value, newValue) => {
    setValue(newValue);
  };
  return (
    <div style={{ padding: "1rem" }}>
      <ToastContainer />
      <div className="custom-tabs">
        <Tabs value={value} onChange={onTabChange} centered>
          <Tab
            label="Pending"
            id="full-width-tab-0"
            aria-controls="full-width-tabpanel-0"
            value={0}
          ></Tab>
          <Tab
            label="Processed"
            id="full-width-tab-1"
            aria-controls="full-width-tabpanel-1"
            value={1}
          ></Tab>
        </Tabs>
        <div style={{ textAlign: "right", margin: "0 1rem" }}>
          <NotificationsActiveIcon />
        </div>
      </div>
      <TabPanel index={0} value={value} className="Analysis-box">
        <div style={{ height: "89vh" }} className="Analysis-screen">
          {robotsAnalysis.isError ? (
            <div>{robotsAnalysis.isError}</div>
          ) : (
            <DataGrid
              rows={robotsAnalysis?.pendingAnalysis || []}
              columns={columns}
              pageSize={10}
              getRowId={(row) => row.measurement_id}
              rowsPerPageOptions={[5, 10, 15]}
              // checkboxSelection={true}
              // onRowSelected={(GridRowSelectedParams) => {
              //   console.log(GridRowSelectedParams);
              //   setSelection(GridRowSelectedParams);
              // }}
              onRowClick={(rowValue) => {
                console.log(rowValue);
                setSelection(rowValue);
              }}
            />
          )}
        </div>
      </TabPanel>
      <TabPanel index={1} value={value} className="Analysis-box">
        <div style={{ height: "89vh" }} className="Analysis-screen">
          {robotsAnalysis.isError ? (
            <div>{robotsAnalysis.isError}</div>
          ) : (
            <DataGrid
              rows={robotsAnalysis?.processedAnalysis || []}
              columns={columns}
              pageSize={10}
              error={robotsAnalysis.isError}
              getRowId={(row) => row.measurement_id}
              checkboxSelection={false}
              onRowSelected={(GridRowSelectedParams) => {
                setSelection(GridRowSelectedParams);
              }}
            />
          )}
        </div>
      </TabPanel>
    </div>
  );
};
export default AnalysisScreen;
