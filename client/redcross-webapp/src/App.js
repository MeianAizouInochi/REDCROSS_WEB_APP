import './App.css';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Homepage from "./homepage/homepage";
import Staffpage from './homepage/staffsection/staffpage';

function App()
{
    //call your functions inside return.

    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/:username" element={<Homepage />} />
                    <Route path="/Staffsection/Staffpage" element={<Staffpage />} />
                </Routes>
            </Router>
        </div>
    );
    //please put all required function and js files along with their accompanying css in their respective folders.
    //all js file which need their own css file should have same name. Example: hello.js should have hello.css in its own folder.
}
export default App;
