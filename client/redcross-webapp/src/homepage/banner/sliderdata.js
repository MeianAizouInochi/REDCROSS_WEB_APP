import Axios from 'axios';

import DbURL from "../../domainconfig";


//VARIABLES 
//NO OF SLIDES IN CRAOUSAL
var LengthOfData = 0;

var sliderdata = [];

const requiredURL = DbURL + "/api/admin/getCarouseldata";

/*------------------------------------------MAIN FUNCTION START---------------------------------------------------- */
export async function Carousal() {

    await GetCarouselItemCount();

    sliderdata = [];

    await GetCarousalData();

    console.log("slider data finalized data " + sliderdata)

    //FUNCTION RETURNS THE ARRAY OF OBJECTS 
    return new Promise((resolve) => {
        resolve(sliderdata);
    })

};
/*------------------------------------------MAIN FUNCTION ENDS---------------------------------------------------- */

//THIS FUNCTION GETS THE AMOUNT OF CRAOUSAL IMAGES AVAILABLE
async function GetCarouselItemCount() {

    const response = await Axios.post(requiredURL, {

        SEMA: 0,

        ID: 0,

        RequiredItem: 'ITEMS'

    }, { withCredentials: true });

    if (response.data.recordset.length === 0) {

        console.log("Something Bad Happened!");

    }
    else if (response.data.recordset.length === 1) {

        LengthOfData = response.data.recordset[0].ITEMS;

    }
    else {

        console.log("Duplicacy error! in db.");

    }
}

//THIS FUNCTION GETS THE IMAGES 
async function GetCarousalData() {

    if (LengthOfData !== 0) {

        for (let i = 1; i <= LengthOfData; i++) {

            const Carouseldata = await Axios.post(requiredURL, {

                ID: i,
                RequiredItem: '*',
                SEMA: 0

            });

            if (Carouseldata.data.recordset.length === 0) {

                console.log("Something Bad Happened!");

            }
            else if (Carouseldata.data.recordset.length === 1) {
                const picture = await btoa(String.fromCharCode(...new Uint8Array(Carouseldata.data.recordset[0].PICTURE.data)));

                const Description = Carouseldata.data.recordset[0].INFO;

                //here appending in slider data , PUTTING DATA INTO DATA STRUCTURE 
                sliderdata.push(
                    {
                        image: `data:image/*;base64,${picture}`,
                        description: Description
                    })

            }
            else {
                console.log("Duplicacy error! in db.");

            }

        }

    }

}