import analysisInfoActionTypes from "../constants/analysisInfo";

const initState = {
  checkpoint: null,
  analysisId: -1,
  analysisInfo: {},
  isProgress: false,
  onConfirm: {},
  onInconclusiveSubmit: "",
  isGetResultsLoading: false,
  isGetResultsError: null,
  currentAnalysisResult: {},
};

const analysisInfo = (state = initState, action) => {
  switch (action.type) {
    case analysisInfoActionTypes.GET_CHECKPOINT_DATA:
      return {
        ...state,
        checkpoint: action.checkpointData.data,
      };
    case analysisInfoActionTypes.GET_ANALYSIS_INFO:
      return {
        ...state,
        analysisId: action.analysisInfo.measurement_id,
        analysisInfo: action.analysisInfo,
      };
    case analysisInfoActionTypes.RESET_ANALYSIS_INFO:
      return {
        ...state,
        analysisId: -1,
        analysisInfo: {},
      };
    case analysisInfoActionTypes.START_PROGRESS:
      return {
        ...state,
        isProgress: true,
      };
    case analysisInfoActionTypes.STOP_PROGRESS:
      return {
        ...state,
        isProgress: false,
      };
    case analysisInfoActionTypes.CONFIRM_ANALYSIS:
      return {
        ...state,
        onConfirm: action.analysisData,
      };
    case analysisInfoActionTypes.CONFIRM_INCONCLUSIVE:
      return {
        ...state,
        onInconclusiveSubmit: action.inconclusiveData,
      };
    case analysisInfoActionTypes.GET_ANALYSIS_RESULT_LOADING:
      return {
        ...state,
        isGetResultsLoading: true,
        isGetResultsError: null,
      };
    case analysisInfoActionTypes.GET_ANALYSIS_RESULT_SUCCESS:
      return {
        ...state,
        currentAnalysisResult: action.data,
        isGetResultsLoading: false,
        isGetResultsError: null,
      };
    case analysisInfoActionTypes.GET_ANALYSIS_RESULT_FAILED:
      return {
        ...state,
        isGetResultsLoading: false,
        isGetResultsError: action.error,
      };

    default:
      return state;
  }
};

export default analysisInfo;
