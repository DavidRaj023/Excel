const Employee = require('../model/employee');
const {excelWriteAll, excelWrite, excelRead} = require('../utils/excel');
const readXlsxFile = require("read-excel-file/node");
const path = require('path');
const constants = require('../utils/constants');



const createEmployee = async (req, res) =>{
    const emp = new Employee(req.body);
    try {
        await emp.save();
        res.status(201).send({
            message: constants.SUCCESS_CREATE +" :"+ emp.name,
        });
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
}

const getAllEmployees = async (req, res) => {
    try {
        const emp = await Employee.find({}, {_id:0, __v:0});
        emp.push({ results: emp.length });
        res.send(emp);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

const updateEmployee = async (req, res) => {
    const id = req.body.empId;
    const updates = ['name', 'phone', 'age'];
    try {
        const emp = await Employee.findOne({empId: id});
        if(!emp){
            return res.status(404).send({
                message: constants.ERROR_UPDATE + id
            });
        }

        updates.forEach((update) => emp[update] = req.body[update]);
        await emp.save();

        res.status(200).send({
            message: constants.SUCCESS_UPDATE,
            data: emp
        });
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

const deleteEmployee = async (req, res) => {
    const id = req.body.empId;
    console.log(id);
    try {
        const emp = await Employee.findOneAndDelete( {empId: id} );
        if(!emp){
            return res.status(404).send({
                message: constants.ERROR_DELETE + id    
            });
        }
        res.status(200).send({
            message: constants.SUCCESS_DELETE + id
        });
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

const exportExcel = async (req, res) => {
    try {
        // Select all from table without id and __V filed
        const employees = await Employee.find({}, {_id:0, __v:0});
        await excelWriteAll(employees, constants.HEADER, constants.EXPORT_EXCEL);
        employees.push({ results: employees.length });
        res.status(200).send({
            message: constants.SUCCESS_EXCEL_EXPORT,
        });
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

const uploadExcel = async (req, res) => {
    try {
        const employees = await excelRead('upload', req);
        await Employee.insertMany(employees);
        res.status(201).send({
            message: constants.SUCCESS_EXCEL_UPLOADED + req.file.originalname,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: constants.ERROR_EXCEL_IMPORT,
            error: error.message,
        });
    }
  
};

const downloadExcel = async(req, res) => {
    try {
        const employeeId = await excelRead('download', req);
        employeeId.forEach(async (id) => {
            let emp = await Employee.findOne({empId: id}, {_id:0, __v:0});
            await excelWrite(emp, constants.HEADER, constants.EXPORT_COLLECT)
        })
        res.status(200).send({
            message: constants.SUCCESS_EXCEL_DOWNLOAD + req.file.originalname,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: constants.ERROR_EXCEL_DOWNLOAD,
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
                        Error: constants.ERROR_FILTER
                    });
                }
                const emp = await Employee.find({ gender: value }, {_id:0, __v:0});
                if(!emp.length > 0){
                    return res.status(400).send({
                        Message: constants.ERROR_No_DATA
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
                        Error: constants.ERROR_FILTER
                    });
                }
                const emp = await Employee.find({ department: value }, {_id:0, __v:0});
                if(!emp.length > 0){
                    return res.status(400).send({
                        Message: constants.ERROR_No_DATA
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
                        Error: constants.ERROR_FILTER
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
                        Message: constants.ERROR_No_DATA
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
                        Error: constants.ERROR_FILTER
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
                        Message: constants.ERROR_No_DATA
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
                        Error: constants.ERROR_FILTER
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
                        Message: constants.ERROR_No_DATA
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