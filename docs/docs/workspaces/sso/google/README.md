# Configuring SSO with Google

Pipedream supports Single-sign on (SSO) with Google Workspace. This guide shows you how to configure SSO in Pipedream to authenticate with your Google org.

[[toc]]

## Requirements

- SSO is only supported for [workspaces](/workspaces/) on the Business and Enterprise plans. Visit the [Pipedream pricing page](https://pipedream.com/pricing) to upgrade.
- You must be an administrator of your Pipedream workspace.

## Configuration

1. Visit your workspace's [account settings](https://pipedream.com/settings/account)
2. In the **Auth** section, select **Google OAuth** and enter your Google Workspace domain (the domain tied to your email address).

<div>
<img src="https://res.cloudinary.com/pipedreamin/image/upload/v1675659743/docs/Screen_Shot_2023-02-05_at_9.01.55_PM_kr6h8o.png" width="400px">
</div>

3. Press **Confirm**

Any user in your workspace can now log into Pipedream at [https://pipedream.com/auth/sso](https://pipedream.com/auth/sso) by entering your workspaces's name (found in your [Settings](https://pipedream.com/settings/account)). You can also access your SSO sign in URL directly by visiting [https://pipedream.com/auth/sso/your_workspace_name](https://pipedream.com/auth/sso), where `your_workspace_name` is the name of your workspace.

## Important details

Before you configure the application in Google, make sure all your users have matching email addresses for their Pipedream user profile and their Google Workspace profile. Once SSO is enabled, they will not be able to change their Pipedream email address.

If a user's Pipedream email does not match the email in their IDP profile, they will not be able to log in.

If existing users signed up for Pipedream using an email and password, they will no longer be able to do so. They will only be able to sign in using SSO.
