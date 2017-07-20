var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express'
	}); 
});

router.get('/publish',function(req,res,next){
  res.render('publish');
});
router.get('/formv',function(req,res,next){
  res.render('formValidate');
});
router.get('/test',function(req,res,next){
	res.render('test',{req:req});
})

router.get('/fileinput',function(req,res){
	res.render('fileinput');
})
module.exports = router;
