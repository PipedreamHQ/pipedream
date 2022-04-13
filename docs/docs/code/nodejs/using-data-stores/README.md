---
short_description: Store and read data with data stores.
thumbnail: https://res.cloudinary.com/pipedreamin/image/upload/v1646763735/docs/icons/icons8-database-96_iv1oup.png
---

# Using Data Stores 

In Node.js (Javascript) code steps, you can also store and retrieve data within code steps without connecting a 3rd party database.

Add data stores to steps as props. By adding the store as a prop, it's available under `this`. 

For example, you can define a data store as a data prop, and reference it at `this.data`:

```javascript
export default defineComponent({
  props: {
    // Define that the "db" variable in our component is a data store
    data: { type: "data_store" }
  },
  async run({ steps, $ }) {
    // Now we can access the data store at "this.store"
    await this.data.get("email");
  }
});
```

:::tip
`props` injects variables under `this` scope in components.

In the above example we essentially instructed that this step needs the data store injected into the `this.store` prop. 
:::

## Using the data store

Once you have defined a data store prop for your component, then you'll be able to create a new data store or use an existing one from your account.

![Create a new data store or choose another one from your account for your component](https://res.cloudinary.com/pipedreamin/image/upload/v1649270361/docs/components/data_store_scaffolding_bluivn.png)

## Saving data

Data Stores are a key-value stores. Save data within a Data Store using the `this.data.set` method. The first argument is the _key_ where the data should be held, and the second argument is the _value_ assigned to that key.

```javascript
export default defineComponent({
  props: {
    data: { type: "data_store" },
  },
  async run({ steps, $ }) {
    // Store a timestamp each time this step is executed in the workflow
    await this.data.set('lastRanAt', new Date());
  },
})
```

## Retrieving data

You can retrieve data with the Data Store using the `get` method. Pass the _key_ to the `get` method to retrieve the content that was stored there with `set`.

```javascript
export default defineComponent({
  props: {
    data: { type: "data_store" },
  },
  async run({ steps, $ }) {
    // Retrieve the timestamp representing last time this step executed
    const lastRanAt = await this.data.get('lastRanAt'); 
  },
})
```

## Viewing store data

You can view the contents of your data stores in your [Pipedream dashboard](https://pipedream.com/stores).

From here you can also manually edit your data store's data, rename stores, delete stores or create new stores.

## Using multiple data stores in a single code step

It is possible to use multiple data stores in a single code step, just make a unique name per store in the `props` definition. Let's define 2 separate `customers` and `orders` data sources and leverage them in a single code step:

```javascript
export default defineComponent({
  props: {
    customers: { type: "data_store" },
    orders: { type: "data_store" }
  },
  async run({ steps, $ }) {
    // Retrieve the customer from our customer store 
    const customer = await this.customer.get(steps.trigger.event.customer_id);
    // Retrieve the order from our order data store
    const order = await this.orders.get(steps.trigger.event.order_id);
  },
})
```

## Workflow counter example

You can use a data store as a counter. For example, this code counts the number of times the workflow runs:

```javascript
export default defineComponent({
  props: {
    data: { type: "data_store" },
  },
  async run({ steps, $ }) {
    // By default, all database entries are undefined.
    // It's wise to set a default value so our code as an initial value to work with
    const counter = await this.data.get('counter') ?? 0;
    
    // On the first run "counter" will be 0 and we'll increment it to 1
    // The next run will increment the counter to 2, and so forth
    await this.data.set('counter', counter + 1);
  },
})
```

## Dedupe data example

Data Stores are also useful for storing data from prior runs to prevent acting on duplicate data, or data that's been seen before.

For example, this workflow's trigger contains an email address from a potential new customer. But we want to track all emails collected so we don't send a welcome email twice:

```javascript
export default defineComponent({
  props: {
    data: { type: "data_store" },
  },
  async run({ steps, $ }) {
    const email = steps.trigger.event.body.new_customer_email;
    // Retrieve the past recorded emails from other runs
    const emails = await this.data.get('emails') ?? [];

    // If the current email being passed from our webhook is already in our list, exit early
    if(emails.includes(email)) {
      return $.flow.exit('Already welcomed this user');
    }

    // Add the current email to the list of past emails so we can detect it in the future runs
    await this.data.set('emails', [...emails, email]);
  },
})
```


### Supported data types

Data stores can hold any JSON-serializable data within the storage limits. This includes data types including:

* Strings
* Objects
* Arrays
* Dates
* Integers
* Floats

But you cannot serialize Functions, Classes, or other more complex objects.
