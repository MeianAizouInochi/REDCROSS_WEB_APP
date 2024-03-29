import "./tieupspage.css"
import { Tieupsdata } from "./tieupsdata";
import {useEffect} from 'react';

const Tieupspage = () => {
    useEffect(()=>{ window.scrollTo(0,0)},[]);
    return (
        <div className="tieupspagecontainer">
            <div className="tieupsheading">
                <p>Our Tieups
                    <hr/>
                </p>
            </div>
            <div className="tieupspagecardscontainer">
                {Tieupsdata.map((slide, index) => {
                    return (
                        <div className="tieupcard" key={index} >
                            <img src={slide.image} className="tieupimage"></img>

                            <p className="tieupname">{slide.name}</p>

                            <p className="tieupdescription">{slide.description}</p>
                        </div>
                    );
                })}
            </div>
        </div>
        )
}

export default Tieupspage;