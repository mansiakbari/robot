import { analysisActionTypes } from "../constants/analysis";

const initState = {
  isLoading: false,
  isError: null,
  pendingAnalysis: null,
  processedAnalysis: null,
  isCheckpointLoading: false,
  isCheckpointError: null,
};

const robotsAnalysis = (state = initState, action) => {
  switch (action.type) {
    case analysisActionTypes.GET_ROBOTS_ANALYSIS_LOADING:
      return {
        ...state,
        isLoading: true,
        isError: null,
      };
    case analysisActionTypes.GET_ROBOTS_ANALYSIS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: null,
        pendingAnalysis: action.pendingAnalysis,
        processedAnalysis: action.processedAnalysis,
      };
    case analysisActionTypes.GET_ROBOTS_ANALYSIS_FAILED:
      return {
        ...state,
        isLoading: false,
        isError: action.err,
      };
    case analysisActionTypes.UPDATE_CHECKPOINT_LOADING:
      return {
        ...state,
        isCheckpointLoading: true,
        isCheckpointError: null,
      };
    case analysisActionTypes.UPDATE_CHECKPOINT_DATA:
      const analysis = action.isProcessed
        ? Object.assign(state.processedAnalysis)
        : Object.assign(state.pendingAnalysis);
      const index = analysis.findIndex(
        (data) => data.measurement_id === action.measurement_id
      );
      analysis[index].checkpoint_type = action.checkpoint_type;
      return {
        ...state,
        isCheckpointLoading: false,
        isCheckpointError: null,
        ...(action.isProcessed && {
          processedAnalysis: analysis,
        }),
        ...(!action.isProcessed && {
          pendingAnalysis: analysis,
        }),
      };

    case analysisActionTypes.UPDATE_CHECKPOINT_FAILED:
      return {
        ...state,
        isCheckpointLoading: false,
        isCheckpointError: action.error,
      };

    case analysisActionTypes.SET_SUCCESS_RESULT:
      if (action.measurement_id) {
        const index = state.pendingAnalysis.findIndex(
          (robot) => robot.measurement_id === action.measurement_id
        );
        if (index !== -1) {
          state.pendingAnalysis[index].processed = true;
        }
      }
      return {
        state,
      };
    default:
      return state;
  }
};

export default robotsAnalysis;
