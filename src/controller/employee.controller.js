const Employee = require('../model/employee');
const {excelInsert, excelInsertAll, readExcel} = require('../utils/exportExcel');
const readXlsxFile = require("read-excel-file/node");
const path = require('path');

const filePath = './data/emp-details.xlsx';
const headers = [
    {header: 'Emp_Id', key: 'empId', width: 10},
    {header: 'name', key: 'name', width: 10},
    {header: 'Phone', key: 'phone', width: 15},
    {header: 'Age', key: 'age', width: 10},
    {header: 'Gender', key: 'gender', width: 10},
    {header: 'Department', key: 'gender', width: 10},
    {header: 'DOJ', key: 'doj', width: 15},
    {header: 'Salary', key: 'salary', width: 10},
];

const createEmployee = async (req, res) =>{
    const emp = new Employee(req.body);
    try {
        await emp.save();
        await excelInsert(emp, headers, './data/emp_details.xlsx')
        res.status(201).send(emp);
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
}

const getAllEmployees = async (req, res) => {
    try {
        const emp = await Employee.find({}, {_id:0, __v:0});// Select all from table without id and __V filed
        emp.push({ results: emp.length });
        res.send(emp);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

const updateEmployee = async (req, res) => {
    const id = req.body.empId;
    console.log(id);
    const updates = ['name', 'phone', 'age'];
    try {
        const emp = await Employee.findOne({empId: id});
        if(!emp){
            return res.status(404).send();
        }

        updates.forEach((update) => emp[update] = req.body[update]);
        await emp.save();

        res.send(emp);
    } catch (e) {
        res.status(500).send(e);
    }
}

const deleteEmployee = async (req, res) => {
    const id = req.body.empId;
    console.log(id);
    try {
        const emp = await Employee.findOneAndDelete( {empId: id} );
        if(!emp){
            return res.status(404).send();
        }
        res.send(emp);
    } catch (e) {
        res.status(500).send(e);
    }
}

const exportExcel = async (req, res) => {
    try {
        const employees = await Employee.find({}, {_id:0, __v:0});// Select all from table without id and __V filed
        await excelInsertAll(employees, headers, './data/emp_export.xlsx');
        employees.push({ results: employees.length });
        res.send(employees);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

const uploadExcel = async (req, res) => {
    try {
        const employees = await readExcel('upload', req);
        console.log('upload excel');
        console.log(employees);
        await Employee.insertMany(employees);
        res.status(201).send({
            message: "The following excel Data successfully uploaded: " + req.file.originalname,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Fail to import data into database!",
            error: error.message,
          });
    }
  
};

//Currently working.....
const downloadExcel = async(req, res) => {
    try {
        const employeeId = await readExcel('download', req);
        console.log('downloadExcel excel');
        console.log(employeeId.length());
        var employees = [];
        employeeId.forEach((id) => {
            console.log(id);
            var emp = Employee.findOne({empId: id}, {_id:0, __v:0});
            employees.push(emp);
        })

        // for (i =1; i<=employeeId.length(); i++){

        // }
        console.log(employees);
        await excelInsertAll(employees, headers, './data/emp_collect.xlsx');
        res.status(200).send({
            message: "The following excel Data successfully downloaded: " + req.file.originalname,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Fail to import data into database!",
            error: error.message,
          });
    }
};


const getByFilters = async (req, res) => {
    const filter = req.body.filter;
    switch (filter) {
        case 'all':
            try {
                console.log('Filter: ' + filter);
                const emp = await Employee.find({}, {_id:0, __v:0});
                res.send(emp);
            } catch (e) {
                res.status(500).send(e);
            }
            break;

        case 'gender':
            try {
                const value = req.body.value;
                if(!value){
                    return res.status(400).send({
                        Code: '400',
                        Error: 'Please enter the filter values'
                    });
                }
                const emp = await Employee.find({ gender: value }, {_id:0, __v:0});
                if(!emp.length > 0){
                    return res.status(400).send({
                        Message: 'No data found'
                    });
                }
                res.send(emp);
            } catch (e) {
                res.status(500).send(e);
            }
            break;

        case 'department':
            try {
                const value = req.body.value;
                if(!value){
                    return res.status(400).send({
                        Code: '400',
                        Error: 'Please enter the filter values'
                    });
                }
                const emp = await Employee.find({ department: value }, {_id:0, __v:0});
                if(!emp.length > 0){
                    return res.status(400).send({
                        Message: 'No data found'
                    });
                }
                res.send(emp);
            } catch (e) {
                res.status(500).send(e);
            }
            break;

        case 'age':
            try {
                const option = req.body.option; 
                const value = req.body.value;
                if(!option || !value){
                    return res.status(400).send({
                        Code: '400',
                        Error: 'Please enter the filter values and options'
                    });
                }
                console.log('Filter: ' + filter + ' Option: ' + option + ' Value: ' + value);
                let emp = {};
                if(option === 'less_than'){
                    emp = await Employee.find({ age: { $lt: value } }, {_id:0, __v:0});
                }else if(option === 'greater_than'){
                    emp = await Employee.find({ age: { $gt: value } }, {_id:0, __v:0});
                }
                if(!emp.length > 0){
                    return res.status(400).send({
                        Message: 'No data found'
                    });
                }
                res.send(emp);
            } catch (e) {
                res.status(500).send(e);
            }
            break;

        case 'salary':
            try {
                const option = req.body.option; 
                const value = req.body.value;
                if(!option || !value){
                    return res.status(400).send({
                        Code: '400',
                        Error: 'Please enter the filter values and options'
                    });
                }
                console.log('Filter: ' + filter + ' Option: ' + option + ' Value: ' + value);
                let emp = {};
                if(option === 'less_than'){
                    emp = await Employee.find({ salary: { $lt: value } }, {_id:0, __v:0});
                }else if(option === 'greater_than'){
                    emp = await Employee.find({ salary: { $gt: value } }, {_id:0, __v:0});
                }
                if(!emp.length > 0){
                    return res.status(400).send({
                        Message: 'No data found'
                    });
                }
                res.send(emp);
            } catch (e) {
                res.status(500).send(e);
            }
            break;

        case 'doj':
            try {
                const option = req.body.option; 
                const value = req.body.value;
                if(!option || !value){
                    return res.status(400).send({
                        Code: '400',
                        Error: 'Please enter the filter values and options'
                    });
                }
                console.log('Filter: ' + filter + ' Option: ' + option + ' Value: ' + value);
                let emp = {};
                if(option === 'before'){
                    emp = await Employee.find({ doj: { $lt: value } }, {_id:0, __v:0});                    
                }else if(option === 'after'){
                    emp = await Employee.find({ doj: { $gt: value } }, {_id:0, __v:0});
                }
                if(!emp.length > 0){
                    return res.status(400).send({
                        Message: 'No data found'
                    });
                }
                res.send(emp);
            } catch (e) {
                res.status(500).send(e);
            }
            break;

        default:
            res.status(400).send({
                "Message": "This filter is not available: " +filter
            })
            break;
    }
}

module.exports = {
    createEmployee,
    getAllEmployees,
    updateEmployee,
    deleteEmployee,
    getByFilters,
    exportExcel,
    uploadExcel,
    downloadExcel
}