// Importing database
import '../../database';
import { Question, Page, Answer } from '../../models/index';

// Importing helpers
import translate from '../../helpers/translate';
import response from '../../helpers/response';
import Logger from '../../helpers/logger';
const logger = new Logger();

// Importing packages
import { v4 as uuid } from 'uuid';

/**
 * @param {AWSLambda.APIGatewayEvent} event
 * @param {AWSLambda.Context} context
 */
export const handler: AWSLambda.APIGatewayProxyHandler = async (event, context) => {
    // Initializing logger
    await logger.initiateLogger();
    try {
        // Log the initial request
        await logger.logRequest('createQuestion', event);

        context.callbackWaitsForEmptyEventLoop = false;
        let body = JSON.parse(event.body || '{}');
       

        // Find a page with a subsequent pageID
        const page = await Page.findOne({ where: { pageID: body.pageID } });

        // Update the questionIDs by adding the question id to the list of questions that are already present 
        if (!page) {
            await logger.logNotFound('createQuestion', event);
            return response(404, {
                message: translate('validations', 'page.notexist'),
            });
        }

        // Generate a new questionID
        const questionID = await uuid();

        // Initialize an empty answer array
        let answerID: string[] = [];

        if (body.answers && body.answers.length) {
           
            const newAnswer = body.answers.map((el: any) => {
                console.log(el.value)
                // Iterate through to get answers
                el.answerID = uuid();
                answerID.push(el.answerID);
                el.value = el.value;
                el.questionID = questionID;
                return el;
            });

            // Save all the answers related to that question
            await Answer.bulkCreate(newAnswer);
        }

        // Create a new question
        await Question.create({
            questionID: questionID,
            type: body.type,
            text: body.text,
            answerID: answerID,
            pageID: body.pageID,
        });

        const updatedQuestionIDs = [...page.questionID, questionID];

        // Finally, update the page in the database too
        await page.update({ questionID: updatedQuestionIDs });

        // Log the response if all went well
        await logger.logResponse('createQuestionaire', event);

        // Return the response
        return response(200, {
            message: translate('messages', 'success'),
            questionID,
        });
    } catch (error) {
        // Execute in case of an internal server error
        console.log(error, 'error');
        await logger.logFailure('createQuestionaire', event, error);
        return response(500, {
            message: translate('errors', 'general'),
        });
    }
};
