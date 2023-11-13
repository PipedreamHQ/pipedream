# Single Sign-On Overview

Pipedream supports Single Sign-On (SSO) using SAML or Google OAuth, which allows IT and team administrators easier controls to manage access and security.

Using SSO with your Identity Provider (IdP) centralizes user login management and provides a single point of control for IT teams and employees.

[[toc]]

## Requirements for SSO
- Your workspace must be on a [Business or Enterprise plan](https://pipedream.com/pricing)
- If using SAML, your Identity Provider must support SAML 2.0
- Only workspace admins and owners can configure SSO
- Your workspace admin or owner must verify ownership of the SSO email domain

:::tip The below content is for workspace admins and owners
Only workspace admins and owners have access to add verified domains, set up SSO, and configure workspace login methods
:::

## Verifying your Email Domain
In order to configure SAML SSO for your workspace, you first need to verify ownership of the email domain. If configuring Google OAuth (not SAML), you can skip this section.

1. Navigate to the [Verified Domains](https://pipedream.com/settings/domains) section of your workspace settings
2. Enter the domain you'd like to use for SSO (for example, `your-company.com`), then click **Add Domain**
3. You'll see a modal with instructions for adding a TXT record in the DNS configuration for your domain
4. Sometimes the DNS changes can take up to 72 hours to propagate. Once they're live, click the **Verify** button for the domain you've entered.
5. Once Pipedream verifies the TXT record, we'll show a green checkmark on the domain

![Verified Domain](https://res.cloudinary.com/pipedreamin/image/upload/v1699911275/Google_Chrome_-_Settings_-_Verified_Domains_-_Pipedream_2023-11-13_at_1.29.35_PM_zhvfj2.png)

:::tip Make sure to verify all your email domains
There's no limit on the number of domains you can verify for SSO, so if you use `your-company.com`, `your-company.net`, and `foo.your-company.com`, make sure to verify each one.
:::

## Setting up SSO
Navigate to the [Authentication section](https://pipedream.com/settings/domains) in your workspace settings to get started.

### SAML SSO

1. First, make sure you've verified the domain(s) you intend to use for SSO ([see above](#verifying-your-email-domain))
2. Click the **Enable SSO** toggle and select **SAML**
3. If setting up SAML SSO, you'll need to enter a metadata URL, which contains all the necessary configuration for Pipedream. Refer to the provider-specific docs for the detailed walk-through ([Okta](./okta), [Google Workspace](./google), [any other SAML provider](./saml)).
4. Click **Save**

### Google OAuth

1. Click the **Enable SSO** toggle and select **Google**
2. Enter the domain that you use with Google OAuth. For example, `vandalayindustries.com`
3. Click **Save**

## Restricting Login Methods
Once you've configured SSO for your workspace, you can restrict the allowed login methods for everyone.

![Restrict Login Methods](https://res.cloudinary.com/pipedreamin/image/upload/v1699914460/Google_Chrome_-_Settings_-_Authentication_-_Pipedream_2023-11-13_at_2.27.08_PM_x1ahod.png)

| Login Method | Description |
| --  | -- |
| **Any login method** | Everyone in the workspace can sign in using email and password, Google OAuth, GitHub, or SSO |
| **SSO only** | Workspace members and admins must [sign in using SSO](https://pipedream.com/auth/sso) |
| **SSO with guests** | Workspace members and admins must [sign in using SSO](https://pipedream.com/auth/sso) when signing in with a verified email domain. Guests can sign in with any login method. |

:::tip Workspace owners can always sign in using any login method
In order to ensure you don't get locked out of your Pipedream workspace in the event of an outage with your IdP, workspace owners can always sign in via email and password or Google / GitHub.
:::
