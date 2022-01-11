const express = require('express');
const morgan = require('morgan');
const path = require('path');

require('./config/db.config');
const employeeRouter = require('./controller/employee.controller');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan('dev'));
employeeRouter(app);

app.listen(port, () => {
    console.log('Server up and running on port: ' + port);
})
