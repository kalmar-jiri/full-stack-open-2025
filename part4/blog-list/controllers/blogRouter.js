const blogRouter = require('express').Router();
const Blog = require('../models/blog');

blogRouter.get('/', (req, res) => {
  Blog.find({}).then(blogs => {
    res.json(blogs);
  });
});

blogRouter.post('/', (req, res) => {
  const blog = new Blog(req.body);

  blog.save().then(res => {
    res.status(201).json(res);
  });
});

module.exports = blogRouter;
