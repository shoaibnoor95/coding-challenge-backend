// importing database
import '../../database'
import { Answer, Condition } from '../../models/index'

// importing helpers
import translate from '../../helpers/translate'
import response from '../../helpers/response'
import { v4 as uuid } from 'uuid'
import { Op } from "sequelize";

import Logger from '../../helpers/logger'
const logger = new Logger()

/**
 * @param {AWSLambda.APIGatewayEvent} event
 * @param {AWSLambda.Context} context
 */
export const handler: AWSLambda.APIGatewayProxyHandler = async (event, context) => {
    // initializing logger
    await logger.initiateLogger()
    try {
        // logging the request
        await logger.logRequest('createCondition', event);
        context.callbackWaitsForEmptyEventLoop = false
        let body = JSON.parse(event.body || '{}');

        if (!body.conditions || !Array.isArray(body.conditions) || body.conditions.length !== 2) {
            // if condition is already exist for this answer id than return with the status code of 409
            return response(422, {
                message: translate('validations', 'condtion.not_valid'),
            })
        }

        const isConditionExist = await Condition.findOne({
            where: {
                [Op.or]: [
                    { answerID: body.conditions[0].answerID },
                    { answerID: body.conditions[1].answerID }
                ]
            }
        })

        if (isConditionExist) {
            // if condition is already exist for this answer id than return with the status code of 409
            return response(409, {
                message: translate('validations', 'condtion.exist'),
                data: isConditionExist
            })
        }

        await body.condtions.forEach(async element => {
            // generating a new uuid
            const conditionID = await uuid()

            // creating a new condition
            await Condition.create({
                ConditionID: conditionID,
                questionID: element.questionID,
                urlEndPoint: element.urlEndPoint,
                answerID: element.answerID
            })
            // update that answer as well
            await Answer.update({ conditional: true }, { where: { answerID: element.answerID, questionID: element.questionID } })

        });

        // logs the response if all went good
        await logger.logResponse('createCondition', event);
        return response(200, {
            message: translate('messages', 'success'),
        })

    } catch (error) {
        // execute in case of internal server error
        await logger.logFailure('createCondition', event, error);
        return response(500, {
            message: translate('errors', 'general'),
        })
    }
}
