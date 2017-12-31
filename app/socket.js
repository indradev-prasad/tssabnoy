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
          //console.log(data)
          //get offer from queue
          node_lists.get_offer(function(offer_data){//previous offer
              if(offer_data.length>0)//there are already someone waiting
                {
                   socket.emit('broadcast_offer',offer_data[0]);
                }
                else{
                  node_lists.add_node(data);//this will added in queue for waiting
                }
          });
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

    socket.on('disconnect', function(){
    	--total_no;//leave node
        console.log('a node leaved: '+ total_no);
         node_lists.delete_node(socket);
         chat_node_lists.on_left({'my_node_id':socket.id},function(data){
                //I have notification data now delete my node
               chat_node_lists.delete_node({'my_node_id':socket.id}); 
               chat_left_notification(data);
         });
    });
     function chat_left_notification(data){
        if(data.length>0){
           io.to(data[0].stranger_node_id).emit('broadcast_chat_left',{'message':'Stranger left.'});//broadcast
        }
    }
    //chat left notification
    function chat_connect_notification(data,my_node_id){
        if(data.length>0){
           io.to(data[0].my_node_id).emit('broadcast_chat_connect',{'stranger_node_id':my_node_id});//id exchange so we can chat
            io.to(my_node_id).emit('broadcast_chat_connect',{'stranger_node_id':data[0].my_node_id});//broadcast
        }
    }
});
};

