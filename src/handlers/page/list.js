// importing database
import '../../database'
import { Page } from '../../models/index'

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

exports.handler = async function (event, context) {
    // initializing the logger
    await logger.initiateLogger()
    try {
        // log the initial request
        await logger.logRequest('listPage', event)
        context.callbackWaitsForEmptyEventLoop = false

        const request = {}
        // obtain query params
        request.query = event.queryStringParameters
            ? event.queryStringParameters
            : {}
        let offset = 0
        let pageSize = request.query.pageSize || 10
        let page = request.query.page
        if (page && page > 1) {
            offset = (page - 1) * pageSize
        }

        // find the list of the pages
        const pages = await Page.findAll({
            limit: pageSize,
            offset,
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
        });
        if (!pages.length) {
            // executes if no page found
            await logger.logRequest('listPage', event)
            return response(404, {
                message: translate('errors', 'notfound')
            })
        }
        // logs the response if all went good
        await logger.logResponse('listPage', event)
        return response(200, {
            message: translate('messages', 'success'),
            data: pages,
        })

    } catch (error) {
        // execute in case of internal server error
        await logger.logFailure('listPage', event, error)
        return response(500, {
            message: translate('errors', 'general'),
        })
    }
}
