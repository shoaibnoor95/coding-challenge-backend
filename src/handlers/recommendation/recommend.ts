// Importing database
import '../../database';
import { RecordedAnswer, Product, Result, Questionaire, Selector } from '../../models/index';

// Importing helpers
import translate from '../../helpers/translate';
import response from '../../helpers/response';
import Logger from '../../helpers/logger';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuid } from 'uuid';
const logger = new Logger();

/**
 * @param {APIGatewayProxyEvent} event
 * @param {any} context
 * @returns {Promise<APIGatewayProxyResult>}
 */
export const handler: APIGatewayProxyHandler = async (event, context) => {
    // Initialize the logger
    await logger.initiateLogger();
    try {
        // Logs the initial request
        await logger.logRequest('recomend', event);
        context.callbackWaitsForEmptyEventLoop = false;

        let body = JSON.parse(event.body || '{}');
        const request: any = {};
        request.params = event.pathParameters;

        if (body == undefined) {
            body = {};
        }
        const result: any = await Questionaire.findOne({
            where: { questionaireID: request.params.id },
            // Include questions of that page too
            include: {
                model: Result,
            },
        });

        if (!result || result.status == "in-progress") {
            return response(404, {
                message: translate('errors', 'general'),
            });
        }
        if (result.Result) {
            return response(200, {
                message: translate('messages', 'success'),
                recommendations: result.Result.resultSummary,
            });
        }

        // Find all the recorded answers
        const recordedAnswers = await RecordedAnswer.findAll({
            where: {
                questionaireID: request.params.id,
            },
        });

        // Get the values of recorded answers
        const answers = recordedAnswers.map((answer) => answer.answer);
        // Find all the products
        const allProducts = await Product.findAll({});

        const recommendations = allProducts
            // Map through all the products
            .map((product) => {
                // Apply filter for the criteria to get the product that matches with the score
                const matchingCriteria = answers.filter((criteria: any) => {
                    // Get all the keys of productModel to run match
                    return Object.keys(product.dataValues).some((key) => {
                        // If the dataValues are matching with the recordedanswers attributes
                        return criteria.includes(product.dataValues[key]);
                    });
                });
                // Calculate the score for each product
                const score = matchingCriteria.length / answers.length;
                // Return product and scores 
                return { product, score };
            })
            // Sort the product with the score accordingly
            .sort((a, b) => b.score - a.score)
            // Get the top three products
            .slice(0, 3);
        const resultID = await uuid();

        await Result.create({
            SelectorID: result.selectorID,
            questionaireID: result.questionaireID,
            resultSummary: recommendations,
            resultID: resultID,
        });

        // Logs the response if all went good
        await logger.logResponse('recomend', event);
        // Return the response
        return response(200, {
            message: translate('messages', 'success'),
            recommendations,
        });
    } catch (error) {
        // Execute in case of internal server error
        await logger.logFailure('recomend', event, error);
        return response(500, {
            message: translate('errors', 'general'),
        });
    }
};
