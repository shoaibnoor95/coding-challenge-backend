// Importing database
import '../../database';
import { Questionaire, Question, Page, Answer } from '../../models/index';

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
    await logger.initiateLogger();
    try {
        // Logs the initial request
        await logger.logRequest('resumeQuestionaire', event);
        context.callbackWaitsForEmptyEventLoop = false;

        const request: any = {};
        // Obtain query params
        request.query = event.queryStringParameters
            ? event.queryStringParameters
            : {};
        request.params = event.pathParameters;
        const id = request.params && request.params.id;

        // Find one questionaire with the specific questionnaireID
        const questionaire: any = await Questionaire.findOne({
            where: { questionaireID: id },
            include: {
                // Do a left join with page
                model: Page,
                // Then do a left join with questionnaire
                include: [Question],
            },
        });
        if (!questionaire || questionaire.status == 'completed') {
            // In case if the questionaire is completed or not found, this block would execute and return a 404
            await logger.logNotFound('resumeQuestionnaire', event);
            return response(404, {
                message: translate('errors', 'questionaire_general'),
            });
        }
        // In case the questionnaire is found, then it will fetch all the answers
        const answers = await Answer.findAll({ where: { questionID: questionaire.Page.questionID } });

        // Logs the response if all went well
        await logger.logResponse('resumeQuestionnaire', event);
        return response(200, {
            message: translate('messages', 'success'),
            data: { questionaire, answers },
        });
    } catch (error) {
        // Execute in case of an internal server error
        await logger.logFailure('resumeQuestionnaire', event, error);
        return response(500, {
            message: translate('errors', 'general'),
        });
    }
};
