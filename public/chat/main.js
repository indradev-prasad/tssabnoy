    var Peer = require('simple-peer')
//check webrct support or not
var check_chat_olny=false;
if (Peer.WEBRTC_SUPPORT) {
      //lets go video chat
      //make html clean for video chat
        var elem = document.querySelector('.only-chat-section');
           elem.parentNode.removeChild(elem);
           //init webrtc
navigator.getUserMedia=navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia
navigator.getUserMedia({ video: true, audio: true }, gotMedia, gotMediaError)
} else {
  // lets go for chat only
         check_chat_olny=true;
      //make html clean for video chat
        var elem = document.querySelector('.video-plus-chat-section');
           elem.parentNode.removeChild(elem);
}

    var node_data='';
    var node_id='';
    var my_node_id='';
    var stranger_node_id='';
    var check_chat_connected=false;
    var socket = io.connect('http://54.87.118.40:8080');
      socket.on('hand_shake', function (data) {
        if(!check_chat_olny)
        {
          //handshake for video and chat  webrtc
            if(node_data==''){
                socket.emit('not_ready_to_hand_shake',{'socket_id':data.socket_id,'node_data':""}); 
          } else{
              socket.emit('hand_shake',{'node_id':data.socket_id,'node_data':node_data}); 
          }  
        }
        else{
          //handshake for socket(chat only)
              my_node_id=data.socket_id;
              //alert(chat_node_id);
              socket.emit('new_chat_node',{'my_node_id':my_node_id}); 
        }
      });
var p;//global variable
var check=true;
var video;
var connected=false;
function gotMedia (stream) {
p=new Peer({ initiator: check, stream: stream })
p.on('error', function (err) { console.log('error', err) })

p.on('signal', function (data) {
  if(data.type=="offer"){
  node_data=JSON.stringify(data);
  }
    if(data.type=="answer"){
      socket.emit('broadcast_answer',{"node_id":node_id,"node_data":JSON.stringify(data)}); 
  }
})
       if(check_chat_olny==false)
         {
document.querySelector('#send_button').addEventListener('click', function (ev) {
  message_handle();
})
  document.querySelector('#next_connect').addEventListener('click', function (ev) {
      window.parent.document.getElementById('reload').click(); 
})
    }
p.on('connect', function () {
  // console.log('CONNECT')
  connected=true;
  document.querySelector(".spin_loader").setAttribute('style','display:none;')
  document.querySelector(".live_status_button").innerHTML="Stranger is live!. Say Hi!.";
})

p.on('data', function (data) {
  document.querySelector('#conversation').innerHTML=document.querySelector('#conversation').innerHTML+'<div class="clearfix you-message-li"><blockquote class="you-message pull-left">'+data+'</blockquote></div>';
   var objDiv = document.getElementById("conversation");
     objDiv.scrollTop = objDiv.scrollHeight;
})
  p.on('stream', function (stream) {
    // got remote video stream, now let's show it in a video tag
    video = document.querySelector('#remote_video')
    video.src = window.URL.createObjectURL(stream)
    video.play()
  })
      // got my or local video stream, now let's show it in a video tag
    video = document.querySelector('#local_video')
    video.src = window.URL.createObjectURL(stream)
    video.play()

  p.on('close', function () {
  	//video.destroy();
      if(connected==true)
      {
           document.querySelector('#next_connect').click();//connected but they leave me then I will find next one 
      }
  })

  //socket io code
            socket.on('broadcast_offer', function (data) { 
              node_id=data.node_id;
                   check=false;
                   p.destroy();
                  gotMedia(stream);
                   p.signal(JSON.parse(data.node_data));
      });
              socket.on('broadcast_answer', function (data) { 
                //console.log(data);
                p.signal(JSON.parse(data.node_data));
      });
//end here
}

function message_handle(){
  if((document.querySelector('.emoji-wysiwyg-editor').innerHTML=='')||(connected==false)){
      return false;
  }
   document.querySelector('#conversation').innerHTML=document.querySelector('#conversation').innerHTML+'<div class="clearfix me-message-li"><blockquote class="me-message pull-right">'+document.querySelector('.emoji-wysiwyg-editor').innerHTML+'</blockquote></div>';
    p.send(document.querySelector('.emoji-wysiwyg-editor').innerHTML);
    document.getElementById('chatMessage').value='';
    document.querySelector('.emoji-wysiwyg-editor').innerHTML='';
    var objDiv = document.getElementById("conversation");
     objDiv.scrollTop = objDiv.scrollHeight;
}

function gotMediaError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

//code of socket for chat only
        socket.on('broadcast_chat_connect', function (data) { 
                //console.log(data);
                chat_connected();
              stranger_node_id=data.stranger_node_id;
              document.querySelector(".live_status_button").innerHTML="Stranger is live!. Say Hi!.";
      });
     socket.on('broadcast_chat_left', function (data) { 
                //console.log(data);
                chat_disconnected();
              document.querySelector(".live_status_button").innerHTML="Stranger left.";
              //alert("hiii");
              // setTimeout(function(){ 
              //   document.querySelector("#send_button_next").click(); 
              //  }, 1000);
      });
          socket.on('chat_message_broadcast', function (data) { 
                document.querySelector('#conversation_only').innerHTML=document.querySelector('#conversation_only').innerHTML+'<div class="clearfix you-message-li"><blockquote class="you-message pull-left">'+data.message+'</blockquote></div>';
                  var objDiv = document.getElementById("conversation_only");
                    objDiv.scrollTop = objDiv.scrollHeight;
      });
                if(check_chat_olny==true)
                {
                         document.querySelector("#send_button_next").addEventListener('click',function(){
                 chat_disconnected();
                 document.querySelector(".live_status_button").innerHTML="Please wait!. Searching stranger..";
                 socket.emit('new_chat_connect',{'my_node_id':my_node_id});
                 document.querySelector("#conversation_only").innerHTML='';
     });
          document.querySelector("#send_button_only").addEventListener('click',function(){
              if((document.querySelector('.emoji-wysiwyg-editor').innerHTML=='')||(check_chat_connected==false)||(stranger_node_id=='')){
                   return false;
              }
              var message=document.querySelector('.emoji-wysiwyg-editor').innerHTML;
         document.querySelector('#conversation_only').innerHTML=document.querySelector('#conversation_only').innerHTML+'<div class="clearfix me-message-li"><blockquote class="me-message pull-right">'+message+'</blockquote></div>';
               document.getElementById('chatMessage_only').value='';
               document.querySelector('.emoji-wysiwyg-editor').innerHTML='';
              var objDiv = document.getElementById("conversation_only");
                   objDiv.scrollTop = objDiv.scrollHeight;
                   socket.emit('chat_message_broadcast',{'stranger_node_id':stranger_node_id,'my_node_id':my_node_id,'message':message});
     });
                }
     function chat_connected(){
                check_chat_connected=true;
                document.querySelector('.emoji-wysiwyg-editor').focus();
                 document.querySelector("#send_button_only").removeAttribute('disabled','disabled')
     }
     function chat_disconnected(){
                 stranger_node_id='';
              check_chat_connected=false;
               document.querySelector("#send_button_only").setAttribute('disabled','disabled')
     }
//end here
/*
js for iframe below
*/
window.addEventListener('load', function() {
});






