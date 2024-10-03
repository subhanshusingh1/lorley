const express = require('express');
// environmental variable
require('dotenv').config();
// database connection
const connectDB = require('./config/db');
// cookie parser
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const businessRoutes = require('./routes/businessRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const categoryRoutes = require('./routes/category.js');
const helmet = require('helmet');
const cors = require('cors');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware.js');
const compression = require('compression');


const app = express();

// security middleware
app.use(helmet());
app.use(compression());
// app.use(cors());

// Use CORS middleware
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true, 
}));
  


// parse json 
app.use(express.json());
// pare url encoded 
app.use(express.urlencoded({extended:true}));
// cookie parser
app.use(cookieParser());

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/business', businessRoutes);
// app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/business', reviewRoutes);
app.use('/api/v1/categories', categoryRoutes);

// for undefined routes and handling errors
app.use(notFound);
app.use(errorHandler);

const startServer = () => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is listening on Port: ${process.env.PORT}`)
    });
}

const startApp = async () => {
    try {

        await connectDB();
        startServer();
        
    } catch (error) {
        console.log(`Error : ${error.message}`)
    }
}

startApp();
