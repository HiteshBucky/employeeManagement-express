const employeeModel = require('../Database/employees')
var jwt = require('jsonwebtoken');

var employeeData = employeeModel.find({})

if (typeof localStorage === "undefined" || localStorage === null) {
  const LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

module.exports = {
    registerController: (req, res, next) => {
        //Getting data from post
        const { name, email, password, eType, hourlyRate, totalHour } = req.body

        // Making a newEmp
        var newEmp = employeeModel({ name, email, password, eType, hourlyRate, totalHour, total: parseInt(hourlyRate) * parseInt(totalHour) })

        // Inserting newEmp into database
        newEmp.save(function(err, emp) {
            if (err) throw err;
            employeeData.exec(function(err2, data) {
                if (err2) throw err2;
                res.render('index', { title: 'Employee Records', records: data, success: 'Record Inserted Successfully' });
            })
        })
    },
    loginController: (req, res, next) => {
        const { email, password } = req.body



        employeeModel.find({ and: [{ email }, { password }] }, (err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: "EMAIL OR PASSWORD NOT FOUND"
                })
            }

            // GENERATING TOKEN
            var token = jwt.sign({ foo: 'bar' }, 'loginToken');
            localStorage.setItem('myToken', token);

            employeeData.exec(function(err2, data) {
                if (err2) throw err2;
                res.render('index', { title: 'Employee Records', records: data, success: '' });
            })
        })
    },
    filterController: (req, res, next) => {
        var { filtername, filteremail, filtereType } = req.body

        if (filtername != '' && filteremail != '' && filtereType != '') {
            var filterparam = {
                $and: [{ name: filtername },
                    { $and: [{ email: filteremail }, { eType: filtereType }] }
                ]
            }
        } else if (filtername != '' && filteremail == '' && filtereType != '') {
            var filterparam = { $and: [{ name: filtername }, { eType: filtereType }] }
        } else if (filtername == '' && filteremail != '' && filtereType != '') {
            var filterparam = { $and: [{ email: filteremail }, { eType: filtereType }] }
        } else {
            var filterparam = {}
        }

        console.log(filterparam)
        //Filter data acc to filter
        var filteremployeeData = employeeModel.find(filterparam)

        filteremployeeData.exec(function(err2, data) {
            if (err2) throw err2;
            res.render('index', { title: 'Employee Records', records: data, success: '' });
        })
    },
    getUserToEditController: function(req, res, next) {
        var id = req.params.id;
        console.log(id)
        var getUserToEdit = employeeModel.findById(id)

        getUserToEdit.exec(function(err, data) {
            if (err) throw err;
            res.render('edit', { title: 'Employee Records', records: data, success: 'Records edited Successfully' })
        })
    },
    updateDataController: function(req, res, next) {

        //Getting data from post
        const { name, email, eType, hourlyRate, totalHour } = req.body

        var updateModel = employeeModel.findByIdAndUpdate(req.body.id, { name, email, eType, hourlyRate, totalHour })

        updateModel.exec(function(err, user) {
            if (err) throw err;
            employeeData.exec(function(err2, data) {
                if (err2) throw err2;
                res.render('index', { title: 'Employee Records', records: data, success: 'Record Updated Successfully' });
            })
        })
    },
    delteRowController: (req, res) => {
        var id = req.params.id;
        var getUserTodelte = employeeModel.findByIdAndDelete(id)

        getUserTodelte.exec(function(err, user) {
            if (err) throw err;
            employeeData.exec(function(err2, data) {
                if (err2) throw err2;
                res.render('index', { title: 'Employee Records', records: data, success: 'Record Deleted Successfully' });
            })
        })

    }

}