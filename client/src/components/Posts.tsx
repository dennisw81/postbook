import dateFormat from 'dateformat'
import { History } from 'history'
// import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  // Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  TextArea
} from 'semantic-ui-react'

import { createPost, deletePost, getPosts } from '../api/posts-api'
import Auth from '../auth/Auth'
import { Post } from '../types/Post'

interface PostsProps {
  auth: Auth
  history: History
}

interface PostsState {
  posts: Post[]
  newPostTitle: string
  newPostText: string
  loadingPosts: boolean
}

const postStyle = {
  display: 'block',
  overflow: 'auto',
  margin: '10px'
}; 

const inputStyle = {
  width: '100%'
}; 

const textAreaStyle = {
  width: '100%',
  border: '1px solid rgba(34,36,38,.15)',
  padding: '1em'
}; 

const invisibleDividerStyle = {
  borderTop: '0px solid white',
  height: '1px'
}; 

const iconStyle = {
  margin: '5!important'
}; 

export class Posts extends React.PureComponent<PostsProps, PostsState> {
  state: PostsState = {
    posts: [],
    newPostTitle: '',
    newPostText: '',
    loadingPosts: true
  }

  

  handlePostTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {    
    if(event.target.id === 'postTitle')
      this.setState({ newPostTitle: event.target.value })
  }

  handlePostTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if(event.target.id === 'postText')
      this.setState({ newPostText: event.target.value })
  }

  onEditButtonClick = (pos: number) => {
    const post = this.state.posts[pos]
    localStorage.setItem('postTitle', post.title);
    localStorage.setItem('postText', post.text);
    this.props.history.push(`/posts/${post.postId}/edit`)
  }

  onPostCreate = async () => {
    try {
      // const dueDate = this.calculateDueDate()
      const newPost = await createPost(this.props.auth.getIdToken(), {
        title: this.state.newPostTitle,
        text: this.state.newPostText
      })
      this.setState({
        posts: [...this.state.posts, newPost],
        newPostTitle: '',
        newPostText: ''
      })
    } catch {
      alert('Post creation failed')
    }
  }

  onPostDelete = async (postId: string) => {
    try {
      await deletePost(this.props.auth.getIdToken(), postId)
      this.setState({
        posts: this.state.posts.filter(post => post.postId !== postId)
      })
    } catch {
      alert('Post deletion failed')
    }
  }

  // onEditButtonClick = async (pos: number) => {
  //   try {
  //     const post = this.state.posts[pos]
  //     console.log(pos)
  //     console.log(this.state.posts)
  //     await patchPost(this.props.auth.getIdToken(), post.postId, {
  //       title: post.title,
  //       text: post.text,
  //     })
  //     this.setState({
  //       posts: update(this.state.posts, {
  //         [pos]: { title: { $set: post.title }, text: { $set: post.text } }
  //       })
  //     })
  //   } catch {
  //     alert('Post post update failed')
  //   }
  // }
  
  async componentDidMount() {
    try {
      const posts = await getPosts(this.props.auth.getIdToken())
      this.setState({
        posts,
        loadingPosts: false
      })
    } catch (e) {
      alert(`Failed to fetch posts: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Create a new Post</Header>

        {this.renderCreatePostInput()}

        <Header as="h1">Your Posts</Header>

        {this.renderPosts()}
      </div>
    )
  }

  renderCreatePostInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
        <Input type="text" style={inputStyle} placeholder="Set your post title here ..." onChange={this.handlePostTitleChange} id='postTitle'/>
        <Divider style={invisibleDividerStyle} />
        <TextArea type="text" style={textAreaStyle} placeholder="Set your post content here ..." onChange={this.handlePostTextChange} id='postText'/>
        
        {/* <textarea name="description" placeholder="Set your post title here ..." onchange="this.handleNameChange">
            
         </textarea> */}
        <Divider style={invisibleDividerStyle} />
        <Button          
          type="submit"
          color="blue"
          onClick={() => this.onPostCreate()}
        >
          Create new post
        </Button>
        
        </Grid.Column>
        <Grid.Column width={16}>
          
          {/* <textarea width={}
        placeholder="Text..."        
      /> */}
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderPosts() {
    if (this.state.loadingPosts) {
      return this.renderLoading()
    }

    return this.renderPostsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading TODOs
        </Loader>
      </Grid.Row>
    )
  }

  renderPostsList() {
    return (
      <Grid padded>
        {this.state.posts.map((post, pos) => {
          return (
            <Grid.Row key={post.postId}>
              {/* <Grid.Column width={15} verticalAlign="middle">
                <Input type="text" style={inputStyle} value={post.title} placeholder="Set your post title here ..." />
                <Divider style={invisibleDividerStyle} />
                <TextArea type="text" style={textAreaStyle} value={post.text} placeholder="Set your post content here ..." />
                <Divider style={invisibleDividerStyle} />
              </Grid.Column> */}
              
              <Grid.Column width={15} verticalAlign="middle">
                <Header as="h3">{post.title}</Header> 
              </Grid.Column>
              <Grid.Column width={15} verticalAlign="middle">
                <div style={postStyle}>{post.text}</div>
              </Grid.Column>

              <Grid.Column width={1} floated="right">
              {post.attachmentUrl && (
                <Image src={post.attachmentUrl} size="small" wrapped />
              )}
              </Grid.Column>
              <Grid.Column width={15} verticalAlign="middle">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(pos)}
                >
                  <Icon name="pencil" />
                </Button>
                {/* <Button
                  icon
                  color="blue"
                  onClick={() => this.onUploadButtonClick(post.postId)}
                >
                  <Icon name="upload" />
                </Button> */}
                <Button
                  icon
                  color="red"
                  onClick={() => this.onPostDelete(post.postId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>                            
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
