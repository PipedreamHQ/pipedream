# State

In Node.js (Javascript) code steps, you can also store and retrieve data in code steps.

This is very useful for tracking data between runs of a particular workflow.

:::warning
This functionality (`$.service.db`) is limited to only Node.js code steps at this time.

Other step languages like Python, bash and Go do not have this feature available yet.

For more information on what functionality is available for those languages, please refer to their documentation.
:::

## Injecting the database

By default Node.js steps do not contain the database service. It needs to be injected by defining it as a `prop`. 

```javascript
defineComponent({
  props: {
    // Define that the "db" variable in our component is a database
    db: "$.service.db",
  },
  async run({ steps, $ }) {
    // Now we can access the database at "this.db"
    this.db
  })
});
```

:::tip
`props` injects variables under `this` scope in components.

In the above example we essentially instructed that this step needs the database injected into the `this.db` prop. 
:::

## Using the database

Once the database is injected into the component, we can use it to both store & retrieve data generated from workflow steps. The 2 functions available are to `set` and `get` the data.

### Saving data

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

### Retrieving data

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

### Workflow counter example

For example, if you'd like to set up a counter to count the number of times the workflow executes.

```javascript
export default defineComponent({
  props: {
    "db": "$.service.db",
  },
  async run({ steps, $ }) {
    const currentCount = this.db.get('counter') || 0;
    
    this.db.set('counter', counter) + 1;
  },
})
```

### Deduplicating data example

This database is also useful for storing data from APIs from prior runs to prevent duplicate data.

For example, this workflows trigger contains an email address from a potential new customer. But we want to track all emails collected so we don't send a welcome email twice:

```javascript
export default defineComponent({
  props: {
    "db": "$.service.db",
  },
  async run({ steps, $ }) {
    const email = steps.trigger.context.new_customer_email;
    const pastEmails = this.db.get('emails') || [];

    if(pastEmails.includes(email)) {
      $.exit('Already welcomed this user');
    }

    this.db.set('emails', [...pastEmails, email]);
  },
})
```


