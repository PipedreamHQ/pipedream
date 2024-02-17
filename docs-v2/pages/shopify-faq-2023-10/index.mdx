# Update to the Shopify Integration on Pipedream (October 2023)

Effective 2023-10-15, Shopify will no longer allow their customers to access **[Protected Customer Data](https://www.shopify.com/partners/blog/data-protection)** on Pipedream.

[[toc]]

### What is Protected Customer Data?
**Refer to Shopify's docs for the latest**, but [here is what they say](https://www.shopify.com/partners/blog/data-protection):
> Protected customer data includes any data that relates directly to a customer or prospective customer, as represented in the API resources. This includes information like total order value, line items in an order, and order shipping events. Apps that require this level of data must implement our [data protection requirements](https://shopify.dev/apps/store/data-protection/protected-customer-data?shpxid=aa95abd6-7955-4C12-6DB9-B3C3859B16AE), including informing merchants of your app’s data use and purpose, applying customer consent decisions, opt-out requests, and more.

> Protected customer fields require individual configuration and approval, in addition to approval for protected customer data. This includes information like name, address, email, and phone number. Apps that require this layer of data will need to abide by [additional requirements](https://shopify.dev/apps/store/data-protection/protected-customer-data?shpxid=aa95abd6-7955-4C12-6DB9-B3C3859B16AE#requirements), including encrypting your data back ups, keeping test and production data separate, and more.

### Why is this data no longer available in Pipedream?
We've invested significant Product and Engineering time to get our app approved based on Shopify’s requirements, and unfortunately they’ve been unwilling to support the use case of an app-agnostic platform like Pipedream.

### How will this impact my workflows?
Starting 2023-10-15, the relevant API calls will return a message like this:

![Restricted Customer Fields](https://res.cloudinary.com/pipedreamin/image/upload/v1695097066/shopify-customer-fields_f7enlk.png)

### What do I need to do?

#### Use a custom Shopify app
- Create a custom Shopify app for your Shopify store and connect it to Pipedream using the [Shopify Developer App](https://pipedream.com/apps/shopify-developer-app#getting-started)
- Custom apps that are not distributed on Shopify’s app store do not have to meet any of their review requirements, but [can only be connected to a single Shopify store](https://shopify.dev/docs/apps/distribution)
- Each “app” represents a unique connected account for the Shopify Developer app in Pipedream
- All of the triggers and actions from the main Shopify app are supported on the [Shopify Developer App](https://pipedream.com/apps/shopify-developer-app/#popular-shopify-developer-app-triggers) (including those that access Protected Customer Data)
- You’ll need to modify each workflow that uses Shopify to use the Shopify Developer app instead of the main Shopify app 

Here's an example of a code step using the **`shopify`** app:

``` javascript
import { axios } from "@pipedream/platform"
export default defineComponent({
  props: {
    // Note the prop definition
    shopify: {
      type: "app",
      app: "shopify",
    },
    customerEmail: {
      type: "string"
      label: "Customer Email"
    }
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

And here's an example of the updated code step that uses a custom app with the **`shopify_developer_app`** instead:

``` javascript
import { axios } from "@pipedream/platform"
export default defineComponent({
  props: {
    // Note the updated prop definition
    shopify_developer_app: {
      type: "app",
      app: "shopify_developer_app",
    },
    customerEmail: {
      type: "string"
      label: "Customer Email"
    }
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