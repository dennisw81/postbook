import { PostsAccess } from './postsAcess'
import { PostItem } from '../models/PostItem'
import { CreatePostRequest } from '../requests/CreatePostRequest'
import { UpdatePostRequest } from '../requests/UpdatePostRequest'
import * as uuid from 'uuid'
import { parseUserId } from "../auth/utils";
import { ItemList, UpdateItemOutput, DeleteItemOutput } from 'aws-sdk/clients/dynamodb'


const postAccess = new PostsAccess()
export async function createPost(
    createPostRequest: CreatePostRequest,
    jwtToken: string
  ): Promise<PostItem> {
    const itemId = uuid.v4()
    return await postAccess.createPost({
        userId: parseUserId(jwtToken),
        postId: itemId,
        createdAt: new Date().toISOString(),
        title: createPostRequest.title,
        text: createPostRequest.text        
    })
  }

  export async function deletePost(
    postId: string, 
    jwtToken: string
  ): Promise<DeleteItemOutput> {
    const userId = parseUserId(jwtToken)
    return await postAccess.deletePost(userId, postId)
  }

  export async function updatePost(
    postId: string,
    updatePostRequest: UpdatePostRequest,    
    jwtToken: string
  ): Promise<UpdateItemOutput> {
    const userId = parseUserId(jwtToken)
    return await postAccess.updatePost(userId, postId, updatePostRequest)
  }

  export async function getPostsForUser(
    userId: string
  ): Promise<ItemList> {
    return await postAccess.getPostsForUser(userId)
  }

  
  