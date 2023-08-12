const express = require('express');
const app = express();
const morgan = require('morgan');
const portfolioRouter = require('./routes/portfolioRoutes');
const userRouter = require('./routes/userRoutes');

// Middleware
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}

app.use(express.json());

// Routes
app.use('/api/v1/portfolio',portfolioRouter);
app.use('/api/v1/user',userRouter);

module.exports = app;