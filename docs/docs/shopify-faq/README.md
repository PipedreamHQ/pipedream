# Shopify integration on Pipedream

As of October 15, 2023, Shopify will no longer allow their customers to access **[Protected Customer Data](https://www.shopify.com/partners/blog/data-protection)** on Pipedream.

[[toc]]

### What is Protected Customer Data?
**Refer to [Shopify's docs](https://www.shopify.com/partners/blog/data-protection) for the latest**, but here is what they say:
> Protected customer data includes any data that relates directly to a customer or prospective customer, as represented in the API resources. This includes information like total order value, line items in an order, and order shipping events. Apps that require this level of data must implement our [data protection requirements](https://shopify.dev/apps/store/data-protection/protected-customer-data?shpxid=aa95abd6-7955-4C12-6DB9-B3C3859B16AE), including informing merchants of your app’s data use and purpose, applying customer consent decisions, opt-out requests, and more.

> Protected customer fields require individual configuration and approval, in addition to approval for protected customer data. This includes information like name, address, email, and phone number. Apps that require this layer of data will need to abide by [additional requirements](https://shopify.dev/apps/store/data-protection/protected-customer-data?shpxid=aa95abd6-7955-4C12-6DB9-B3C3859B16AE#requirements), including encrypting your data back ups, keeping test and production data separate, and more.

### How do I know if this is relevant to me?

### Why is this data no longer available in Pipedream?
We've invested significant Product and Engineering time to get our app approved based on Shopify’s requirements, and unfortunately they’ve been inflexible and unwilling to support our use case. It’s clear that their marketplace requirements are designed exclusively for Shopify merchants and excludes app-agnostic platforms like Pipedream.

### How will this impact my workflows?
Starting October 15, the relevant APIs will return a message like this:
``` javascript
[{
	"message": "This app is not approved to access the Order object. See https://partners.shopify.com/1150772/apps/3141151/customer_data for more details.",
	"locations": [{
		"line": 2,
		"column": 9
	}],
	"path": ["order"],
	"extensions": {
		"code": "ACCESS_DENIED",
		"documentation": "https://partners.shopify.com/1150772/apps/3141151/customer_data"
	}
}]
```

### What are my options?
#### Continue using the existing [Shopify app](https://pipedream.com/apps/shopify)
- This will continue to work in Pipedream for the rest of their API. If you don't use any Protected Customer Data or Fields, you'll still need to update any triggers or actions you're using, but no further changes will be required.

#### Use a custom Shopify app
-  