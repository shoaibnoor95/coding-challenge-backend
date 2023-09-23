// importing database
import '../../database'
import { Question, Page, Answer } from '../../models/index'

// importing helpers
import translate from '../../helpers/translate'
import response from '../../helpers/response'
import Logger from '../../helpers/logger'
const logger = new Logger()

// importing packages
import { v4 as uuid } from 'uuid'


/**
 *
 * @param {*} event
 * @param {*} context
 */

exports.handler = async function (event, context) {
    // initialzing logger
    await logger.initiateLogger()
    try {
        // log the initial request
        await logger.logRequest('createQuestion', event);

        context.callbackWaitsForEmptyEventLoop = false
        let body = JSON.parse(event.body)
        if (body == undefined) {
            body = {}
        }


        // find a page with a subsequent pageID
        const page = await Page.findOne({ where: { pageID: body.pageID } });
        // update the questionIDs by adding the question id to the list of question that are already present 
        if (!page) {
            await logger.logNotFound('createQuestion', event)
            return response(404, {
                message: translate('validations', 'page.notexist')
            })
        }
        // generate a new questionID
        const questionID = await uuid()
        // initialize an empty answer array
        let answerID = []
        if (body.answers && body.answers.length) {
            // console.log('in body', b)
            const newAnswer = await body.answers.map((el, i) => {
                // iterate through to get answers
                el.answerID = uuid()
                answerID.push(el.answerID)
                el.value = body.value
                el.questionID = questionID
                return el
            })
            // save all the answer related to that question
            await Answer.bulkCreate(newAnswer)
        }
        console.log(answerID, 'answerID')
        // create a new question
        await Question.create({
            questionID: questionID,
            type: body.type,
            text: body.text,
            answerID: await answerID,
            pageID: body.pageID,
        })



        const updatedQuestionIDs = [...page.questionID, questionID];
        // finally update the page in the db too.
        await page.update({ questionID: updatedQuestionIDs });

        // log the response if all went good
        await logger.logResponse('createQuestionaire', event);
        //return the response
        return response(200, {
            message: translate('messages', 'success'),
            questionID
        })

    } catch (error) {
        // execute in case of internal server error
        console.log(error, 'error')
        await logger.logFailure('createQuestionaire', event, error);
        return response(500, {
            message: translate('errors', 'general'),
        })
    }
}
