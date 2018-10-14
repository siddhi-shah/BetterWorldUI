'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var database = require('../../../../database/database');
var cors = require('cors');
var jwt = require('jsonwebtoken');
process.env.SECRET_KEY = "varunv";

var SocietyController = function SocietyController() {
    _classCallCheck(this, SocietyController);

    this.executeQuery = function (req, res) {
        var appData = {
            "error": 1,
            "data": "",
            "status": "",
            "dbResponse": "",
            "fields": ""
        };
        var query = req.body.query;
        console.log("query is " + query);
        database.connection.query(query, function (err, rows) {
            if (!err) {
                console.log("query executed successfully successfully " + JSON.stringify(rows));
                appData.error = 0;
                appData["status"] = "success!";
                appData["dbResponse"] = rows;
                res.status(201).json(appData);
            } else {
                console.log("Query Exception " + err);
                appData["data"] = "Error Occured!";
                res.status(400).json(err);
            }
        });
    };

    this.registerUser = function (req, res) {
        var today = new Date();
        var appData = {
            "error": 1,
            "data": ""
        };
        /*var userData = {
            "id": req.body.id,
            "first_name": req.body.first_name,
            "last_name": req.body.last_name,
            "email": req.body.email,
            "password": req.body.password,
            "phoneNumber": req.body.phoneNumber
        } */
        var userData = [req.body.email, req.body.first_name, req.body.last_name, req.body.password, req.body.phoneNumber];
        /*database.connection.getConnection(function(err, connection) {
            if (err) {
                appData["error"] = 1;
                appData["data"] = "Internal Server Error";
                res.status(500).json(appData);
            } else {
                connection.query('INSERT INTO users SET ?', userData, function(err, rows, fields) {
                    if (!err) {
                        appData.error = 0;
                        appData["data"] = "User registered successfully!";
                        res.status(201).json(appData);
                    } else {
                        appData["data"] = "Error Occured!";
                        res.status(400).json(err);
                    }
                });
                connection.release();
            }
        });*/
        database.connection.query('insert into users(email,first_name,last_name,password, phonenumber) values ($1, $2, $3, $4, $5)', userData, function (err, rows, fields) {
            if (!err) {
                console.log("query is working fine " + rows);
                appData.error = 0;
                appData["data"] = "User registered successfully!";
                res.status(201).json(appData);
            } else {
                console.log("got error " + err);
                appData["data"] = "Error Occured!";
                res.status(400).json(err);
            }
        });
    };

    this.loginUser = function (req, res) {
        var appData = {
            "error": 1,
            "data": ""
        };
        var email = req.body.email;
        var password = req.body.password;

        /*database.connection.getConnection(function(err, connection) {
            if (err) {
                appData["error"] = 1;
                appData["data"] = "Internal Server Error";
                res.status(500).json(appData);
            } else {
                connection.query('SELECT * FROM users WHERE email = ?', [email], function(err, rows, fields) {
                    if (err) {
                        appData.error = 1;
                        appData["data"] = "Error Occured!";
                        res.status(400).json(appData);
                    } else {
                        if (rows.length > 0) {
                            if (rows[0].password == password) {
                                console.log("rows[0] "+JSON.stringify(rows[0]));
                                let token = jwt.sign(rows[0], process.env.SECRET_KEY, {
                                    expiresIn: 1440
                                });
                                appData.error = 0;
                                appData["token"] = token;
                                res.status(200).json(appData);
                            } else {
                                appData.error = 1;
                                appData["data"] = "Email and Password does not match";
                                res.status(204).json(appData);
                            }
                        } else {
                            appData.error = 1;
                            appData["data"] = "Email does not exists!";
                            res.status(204).json(appData);
                        }
                    }
                });
                connection.release();
            }
        }); */
        console.log("data is " + JSON.stringify(req.body));
        database.connection.query('SELECT * FROM users WHERE email = $1', [email], function (err, dbResponse, fields) {
            if (err) {
                console.log("error is ");
                console.log(err);
                appData.error = 1;
                appData["data"] = "Error Occured!";
                appData["error"] = err;
                res.status(400).json(appData);
            } else {
                console.log("no error is ");
                var rows = dbResponse.rows;
                console.log(rows);
                if (rows.length > 0) {
                    console.log("rows.length is ");
                    if (rows[0].password == password) {
                        console.log("password match ");
                        console.log("rows[0] " + JSON.stringify(rows[0]));
                        var token = jwt.sign(rows[0], process.env.SECRET_KEY, {
                            expiresIn: 1440
                        });
                        appData.error = 0;
                        appData["token"] = token;
                        res.status(200).json(appData);
                    } else {
                        console.log("password not match ");
                        appData.error = 1;
                        appData["data"] = "Email and Password does not match";
                        res.status(204).json(appData);
                    }
                } else {
                    console.log("else ");
                    appData.error = 1;
                    appData["data"] = "Email does not exists!";
                    res.status(204).json(appData);
                }
            }
        });
    };

    this.getUser = function (req, res) {
        var appData = {};

        /*database.connection.getConnection(function(err, connection) {
            if (err) {
                appData["error"] = 1;
                appData["data"] = "Internal Server Error";
                res.status(500).json(appData);
            } else {
                connection.query('SELECT *FROM users', function(err, rows, fields) {
                    if (!err) {
                        appData["error"] = 0;
                        appData["data"] = rows;
                        res.status(200).json(appData);
                    } else {
                        appData["data"] = "No data found";
                        res.status(204).json(appData);
                    }
                });
                connection.release();
            }
        }); */
        database.connection.query('SELECT * FROM users', function (err, dbResponse, fields) {
            if (!err) {
                var rows = dbResponse.rows;
                appData["error"] = 0;
                appData["data"] = rows;
                res.status(200).json(appData);
            } else {
                appData["data"] = "No data found";
                res.status(204).json(appData);
            }
        });
    };
};

exports.default = SocietyController;
//# sourceMappingURL=societyController.js.map