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

Below are the common files that are available for this component. Evaluate throughly each file's code to make sure if there are any props or methods that you can import and use in your code instead of writing the code yourself. You should ALWAYS call a common method that gets you the result you need. Even if it uses a SDK or a different library instead of axios. Only write the code if there isn't any method available. Think about it, we don't want to rewrite exisiting code, we want to re-use it. If you find yourself writing code that is already written, you are doing it wrong. Be sure to import the common file's path correctly in your code.

""" + parsed_common_files
