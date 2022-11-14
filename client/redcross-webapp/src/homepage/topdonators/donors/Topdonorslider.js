import  React from "react";
import './Topdonorslider.css';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { donorsdata } from './topdonorsliderdata';


const Topdonorslider = () => {



    //const slidestopdonors = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
    // const slides = [{image:'LINK',title:"NAME"}];

    const slideLeft = () => {
        var slider = document.getElementById("slider");
        slider.scrollLeft = slider.scrollLeft - 200;
    }

    const slideRight = () => {
        var slider = document.getElementById("slider");
        slider.scrollLeft = slider.scrollLeft + 200;
    }


    return(
        <div id="main-slider-container">

            <MdChevronLeft size={40} className="slider-icon left" onClick={slideLeft} />

            <div id="slider">
                {
                    donorsdata.map((slide, index) => {

                        return (
                            // <Slider {...settings}>
                            <div className="slider-card" key={ index} >
                                <div className="slider-card-cointainer">
                                <img src={slide.image} className="slider-cards-image"></img>

                                    <p className="slider-card-title">{slide.name}</p>
                                    </div>
                             </div>
                            //  </Slider>
                        )
                    })
                }
            </div>
            
            <MdChevronRight size={40} className="slider-icon right" onClick={slideRight}/>
        </div>
    )
};

export default Topdonorslider;

