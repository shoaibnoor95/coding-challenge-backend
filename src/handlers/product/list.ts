// Importing database
import '../../database';
import { Product } from '../../models/index';

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
        logger.logRequest(`ProductList`, event);
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

        // Find products that match provided limit and skip (offset) criteria
        const product = await Product.findAll({
            limit: pageSize,
            offset,
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
        });

        if (!product.length) {
            // If the product(s) are not found
            logger.logNotFound(`ProductList`, event);

            return response(404, {
                message: translate('errors', 'notfound'),
            });
        }

        // Pagination related work
        const count = await Product.count();

        const pagination = {
            total: count,
            current: parseInt(page) || 1,
            first: 1,
            last: count ? Math.ceil(count / pageSize) : 1,
            next: page < Math.ceil(count / pageSize) ? parseInt(page) + 1 : 0,
        };

        // Logs the response if everything goes well
        logger.logResponse(`ProductList`, event);

        // Return the response
        return response(200, {
            message: translate('messages', 'success'),
            data: product,
            pagination,
        });
    } catch (error) {
        // Execute in case of an internal server error
        logger.logFailure(`ProductList`, event, error);
        return response(500, {
            message: translate('errors', 'general'),
        });
    }
};
