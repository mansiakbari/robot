import {
  getAnalysisResultUrl,
  getApiCallback,
  GET_CHECKPOINT_URL,
  putApiCallback,
} from "../../api/api";
import analysisInfoActionTypes from "../constants/analysisInfo";
import { closeModal } from "./modal";
export const getCheckpointData = () => {
  return async (dispatch) => {
    dispatch(startProgress());
    try {
      const checkpointData = await getApiCallback(GET_CHECKPOINT_URL);
      dispatch({
        type: analysisInfoActionTypes.GET_CHECKPOINT_DATA,
        checkpointData,
      });
      dispatch(stopProgress());
    } catch (error) {
      console.log(error.message);
    }
  };
};

export const getResults = (analysisData) => {
  return async (dispatch, getState) => {
    dispatch({
      type: analysisInfoActionTypes.GET_ANALYSIS_RESULT_LOADING,
    });
    try {
      const response = await getApiCallback(getAnalysisResultUrl(analysisData.measurement_id));
      dispatch({
        type: analysisInfoActionTypes.GET_ANALYSIS_RESULT_SUCCESS,
        data: JSON.parse(response.data)
      });
    } catch (error) {
      dispatch({
        type: analysisInfoActionTypes.GET_ANALYSIS_RESULT_FAILED,
        error: error.message
      });
    }
  };
}
export const getAnalysisInfo = (analysisData) => {
  return async (dispatch, getState) => {
    try {
      const checkpointFilter = getState().analysisInfo.checkpoint.filter(
        (checkpoint) => {
          return checkpoint.type === analysisData.checkpoint_type;
        }
      );
      dispatch({
        type: analysisInfoActionTypes.GET_ANALYSIS_INFO,
        analysisInfo: {
          ...analysisData,
          fields: {
            ...checkpointFilter[0],
            fields: checkpointFilter[0]?.fields?.fields,
          },
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  };
};

export const resetAnalysisInfo = () => {
  return { type: analysisInfoActionTypes.RESET_ANALYSIS_INFO };
};

export const startProgress = () => {
  return {
    type: analysisInfoActionTypes.START_PROGRESS,
  };
};

export const stopProgress = () => {
  return {
    type: analysisInfoActionTypes.STOP_PROGRESS,
  };
};

export const onConfirmAnalysis = (formValue, data) => {
  return async (dispatch) => {
    try {
      await putApiCallback(getAnalysisResultUrl(data.id), formValue);
      dispatch(closeModal());
    } catch (error) {
      console.log(error.message);
    }
  };
};


