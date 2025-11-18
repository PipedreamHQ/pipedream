# Overview
Google Fit (Developer App) provides a robust API for accessing and storing a user's health and wellness data collected from various devices and apps. With it, you can read and write different types of fitness data, such as steps, calories burned, and heart rate, enabling the development of personalized health dashboards, proactive fitness reminders, and integrative health reports. Using Pipedream, this data can be ingested and combined with other services to automate health tracking, set goals, and even inform healthcare providers or coaching systems of a user's progress.

# Getting Started
The Google Fit Developer App in Pipedream can integrate with either a personal Gmail account or a Google workspace email account. Either option involves creating a custom Google App in the Google Cloud Console. This process does not involve any code or special approval by Google. The steps are outlined below:

## Creating a Google Fit app
In order to connect your personal or workspace Google Fit account to Pipedream, you'll need to create a custom OAuth app in Google Cloud.

1. Sign in to the [Google Cloud Console](https://cloud.google.com/)
2. Select an existing project or create a new one

  ![Select an existing project or create a new one in the Google Cloud Console](https://res.cloudinary.com/pipedreamin/image/upload/v1663268100/docs/components/CleanShot_2022-09-15_at_14.54.34_vajyds.png)

3. Select **APIs & Services**
4. Click **Enable APIs & Services**

  ![Select "Enable APIs & Services to open a menu to enable the Google Fitness API for Pipedream to connect to](https://res.cloudinary.com/pipedreamin/image/upload/v1663268316/docs/components/CleanShot_2022-09-15_at_14.58.06_jshirk.png)

5. Search for and select **Fitness API**
6. Click **Enable**

  ![Search for and select the Google Fitness API](https://res.cloudinary.com/dpenc2lit/image/upload/v1692292762/Screenshot_2023-08-17_at_10.03.05_AM_ek8nqq.png)

7. Click **OAuth consent screen** on the left side
   
  ![Click "OAuth consent screen" in the left navigation menu](https://res.cloudinary.com/pipedreamin/image/upload/v1663268506/docs/components/CleanShot_2022-09-15_at_15.01.24_wravfb.png)

8. Select **External** User Type and click “Create”

  ![Select "External" in the OAuth Consent Screen](https://res.cloudinary.com/pipedreamin/image/upload/v1663268545/docs/components/CleanShot_2022-09-15_at_15.02.22_fiekq1.png)

9. Fill in the required fields and click **Save and Continue**
10. Under **Authorized Domains**, add `pipedream.com`
11. Click **Add or remove scopes** and Filter by `Fitness API` select whichever scopes you intend to use and then click "Update". For more information about available Google Fit scopes, please see this [overview](https://developers.google.com/fit/datatypes#authorization_scopes).
12. Click **Save and Continue** to finish the **Scopes** step
13. Add your own email as a **Test User** by clicking **Add Users** then typing in your email in the prompt then clicking **Add** again. Then finally click **Save and Continue** to finish the Test Users portion.
14. You should be prompted with a **Summary** page.

Now you've created an unlisted Google Fit app that you can integrate with Pipedream.

## Create OAuth Credentials

You will need to generate a set of OAuth credentials to connect your new Google Fit app to Pipedream properly.

1. Navigate to the **Credentials** section on the left side.
    
    ![Open the Credentials menu in the left hand nav bar](https://res.cloudinary.com/pipedreamin/image/upload/v1663269973/docs/components/CleanShot_2022-09-15_at_15.13.52_yvllxi.png)

2. Click **Create Credentials** at the top and select **“*OAuth client ID**
   
  ![Click create credentials to start the process](https://res.cloudinary.com/pipedreamin/image/upload/v1663270014/docs/components/CleanShot_2022-09-15_at_15.14.15_hjulis.png)
  
  ![Select the OAuth Client ID option](https://res.cloudinary.com/pipedreamin/image/upload/v1663270093/docs/components/CleanShot_2022-09-15_at_15.14.39_juqtnm.png)

3. Select **Web application** for **Application type**

  ![Web application is the type of OAuth credential we're generating](https://res.cloudinary.com/pipedreamin/image/upload/v1663270117/docs/components/CleanShot_2022-09-15_at_15.14.56_hlseq6.png)

4. Name the app “Pipedream”
5. Click **Add URI** and enter `https://api.pipedream.com/connect/oauth/oa_gA6iex/callback`

  ![Add the Pipedream URL to the Callback Redirect URL option](https://res.cloudinary.com/dpenc2lit/image/upload/v1692295499/Screenshot_2023-08-17_at_11.04.54_AM_blco7y.png)

6. Click **Create** to create your new OAuth keys
7. Note the client ID and client Secret, but keep these private and secure

  ![Store the Client ID and Client Secret keys](https://res.cloudinary.com/pipedreamin/image/upload/v1663270250/docs/components/CleanShot_2022-09-15_at_15.16.29_hvxnkx.png)

## Connect your Google Fit app Pipedream with your Google Fit app OAuth credentials

At this point, you should have a Google Fit App under your Google Project, and a set of OAuth keys.

1. Now when prompted in Pipedream after trying to connect a Google Fit Developer App, copy and paste your OAuth credentials.
2. Add the scopes that you chose when setting up the app in a space-separate list.
3. Then click **Connect**
4. If you did not publish your Google Fit App in the Google Cloud Console, just click **Continue** to ignore the warning.

    ![Click continue if presented with a warning about an unpublished app](https://res.cloudinary.com/pipedreamin/image/upload/v1663269902/docs/components/CleanShot_2022-09-15_at_15.19.58_jnzlwc.png)

5. Check all of the necessary scopes you'll need for your workflows

    ![Check all scopes to include grant your integration permission](https://res.cloudinary.com/dpenc2lit/image/upload/v1692293421/Screenshot_2023-08-17_at_10.30.15_AM_ymeont.png)

7. Click the final **Connect** and your custom Google Fit app should be integrated into Pipedream!

## Publish your Google Fit app
Google has a [7 day expiration window](https://developers.google.com/identity/protocols/oauth2#:~:text=A%20Google%20Cloud,Connect%20equivalents) on refresh tokens for applications with a publishing status of "Testing", so you will need to **Publish** your application in order to maintain your account connection.

1. Navigate to your application, and click **OAuth Consent Screen** on the lefthand sidebar.
2. Under **Publishing status**, click **Publish App**. If you included any sensitive or restricted scopes in your app, there will be a disclosure stating that you will need to go through the process of verification. Click **Confirm**.
3. Your application will not be available externally unless you share your **client_id** with others, and you will not have to go through the verification process unless you intend to onboard over 100 users.
4. The publishing status should be set to **In production**, and your account should maintain its connection without an expiration window.

![Publish your application](https://res.cloudinary.com/dpenc2lit/image/upload/v1698166716/Screenshot_2023-10-24_at_9.50.06_AM_lve7wq.png)

![Confirmation of changes](https://res.cloudinary.com/dpenc2lit/image/upload/v1698166716/Screenshot_2023-10-24_at_9.50.18_AM_mndtyc.png)

# Example Use Cases

- **Daily Health Summary Email**: Combine Google Fit data with Pipedream's email service to send a daily summary of a user's fitness activity. A workflow could fetch the previous day's data, including steps taken, calories burned, and sleep analysis, then format this information and send it via an automated email to encourage consistent fitness tracking and goal setting.

- **Smart Home Integration for Fitness Reminders**: Integrate Google Fit data with smart home devices using Pipedream. If a user's activity level is lower than a set threshold by a certain time of day, the workflow could trigger a smart home device, like a smart speaker, to remind the user to take a walk or perform their workout routine.

- **Health Dashboard Sync**: Sync Google Fit data with a custom health dashboard app. Data can be pulled at regular intervals to update the dashboard, allowing users or health coaches to view trends and insights over time. This could be extended by connecting it to a data visualization tool like Google Data Studio for enhanced reporting capabilities.

# Troubleshooting
**Application disconnects after 7 days**<br>
If your developer application disconnects after 7 days, you need to follow the steps above to Publish your Google Fit app in order to keep your account connected.
