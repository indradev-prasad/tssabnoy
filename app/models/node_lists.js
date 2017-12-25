
db_con=require('../../config/connect_db')(); //connect to db
module.exports = {
    add_node:function(data) {
    var insertQuery = "INSERT INTO node_lists ( node_id, node_data) values (?,?)";
             db_con.query(insertQuery,[data.node_id,data.node_data],function(err, rows) {
                   //console.log('new node added successffully :'+data.node_id)
                    });
    },
     delete_node:function(data) {
           db_con.query("DELETE FROM node_lists WHERE node_id = ? ", [data.id], function(err, results) {
        // console.log('new node added successffully :'+data.id)
    });
    },
    get_offer:function(callback){
     var sql="SELECT * FROM node_lists LIMIT 1";
                db_con.query(sql,function(err1, rows) {
                if(rows.length>0)
                {
                          db_con.query("DELETE FROM node_lists WHERE node_id = ? ", [rows[0].node_id], function(err, results) {//clear 
                                  });
                }
                      return callback(rows);
                });
    },
};