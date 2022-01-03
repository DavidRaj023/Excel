const xlsx = require('xlsx');
const path = require('path');

const workSheetColumnName = [
    "empId",
    "name",
    "phone",
    "age",
    "gender",
    "department",
    "doj",
    "salary"
]

const exportEmployees = (employees, workSheetName, filePath) => {
    const data = employees.map(employee => {
        return [employee.empId, employee.name, employee.phone, employee.age, employee.gender, employee.department, 
        employee.doj, employee.salary];
    });
    
    const workBook = xlsx.utils.book_new();
    const workSheetData = [
        workSheetColumnName,
        ... data
    ];
    const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
    xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
    xlsx.writeFile(workBook, path.resolve(filePath));
}

module.exports = exportEmployees;