async_options = """## Async options

The `options` method is an optional method that can be defined on a prop. It is used to dynamically generate the options for a prop and can return a static array of options or a Promise that resolves to an array of options:

```
[
  {
    label: "Human-readable option 1",
    value: "unique identifier 1",
  },
  {
    label: "Human-readable option 2",
    value: "unique identifier 2",
  },
]
```

The `label` MUST be a human-readable name of the option presented to the user in the UI, and the `value` is the value of the prop in the `run` method. The `label` MUST be set to the property that defines the name of the object, and the `value` should be the property that defines the unique identifier of the object.

If an API endpoint exists that can be used to fetch the options for the prop, you MUST define an `async` options method. This allows Pipedream to make an API call to fetch the options for the prop when the user is configuring the component, rather than forcing the user to enter values for the option manually. Think about it: this is so much easier for the user.

Example async options methods:

```
msg: {
  type: "string",
  label: "Message",
  description: "Select a message to `console.log()`",
  async options() {
    // write any node code that returns a string[] (with label/value keys)
    return ["This is option 1", "This is option 2"];
  },
},
```

```
board: {
  type: "string",
  label: "Board",
  async options(opts) {
    const boards = await this.getBoards(this.$auth.oauth_uid);
    const activeBoards = boards.filter((board) => board.closed === false);
    return activeBoards.map((board) => {
      return { label: board.name, value: board.id };
    });
  },
},
```"""
