let selectorID = null
let questionaireID = null

describe('Selector Creation', () => {
    it('should create a new selector', () => {
        // Define the request payload as per your API requirements
        const requestBody = {
            email: "shoaib+test@foxbase.com"
        };

        // Send a POST request to the API endpoint
        cy.request({
            method: 'POST',
            url: '/dev/foxbase/selector', // Replace with your API endpoint URL
            body: requestBody,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            // Ensure the response status code is 200 (OK) or 201 (Created), depending on your API
            expect(response.status).to.be.oneOf([200, 201]);

            // Assert on the response body
            expect(response.body).to.have.property('message');
            selectorID = response.body.selectorID
            // Add more assertions as needed based on your API response structure
        });
    });
})
describe('Questionnaire Creation', () => {
    it('should create a new questionnaire', () => {
        // Define the request payload as per your API requirements
        const requestBody = {
            selectorID // Change to a unique URL
        };

        // Send a POST request to the API endpoint
        cy.request({
            method: 'POST',
            url: '/dev/foxbase/questionaire', // Replace with your API endpoint URL
            body: requestBody,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            // Ensure the response status code is 200 (OK) or 201 (Created), depending on your API
            expect(response.status).to.be.oneOf([200, 201]);

            // Assert on the response body
            expect(response.body).to.have.property('message');
            questionaireID = response.body.questionaireID

            // Add more assertions as needed based on your API response structure
        });
    });

    it('should not create a new questionnaire', () => {
        // Define the request payload as per your API requirements
        const requestBody = {
            selectorID: "01880eda-167c-415d-aa3e-96f0fdf28d2a", // Change to a unique URL
        };

        // Send a POST request to the API endpoint
        cy.request({
            method: 'POST',
            url: '/dev/foxbase/questionaire', // Replace with your API endpoint URL
            body: requestBody,
            failOnStatusCode: false,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            // Ensure the response status code is 200 (OK) or 201 (Created), depending on your API
            expect(response.status).to.be.eq(404);
            // Assert on the response body
            expect(response.body).to.have.property('message');
        });
    });
})

describe('Questionnaire Resume', () => {

    it('should resume the questionnaire', () => {

        // Send a POST request to the API endpoint
        cy.request({
            method: 'GET',
            url: `/dev/foxbase/questionaire/${questionaireID}`, // Replace with your API endpoint URL
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            // Ensure the response status code is 200 (OK) or 201 (Created), depending on your API
            expect(response.status).to.be.oneOf([200, 201]);
            // Assert on the response body
            expect(response.body).to.have.property('message');
            questionaireID = response.body.questionaireID
        });
    });

    it('should not resume the questionnaire', () => {

        // Send a POST request to the API endpoint
        cy.request({
            method: 'GET',
            url: '/dev/foxbase/questionaire/5b4e1e13-43f7-4e93-a0d4-3885bb8ff04b',
            failOnStatusCode: false,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            expect(response.status).to.be.eq(404);
            // Assert on the response body
            expect(response.body).to.have.property('message');
        });
    });
})