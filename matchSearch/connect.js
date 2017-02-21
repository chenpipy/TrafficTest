/**
 * Created by Administrator on 2017/2/21 0021.
 */
var mysql  = require('mysql');  //调用MySQL模块

//创建一个connection
var connection = mysql.createConnection({

    host     : '192.168.1.51',       //主机
    user     : 'qiniu',            //MySQL认证用户名
    password:'123456',
    port:   '3306',
    database: 'traffic'

});

//创建一个connection
connection.connect(function(err){

    if(err){

        console.log('[query] - :'+err);

        return;

    }

    console.log('[connection connect]  succeed!');

});

//执行SQL语句
connection.query('SELECT * from gis_junction', function(err, rows, fields) {

    if (err) {

        console.log('[query] - :'+err);

        return;

    }

    console.log('The solution is: ', rows[0].junction_name);

});

//关闭connection
connection.end(function(err){

    if(err){

        return;

    }

    console.log('[connection end] succeed!');

});
