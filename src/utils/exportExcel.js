
const ExcelJs = require('exceljs');

const empcolumns = [
    {header: 'Emp_Id', key: 'empId', width: 10},
    {header: 'name', key: 'name', width: 10},
    {header: 'Phone', key: 'phone', width: 15},
    {header: 'Age', key: 'age', width: 10},
    {header: 'Gender', key: 'gender', width: 10},
    {header: 'Department', key: 'gender', width: 10},
    {header: 'DOJ', key: 'doj', width: 15},
    {header: 'Salary', key: 'salary', width: 10},
];

const workbook1 = new ExcelJs.Workbook();
const worksheet1 = workbook1.addWorksheet('EMS');
worksheet1.columns = empcolumns;

//dataSet
const excelInsertAll = async(employees, filePath) => {
    const workbook2 = new ExcelJs.Workbook();
    const worksheet2 = workbook2.addWorksheet('Cloud_EMS');
    worksheet2.columns = empcolumns;

    employees.forEach(emp => {
        worksheet2.addRow(emp);
    });
    const data = await workbook2.xlsx.writeFile(filePath);
    console.log(data);
}

const excelInsert = async(employee, filePath) => {
    worksheet1.addRow(employee);
    await workbook1.xlsx.writeFile(filePath);
}

const deleteEmp = async(employee, filePath) => {
    worksheet.deleteRow();
    await workbook.xlsx.writeFile(filePath);
}


module.exports = {
    excelInsertAll, 
    excelInsert
};
//module.exports = excelInsert;