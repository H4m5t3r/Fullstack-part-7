describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user1 = {
      name: 'The Hamster',
      username: 'h4m5t3r',
      password: 'hemligt'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user1)
    const user2 = {
      name: 'User2',
      username: 'user2',
      password: 'letmein'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user2)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('h4m5t3r')
      cy.get('#password').type('hemligt')
      cy.get('#login-button').click()

      cy.contains('The Hamster logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('hamster')
      cy.get('#password').type('heml')
      cy.get('#login-button').click()

      cy.contains('wrong username or password')
      cy.get('html').should('not.contain', 'The Hamster logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'h4m5t3r', password: 'hemligt' })
    })

    it('A blog can be created and liked and deleted', function() {
      cy.get('#toggle-button').click()
      cy.get('#title').type('This is a test')
      cy.get('#author').type('testbot')
      cy.get('#url').type('www.testbot.com')
      cy.get('#submit-blog-button').click()

      cy.contains('This is a test by testbot added')
      cy.contains('This is a test testbot')
      cy.contains('view').click()
      cy.contains('www.testbot.com')
      cy.contains('likes 0')

      cy.contains('like').click()
      cy.contains('likes 1')

      cy.get('#logout-button').click()
      cy.get('#username').type('user2')
      cy.get('#password').type('letmein')
      cy.get('#login-button').click()
      cy.contains('remove').should('not.exist')

      cy.get('#logout-button').click()
      cy.get('#username').type('h4m5t3r')
      cy.get('#password').type('hemligt')
      cy.get('#login-button').click()
      cy.contains('view').click()
      cy.contains('remove').click()
      cy.contains('This is a test testbot')
        .should('not.exist')
    })

    it('Blogs are ordered according to likes', function() {
      cy.createBlog({
        title: 'urgh',
        author: 'testbot',
        url: 'www.testbot.com'
      })
      cy.createBlog({
        title: 'good',
        author: 'testbot',
        url: 'www.testbot.com'
      })
      cy.createBlog({
        title: 'favorite',
        author: 'testbot',
        url: 'www.testbot.com'
      })

      cy.contains('good')
        .parent()
        .contains('view')
        .click()
      cy.contains('good')
        .parent()
        .contains('like')
        .click()

      cy.contains('favorite')
        .parent()
        .contains('view')
        .click()
      cy.contains('favorite')
        .parent()
        .contains('like')
        .click()
      cy.wait(2000)
      cy.contains('favorite')
        .parent()
        .contains('like')
        .click()

      cy.get('.blog:first')
        .parent()
        .contains('favorite')

      cy.get('.blog:last')
        .parent()
        .contains('urgh')
    })
  })
})