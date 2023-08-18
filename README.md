# Backend Developer Coding Challenge

## Challenge Description

As part of the recruitment process for a backend developer position, you are required to complete a coding challenge to assess your skills in our tech stack, microservices in a monorepo including relational database, REST with Node.js and Express, GraphQL. The challenge consists of three tasks focusing on different aspects of backend development.

Note: Feel free to use any additional libraries or tools you are comfortable with.

The goal is to build API for a questionaire so that:
- It is customizable though a database
- Has GraphQL API that for a provided user input (answer) can give a recommendation of products
- Here is description of the logic we require can be found furthe down the challenge

## Task 1

Model the database entities by starting from a sample payload that looks like this:
```
{
  selectorID: '43F54E00-B8F9-11EC-AB32-E792EE247845',
  pages: [
    {
      pageID: '95086460-B8FB-11EC-AB32-E792EE247845',
      urlEndpoint: '0',
      conditionals: [],
      questions: [
        {
          questionID: '95086461-B8FB-11EC-AB32-E792EE247845',
          type: 'cards',
          answers: [
            {
              answerID: '07152B60-B8FC-11EC-AB32-E792EE247845',
            },
            {
              answerID: '9507D2B0-B8FC-11EC-AB32-E792EE247845',
            },
          ],
        },
      ],
    },
    {
      pageID: '1EEB3350-B8FD-11EC-AB32-E792EE247845',
      urlEndpoint: '1',
      questions: [
        {
          questionID: '1EEB3351-B8FD-11EC-AB32-E792EE247845',
          type: 'cards',
          answers: [
            {
              answerID: '58402C00-B8FD-11EC-AB32-E792EE247845',
            },
            {
              answerID: '04031E80-B8FE-11EC-AB32-E792EE247845',
            },
            {
              answerID: '2A772CA0-B8FE-11EC-AB32-E792EE247845',
            },
          ],
        },
      ],
      conditionals: [],
    },
    {
      pageID: '688C6C80-B8FE-11EC-AB32-E792EE247845',
      urlEndpoint: '2',
      questions: [
        {
          questionID: '688C6C81-B8FE-11EC-AB32-E792EE247845',
          type: 'buttons',
          answers: [
            {
              answerID: '93F28030-B8FE-11EC-AB32-E792EE247845',
            },
            {
              answerID: '95C36FA0-B8FE-11EC-AB32-E792EE247845',
            },
          ],
        },
      ],
      conditionals: [],
    },
    {
      pageID: 'A11A1D90-B8FE-11EC-AB32-E792EE247845',
      urlEndpoint: '3',
      questions: [
        {
          questionID: 'A11A1D91-B8FE-11EC-AB32-E792EE247845',
          type: 'slider',
          answers: [
            {
              answerID: '0C22AB60-B900-11EC-AB32-E792EE247845',
            },
            {
              answerID: '1A242E00-B900-11EC-AB32-E792EE247845',
            },
            {
              answerID: '2389BA50-B900-11EC-AB32-E792EE247845',
            },
            {
              answerID: '2A2DB5A0-B900-11EC-AB32-E792EE247845',
            },
          ],
        },
      ],
      conditionals: ['93F28030-B8FE-11EC-AB32-E792EE247845'],
    },
    {
      pageID: '448AAC00-B900-11EC-AB32-E792EE247845',
      urlEndpoint: '4',
      questions: [
        {
          questionID: '448AAC01-B900-11EC-AB32-E792EE247845',
          type: 'cards',
          answers: [
            {
              answerID: 'B1F69AB0-B900-11EC-AB32-E792EE247845',
            },
            {
              answerID: 'B8441190-B900-11EC-AB32-E792EE247845',
            },
          ],
        },
      ],
      conditionals: ['95C36FA0-B8FE-11EC-AB32-E792EE247845'],
    },
    {
      pageID: 'F18449C0-B900-11EC-AB32-E792EE247845',
      urlEndpoint: '5',
      questions: [
        {
          questionID: 'F18449C1-B900-11EC-AB32-E792EE247845',
          type: 'cards',
          answers: [
            {
              answerID: '19CCC9C0-B901-11EC-AB32-E792EE247845',
            },
            {
              answerID: '41731650-B901-11EC-AB32-E792EE247845',
            },
            {
              answerID: '54F7BAF0-B901-11EC-AB32-E792EE247845',
            },
            {
              answerID: '6A22BC90-B901-11EC-AB32-E792EE247845',
            },
            {
              answerID: '79A93180-B901-11EC-AB32-E792EE247845',
            },
            {
              answerID: '8B8E56F0-B901-11EC-AB32-E792EE247845',
            },
          ],
        },
      ],
      conditionals: [],
    },
  ],
}
```
that is used by the frontend to visualize a questionnaire.
- The final database should have relational entities such as: `page`, `input`, `answer`, `product`, `result`.
- There should be more entities that allow expressing the question/answer types (see in the json that checkbox and button inputs have different attributes)

Using the ORM, provide initial migration and initial seed of the whole questionaire and the products.

## Task 2

Create a service layer that implements the business logic. The required microservices are:
- `questionnaire` - responsible for CRUD operations on the questionnaire definition (page, input, answer)
- `products` - dataset of products for a questionaire, with API that has also support for pagination (For an example dataset: https://www.foxbase.de/en/getting-started-dokumentation/import-product-data/ <-- at the bottom of the page. Otherwise you can also use a public api for random products)
- `user-input` - responsible for capturing the sessions, requests and inputs
- `recommendations` - where the logic of getting from answer to result is implemented. It should support resuming a questionaire (Here you can find a description: https://www.foxbase.de/en/getting-started-dokumentation/matrix-empfehlungslogik/)

## Task 3

It is not mentioned above, but assumed that:
- there can be more than one questionary in the system
- more than one user can be on the same questionary
- the results page should be shareable

Create a GraphQL API
- Recommendation API for guiding through the questionary
- Admin API to manage the questionary
- Support API to query statistics, with at least one query: completion rate per day (by reaching results page)
- Code must be written in TypeScript.

## Results
- Code is documented
- Application can build and run
- Tests
- Clean Code in your application ([Example Guideline](https://github.com/labs42io/clean-code-typescript))

## Submission
Please provide your solution as a fork of the repositoriy. 

---------------------------------------------------------------------------------------

**Matrix Recommendation Explanation**
|                   | Product A | Product B | Product C | Product D |
| --------        | --------- | --------- | --------- | --------- |
| Answer A   | 1         | 0         | 1         | 1         |
| Answer B   | 0         | 1         | 0         | 1         |
| Answer C   | 1         | 0         | 1         | 0         |

```
Answer A: given

Answer B: not given

Answer C: given

Product A: 1 * 1 = 1 <-- Recommend

Product B: 0 * 0 = 0 <-- Not Recommend

Product C: 1 * 1 = 1 <-- Recommend

Product D: 1 * 0 = 0 <-- Not Recommend

In essence, it's a Matrix x Vector multiplication
```
----------------------------------------------------------------------------------------

**Example Input Request from the Frontend**
```
{ 
    "95086461-B8FB-11EC-AB32-E792EE247845": { 
        "07152B60-B8FC-11EC-AB32-E792EE247845": { 
            "answerID": "07152B60-B8FC-11EC-AB32-E792EE247845", 
            "creationTimestamp": 1691066231.123, 
            "modifiedTimestamp": 1691066231.123, 
            "value": null, 
            "skipped": false 
        }, 
        "9507D2B0-B8FC-11EC-AB32-E792EE247845": { 
            "answerID": "9507D2B0-B8FC-11EC-AB32-E792EE247845", 
            "creationTimestamp": 1691066244, 
            "modifiedTimestamp": 1691066312.614, 
            "value": true 
        } 
    }, 
    "1EEB3351-B8FD-11EC-AB32-E792EE247845": { 
        "58402C00-B8FD-11EC-AB32-E792EE247845": { 
            "answerID": "58402C00-B8FD-11EC-AB32-E792EE247845", 
            "creationTimestamp": 1691066236.586, 
            "modifiedTimestamp": 1691066314.5, 
            "value": 1, 
            "skipped": false 
        }, 
        "04031E80-B8FE-11EC-AB32-E792EE247845": { 
            "answerID": "04031E80-B8FE-11EC-AB32-E792EE247845", 
            "creationTimestamp": 1691066244, 
            "modifiedTimestamp": 1691066244, 
            "value": null, 
            "skipped": false 
        }, 
        "2A772CA0-B8FE-11EC-AB32-E792EE247845": { 
            "answerID": "2A772CA0-B8FE-11EC-AB32-E792EE247845", 
            "creationTimestamp": 1691066244, 
            "modifiedTimestamp": 1691066244, 
            "value": null, 
            "skipped": false 
        } 
    }, 
    "688C6C81-B8FE-11EC-AB32-E792EE247845": { 
        "93F28030-B8FE-11EC-AB32-E792EE247845": { 
            "answerID": "93F28030-B8FE-11EC-AB32-E792EE247845", 
            "creationTimestamp": 1691066244, 
            "modifiedTimestamp": 1691066316.116, 
            "value": 'String', 
            "skipped": false 
        }, 
        "95C36FA0-B8FE-11EC-AB32-E792EE247845": { 
            "answerID": "95C36FA0-B8FE-11EC-AB32-E792EE247845", 
            "creationTimestamp": 1691066239.331, 
            "modifiedTimestamp": 1691066239.331, 
            "value": null, 
            "skipped": false 
        } 
    } 
```

-----------------------------------------------------------------------------------------
**Tree Structure Logic**

The base of each questionnaire is the question or decision tree. A question tree consists of several question levels. These later lead the customer to the right product recommendation.

The logic of a question tree looks like this:

![DecisionTree](https://github.com/bukar1337/coding-challenge/assets/47776598/320d6ba3-922b-4abb-b76b-c447733a3d41)

-----------------------------------------------------------------------------------------
**Tipps**

- Please focus on sound architecture and a clean separation of concerns regarding your code ( do not put everything into one file)
- If you have any questions while doing the challenge create an issue in your repo where we can close the issue as soon I have given a sufficient answer to your question
- Product Data can be either gotten from here: https://fakestoreapi.com/ or similar free Apis
