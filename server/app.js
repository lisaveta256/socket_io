var mysql = require('mysql');
var io = require('socket.io')(8083,{  cors: {
    origin: '*',
  }});
/*( {
    cors: {
      origin: '*',
    }
  });
*/

var db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'recepies'
});
db.connect((error)=>{
    if(error){
        console.log('Error: ', error);
    }
});
global.newId = 0;
global.newIdNew = 0;
io.sockets.on('connection',(socket)=>{
    socket.emit('echo','Server send message');
    setInterval(function(){
        db.query('SELECT * FROM PROCESSES ORDER BY ID DESC LIMIT 1', (err, row)=>{
            if(err){
                console.log(err);
            }
            global.newId = row[0].id;
            if(global.newId!=global.newIdNew){
                global.newId=global.newIdNew;
                db.query('SELECT * FROM PROCESSES ORDER BY ID DESC LIMIT 100',(err, rows)=>{
                    socket.emit('echo', rows)
                })
            }
            
        })
    },2000)
})

