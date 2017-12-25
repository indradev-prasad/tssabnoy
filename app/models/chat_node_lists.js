
db_con=require('../../config/connect_db')(); //connect to db
module.exports = {
    add_node:function(data,callback) {
    var insertQuery = "INSERT INTO chat_node_lists ( my_node_id, stranger_node_id) values (?,?)";
             db_con.query(insertQuery,[data.my_node_id,data.stranger_node_id],function(err, rows) {
                   //console.log('new node added successffully :'+data.node_id)
                   return callback();
                    });
    },
     delete_node:function(data) {
           db_con.query("DELETE FROM chat_node_lists WHERE my_node_id = ? ", [data.my_node_id], function(err, results) {
        // console.log('new node added successffully :'+data.id)
    });
    },
    get_node:function(data,callback){ //I wannted a new partner to chat
     var sql="SELECT * FROM chat_node_lists WHERE NOT my_node_id='"+data.my_node_id+"' AND stranger_node_id='' LIMIT 1";
                db_con.query(sql,function(err1, rows) {
                 // console.log(rows);
                if(rows.length>0)
                {
                          //need to update my id with partner and partner id with mine 
                          var stranger_node_id=rows[0].my_node_id;
                            var sql="UPDATE chat_node_lists set stranger_node_id='"+data.my_node_id+"' WHERE my_node_id='"+stranger_node_id+"'";
                           var sql1="UPDATE chat_node_lists set stranger_node_id='"+stranger_node_id+"' WHERE my_node_id='"+data.my_node_id+"'";
                          db_con.query(sql, function (err, result) {
                                console
                            });
                               db_con.query(sql1, function (err, result) {
                     
                            });
                }
                      return callback(rows);
                });
    },
      on_left:function(data,callback){//on left I will notifiy my partner I am going to lleft
     var sql="SELECT * FROM chat_node_lists WHERE my_node_id='"+data.my_node_id+"' AND NOT stranger_node_id='' LIMIT 1";
                db_con.query(sql,function(err1, rows) {
                      return callback(rows);
                });
    },
     empty_node:function(data,callback){//on left I will notifiy my partner I am going to lleft
            var sql="UPDATE chat_node_lists set stranger_node_id='' WHERE my_node_id='"+data.my_node_id+"'";
                          db_con.query(sql, function (err, result) {
                     return callback();
                            });
    },

};