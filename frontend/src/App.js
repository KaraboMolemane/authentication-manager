import 'devextreme/dist/css/dx.light.css';
import "./App.css";
import { Route, Routes } from 'react-router-dom';
import Landing from "./components/Landing";
import Repo from "./components/Repo"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Landing />} />
        <Route path="/repo" element={<Repo />} />
      </Routes>
    </div>
  );
}

export default App;
