/*
 * START OF NODEJS SERVER APP
 */

/*--------------------------------------------------INITIALISING MODULES START------------------------------------------------------------*/
require('dotenv').config();

const express = require('express');

const bodyParser = require('body-parser');

const app = express();

const mssql = require('mssql');

const cors = require('cors');

const session = require('express-session');

const cookieParser = require('cookie-parser');
/*--------------------------------------------------INITIALISING MODULES END------------------------------------------------------------*/

/*----------------------------------------------DATABASE CONFIGURATION SECTION START---------------------------------------------------------- */

/*
 * db_admin_web_asset CONTAINS CONFIG FOR ADMIN DATABASE.
 */
const db_admin_web_asset = {

    user: process.env.user,

    password: process.env.password,

    server: process.env.server,

    database: process.env.ADMINdatabase,

    options: {

        trustedConnection: true,
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true

    }
};

/*
 * db_config_for_userinfo CONTAINS CONFIG FOR USER INFORMATION DATABASE.
 */
const db_config_for_userinfo =
{
    user: process.env.user,

    password: process.env.password,

    server: process.env.server, 

    database: process.env.USERINFOdatabase,

    options:
    {
        trustedConnection: true,
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true
    }

};

/*
 * db_config_for_userinfo_filetype CONTAINS CONFIG FOR USER INFORMATION FILE TYPE DATABASE.
 */
const db_config_for_userinfo_filetype =
{
    user: process.env.user,

    password: process.env.password,

    server: process.env.server,

    database: process.env.USERINFOFILETYPEdatabase,

    options:
    {
        trustedConnection: true,
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true
    }

};
/*----------------------------------------------DATABASE CONFIGURATION SECTION END---------------------------------------------------------- */


/*
 *json data readability
 */
app.use(express.json({ limit: '10mb' }));

/*
 * CROSS ORIGIN RESOURCE SHARING POLICY SETUP.
 * ORIGIN SHOULD CONTAIN DOMAIN NAME LATER ON.
 */
app.use(cors({
    credentials: true,
    origin: process.env.DOMAIN,
    methods:["GET","POST"]
}));

/*
 *USING COOKIEPARSER FOR COOKIE
 */
app.use(cookieParser());

/*
 *USING BODYPARSER FOR BODY
 */
app.use(bodyParser.urlencoded({ extended: true }));

/*
 *USING EXPRESS_SESSION MODULE HERE, TO CREATE SESSION WHEN A LOG IN OCCURS.
 *CHANGE msxAge for TIME LIMIT OF EXPIRATION OF SESSION (TIME A PERSON CAN REMAIN LOGGED IN, UNIT IS MILLISECONDS.)
 */
app.use(session({
    secret: "somesecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000,
        secure: false
    }
}));


/*-------------------------------------------------------------------------------------------LOGIN SECTION------------------------------------------------------------------------------------------------------*/
/*
 * GET REQUEST FOR SESSION CHECK.
 */
app.get("/api/user/login", (req, res) => {

    console.log(req.session);
    
    if (req.session.user) {

        res.send({ LoginStatus: true, user: req.session.user });
    }
    else
    {
        res.send({ LoginStatus: false });
    }

});

/*
 * LOGOUT PORTION.
 * 
 */
app.get("/api/user/logout", (req, res) => {

    req.session.destroy((err) => {

        if (err)
        {
            console.log("ERROR MESSAGE: ERROR IN DESTROYING SESSION: " + err);
        }

        res.clearCookie("connect.sid");

        res.send({ LoginStatus: false });

        console.log("LOGGED OUT!");
    });
});

/*
 * POST TYPE LOGIN
 */
app.post("/api/user/Login", (req, res) => {

    var Username = req.body.username;

    var password = req.body.password;

    var Connection = new mssql.ConnectionPool(db_config_for_userinfo);

    var sqlstatement = "select DETAILS from " + Username + " where DETAILS_TYPE = 'PASSWORD';";

    Connection.connect(function (error)
    {
        if (error)
        {
            console.log("ERROR MESSAGE: (LOGIN QUERY CONNECTION ERROR) : " + error);
        }
        else
        {
            var request = new mssql.Request(Connection);

            request.query(sqlstatement, (err, result) => {

                if (err) {

                    console.log("ERROR MESSAGE: (LOGIN SQLSTATEMENT QUERY REQUEST ERROR) : " + err);
                }
                else
                {
                    if (password == result.recordset[0].DETAILS)
                    {
                        req.session.user = Username;

                        console.log("INSIDE CONNECTION: "+req.session);

                        var newResultToSend = { LoginStatus: true };

                        res.send(newResultToSend);
                    }
                    else
                    {
                        var newResultToSend = { LoginStatus: false };

                        res.send(newResultToSend)
                    }
                }
                Connection.close();
               
            });
        }
    });
});
/*----------------------------------------------------------------------------------LOGIN SECTION END------------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------ADMIN SECTION START---------------------------------------------------------------------------------*/

/*-------------------------------------------------LOGO REQUEST SECTION START.-------------------------------------------------*/
app.post("/api/admin/getdblogo", (req, res) => {

    var Connection = new mssql.ConnectionPool(db_admin_web_asset);

    var sqlstatement = "select PICTURE from Web_asset_Logo where ID = 1;"

    Connection.connect(function (error) {

        if (error) {

            console.log(error.message);

        }
        else {

            var request = new mssql.Request(Connection);

            request.query(sqlstatement, (err, result) => {

                if (err) {

                    console.log(err.message);

                } else {

                    res.send(result);

                }

                Connection.close();
            });
        }
    });
});
/*-------------------------------------------------LOGO REQUEST SECTION END.-------------------------------------------------*/

/*-------------------------------------------------LOGO UPDATE SECTION START.-------------------------------------------------*/
app.post("/api/admin/logoupdate", (req, res) => {

    var sqlstatement = [
        "INSERT INTO Web_asset_Logo(ID,PICTURE) values(1,@bytearraylogopic);",
        "update Web_asset_Logo SET PICTURE = @bytearraylogopic where ID=1"
    ];

    const RequestId = req.body.RequestId;

    const LogoImage = req.body.LogoImage;

    var binarydataoflogo = new Buffer.from(LogoImage, "binary");

    var Connection = new mssql.ConnectionPool(db_admin_web_asset);

    Connection.connect(function (error) {

        if (error) {

            console.log(error.message);

        }
        else {

            const preparedstatement = new mssql.PreparedStatement(Connection);

            preparedstatement.input("bytearraylogopic", mssql.VarBinary);

            preparedstatement.prepare(sqlstatement[RequestId], function (err) {

                if (err) {

                    console.log(err.message);

                }
                else {

                    preparedstatement.execute({ bytearraylogopic: binarydataoflogo }, (Error, Result) => {

                        if (Error) {

                            console.log(Error);

                        }
                        else {

                            res.send(Result);

                        }

                        preparedstatement.unprepare(errors => {
                            
                            if (errors) {

                                console.log(errors.message);

                            }
                        });

                        Connection.close();
                    });
                }
            });
        }
    });
});
/*-------------------------------------------------LOGO UPDATE SECTION END.-------------------------------------------------*/

/*-------------------------------------------------CAROUSEL REQUEST SECTION START.-------------------------------------------------*/
app.post("/api/admin/getCarouseldata", (req, res) => {

    /*
     * can retrieve carousel image from entity, 
     * can change number of items for each image in entity
     * */

    const ID = req.body.ID;

    const RequiredItem = req.body.RequiredItem;

    const SEMA = req.body.SEMA;

    const sqlstatements = [
        "select " + RequiredItem + " from Web_asset_Carousel where ID = " + ID,
        "update Web_asset_Carousel set ITEMS = " + RequiredItem + " where ID = " + ID
    ];

    var Connection = new mssql.ConnectionPool(db_admin_web_asset);

    Connection.connect(function (error) {


        if (error) {

            console.log(error.message);

        }
        else {

            var request = new mssql.Request(Connection);

            request.query(sqlstatements[SEMA], (err, result) => {

                if (err) {

                    console.log(err.message);

                }
                else {

                    res.send(result);

                }
                Connection.close();

            });
        }
    });
});
/*-------------------------------------------------CAROUSEL REQUEST SECTION END.-------------------------------------------------*/

/*-------------------------------------------------CAROUSEL UPDATE SECTION START.-------------------------------------------------*/
app.post("/api/admin/CarouselUpdate", (req, res) => {

    const ID = req.body.ID;

    const SEMA = req.body.SEMA;

    const RequiredItem = req.body.RequiredItem;

    const INFO = req.body.INFO;

    const PICTURE = req.body.PICTURE;

    const PictureVarBinary = new Buffer.from(PICTURE, 'binary');

    const sqlstatements = [
        "insert into Web_asset_Carousel(ID,INFO,PICTURE,ITEMS) values(" + ID + ",'" + INFO + "', @PictureByteArray , " + RequiredItem + ");",
        "update Web_asset_Carousel set PICTURE = @PictureByteArray , INFO = '" + INFO + "where ID = " + ID
    ];

    var Connection = new mssql.ConnectionPool(db_admin_web_asset);

    Connection.connect(function (error) {

        if (error) {

            console.log(error.message);

        } else {

            var preparedstatement = new mssql.PreparedStatement(Connection);

            preparedstatement.input("PictureByteArray", mssql.VarBinary);

            preparedstatement.prepare(sqlstatements[SEMA], function (err) {

                if (err) {

                    console.log(err.message);

                }
                else {

                    preparedstatement.execute({ PictureByteArray: PictureVarBinary }, (Error, result) => {

                        if (Error) {

                            console.log(Error.message);

                        } else {

                            res.send(result);

                        }
                        preparedstatement.unprepare(Errors => {

                            if (Errors) {

                                console.log(Err.message);

                            }

                        });

                        Connection.close();
                    });
                }
            });
        }
    });
});
/*-------------------------------------------------CAROUSEL UPDATE SECTION END.-------------------------------------------------*/

/*--------------------------------------------------------------------------------ADMIN SECTION END---------------------------------------------------------------------------------*/


/*--------------------------------------------------------------------------------REQUESTER SECTION START---------------------------------------------------------------------------------*/

/*-------------------------------------------------CREATE REQUEST ENTITY SECTION START.-------------------------------------------------*/
app.post("/api/CreateRequestEntity", (req, res) => {

    const VerifiedUsername = req.body.VerifiedUsername;

    const Type = req.body.Type;

    const sqlstatement = "create table REQUEST_" + Type + "_" + VerifiedUsername + "(DETAILS_TYPE varchar(255),DETAILS_DESCRIPTION varchar(255),DETAILS varchar(255),FILE_DETAILS varbinary(MAX));";

    const Connection = new mssql.ConnectionPool(db_config_for_userinfo_filetype);

    Connection.connect(function (error) {

        if (error) {

            console.log(error.message);

        }
        else {

            const request = new mssql.Request(Connection);

            request.query(sqlstatement, function (err, result) {

                if (err) {

                    console.log(err.message);

                }
                else {

                    res.send(result);

                }

                Connection.close();
            });
        }
    });
});
/*-------------------------------------------------CREATE REQUEST ENTITY SECTION END.-------------------------------------------------*/

/*-------------------------------------------------SEND REQUEST DATA TO ENTITY SECTION START.-------------------------------------------------*/
app.post("/api/SendRequestData", (req, res) => {//check line 184 in requester form .

    const Type = req.body.Type;

    const VerifiedUsername = req.body.VerifiedUsername;

    const DETAILS_TYPE = req.body.DETAILS_TYPE;

    const DETAILS_DESCRIPTION = req.body.DETAILS_DESCRIPTION;

    const DETAILS = req.body.DETAILS;

    const FILE_DETAILS = req.body.FILE_DETAILS;

    const FILE_DETAILS_DATA_FINAL = FILE_DETAILS === null ? null : new Buffer.from(FILE_DETAILS, 'binary');

    const REQUEST_ID = req.body.REQUEST_ID;

    const sqlstatements = [
        "insert into REQUEST_" + Type + "_" + VerifiedUsername + "(DETAILS_TYPE,DETAILS_DESCRIPTION,DETAILS,FILE_DETAILS) values(@DETAILS_TYPE_DATA,@DETAILS_DESCRIPTION_DATA,@DETAILS_DATA,@FILE_DETAILS_DATA);"
    ];


    const Connection = new mssql.ConnectionPool(db_config_for_userinfo_filetype);

    Connection.connect(function (error) {

        if (error) {

            console.log(error.message);

        }
        else {

            const preparestatement = new mssql.PreparedStatement(Connection);

            preparestatement.input('DETAILS_TYPE_DATA', mssql.VarChar(255));

            preparestatement.input('DETAILS_DESCRIPTION_DATA', mssql.VarChar(255));

            preparestatement.input('DETAILS_DATA', mssql.VarChar(255));

            preparestatement.input('FILE_DETAILS_DATA', mssql.VarBinary(mssql.MAX));

            preparestatement.prepare(sqlstatements[REQUEST_ID], function (Error) {

                if (Error) {

                    console.log(Error);

                }
                else {

                    preparestatement.execute({ DETAILS_TYPE_DATA: DETAILS_TYPE, DETAILS_DESCRIPTION_DATA: DETAILS_DESCRIPTION, DETAILS_DATA: DETAILS, FILE_DETAILS_DATA: FILE_DETAILS_DATA_FINAL }, (err, result) => {

                        if (err) {

                            console.log(err);

                        }
                        else {

                            res.send(result);

                        }

                        preparestatement.unprepare();

                        Connection.close();

                    });

                }

            })

        }
    })
});
/*-------------------------------------------------SEND REQUEST DATA TO ENTITY SECTION END.-------------------------------------------------*/

/*-----------------------------------------------------GET ACTIVE REQUEST DATA SECTION------------------------------------------------------*/
app.post("/api/GetActiveRequests", (req, res) => {

    var FullUserName = req.body.FullUsername;

    SQLStatement = "select TABLE_NAME from INFORMATION_SCHEMA.TABLES where TABLE_NAME like 'REQUEST[_]%[_]" + FullUserName + "'";

    var connection = new mssql.ConnectionPool(db_config_for_userinfo_filetype);

    connection.connect(function (err) {
        if (err) {
            console.log(err);
        }
        else
        {
            var request = new mssql.Request(connection);

            request.query(SQLStatement, (err, result) => {

                if (err)
                {
                    console.log(err);
                }
                else
                {
                    res.send(result);
                }

                connection.close();
            });
        }
    });
});
/*-----------------------------------------------------GET ACTIVE REQUEST DATA SECTION------------------------------------------------------*/

/*--------------------------------------------------------------------------------REQUESTER SECTION END---------------------------------------------------------------------------------*/




/*--------------------------------------------------------------------------------DONATOR SECTION START---------------------------------------------------------------------------------*/

/*-------------------------------------------------GET REQUESTS START.-------------------------------------------------*/
app.post("/api/getrequests", (req, res) => {

    var SQLStatement = "select TABLE_NAME from INFORMATION_SCHEMA.TABLES where TABLE_NAME like 'REQUEST[_]%';";

    var Connection = new mssql.ConnectionPool(db_config_for_userinfo_filetype);

    Connection.connect(function (error) {

        if (error) {

            console.log(error.message);

        }
        else {

            var request = new mssql.Request(Connection);

            request.query(SQLStatement, function (err, result) {

                if (err) {

                    console.log(err.message);

                }
                else {

                    res.send(result);

                }
                Connection.close();
            });
        }
    });
});

/*-------------------------------------------------GET REQUESTS END.-------------------------------------------------*/

/*-------------------------------------------------GET REQUESTS DETAILS START.-------------------------------------------------*/
app.post("/api/getrequestdetails", (req, res) => {

    const TABLE_NAME = req.body.TABLE_NAME;

    const DETAIL_TYPE = req.body.DETAIL_TYPE;

    const SEMA = req.body.SEMA;

    console.log("TABLE :" + TABLE_NAME);
    console.log("DETAILS TYPE :" + DETAIL_TYPE);
    console.log("SEMA :" + SEMA);

    var SQLStatement = [
        "select DETAILS from " + TABLE_NAME + " where DETAILS_TYPE like '" + DETAIL_TYPE[0] + "%';",
        "select DETAILS,FILE_DETAILS from " + TABLE_NAME + " where DETAILS_TYPE = '" + DETAIL_TYPE + "';",
        "select DETAILS_DESCRIPTION from " + TABLE_NAME + " where DETAILS_TYPE = 'Request_data';"
    ];

    var Connection = new mssql.ConnectionPool(db_config_for_userinfo_filetype);

    Connection.connect(function (error) {

        if (error) {

            console.log(error.message);

        }
        else {

            var request = new mssql.Request(Connection);

            request.query(SQLStatement[SEMA], function (err, result) {

                if (err) {

                    console.log(err.message);

                }
                else {
                    console.log("API CALL REQUEST DETAILS :" + result);
                    res.send(result);

                }
                Connection.close();
            });
        }
    });
});
/*-------------------------------------------------GET REQUESTS DETAILS END.-------------------------------------------------*/



/*--------------------------------------------------------------------------------DONATOR SECTION END---------------------------------------------------------------------------------*/




/*--------------------------------------------------------------------------------GENERALIZED SECTION START---------------------------------------------------------------------------------*/

/*-------------------------------------------------CREATE USER ENTITY SECTION START.-------------------------------------------------*/
app.post("/api/newuser", (req, res) => {

    const verifiedusername = req.body.verifiedusername;

    var SQLStatement = "create table " + verifiedusername + "(DETAILS_TYPE varchar(255),DETAILS varchar(255),CONFIRMATION varchar(255));"

    var Connection = new mssql.ConnectionPool(db_config_for_userinfo);

    Connection.connect(function (error) {

        if (error) {

            console.log(error.message);

        }
        else {

            var request = new mssql.Request(Connection);

            request.query(SQLStatement, function (err, result) {

                if (err) {

                    console.log(err.message);

                }
                else {
                    res.send(result);
                }
                Connection.close();
            });

        }

    });

});
/*-------------------------------------------------CREATE USER ENTITY SECTION END.-------------------------------------------------*/

/*-------------------------------------------------SEND USER DATA TO ENTITY SECTION START.-------------------------------------------------*/
app.post("/api/newuserinfo", (req, res) => {

    const verifiedusername = req.body.verifiedusername;

    const DETAILS_TYPE = req.body.DETAILS_TYPE;

    const DETAILS = req.body.DETAILS;

    const CONFIRMATION = req.body.CONFIRMATION;

    var SQLStatement = "insert into " + verifiedusername + "(DETAILS_TYPE, DETAILS, CONFIRMATION) values('" + DETAILS_TYPE + "','" + DETAILS + "','" + CONFIRMATION + "');"

    var Connection = new mssql.ConnectionPool(db_config_for_userinfo);

    Connection.connect(function (error) {

        if (error) {

            console.log(error.message);

        }
        else {

            var request = new mssql.Request(Connection);

            request.query(SQLStatement, function (err, result) {

                if (err) {

                    console.log(err.message);

                }
                else {

                    res.send(result);

                }
                Connection.close();
            });
        }
    });
});
/*-------------------------------------------------SEND USER DATA TO ENTITY SECTION END.-------------------------------------------------*/

/*-------------------------------------------------REQUEST USER DATA FROM ENTITY SECTION START.-------------------------------------------------*/
app.post("/api/getuserdata", (req, res) => {

    const verifiedusername = req.body.verifiedusername;

    var Connection = new mssql.ConnectionPool(db_config_for_userinfo);

    var sqlquerystatement = "select * from " + verifiedusername + ";"

    Connection.connect(function (error) {

        if (error) {

            console.log(error);
        }
        else {

            var request = new mssql.Request(Connection);

            request.query(sqlquerystatement, function (err, result) {

                if (err) {

                    console.log(err);
                }
                else {

                    res.send(result);

                }

                Connection.close();

            });
        }
    });
});
/*-------------------------------------------------REQUEST USER DATA FROM ENTITY SECTION END.-------------------------------------------------*/

/*-------------------------------------------------UPDATE USER DATA IN ENTITY SECTION START.-------------------------------------------------*/
app.post("/api/update", (req, res) => {

    const updatedata = req.body.updatedata;

    const verifiedusername = req.body.verifiedusername;

    const updatedatatype = req.body.updatedatatype;

    var Connection = new mssql.ConnectionPool(db_config_for_userinfo);

    var SQLstatement = "UPDATE " + verifiedusername + " SET DETAILS = '" + updatedata + "' WHERE DETAILS_TYPE = '" + updatedatatype + "';";

    Connection.connect(function (error) {

        if (error) {

            console.log(error.message);

        }
        else {

            var request = new mssql.Request(Connection);

            request.query(SQLstatement, function (err, result) {

                if (err) {

                    console.log(err.message);

                }
                else {

                    res.send(result);

                }

                Connection.close();
            });
        }
    });
});
/*-------------------------------------------------UPDATE USER DATA IN ENTITY SECTION END.-------------------------------------------------*/

/*-------------------------------------------------REQUESTING USER ATTRIBUTE DATA FROM ENTITY SECTION START.-------------------------------------------------*/
app.post("/api/checkvalidity", (req, res) => {//main use for this post request is for checking validity. 

    const verifiedusername = req.body.verifiedusername;

    const ValidityDETAILS_TYPE = req.body.ValidityDETAILS_TYPE;

    var Connection = new mssql.ConnectionPool(db_config_for_userinfo);

    var sqlinsert = "select DETAILS from " + verifiedusername + " where DETAILS_TYPE LIKE '" + ValidityDETAILS_TYPE + "'; ";

    Connection.connect(function (error) {

        if (error) {

            console.log(error.message);
        }
        else {

            var request = new mssql.Request(Connection);

            request.query(sqlinsert, function (err, result) {

                if (err) {
                    console.log(err.message);
                }
                else {
                    res.send(result);
                }

                Connection.close();

            });
        }
    });
});
/*-------------------------------------------------REQUESTING USER ATTRIBUTE DATA FROM ENTITY SECTION END.-------------------------------------------------*/

/*-------------------------------------------------REQUESTING USER CHAT ATTRIBUTE DATA FROM ENTITY SECTION START.-------------------------------------------------*/
app.post("/api/getuserchatdata", (req, res) => {

    const verifiedusername = req.body.verifiedusername;

    var Connection = new mssql.ConnectionPool(db_config_for_userinfo);

    const sqlchatdataquery = "select DETAILS from " + verifiedusername + " where DETAILS_TYPE like 'CHAT_%';"

    Connection.connect(function (error) {

        if (error) {

            console.log(error);

        }
        else {

            var request = new mssql.Request(Connection);

            request.query(sqlchatdataquery, function (err, result) {

                if (err) {

                    console.log(err);
                }
                else {

                    res.send(result);
                }

                Connection.close();

            });
        }
    });
});
/*-------------------------------------------------REQUESTING USER CHAT ATTRIBUTE DATA FROM ENTITY SECTION END.-------------------------------------------------*/


/*---------------------------------------CHECKING CHAT FOR USER GENERALIZED START------------------------------------- */
app.post("/api/checkchats", (req, res) => {//USING THIS FOR CHECKING CHATS 

    const TABELNAME = req.body.TABELNAME;

    const TYPE_OF_REQUEST = req.body.TYPE_OF_REQUEST;

    const SEMA = req.body.SEMA;

    var Connection = new mssql.ConnectionPool(db_config_for_userinfo);

    var sqlinsert = [
        "select DETAILS from " + TABELNAME + " where DETAILS_TYPE LIKE '" + "CHAT_" + "%';",
        "select DETAILS_TYPE from " + TABELNAME + " where DETAILS_TYPE='" + TYPE_OF_REQUEST + "';",
        "select DETAILS from " + TABELNAME + " where DETAILS_TYPE LIKE '" + "CHAT_" + TYPE_OF_REQUEST + "%';"
    ];

    Connection.connect(function (error) {

        if (error) {

            console.log(error.message);
        }
        else {

            var request = new mssql.Request(Connection);

            request.query(sqlinsert[SEMA], function (err, result) {

                if (err) {
                    console.log(err.message);
                }
                else {

                    res.send(result);
                }

                Connection.close();

            });
        }
    });
});
/*---------------------------------------CHECKING CHAT FOR USER GENERALIZED END------------------------------------- */


/*-------------------------------------------------CREATE USER PROFILE PIC ENTITY SECTION START.-------------------------------------------------*/
app.post("/api/newuserdata", (req, res) => {

    const verifiedusername = req.body.verifiedusername;

    var SQLStatement = "create table " + verifiedusername + "(DETAILS_TYPE varchar(255),DETAILS varbinary(MAX),CONFIRMATION varchar(255));"

    var Connection = new mssql.ConnectionPool(db_config_for_userinfo_filetype);

    Connection.connect(function (error) {

        if (error) {

            console.log(error.message);

        }
        else {

            var request = new mssql.Request(Connection);

            request.query(SQLStatement, function (err, result) {

                if (err) {

                    console.log(err.message);

                }
                else {

                    res.send(result);

                }
                Connection.close();
            });
        }
    });
});
/*-------------------------------------------------CREATE USER PROFILE PIC ENTITY SECTION END.-------------------------------------------------*/

/*-------------------------------------------------SEND USER PROFILE PIC DATA TO ENTITY SECTION START.-------------------------------------------------*/
app.post("/api/sendprofilepicdata", (req, res) => {

    const profilepic = req.body.Profilepicdata;

    const verifiedusername = req.body.verifiedusername;

    var binarydata = new Buffer.from(profilepic, 'binary');

    var Connection = new mssql.ConnectionPool(db_config_for_userinfo_filetype);

    Connection.connect(function (error) {

        if (error) {

            console.log(error.message);

        }
        else {

            const preparedstatement = new mssql.PreparedStatement(Connection);

            preparedstatement.input('bytearray', mssql.VarBinary);

            preparedstatement.prepare("INSERT INTO " + verifiedusername + "(DETAILS_TYPE,DETAILS,CONFIRMATION) values('PROFILEPIC', @bytearray,'1' )", function (err) {

                if (err) {

                    console.log(err.message);

                }
                else {

                    preparedstatement.execute({ bytearray: binarydata }, (Error, result) => {

                        if (Error) {

                            console.log(Error.message + " line 313");

                        }
                        else {

                            res.send(result);
                        }

                        preparedstatement.unprepare(errors => {

                            if (errors) {

                                console.log(errors.message);

                            }

                        });

                        Connection.close();

                    });
                }
            });
        }
    });
});
/*-------------------------------------------------SEND USER PROFILE PIC DATA TO ENTITY SECTION END.-------------------------------------------------*/

/*-------------------------------------------------REQUEST USER PROFILE PIC DATA FROM ENTITY SECTION START.-------------------------------------------------*/
app.post("/api/getuserimagedata", (req, res) => {

    const username = req.body.username;

    const sqlfiletypequery = "select DETAILS from " + username + " where DETAILS_TYPE = 'PROFILEPIC';"

    var Connection = new mssql.ConnectionPool(db_config_for_userinfo_filetype);

    Connection.connect(function (error) {

        if (error) {

            console.log(error.message);

        }
        else {

            var request = new mssql.Request(Connection);

            request.query(sqlfiletypequery, function (err, result) {

                if (err) {

                    console.log(err.message);

                }
                else {
                    res.send(result);

                }

                Connection.close();

            });
        }
    });
});
/*-------------------------------------------------REQUEST USER PROFILE PIC DATA FROM ENTITY SECTION END.-------------------------------------------------*/

/*-------------------------------------------------CHECK USER ENTITY EXISTENCE SECTION START.-------------------------------------------------*/
app.post("/api/checkuser", (req, res) => {

    const providedusername = req.body.providedusername;

    //console.log(providedusername);

    var Connection = new mssql.ConnectionPool(db_config_for_userinfo);

    var sqlinsert = "select TABLE_NAME from INFORMATION_SCHEMA.TABLES where TABLE_NAME LIKE '" + providedusername + "';";

    Connection.connect(function (error) {

        if (error) {

            console.log(error.message); //navigate to error page.
        }
        else {

            var request = new mssql.Request(Connection);

            request.query(sqlinsert, function (err, result) {

                if (err) {
                    console.log(err.message);
                }
                else {
                    //console.log(result);
                    res.send(result);
                }

                Connection.close();

            });
        }
    });
});
/*-------------------------------------------------CHECK USER ENTITY EXISTENCE SECTION END.-------------------------------------------------*/

/*--------------------------------------------------------------------------GENERALIZED SECTION END---------------------------------------------------------------------------------*/

//donatordashboard requesters lists start.
app.post("/api/GetRequests", (req, res) => {

    const Type = req.body.Type;

    sqlstatement = ["select TABLE_NAME from INFORMATION_SCHEMA.TABLES where TABLE_NAME LIKE 'REQUEST%'  ;"]

})
//donatordashboard requesters lists end.

app.listen(process.env.PORT, () => {
    console.log("running on port "+process.env.PORT);
});