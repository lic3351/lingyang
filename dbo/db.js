var mongoose = require('mongoose');
var dbconf = require('../config.js').config.dbconf;


var Schema = mongoose.Schema;
var db;
init = function() {
    try {
        db = mongoose.createConnection(dbconf.host, dbconf.data);
        db.on('error', function() {
            console.error.bind(console, '连接错误');
        });
    } catch (e) {
        console.log(`数据库连接错误 ${e}`);
    }
}
init();


module.exports = { Schema, db };
