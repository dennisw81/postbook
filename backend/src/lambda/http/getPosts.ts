import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getPostsForUser as getPostsForUser } from '../../helpers/posts'
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger'
const logger = createLogger('getPosts')
// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    // const posts = '...'
    logger.info('Processing event: ', event)

    const items = await getPostsForUser(getUserId(event))

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        items
      })
    }
})

handler.use(
  cors({
    credentials: true
  })
)
