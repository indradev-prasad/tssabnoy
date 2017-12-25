$(document).ready(function(){
	// $('html, body').animate({scrollTop: $("#myiframe").offset().top}, 100);
	$(document).on('click','.welcome-btn',function(){
		$(".welcomescreen").hide();
         $("#myiframe").attr('src','chat/iframe.html');
	});
});