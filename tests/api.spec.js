describe('Lambda Function', () => {
    it('should return a successful response with bottle count', () => {
        // Mock the query parameters
        const queryParams = {
            startOfWeek: encodeURIComponent('2023/01/01'),
            endOfWeek: encodeURIComponent('2023/10/07'),
            propertyId: 'DE_BE_000',
        };

        // Intercept the API request and mock the response
        cy.intercept({
            method: 'GET',
            url: `/dev/numa/champagne/count?${Cypress.$.param(queryParams)}`,
        }, (req) => {
            expect(req.query).to.deep.equal(queryParams); // Verify that the query parameters match the expected values
            req.reply({
                statusCode: 200,
                body: {
                    message: 'success',
                    bottleRequired: 10,
                },
            });
        }).as('lambdaRequest1');

        // Visit the endpoint with the query parameters
        cy.request({
            method: 'GET',
            url: `/dev/numa/champagne/count?${Cypress.$.param(queryParams)}}`,
            encodeUrl: false
        });

        // Wait for the API request to complete
        // cy.wait('@lambdaRequest1', null, null, 10000).then((interception) => {
        //     // Verify the response
        //     expect(interception.response.statusCode).to.equal(200);
        //     expect(interception.response.body.message).to.equal('success');
        //     expect(interception.response.body.bottleRequired).to.equal(10);
        // });
    });

    it('should return an error response with validation errors', () => {
        // Mock the query parameters
        const queryParams = {
            startOfWeek: encodeURIComponent('2023/06/01'),
            endOfWeek: '2022/10/01',
            propertyId: 'DE_BE_000',
            status: 'invalid_status', // Trigger a validation error
        };

        // Intercept the API request and mock the response
        cy.intercept('GET', '/dev/numa/champagne/count', (req) => {
            req.reply({
                statusCode: 422,
                body: {
                    "errors": {
                        "startOfWeek": "Start Of Week field is required.",
                        "endOfWeek": "End Of Week field is required."
                    }
                },
            });
        }).as('lambdaRequest2');

        // Visit the endpoint with the query parameters
        cy.request({
            method: 'GET',
            url: `/dev/numa/champagne/count?${Cypress.$.param(queryParams)}`,
            encodeUrl: false,
            failOnStatusCode: false
        });

        // // Wait for the API request to complete
        // cy.wait('@lambdaRequest2', null, null, 10000).then((interception) => {
        //     // Verify the response
        //     expect(interception.response.statusCode).to.equal(422);
        //     expect(interception.response.body.message).to.equal('Please fix following errors');
        //     expect(interception.response.body.errors.status).to.deep.equal(['Please enter valid status. Valid status are Confirmed,Cancelled.']);
        // });
    });

    it('should return an error response in case of internal server error', () => {
        // Mock the query parameters
        const queryParams = {
            startOfWeek: '2022/01/01',
            endOfWeek: '2022/01/07',
        };

        // Intercept the API request and mock an internal server error
        cy.intercept('GET', ' /dev/numa/champagne/count', (req) => {
            req.reply({
                statusCode: 500,
                body: {
                    message: 'Internal server error',
                },
            });
        }).as('lambdaRequest');

        // Visit the endpoint with the query parameters
        cy.request({
            method: 'GET',
            url: `/dev/numa/champagne/count?${Cypress.$.param(queryParams)}`,
            encodeUrl: false
        });

        // Wait for the API request to complete
        // cy.wait('lambdaRequest').then((interception) => {
        //     // Verify the response
        //     expect(interception.response.statusCode).to.equal(500);
        //     expect(interception.response.body.message).to.equal('Internal server error');
        // });
    });
});
