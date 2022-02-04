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

![img](./images/params-object-explorer.gif)

### Manually enter or edit an expression

To manually enter or edit an expression, just enter or edit a value between double curly braces <code v-pre>{{...}}</code>. Pipedream provides auto-complete support as soon as you type <code v-pre>{{</code>.

![img](./images/params-autocomplete-7031289.gif)

You can also run Node.js code in <code v-pre>{{...}}</code>. For example, if `event.foo` is a JSON object and you want to pass it to a param as a string, you can run <code v-pre>{{JSON.stringify(event.foo)}}</code>.

### Paste a reference from a step export

To paste a reference from a step export, find the reference you want to use, click **Copy Path** and then paste it into the input.

![img](./images/params-paste-7031315.gif)

## Params Types

### Basic Params

Basic params support simple values or, expressions in <code v-pre>{{...}}</code>. You can enter expressions by copying the path from step observability, using the object explorer below the params input, or by manually entering a value within <code v-pre>{{...}}</code> (Pipedream provides auto-complete for the objects in scope, but you can also enter a value that is not supported by auto-complete).

| Type        | Structured                                                   |
| ----------- | ------------------------------------------------------------ |
| **String**  | This is the default type for newly added params. You can enter a simple value (e.g., `hello world`), an expression that evaluates to a string in <code v-pre>{{...}}</code> (e.g., <code v-pre>{{event.foo}}</code> or <code v-pre>{{JSON.stringify(event.object)}}</code>), or select a reference from the object explorer. You can also combine simple values and multiple expressions in the same input  (e.g., <code v-pre>hello world {{event.foo}}</code>). |
| **Number**  | You can enter a simple value (e.g., `123`), an expression that evaluates to a number in <code v-pre>{{...}}</code> (e.g., <code v-pre>{{event.foo}}</code> or <code v-pre>{{1+1}}</code>), or select a reference from the object explorer. |
| **Integer** | You can enter a simple value (e.g., `123`), an expression that evaluates to an integer in <code v-pre>{{...}}</code> (e.g., <code v-pre>{{event.foo}}</code> or <code v-pre>{{1+1}}</code>), or select a reference from the object explorer. |



### Structured Params

Structured params provide a guided approach to enter values expected for a specific input. You can turn off structured mode at any time to enter an expression for the the param.

![img](./images/params-nonstructured-7033441.gif)

| Type        | Structured                                                   | Non-Structured                                               |
| ----------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **Enum**    | Select a value from the drop down menu.                      | This is the default type for newly added params. You can enter a simple value (e.g., `hello world`), an expression that evaluates to a string in <code v-pre>{{...}}</code> (e.g., <code v-pre>{{event.foo}}</code> or <code v-pre>{{JSON.stringify(event.object)}}</code>), or select a reference from the object explorer. You can also combine simple values and multiple expressions in the same input  (e.g., <code v-pre>hello world {{event.foo}}</code>). |
| **Boolean** | Select a value from the drop down menu.                      | Enter an expression that evaluates to a boolean value in <code v-pre>{{...}}</code> (e.g., <code v-pre>{{event.foo}}</code> or <code v-pre>{{true}}</code>) |
| **Array**   | Enter values for each array element. To add more array elements, click the **+** button at the right. Enter simple values (e.g., `hello world`), expressions <code v-pre>{{...}}</code> (e.g., <code v-pre>{{event.foo}}</code>), or select references from the object explorer. | Enter an expression that evaluates to an array in <code v-pre>{{...}}</code> (e.g., <code v-pre>{{event.foo}}</code> or <code v-pre>{{[1,2,3]}}</code>). |
| **Object**  | Enter a key and corresponding value. To add more key-value pairs, click the **+** button at the right. Enter simple values (e.g., `hello world`), expressions <code v-pre>{{...}}</code> (e.g., <code v-pre>{{event.foo}}</code>), or select references from the object explorer. | Enter an expression that evaluates to an object in <code v-pre>{{...}}</code> (e.g., <code v-pre>{{event.foo}}</code> or <code v-pre>{{{"foo":"bar"}}}</code>). |

## Sharing Params Values in Workflow Templates

By default, any data you enter in a params form is private to workflow editors. If you are sharing a workflow and want specific values to be copied with the workflow then you should toggle the visibility for those params to **public** by clicking the "eye" icon at the far right. A common use case for this is to make params with expressions referencing earlier step exports public. Be sure not to make params public that contain sensitive data.

![img](./images/params-visibility.gif)

## Configuring Custom Params 

### Adding params to a code step

To add a params input to a code step, just use `params.<variable-name>` in your code. A form element will automatically be generated. E.g., try adding the following line to a code step:

```javascript
console.log(params.url)
```

Note: in some cases you may need to save your workflow for the form to generate.

You'll see this field appear no matter how the property is referenced in code. For example, you can [destructure properties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring) of params and we'll correctly display the associated field. E.g., the following code will generate the same params form and behavior as the example above:

```javascript
const { url } = params
console.log(url)
```

> Reminder: Workflow code is [public](/public-workflows/) by default, so use params or environment variables for sensitive data. Alternatively, you can make your workflow code private.


### Configuring the params form

To configure the params form, click **edit params schema**.

![image-20200809172300069](./images/image-20200809172300069.png)

You will be presented with options to customize the label, data type, description, required vs optional setting, and more.

![image-20200809172609616](./images/image-20200809172609616.png)
