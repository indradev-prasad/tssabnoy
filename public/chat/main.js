    var Peer = require('simple-peer')
    var SITE_URL=document.location.origin
//check webrct support or not
var check_chat_olny=false;
var chat_only_selected=parent.chat_only_selected;//want only chat
if (Peer.WEBRTC_SUPPORT && chat_only_selected==true) {
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
    var socket = io.connect(SITE_URL);
      socket.on('hand_shake', function (data) {
        if(!check_chat_olny)
        {
            my_node_id=data.socket_id;
          //handshake for video and chat  webrtc
            if(node_data==''){
                //socket.emit('not_ready_to_hand_shake',{'socket_id':data.socket_id,'node_data':""}); 
          } else{
              //socket.emit('hand_shake',{'node_id':data.socket_id,'node_data':node_data}); 
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
var local_stream='';
var remote_stream='';
var stop_multiple_event=true;

function gotMedia (stream) {
//my local video
      // got my or local video stream, now let's show it in a video tag
    local_video = document.querySelector('#local_video')
    local_video.src = window.URL.createObjectURL(stream)
    local_video.play()
    local_stream=stream;

p=new Peer({ initiator: check, stream: stream,
      reconnectTimer: 100,
      iceTransportPolicy: 'relay',
      trickle: false,
      config: {
        iceServers: [
          {
            "urls": "stun:numb.viagenie.ca",
            "username": 'kumarindradevd9211@gmail.com',
            "credential": 'test@123'
          },
          {
            "urls": "turn:numb.viagenie.ca",
            "username": "kumarindradevd9211@gmail.com",
            "credential": "test@123"
          }
        ]
      }
 })
p.on('error', function (err) { console.log('error', err) })

p.on('signal', function (data) {
  if(data.type=="offer"){
     //send my offer
     if(node_data==''){//first time only
             node_data=JSON.stringify(data);
             if(my_node_id!='')
             {
               socket.emit('hand_shake',{'node_id':my_node_id,'node_data':node_data}); 
               //alert("token sent");
             } else{//not ready till
                  setTimeout(function(){ 
                     socket.emit('hand_shake',{'node_id':my_node_id,'node_data':node_data}); 
                   }, 1000);
             }
     }
  //end here
  }
    if(data.type=="answer"){
      socket.emit('broadcast_answer',{"node_id":node_id,"node_data":JSON.stringify(data)}); 
  }
})
       if((check_chat_olny==false)&&(stop_multiple_event==true))
         {
          stop_multiple_event=false;
document.querySelector('#send_button').addEventListener('click', function (ev) {
  message_handle();
})
  document.querySelector('#next_connect').addEventListener('click', function (ev) {
      window.parent.document.getElementById('reload').click(); 
})
document.querySelector('#chatMessage').addEventListener('keypress', function (e) {
                 var key = e.which || e.keyCode;
               if (key === 13) { // 13 is enter
                     document.querySelector("#send_button").click();
                     }
  })
  document.querySelector('.leave_room').addEventListener('click', function (ev) {
      window.parent.document.getElementById('leave_room').click(); 
})
  //handle media track event
  document.querySelector('.video_play_track').addEventListener('click',function(ev){
    var check_video_track=parent.check_video_track;
           if(check_video_track==true){
              parent.check_video_track=false;
           } else{
           parent.check_video_track=true;
           }
           hand_media_tracks();
  })
    document.querySelector('.audio_play_track').addEventListener('click',function(ev){
       var check_audio_track=parent.check_audio_track;
                 if(check_audio_track==true){
              parent.check_audio_track=false;
           } else{
           parent.check_audio_track=true;
           }
          hand_media_tracks();
  })
    hand_media_tracks();//initialise
  ///end here handle media tracks event
      //handle chat in phone
          document.querySelector('.start_chat').addEventListener('click',function(ev){
       var start_chat_phone=parent.start_chat_phone;
                 if(start_chat_phone==true){
              parent.start_chat_phone=false;
              document.querySelector('.chat-section').setAttribute('style','display:block;');
           } else{
           parent.start_chat_phone=true;
           document.querySelector('.chat-section').setAttribute('style','display:none;');
           }
  })
      //end here
    }
p.on('connect', function () {
  // console.log('CONNECT')
  connected=true;
  document.querySelector(".spin_loader").setAttribute('style','display:none;')
  document.querySelector(".live_status_button").innerHTML="Stranger is live!. Say Hi!.";
  document.querySelector('#chatMessage').focus();
})

p.on('data', function (data) {
  document.querySelector('#conversation').innerHTML=document.querySelector('#conversation').innerHTML+'<div class="clearfix you-message-li"><blockquote class="you-message pull-left">'+data+'</blockquote></div>';
   var objDiv = document.getElementById("conversation");
     objDiv.scrollTop = objDiv.scrollHeight;
})
  p.on('stream', function (stream) {
    // got remote video stream, now let's show it in a video tag
     document.querySelector('.logo-of-video').setAttribute('style','display:block;');
    video = document.querySelector('#remote_video')
    video.src = window.URL.createObjectURL(stream)
    video.play()
    remote_stream=stream;
  })

  p.on('close', function () {
  	//video.destroy();
      if(connected==true)
      {
           document.querySelector('#next_connect').click();//connected but they leave me then I will find next one 
      }
  })
  function hand_media_tracks(){
    images={};
    images.video_play="../assets/images/video-play.png";
    images.sound_play="../assets/images/sound-play.png";
    images.video_off="../assets/images/video-off.png";
    images.sound_off="../assets/images/sound-off.png";
    var check_video_track=parent.check_video_track;
    var check_audio_track=parent.check_audio_track;
       if(check_video_track==true){
            document.querySelector(".video_play_track_img").setAttribute('src',images.video_play)
            if(local_stream!=''){
               local_stream.getVideoTracks()[0].enabled=true;
            }
                  if(remote_stream!=''){
              remote_stream.getVideoTracks()[0].enabled=true;
                  }
                   document.querySelector(".mute_video_case").setAttribute('style','display:none;');
                 
       } else{
           document.querySelector(".video_play_track_img").setAttribute('src',images.video_off) 
                    if(local_stream!=''){
               local_stream.getVideoTracks()[0].enabled=false;
            }
                  if(remote_stream!=''){
              remote_stream.getVideoTracks()[0].enabled=false;
                  }
         document.querySelector(".mute_video_case").setAttribute('style','display:block;');
           
       }
       if(check_audio_track==true){
           document.querySelector(".audio_play_track_img").setAttribute('src',images.sound_play)
           if(remote_stream!=''){
              remote_stream.getAudioTracks()[0].enabled=true;
                  }
       } else{
          document.querySelector(".audio_play_track_img").setAttribute('src',images.sound_off)
          if(remote_stream!=''){
              remote_stream.getAudioTracks()[0].enabled=false;
                  }
       }
       //now we will mute local voice
  }


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
  if((document.querySelector('#chatMessage').value=='')||(connected==false)){
      return false;
  }
   document.querySelector('#conversation').innerHTML=document.querySelector('#conversation').innerHTML+'<div class="clearfix me-message-li"><blockquote class="me-message pull-right">'+document.querySelector('#chatMessage').value+'</blockquote></div>';
    p.send(document.querySelector('#chatMessage').value);
    document.getElementById('chatMessage').value='';
    document.querySelector('#chatMessage').value='';
    var objDiv = document.getElementById("conversation");
     objDiv.scrollTop = objDiv.scrollHeight;
}

function gotMediaError(error) {
  console.log('navigator.getUserMedia error: ', error);
   parent.chat_only_selected=false;//they will access only chat
  document.querySelector('#next_connect').click();
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
              if((document.querySelector('#chatMessage_only').value=='')||(check_chat_connected==false)||(stranger_node_id=='')){
                   return false;
              }
              var message=document.querySelector('#chatMessage_only').value;
         document.querySelector('#conversation_only').innerHTML=document.querySelector('#conversation_only').innerHTML+'<div class="clearfix me-message-li"><blockquote class="me-message pull-right">'+message+'</blockquote></div>';
               document.getElementById('chatMessage_only').value='';
              var objDiv = document.getElementById("conversation_only");
                   objDiv.scrollTop = objDiv.scrollHeight;
                   socket.emit('chat_message_broadcast',{'stranger_node_id':stranger_node_id,'my_node_id':my_node_id,'message':message});
     });
          document.querySelector('#chatMessage_only').addEventListener('keypress', function (e) {
                 var key = e.which || e.keyCode;
               if (key === 13) { // 13 is enter
                     document.querySelector("#send_button_only").click();
                     }
             });
                }
     function chat_connected(){
                check_chat_connected=true;
                document.querySelector('#chatMessage_only').focus();
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
  setdivheight();
  window.onresize = function(event) {
      setdivheight();
};
  function setdivheight(){
    var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    var checkischat=document.getElementById('conversation_section_only');
    if(checkischat!=null){
    document.getElementById('conversation_section_only').setAttribute('style','height:'+y+'px;');
    var iner=y-50;
     document.getElementById('conversation_only').setAttribute('style','height:'+iner+'px;');
    }
  }
});






