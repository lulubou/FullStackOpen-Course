const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog({
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes || 0
    })

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const { title, author, url, likes } = request.body
    const blogToUpdate = await Blog.findById(request.params.id)
    
    if (!blogToUpdate) {
        return response.status(404).end()
    }
    
    blogToUpdate.title = title
    blogToUpdate.author = author
    blogToUpdate.url = url
    blogToUpdate.likes = likes

    const savedBlog = await blogToUpdate.save()
    response.status(201).json(savedBlog)
})

module.exports = blogsRouter