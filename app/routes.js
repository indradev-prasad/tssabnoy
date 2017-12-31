// app/routes.js
//users=require('./models/users'); //add modles
var fs = require('fs');
module.exports = function(app) {

	app.get('/',function(req, res) {
		//get active node
		var data={};
          data.total= fs.readFileSync('active_node.json', 'utf8');
           data.total=Math.floor(Math.random() * 20)+100+parseInt(data.total);
		data.page_title="TssAbnoy - Home - Live with Strangers";
       res.render('index.ejs',{data:data}); 
	});
		app.get('/terms',function(req, res) {
					var data={};
		data.page_title="TssAbnoy - Terms of service - Live with Strangers";
       res.render('terms.ejs',{data:data}); 
	});
};
