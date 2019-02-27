'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _queryConnection = require('../models/queryConnection');

var _queryConnection2 = _interopRequireDefault(_queryConnection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

process.env.SECRET_KEY = 'varunv';

var SocietyModel = function SocietyModel() {
    var _this = this;

    _classCallCheck(this, SocietyModel);

    this.getOwner = function (req, searchData) {
        return new Promise(function (resolve, reject) {
            var query = 'select ownerid from owner where phonenumber = ' + searchData[0] + ' and email = \'' + searchData[1] + '\' ';
            _this.queryMediator.queryConnection(query).then(function (result) {
                console.log('getOwner : Ok ');
                resolve(result);
            }).catch(function (err) {
                console.log('got query error ', err);
                reject(err);
            });
        });
    };

    this.callStoredProc = function (req) {
        return new Promise(function (resolve, reject) {
            var query = 'call ' + req.body.storedProc;
            _this.queryMediator.queryConnection(query).then(function (result) {
                console.log('callStoredProc : Ok ');
                resolve(result);
            }).catch(function (err) {
                console.log('got query error ', err);
                reject(err);
            });
        });
    };

    this.getOwnerList = function (req) {
        return new Promise(function (resolve, reject) {
            var societyIds = req.body.societyIds && req.body.societyIds.length > 0 ? '\'' + req.body.societyIds + '\'' : null;
            var buildingNames = req.body.buildingNames && req.body.buildingNames.length > 0 ? '\'' + req.body.buildingNames + '\'' : null;
            var flatIds = req.body.flatIds && req.body.flatIds.length > 0 ? '\'' + req.body.flatIds + '\'' : null;

            var query = 'call get_owner_details(' + societyIds + ', ' + buildingNames + ', ' + flatIds + ')';
            console.log('call get_owner_details(' + societyIds + ', ' + buildingNames + ', ' + flatIds + ')');
            _this.queryMediator.queryConnection(query).then(function (result) {
                console.log('getOwnerList : Ok ');
                resolve(result);
            }).catch(function (err) {
                console.log('got query error ', err);
                reject(err);
            });
        });
    };

    this.updateFlat = function (req, searchData, updateValue) {
        return new Promise(function (resolve, reject) {
            console.log('searchData is ', searchData);
            console.log('update value is ', updateValue);

            var query = 'update flat set ownerid = ' + updateValue + ' where societyid = ' + searchData[0] + ' and buildingname = \'' + searchData[1] + '\' and flatname = \'' + searchData[2] + '\'';
            _this.queryMediator.queryConnection(query).then(function (result) {
                console.log('updateFlat : Ok ');
                resolve(result);
            }).catch(function (err) {
                console.log('got query error ', err);
                console.log('query is ------------ update flat set ownerid = ' + updateValue + ' where societyid = ' + searchData[0] + ' and buildingname = ' + searchData[1] + ' and flatname = ' + searchData[2]);
                reject(err);
            });
        });
    };

    this.registerOwner = function (req) {
        return new Promise(function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(resolve, reject) {
                var flatData, ownerSearchData, ownerInsertData, query, fetchOwnerResponse, insertMappingResponse;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                flatData = [req.body.societyId, req.body.buildingName, req.body.flatName];
                                ownerSearchData = [req.body.phoneNumber, req.body.email];
                                ownerInsertData = [[req.body.ownerName, req.body.type, req.body.phoneNumber, req.body.email, req.body.age, req.body.gender, req.body.password]];
                                query = 'insert into owner(ownername,type,phonenumber,email, age, gender, password) values ?';
                                _context.prev = 4;
                                _context.next = 7;
                                return _this.queryMediator.queryConnection(query, ownerInsertData);

                            case 7:
                                _context.next = 9;
                                return _this.getOwner(null, ownerSearchData);

                            case 9:
                                fetchOwnerResponse = _context.sent;

                                if (!(fetchOwnerResponse.dbResponse && fetchOwnerResponse.dbResponse[0] && fetchOwnerResponse.dbResponse[0].ownerid)) {
                                    _context.next = 18;
                                    break;
                                }

                                _context.next = 13;
                                return _this.updateFlat(null, flatData, fetchOwnerResponse.dbResponse[0].ownerid);

                            case 13:
                                insertMappingResponse = _context.sent;

                                fetchOwnerResponse.dbResponse = 'new owner record inserted and updated flat sucessfully';
                                resolve(insertMappingResponse);
                                _context.next = 20;
                                break;

                            case 18:
                                fetchOwnerResponse.dbResponse = 'new owner record inserted sucessfully';
                                resolve(fetchOwnerResponse);

                            case 20:
                                _context.next = 26;
                                break;

                            case 22:
                                _context.prev = 22;
                                _context.t0 = _context['catch'](4);

                                console.log('got query error ', _context.t0);
                                reject(_context.t0);
                                //return err;

                            case 26:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, _this, [[4, 22]]);
            }));

            return function (_x, _x2) {
                return _ref.apply(this, arguments);
            };
        }());
    };

    this.getDetails = function (req) {
        return new Promise(function (resolve, reject) {
            console.log('req.params.tableName', req.params.tableName);
            var query = 'select * from ' + req.params.tableName;
            _this.queryMediator.queryConnection(query).then(function (result) {
                console.log('getDetails : Ok ');
                resolve(result);
            }).catch(function (err) {
                console.log('got query error ', err);
                reject(err);
            });
        });
    };

    this.getDetailsUsingQueryParam = function (req) {
        return new Promise(function (resolve, reject) {
            console.log('req.params.tableName', req.params.tableName);
            var query = 'select * from ' + req.params.tableName + ' where ' + req.params.columnName + ' = ' + req.query.value;
            _this.queryMediator.queryConnection(query).then(function (result) {
                console.log('select query working fine : Ok ');
                resolve(result);
            }).catch(function (err) {
                console.log('got query error ', err);
                reject(err);
            });
        });
    };

    this.updatePendingPaymentOfFlat = function (req) {
        return new Promise(function (resolve, reject) {
            //console.log('req.params.tableName', req.params.tableName);

            //let query = `update flat set pendingpayment = '${req.body.pendingPayment}' where ownerid =${req.body.ownerid} and flatId =${req.body.flatid}`;
            var query = 'call update_pending_payment(' + req.body.flatid + ', ' + req.body.pendingPayment + ', ' + req.body.ownerid + ')';
            _this.queryMediator.queryConnection(query).then(function (result) {
                console.log('pending payment successfully updated : Ok ');
                resolve(result);
            }).catch(function (err) {
                console.log('got query error ', err);
                reject(err);
            });
        });
    };

    this.updatePaymentHistory = function (req) {
        return new Promise(function (resolve, reject) {
            var currentDate = new Date();

            var query = 'insert into paymenthistory(flatid,paid,ownerid) values (' + req.body.flatid + ',' + req.body.pendingPayment + ',' + req.body.ownerid + ');';
            _this.queryMediator.queryConnection(query).then(function (result) {
                console.log('pending payment history successfully updated : Ok ');
                resolve(result);
            }).catch(function (err) {
                console.log('got query error ', err);
                reject(err);
            });
        });
    };

    this.registerBuilding = function (req) {
        return new Promise(function (resolve, reject) {
            var query = 'insert into building(buildingname, societyid) values(\'' + req.body.buildingName + '\',' + req.body.societyid + ');';
            _this.queryMediator.queryConnection(query).then(function (result) {
                console.log('Building is successfully Inserted: Ok ');
                resolve(result);
            }).catch(function (err) {
                console.log('got query error ', err);
                reject(err);
            });
        });
    };

    this.registerSociety = function (req) {
        return new Promise(function (resolve, reject) {
            var query = 'insert into society(societyName, address, pincode) values (\'' + req.body.societyName + '\', \'' + req.body.address + '\', \'' + req.body.pincode + '\');';
            _this.queryMediator.queryConnection(query).then(function (result) {
                console.log('Society is successfully Inserted : Ok ');
                resolve(result);
            }).catch(function (err) {
                console.log('got query error ', err);
                reject(err);
            });
        });
    };

    this.registerFlat = function (req) {
        return new Promise(function (resolve, reject) {
            var query = 'insert into flat(flatname, buildingname, societyid) values (\'' + req.body.flatName + '\', \'' + req.body.buildingName + '\', ' + req.body.societyId + ');';
            _this.queryMediator.queryConnection(query).then(function (result) {
                console.log('Flat is successfully Inserted : Ok ');
                resolve(result);
            }).catch(function (err) {
                console.log('got query error ', err);
                reject(err);
            });
        });
    };

    this.updateBuilding = function (req) {
        return new Promise(function (resolve, reject) {
            var query = 'insert into building(buildingname, societyid) values(\'' + req.body.buildingName + '\',' + req.body.societyid + ');';
            _this.queryMediator.queryConnection(query).then(function (result) {
                console.log('Building is successfully Updated: Ok ');
                resolve(result);
            }).catch(function (err) {
                console.log('got query error ', err);
                reject(err);
            });
        });
    };

    this.updateSociety = function (req) {
        return new Promise(function (resolve, reject) {
            var query = 'insert into society(societyName, address, pincode) values (\'' + req.body.societyName + '\', \'' + req.body.address + '\', \'' + req.body.pincode + '\');';
            _this.queryMediator.queryConnection(query).then(function (result) {
                console.log('Society is successfully Updated : Ok ');
                resolve(result);
            }).catch(function (err) {
                console.log('got query error ', err);
                reject(err);
            });
        });
    };

    this.updateOwner = function (req) {
        return new Promise(function (resolve, reject) {
            var query = 'insert into flat(flatname, buildingname, societyid) values (\'' + req.body.flatName + '\', \'' + req.body.buildingName + '\', ' + req.body.societyId + ');';
            _this.queryMediator.queryConnection(query).then(function (result) {
                console.log('Flat is successfully Updated : Ok ');
                resolve(result);
            }).catch(function (err) {
                console.log('got query error ', err);
                reject(err);
            });
        });
    };

    this.getDetailsUsingMultiParam = function (req) {
        return new Promise(function (resolve, reject) {
            var query = 'select * from ' + req.params.tableName + ' where ' + req.params.columnName1 + ' = ' + req.query.value1 + ' and ' + req.params.columnName2 + ' = ' + req.query.value2;
            console.log(query);
            _this.queryMediator.queryConnection(query).then(function (result) {
                console.log('getDetailsUsingMultiParam : Ok ');
                resolve(result);
            }).catch(function (err) {
                console.log('got query error ', err);
                reject(err);
            });
        });
    };

    this.deleteRow = function (req) {
        return new Promise(function (resolve, reject) {
            var query = 'delete from ' + req.body.tableName + ' where ' + req.body.columnName + ' = ' + req.body.columnValue;
            _this.queryMediator.queryConnection(query).then(function (result) {
                console.log('delete successfully : Ok ');
                resolve(result);
            }).catch(function (err) {
                console.log('got query error while deleting ', err);
                reject(err);
            });
        });
    };

    this.insertPaymentStructure = function (req) {
        return new Promise(function (resolve, reject) {
            var body = req.body;
            var query = 'insert into dev_society.paymentstructure(buildingMaintenance, parkingMaintenance, municipalDue, sinkingFund, electricityCharge, updatedBy) values (' + body.buildingMaintenance + ',' + body.parkingMaintenance + ',' + body.municipalDue + ',' + body.sinkingFund + ',' + body.electricityCharge + ',' + body.updatedBy + ');';
            _this.queryMediator.queryConnection(query).then(function (result) {
                console.log('insertPaymentStructure: Ok ');
                resolve(result);
            }).catch(function (err) {
                console.log('insertPaymentStructure : Error ', err);
                reject(err);
            });
        });
    };

    this.insertPaymentReceipt = function (recieptArray) {
        return new Promise(function (resolve, reject) {
            var query = 'insert into dev_society.paymentreceipt(flatid, monthlyamount, paymentStructureid) values ?';
            _this.queryMediator.queryConnection(query, recieptArray).then(function (result) {
                console.log('insertPaymentReceipt: Ok ');
                resolve(result);
            }).catch(function (err) {
                console.log('insertPaymentReceipt : Error ', err);
                reject(err);
            });
        });
    };

    this.getFlatIdsByOwnerId = function (ownerId) {
        return new Promise(function (resolve, reject) {
            var query = 'SELECT flatid FROM dev_society.flat where ownerid = ' + ownerId;
            _this.queryMediator.queryConnection(query).then(function (result) {
                console.log('insertPaymentReceipt: Ok ');
                resolve(result);
            }).catch(function (err) {
                console.log('insertPaymentReceipt : Error ', err);
                reject(err);
            });
        });
    };

    this.queryMediator = new _queryConnection2.default();
}

// updatePendingPaymentOfFlat = (req) => new Promise((resolve, reject) => {
//     console.log('req.params.tableName', req.params.tableName);

//     let query = `update flat set pendingpayment = '${req.body.pendingPayment}' where ownerid =${req.body.ownerid} and flatId =${req.body.flatid}`;
//     this.queryMediator.queryConnection(query).then((result) => {
//         console.log('pending payment successfully updated : Ok ');
//         resolve(result);
//     }).catch((err) => {
//         console.log('got query error ', err);
//         reject(err);
//     });
// })

// updateFlat = (req) => new Promise((resolve, reject) => {
//     let query = `insert into flat(flatname, buildingname, societyid) values ('${req.body.flatName}', '${req.body.buildingName}', ${req.body.societyId});`;
//     this.queryMediator.queryConnection(query).then((result) => {
//         console.log('Flat is successfully Updated : Ok ');
//         resolve(result);
//     }).catch((err) => {
//         console.log('got query error ', err);
//         reject(err);
//     });
// });

;

exports.default = SocietyModel;
//# sourceMappingURL=societyModel.js.map