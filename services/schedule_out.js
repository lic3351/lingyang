var schedule = require('node-schedule');
var UpdateDB=require('./spider.js');

var rule = new schedule.RecurrenceRule();
rule.hour = 4;
var j = schedule.scheduleJob(rule, function(){
  console.log('The answer to life, the universe, and everything!');
  UpdateDB.update();
});
