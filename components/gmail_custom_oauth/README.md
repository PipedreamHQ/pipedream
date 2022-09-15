# Overview
By connecting your personal Gmail account to Pipedream, you'll be able to incorporate email into whatever you're building with any of the 900+ apps that are available on Pipedream.

# Getting Started

The Google Developer App in Pipedream can integrate with either a personal Gmail account or a Google workspace email account. Either option involves creating a custom Google App in the Google Cloud Console. This process does not involve any code or special approval by Google. The steps are outlined below:

## Creating a Gmail app

In order to connect your personal or workspace Gmail account to Pipedream, you'll need to create a custom OAuth app in Google Cloud.

1. Sign in to the [Google Cloud Console](https://cloud.google.com/)
2. Select an existing project or create a new one
![Select an exisiting project or create a a new one in the Google Cloud Console](https://res.cloudinary.com/pipedreamin/image/upload/v1663268100/docs/components/CleanShot_2022-09-15_at_14.54.34_vajyds.png)
3. Select "APIs & Services"
4. Click “Enable APIs & Services”
![Select "Enable APIs & Services to open a menu to enable the Gmail API for Pipedream to connect to](https://res.cloudinary.com/pipedreamin/image/upload/v1663268316/docs/components/CleanShot_2022-09-15_at_14.58.06_jshirk.png)
5. Search for and select “Gmail API”
6. Click “Enable”
![Search for an select the Gmail Enterprise API](https://res.cloudinary.com/pipedreamin/image/upload/v1663268442/docs/components/CleanShot_2022-09-15_at_15.00.22_skvwei.gif)
7. Click “OAuth consent screen” on the left side
[Click "OAuth consent screen" in the left navigation menu](https://res.cloudinary.com/pipedreamin/image/upload/v1663268506/docs/components/CleanShot_2022-09-15_at_15.01.24_wravfb.png)
8. Select “External” User Type and click “Create”
![Select "External" in the OAuth Consent Screen](https://res.cloudinary.com/pipedreamin/image/upload/v1663268545/docs/components/CleanShot_2022-09-15_at_15.02.22_fiekq1.png)
9. Fill in the required fields and click “Save and Continue”
10. Click "Add or remove scopes" and select the `https://mail.google.com/` scope and then click "Update"
11. Click "Save and Continue" to finish the "Scopes" step
12. Add your own email as a "Test User" by clicking "Add Users" then typing in your email in the prompt then clicking "Add" again. Then finally click "Save and Continue" to finish the Test Users portion.
13. You should be prompted with a "Summary" page.

Now you've created an unlisted Gmail App that you can integrate with Pipedream.

## Create OAuth Credentials

You will need to generate a set of OAuth credentials to connect your new Gmail app to Pipedream properly.

1. Navigate to the “Credentials” section on the left side.
![Open the Credentials menu in the left hand nav bar](https://res.cloudinary.com/pipedreamin/image/upload/v1663269973/docs/components/CleanShot_2022-09-15_at_15.13.52_yvllxi.png)

2. Click “Create Credentials” at the top and select “OAuth client ID”
![Click create credentials to start the process](https://res.cloudinary.com/pipedreamin/image/upload/v1663270014/docs/components/CleanShot_2022-09-15_at_15.14.15_hjulis.png)
![Select the OAuth Client ID option](https://res.cloudinary.com/pipedreamin/image/upload/v1663270093/docs/components/CleanShot_2022-09-15_at_15.14.39_juqtnm.png)
3. Select “Web application” for “Application type”
![Web application is the type of OAuth credential we're generating](https://res.cloudinary.com/pipedreamin/image/upload/v1663270117/docs/components/CleanShot_2022-09-15_at_15.14.56_hlseq6.png)
4. Name the app “Pipedream”
5. Click “Add URI” and enter `https://api.pipedream.com/connect/oauth/oa_G7Ain6/callback`
![Add the Pipedream URL to the Callback Redirect URL option](https://res.cloudinary.com/pipedreamin/image/upload/v1663270187/docs/components/CleanShot_2022-09-15_at_15.16.10_hvbocb.png)
6. Click “Create” to create your new OAuth keys
7. Note the client ID and client Secret, but keep these private and secure
![Store the Client ID and Client Secret keys](https://res.cloudinary.com/pipedreamin/image/upload/v1663270250/docs/components/CleanShot_2022-09-15_at_15.16.29_hvxnkx.png)

## Connect your Gmail app Pipedream with your Gmail app OAuth crendentials

At this point, you should have a Gmail App under your Google Project, and a set of OAuth keys.

1. Now when prompted in Pipedream after trying to connect a Gmail Developer App, copy and paste your OAuth credentials.
2. Also select the scopes you chose when defining the app. We recommend using `https://mail.google.com/`
3. Then click "Connect"
4. If you did not publish your Gmail App in the Google Cloud Console, just click "Continue" to ignore the warning.
![Click continue if presented with a warning about an unpublished app](https://res.cloudinary.com/pipedreamin/image/upload/v1663269902/docs/components/CleanShot_2022-09-15_at_15.19.58_jnzlwc.png)
5. Check all of the necessary scopes you'll need for your workflows
![Check all scopes to include grant your integration permission](https://res.cloudinary.com/pipedreamin/image/upload/v1663269729/docs/components/CleanShot_2022-09-15_at_15.20.26_jlnyw4.gif)
6. Click the final "Connect" and your custom Gmail app should be integrated into Pipedream!
