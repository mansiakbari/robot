import {
  getApiCallback,
  GET_ANALYSIS_URL,
  putApiCallback,
  getAnalysisResultUrl,
  setCheckpointUrl,
  postApiCallback,
} from "../../api/api";
import { getDifference, showSuccessToast, sortByDate } from "../../helper";
import { analysisActionTypes } from "../constants/analysis";
import { getAnalysisInfo } from "./analysisInfo";
import { closeModal } from "./modal";

export const getPendingAnalysis = () => {
  return async (dispatch, getState) => {
    let pendingAnalysis = [],
      processedAnalysis = [];
    dispatch({ type: analysisActionTypes.GET_ROBOTS_ANALYSIS_LOADING });
    try {
      const response = await getApiCallback(GET_ANALYSIS_URL);
      response.data.forEach((analysis, index) => {
        if (analysis.processed) {
          processedAnalysis.push(analysis);
        } else {
          pendingAnalysis.push(analysis);
        }
      });

      const state = getState();
      const [currentPendingAnalysis, currentProcessingAnalysis] = [
        state.robotsAnalysis.pendingAnalysis,
        state.robotsAnalysis.processedAnalysis,
      ];
      // // debugger;
      if (
        currentPendingAnalysis?.length !== pendingAnalysis?.length ||
        currentProcessingAnalysis?.length !== processedAnalysis?.length
      ) {
        const pendingDifference = getDifference(
          pendingAnalysis,
          currentPendingAnalysis || []
        );
        const processedDifference = getDifference(
          processedAnalysis,
          currentProcessingAnalysis || []
        );
        console.log(pendingDifference, processedDifference);
        pendingDifference.forEach((diff) => {
          showSuccessToast(`New Pending Analysis Added : ${diff.analysis_id}`);
        });
        processedDifference.forEach((diff) => {
          showSuccessToast(
            `New Processed Analysis Added : ${diff.analysis_id}`
          );
        });
      }

      dispatch({
        type: analysisActionTypes.GET_ROBOTS_ANALYSIS_SUCCESS,
        pendingAnalysis: sortByDate(pendingAnalysis),
        processedAnalysis: sortByDate(processedAnalysis),
      });
    } catch (error) {
      dispatch({
        type: analysisActionTypes.GET_ROBOTS_ANALYSIS_FAILED,
        err: error.message,
      });
    }
  };
};

export const setCheckPoint = (value, data, cb) => {
  return async (dispatch) => {
    dispatch({ type: analysisActionTypes.UPDATE_CHECKPOINT_LOADING });
    try {
      await postApiCallback(setCheckpointUrl(data.measurement_id), value);
      dispatch({
        type: analysisActionTypes.UPDATE_CHECKPOINT_DATA,
        checkpoint_type: value,
        measurement_id: data.measurement_id,
        isProcessed: data.processed,
      });
      // dispatch(getPendingAnalysis());
      dispatch(getAnalysisInfo({ ...data, check_point: value }));
      // dispatch(closeModal());
      cb();
    } catch (error) {
      dispatch({
        type: analysisActionTypes.UPDATE_CHECKPOINT_FAILED,
        error: error.response.statusText,
      });
    }
  };
};

export const onConfirmInconclusive = (inconclusiveData, data, cb) => {
  return async (dispatch) => {
    dispatch({ type: analysisActionTypes.UPDATE_CHECKPOINT_LOADING });
    try {
      await putApiCallback(getAnalysisResultUrl(data.measurement_id), {});
      dispatch(closeModal());
      cb();
    } catch (error) {
      dispatch({
        type: analysisActionTypes.UPDATE_CHECKPOINT_FAILED,
        error: error.response.statusText,
      });
    }
  };
};
