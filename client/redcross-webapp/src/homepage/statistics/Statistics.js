import Helpedrequester from "../helpedrequesters/Helpedrequester";
import Topdonators from "../topdonators/Topdonators";
import "./Statistics.css"

const Statistics = () => {
    return (
        <div className="statisticscointainer">
            <div className="Helpedrequesterstatistics">
                    <Helpedrequester />
            </div>
            <div className="Topdonatorsstatistics">
                    <Topdonators />
                </div>
        </div>
                
    );
}

export default Statistics;