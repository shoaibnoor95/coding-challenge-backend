// importing database
import '../../database'
import { Condition } from '../../models/index'

// importing helpers
import translate from '../../helpers/translate'
import response from '../../helpers/response'
import Logger from '../../helpers/logger'
const logger = new Logger()
/**
 *
 * @param {*} event
 * @param {*} context
 */
interface Event {
    body: any,
    queryStringParameters?: any
}
export const handler = async (event: Event, context: any) => {
    await logger.initiateLogger()
    try {
        // log the initial request
        await logger.logRequest('listCondition', event)
        context.callbackWaitsForEmptyEventLoop = false

        const request = { query: { pageSize: null, page: 0 }, }
        // obtain query params
        request.query = event.queryStringParameters
            ? event.queryStringParameters
            : {}

        // find the list of the conditions
        const conditions = await Condition.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
        });
        if (!conditions.length) {
            // executes if no conditions found
            await logger.logRequest('listCondition', event)
            return response(404, {
                message: translate('errors', 'notfound')
            })
        }
        // logs the response if all went good
        await logger.logResponse('listCondition', event)
        return response(200, {
            message: translate('messages', 'success'),
            data: conditions,
        })

    } catch (error) {
        // execute in case of internal server error
        await logger.logFailure('listCondition', event, error)
        return response(500, {
            message: translate('errors', 'general'),
        })
    }
}
