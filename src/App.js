import { Route, Switch } from "react-router-dom";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import AnalysisInfo from "./containers/analysisInfo";
import AnalysisScreen from "./containers/analysisScreen";
import Data from "./Data";
function App() {
  return (
    <Switch>
      <Route exact path="/" component={AnalysisScreen} />
      <Route path="/analysis/:id" component={AnalysisInfo} />
      <Route path="/data" component={Data} />
    </Switch>
  );
}

export default App;
