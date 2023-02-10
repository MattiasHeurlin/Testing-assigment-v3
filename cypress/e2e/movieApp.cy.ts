beforeEach(() => {
  cy.visit('http://localhost:1234');
});

it('Find all html', () => {
  cy.get('#searchForm').should('exist');
  cy.get('#searchText').should('exist');
  cy.get('#search').should('exist');
  cy.get('#movie-container').should('exist');
});

it('show result upon search - real api call', () => {
    cy.get('#searchText').type('The Godfather').should('exist');
    cy.get('#search').click();

    cy.get('.movie:nth-child(1)>h3').should('contain', 'The Godfather')
    cy.get('img').should('exist');
  })

it('Show result upon search - fake api success call', () => {
  cy.intercept('GET', 'http://omdbapi.com/*', { fixture: 'movies' }).as(
    'omdbCall'
  );
  cy.get('#searchText').type('TheGodfather').should('exist');
  cy.get('#search').click();

  cy.wait('@omdbCall').its('request.url').should('contain', 'TheGodfather');
  cy.get('.movie').should('exist').should('have.length', 3);
  cy.get('h3').first().should('contain', 'The Godfather');
  cy.get('img').should('exist');
  cy.get('img').first().should('have.attr', 'src');
  cy.get('img')
    .first()
    .should('have.attr', 'alt')
    .should('include', 'The Godfather');
});

it('Api returns empty object, only show specifik string', () => {
  cy.intercept('GET', 'http://omdbapi.com/*', { fixture: 'emptyObject' }).as(
    'omdbCall'
  );
  cy.get('#searchText').type('Return nothing please');
  cy.get('#search').click();
  cy.get('p').contains('Inga sökresultat att visa').should('exist');
  cy.get('.movie').should('not.exist');
  cy.get('h3').should('not.exist');
  cy.get('img').should('not.exist');
});

it('Api returns error, only show specifik string', () => {
  cy.intercept('GET', 'http://omdbapi.com/*', { fixture: 'returnError' }).as(
    'omdbCall'
  );
  cy.get('#searchText').type('Return nothing please');
  cy.get('#search').click();
  cy.get('p').contains('Inga sökresultat att visa').should('exist');
  cy.get('.movie').should('not.exist');
  cy.get('h3').should('not.exist');
  cy.get('img').should('not.exist');
})
