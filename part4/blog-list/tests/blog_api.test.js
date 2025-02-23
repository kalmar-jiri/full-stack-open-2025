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
  const promiseArrayBlogs = blogObjects.map(blog => blog.save());
  await Promise.all(promiseArrayBlogs);
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
    const blogsAtStart = await helper.blogsInDb();
    const specificBlog = blogsAtStart[0];
    await api
      .get(`/api/blogs/${specificBlog.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
});

describe('creating blogs', () => {
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

    const blogsAtEnd = await helper.blogsInDb();
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

    const blogsAtEnd = await helper.blogsInDb();
    const addedBlog = blogsAtEnd.find(b => b.title === newBlog.title);
    assert.strictEqual(addedBlog.likes, 0);
  });

  test('blog w/ missing title is not saved', async () => {
    const noTitleBlog = {
      author: 'Brandon Sanderson',
      url: 'https://www.brandonsanderson.com/blogs/blog/sandersons-first-law',
      likes: 0,
    };

    await api.post('/api/blogs').send(noTitleBlog).expect(400);
    const blogsAtEnd = helper.blogsInDb();
    assert.strictEqual((await blogsAtEnd).length, helper.initialBlogs.length);
  });

  test('blog w/ missing url is not saved', async () => {
    const noUrlBlog = {
      title: "Sanderson's First Law",
      author: 'Brandon Sanderson',
      likes: 0,
    };

    await api.post('/api/blogs').send(noUrlBlog).expect(400);
    const blogsAtEnd = helper.blogsInDb();
    assert.strictEqual((await blogsAtEnd).length, helper.initialBlogs.length);
  });
});

describe('deleting blogs', () => {
  test('blog w/ valid id is deleted', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const toDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${toDelete.id}`).expect(204);
    const blogsAtEnd = await helper.blogsInDb();
    const ids = blogsAtEnd.map(b => b.id);
    assert(!ids.includes(toDelete.id));
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
  });

  test('valid but non-existing id returns 404', async () => {
    const nonExistingId = await helper.nonExistingId();
    await api.delete(`/api/blogs/${nonExistingId}`).expect(404);
  });

  test('invalid id returns 400', async () => {
    const invalidId = '59a1256saasd56a4sd65321a';
    await api.delete(`/api/blogs/${invalidId}`).expect(400);
  });
});

describe('updating blogs', () => {
  test('updating valid blog succeeds', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const toUpdate = blogsAtStart[0];

    // // Either only update the relevant property
    // const newBlog = {
    //   likes: 31415,
    // };

    // Or copy the whole object
    const newBlog = {
      title: toUpdate.title,
      author: toUpdate.author,
      url: toUpdate.url,
      likes: 31415,
    };

    await api
      .put(`/api/blogs/${toUpdate.id}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);

    const likes = blogsAtEnd.map(b => b.likes);
    assert(likes.includes(newBlog.likes));
  });

  test('non-existing id returns 404', async () => {
    const newBlog = {
      title: 'NEW TITLE',
    };

    const nonExistingId = await helper.nonExistingId();
    await api.put(`/api/blogs/${nonExistingId}`).send(newBlog).expect(404);
  });

  test('invalid id format returns 400', async () => {
    const newBlog = {
      title: 'NEW TITLE',
    };

    const nonExistingId = '123456789abc';
    await api.put(`/api/blogs/${nonExistingId}`).send(newBlog).expect(400);
  });
});
