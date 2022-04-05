# Params

Params are form inputs that can be added to code steps in a workflow to abstract data from the code and improve reusability. Most actions use params to capture user input (e.g., to allow users to customize the URL, method and payload for the Send HTTP Request action). Params support the entry of simple values (e.g., `hello world` or `123`) or expressions in <code v-pre>{{...}}</code> that can reference objects in scope (e.g., <code v-pre>{{event.foo}}</code>) or run basic Node code (e.g., <code v-pre>{{JSON.stringify(event.foo)}}</code>). 

<iframe width="560" height="350" src="https://www.youtube.com/embed/6eq813uEExc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

  * [Entering Expressions](#entering-expressions)
    + [Use the object explorer](#use-the-object-explorer)
    + [Manually enter or edit an expression](#manually-enter-or-edit-an-expression)
    + [Paste a reference from a step export](#paste-a-reference-from-a-step-export)
  * [Params Types](#params-types)
    + [Basic Params](#basic-params)
    + [Structured Params](#structured-params)
  * [Sharing Params Values in Workflow Templates](#sharing-params-values-in-workflow-templates)
  * [Configuring Custom Params](#configuring-custom-params)
    + [Adding params to a code step](#adding-params-to-a-code-step)
    + [Configuring the params form](#configuring-the-params-form)


## Entering Expressions

Expressions make it easy to pass data exported from previous steps into a code step or action via params. For example, if your workflow is triggered on new Tweets and you want to send the Tweet content to an HTTP or webhook destination, you would reference <code v-pre>{{event.full_text}}</code> to do that.

While the data expected by each input depends on the data type (e.g., string, integer, array, etc) and the data entry mode (structured or non-structured — if applicable), the format for entering expressions is always the same; expressions are always enclosed in <code v-pre>{{...}}</code>.

There are three ways to enter expressions in a params form — you can use the object explorer, enter it manually, or paste a reference from a step export.

### Use the object explorer
When you click into a params input, an object explorer expands below the input. You can explore all the objects in scope, filter for keywords (e.g., a key name), and then select the element to insert into the form as an expression.

![Using the object explorer to select data from the step exports](https://res.cloudinary.com/pipedreamin/image/upload/v1649169376/docs/components/CleanShot_2022-04-05_at_10.35.37_nxykkx.gif)

### Manually enter or edit an expression

To manually enter or edit an expression, just enter or edit a value between double curly braces <code v-pre>{{...}}</code>. Pipedream provides auto-complete support as soon as you type <code v-pre>{{</code>.

![Manually entering an expression as a param]([./images/params-autocomplete-7031289.gif)](https://res.cloudinary.com/pipedreamin/image/upload/v1649169533/docs/components/CleanShot_2022-04-05_at_10.38.16_qokasr.gif)

You can also run Node.js code in <code v-pre>{{...}}</code>. For example, if `event.foo` is a JSON object and you want to pass it to a param as a string, you can run <code v-pre>{{JSON.stringify(event.foo)}}</code>.

### Paste a reference from a step export

To paste a reference from a step export, find the reference you want to use, click **Copy Path** and then paste it into the input.

![Copying the path to from a step export and pasting it as a param in another step](https://res.cloudinary.com/pipedreamin/image/upload/v1649169707/docs/components/CleanShot_2022-04-05_at_10.40.42_e34xoj.gif)
