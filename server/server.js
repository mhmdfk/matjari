import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import session from 'express-session'; // Import express-session
import passport from './middleware/passport.js'; // Import passport
import authRoutes from "./routes/auth.js";
import dataRoutes from "./routes/data.js"
import itemRoutes from "./routes/item.js";
// import socketRoutes, { initializeSocket } from "./routes/socket.js";
import { initializeSocket } from './controllers/socketController.js';
import chatRoutes from './routes/chat.js'
import env from 'dotenv';
import verifyToken from './middleware/middleware.js';
import azure from './routes/azure.js';
import images from './routes/images.js';
import categoriesRoutes from './routes/categories.js';
import subcategoriesRoutes from './routes/subcategory.js';
import imageDescriptionRoutes from './routes/imageDesc.js';
import searchRoutes from './routes/search.js';
import favoriteRoutes from './routes/favorites.js'
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/user.js';


env.config();

const app = express();

const corsOption = {
  origin: function (origin, callback) {
    // Allow localhost for local development and the Vercel frontend
    const allowedOrigins = [
      'http://localhost:3000',  // Local development
      'https://matjari-psi.vercel.app', // Vercel production frontend

    ];

    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
// //database
// const pool = new Pool({
//     user: process.env.PGUSER,
//     host: process.env.PGHOST,
//     database: process.env.PGDATABASE,
//     password: process.env.PGPASSWORD,
//     port: process.env.PGPORT,
// });

app.use(cors(corsOption));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Add express-session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Initialize passport and session
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/data', verifyToken, dataRoutes);
//app.use('/profile', verifyToken, profileRoutes);
app.use('/api/listing', itemRoutes);
app.use('/categories', categoriesRoutes);
app.use('/subcategories', subcategoriesRoutes);
app.use('/user', userRoutes);

// app.use('/socket', socketRoutes);
app.use('/chat', chatRoutes);
app.use('/azure', azure);
app.use('/img', images);

//localhost8080:
app.use('/admin', adminRoutes);

app.use('/imageDesc', imageDescriptionRoutes);
app.use('/search', searchRoutes);
app.use('/api/favorites', favoriteRoutes);
// app.use('/', (req, res) => {
//   res.send("<h1>This is the backend server</h1>");
// });


// Create the HTTP server and initialize Socket.IO
const server = http.createServer(app);
initializeSocket(server);

// Start the server
server.listen(8080, () => {
  console.log("Server started on port 8080");
});