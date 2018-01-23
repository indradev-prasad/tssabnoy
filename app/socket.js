// app/routes.js
var fs = require('fs');
chat_node_lists=require('./models/chat_node_lists'); //add modles
node_lists=require('./models/node_lists'); //add modles
module.exports = function(io) {
	var total_no=0;
    io.sockets.on('connection', function(socket){
    ++total_no;//new node increaments
    console.log('a new node connected: ' + total_no);
     //write total actve
     fs.writeFile("active_node.json",total_no,function(err){if(err){console.log(err)}});
    //hand shake first==============================================================
    //io.to(socket.id).emit('hand_shake',{});
    socket.emit('hand_shake',{'socket_id':socket.id});
      socket.on('not_ready_to_hand_shake', function(data){
       socket.emit('hand_shake',data);
       //console.log("not ready")
    });
        socket.on('hand_shake', function(data){
          //start here file data
           var retrn_data=delete_node_lists(data);
            if(retrn_data.length>0){
                 //console.log(retrn_data[0]);//broad cast
                    socket.emit('broadcast_offer',retrn_data[0]);
                 delete_node_lists(retrn_data[0]);
            } else{
              add_node_lists(data);
            }
          //end here
          //console.log(data)
          // node_lists.clear_previous(data,function(){//my prvious added node
          //                 //get offer from queue
          // node_lists.get_offer(function(offer_data){//previous offer
          //     if(offer_data.length>0)//there are already someone waiting
          //       {
          //          socket.emit('broadcast_offer',offer_data[0]);
          //       }
          //       else{
          //         node_lists.add_node(data);//this will added in queue for waiting
          //       }
          //     });
          // });
    });
                socket.on('broadcast_answer', function(data){
                         //console.log(data.node_data);
                           io.to(data.node_id).emit('broadcast_answer',data);//broadcast
                    });
        //hand shake end here

        //handshake for only chat
          socket.on('new_chat_node', function(data){
                 chat_node_lists.add_node({'my_node_id':data.my_node_id,'stranger_node_id':''},function(){//I am added successfully
                    chat_node_lists.get_node(data,function(get_data){
                         chat_connect_notification(get_data,data.my_node_id);
                    });

                 });
                    });
        //end here handshake for chat
                  socket.on('new_chat_connect', function(data){
                               chat_node_lists.on_left({'my_node_id':data.my_node_id},function(left_data){
                                   //I have notied partner I left you
                                     chat_left_notification(left_data);
                                  chat_node_lists.empty_node({'my_node_id':data.my_node_id},function(){
                           chat_node_lists.get_node(data,function(get_data){
                         chat_connect_notification(get_data,data.my_node_id);
                            });
                              });
                      });
                    });
                  socket.on('chat_message_broadcast', function(data){
                  io.to(data.stranger_node_id).emit('chat_message_broadcast',data);//broadcast
                    });
                    socket.on('chat_typing_broadcast', function(data){
                  io.to(data.stranger_node_id).emit('chat_typing_broadcast',data);//broadcast
                    });

    socket.on('disconnect', function(){
    	--total_no;//leave node
        console.log('a node leaved: '+ total_no);
        delete_node_lists({"node_id":socket.id,"node_data":""});
         //node_lists.delete_node(socket);
         chat_node_lists.on_left({'my_node_id':socket.id},function(data){
                //I have notification data now delete my node
               chat_node_lists.delete_node({'my_node_id':socket.id}); 
               chat_left_notification(data);
         });
    });
     function chat_left_notification(data){
        if(data.length>0){
           io.to(data[0].stranger_node_id).emit('broadcast_chat_left',{'stranger_node_id':data[0].my_node_id});//broadcast
        }
    }
    //chat left notification
    function chat_connect_notification(data,my_node_id){
        if(data.length>0){
           io.to(data[0].my_node_id).emit('broadcast_chat_connect',{'stranger_node_id':my_node_id});//id exchange so we can chat
            io.to(my_node_id).emit('broadcast_chat_connect',{'stranger_node_id':data[0].my_node_id});//broadcast
        }
    }

    //add new node into node lists
    function add_node_lists(data){
      var file=fs.readFileSync('node_lists.json', 'utf8');
      if(file=='')
      {
        file="[]";
      }
      var obj;
       try {
    obj = JSON.parse(file);
       } catch (e) {
       obj=[];
     }
           obj.push({"node_id":data.node_id,"node_data":data.node_data});
            fs.writeFile("node_lists.json",JSON.stringify(obj),function(err){if(err){console.log(err)}});
            return true;

    }
    function delete_node_lists(data){
      var file=fs.readFileSync('node_lists.json', 'utf8');
      if(file=='')
      {
        file="[]";
      }
      var obj;
       try {
    obj = JSON.parse(file);
       } catch (e) {
       obj=[];
     }
          var obj_data=obj;
          var file_data=[];
            for(var i=0;i<obj_data.length;i++){//clear first data
              if(obj_data[i].node_id!=data.node_id){
                  file_data.push({"node_id":obj_data[i].node_id,"node_data":obj_data[i].node_data});
              }
            }
            fs.writeFile("node_lists.json",JSON.stringify(file_data),function(err){if(err){console.log(err)}});
            return file_data;

    }
});
};

