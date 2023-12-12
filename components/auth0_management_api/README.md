# Overview

The Auth0 Management API can be used to create, read, update,
and delete users, as well as to query for them. Additionally, you can
use the Management API to change user passwords, add and remove user roles,
link and unlink user accounts, and more. For more information, see the Auth0 Management API documentation [here](https://auth0.com/docs/api/management/v2).

# Getting Started

This application enables you to use your own Auth0 machine-to-machine application to interact with the Auth0 Management API via Pipedream. The steps are outlined below:

## Creating a machine to machine application in Auth0

1. Sign in to your [Auth0 Account](https://auth0.com/api/auth/login?redirectTo=dashboard).
2. From your dashboard, click **Applications** in the left-hand sidebar, then **Create Application**.

  ![Create Application](https://res.cloudinary.com/dpenc2lit/image/upload/v1702076532/Screenshot_2023-12-08_at_3.01.19_PM_xjpbbp.png)

3. Name your application, and select **Machine to Machine Applications** and click **Create**.

4. Select **Auth0 Management API**, and add the permissions relevant to your use case. In this example, we've selected permissions to create, read, update, and delete users. 

  ![Choose relevant permissions](https://res.cloudinary.com/dpenc2lit/image/upload/v1702076913/Screenshot_2023-12-08_at_3.08.28_PM_hg5nbq.png)

5. Copy the **Domain**, **Client ID**, and **Client Secret** from your application's **Settings** tab.

  ![Copy relevant connection credentials](https://res.cloudinary.com/dpenc2lit/image/upload/v1702077093/Screenshot_2023-12-08_at_3.11.28_PM_ril458.png)

6. Navigate to **Applications** >> **API Audience** on the lefthand sidebar, and copy the **API Audience**.
   
  ![Copy API Audience URL](https://res.cloudinary.com/dpenc2lit/image/upload/v1702077306/Screenshot_2023-12-08_at_3.14.54_PM_blz4pg.png)

7. You should now have the credentials you need to connect your Auth0 application to Pipedream!