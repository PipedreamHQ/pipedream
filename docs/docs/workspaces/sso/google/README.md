# Configure SSO with Google Workspace

Pipedream supports Single Sign-On (SSO) with Google Workspace. This guide shows you how to configure SSO in Pipedream to authenticate with your Google org.

[[toc]]

## Requirements

- SSO is only supported for [workspaces](/workspaces/) on the Business and Enterprise plans. Visit the [Pipedream pricing page](https://pipedream.com/pricing) to upgrade.
- You need an administrator of your Pipedream workspace and someone who can [create SAML apps in Google Workspace](https://apps.google.com/supportwidget/articlehome?hl=en&article_url=https%3A%2F%2Fsupport.google.com%2Fa%2Fanswer%2F6087519%3Fhl%3Den&assistant_id=generic-unu&product_context=6087519&product_name=UnuFlow&trigger_context=a) to configure SSO.

## Configuration

To configure SSO in Pipedream, you need to set up a [SAML application](https://apps.google.com/supportwidget/articlehome?hl=en&article_url=https%3A%2F%2Fsupport.google.com%2Fa%2Fanswer%2F6087519%3Fhl%3Den&assistant_id=generic-unu&product_context=6087519&product_name=UnuFlow&trigger_context=a) in Google Workspace. If you're a Google Workspace admin, you're all set. Otherwise, coordinate with a Google Workspace admin before you continue.

1. In your **Google Workspace** admin console, select **Apps** > **Web and Mobile apps**

<br />
<div>
<img alt="Create a new SAML app in Google Workspace" src="https://res.cloudinary.com/pipedreamin/image/upload/v1693962607/docs/Screenshot_2023-09-05_at_6.04.53_PM_kr9oe4.png" width="300px" />
</div>
<br />

2. In the **Add app** menu, select the option to **Add custom SAML app**:

<br />
<div>
<img alt="Add app > Add custom SAML app" src="https://res.cloudinary.com/pipedreamin/image/upload/v1693962942/docs/Screenshot_2023-09-05_at_6.15.12_PM_jrzszg.png" width="300px" />
</div>
<br />

3. First, add **Pipedream** as the app name, and an app description that makes sense for your organization:

<br />
<div>
<img alt="App name + description" src="https://res.cloudinary.com/pipedreamin/image/upload/v1693963913/docs/Screenshot_2023-09-05_at_6.31.46_PM_ggnyrq.png" />
</div>
<br />

4. Continue past the configuration step:

<br />
<div>
<img alt="App name + description" src="https://res.cloudinary.com/pipedreamin/image/upload/v1693964121/docs/Screenshot_2023-09-05_at_6.35.15_PM_imjbuy.png" />
</div>
<br />

5. In the **Service provider details**, provide the following values:

- **ACS URL** — `https://api.pipedream.com/auth/saml/consume`
- **Entity ID** — Pipedream
- **Start URL** — `https://api.pipedream.com/auth/saml/<your workspace name>`

replacing `<your workspace name>` with the workspace name at [https://pipedream.com/settings/account](https://pipedream.com/settings/account). For example, if your workspace name is `example-workspace`, your start URL will be `https://api.pipedream.com/auth/saml/example-workspace`.

<br />
<div>
<img alt="SAML settings for Google Workspace" src="https://res.cloudinary.com/pipedreamin/image/upload/v1693964299/docs/Screenshot_2023-09-05_at_6.38.12_PM_wplrr0.png" />
</div>
<br />

In the **Name ID** section, provide these values:

- **Name ID format** — `EMAIL`
- **Name ID** — Basic Information > Primary email

then press **Continue**.

<br />
<div>
<img alt="SAML settings for Google Workspace" src="https://res.cloudinary.com/pipedreamin/image/upload/v1693965371/docs/Screenshot_2023-09-05_at_6.55.40_PM_f9fgyr.png" />
</div>
<br />

6. Once the app is configured, visit the **User access** section to add Google Workspace users to your Pipedream SAML app. See [step 14 of the Google Workspace SAML docs](https://apps.google.com/supportwidget/articlehome?hl=en&article_url=https%3A%2F%2Fsupport.google.com%2Fa%2Fanswer%2F6087519%3Fhl%3Den&assistant_id=generic-unu&product_context=6087519&product_name=UnuFlow&trigger_context=a) for more detail.

7. Pipedream requires access to SAML metadata at a publicly-accessible URL. This communicates public metadata about the identity provider (Google Workspace) that Pipedream can use to configure the SAML setup in Pipedream.

First, click the **Download Metadata** button on the left of the app configuration page:

<br />
<div>
<img alt="Download Metadata" src="https://res.cloudinary.com/pipedreamin/image/upload/v1694026083/docs/Screenshot_2023-09-06_at_11.47.33_AM_mez7j1.png" width="300px" />
</div>
<br />

**Host this file on a public web server where Pipedream can access it via URL**, for example: `https://example.com/metadata.xml`. You'll use that URL in the next step.

8. In Pipedream, visit your workspace's [authentication settings](https://pipedream.com/settings/authentication).
9. In the **Single Sign-On** section, select **SAML**, and add the URL from step 7 above in the **Metadata URL** field, then click Save.

<br />
<div>
<img alt="Pipedream SAML Metadata URL" src="https://res.cloudinary.com/pipedreamin/image/upload/v1699919663/saml-metadata-url_cxciur.png">
</div>
<br />

Any user in your workspace can now log into Pipedream at [https://pipedream.com/auth/sso](https://pipedream.com/auth/sso) by entering your workspaces's name (found in your [Settings](https://pipedream.com/settings/account)). You can also access your SSO sign in URL directly by visiting [https://pipedream.com/auth/sso/your-workspace-name](https://pipedream.com/auth/sso), where `your-workspace-name` is the name of your workspace.

## Important details

Before you configure the application in Google, make sure all your users have matching email addresses for their Pipedream user profile and their Google Workspace profile. Once SSO is enabled, they will not be able to change their Pipedream email address.

If a user's Pipedream email does not match the email in their Google profile, they will not be able to log in.

If existing users signed up for Pipedream using an email and password, they will no longer be able to do so. They will only be able to sign in using SSO.
