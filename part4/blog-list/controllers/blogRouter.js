const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  res.json(blogs);
});

blogRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog) {
    res.status(200).json(blog);
  } else {
    res.status(404).end();
  }
});

blogRouter.post('/', async (req, res) => {
  const body = req.body;

  const user = await User.findOne({ username: 'admin' });

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0,
    user: user.id,
  });

  if (!blog.title || !blog.url) {
    res.status(400).send({ error: 'title or url is missing' }).end();
  } else {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    res.status(201).json(savedBlog);
  }
});

blogRouter.delete('/:id', async (req, res) => {
  try {
    const toDelete = await Blog.findByIdAndDelete(req.params.id);
    if (!toDelete) {
      res.status(404).end();
    } else {
      res.status(204).end();
    }
  } catch (excpetion) {
    res.status(400).send({ error: excpetion.message }).end();
  }
});

blogRouter.put('/:id', async (req, res) => {
  const body = req.body;
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0,
  };

  try {
    const toUpdate = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true });
    if (!toUpdate) {
      res.status(404).end();
    } else {
      res.status(200).json(blog);
    }
  } catch (excpetion) {
    res.status(400).send({ error: excpetion.message }).end();
  }
});

module.exports = blogRouter;
