const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: 'Paving the way to quantum supercomputers',
    author: 'University of Oxford',
    url: 'https://www.sciencedaily.com/releases/2025/02/250205130938.htm',
    likes: 0,
  },
  {
    title: 'Always separate app and server files!',
    author: 'nermineslimane',
    url: 'https://dev.to/nermine-slimane/always-separate-app-and-server-files--1nc7',
    likes: 0,
  },
  {
    title: 'Hawking radiation',
    author: 'Wikipedia',
    url: 'https://en.wikipedia.org/wiki/Hawking_radiation',
    likes: 0,
  },
];

const blogsDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(b => b.toJSON());
};

module.exports = {
  initialBlogs,
  blogsDb,
};
