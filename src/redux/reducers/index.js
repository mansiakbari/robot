import { combineReducers } from "redux";
import robotsAnalysis from "./analysis";
import analysisInfo from "./analysisInfo";
import modal from "./modal";
import changeNumber from "./incdec";

const reducers = combineReducers({
  robotsAnalysis,
  analysisInfo,
  modal,
  changeNumber,
});

export default reducers;
