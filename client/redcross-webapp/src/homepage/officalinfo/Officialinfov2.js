import './Officialinfov2.css'
import { officalinfodata } from './officalinfodata';


const Officialinfo = () => {


    return (
        <div>
            <div className="OFFICIALINFO">

                <div className="heading">

                    <p className="OFFICIALINFOheading">Redcross Mohali officals</p>

                    <hr className="officalinfohorizontalline" />

                </div>

                <div className="officalcardcontainer">

                        {
                        officalinfodata.map((slide, index) => {
                            return (
                                // <Slider {...settings}>
                                <div className="officalcardsubcontainer" key={ index} >
                                        <img src={slide.image} className="officalimage"></img>

                                        <p className="officalname">{slide.name}</p>

                                        <p className="officaldescription">{slide.description}</p>
                                    </div>
                                    //  </Slider>
                                )
                            })
                        }

                </div>
            </div>
        </div>


    );




}
export default Officialinfo;