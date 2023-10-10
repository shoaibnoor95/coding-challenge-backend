// Importing database
import '../../database';
import { Page, Question, Answer } from '../../models/index';

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
        await logger.logRequest('viewQuestionsInPage', event);
        context.callbackWaitsForEmptyEventLoop = false;

        const request: any = {};
        // Obtain query params
        request.query = event.queryStringParameters
            ? event.queryStringParameters
            : {};
        request.params = event.pathParameters;
        const id =
            request.params && request.params.id;

        // Find a page that comes in the URL
        const pageWithQuestions = await Page.findOne({
            where: { urlEndpoint: id },
            // Include questions of that page too
            include: {
                model: Question,
            },
        });
        if (!pageWithQuestions) {
            // Execute in case no page is found
            await logger.logNotFound('viewQuestionsInPage', event);
            return response(404, {
                message: translate('errors', 'notfound'),
                data: pageWithQuestions,
            });
        }

        // Find all the answers that are present on the page 
        const answers = await Answer.findAll({ where: { questionID: pageWithQuestions.questionID } });

        // Logs the response if all went well
        await logger.logResponse('viewQuestionsInPage', event);

        // Return the response
        return response(200, {
            message: translate('messages', 'success'),
            data: { pageWithQuestions, answers },
        });
    } catch (error) {
        // Execute in case of an internal server error
        await logger.logFailure('viewQuestionsInPage', event, error);
        return response(500, {
            message: translate('errors', 'general'),
        });
    }
};
