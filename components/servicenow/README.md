# Overview

Using the ServiceNow API, you can build a variety of powerful applications that
help you extend and enhance the capabilities of your ServiceNow implementation.
The possibilities are endless! You can:

- Create custom pages and widgets that provide additional functionality and
  data visualizations tailored to your needs
- Automate user and business processes with the help of integration tools
- Streamline production deployments and drive up efficiency with workflow
  systems
- Develop custom plugins to facilitate data exchange with other systems
- Leverage machine learning to extract knowledge from large data sets and
  create predictive models
- Create interactive chatbots for providing support or collecting feedback
- Generate custom reports for tracking performance and resource utilization
- And much more!

No matter whether you are looking to extend existing features or build
something totally new, the ServiceNow API offers the perfect solution!

# Getting Started

Before you can use the ServiceNow REST API from a workflow, you need to configure an OAuth app in your ServiceNow instance that will grant access tokens to your users and authenticate requests to its REST API. 

1. In your ServiceNow instance, visit the **Application Registry** and create a new app, choosing the **Create an OAuth API endpoint for external clients** option.
2. Name it something memorable, then leave every other field blank or keep the defaults, except for the **Redirect URL**, which should be: `https://api.pipedream.com/connect/oauth/oa_g2oiqA/callback`. Your app should look something like this:

<div>
<img alt="ServiceNow OAuth app config" src="https://res.cloudinary.com/pipedreamin/image/upload/v1681312149/docs/components/ServiceNow/oauth-app-config_kmnpav.png">
</div>

1. Next, you'll need to copy the client ID and secret generated in **Step 2**, and add another app. This time, select the option to **Connect to a third party OAuth Provider**.
2. Name this app something like **Pipedream OAuth Validator**, and add the client ID / secret from **Step 2**. Change the grant type to **Authorization Code**, and set the **Token URL** to `oauth_token.do` (without any hostname, this refers to the current instance). Finally, add the same **Redirect URL** as you did above: `https://api.pipedream.com/connect/oauth/oa_g2oiqA/callback`. This app's configuration should look something like this when complete:

<div>
<img alt="ServiceNow OAuth validator app config" src="https://res.cloudinary.com/pipedreamin/image/upload/v1681312149/docs/components/ServiceNow/oauth-validator-config_ij6ef0.png">
</div>

1. Visit [https://pipedream.com/accounts](https://pipedream.com/accounts), and click the button labeled **Click Here to Connect An App** in the top-right. In the modal that appears, search for **ServiceNow** and select it. You'll be prompted to enter the client ID and client secret from **Step 2** above, as well as the name of your instance. The instance name is the _host_ portion of your instance's URL: that is, the `dev98042` in `https://dev98042.service-now.com/`.

<div>
<img alt="Pipedream app config" width="600" src="https://res.cloudinary.com/pipedreamin/image/upload/v1681312149/docs/components/ServiceNow/oauth-app-config_kmnpav.png">
</div>

6. Press **Connect** in the bottom-right of the modal. This should open up a new window asking you to login to your ServiceNow instance. This authorizes Pipedream's access to your ServiceNow account, and you should be ready to connect to your instance's REST API!

Collectively, the two apps you configured in your ServiceNow instance allow your instance to issue new OAuth access tokens for the user who authenticated in **Step 6**. This allows Pipedream to retrieve a fresh access token before it makes requests to the ServiceNow REST API.

## ServiceNow Authorization Reference

[This ServiceNow doc](https://docs.servicenow.com/bundle/orlando-platform-administration/page/administer/security/concept/c_OAuthAuthorizationCodeFlow.html) describes the general flow we ask you to implement above. In that doc, the app you create in **Step 2** is referred to as the **client application**, and the app in **Step 4** is referred to as the **OAuth provider application registry record**.

## Additional Guidance For Hardened or Mature Instances ###

The instructions above are likely to work on a fresh, out-of-the-box instance but may work imperfectly on ServiceNow instances that have been customized or have applied various security hardening recommendations such as the [explicit roles plugin](https://docs.servicenow.com/en-US/bundle/vancouver-platform-security/page/administer/security/reference/explicit-role-plugin.html).

Symptoms of problems here may include getting a **504 Gateway Time-out** error when completing step 6 above. If you manually test the connection deatails in a tool like Postman, you may get an error like this:

```
{
  "error_description":"access_denied",
  "error":"server_error"
}
```

In these instances, the following tips may be helpful:

* Create a dedicated role for this purpose, and assign it to a service account that  is only used for this purpose.  You should not set it for web service access only, since interactive access is required to complete Pipedream setup.
* Ensure that the dedicated role has ACLs configured to allow read for the oauth_credential table - both the table and table.\* for all fields. 
* Assign snc_internal to this service account. This is important if you are using the explicit roles plugin as part of instance security hardening.

Finally, while not required, you should also check that the role has associated ACLs for any tables you want to work with; by default they may if you use snc_internal, but some fields extended from task or other tables may require additional ACLs based on your instance's configuration.

# Troubleshooting
If you're getting a **504 Gateway Time-out** error when attempting to connect your ServiceNow account, review the section above on "Additional Guidance For Hardened or Mature Instances".
