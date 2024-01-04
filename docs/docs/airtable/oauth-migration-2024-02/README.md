# Update to the Airtable Integration on Pipedream (January 2024)

Effective 2024-02-01, Airtable will be deprecating its API Key authentication method. To learn more about this change, please visit Airtable’s [support page](https://support.airtable.com/docs/airtable-api-key-deprecation-notice).

### Why is Airtable deprecating API Key support?
OAuth provides more granular control of resources and scopes, and enables both developers and end-users to extend Airtable while ensuring the highest grade of security.

### How will this impact my workflows?
Starting 2024-02-01, any Pipedream workflow using the legacy Airtable (API Key) integration will no longer work. 

### What do I need to do?

1. **Reconnect your Airtable account**: Visit https://pipedream.com/accounts and connect your Airtable account using the new application, which utilizes OAuth.

![Airtable Account Connection](https://res.cloudinary.com/dpenc2lit/image/upload/v1704326732/Screenshot_2024-01-03_at_4.02.24_PM_kvasnc.png)

You will be prompted to grant Pipedream access to Airtable, and you can choose an individual base in a workspace, all current and future bases in a given workspace, or all workspaces.

<img src="https://res.cloudinary.com/dpenc2lit/image/upload/v1704326731/Screenshot_2024-01-03_at_4.02.48_PM_mnukaj.png" width=400>

2. **Update Your Workflows**: After reconnecting to Airtable via OAuth, you'll need to update your existing workflows that utilize Airtable:
    - Remove your old Airtable triggers, and reconfigure them using the new Airtable app.
    - Remove your old Airtable action, and reconfigure them using the new Airtable app.

2a. **If you are using code steps:**
    - Change any of your code steps to reference `airtable_oauth` instead of `airtable`. 
    - Modify your authorization headers accordingly, from

    ```"Authorization": `${this.airtable.$auth.api_key}`,```

    to 

    ```Authorization: `Bearer ${this.airtable_oauth.$auth.oauth_access_token}```

This is what your code step may have looked like before:

``` javascript
import { axios } from "@pipedream/platform"
export default defineComponent({
  props: {
    airtable: {
      type: "app",
      app: "airtable",
    }
  },
  async run({steps, $}) {
    return await axios($, {
      url: `https://api.airtable.com/v0/meta/whoami`,
      headers: {
        "Authorization": `${this.airtable.$auth.api_key}`,
        "Content-Type": `application/json`,
      },
    })
  },
})

```

And here's an example of the updated code step that uses the updated app, **`airtable_oauth`** instead with the updated authentication method:

``` javascript
import { axios } from "@pipedream/platform"
export default defineComponent({
  props: {
    airtable_oauth: {
      type: "app",
      app: "airtable_oauth",
    }
  },
  async run({steps, $}) {
    return await axios($, {
      url: `https://api.airtable.com/v0/meta/whoami`,
      headers: {
        Authorization: `Bearer ${this.airtable_oauth.$auth.oauth_access_token}`,
      },
    })
  },
})

```

3. **Test and redeploy your workflows.**