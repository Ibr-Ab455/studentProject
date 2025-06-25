import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './MongoDB/config.js';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:4000', 
  credentials: true 
}));


app.use(express.json());

// Import routes
app.use("/api/auth", userRoutes);

// Handle 404 errors

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
})

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
 connectDB();
 console.log(`Server is running on port ${PORT}`);
})