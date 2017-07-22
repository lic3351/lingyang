var mongoose = require('../dbo/db');
var Schema = mongoose.Schema;
var db = mongoose.db;

var userSchema = new Schema({
    name: String,
    passwd: String,
    uname:String,//昵称
    lianxi:String,//联系方式
    level:{type:Number,default:0},//级别 0 普通用户 5管理员
    regtime: { type: Date, default: Date.now }
});

userSchema.methods.print = function() {
    return 'name: ' + this.name + ' regtime :' + this.regtime;
};

var ArticleSchema = new Schema({
    type:String,
    title: String,
    body: String,
    author_id: String,
    author_name:String,
    author_uname:String,
    date: { type: Date, default: Date.now },
    comments: [{ body: String, date:{type:Date,default:Date.now}, author_id: String,author_name:String,author_uname:String}],
    status: { type: Number, default: 0 },//正常为0 结帖为1 删除为-1
    viewcount: { type: Number, default: 1 },
    images:[{type:String}]
});



var OutASchema = new Schema({
    title: String,
    body: String,
    href: String,
    author:String,
    date:Date,
    comments:String,
    views:String
});



var UserModel;
var ArticleModel;
var outAModel;
init = function() {
    try {
        UserModel = db.model('User', userSchema);
        ArticleModel = db.model('Article', ArticleSchema);
        OutAModel=db.model('outArticle',OutASchema);
    } catch (e) {
        console.log(`Schema : ${e}`);
    }
}
init();
UserModel.on('error', function(){
    console.log('UserModel error');
});
module.exports = {ArticleModel, UserModel,OutAModel};
