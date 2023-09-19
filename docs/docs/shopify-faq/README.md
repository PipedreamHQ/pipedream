# October 2023 Update to the Shopify Integration on Pipedream

Effective October 15, 2023, Shopify will no longer allow their customers to access **[Protected Customer Data](https://www.shopify.com/partners/blog/data-protection)** on Pipedream.

[[toc]]

### What is Protected Customer Data?
**Refer to [Shopify's docs](https://www.shopify.com/partners/blog/data-protection) for the latest**, but here is what they say:
> Protected customer data includes any data that relates directly to a customer or prospective customer, as represented in the API resources. This includes information like total order value, line items in an order, and order shipping events. Apps that require this level of data must implement our [data protection requirements](https://shopify.dev/apps/store/data-protection/protected-customer-data?shpxid=aa95abd6-7955-4C12-6DB9-B3C3859B16AE), including informing merchants of your app’s data use and purpose, applying customer consent decisions, opt-out requests, and more.

> Protected customer fields require individual configuration and approval, in addition to approval for protected customer data. This includes information like name, address, email, and phone number. Apps that require this layer of data will need to abide by [additional requirements](https://shopify.dev/apps/store/data-protection/protected-customer-data?shpxid=aa95abd6-7955-4C12-6DB9-B3C3859B16AE#requirements), including encrypting your data back ups, keeping test and production data separate, and more.

### How do I know if this is relevant to me?
These actions use Protected Customer Data or Fields:
- [Create Customer](https://pipedream.com/apps/shopify/actions/create-customer)
- [Create Order](https://pipedream.com/apps/shopify/actions/create-order)
- [Search for Customers](https://pipedream.com/apps/shopify/actions/search-customers)
- [Update Customer](https://pipedream.com/apps/shopify/actions/update-customer)

These sources use Protected Customer Data or Fields:
- [New Abandoned Cart](https://pipedream.com/apps/shopify/triggers/new-abandoned-cart)
- [New Cancelled Order (Instant)](https://pipedream.com/apps/shopify/triggers/new-cancelled-order)
- [New Customer Created (Instant)](https://pipedream.com/apps/shopify/triggers/new-customer-created)
- [New Draft Order (Instant)](https://pipedream.com/apps/shopify/triggers/new-draft-order)
- [New Order Created (Instant)](https://pipedream.com/apps/shopify/triggers/new-order-created)
- [New Paid Order (Instant)](https://pipedream.com/apps/shopify/triggers/new-paid-order)
- [New Shipment (Instant)](https://pipedream.com/apps/shopify/triggers/new-shipment)
- [New Updated Customer (Instant)](https://pipedream.com/apps/shopify/triggers/new-updated-customer)
- [New Updated Order (Instant)](https://pipedream.com/apps/shopify/triggers/new-updated-order)

And if you're access those endpoints in custom code steps or HTTP requests using the main [Shopify](https://pipedream.com/apps/shopify) app, those requests will stop working after 2023-10-15.

### Why is this data no longer available in Pipedream?
We've invested significant Product and Engineering time to get our app approved based on Shopify’s requirements, and unfortunately they’ve been inflexible and unwilling to support the use case of an app-agnostic platform like Pipedream.

### How will this impact my workflows?
Starting October 15, the relevant APIs will return a message like this:
``` javascript
Error - Request failed with status code 403
{
	"errors": "[API] This app is not approved to access REST endpoints with protected customer data. See https://partners.shopify.com/1150772/apps/3141151/customer_data for more details."
}
```

### What are my options?
#### Continue using the main [Shopify app](https://pipedream.com/apps/shopify)
- The main Shopify app and all of the **current** sources and actions will continue to work in Pipedream (we've already removed the impacted sources and actions from the public registry)
- Make sure to [update any Shopify actions to the latest version](https://pipedream.com/docs/workflows/steps/actions/#updating-actions-to-the-latest-version)
- You'll need to remove and re-add any Shopify triggers you're currently using, in order to get the latest version

#### Use a custom Shopify app
- Create a custom Shopify app for your Shopify store
- Connect it to Pipedream using the [Shopify Developer App](https://pipedream.com/apps/shopify-developer-app)
- Custom apps that are not distributed on Shopify’s app store do not have to meet any of their review requirements, but [can only be connected to a single Shopify store](https://shopify.dev/docs/apps/distribution)
- Each “app” would be a unique connected account for the Shopify Developer app in Pipedream
- You’ll need to modify each workflow that uses Shopify to use the Shopify Developer app instead of the main Shopify app 

Here's an example of a code step using the `shopify` app:

``` javascript
import { axios } from "@pipedream/platform"
export default defineComponent({
  props: {
    // Note the prop definition
    shopify: {
      type: "app",
      app: "shopify",
    },
    customerEmail: "string"
  },
  async run({steps, $}) {
    return await axios($, {
      // Note the version
      url: `https://${this.shopify.$auth.shop_id}.myshopify.com/admin/api/2022-07/customers/search.json`,
      headers: {
        // Note the reference to the auth token
        "X-Shopify-Access-Token": `${this.shopify.$auth.oauth_access_token}`,
        "Content-Type": `application/json`,
      },
      params: {
        query: `email:${this.customerEmail}`
      }
    })
  },
})
```

And here's an example of the updated code step that uses a custom app instead:

``` javascript
import { axios } from "@pipedream/platform"
export default defineComponent({
  props: {
    // Note the updated prop definition
    shopify_developer_app: {
      type: "app",
      app: "shopify_developer_app",
    },
    customerEmail: "string"
  },
  async run({steps, $}) {
    return await axios($, {
      // Note the updated version
      url: `https://${this.shopify_developer_app.$auth.shop_id}.myshopify.com/admin/api/2023-07/customers/search.json`,
      headers: {
        // Note the updated reference to the auth token
        "X-Shopify-Access-Token": `${this.shopify_developer_app.$auth.access_token}`,
        "Content-Type": `application/json`,
      },
      params: {
        query: `email:${this.customerEmail}`
      }
    })
  },
})
```