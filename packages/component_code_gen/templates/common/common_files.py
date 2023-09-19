def common_files(parsed_common_files):
  return """## Common Files

The user may include a code snippet that is contained in a common file, or a common app file. This code is part of the component, and you may call any method that is defined in it. The same applies for prop definitions. If the common file includes props that applies to the response code, you may just use it with the following syntax:

```
props: {
  the_prop_name: {
    propDefinition: [
      the_app_name,
      "the_prop_name",
      inputValues
    ]
  },
},
```

The `propDefinition` property is an array of options that define a reference to the desired prop. The first element is the app name, the second is the prop name, and the third are the input values. They are the values to pass into the prop definition. To reference values from previous props, use an arrow function. E.g.:

(c) => ({ variableName: c.previousPropName })

The `c` variable is the configured props object, which contains all the previously defined props by the user. The returned object from the arrow function above will be used as input to the `async options` function for the prop definition.

You should use propDefinition whenever possible, in order to re-use props that are already defined.

You may override any previously defined type, label, or description for the prop. To do that just re-define the property in the prop definition object. E.g.:

```
props: {
  the_prop_name: {
    propDefinition: [
      the_app_name,
      "the_prop_name",
      inputValues
    ]
    type: "a_new_type",
    label: "A new label",
    description: "A new description",
    optional: true_or_false
  },
},


```
""" + parsed_common_files
