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
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    if(!(x>480 &&x<700)){
     y=y-50;//exclude header
    }
    document.getElementById("myiframe").setAttribute('style','min-height:'+y+'px;');
  }


});


$(document).ready(function(){
	// var height=$(window).height();
	// alert(height+"hieght");
	// var height=$(window).width();
	// alert(height+"width");
	// $('html, body').animate({scrollTop: $("#myiframe").offset().top}, 100);
	$(document).on('click','.welcome-btn',function(){
		$(".welcomescreen").hide();
         $("#myiframe").attr('src','chat/iframe.html');
	});
	$(document).on('click','.select_chat_only',function(){
		chat_only_selected=false;
		$(".welcomescreen").hide();
         $("#myiframe").attr('src','chat/iframe.html');
	});

   window.onbeforeunload = function(){
        $.ajax({url: "/clearprevioustoken",
        	type:"POST",
           data:{'token':previous_token},
              success: function(result){
           }
       
            });
            };

	$(document).on('click','.logo',function(){
          window.location.href="/";
	});
	var contact_form_obj=$("#contact-form");
	$(document).on('submit','#contact-form',function(){
        var email=validate_email();
        var name=validate_name();
        var comment=validate_comment();
        if(!(email && name && comment)){
              return false;
        }
	});
	$(document).on('keyup','#name',function(){
             validate_name();
	});
	$(document).on('keyup','#email',function(){
             validate_email();
	});
	$(document).on('keyup','#comment',function(){
             validate_comment();
	});
	function validate_name(){
		var return_val=false;
        var name=contact_form_obj.find("#name").val();
        contact_form_obj.find("#name").parent().find(".error").remove();
        if(name!='')
        {
          if (name.length<35){
                      return_val=true;
            }
            else{
               //invalid email
               contact_form_obj.find("#name").parent().append("<p class='error'>Name can't be greater than 35 charactors.</p>");
            }

        } else{
        	 contact_form_obj.find("#name").parent().append("<p class='error'>Please enter your name.</p>");
        	//required email
        }
        return return_val;
	}
	function validate_email(){
		var return_val=false;
		var EMAIL_REGEXP = /^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
        var email=contact_form_obj.find("#email").val();
        contact_form_obj.find("#email").parent().find(".error").remove();
        if(email!='')
        {
          if (EMAIL_REGEXP.test(email)){
                      return_val=true;
            }
            else{
               //invalid email
               contact_form_obj.find("#email").parent().append("<p class='error'>Please enter a valid email address.</p>");
            }

        } else{
        	 contact_form_obj.find("#email").parent().append("<p class='error'>Please enter email address.</p>");
        	//required email
        }
        return return_val;
	}
	function validate_comment(){
           		var return_val=false;
              var comment=contact_form_obj.find("#comment").val();
        contact_form_obj.find("#comment").parent().find(".error").remove();
        if(comment!='')
        {
          if (comment.length<1000){
          	       if(comment.length<5)
          	       {
                      contact_form_obj.find("#comment").parent().append("<p class='error'>Query cant't be less than 5 charactors.</p>");
          	       }
          	       else{
                   return_val=true;
          	       }
            }
            else{
               //invalid email
               contact_form_obj.find("#comment").parent().append("<p class='error'>Query cant't be greater than 1000 charactors.</p>");
            }

        } else{
        	 contact_form_obj.find("#comment").parent().append("<p class='error'>Please enter your query.</p>");
        	//required email
        }
        return return_val;
	}
});