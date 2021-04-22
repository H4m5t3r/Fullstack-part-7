import React, { useState } from 'react'

const BlogForm = ({ createBlog, user }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url,
      userId: user.id
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            id='title'
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          author:
          <input
            id='author'
            value={author}
            onChange={handleAuthorChange}
          />
        </div>
        <div>
          url:
          <input
            id='url'
            value={url}
            onChange={handleUrlChange}
          />
        </div>
        <button
          id={'submit-blog-button'}
          type="submit">
          create
        </button>
      </form>
    </div>
  )
}

export default BlogForm