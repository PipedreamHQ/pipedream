# Overview

The Google Ads API lets you programmatically manage your Google Ads data and
campaigns. You can use the API to automate common tasks, such as:

- Creating and managing campaigns
- Adding and removing keywords
- Adjusting bids

You can also use the API to get information about your campaigns, such as:

- Campaign stats
- Keyword stats
- Ad performance

The Google Ads API is a powerful tool that lets you manage your Google Ads data
and campaigns programmatically. With the API, you can automate common tasks,
such as creating and managing campaigns, adding and removing keywords, and
adjusting bids. You can also use the API to get information about your
campaigns, such as campaign stats, keyword stats, and ad performance.

## Customizing API requests from within the Pipedream workflow builder

The Pipedream components interact with Google Ads API through an internal proxy service, which protects Pipedream's developer token.

The component accepts a standard Google Ads API request object with the following structure:

```javascript
const googleAdsReq = {
  method: "get|post|put|delete", // HTTP method
  url: "/v21/...", // Google Ads API endpoint path
  headers: {
    Authorization: `Bearer ${this.googleAds.$auth.oauth_access_token}`,
  },
  data: {}, // Optional request body for POST/PUT requests
};
```

To make different API calls while using the proxy:

1. Modify the `url` path to match your desired Google Ads API endpoint
2. Update the `method` to match the required HTTP method
3. Add any necessary request body data in the `data` field
4. Include any required headers (Authorization is automatically included)

Example for a custom query:

```javascript
const googleAdsReq = {
  method: "post",
  url: "/v16/customers/1234567890/googleAds:search",
  headers: {
    Authorization: `Bearer ${this.googleAds.$auth.oauth_access_token}`,
  },
  data: {
    query: "SELECT campaign.id, campaign.name FROM campaign",
  },
};
```

**The proxy endpoint will remain the same: `https://googleads.m.pipedream.net`**

## Using Google Ads with the Connect API Proxy

To interface with Google Ads via the [Connect API Proxy](https://pipedream.com/docs/connect/api-proxy), you need to nest the request like this:

**Important notes:**

- The upstream URL in this case is Pipedream's proxy service for Google Ads: `https://googleads.m.pipedream.net`
- Like in the above examples, you'll define the Google Ads URL with the `url` param in the `body`
- The `method` to the Connect Proxy should always be a `POST`, since it's actually targeting the Google Ads proxy (you can define the method for the Google Ads request in `options.body.method`)

### Using the Pipedream SDK

```javascript
const pd = createBackendClient({
  apiHost: process.env.API_HOST,
  credentials: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  },
  environment: process.env.ENVIRONMENT,
  projectId: process.env.PROJECT_ID,
});

const pdGoogleAdsUrl = "https://googleads.m.pipedream.net";

const resp = await pd.makeProxyRequest(
  {
    searchParams: {
      external_user_id: process.env.EXTERNAL_USER_ID,
      account_id: process.env.ACCOUNT_ID,
    },
  },
  {
    url: pdGoogleAdsUrl,
    options: {
      method: "POST",
      body: {
        url: "/v19/customers:listAccessibleCustomers",
        method: "GET",
        // data: {} // If you need to send a body with a POST request, define it here
      },
    },
  }
);
```

### Using the Connect REST API

- Remember to use the Base64 encoded Pipedream endpoint for Google Ads: `https://googleads.m.pipedream.net`

```bash
curl -X POST "https://api.pipedream.com/v1/connect/{your_project_id}/proxy/{url_safe_base64_encoded_url}?external_user_id={external_user_id}&account_id={apn_xxxxxxx}" \
  -H "Authorization: Bearer {access_token}" \
  -H "x-pd-environment: {development | production}" \
  -d '{
    "url": "/v19/customers:listAccessibleCustomers",
    "method": "GET",
    # "data": {} # If you need to send a body with a POST request, define it here
  }'
```
