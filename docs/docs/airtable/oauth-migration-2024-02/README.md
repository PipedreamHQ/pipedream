# Update to the Airtable Integration on Pipedream (January 2024)

Effective February 1st 2024, Airtable's API Key authentication method will be deprecated. To learn more about this change, please visit Airtable’s [dedicated support page](https://support.airtable.com/docs/airtable-api-key-deprecation-notice). 

### How will this impact my workflows?

Starting February 1st 2024, all Pipedream steps using the legacy Airtable (API Key) integration including triggers and actions will no longer be able to authenticate with Airtable. 

### What do I need to do? 
<br/> 

1. **Reconnect your Airtable account**: 

- Visit the [accounts page in Pipedream](https://pipedream.com/accounts)
- Search for Airtable and connect your account
- This newer Pipedream integration uses OAuth instead of an API Key

![Airtable Account Connection](https://res.cloudinary.com/dpenc2lit/image/upload/v1704392183/Screenshot_2024-01-04_at_10.16.12_AM_le364k.png)

You can determine which workflows are connected to the legacy Airtable (API Key) app by expanding the account row on your Airtable (API Key) account connection.
![Airtable Accounts](https://res.cloudinary.com/dpenc2lit/image/upload/v1704347928/Screenshot_2024-01-03_at_9.58.43_PM_haaqlb.png)

2. **Update Your Workflows**: 

- After reconnecting to Airtable via OAuth, you'll need to update your existing workflows that use the legacy Airtable app.
- Remove any legacy Airtable sources and re-add the source using the new Airtable app
- Remove any legacy Airtable actions and re-add them using the new Airtable app

<br/>

3. **If you're using Airtable in code:**

- Change any of your code steps to reference `airtable_oauth` instead of `airtable`. 
- Modify your authorization headers accordingly

In Node.js, you would modify your authorization header from this:

  `"Authorization": ${this.airtable.$auth.api_key}`

  to 

``` Authorization: `Bearer ${this.airtable_oauth.$auth.oauth_access_token}` ```

This is what your Node.js code step may have looked like before:

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

In Python, here's a snippet of what your code step might have looked like before:
``` python
def handler(pd: "pipedream"):
  headers = {"X-Airtable-Api-Key": f'{pd.inputs["airtable"]["$auth"]["api_key"]}'}
```

And here's the updated Python code step, with **`airtable_oauth`** and the appropriate token and authorization headers:
``` python
def handler(pd: "pipedream"):
  token = f'{pd.inputs["airtable_oauth"]["$auth"]["oauth_access_token"]}'
  authorization = f'Bearer {token}'
  headers = {"Authorization": authorization}
```  

3. **Test and redeploy your workflows.**