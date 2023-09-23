let pageID = null
let quesID = null
describe('Question Creation', () => {

    it('First it should retrieve any page', () => {

        // Send a POST request to the API endpoint
        cy.request({
            method: 'GET',
            url: '/dev/foxbase/page?pageSize=1&page=1', // Replace with your API endpoint URL
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            // Ensure the response status code is 200 (OK) or 201 (Created), depending on your API
            expect(response.status).to.be.oneOf([200, 201]);

            // Assert on the response body
            expect(response.body).to.have.property('message');
            pageID = response.body.data[0].pageID
            // Add more assertions as needed based on your API response structure
        });
    });

    it('Should create a new page', () => {

        // Define the request payload as per your API requirements
        const requestBody = {
            "type": "card",
            "pageID": pageID,
            "text": "What is your name?",
            "answers": [{
                "value": "Shoaib"
            },
            {
                "value": "Noor"
            }]
        };

        // Send a POST request to the API endpoint
        cy.request({
            method: 'POST',
            url: '/dev/foxbase/question', // Replace with your API endpoint URL
            body: requestBody,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            // Ensure the response status code is 200 (OK) or 201 (Created), depending on your API
            expect(response.status).to.be.oneOf([200, 201]);

            // Assert on the response body
            expect(response.body).to.have.property('message');
            quesID = response.body.quesID
            // Add more assertions as needed based on your API response structure
        });
    });

    it('Should not create a new page', () => {

        // Define the request payload as per your API requirements
        const requestBody = {
            "type": "card",
            "pageID": "bc07a45d-fbe0-4fe2-b364-d0cfddf0cb7d",
            "text": "What is your name?",
            "answers": [{
                "value": "Shoaib"
            },
            {
                "value": "Noor"
            }]
        };

        // Send a POST request to the API endpoint
        cy.request({
            method: 'POST',
            url: '/dev/foxbase/question', // Replace with your API endpoint URL
            failOnStatusCode: false, // this is important for handling non-200 status codes
            body: requestBody,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            // Ensure the response status code is 200 (OK) or 201 (Created), depending on your API
            expect(response.status).to.eq(404);
            expect(response.body).to.have.property('message');
            // Add more assertions as needed based on your API response structure
        });
    });
});
describe('Question retrieval', () => {

    it('Successfully retrieves a questions', async () => {
        // const page = await Page.findOne({})
        cy.request({
            method: 'GET',
            url: `/dev/foxbase/question/${quesID}`, // replace with your endpoint and a valid page ID
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('message');
            expect(response.body).to.have.property('data');
        });
    });

    it('Returns an error for a non-existent page', () => {
        cy.request({
            method: 'GET',
            url: `/dev/foxbase/question/bc07a45d-fbe0-4fe2-b364-d0cfddf0cb7d`, // replace with your endpoint and a non-existent page ID
            failOnStatusCode: false, // this is important for handling non-200 status codes
        }).then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body).to.have.property('message');
        });
    });
});
