const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((partialSum, el) => partialSum + el.likes, 0)
}

const favoriteBlog = (blogs) => {
    const max = blogs.reduce(function (prev, current) {
        return (prev && prev.likes > current.likes) ? prev : current
    }, {})

    return max
}

const mostBlogs = (blogs) => {
    const sortedBlogsAuthors = blogs.map(el => el.author)
        .sort((a, b) =>
            blogs.filter(el => el.author === a.author).length
            - blogs.filter(el => el.author === b.author).length
        )

    const authorMostBlogs = sortedBlogsAuthors.length > 0 ? {
        author: sortedBlogsAuthors.at(-1),
        blogs: sortedBlogsAuthors.filter(el => el === sortedBlogsAuthors.at(-1)).length
    } : {}

    return authorMostBlogs
}

const mostLikes = (blogs) => {
    const sortedLikesAuthors = blogs.sort((a, b) =>
        totalLikes(blogs.filter(el => el.author === a.author))
        - totalLikes(blogs.filter(el => el.author === b.author))
    )

    const authorMostLikes = sortedLikesAuthors.length > 0 ? {
        author: sortedLikesAuthors.at(-1).author,
        likes: totalLikes(sortedLikesAuthors.filter(el => el.author === sortedLikesAuthors.at(-1).author))
    } : {}

    return authorMostLikes
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}