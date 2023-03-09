import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient, ItemList, UpdateItemOutput, DeleteItemOutput } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { PostItem } from '../models/PostItem'
import { UpdatePostRequest } from '../requests/UpdatePostRequest'
// import { PostUpdate } from '../models/PostUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('PostsAccess')

// TODO: Implement the dataLayer logic
export class PostsAccess {

    constructor(
      private readonly docClient: DocumentClient = createDynamoDBClient(),
      private readonly postTable = process.env.POSTS_TABLE) {
    }
  
    async createPost(post: PostItem): Promise<PostItem> {
      logger.info("Create post: " + post)
      await this.docClient.put({
        TableName: this.postTable,
        Item: post
      }).promise()      
      return post
    }
  
    async getPostsForUser(userId: string): Promise<ItemList> {
      logger.info("Get posts for user: " + userId)
      const result = await this.docClient.query({
        TableName: this.postTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        },
        ScanIndexForward: false
      }).promise()
    
      return result.Items
    }

    async updatePost(userId: string, postId: string, updatePostRequest: UpdatePostRequest): Promise<UpdateItemOutput> {
      logger.info("Update post: " + postId)
      const newItem = await this.docClient
        .update({
          TableName: this.postTable,
          Key: { 
            postId, 
            userId },
          ExpressionAttributeNames: {"#Ti": "title", "#Te": "text"},
          UpdateExpression: "set #Ti = :title, #Te = :text",
          ExpressionAttributeValues: {
            ":title": updatePostRequest.title,
            ":text": updatePostRequest.text
          },
          ReturnValues: "UPDATED_NEW"
        })
        .promise()

      logger.info("New item: " + newItem)
      return newItem
    }

    async deletePost(userId: string, postId: string): Promise<DeleteItemOutput> {
      const deleteItem = await this.docClient
        .delete({
          TableName: this.postTable,
          Key: { 
            postId, 
            userId },                    
        })
        .promise()

      logger.info("Item deleted: " + deleteItem)
      return deleteItem
    }
  }
  
  function createDynamoDBClient() {
    return new XAWS.DynamoDB.DocumentClient()
  }
  