var ArticleModel = require('../model/schema').ArticleModel;
var OutAModel = require('../model/schema').OutAModel;

var save = function(article) {
    var p = new Promise(function(resolve, reject) {
        try {
            var a = new ArticleModel(article);
            a.save(function(err, rs, num) {
                // console.log(err,rs,num);
                if (err || num != 1) reject(err);
                resolve('ok');
            });
        } catch (e) {
            reject(e);
        }
    });
    return p;
}


var outsave = function(article) {
    var p = new Promise(function(resolve, reject) {
        try {
            var a = new OutAModel(article);
            a.save(function(err, rs, num) {
                // console.log(err,rs,num);
                if (err || num != 1) reject(err);
                resolve('ok');
            });
        } catch (e) {
            reject(e);
        }
    });
    return p;
}

var findAll = function(limit = 6, skip = 0, conditions) {
    var p = new Promise(function(resolve, reject) {
        try {
            var q = ArticleModel.find(conditions).skip(new Number(skip)).limit(new Number(limit)).sort({ 'date': -1 });
            q.exec(function(err, docs) {

                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(docs);
            });
        } catch (e) {
            console.log(e);
            reject(e);
        }
    })
    return p;
}

var count = function(model, conditions) {
    return new Promise(function(resolve, reject) {
        if(model=='article')
            var Model=ArticleModel;
        else if(model='outarticle'){
            var Model=OutAModel;
        }
        Model.count(conditions, function(err, count) {
            if(err) reject(err);
            resolve(count);
        })
    });
}
var outfindAll = function(limit = 6, skip = 0, conditions) {
    var p = new Promise(function(resolve, reject) {
        try {
            var q = OutAModel.find(conditions).skip(new Number(skip)).limit(new Number(limit)).sort({ 'date': -1 });
            q.exec(function(err, docs) {

                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(docs);
            });
        } catch (e) {
            console.log(e);
            reject(e);
        }
    })
    return p;
}


var findById = function(id) {
    var p = new Promise(function(resolve, reject) {
        try {
            var q = ArticleModel.find({ _id: id });
            q.exec(function(err, doc) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(doc);
            });
        } catch (e) {
            console.log(e);
            reject(e);
        }
    })
    return p;
}

var update = function(conditions, update) {
    var p = new Promise(function(resolve, reject) {
        try {
            ArticleModel
                .update(conditions, update, function(err, data) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        console.log(data);
                        resolve(data);
                    }
                });
        } catch (e) {
            console.log(e);
        }
    });
    return p;
}

var del = function(conditions) {
    var p = new Promise(function(resolve, reject) {
        try {
            ArticleModel.deleteMany(conditions, function(rs) {
                resolve(rs);
            })
        } catch (e) {
            reject(e);
        }
    });
    return p;
}

module.exports = {
    save,
    outfindAll,
    findAll,
    findById,
    update,
    del,
    count,outsave
}