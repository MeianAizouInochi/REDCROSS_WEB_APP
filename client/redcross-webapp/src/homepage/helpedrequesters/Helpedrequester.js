import './Helpedrequester.css'
// import {useState} from 'react'
import CountUp from './CountUp/CountUp'
import Typewriter from "typewriter-effect";


const Helpedrequester = () => {

       
    return (
        <div>
            <div className="helpedrequestercointainer">
                <p className="helpedrequesterheading">Helped Requesters</p>
                <div className="Helpedrequester">
                    <div className="Helpedrequester-header">
                        <CountUp end={195} />
                    </div>
                    {/* <p>“If you’re in the luckiest one percent of humanity, you owe it to the rest of humanity to think about the other 99 percent.</p> */}
                    <div className='quote'>
                        
                      <Typewriter options={{
                        loop: true,
                        autoStart: true,
                            strings: ['If you’re in the luckiest one percent of humanity, you owe it to the rest of humanity to think about the other 99 percent...!', 'Happiness doesn’t result from what we get, but from what we give...!', 'If you’re not making someone else’s life better, then you’re wasting your time. Your life will become better by making other lives better...!']
                      }}/>
                    </div>
                    {/* <img width="100%" src="https://readme-typing-svg.herokuapp.com?size=30&duration=5900&color=000000&multiline=true&lines= QUOTE; “No act of kindness, no matter how small, is ever wasted.; “There is no better exercise for your heart than reaching down and helping to lift someone up. & ](https://git.io/typing-svg)"></img> */}
                    

                </div>
            </div>
        </div>
                
    );
}

export default Helpedrequester;
