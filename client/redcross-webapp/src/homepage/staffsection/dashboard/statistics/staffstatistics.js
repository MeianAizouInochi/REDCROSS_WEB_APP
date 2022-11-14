import "./staffstatistics.css";

const Staffstatistics = () => {
    return (
        <div className="staffstatisticscontainer">
            <div className="staffstatisticscards">
                <p className="staffstatisticscardtext">Total no of user </p>
                <p className="staffstatisticscarddata">91823</p>
            </div>
            <div className="staffstatisticscards">
                <p className="staffstatisticscardtext">Total no of Donators </p>
                <p className="staffstatisticscarddata">25677</p>
            </div>
            <div className="staffstatisticscards">
                <p className="staffstatisticscardtext">Total no of Requesters </p>
                <p className="staffstatisticscarddata">71234</p>
            </div>
            <div className="staffstatisticscards">
                <p className="staffstatisticscardtext">Total no of active Requests </p>
                <p className="staffstatisticscarddata">3245</p>
            </div>
            <div className="staffstatisticscards">
                <p className="staffstatisticscardtext">Total no of Completed Requests </p>
                <p className="staffstatisticscarddata">10000</p>
            </div>
        </div>
        )
}
export default Staffstatistics;