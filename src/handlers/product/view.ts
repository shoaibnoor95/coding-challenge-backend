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

        request.params = event.pathParameters;
        const id =
            request.params && request.params.id;

        // Find one product with the specific productID
        const product: any = await Product.findOne({
            where: { productID: id },
        });

        if (!product) {
            // Execute if the product doesn't exist
            logger.logNotFound(`ProductList`, event);
            return response(404, {
                message: translate('error', 'notfound'),
            });
        }

        // Execute if all went well
        await logger.logResponse('ProductList', event);

        // Return the response
        return response(200, {
            message: translate('messages', 'success'),
            data: product,
        });
    } catch (error) {
        // Execute in case of an internal server error
        logger.logFailure(`ProductList`, event, error);
        return response(500, {
            message: translate('errors', 'general'),
        });
    }
};
