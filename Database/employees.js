const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:admin@cluster0.rf4rk.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

/*
	Makign a connection to out database
*/
const db = mongoose.connection;


/*
	Defining a schema for user
*/
var employeeSchema = new mongoose.Schema({
	name : String,
	email : String,
	password : String,
	eType : String,
	hourlyRate : Number,
	totalHour : Number,
	total : Number
})

/*
	Binding our schema with model and remember Users -> will become users in our
	collection under our database
*/
var employeeModel = mongoose.model('employee', employeeSchema)



/*
	Creating our fresh user
*/
var newEmployee = new employeeModel({name : 'James', email : 'James@gmail.com', eType : "Hourly", hourlyRate : 2, totalHour : 15,total :  30})



/*
	Creating certain events
*/
db.on('connected', () => console.log("connected successfully"))

db.on('error', console.error.bind(console, 'connection error:'));

db.on('disconnected', () => console.log("disconnected successfully"))


/*
	Inserting our newUser into database
*/
// db.once('open', () => {
// 	newEmployee.save((err, res) =>{
// 		if(err) throw error;
// 		console.log(res)
// 		db.close()
// 	}) 
// })


/*
	Deleting some entries
*/
// db.once('open', () => {
// 	employeeModel.deleteMany({name : "Ross"}, (err, data) => {
// 		if(err) throw error;
// 		console.log(data)
// 		db.close()
// 	})
// })

/*
	Finding some thing from the db
*/



/*
	Filter using some properties
*/

// db.once('open', () => {
// 	employeeModel.find({ name: 'David' }  , (err, data) => {
// 		if(err) throw error;
// 		console.log(data)
// 		db.close()
// 	})
// })

module.exports = employeeModel