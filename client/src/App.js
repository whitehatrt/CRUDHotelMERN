import { Hotels } from "./components/Hotels";
import { Rooms } from "./components/Rooms";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <div className="container mt-4">
          <Switch>
            <Route path="/add-rooms">
              <Rooms />
            </Route>
            <Route path="/">
              <Hotels />
            </Route>
          </Switch>
        </div>
      </Router>
    </>
  );
}

export default App;
