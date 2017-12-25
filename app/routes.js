// app/routes.js
//users=require('./models/users'); //add modles
module.exports = function(app) {

	app.get('/',function(req, res) {
		console.log("haiaii")
       res.render('index.ejs',{}); 
	});
};
