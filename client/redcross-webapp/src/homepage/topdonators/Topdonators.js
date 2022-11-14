import './Topdonators.css'
import Topdonorslider from './donors/Topdonorslider';


const Topdonators = () => {
    return (
        <div>
            <div className="topdonatorcontainer">
                <p className="topdonatorheading">Topdonators</p>
                <div className="Topdonators">
                    <Topdonorslider />  
                </div>
            </div>
            
        </div>
                
    );
}

export default Topdonators;