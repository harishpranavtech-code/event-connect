🚀 CampusConnect Lite – Full Stack Deployment Guide

Welcome to the Full Stack Seminar Project.

You will deploy a real production-ready application using:

- Next.js (Frontend)
- Fastify (Backend)
- MongoDB (Database)
- Render (Backend Hosting)
- Vercel (Frontend Hosting)

## STEP 1 – Download & Setup

- Download the project ZIP from [From my github repo]
- Extract the folder
- Open the main folder in VS Code

🖥 BACKEND SETUP

## Step 2 – Open Backend Folder

-cd backend [Locate backend]

## Step 3 – Install Dependencies

-npm install [It will install the dev dependencies]

-- If it not works go to powershell
Use this command [ Set-ExecutionPolicy RemoteSigned -Scope CurrentUser ] and Give Y and go back to vscode terminal \* npm install [do it again]

## Step 4 – Create .env File

- .env [for production deploy to connect mongoDB and jwt token for signup/in]

  The env file should be look :

  PORT=5000

  MONGO_URI= I will give later
  ---This is my seminar temporary connection you can use it.

  JWT_SECRET= (Copy the exact command and run on the terminal of backend)
  ---> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

  FRONTEND_URL=http://localhost:3000 [Right now use this after deploy of frontend we update on render backend deploy software]

## Step 5 – Test Backend Locally

-npm start // run this command to test backend.

Server should run on: [ http://localhost:5000 ]

------------------------------------- Next Frontend Setup--------------------------------------------------

## Step 1 – Open Frontend Folder

cd frontend [Located the frontend]

## Step 2 – Install Dependencies

npm install [It will install the dev dependencies]

## Step 3 – Create .env.local File

Add:

NEXT_PUBLIC_API_URL=Paste_Your_Render_Backend_URL_Here [After frontend deployment we have to update it.]

Example:

NEXT_PUBLIC_API_URL=https://campusconnect-backend.onrender.com

## Step 4 – Test Locally

npm run dev [It will run on https://localhost:3000]

------------------------------------Github Repository steps -----------------------------------------------

## Step 7 - Create a Github repository

1. Create a github repository on your own github

2. Then follow the github init,pushing command

   ## git init

   ## git add .

   ## git commit -m "Readyy to deploy"

   ## git remote add origin https://github.com/yourusername/event-connector-repo.git

   ## git branch -M main

   ## git push -u origin main

3) Refresh the github page, the folder will appear [IF not you did it wrong]

--------------------------------------------Deployment steps-----------------------------------------------

----------Backend deploy process

## Deploy Backend to Render

-- Push backend folder to GitHub (Conform that the repo has correct code folder)

1. Go to https://render.com [SIGNIN or SIGNUP with gmail or github]

2. Click new or + and Create New Web Service option

3. Connect GitHub correct Repository

4. Setup the build logics in render -- Very Important steps you did wrong totally became fail.

## Root directory - campusconnect-backend

## Build Command - npm install

## Start Command - npm start

5. Add Environment Variables:
   KEY VALUE
   1. NODE_ENV production

   2. PORT 10000 [Render default port]

   3. MONGO_URI (exact env Mongo URI) // Important

   4. JWT_SECRET (exact env jwt Secret) // Important

   5. FRONTEND_URL (Add later after frontend deploy)

6. Deploy

## Copy the Backend Live URL.

Example: [ https://campusconnect-backend.onrender.com ]

----------Frontend Deploy process

## Before Frontend deploy

----Paste the backend url to the frontend .env.local folder

----Push the frontend to github with this updated url --- Actually no need because ignorance of env file.

## Deploy Frontend to Vercel

-- Push backend folder to GitHub (Conform that the repo has correct code folder)

1. Create an account on vercel with your gmail or github.

2. Click add new and select project button and Import the repo by github import. [Choose correctly]

3. Vercel automatically choose the next.js application preset.

## Root directory you click it and select the campusconnect-frontend

4. Click deploy. //That's it completed.

5.Copy the frontend url and update in the render backend deploy

    ## In the render the backend project click the environment option in the left side of the navbar.

    ## In that update the FRONTEND_URL as your deployed frontend url.

----------------------------------------PROJECT COMPLETED--------------------------------------------------
