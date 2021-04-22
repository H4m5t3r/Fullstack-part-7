import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
// import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'
describe('<Blog />', () => {
  let blog = {
    title: 'VS Code Guide',
    author: 'TheHamster',
    url: 'www.vscodeguides.com',
    likes: 4,
    user: {
      username: 'alongCameZeus777',
      name: 'Brunhilde',
      id: '606ada6afa67a7035428475f'
    }
  }

  let user = {
    username: 'alongCameZeus777',
    name: 'Brunhilde',
    id: '606ada6afa67a7035428475f'
  }
  let component
  let mockHandler

  beforeEach(() => {
    mockHandler = jest.fn()
    component = render(
      <Blog blog={blog} user={user} addLike={mockHandler} removeBlog={mockHandler} />
    )
  })

  test('short version renders the correct content', () => {
    const div = component.container.querySelector('.short')
    expect(div).toHaveTextContent(
      blog.title, blog.author
    )
    expect(div).not.toHaveTextContent(
      blog.url, blog.likes
    )
  })

  test('does not render the extended vesion by default', () => {
    const div = component.container.querySelector('.extended')
    expect(div).toHaveStyle('display: none')
  })

  test('the url and number of likes are shown when the button is clicked', () => {
    const button = component.getByText('view')
    fireEvent.click(button)
    const div = component.container.querySelector('.extended')
    expect(div).not.toHaveStyle('display: none')
  })

  test('component function is called twice when like button is clicked twice', () => {
    const button = component.getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })

})