# Overview

1. You could build a tool that monitors specific subreddits and notifies you
   when new posts match certain criteria.
2. You could build a tool that analyzes the posts and comments in a given
   subreddit to generate statistics or visualizations about the topic.
3. You could build a bot that automatically posts or comments in response to
   certain keywords or phrases.
4. You could build a tool that helps manage your Reddit account by automating
   tasks like posting, messaging, or voting.
5. You could build a tool that extracts data from Reddit posts and comments for
   use in other applications.

# Getting Started

To get started, you will need to create an app within Reddit. The steps are outlined below:

## Create a Reddit app
1. Sign in to your Reddit account, and navigate to the applications [page](https://www.reddit.com/prefs/apps).
2. Name the app "Pipedream", or another name of your choosing.
3. Select **web app**.
4. Add a description, e.g "This app will be used to connect Pipedream to Reddit." 
5. Add an "about url".
6. Under "redirect uri", enter `https://api.pipedream.com/connect/oauth/oa_G7AioA/callback`
7. Click **create app**.

  ![Create App](https://res.cloudinary.com/dpenc2lit/image/upload/v1688161060/Screenshot_2023-06-30_at_2.37.20_PM_muvvzi.png)

## Register your new app on Reddit
In order to maintain access to the Reddit APIs, you will need to register your app.
1. Navigate to the [Submit a request form](https://reddithelp.com/hc/en-us/requests/new?ticket_form_id=14868593862164).
2. Fill out the form under API Support, and select **I want to register to use the free tier of the Reddit API**. 

<img src="https://res.cloudinary.com/dpenc2lit/image/upload/v1688161658/Screenshot_2023-06-30_at_2.44.42_PM_etr685.png" alt="drawing" width="600"/>

## Connect your Reddit app with Pipedream using your client id and client secret
1. In the new app you have created, your **client id** is located underneath the app name.
2. The **client secret** is located next to **secret**. 

![client id ](https://res.cloudinary.com/dpenc2lit/image/upload/v1688162467/Screenshot_2023-06-30_at_3.01.02_PM_jvepnr.png)

3. When connecting the Reddit app in Pipedream, copy and paste your **client id** along with your **client secret**.
4. Click **Connect** and your custom Reddit app should be integrated into Pipedream!

