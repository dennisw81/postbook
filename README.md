# Postbook

A very simple facebook like app that allows a user to log in, create, view, edit and delete posts.
A post has a title, text and an optional image.

The backend of Postbook is already deployed as a serverless application.
The frontend is configured to connect to this backend.
You just have to follow the instructions in the Frontend section to start the UI

## Backend

To deploy the backend application run the following commands:

```
cd backend
npm install
sls deploy --verbose
```

## Frontend

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless Postbook application.

To run the client application with another backend edit the `client/src/config.ts` file to set correct parameters. And then run the commands mentioned above.
