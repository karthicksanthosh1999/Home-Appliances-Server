import express, { Response, Request } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routers/userRoute';
import cookieParser = require('cookie-parser');
import authRouter from './routers/authRouter';
import branchRouter from './routers/branchRouter';
import customerRouter from './routers/customerRouter';
import productRouter from './routers/productRouter';
import employeeRouter from './routers/employeeRouter';
import invoiceRouter from './routers/invoiceRouter';
import leadRouter from './routers/leadRouter';
import dashboardRouter from './routers/dashboardController';
import quotationRouter from './routers/quotationRouter';
import deliveryRouter from './routers/deviveryRoutes';
import { errorHandler } from './middleware/errorHandler';
import giftRouter from './routers/giftRouter';
import giftAssignRouter from './routers/giftAssignRouter';


dotenv.config()

const app = express();

app.use(
    cors({
        origin: ["http://localhost:5173", "https://democrm.wizinoa.com"],
        methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
        credentials: true,
    })
);
app.use(express.json())

cloudinary.config({
    cloud_name: 'dclkepvlu',
    api_key: '763287416889231',
    api_secret: 'HTZ6um7bt8XUYFh-Ms4_CPfj53w',
});

// Use cookie-parser middleware
app.use(cookieParser());

// Test page
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to our Wizinoa CRM"
    })
})

// Dashboard
app.use('/api/dashboard', dashboardRouter)

// USERS
app.use('/api/users', userRouter)

// AUTH
app.use('/api/auth', authRouter);

// BRANCH
app.use('/api/branch', branchRouter)

// CUSTOMERS
app.use('/api/customer', customerRouter)

// PRODUCT
app.use('/api/product', productRouter)

// EMPLOYEES
app.use('/api/employee', employeeRouter)

// INVOICE
app.use('/api/invoice', invoiceRouter)

// QUOTATION
app.use('/api/quotation', quotationRouter)

// LEAD
app.use('/api/lead', leadRouter)

// DELIVERY
app.use('/api/delivery', deliveryRouter)

// GIFT
app.use('/api/gift', giftRouter)

// GIFT ASSIGNMENT
app.use('/api/giftAssign', giftAssignRouter)


app.use(errorHandler);

mongoose.connect(process.env.MONGODB_URL || "mongodb+srv://wizinoa_site:5h7fPti0txF9lvqY@cluster0.pevnj2b.mongodb.net/crm?retryWrites=true&w=majority&appName=crm").then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`SERVER CONNECTED ON -- http://localhost:${process.env.PORT}`)
    })
}).catch((error) => {
    console.log(error)
})

