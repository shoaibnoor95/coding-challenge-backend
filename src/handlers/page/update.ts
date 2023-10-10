// Importing database
import '../../database';
import { Page } from '../../models/index';

// Importing helpers
import translate from '../../helpers/translate';
import response from '../../helpers/response';
import Logger from '../../helpers/logger';
const logger = new Logger();

/**
 * @param {AWSLambda.APIGatewayEvent} event
 * @param {AWSLambda.Context} context
 */
export const handler: AWSLambda.APIGatewayProxyHandler = async (event, context) => {
    // Initiate the logger
    await logger.initiateLogger();
    try {
        // Logs the initial request
        await logger.logRequest('updatePage', event);
        context.callbackWaitsForEmptyEventLoop = false;

        const request: any = {};
        // Obtain query params
        request.query = event.queryStringParameters
            ? event.queryStringParameters
            : {};

        request.params = event.pathParameters;
        const id =
            request.params && request.params.id;

        let body = JSON.parse(event.body || '{}');
        delete body.urlEndpoint;

        // Update the page which matches with the page id accordingly
        const [updatedPageCount, updatedPage] = await Page.update(body, {
            where: {
                pageID: id,
            },
            returning: true, // Include the updated record in the result
        });

        if (updatedPageCount === 0) {
            // Logs the response if the page was not found
            await logger.logResponse('updatePage', event);
            // Return the response with a not found status code
            return response(404, {
                message: translate('errors', 'notfound'),
                updatedPage,
            });
        }

        // Logs the response if all went good
        await logger.logResponse('updatePage', event);

        // Return the response with a success status code
        return response(200, {
            message: translate('messages', 'success'),
            updatedPage,
        });
    } catch (error) {
        // Execute in case of an internal server error
        await logger.logFailure('updatePage', event, error);
        return response(500, {
            message: translate('errors', 'general'),
        });
    }
};
