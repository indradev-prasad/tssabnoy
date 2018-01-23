// app/routes.js
require('dotenv').config();
mailer=require('./models/mailer'); //add modles
var fs = require('fs');
chat_node_lists=require('./models/chat_node_lists'); //add modles
node_lists=require('./models/node_lists'); //add modles
module.exports = function(app) {

    if(process.env.SITE_MODE!='dev')
     {
           app.get('/*', function(req, res, next) {
    if (req.headers.host.match(/^www/) !== null ) res.redirect('http://' + req.headers.host.replace(/^www\./, '') + req.url, 301);
    else next();
});
    }

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
    app.post('/clearprevioustoken',function(req, res) {
           var token=req.body.token;
           if(token!=''){
               // node_lists.delete_node({'id':token});
               chat_node_lists.delete_node({'my_node_id':token}); 
               //delete start here
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
               //end here
           }
	});

      //The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
  res.redirect('/');
});

};
