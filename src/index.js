const express = require('express');
const morgan = require('morgan');
const path = require('path');

require('./config/db.config');
const employeeRouter = require('./routes/employee.routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan('dev'));
//app.use(employeeRouter);
employeeRouter(app);

app.listen(port, () => {
    console.log('Server up and running on port: ' + port);
})

