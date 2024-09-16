# Overview

The Gmail - New Email Received (Instant) source enables you to trigger Pipedream workflows based on real-time changes to your Gmail inbox.

# Getting Started

## Prerequisites

- A Google Cloud account
- A Pipedream account on the Advanced plan or higher
- Basic familiarity with Google Cloud Console

## Quickstart

1. Create a custom Gmail client in Google Cloud Console
2. Enable Gmail API and Pub/Sub API
3. Create OAuth credentials and a service account
4. Set up a custom OAuth client in Pipedream
5. Connect your Gmail account using the custom client and service account

For detailed instructions, follow the steps below.

## Detailed Setup Instructions

### 1. Create a Gmail app

1. Sign in to the [Google Cloud Console](https://console.cloud.google.com/welcome)
2. Select an existing project, or create a new one

   ![Select an existing project or create a new one in the Google Cloud Console](https://res.cloudinary.com/pipedreamin/image/upload/v1663268100/docs/components/CleanShot_2022-09-15_at_14.54.34_vajyds.png)

3. Select **APIs & Services**
4. Click **Enable APIs & Services**

   ![Select "Enable APIs & Services to open a menu to enable the Gmail API for Pipedream to connect to](https://res.cloudinary.com/pipedreamin/image/upload/v1663268316/docs/components/CleanShot_2022-09-15_at_14.58.06_jshirk.png)

5. Search for and select **[Gmail API](https://console.cloud.google.com/apis/library/gmail.googleapis.com)**
6. Click **Enable**

   ![Search for and select the Gmail Enterprise API](https://res.cloudinary.com/pipedreamin/image/upload/v1663268442/docs/components/CleanShot_2022-09-15_at_15.00.22_skvwei.gif)

7. Search for and select **[Cloud Pub/Sub API](https://console.cloud.google.com/apis/library/pubsub.googleapis.com)**
8. Click **Enable**

   ![Search for and select the Cloud Pub/Sub API](https://res.cloudinary.com/dpenc2lit/image/upload/v1724881089/Screenshot_2024-08-28_at_2.36.59_PM_ds4knm.png)

> **Note:** If you encounter issues with API enablement, ensure you have the necessary permissions in your Google Cloud project.

### 2. Set up the OAuth consent screen

1. Click **OAuth consent screen** on the left side

   ![Click "OAuth consent screen" in the left navigation menu](https://res.cloudinary.com/pipedreamin/image/upload/v1663268506/docs/components/CleanShot_2022-09-15_at_15.01.24_wravfb.png)

2. Set up the OAuth consent screen:

   - Select User Type (Internal for Google Workspace users, External for others)
   - Fill in required fields
   - Add scopes: `email`, `profile`, `https://www.googleapis.com/auth/gmail.modify`, `https://www.googleapis.com/auth/gmail.settings.basic`
   - Add your email as a test user
   - Review and complete the setup

   ![Select "External" in the OAuth Consent Screen](https://res.cloudinary.com/pipedreamin/image/upload/v1663268545/docs/components/CleanShot_2022-09-15_at_15.02.22_fiekq1.png)

### 3. Create OAuth Credentials in Google and Custom OAuth Client in Pipedream

1. Navigate to the **Credentials** section on the left side.

   ![Open the Credentials menu in the left hand nav bar](https://res.cloudinary.com/pipedreamin/image/upload/v1663269973/docs/components/CleanShot_2022-09-15_at_15.13.52_yvllxi.png)

2. Click **Create Credentials** at the top and select **OAuth client ID**

   ![Click create credentials to start the process](https://res.cloudinary.com/pipedreamin/image/upload/v1663270014/docs/components/CleanShot_2022-09-15_at_15.14.15_hjulis.png)

   ![Select the OAuth Client ID option](https://res.cloudinary.com/pipedreamin/image/upload/v1663270093/docs/components/CleanShot_2022-09-15_at_15.14.39_juqtnm.png)

3. Select **Web application** for **Application type**

   ![Web application is the type of OAuth credential we're generating](https://res.cloudinary.com/pipedreamin/image/upload/v1663270117/docs/components/CleanShot_2022-09-15_at_15.14.56_hlseq6.png)

4. Name the app, e.g. "Pipedream".
5. In a new window, navigate to the [Accounts](https://pipedream.com/accounts) page in **Pipedream**, and click **OAuth Clients**.

   ![Custom OAuth Client creation on Pipedream](https://res.cloudinary.com/dpenc2lit/image/upload/v1724882777/Screenshot_2024-08-28_at_2.53.15_PM_rxtusm.png)

6. Click **New OAuth Client**, and search for Gmail.
7. Name your OAuth Client, and click **Continue**.
8. Copy the **Redirect URI**, and return to your previous window.
9. On your Google Cloud app configuration page, click **Add URI** and paste the Redirect URI from the previous step.

   ![Add the Pipedream URL to the Callback Redirect URL option](https://res.cloudinary.com/pipedreamin/image/upload/v1663270187/docs/components/CleanShot_2022-09-15_at_15.16.10_hvbocb.png)

10. Click **Create** to create your new OAuth keys.

    ![Store the Client ID and Client Secret keys](https://res.cloudinary.com/pipedreamin/image/upload/v1663270250/docs/components/CleanShot_2022-09-15_at_15.16.29_hvxnkx.png)

11. Copy the Client ID and Client Secret, and paste them in your OAuth Client configuration on Pipedream.

    ![Custom OAuth Client creation on Pipedream](https://res.cloudinary.com/dpenc2lit/image/upload/v1724956524/Screenshot_2024-08-29_at_11.34.55_AM_t7tjkh.png)

> **Important:** When creating the OAuth client ID, make sure to copy the Redirect URI from Pipedream exactly as shown to avoid authentication errors.

### 4. Create service account

1. Navigate to **[Credentials](https://console.cloud.google.com/apis/credentials?)** under APIs & Services, and click **Create Credentials** > **Service Account**.

   ![Service Account Creation](https://res.cloudinary.com/dpenc2lit/image/upload/v1724964633/Screenshot_2024-08-29_at_1.44.04_PM_om14xp.png)

2. Add a name and description for your service account, and grant the service account the role **Pub/Sub Admin**, and click **Done**.

   ![Role administering](https://res.cloudinary.com/dpenc2lit/image/upload/v1724964633/Screenshot_2024-08-29_at_1.47.02_PM_chdjkl.png)

3. Click on the service account that you created, and click **Keys** > **Add Key** > **Create New Key** > **JSON**. This will download the service account JSON credentials to your computer. Be sure to save this securely.

   ![Create private key](https://res.cloudinary.com/dpenc2lit/image/upload/v1724964634/Screenshot_2024-08-29_at_1.47.34_PM_tmalc7.png)

### 5. Connect your Gmail account in Pipedream

1. From the Pipedream Accounts page, click **OAuth Clients**. Next to your newly created Gmail client, click the three-dot menu on the righthand side and click **Connect Account**. Or you can also connect your account from the workflow builder, when configuring the Gmail trigger.
2. While configuring the New Email Received trigger, you should be prompted to input your Service Account Key JSON.

### 6. Publish your custom Gmail app (required for External app type only)

Google has a [7 day expiration window](https://developers.google.com/identity/protocols/oauth2#:~:text=A%20Google%20Cloud,Connect%20equivalents) on refresh tokens for **External** applications with a publishing status of "Testing", so you will need to **Publish** your application in order to maintain your account connection.

1. Navigate to your application, and click **OAuth Consent Screen** on the lefthand sidebar.
2. Under **Publishing status**, click **Publish App**. If you included any sensitive or restricted scopes in your app, there will be a disclosure stating that you will need to go through the process of verification. Click **Confirm**.
3. Your application will not be available externally unless you share your **client_id** with others, and you will not have to go through the verification process unless you intend to onboard over 100 users.
4. The publishing status should be set to **In production**, and your account should maintain its connection without an expiration window.

![Publish your application](https://res.cloudinary.com/dpenc2lit/image/upload/v1698166716/Screenshot_2023-10-24_at_9.50.06_AM_lve7wq.png)

![Confirmation of changes](https://res.cloudinary.com/dpenc2lit/image/upload/v1698166716/Screenshot_2023-10-24_at_9.50.18_AM_mndtyc.png)

# Troubleshooting

- **Authentication Failed**: Double-check that your Redirect URI is correct and that you've added your email as a test user in the OAuth consent screen.
- **API Not Enabled**: Ensure both Gmail API and Pub/Sub API are enabled in your Google Cloud project.
- **Service Account Issues**: Verify that your service account has the "Pub/Sub Admin" role and that you've correctly pasted the JSON key into Pipedream.

If you continue to experience issues, please contact Pipedream support for further assistance.
