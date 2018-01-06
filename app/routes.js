// app/routes.js
mailer=require('./models/mailer'); //add modles
var fs = require('fs');
module.exports = function(app) {

	app.get('/',function(req, res) {
		//get active node
		var data={};
          data.total= fs.readFileSync('active_node.json', 'utf8');
           data.total=Math.floor(Math.random() * 20)+100+parseInt(data.total);
		data.page_title="TssAbnoy - Live with Strangers";
       res.render('index.ejs',{data:data}); 
	});
		app.get('/terms',function(req, res) {
					var data={};
		data.page_title="TssAbnoy - Live with Strangers";
       res.render('terms.ejs',{data:data}); 
	});
		app.get('/thank-you',function(req, res) {
					var data={};
		data.page_title="TssAbnoy - Live with Strangers";
       res.render('thankyou.ejs',{data:data}); 
	});
      app.post('/contact-post',function(req, res) {
      	mailer.send_mail(req.body);
         res.redirect('/thank-you');
	});

      //The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
  res.redirect('/');
});

};
