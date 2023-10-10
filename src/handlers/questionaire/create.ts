// Importing database
import '../../database';
import { Questionaire, Selector } from '../../models/index';

// Importing packages
import { v4 as uuid } from 'uuid';

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
        await logger.logRequest('createQuestionaire', event);
        context.callbackWaitsForEmptyEventLoop = false;
        let body = JSON.parse(event.body || '{}');

        if (body == undefined) {
            body = {};
        }

        // Fetch the selector
        const selector = await Selector.findOne({ where: { selectorID: body.selectorID } }, {});
        if (!selector) {
            // Executes in case the selector does not exist
            // Log the incident
            await logger.logNotFound('createQuestionaire', event);
            // Return the response
            return response(404, { message: translate('errors', 'user.notexist') });
        }

        // Generate a new questionaireID
        const questionaireID = await uuid();
        // Create a new Questionnaire
        await Questionaire.create({
            questionaireID: questionaireID,
            selectorID: body.selectorID,
            status: 'in-progress',
        });
        // Logs the response if all went well
        await logger.logResponse('createQuestionaire', event);
        // Return the response
        return response(200, {
            questionaireID,
            message: translate('messages', 'success'),
        });
    } catch (error) {
        // Execute in case of an internal server error
        await logger.logFailure('createQuestionaire', event, error);
        return response(500, {
            message: translate('errors', 'general'),
        });
    }
};
