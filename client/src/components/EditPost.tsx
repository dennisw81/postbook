import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getUploadUrl, uploadFile, patchPost } from '../api/posts-api'
import update from 'immutability-helper'


import {
  // Button,
  // Checkbox,
  Divider,
  Grid,
  // Header,
  // Icon,
  Input,
  // Image,
  // Loader,
  TextArea
} from 'semantic-ui-react'
import { number } from 'yargs'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

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



interface EditPostProps {
  match: {
    params: {
      postId: string
    }
  }
  auth: Auth
}

interface EditPostState {
  file: any
  uploadState: UploadState
  title: string 
  text: string 
}

export class EditPost extends React.PureComponent<
  EditPostProps,
  EditPostState
> {
  state: EditPostState = {
    file: undefined,
    uploadState: UploadState.NoUpload,    
    text: String(localStorage.getItem('postText')?.toString()),
    title: String(localStorage.getItem('postTitle')) 
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.postId)
      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

      alert('File was uploaded!')
    } catch (e) {
      alert('Could not upload a file: ' + (e as Error).message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }
  // handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   // alert(event.target.id);
  //   if(event.target.id === 'postTitle')
  //     this.setState({ title: event.target.value })
  //   else 
  //     this.setState({ text: event.target.value })
  // }
  handlePostTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {    
    if(event.target.id === 'postTitle')
      this.setState({ title: event.target.value })
  }

  handlePostTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if(event.target.id === 'postText')
      this.setState({ text: event.target.value })
  }
  // onRender = () => {
  //   // var postTitle = localStorage.getItem('postTitle') ? ""
  //   // var postText = localStorage.getItem('postText') ? ""

  //   this.setState({ title: "postTitle" })
  // }

  onPostUpdate = async () => {
      try {        
        await patchPost(this.props.auth.getIdToken(), this.props.match.params.postId, {
          title: this.state.title !== null ? this.state.title : "",
          text: this.state.text != null ? this.state.text.toString() : ""
        })
        alert('Your post was updated.')
      } catch {
        alert('Post post update failed')
      }
    }    

  render() {    
    
    return (
      
      <div>
        <h1>Update your post</h1>

        <Grid.Row>
        <Grid.Column width={16}>
        <Input type="text" style={inputStyle} placeholder="Set your post title here ..." value={this.state.title} onChange={this.handlePostTitleChange} id='postTitle'/>
        <Divider style={invisibleDividerStyle} />
        <TextArea type="text" style={textAreaStyle} placeholder="Set your post content here ..." value={this.state.text} onChange={this.handlePostTextChange} id='postText' />
        <Divider style={invisibleDividerStyle} />
        <Button          
          type="submit"
          color="blue"
          // onClick={this.onPostUpdate}
          onClick={() => this.onPostUpdate()}
        >
          Update post
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

        <h3>Upload new image</h3>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>File</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
          color="blue"
        >
          Upload
        </Button>
      </div>
    )
  }
}
