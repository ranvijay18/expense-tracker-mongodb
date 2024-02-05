const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');

const expenseRouter = require('./route/expense');
const userRouter = require('./route/user');
const orderRouter = require('./route/order');
const premiumRouter = require('./route/premium');

const app = express();

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    {flags: 'a'}
)

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
app.use(morgan('combined', {stream: accessLogStream}))



app.use(userRouter);
app.use(expenseRouter);
app.use(orderRouter);
app.use(premiumRouter);


mongoose.connect('mongodb+srv://ranvi:2580%40Ranvi@cluster0.j1shrhc.mongodb.net/?retryWrites=true&w=majority')
.then(() => {
    app.listen(process.env.PORT || 8000);
})
.catch(err => {
    console.error(err);
})


