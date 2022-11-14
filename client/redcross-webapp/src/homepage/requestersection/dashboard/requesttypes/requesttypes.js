import { requesttypedata } from './requesttypedata';

const Requesttype = (props) => {

    return (
            <div className="requesttypecontainer">

                    {
                        requesttypedata.map((slide, index) => {
                            return (
                                // <Slider {...settings}>
                                <div className="requesttypecard" key={index} >
                                    <img src={slide.image} className="requesttypeimage" onClick={(e) => { props.RequesterFormVisChanger(slide.name); } }></img>

                                    <p className="requesttypename">{slide.name}</p>
                                </div>
                                //  </Slider>
                            )
                        })
                    }

            </div>


    );




}
export default Requesttype;