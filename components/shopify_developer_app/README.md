# Overview

The [Shopify Admin REST & GraphQL API](https://shopify.dev/docs/api/admin) unleashes a myriad of possibilities to automate and enhance online store operations. It provides programmatic access to Shopify functionalities, allowing users to manage products, customers, orders, and more. Leveraging the Shopify Admin API within Pipedream, developers can create custom workflows that automate repetitive tasks, sync data across platforms, and respond dynamically to events in Shopify.

This integration can be used as a custom app on your store, or for automating actions on behalf of merchants through your Shopify app. 

Looking for integrating into the Shopify Partner API for your apps, themes or referrals? Check out our [Shopify Partner API integration](https://pipedream.com/apps/shopify-partner).

# Getting Started

## As a merchant

By creating a custom app on Shopify, you will be able to configure the exact scopes that you require to build the workflows that you need.

To get started, you will need to create a custom Shopify app in the Shopify Admin UI. The steps are outlined below:

### Create a Shopify app
1. Sign in to your Shopify admin account, and navigate to the store that you are managing. 
2. Click **Develop apps**.
3. Click **Allow custom app development**.
4. Click **Create an App**, and name the app "Pipedream"

  ![Create an App](https://res.cloudinary.com/dpenc2lit/image/upload/v1688060015/Screenshot_2023-06-29_at_10.11.43_AM_unkom4.png)

### Configure Admin API scopes
1. In the new app you have created, under the **API Credentials** tab, click **Configure Admin API scopes**
2. Select the scopes that you require for your use case. You may modify your scopes at any time by returning to the app configuration page.

### Generate the Admin API access token
1. Under API credentials, click **Install app**.
2. Click **Reveal token once** and save it in a secure location (we recommend using a password manager such as 1Password) -- you will need it when setting up authentication on Pipedream, and it is only revealed once. If you happen to lose this, you will need to uninstall the app, and reinstall it on Shopify to generate a new access token.

  ![API Credentials](https://res.cloudinary.com/dpenc2lit/image/upload/v1688061470/Screenshot_2023-06-29_at_10.54.53_AM_jta5gc.png)

### Connect your Shopify app with Pipedream using your access token

At this point, you should have a Pipedream App connected to your Shopify store, and a long-lived access token.

1. When prompted in Pipedream after trying to connect the Shopify Developer App, copy and paste your **shop id** along with your **access token** saved from the previous step.
2. Click **Connect** and your custom Shopify app should be integrated into Pipedream!

## As an app developer

As a Shopify App Developer, you can use Pipedream to automate actions on behalf of merchants by leveraging the merchants offline access token.

### Connect your database

First, you'll need to connect your app's database to Pipedream. Pipedream connects to SQL and No-SQL databases. Here's a list of popular options in Pipedream:

* [PostgreSQL](https://pipedream.com/apps/postgresql)
* [MySQL](https://pipedream.com/apps/mysql)
* [Supabase](https://pipedream.com/apps/supabase)
* [Firebase](https://pipedream.com/apps/firebase)
* [MongoDB](https://pipedream.com/apps/mongodb)

Once your database is connected to Pipedream, you'll be able to query the database for a specific merchant's token.

### Retrieve a merchants access token

In an HTTP triggered workflow, you can use a body parameter to reference a shop by its `myshopify.com` domain, or unique Shop ID.

Pass the shop ID to your database query step to retrieve the corresponding record of the shop to retrieve the shop's access token.

### Use the Shopify Developer App integration

Then pass the shop's access token to a no-code Shopify Developer App action, or use Node.js/Python code to perform a raw HTTP request against the Shopify Admin GraphQL or REST API.

For example, in a pre-built action like *Add Tags*, click _use external authentication_ to pass in your database stored access token:

![Use external account to pass in your database managed Shopify store oauth access tokens to perform actions on behalf of merchants](https://res.cloudinary.com/pipedreamin/image/upload/v1714495695/marketplace/apps/shopify_developer_a/CleanShot_2024-04-30_at_12.47.21_cewyzb.png)

This will switch the action to allow you to pass in the merchants access token from your database query step:

![Using the store's access token as a prop input](https://res.cloudinary.com/pipedreamin/image/upload/v1714495801/marketplace/apps/shopify_developer_a/CleanShot_2024-04-30_at_12.49.43_qclqdi.png)

# Example Use Cases

- **Automated Order Fulfillment Workflow**: When a new order is received in Shopify, a Pipedream workflow can be triggered, automatically notifying a fulfillment service or updating an inventory management system. This ensures quick response times and keeps inventory levels accurate.

- **Customer Segmentation and Personalized Marketing**: Pipedream can listen for customer creation events on Shopify. When a new customer is added, the workflow can segment them based on predefined criteria, such as order value or location, and add them to corresponding marketing campaigns in email marketing platforms like Mailchimp.

- **Real-time Stock Level Alerts**: Set up a Pipedream workflow to monitor product stock levels on Shopify. When a product's stock falls below a certain threshold, trigger an alert that is sent out via Slack, SMS, or email to prompt immediate restocking actions, ensuring that popular products are always available to customers.
