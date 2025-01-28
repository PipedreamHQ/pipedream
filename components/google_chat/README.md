# Overview

The Google Chat API allows you to build custom bots for Google Chat, enabling automated interactions with users within a chat space. By leveraging this API on Pipedream, you can create powerful workflows that respond to messages, automate tasks, and connect Google Chat with other services. Pipedream's serverless platform provides a seamless way to invoke these APIs based on triggers from Google Chat or other apps.

# Example Use Cases

- **Automated Helpdesk Bot**: Deploy a bot that listens for specific keywords in Google Chat messages. When a user mentions a support-related keyword, the bot can reply with helpful information or create a ticket in a service like Zendesk.

- **Meeting Scheduler**: Set up a workflow that triggers when someone requests a meeting in a Google Chat room. The bot can interact with Google Calendar to find available slots and propose meeting times directly within the chat.

- **CI/CD Notifications**: Integrate with GitHub to send updates on code commits, pull requests, or build statuses from your CI/CD pipeline into a Google Chat room, keeping your development team informed in real-time.


# Getting Started

## Creating a Google Chat app
In order to connect your workspace Google Chat account to Pipedream, you'll need do the following:
1. Create a Google Chat app in Google Cloud (a Google workspace account is required).
2. Connect this app using custom OAuth clients on Pipedream. See the directions [here](https://pipedream.com/docs/connected-accounts/oauth-clients) on how to configure a custom OAuth client on Pipedream.

1. Sign in to the [Google Cloud Console](https://cloud.google.com/)
2. Select an existing project or create a new one

  ![Select an existing project or create a a new one in the Google Cloud Console](https://res.cloudinary.com/pipedreamin/image/upload/v1663268100/docs/components/CleanShot_2022-09-15_at_14.54.34_vajyds.png)

3. Select **APIs & Services**
4. Click **Enable APIs & Services**

  ![Select "Enable APIs & Services to open a menu to enable the Google Chat API for Pipedream to connect to](https://res.cloudinary.com/pipedreamin/image/upload/v1663268316/docs/components/CleanShot_2022-09-15_at_14.58.06_jshirk.png)

5. Search for and select **Chat API**
6. Click **Enable**

  ![Search for and select the Google Chat API](https://res.cloudinary.com/dpenc2lit/image/upload/v1704485195/Screenshot_2024-01-05_at_12.04.19_PM_ypy1dz.png)

7. Click **OAuth consent screen** on the left side
   
  ![Click "OAuth consent screen" in the left navigation menu](https://res.cloudinary.com/dpenc2lit/image/upload/v1704750653/Screenshot_2024-01-08_at_1.50.38_PM_ihkhn7.png)

8. If you only intend to use this application within your organization, select **Internal** (recommended) and click "Create." In this mode, your app is limited to Google Workspace users within your organization. If you select **External**, you will need to go through the process of app verification in order use any sensitive or restricted scopes.

  ![Select "Internal" in the OAuth Consent Screen](https://res.cloudinary.com/dpenc2lit/image/upload/v1704750730/Screenshot_2024-01-08_at_1.52.05_PM_pgxebn.png)

9. Fill in the required fields and click **Save and Continue**
10. Under **Authorized Domains**, add `pipedream.com`
11. Click **Add or remove scopes** and Filter by `Chat API` select whichever scopes you intend to use and then click "Update". For more information about available Google Chat scopes, please see this [overview](https://developers.google.com/chat/api/guides/auth#chat-api-scopes).
12. Click **Save and Continue** to finish the **Scopes** step
13. You should be prompted with a **Summary** page.

## Create OAuth Credentials in Google Cloud

You will need to generate a set of OAuth credentials to connect your new Google Chat app to Pipedream.

1. Navigate to the **Credentials** section on the left side.
    
    ![Open the Credentials menu in the left hand nav bar](https://res.cloudinary.com/pipedreamin/image/upload/v1663269973/docs/components/CleanShot_2022-09-15_at_15.13.52_yvllxi.png)

2. Click **Create Credentials** at the top and select **“*OAuth client ID**
   
  ![Click create credentials to start the process](https://res.cloudinary.com/pipedreamin/image/upload/v1663270014/docs/components/CleanShot_2022-09-15_at_15.14.15_hjulis.png)
  
  ![Select the OAuth Client ID option](https://res.cloudinary.com/pipedreamin/image/upload/v1663270093/docs/components/CleanShot_2022-09-15_at_15.14.39_juqtnm.png)

3. Select **Web application** for **Application type**

  ![Web application is the type of OAuth credential we're generating](https://res.cloudinary.com/pipedreamin/image/upload/v1663270117/docs/components/CleanShot_2022-09-15_at_15.14.56_hlseq6.png)

4. Give your app a name.

## Create a Custom OAuth Client in Pipedream

5. Navigate to the workspace where you want to connect your Google Chat app, and go to **Accounts**, then **OAuth Clients**, and click **New OAuth Client.

6. Search for the "Google Chat" app and name your custom OAuth client. You will get a unique **Redirect URI** which you will need to configure in Google.

7. In the Google Cloud app configuration, under **Authorized redirect URIs**, click **Add URI** and enter the Redirect URI of your custom Google Chat client. 

  ![Add the Pipedream URL to the Callback Redirect URL option](https://res.cloudinary.com/dpenc2lit/image/upload/v1704486173/Screenshot_2024-01-05_at_12.22.39_PM_oyvppi.png)

8. Click **Create** to create your new OAuth keys
9. Note the client ID and client Secret, but keep these private and secure

  ![Store the Client ID and Client Secret keys](https://res.cloudinary.com/pipedreamin/image/upload/v1663270250/docs/components/CleanShot_2022-09-15_at_15.16.29_hvxnkx.png)

10. Add your Client ID and Client Secret to your custom OAuth Google Chat client on Pipedream.

## Configure your Google Chat application

1. Click **Enable APIs & Services** on the top-left navigation bar, then **Google Chat API**.

2. Click **Configuration**

3. Fill in the required details - please note that the values you provide here will be the name of the app that you add to your Google Chat workspace.

4. You can name the application whatever you'd like for the app to be called within the Google Chat workspace, e.g. **Pipedream**

5. If you'd like to use the Pipedream logo for the avatar, use the URL [https://pipedream.com/s.v0/app_13GhYE/logo/orig](https://pipedream.com/s.v0/app_13GhYE/logo/orig) for the **Avatar URL**

6. Add a **Description**.

7. Select any **Interactive features** you require for your app.

8. Add an **App URL**, ideally, an HTTPS URL that you control, or you can provide the following app url [https://pipedream.com/apps/google-chat-developer-app](https://pipedream.com/apps/google-chat-developer-app).

9. Under **Visibility**, add the email addresses of the individuals or groups within your Google Workspace organization.

10. Click **Save**. 

![App Configuration Settings](https://res.cloudinary.com/dpenc2lit/image/upload/v1704751866/Screenshot_2024-01-08_at_2.10.44_PM_z3eoa0.png)

## Connect your Google Chat app Pipedream with your Google Chat app OAuth credentials

At this point, you should have a Google Chat App under your Google Project, and a custom OAuth client on Pipedream. Make sure that the scopes in your custom OAuth client match the scopes you enabled in Google Cloud.

You should now be able to use your Google Chat application that you created on Pipedream!

## Publish your Google Chat app (EXTERNAL ONLY)
Google has a [7 day expiration window](https://developers.google.com/identity/protocols/oauth2#:~:text=A%20Google%20Cloud,Connect%20equivalents) on refresh tokens for applications that are set to **External** users with a publishing status of "Testing", so you will need to **Publish** your application in order to maintain your account connection.

1. Navigate to your application, and click **OAuth Consent Screen** on the lefthand sidebar.
2. Under **Publishing status**, click **Publish App**. If you included any sensitive or restricted scopes in your app, there will be a disclosure stating that you will need to go through the process of verification. Click **Confirm**.
3. Your application will not be available externally unless you share your **client_id** with others, and you will not have to go through the verification process unless you intend to onboard over 100 users.
4. The publishing status should be set to **In production**, and your account should maintain its connection without an expiration window.

![Publish your application](https://res.cloudinary.com/dpenc2lit/image/upload/v1698166716/Screenshot_2023-10-24_at_9.50.06_AM_lve7wq.png)

![Confirmation of changes](https://res.cloudinary.com/dpenc2lit/image/upload/v1698166716/Screenshot_2023-10-24_at_9.50.18_AM_mndtyc.png)

# Troubleshooting
**Application disconnects after 7 days**<br>
If your developer application disconnects after 7 days, you need to follow the steps above to Publish your Google Chat app in order to keep your account connected.
