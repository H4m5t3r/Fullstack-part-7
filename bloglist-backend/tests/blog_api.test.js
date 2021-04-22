const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('correct number of blogs is returned', async () => {
  const blogs = await api.get('/api/blogs')
  expect(blogs.body).toHaveLength(helper.initialBlogs.length)
})

test('unique identifier is named id instead of _id', async () => {
  const blogs = await api.get('/api/blogs')
  for (let blog of blogs.body) {
    expect(blog.id).toBeDefined()
    expect(blog._id).not.toBeDefined()
  }
})

test('adding a blog with POST works correctly', async () => {
  const newBlog = {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(r => r.title)
  expect(titles).toContain(
    'Type wars'
  )
})

test('missing likes value defaults to 0', async () => {
  const newBlog = {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    __v: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const likes = response.body.map(r => r.likes)

  expect(likes[likes.length - 1]).toBe(0)
})

test('error code 400 bad request if title and url are missing', async () => {
  const newBlog = {
    _id: '5a422bc61b54a676234d17fc',
    author: 'Robert C. Martin',
    __v: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('AGAIN', async () => {
  const newBlog = {
    _id: '5a422bc61b54a676234d17fc',
    author: 'Robert C. Martin',
    __v: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('updating a blog', () => {
  test('succeeds with status code 200 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdateId = 0
    const blogToUpdate = blogsAtStart[blogToUpdateId]

    const updatedBlog = {
      title: 'VS Code Guide',
      author: 'TheHamster',
      url: 'www.vscodeguides.com',
      likes: 7
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const likes = blogsAtEnd.map(r => r.likes)

    expect(likes[0]).toBe(updatedBlog.likes)
  })
})

afterAll(() => {
  mongoose.connection.close()
})