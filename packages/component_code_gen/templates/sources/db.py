db = """<DbProp>

There is also another prop in sources: `db`. It is a data store of type `$.service.db`. You should always include it.

It is a simple key-value pair database that stores JSON-serializable data that lets you store data between runs of the component. It is used to maintain state across executions of the component.

It contains two methods, `get` and `set`. The `get` method has one parameter - the key of the data to retrieve. The `set` method has two parameters - the key of the data to store, and the value to store. Both methods return a Promise that resolves when the data is read or stored.

<Examples>
Here is an example of how to use the `db` prop in your component:

```javascript
export default {
  props: {
    db: {
      type: "$.service.db",
    },
  },
  async run({ $ }) {
    // set
    await this.db.set("myKey", "myValue");
    // get
    const value = await this.db.get("myKey");
  },
}
```
</Examples>

</DbProp>
"""
