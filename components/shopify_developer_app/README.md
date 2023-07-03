# Overview
By creating a custom app on Shopify, you will be able to configure the exact scopes that you require to build the workflows that you need.

# Getting Started

To get started, you will need to create a custom Shopify app in the Shopify Admin UI. The steps are outlined below:

## Create a Shopify app
1. Sign in to your Shopify admin account, and navigate to the store that you are managing. 
2. Click **Develop apps**.
3. Click **Allow custom app development**.
4. Click **Create an App**, and name the app "Pipedream"

  ![Create an App](https://res.cloudinary.com/dpenc2lit/image/upload/v1688060015/Screenshot_2023-06-29_at_10.11.43_AM_unkom4.png)

## Configure Admin API scopes
1. In the new app you have created, under the **Configuration** tab, click **Configure Admin API scopes**
2. Select the scopes that you require for your use case. You may modify your scopes at any time by returning to the app configuration page.

## Generate the Admin API access token
1. Under API credentials, click **Install app**.
2. Click **Reveal token once** and save it in a secure location (we recommend using a password manager such as 1Password) -- you will need it when setting up authentication on Pipedream, and it is only revealed once. If you happen to lose this, you will need to uninstall the app, and reinstall it on Shopify to generate a new access token.

  ![API Credentials](https://res.cloudinary.com/dpenc2lit/image/upload/v1688061470/Screenshot_2023-06-29_at_10.54.53_AM_jta5gc.png)

## Connect your Shopify app with Pipedream using your access token

At this point, you should have a Pipedream App connected to your Shopify store, and a long-lived access token.

1. When prompted in Pipedream after trying to connect the Shopify Developer App, copy and paste your **shop id** along with your **access token** saved from the previous step.
2. Click **Connect** and your custom Shopify app should be integrated into Pipedream!
