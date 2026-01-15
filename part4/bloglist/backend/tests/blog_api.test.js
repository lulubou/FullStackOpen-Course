const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

// Blogs
describe('When there are initially some blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })

    test('Blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('All blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('Unique identifier is named \'id\'', async () => {
        const response = await api.get('/api/blogs')

        assert(response.body.every((el) => Object.hasOwn(el, 'id')) && !response.body.every((el) => Object.hasOwn(el, '_id')))
    })

    test('A valid blog can be added', async () => {
        const newBlog = {
            title: "New blog test",
            author: "Lucas Bouchard",
            url: "https://urlbidon.com/",
            likes: 2
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

        assert(blogsAtEnd.some(el => el.title === newBlog.title))
    })

    test('If likes is not specified, defaults to 0', async () => {
        const newBlog = {
            title: "New blog test no specified likes",
            author: "Lucas Bouchard",
            url: "https://urlbidon.com/"
        }

        const savedBlog = await api
            .post('/api/blogs')
            .send(newBlog)

        assert.strictEqual(savedBlog.body.likes, 0)
    })

    test('If title or url is not specified, error 400', async () => {
        const newBlogNoTitle = {
            author: "Lucas Bouchard",
            url: "https://urlbidon.com/"
        }

        const newBlogNoUrl = {
            title: "New blog test no specified likes",
            author: "Lucas Bouchard"
        }

        await api
            .post('/api/blogs')
            .send(newBlogNoTitle)
            .expect(400)

        await api
            .post('/api/blogs')
            .send(newBlogNoUrl)
            .expect(400)
    })

    test('A blog can be deleted', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        const ids = blogsAtEnd.map(n => n.id)

        assert(!ids.includes(blogToDelete.id))
        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
    })

    test('A blog can be updated', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
        const likes = blogToUpdate.likes + 1
        blogToUpdate.likes = likes

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(blogToUpdate)
            .expect(201)

        const blogsAtEnd = await helper.blogsInDb()
        const updatedBlog = blogsAtEnd.find(el => el.id === blogToUpdate.id)
        
        assert.strictEqual(updatedBlog.likes, likes)
    })
})

// Users
describe('When there is initially one user in the database', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('secret', 10)
        const user = new User({ username: 'root', name: 'rootroot', passwordHash: passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'lulubou',
            name: 'Lucas Bouchard',
            password: 'testpwd',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('Username expected to be unique'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if username is not given', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            name: 'User 1',
            password: 'pwduser1'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('Username is required'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if username is too short', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'us',
            name: 'User 2',
            password: 'pwduser2'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('Username must be at least 3 characters long'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if password is not given', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'user3',
            name: 'User 3'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('Password is required'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if password is too short', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'user4',
            name: 'User 4',
            password: 'pw',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('Password must be at least 3 characters long'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})

after(async () => {
    await mongoose.connection.close()
})