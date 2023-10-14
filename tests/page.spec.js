let pageID = null
describe('Page Creation', () => {
    it('should create a new page', () => {
        // Define the request payload as per your API requirements
        const requestBody = {
            urlEndpoint: 12, // Change to a unique URL
        };

        // Send a POST request to the API endpoint
        cy.request({
            method: 'POST',
            url: '/dev/foxbase/page', // Replace with your API endpoint URL
            body: requestBody,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            // Ensure the response status code is 200 (OK) or 201 (Created), depending on your API
            expect(response.status).to.be.oneOf([200, 201]);

            // Assert on the response body
            expect(response.body).to.have.property('message');
            pageID = response.body.pageID
            // Add more assertions as needed based on your API response structure
        });
    });

    it('should throw error page already exist', () => {
        // Define the request payload as per your API requirements
        const requestBody = {
            urlEndpoint: 1, // Change to a unique URL
        };

        // Send a POST request to the API endpoint
        cy.request({
            method: 'POST',
            url: '/dev/foxbase/page', // Replace with your API endpoint URL
            body: requestBody,
            failOnStatusCode: false, // this is important for handling non-200 status codes
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            expect(response.status).to.be.eq(409);
            // Assert on the response body
            expect(response.body).to.have.property('message');
        });
    });
});
describe('Page retrieval', () => {

    it('should successfully retrieves a page', async () => {
        // const page = await Page.findOne({})
        cy.request({
            method: 'GET',
            url: `/dev/foxbase/page/${pageID}`, // replace with your endpoint and a valid page ID
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('message');
            expect(response.body).to.have.property('data');
        });
    });

    it('Returns an error for a non-existent page', () => {
        cy.request({
            method: 'GET',
            url: `/dev/foxbase/page/bc07a45d-fbe0-4fe2-b364-d0cfddf0cb7d`, // replace with your endpoint and a non-existent page ID
            failOnStatusCode: false, // this is important for handling non-200 status codes
        }).then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body).to.have.property('message');
        });
    });
});

describe('Page upgradation', () => {

    it('Should successfully updates a page', async () => {
        const requestBody = {
            urlEndpoint: 41, // Change to a unique URL
        };
        cy.request({
            method: 'PUT',
            requestBody,
            url: `/dev/foxbase/page/${pageID}`, // replace with your endpoint and a valid page ID
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('message');
            expect(response.body).to.have.property('data');
        });
    })
    it('Shoud throw error', async () => {
        const requestBody = {
            urlEndpoint: 41, // Change to a unique URL
        };
        cy.request({
            method: 'PUT',
            requestBody,
            failOnStatusCode: false, // this is important for handling non-200 status codes
            url: `/dev/foxbase/page/dc07a45d-fbe0-4fe2-b364-d0cfddf0cb7d`, // replace with your endpoint and a valid page ID
        }).then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body).to.have.property('message');
            expect(response.body).to.have.property('data');
        });
    });
})

describe('Page listing retrival', () => {
    it('should retrieve a list of pages', () => {
        cy.request({
            method: 'GET',
            url: `/dev/foxbase/page?page=1&pageSize=10`
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('message');
            expect(response.body).to.have.property('data').to.be.an('array');
        });
    });

    it('should return a 404 error if no pages are found', () => {
        cy.request({ method: 'GET', url: `/dev/foxbase/page?page=10000&pageSize=1`, failOnStatusCode: false }).then((response) => {
            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('message');
        });
    });

    it('should return a 500 error in case of internal server error', () => {
        cy.request({ method: 'GET', url: `/dev/foxbase/page?page=1&pageSize=abc`, failOnStatusCode: false }).then((response) => {
            expect(response.status).to.equal(500);
            expect(response.body).to.have.property('message');
        });
    });
});


describe('Retrieve Question By Url ', () => {
    it('should retrieve a list of pages', () => {
        cy.request({
            method: 'GET',
            url: `/dev/foxbase/page/question/1`
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('message');
            expect(response.body).to.have.property('data');
        });
    });

    it('should return a 404 error if no pages are found', () => {
        cy.request({ method: 'GET', url: `/dev/foxbase/page/question/1400`, failOnStatusCode: false }).then((response) => {
            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('message');
        });
    });

    it('should return a 500 error in case of internal server error', () => {
        cy.request({ method: 'GET', url: `/dev/foxbase/page/question/abcd`, failOnStatusCode: false }).then((response) => {
            expect(response.status).to.equal(500);
            expect(response.body).to.have.property('message');
        });
    });
});

describe('Retrieve Question By Url ', () => {
    it('should retrieve a list of pages', () => {
        cy.request({
            method: 'GET',
            url: `/dev/foxbase/page/question/1`
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('message');
            expect(response.body).to.have.property('data');
        });
    });

    it('should return a 404 error if no pages are found', () => {
        cy.request({ method: 'GET', url: `/dev/foxbase/page/question/1400`, failOnStatusCode: false }).then((response) => {
            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('message');
        });
    });

    it('should return a 500 error in case of internal server error', () => {
        cy.request({ method: 'GET', url: `/dev/foxbase/page/question/abcd`, failOnStatusCode: false }).then((response) => {
            expect(response.status).to.equal(500);
            expect(response.body).to.have.property('message');
        });
    });
});
