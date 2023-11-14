// This test is just an example and can be removed and replaced with your real application test cases.
// To learn about writing automation tests with cypress visit https://docs.cypress.io/guides/end-to-end-testing/testing-your-app

describe('Sample Test', function () {
    it('Visits the app root URL', function () {
        cy.visit('/')
        cy.contains('Next App')
    })
})

