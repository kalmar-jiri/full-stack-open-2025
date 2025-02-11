const express = require('express');
const app = express();
const cors = require('cors');
const Blog = require('./models/blog');
const blogRouter = require('./controllers/blogRouter');
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const mongoUrl = `mongodb+srv://gallifreden:gallifreden867@galli.30n8x.mongodb.net/bloglist?retryWrites=true&w=majority&appName=Galli`;
mongoose.connect(mongoUrl);

app.use(cors());
app.use(express.json());

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs);
  });
});

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then(result => {
    response.status(201).json(result);
  });
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
