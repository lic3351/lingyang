var UserModel = require('../model/schema').UserModel;

var exists = function(name) {
    var p = new Promise(function(resolve, reject) {
        var query = UserModel.where({ 'name': name });
        query.findOne(function(err, data) {
            if (err) reject(err);
            resolve(data);
        })
    })
    return p;
}


var save = function(user) {
    var p = new Promise(function(resolve, reject) {
        try {
            var u = new UserModel(user);
            u.save(function(err, rs, num) {
                if (err || num != 1) reject(err);
                resolve('ok');
            });
        } catch (e) {
            reject(e);
        }

    });
    return p;
}

var findOne = function(conditions) {
    var p = new Promise(function(resolve, reject) {
        var query = UserModel.find(conditions);
        query.exec(function(err, docs) {
            if (err) {
                reject(err);
            } else {
                resolve(docs);
            }
        });
    });
    return p;
}


var update = function(conditions,set) {
    var p = new Promise(function(resolve, reject) {
        var query = UserModel.update(conditions,set);
        query.exec(function(err, docs) {
            if (err) {
                reject(err);
            } else {
                resolve(docs);
            }
        });
    });
    return p;
}

module.exports = {
    exists,
    save,
    findOne,
    update
}