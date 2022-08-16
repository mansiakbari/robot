import { applyMiddleware, createStore } from "redux";
import logger from "redux-logger";
import reducers from "./reducers";

import thunk from "redux-thunk";

const configureStore = () => {
  const store = createStore(reducers, applyMiddleware(logger, thunk));
  return store;
};
export default configureStore;
