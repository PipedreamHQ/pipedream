# Using Props

<VideoPlayer url="https://www.youtube.com/embed/RW9FBVuHDHQ" />

Props are fields that can be added to code steps in a workflow to abstract data from the code and improve reusability. Most actions use props to capture user input (e.g., to allow users to customize the URL, method and payload for the Send HTTP Request action). Props support the entry of simple values (e.g., `hello world` or `123`) or expressions in <ClientOnly><code v-pre>{{...}}</code></ClientOnly> that can reference objects in scope (e.g., <ClientOnly><code v-pre>{{event.foo}}</code></ClientOnly>) or run basic Node.js code (e.g., <ClientOnly><code v-pre>{{JSON.stringify(event.foo)}}</code></ClientOnly>). 

[[toc]]


## Entering Expressions

Expressions make it easy to pass data exported from previous steps into a code step or action via props. For example, if your workflow is triggered on new Tweets and you want to send the Tweet content to an HTTP or webhook destination, you would reference <ClientOnly><code v-pre>{{event.full_text}}</code></ClientOnly> to do that.

While the data expected by each input depends on the data type (e.g., string, integer, array, etc) and the data entry mode (structured or non-structured — if applicable), the format for entering expressions is always the same; expressions are always enclosed in <ClientOnly><code v-pre>{{...}}</code></ClientOnly>.

There are three ways to enter expressions in a prop field — you can use the object explorer, enter it manually, or paste a reference from a step export.

### Use the object explorer
When you click into a prop field, an object explorer expands below the input. You can explore all the objects in scope, filter for keywords (e.g., a key name), and then select the element to insert into the form as an expression.

![Using the object explorer to select data from the step exports](https://res.cloudinary.com/pipedreamin/image/upload/v1649169376/docs/components/CleanShot_2022-04-05_at_10.35.37_nxykkx.gif)

### Manually enter or edit an expression

To manually enter or edit an expression, just enter or edit a value between double curly braces <ClientOnly><code v-pre>{{...}}</code></ClientOnly>. Pipedream provides auto-complete support as soon as you type <ClientOnly><code v-pre>{{</code></ClientOnly>.

![Manually entering an expression as a param](https://res.cloudinary.com/pipedreamin/image/upload/v1649169533/docs/components/CleanShot_2022-04-05_at_10.38.16_qokasr.gif)

You can also run Node.js code in <ClientOnly><code v-pre>{{...}}</code></ClientOnly>. For example, if `event.foo` is a JSON object and you want to pass it to a param as a string, you can run <ClientOnly><code v-pre>{{JSON.stringify(event.foo)}}</code></ClientOnly>.

### Paste a reference from a step export

To paste a reference from a step export, find the reference you want to use, click **Copy Path** and then paste it into the input.

![Copying the path to from a step export and pasting it as a prop in another step](https://res.cloudinary.com/pipedreamin/image/upload/v1649169707/docs/components/CleanShot_2022-04-05_at_10.40.42_e34xoj.gif)
