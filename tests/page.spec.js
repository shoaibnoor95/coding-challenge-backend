let pageID = null
describe('Page Creation', () => {
    it('Should create a new page', () => {
        // Define the request payload as per your API requirements
        const requestBody = {
            urlEndpoint: 40, // Change to a unique URL
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
});
describe('Page retrieval', () => {

    it('Successfully retrieves a page', async () => {
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
            expect(response.body).to.have.property('message', 'notfound');
        });
    });
});
