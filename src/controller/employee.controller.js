const express = require('express');
const router = new express.Router();
const empController = require('../services/employee.service');
const upload = require('../middleware/upload');

let routes = (app) => {
  router.post('/api/v1/employee', empController.createEmployee);
  router.get('/api/v1/employees', empController.getAllEmployees);
  router.post('/api/v1/edit-employee', empController.updateEmployee);
  router.post('/api/v1/remove-employee', empController.deleteEmployee);
  router.post('/api/v1/employees', empController.getByFilters);
  router.get('/api/v1/employees/export', empController.exportExcel);
  router.post('/api/v1/employees/upload', upload.single('file'), empController.uploadExcel);
  router.post('/api/v1/employees/download', upload.single('file'), empController.downloadExcel);
  app.use(router);
};

module.exports = routes;