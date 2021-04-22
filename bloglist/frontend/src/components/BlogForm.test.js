import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', () => {
  const createBlog = jest.fn()

  let fakeUser = {
    username: 'alongCameZeus777',
    name: 'Brunhilde',
    id: '606ada6afa67a7035428475f'
  }

  const component = render(
    <BlogForm createBlog={createBlog} user={fakeUser} />
  )

  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(title, {
    target: { value: 'title' }
  })
  fireEvent.change(author, {
    target: { value: 'author' }
  })
  fireEvent.change(url, {
    target: { value: 'url' }
  })
  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('title')
  expect(createBlog.mock.calls[0][0].author).toBe('author')
  expect(createBlog.mock.calls[0][0].url).toBe('url')
})