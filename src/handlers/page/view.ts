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
    // Initialize the logger
    await logger.initiateLogger();
    try {
        // Logs the initial request
        await logger.logRequest('viewPage', event);
        context.callbackWaitsForEmptyEventLoop = false;

        const request: any = {};
        // Obtain query params
        request.query = event.queryStringParameters
            ? event.queryStringParameters
            : {};

        request.params = event.pathParameters;
        const id =
            request.params && request.params.id;

        // Find only one page that matches with the particular pageID
        const page = await Page.findOne({
            where: { pageID: id },
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
        });

        if (!page) {
            // Executes if the page doesn't exist
            await logger.logNotFound('viewPage', event);
            return response(404, {
                message: translate('error', 'notfound'),
            });
        }

        // Logs if all went good
        await logger.logResponse('viewPage', event);

        // Return the response
        return response(200, {
            message: translate('messages', 'success'),
            data: page,
        });
    } catch (error) {
        // Execute in case of an internal server error
        await logger.logFailure('viewPage', event, error);
        return response(500, {
            message: translate('errors', 'general'),
        });
    }
};
