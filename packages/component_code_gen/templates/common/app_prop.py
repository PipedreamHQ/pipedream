app_prop = """## App props

The props object must contain a `props` property, which defines a single prop of type "app":

```
export default {
  props: {
    the_app_name: {
      type: "app",
      app: "the_app_name",
    },
  }
  // the rest of the component ...
}
```

This lets the user connect their app account to the step, authorizing requests to the app API."""
