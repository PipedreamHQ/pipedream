# Configure SSO with another SAML provider

Pipedream supports Single Sign-On (SSO) with any identity provider that supports SAML 2.0. This guide shows you how to configure SSO in Pipedream to authenticate with your SAML provider.

If you use [Okta](/workspaces/sso/okta/) or [Google Workspace](/workspaces/sso/google/), please review the guides for those apps.

[[toc]]

## Requirements

- SSO is only supported for [workspaces](/workspaces/) on the Business and Enterprise plans. Visit the [Pipedream pricing page](https://pipedream.com/pricing) to upgrade.
- You need an administrator of your Pipedream workspace and someone who can create SAML apps in your identity provider to configure SSO.

## SAML metadata

| Name                                    | Other names                            | Value                                                                                                                                                                                                                                                                                                                                                              |
| --------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SP Entity ID                            | Audience, Audience Restriction, SP URL | `Pipedream`                                                                                                                                                                                                                                                                                                                                                        |
| SP Assertion Consumer Service (ACS) URL | Reply or destination URL               | `https://api.pipedream.com/auth/saml/consume`                                                                                                                                                                                                                                                                                                                      |
| SP Single Sign-on URL                   | Start URL                              | `https://api.pipedream.com/auth/saml/<your workspace name>`<br /><br /> replacing `<your workspace name>` with the workspace name at [https://pipedream.com/settings/account](https://pipedream.com/settings/account). For example, if your workspace name is `example-workspace`, your start URL will be `https://api.pipedream.com/auth/saml/example-workspace`. |

## SAML attributes

- `NameID` — email

## Providing SAML metadata to Pipedream

Pipedream requires access to SAML metadata at a publicly-accessible URL. This communicates public metadata about the identity provider (your SSO provider) that Pipedream can use to configure the SAML setup in Pipedream.

Most SSO providers will provide a publicly-accessible metadata URL. If not, they should provide a mechanism to download the SAML metadata XML file. **Once you've configured your SAML app using the settings above, host this file on a public web server where Pipedream can access it via URL**, for example: `https://example.com/metadata.xml`.

Once you have a publicly-accessible URL that hosts your SAML metadata, visit your workspace's [authentication settings](https://pipedream.com/settings/authentication) in Pipedream. In the **Single Sign-On** section, select **SAML**, and add your metadata URL to the **Metadata URL** field, then click **Save**.

<br />
<div>
<img alt="Pipedream metadata URL" src="https://res.cloudinary.com/pipedreamin/image/upload/v1694026745/docs/Screenshot_2023-09-06_at_11.58.51_AM_vng2ja.png" width="600px" />
</div>
<br />

Any user in your workspace can now log into Pipedream at [https://pipedream.com/auth/sso](https://pipedream.com/auth/sso) by entering your workspaces's name (found in your [Settings](https://pipedream.com/settings/account)). You can also access your SSO sign in URL directly by visiting [https://pipedream.com/auth/sso/your_workspace_name](https://pipedream.com/auth/sso), where `your_workspace_name` is the name of your workspace.

## Important details

Before you configure the application in your IdP, make sure all your users have matching email addresses for their Pipedream user profile and their IdP profile. Once SSO is enabled, they will not be able to change their Pipedream email address.

If a user's Pipedream email does not match the email in their IdP profile, they will not be able to log in.

If existing users signed up for Pipedream using an email and password, they will no longer be able to do so. They will only be able to sign in using SSO.
