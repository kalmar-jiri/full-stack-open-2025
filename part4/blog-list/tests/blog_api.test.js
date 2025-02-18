const { test, after, beforeEach, describe } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const assert = require('node:assert');
const Blog = require('../models/blog');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog));
  const promiseArray = blogObjects.map(blog => blog.save());
  await Promise.all(promiseArray);
});

describe('first initialization of the database', () => {
  test('blog posts are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test(`there are ${helper.initialBlogs.length} blog posts`, async () => {
    response = await api.get('/api/blogs');
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test("the unique identifier is called 'id'", async () => {
    const blogsAtStart = await helper.blogsDb();
    const specificBlog = blogsAtStart[0];
    await api
      .get(`/api/blogs/${specificBlog.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
});

describe('posting blogs', () => {
  test('a valid blog post can be added', async () => {
    const newBlog = {
      title: "Sanderson's First Law",
      author: 'Brandon Sanderson',
      url: 'https://www.brandonsanderson.com/blogs/blog/sandersons-first-law',
      likes: 0,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

    const contents = blogsAtEnd.map(b => b.content);
    assert(contents.includes(newBlog.content));
  });

  test("if 'likes' property is missing, default is 0", async () => {
    const newBlog = {
      title: "Sanderson's First Law",
      author: 'Brandon Sanderson',
      url: 'https://www.brandonsanderson.com/blogs/blog/sandersons-first-law',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsDb();
    const addedBlog = blogsAtEnd.find(b => b.title === newBlog.title);
    assert.strictEqual(addedBlog.likes, 0);
  });
});

after(async () => {
  await mongoose.connection.close();
});
