exports.HEADER = [
    {header: 'Emp_Id', key: 'empId', width: 10},
    {header: 'name', key: 'name', width: 10},
    {header: 'Phone', key: 'phone', width: 15},
    {header: 'Age', key: 'age', width: 10},
    {header: 'Gender', key: 'gender', width: 10},
    {header: 'Department', key: 'gender', width: 10},
    {header: 'DOJ', key: 'doj', width: 15},
    {header: 'Salary', key: 'salary', width: 10},
];

exports.EXPORT_EXCEL = './data/emp_export.xlsx';
exports.EXPORT_COLLECT = './data/emp_collect.xlsx';

exports.ERROR_EXCEL_IMPORT = 'Fail to import data into database!';
exports.ERROR_EXCEL_DOWNLOAD = 'Fail to download excelfrom database!';
exports.ERROR_No_DATA = 'No data found';
exports.ERROR_FILTER = 'Please enter the filter values';
exports.ERROR_DELETE = 'There is no employee available for this id : ';
exports.ERROR_UPDATE = 'There is no employee available for this id to update : ';

exports.SUCCESS_EXCEL_UPLOADED = 'The following excel Data successfully uploaded: ';
exports.SUCCESS_EXCEL_DOWNLOAD = 'The following excel Data successfully downloaded: ';
exports.SUCCESS_EXCEL_EXPORT = 'Excel exported successfully';

exports.SUCCESS_CREATE = 'New employee successfully added : ';
exports.SUCCESS_DELETE = 'Following Employee id related details successfully deleted : '
exports.SUCCESS_UPDATE = 'Updated'

