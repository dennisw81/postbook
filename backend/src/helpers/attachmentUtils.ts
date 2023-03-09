import * as AWS from 'aws-sdk'
import { createLogger } from '../utils/logger'
import { parseUserId } from "../auth/utils";
import { UpdateItemOutput } from 'aws-sdk/clients/dynamodb';

const postsTable = process.env.POSTS_TABLE
const s3 = new AWS.S3({
    signatureVersion: 'v4'
  })
const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const logger = createLogger('attachementUtils')
const docClient = new AWS.DynamoDB.DocumentClient()

export async function generateUploadUrl(
    postId: string, 
    jwtToken: string
  ): Promise<string> {
    logger.info('Processing event: ', postId, jwtToken)
    const signedUrl = s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: postId,
        Expires: +urlExpiration
      })
    return await signedUrl
  }

  export async function setAttachementUrl(
    postId: string,
    jwtToken: string
  ): Promise<UpdateItemOutput> {
    logger.info("Update post with attachement url: " + postId)
    const userId = parseUserId(jwtToken)
      const newItem = await docClient
        .update({
          TableName: postsTable,
          Key: { 
            postId, 
            userId },
          ExpressionAttributeNames: {"#a": "attachmentUrl"},
          UpdateExpression: "set #a = :attachmentUrl",
          ExpressionAttributeValues: {
            ":attachmentUrl": `https://${bucketName}.s3.amazonaws.com/${postId}`
          },
          ReturnValues: "UPDATED_NEW"
        })
        .promise()

      logger.info("New item: " + newItem)
      return newItem
  }