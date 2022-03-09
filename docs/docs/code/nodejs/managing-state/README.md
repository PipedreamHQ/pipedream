---
short_description: Store and read data with the built in database.
thumbnail: https://res.cloudinary.com/pipedreamin/image/upload/v1646763735/docs/icons/icons8-database-96_iv1oup.png
---

# Managing state

In Node.js (Javascript) code steps, you can also store and retrieve data in code steps.

This is very useful for tracking data between runs of a particular workflow.

:::warning
This functionality (`$.service.db`) is limited to only Node.js code steps at this time.

Other step languages like [Python](/code/python/), [Bash](/code/bash/) and [Go](/code/go/) do not have this feature available yet.

For more information on what functionality is available for those languages, please refer to their documentation.
:::

### Injecting the database

By default, Node.js steps don't have access to the database service. It needs to be injected by defining it as a `prop`. 

```javascript
export default defineComponent({
  props: {
    // Define that the "db" variable in our component is a database
    db: "$.service.db",
  },
  async run({ steps, $ }) {
    // Now we can access the database at "this.db"
    this.db.set("name", "Dylan")
  }
});
```

:::tip
`props` injects variables under `this` scope in components.

In the above example we essentially instructed that this step needs the database injected into the `this.db` prop. 
:::

## Using the database

Once you inject the database into the component, you can use it to both store (`set`) and retrieve (`get`) data.

## Saving data

You can save data with the in-step database using the `set` method.

```javascript
export default defineComponent({
  props: {
    "db": "$.service.db",
  },
  async run({ steps, $ }) {
    // Store a timestamp each time this step is executed in the workflow
    this.db.set('lastRanAt', new Date());
  },
})
```

## Retrieving data

You can retrieve data with the in-step database using the `get` method.

```javascript
export default defineComponent({
  props: {
    "db": "$.service.db",
  },
  async run({ steps, $ }) {
    // Retrieve the timestamp representing last time this step executed
    const lastRanAt = this.db.get('lastRanAt'); 
  },
})
```

## Workflow counter example

For example, if you'd like to set up a counter to count the number of times the workflow executes.

```javascript
export default defineComponent({
  props: {
    "db": "$.service.db",
  },
  async run({ steps, $ }) {
    // By default, all database entries are undefined.
    // It's wise to set a default value so our code as an initial value to work with
    const counter = this.db.get('counter') ?? 0;
    
    // On the first run "counter" will be 0 and we'll increment it to 1
    // The next run will increment the counter to 2, and so forth
    this.db.set('counter', counter + 1);
  },
})
```

## Dedupe data example

This database is also useful for storing data from prior runs to prevent acting on duplicate data, or data that's been seen before.

For example, this workflow's trigger contains an email address from a potential new customer. But we want to track all emails collected so we don't send a welcome email twice:

```javascript
export default defineComponent({
  props: {
    "db": "$.service.db",
  },
  async run({ steps, $ }) {
    const email = steps.trigger.body.new_customer_email;
    // Retrieve the past recorded emails from other runs
    const emails = this.db.get('emails') ?? [];

    // If the current email being passed from our webhook is already in our list, exit early
    if(emails.includes(email)) {
      return $.flow.exit('Already welcomed this user');
    }

    // Add the current email to the list of past emails so we can detect it in the future runs
    this.db.set('emails', [...emails, email]);
  },
})
```

## `$.service.db` limitations

The `$.service.db` is only currently available in Node.js code steps. It is not yet available in other languages like Go, bash or Python.

In addition, `$.service.db` can hold up to {{ $site.themeConfig.SERVICE_DB_SIZE_LIMIT }} per step.

