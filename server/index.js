
const express = require('express');

const bodyParser = require('body-parser');

const app = express();

const mssql = require('mssql');

const cors = require('cors');

const session = require('express-session');

const cookieParser = require('cookie-parser');

//DB configuration start.
const db_admin_web_asset = {

    user: "Redcross_officials",
    password: "123",
    server: "LAPTOP-S278V6HI",

    database: "RedCross_Web_Assets_Database",
    options: {

        trustedConnection: true,
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true

    }
};

const db_config_for_userinfo =
{
    user: "Redcross_officials",
    password: "123",
    server: "LAPTOP-S278V6HI", //LAPTOP-S278V6HI    //Kooustav's Laptop server
                               //LAPTOP-6E8JR0HD    //Jashandeep's laptop server
    database: "RedCross_Database",
    options:
    {
        trustedConnection: true,
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true
    }

};

const db_config_for_userinfo_filetype =
{
    user: "Redcross_officials",
    password: "123",
    server: "LAPTOP-S278V6HI", //LAPTOP-S278V6HI    //Kooustav's Laptop server
                               //LAPTOP-6E8JR0HD    //Jashandeep's laptop server
    database: "Redcross_Database_File_Type",
    options:
    {
        trustedConnection: true,
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true
    }

};
//DB configuration end.

//important connector and data translator uses start.

app.use(express.json({ limit: '10mb' }));



app.use(cors({
    credentials: true,
    origin: [
        `http://172.19.5.133:3000`,
        `http://192.168.183.110:3000`,
        `http://192.168.42.110:3000`,
        `http://192.168.124.110:3000`,
        `http://192.168.144.110:3000`,
        `http://172.19.2.121:3000`,
        `http://192.168.255.110:3000`,
        `http://192.168.212.110:3000`,
        `http://192.168.96.110:3000`
    ],
    methods:["GET","POST"]
}));

//app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    path: '/',
    secret: "somesecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000,
        secure: false
    }
}));


//important connector and data translator uses end.

/*-------------------------------------------------------------------------------------------LOGIN SECTION------------------------------------------------------------------------------------------------------*/
/*
 * GET REQUEST FOR SESSION CHECK.
 */
app.get("/", (req, res) => {

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
                console.log("BULLSHIT:"+req.session);
            });
        }
    });
    console.log("CHICKENSHIT:" + req.session);
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
app.post("/api/SendRequestData", (req, res) => {

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

/*--------------------------------------------------------------------------------REQUESTER SECTION END---------------------------------------------------------------------------------*/




/*--------------------------------------------------------------------------------DONATOR SECTION START---------------------------------------------------------------------------------*/



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

    const sqlchatdataquery = "select DETAILS from " + verifiedusername + " where DETAILS_TYPE = 'chat';"

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

app.listen(5000, () => {
    console.log("running on port 5000");
});