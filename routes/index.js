var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var employeeModel = require('../Database/employees') //Getting employee file from database, to use employee schema
var {registerController, loginController, filterController,getUserToEditController, updateDataController, delteRowController} = require('../controllers/users')


/*
	fetch all the employee and store it in some
	variabel for furthur use
*/
var allUser  = employeeModel.find({})

function loginMiddleware(req, res, next) {
	// invalid token - synchronous
	try {
	 	jwt.verify(myToken, 'loginToken');
	} catch(err) {
		res.send("You Need to Login first to access this page")	  
	}

}

/* GET home page. */
router.get('/user', loginMiddleware, function(req, res, next) {
	allUser.exec((err, data)=> {
		if(err) throw err
		res.render('index', { title: 'Employee Records', records : data, success : ''});	
			
	})
});


/* Register Routes*/
router.get('/', (req, res, next) => res.render('register'))
router.post('/register', registerController)


/*GET Login Page*/
router.get('/login',(req, res, next) => res.render('login'))
router.post('/login', loginController)

/* Filter Page*/
router.post('/filter', filterController)

/*Edit Page*/
router.get('/edit/:id', getUserToEditController);

//Update
router.post('/update', updateDataController);

// Deleting the row
router.get('/delete/:id', delteRowController)

//Logout
router.get('/logout', (req, res) =>{
	localStorage.removeItem('myToken')
	res.render('register')
})

module.exports = router;
