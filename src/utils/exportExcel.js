
const ExcelJs = require('exceljs');
const path = require('path');
const readXlsxFile = require("read-excel-file/node");

const workbook1 = new ExcelJs.Workbook();
const worksheet1 = workbook1.addWorksheet('EMS');
    

const excelInsertAll = async(employees, headers, filePath) => {
    const workbook2 = new ExcelJs.Workbook();
    const worksheet2 = workbook2.addWorksheet('Cloud_EMS');
    worksheet2.columns = headers;

    employees.forEach(emp => {
        worksheet2.addRow(emp);
    });
    const data = await workbook2.xlsx.writeFile(filePath);
}

const excelInsert = async(employee, headers, filePath) => {
    worksheet1.columns = headers;
    worksheet1.addRow(employee);
    await workbook1.xlsx.writeFile(filePath);
}

//type: upload, download.
//upload: data from excel to db.
//download: download data from db and store to excel based on empid's.
const readExcel = async(type, req) =>{
    try {
        if (req.file == undefined) {
            throw new Error("Please upload an excel file!");
        }
        
        const filePath = path.join(__dirname, '../../resources/static/assets/uploads/')

        let file = filePath+ req.file.filename;

        let employeeIds = [];
        if(type == 'download') {
            await readXlsxFile(file).then((rows) => {
                // skip header
                rows.shift();
                
                rows.forEach((row) => {
                    employeeIds.push(row[0]);
                })
            })            
            return employeeIds;
        }
        
        let employees = [];
        await readXlsxFile(file).then((rows) => {
        // skip header
        rows.shift();

        rows.forEach((row) => {
            let employee = {
            empId: row[0],
            name: row[1],
            phone: row[2],
            age: row[3],
            gender: row[4],
            department: row[5],
            doj: row[6],
            salary: row[7]
            };
            employees.push(employee);
        });
        });
        return employees;
    } catch (error) {
        console.log(error);
        throw new Error("Could not upload the file: " + req.file.originalname, error);
    }
};


module.exports = {
    excelInsertAll, 
    excelInsert,
    readExcel
};