const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const blogRouter = require('./controllers/blogRouter');

mongoose.set('strictQuery', false);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log(`Connected to MongoDB`);
  })
  .catch(error => {
    console.log(`Error connecting to database: ${error.message}`);
  });

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogRouter);

module.exports = app;
