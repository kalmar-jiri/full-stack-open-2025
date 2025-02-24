const Blog = require('../models/blog');
const User = require('../models/user');

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

const initialUsers = [
  {
    username: 'gallifreden',
    name: 'Alfred Borden',
    passwordHash: '$2b$10$SraJzb3V4GtioIJ2N3Cv4.K3VghG3DWTV4MikFn.t6nqgamDdAZsK',
  },
  {
    username: 'admin',
    name: 'Superuser',
    passwordHash: '$2b$10$sUKFygLIzEAcWlziJ81tUuAyZghn7mXr/2eYkCFWw7AuMBj6./TSe',
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(b => b.toJSON());
};

const nonExistingId = async () => {
  const newBlog = new Blog({
    title: 'Soon to be deleted',
    url: 'https://www.something.com',
  });
  await newBlog.save();
  await newBlog.deleteOne();
  return newBlog._id.toString();
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map(u => u.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
  nonExistingId,
  initialUsers,
  usersInDb,
};
