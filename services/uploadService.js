  var JSFtp = require('jsftp');
  var fs = require('fs');
  var path = require('path');
  var config = require('../config.js').config;
  var uuidv1 = require('uuid/v1');


  var conf = {
      host: config.vsftp.host,
      user: config.vsftp.user,
      pass: config.vsftp.pass,
      debugMode: true
  }
  var Ftp = new JSFtp(conf);
  var quit = function() {
      Ftp.raw("quit", function(err, data) {
          if (err) { console.error(err); }
          //return err;
      });
  };
  var putfile = function(buffer, remoteFileName) {
      var p = new Promise(function(resolve, reject) {
          Ftp.put(buffer, 'remote/images/'+remoteFileName, function(hadError) {
              if (!hadError) {
                  console.log(remoteFileName);
                  resolve("ok");
              } else {
                  reject("error");
              }
          });
      });
      return p;
  };

  var uploadfiles = function(files) {
      var p = new Promise(async function(resolve, reject) {
        if(files.length<1)
          resolve(null);
          var filenames;
          try {
              filenames = [];
              for (var file of files) {
                  var str = file.originalname;
                  var n = str.substring(str.lastIndexOf('.') - 1, str.length);
                  var filename = uuidv1() + n;
                  await putfile(file.buffer, filename);
                  filenames.push(filename);
              }
              resolve(filenames);
          } catch (e) {
              console.log('批量传输有误！');
              reject(e);
          }
      })

      return p;
  };
















  module.exports = {
      uploadfiles
  };