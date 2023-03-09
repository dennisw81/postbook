import { PostsAccess } from './postsAcess'
// import { AttachmentUtils } from './attachmentUtils';
import { PostItem } from '../models/PostItem'
import { CreatePostRequest } from '../requests/CreatePostRequest'
import { UpdatePostRequest } from '../requests/UpdatePostRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import { getUserId } from '../lambda/utils'
import { parseUserId } from "../auth/utils";
import { ItemList, UpdateItemOutput, DeleteItemOutput } from 'aws-sdk/clients/dynamodb'


const postAccess = new PostsAccess()
export async function createPost(
    createPostRequest: CreatePostRequest,
    jwtToken: string
  ): Promise<PostItem> {
    // console.log('Processing event: ', createTodoRequest, jwtToken)
    const itemId = uuid.v4()
    return await postAccess.createPost({
        userId: parseUserId(jwtToken),
        postId: itemId,
        createdAt: new Date().toISOString(),
        title: createPostRequest.title,
        text: createPostRequest.text        
        // attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${itemId}`
    })
  }

  export async function deletePost(
    postId: string, 
    jwtToken: string
  ): Promise<DeleteItemOutput> {
    // console.log('Processing event: ', todoId, jwtToken)
    // const itemId = uuid.v4()
    const userId = parseUserId(jwtToken)
  
    return await postAccess.deletePost(userId, postId)
  }

  export async function updatePost(
    postId: string,
    updatePostRequest: UpdatePostRequest,    
    jwtToken: string
  ): Promise<UpdateItemOutput> {
    // console.log('Processing event: ', todoId, updateTodoRequest, jwtToken)
    // const itemId = uuid.v4()
    const userId = parseUserId(jwtToken)
  
    return await postAccess.updatePost(userId, postId, updatePostRequest)
  }

//   export async function createAttachmentPresignedUrl(
//     createTodoRequest: CreateTodoRequest,
//     jwtToken: string
//   ): Promise<TodoItem> {
  
//     return undefined
//   }

  export async function getPostsForUser(
    userId: string
  ): Promise<ItemList> {
    


    return await postAccess.getPostsForUser(userId)
  }

  
  