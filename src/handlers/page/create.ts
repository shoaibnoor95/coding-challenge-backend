// Importing database
import '../../database';
import { Page } from '../../models/index';

// Importing helpers
import translate from '../../helpers/translate';
import response from '../../helpers/response';
import { v4 as uuid } from 'uuid';
import Logger from '../../helpers/logger';
const logger = new Logger();

/**
 * @param {AWSLambda.APIGatewayEvent} event
 * @param {AWSLambda.Context} context
 */
export const handler: AWSLambda.APIGatewayProxyHandler = async (event, context) => {
    // Initializing logger
    await logger.initiateLogger();
    try {
        // Logging the request
        await logger.logRequest('createPage', event);
        context.callbackWaitsForEmptyEventLoop = false;
        let body = JSON.parse(event.body || '{}');
        if (body == undefined) {
            body = {};
        }
        const isPageExist = await Page.findOne({ where: { urlEndpoint: body.urlEndpoint } });
        if (isPageExist) {
            return response(409, {
                message: translate('validations', 'page.exist'),
            });
        }
        // Generating a new uuid
        const pageID = await uuid();
        // Creating a new page
        await Page.create({
            pageID: pageID,
            urlEndpoint: body.urlEndpoint,
        });
        // Logs the response if all went well
        await logger.logResponse('createPage', event);
        return response(200, {
            message: translate('messages', 'success'),
            pageID,
        });
    } catch (error) {
        // Execute in case of internal server error
        await logger.logFailure('createPage', event, error);
        return response(500, {
            message: translate('errors', 'general'),
        });
    }
};
