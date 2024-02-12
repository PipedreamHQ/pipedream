# Accessing credentials via API

When you [connect an account](/connected-accounts/#connecting-accounts), you can use its credentials in workflows, authorizing requests to any app. Pipedream manages the OAuth process for [OAuth apps](/connected-accounts/#oauth), ensuring you always have a fresh access token for requests.

You can also access account credentials from the Pipedream API, using them in any other tool or app where you need auth.

::: tip The credentials API is in beta

Accessing credentials via API is in **beta**, and we're looking for feedback. Please [let us know](https://pipedream.com/support) how you're using it, what's not working, and what else you'd like to see.

During the beta:

- All API calls to `/v1/accounts/*` are free.
- The API is subject to change.

:::

[[toc]]

## Using the credentials API

1. [Connect your account](/connected-accounts/#connecting-a-new-account)
2. On [https://pipedream.com/accounts](https://pipedream.com/accounts), find your account and click the `...` to the right of the account,
3. **Copy Account ID**

<div>
<img src="https://res.cloudinary.com/pipedreamin/image/upload/v1707622922/docs/Screenshot_2024-02-10_at_7.10.59_PM_zxfpkt.png" />
</div>

4. Make a request to the [**Get account credentials** endpoint](/api/rest/#get-account-credentials).

:::: tabs :options="{ useUrlFragment: false }"

::: tab "Pipedream (Node.js)"

```javascript
export default defineComponent({
  props: {
    pipedream: {
      type: "app",
      app: "pipedream",
    },
    accountId: {
      type: "string",
      label: "Account ID",
    },
  },
  async run({ steps, $ }) {
    const url = `https://api.pipedream.com/v1/accounts/${this.accoundId}/credentials`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.pipedream.$auth.api_key}`,
    };

    const response = await fetch(url, {
      method: "GET",
      headers,
    });
    if (!response.ok) throw new Error(`API request failed: ${response.status}`);
    return await response.json();
  },
});
```

:::

::: tab "Pipedream (Python)"

```python
import requests

def handler(pd: "pipedream"):
    headers = {
      'Content-Type': 'application/json',
      'Authorization': f'Bearer {pd.inputs["pipedream"]["$auth"]["api_key"]}',
    };
    r = requests.get("https://api.pipedream.com/v1/accounts/<ACCOUNT_ID>/credentials", headers=headers)
    return r.json()
```

:::

::: tab "cURL"

```bash
curl 'https://api.pipedream.com/v1/accounts/<ACCOUNT_ID>/credentials' \
  -H "Authorization: Bearer <PIPEDREAM_API_KEY>"
```

:::

::: tab "Node.js v20"

```javascript
const url = `https://api.pipedream.com/v1/accounts/<ACCOUNT_ID>/credentials`;
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer <PIPEDREAM_API_KEY>`,
};

const response = await fetch(url, {
  method: "GET",
  headers,
});
if (!response.ok) throw new Error(`API request failed: ${response.status}`);

// Credentials are in data.credentials
const { data } = await response.json();
```

:::

::: tab "Python 3.12"

```python
import requests

headers = {
  'Content-Type': 'application/json',
  'Authorization': f'Bearer <PIPEDREAM_API_KEY>',
};
r = requests.get("https://api.pipedream.com/v1/accounts/<ACCOUNT_ID>/credentials", headers=headers)

# Credentials are in data.data.credentials
data = r.json()
```

:::

::::

5. It's not necessary to fetch credentials on every request to your app. You should [cache credentials in your own DB](#caching-credentials), refreshing them only when necessary.

## Caching credentials

Access tokens for most OAuth services are valid for at least one hour. Some tokens have a longer expiry, and some are static until rotated or revoked.

The response from `/v1/accounts/:id` contains an `expires_at` field, an ISO timestamp representing the expiry of the current token. This maps to the `expires_at` timestamp in the OAuth access token response. While tokens are not guaranteed to be valid until expiry, they are for most APIs in practice. We recommend caching credentials with the `expires_at` timestamp, using the tokens until expiry, retrieving new credentials only after expiry or when you encounter auth errors when making your API request.

If `expires_at` is missing or `null`, the credentials do not expire.

```javascript
/*** PSEUDO-CODE — use this as a guide ***/

// Fetch the most-recent token and expiry from cache / DB
const cache = Cache();
const { oauth_access_token, expires_at } = await cache.get("credentials");

// Only fetch new tokens when expired
let token = oauth_access_token;
if (expires_at && new Date(expires_at) < new Date()) {
  const url = `https://api.pipedream.com/v1/accounts/<ACCOUNT_ID>/credentials`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer <PIPEDREAM_API_KEY>`,
  };

  const response = await fetch(url, {
    method: "GET",
    headers,
  });
  if (!response.ok)
    throw new Error(`Unable to fetch token: ${response.status}`);

  const { data } = await response.json();
  const newToken = data?.credentials?.oauth_access_token;
  if (!newToken) throw new Error("No access token");
  token = newToken;
}

// Use `token` in API requests
```

Since these credentials are sensitive, you should encrypt them in the DB or data store you're using, decrypting them only at runtime when authorizing API requests.

## Security

[See our security docs](/privacy-and-security/#third-party-oauth-grants-api-keys-and-environment-variables) for details on how Pipedream secures your credentials.

Connected accounts are private by default. You can [manage access control](/connected-accounts/#managing-access) to expose them to other members of your workspace.
