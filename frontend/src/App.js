import 'devextreme/dist/css/dx.light.css';
import "./App.css";
import { Route, Routes } from 'react-router-dom';
import Landing from "./components/Landing";
import Repos from "./components/Repos";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Landing />} />
        <Route path="/repos" element={<Repos />} />
      </Routes>
    </div>
  );
}

export default App;
