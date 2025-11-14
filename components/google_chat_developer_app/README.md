# Overview
By connecting your Google Chat account to Pipedream, you'll be able to incorporate your Google Chat data into whatever you're building with any of the 3,000+ apps that are available on Pipedream. 

# Getting Started
The Google Chat (Developer App) setup is only available for Google Workspace users. See [here](https://developers.google.com/chat/troubleshoot/apps#workspace-users) for more details. If you are not a Google Workspace user, you can use Pipedream's [Google Chat](https://pipedream.com/apps/google-chat) application alternatively. 

The steps are outlined below:

## Creating a Google Chat app
In order to connect your workspace Google Chat account to Pipedream, you'll need to create a custom OAuth app in Google Cloud. This requires a Google workspace account.

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

## Create OAuth Credentials

You will need to generate a set of OAuth credentials to connect your new Google Chat app to Pipedream.

1. Navigate to the **Credentials** section on the left side.
    
    ![Open the Credentials menu in the left hand nav bar](https://res.cloudinary.com/pipedreamin/image/upload/v1663269973/docs/components/CleanShot_2022-09-15_at_15.13.52_yvllxi.png)

2. Click **Create Credentials** at the top and select **“*OAuth client ID**
   
  ![Click create credentials to start the process](https://res.cloudinary.com/pipedreamin/image/upload/v1663270014/docs/components/CleanShot_2022-09-15_at_15.14.15_hjulis.png)
  
  ![Select the OAuth Client ID option](https://res.cloudinary.com/pipedreamin/image/upload/v1663270093/docs/components/CleanShot_2022-09-15_at_15.14.39_juqtnm.png)

3. Select **Web application** for **Application type**

  ![Web application is the type of OAuth credential we're generating](https://res.cloudinary.com/pipedreamin/image/upload/v1663270117/docs/components/CleanShot_2022-09-15_at_15.14.56_hlseq6.png)

4. Name the app “Pipedream”
5. Under **Authorized redirect URIs**, click **Add URI** and enter `https://api.pipedream.com/connect/oauth/oa_gBBi5O/callback`

  ![Add the Pipedream URL to the Callback Redirect URL option](https://res.cloudinary.com/dpenc2lit/image/upload/v1704486173/Screenshot_2024-01-05_at_12.22.39_PM_oyvppi.png)

6. Click **Create** to create your new OAuth keys
7. Note the client ID and client Secret, but keep these private and secure

  ![Store the Client ID and Client Secret keys](https://res.cloudinary.com/pipedreamin/image/upload/v1663270250/docs/components/CleanShot_2022-09-15_at_15.16.29_hvxnkx.png)

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

At this point, you should have a Google Chat App under your Google Project, and a set of OAuth credentials.

1. When prompted in Pipedream after trying to connect the Google Chat (Developer App), copy and paste your OAuth credentials.
2. Add the scopes that you chose when setting up the app in a space-separate list.
3. Click **Connect**
4. You will be presented with an OAuth consent screen and should see the scopes that you specified at this step. Click **Allow**.

    ![Click Allow to Continue](https://res.cloudinary.com/dpenc2lit/image/upload/v1704752139/Screenshot_2024-01-08_at_2.15.12_PM_pzk47x.png)

5. You should now be able to use your Google Chat application that you created on Pipedream!

## Publish your Google Chat app (EXTERNAL ONLY)
Google has a [7 day expiration window](https://developers.google.com/identity/protocols/oauth2#:~:text=A%20Google%20Cloud,Connect%20equivalents) on refresh tokens for applications that are set to **External** users with a publishing status of "Testing", so you will need to **Publish** your application in order to maintain your account connection.

1. Navigate to your application, and click **OAuth Consent Screen** on the lefthand sidebar.
2. Under **Publishing status**, click **Publish App**. If you included any sensitive or restricted scopes in your app, there will be a disclosure stating that you will need to go through the process of verification. Click **Confirm**.
3. Your application will not be available externally unless you share your **client_id** with others, and you will not have to go through the verification process unless you intend to onboard over 100 users.
4. The publishing status should be set to **In production**, and your account should maintain its connection without an expiration window.

![Publish your application](https://res.cloudinary.com/dpenc2lit/image/upload/v1698166716/Screenshot_2023-10-24_at_9.50.06_AM_lve7wq.png)

![Confirmation of changes](https://res.cloudinary.com/dpenc2lit/image/upload/v1698166716/Screenshot_2023-10-24_at_9.50.18_AM_mndtyc.png)

# Example Use Cases

- **Automated Helpdesk Bot**: Create a bot within Google Chat that listens for keywords related to IT support and automatically responds with troubleshooting advice or escalates the issue by creating a ticket in a service like Zendesk or Jira.

- **Project Management Notifications**: Set up a workflow that monitors project management tools such as Asana or Trello for updates, and then posts these updates to a dedicated Google Chat space, ensuring your team stays informed about project progress in real-time.

- **Meeting Coordinator**: Develop a bot that helps schedule meetings by integrating with Google Calendar. When a meeting request is mentioned in a chat, the bot can check participants' availability, propose times, and send calendar invites, streamlining the scheduling process.


# Troubleshooting
**Application disconnects after 7 days**<br>
If your developer application disconnects after 7 days, you need to follow the steps above to Publish your Google Chat app in order to keep your account connected.