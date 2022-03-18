---
short_description: Store and read data with stores.
thumbnail: https://res.cloudinary.com/pipedreamin/image/upload/v1646763735/docs/icons/icons8-database-96_iv1oup.png
---

# Managing state

In Node.js (Javascript) code steps, you can also store and retrieve data within code steps without connecting a 3rd party database service.

This is very useful for tracking data between runs of a particular workflow, making sure workflows only run once per unique record or sharing data between workflows.

:::warning
This functionality is limited to only Node.js code steps at this time.

Other step languages like [Python](/code/python/), [Bash](/code/bash/) and [Go](/code/go/) do not have this feature available yet.

For more information on what functionality is available for those languages, please refer to their documentation.
:::

### Adding a data store to a Node.js Step

By default, Node.js steps don't have access to data stores. A data store can be added to your step by adding it as a `prop`.

```javascript
export default defineComponent({
  props: {
    // Define that the "db" variable in our component is a database
    store: { type: "store" }
  },
  async run({ steps, $ }) {
    // Now we can access the database at "this.store"
  }
});
```

:::tip
`props` injects variables under `this` scope in components.

In the above example we essentially instructed that this step needs the database injected into the `this.store` prop. 
:::

## Using the database

Once you have defined the data store as a prop for your component, you'll be able to create a new data store or use an existing one from your account.

![Create a new store or choose another one from your account for your component](https://res.cloudinary.com/pipedreamin/image/upload/v1647626951/docs/components/CleanShot_2022-03-18_at_14.08.01_2x_fyr3p4.png)

If you create a new store, you'll be able to view its contents from within your account dashboard.

## Saving data

Data stores are a key-value store, you can save data within a store using the `store.set` method. The first argument is the _key_ where the data should be held, and the 2nd argument is the _value_ assigned to that key.

```javascript
export default defineComponent({
  props: {
    store: { type: "store" },
  },
  async run({ steps, $ }) {
    // Store a timestamp each time this step is executed in the workflow
    this.store.set('lastRanAt', new Date());
  },
})
```

## Retrieving data

You can retrieve data with the in-step database using the `get` method. Pass the _key_ to the `get` method to retrieve the content that was stored there with `set`.

```javascript
export default defineComponent({
  props: {
    store: { type: "store" },
  },
  async run({ steps, $ }) {
    // Retrieve the timestamp representing last time this step executed
    const lastRanAt = this.store.get('lastRanAt'); 
  },
})
```

## Viewing store data

You can view the real time store data in your [Pipedream dashboard](https://pipedream.com/stores).

From here you can also manually edit your store's data, rename stores, delete stores or create new stores.

## Using multiple stores in a single code step

It is possible to use multiple stores in a single code step, just make a unique name per store in the `props` definition. Let's define 2 separate `customers` and `orders` sources and leverage them in a single code step:

```javascript
export default defineComponent({
  props: {
    customers: {
      type: "store",
    },
    orders: {
      type: "store"
    }
  },
  async run({ steps, $ }) {
    // Retrieve the customer from our customer store 
    const customer = this.customer.get(steps.trigger.event.customer_id);
    // Retrieve the order from our order data store
    const order = this.orders.get(steps.trigger.event.order_id);
  },
})
```

## Workflow counter example

For example, if you'd like to set up a counter to count the number of times the workflow executes:

```javascript
export default defineComponent({
  props: {
    store: { type: "store" },
  },
  async run({ steps, $ }) {
    // By default, all database entries are undefined.
    // It's wise to set a default value so our code as an initial value to work with
    const counter = this.store.get('counter') ?? 0;
    
    // On the first run "counter" will be 0 and we'll increment it to 1
    // The next run will increment the counter to 2, and so forth
    this.store.set('counter', counter + 1);
  },
})
```

## Dedupe data example

This database is also useful for storing data from prior runs to prevent acting on duplicate data, or data that's been seen before.

For example, this workflow's trigger contains an email address from a potential new customer. But we want to track all emails collected so we don't send a welcome email twice:

```javascript
export default defineComponent({
  props: {
    store: { type: "store" },
  },
  async run({ steps, $ }) {
    const email = steps.trigger.body.new_customer_email;
    // Retrieve the past recorded emails from other runs
    const emails = this.store.get('emails') ?? [];

    // If the current email being passed from our webhook is already in our list, exit early
    if(emails.includes(email)) {
      return $.flow.exit('Already welcomed this user');
    }

    // Add the current email to the list of past emails so we can detect it in the future runs
    this.store.set('emails', [...emails, email]);
  },
})
```

## Data store limitations

The data sources is only currently available in Node.js code steps. It is not yet available in other languages like Go, bash or Python.

In addition, data sources can hold up to {{ $site.themeConfig.SERVICE_DB_SIZE_LIMIT }} per step.

### Supported data types

Data stores can hold any JSON serializable data within the storage limits. This includes data types like:

* Strings
* Objects
* Arrays
* Dates
* Integers
* Floats

But it will not work well with Functions or Classes.
