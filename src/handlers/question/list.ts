// Importing database
import '../../database';
import { Question } from '../../models/index';

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
        await logger.logRequest('listQuestion', event);
        context.callbackWaitsForEmptyEventLoop = false;

        const request: any = {};
        // Obtain query params
        request.query = event.queryStringParameters
            ? event.queryStringParameters
            : {};
        let offset = 0;
        let pageSize = request.query.pageSize || 10;
        let page = request.query.page;
        if (page && page > 1) {
            offset = (page - 1) * pageSize;
        }

        // Find all the questions within the specific limit and offset (skip)
        const question = await Question.findAll({
            limit: pageSize,
            offset,
        });

        if (!question.length) {
            // Execute in case if no question found
            await logger.logNotFound('listQuestion', event);
            // Return the response
            return response(404, {
                message: translate('errors', 'notfound'),
            });
        }

        // Pagination works
        const count = await Question.count();

        const pagination = {
            total: count,
            current: parseInt(page) || 1,
            first: 1,
            last: count ? Math.ceil(count / pageSize) : 1,
            next: page < Math.ceil(count / pageSize) ? parseInt(page) + 1 : 0,
        };

        // Logs the response if all went well
        await logger.logResponse('listQuestion', event);
        // Return the response
        return response(200, {
            message: translate('messages', 'success'),
            data: question,
            pagination,
        });
    } catch (error) {
        // Execute in case of an internal server error
        await logger.logFailure('listQuestion', event, error);
        return response(500, {
            message: translate('errors', 'general'),
        });
    }
};
