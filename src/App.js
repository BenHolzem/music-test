import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Home from './components/Home'
import Redirect from './components/Redirect'
import Dashboard from './components/Dashboard'
function App() {
  return (
    <div className="App">
     <Router>
        <Switch>
          <Route path="/redirect" component={Redirect} />
          <Route path="/play" component={Dashboard} />
          <Route path="/" component={Home}/>
        </Switch>
    </Router>
    </div>
  );}

export default App;

