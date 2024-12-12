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

## Customizing API requests with the Pipedream proxy

The Pipedream components interact with Google Ads API through Pipedream's proxy service, which handles authentication and developer token requirements.

The component accepts a standard Google Ads API request object with the following structure:

```javascript
const googleAdsReq = {
  method: "get|post|put|delete",  // HTTP method
  url: "/v16/...",                // Google Ads API endpoint path
  headers: {
    "Authorization": `Bearer ${this.googleAds.$auth.oauth_access_token}`
  },
  data: {}                        // Optional request body for POST/PUT requests
}
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
    "Authorization": `Bearer ${this.googleAds.$auth.oauth_access_token}`
  },
  data: {
    query: "SELECT campaign.id, campaign.name FROM campaign"
  }
}
```

The proxy endpoint will remain the same: `https://eolid4dq1k0t9hi.m.pipedream.net`
