// importing database
import '../../database'
import { Selector } from '../../models/index'

// importing packages
import { v4 as uuid } from 'uuid'

// importing helpers
import translate from '../../helpers/translate'
import response from '../../helpers/response'
import Logger from '../../helpers/logger'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const logger = new Logger()


interface Selector {
    findOne: Function;
    create: Function;
    status: string;
    selectorID: string;
    email: string;
}

/**
 * @param {APIGatewayProxyEvent} event
 * @param {any} context
 * @returns {Promise<APIGatewayProxyResult>}
 */
export const handler: APIGatewayProxyHandler = async (event, context) => {
    // initialize the logger
    await logger.initiateLogger()
    try {
        // logs the initial request
        await logger.logRequest('createSelector', event);
        context.callbackWaitsForEmptyEventLoop = false
        let body = JSON.parse(event.body || '{}')

        if (body == undefined) {
            body = {}
        }

        // first try to find the selectors
        let selector: Selector | null = await Selector.findOne({ where: { email: body.email } }, {})
        console.log(selector, 'selector')
        if (selector && selector.status == 'blocked') {
            return response(403, {
                message: translate('errors', 'user.blocked'),
            })
        }
        if (!selector) {
            // if the selector is not available in the database then create a new selector
            //generate a new uuid
            const selectorID = await uuid()
            // create selector
            selector = await Selector.create({
                selectorID: selectorID,
                email: body.email
            })
        }
        // logs the response if everything went well
        await logger.logResponse('createSelector', event);
        // return the response
        return response(200, {
            message: translate('messages', 'success'),
            selectorID: selector?.selectorID
        })

    } catch (error) {
        // execute in case of internal server error
        await logger.logFailure('createSelector', event, error);
        return response(500, {
            message: translate('errors', 'general'),
        })
    }
}
