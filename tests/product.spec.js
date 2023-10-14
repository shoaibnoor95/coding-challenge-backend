
let productID = null
describe('Question listing retrival', () => {
    it('should retrieve a list of questions', () => {
        cy.request({
            method: 'GET',
            url: `/dev/foxbase/product?page=1&pageSize=3`
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('message');
            productID = response.body.data[0].productID
            expect(response.body).to.have.property('data').to.be.an('array');
        });
    });

    it('should return a 404 error if no questions are found', () => {
        cy.request({ method: 'GET', url: `/dev/foxbase/product?page=10000&pageSize=3`, failOnStatusCode: false }).then((response) => {
            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('message');
        });
    });

    it('should return a 500 error in case of internal server error', () => {
        cy.request({ method: 'GET', url: `/dev/foxbase/question?page=1&pageSize=abc`, failOnStatusCode: false }).then((response) => {
            expect(response.status).to.equal(500);
            expect(response.body).to.have.property('message');
        });
    });
});

describe('Product retrieval', () => {

    it('Successfully retrieves a product', async () => {
        cy.request({
            method: 'GET',
            url: `/dev/foxbase/product/${productID}`,
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('message');
            expect(response.body).to.have.property('data');
        });
    });

    it('Returns an error for a non-existent page', () => {
        cy.request({
            method: 'GET',
            url: `/dev/foxbase/product/bc07a45d-fbe0-4fe2-b364-d0cfddf0cb7d`,
            failOnStatusCode: false,

        }).then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body).to.have.property('message');
        });
    });

});