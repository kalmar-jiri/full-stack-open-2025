const { test, after, describe, beforeEach } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const assert = require('node:assert');
const User = require('../models/user');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  const userObjects = helper.initialUsers.map(u => new User(u));
  const promiseArrayUsers = userObjects.map(u => u.save());
  await Promise.all(promiseArrayUsers);
});

describe('creation of users', () => {
  test('initialy, there are two users in db', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    assert.strictEqual(response.body.length, helper.initialUsers.length);
  });

  test('valid user can be created', async () => {
    const usersAtStart = await helper.usersInDb();

    const user = {
      username: 'testmaster',
      name: 'Testilius',
      password: 'test-password',
    };

    await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    const usernames = usersAtEnd.map(u => u.username);
    assert(usernames.includes(user.username));
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);
  });

  test('invalid user cannot be created', async () => {
    const usersAtStart = await helper.usersInDb();

    const invalidUser = {
      username: 'te',
      name: 'Testilius',
      password: 'pw',
    };

    await api
      .post('/api/users')
      .send(invalidUser)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
