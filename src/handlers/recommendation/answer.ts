// Importing database
import '../../database';
import { Page, Questionaire, RecordedAnswer, Condition } from '../../models/index';

// Importing helpers
import translate from '../../helpers/translate';
import response from '../../helpers/response';

// Importing helpers
import { v4 as uuid } from 'uuid';
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
        // Logs initial request
        await logger.logRequest('postAnswer', event);
        context.callbackWaitsForEmptyEventLoop = false;
        let body = JSON.parse(event.body || '{}');
        const request: any = {};
        request.params = event.pathParameters;

       
        // Find a questionnaire if the questionnaire
        const questionaire: any = await Questionaire.findOne({ where: { questionaireID: request.params.id } });
        if (!questionaire || questionaire.status == 'completed') {
            // If the questionnaire is not available or if it is completed then execute this block
            return response(404, {
                message: translate('errors', 'questionaire_general'),
            });
        }
        let conditional: any;
        let conditionalAnswerId = null;

        const questionIDs = Object.keys(body);

        for (let i = 0; i < questionIDs.length; i++) {
            // Iterate through the answers by various ways to get the data from request body
            const answer = body[questionIDs[i]];
            const answerIds = Object.values(answer);

            const answers = await answerIds.map((el: any) => {
                if (el.skipped) {
                    return 'skipped';
                }

                if (el.conditional) {
                    conditional = true;
                    conditionalAnswerId = el.answerID;
                    return el.value;
                }
                return el.value;
            });

            if (answers.indexOf('skipped') == -1) {
                // If the answer is skipped then don't save it   
                await RecordedAnswer.create({
                    RAnswerID: await uuid(),
                    questionID: [questionIDs[i]],
                    questionaireID: request.params.id,
                    answer: answers,
                });

            }

        }

        // Find out the next page 
        let newPage = parseInt(questionaire.pageUrlEndpoint) + 1;

        const updatedData: any = {};
        const nextPage = await Page.findOne({ where: { urlEndpoint: newPage } });

        if (conditional) {
            conditional = await Condition.findOne({ where: { answerID: conditionalAnswerId } });
            updatedData.pageUrlEndpoint = conditional.urlEndPoint;
            // If the next page is available then update the questionnaire
            await questionaire.update(updatedData);
            // Logs the response if all went good
            await logger.logResponse('postAnswer', event);
            // Return the response
            return response(200, {
                message: translate('messages', 'success'),
                nextPage: updatedData.pageUrlEndpoint,
            });
        } else if (nextPage) {
            updatedData.pageUrlEndpoint = newPage;
            // If the next page is available then update the questionnaire
            await questionaire.update(updatedData);
            // Logs the response if all went good
            await logger.logResponse('postAnswer', event);

            // Return the response
            return response(200, {
                message: translate('messages', 'success'),
                nextPage: newPage,
            });
        } else {
            // If the nextpage is not available then mark the questionnaire completed
            updatedData.status = 'completed';
            await questionaire.update(updatedData);
            // Logs the response if everything went good
            await logger.logResponse('postAnswer', event);
            // Return the response
            return response(200, {
                message: translate('messages', 'completed_questionarire'),
                questionaireId: request.params.id,
            });
        }
    } catch (error) {
        // Execute in case of internal server error
        await logger.logFailure('postAnswer', event, error);
        return response(500, {
            message: translate('errors', 'general'),
        });
    }
};