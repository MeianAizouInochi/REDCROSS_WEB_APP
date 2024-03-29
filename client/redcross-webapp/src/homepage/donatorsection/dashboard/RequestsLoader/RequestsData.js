import { useEffect, useState } from "react";
import Axios from "axios";
import DbURL from "../../../../domainconfig";

export async function Request_Data() {

    var Total_Requests = [];

    var responsedata = await Axios.post(DbURL + "/api/getrequests", {
    });

    const size = responsedata.data.recordset.length;

    for (var i = 0; i < size; i++) {
        Total_Requests.push(responsedata.data.recordset[i].TABLE_NAME);
    }

    console.log("TOTAL Requests list :" + Total_Requests);

    return new Promise((resolve) => {
        resolve(Total_Requests)
    })
}