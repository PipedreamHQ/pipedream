---
short_description: Reuse your code steps across workflows to speed up your solutions development.
thumbnail: https://res.cloudinary.com/pipedreamin/image/upload/v1646841235/docs/icons/icons8-copy-96_dx48fh.png
---

# Sharing code across workflows

[Actions](/components#actions) are reusable steps. When you author an action, you can add it to your workflow like you would other actions, by clicking the **+** button below any step.

Pipedream provides two ways to share code across workflows:

- **Publish an action from a Node.js code step**. [Publish any Node.js code step as a reusable action](/code/nodejs/sharing-code/#publish-an-action-from-a-node-js-code-step) from the Pipedream dashboard.

- **Create an action from code**. Develop your action code on your local filesystem and [publish to your Pipedream account using the Pipedream CLI](/components/quickstart/nodejs/actions/).

## Publish an action from a Node.js code step

<AlphaFeatureNotice />

<VideoPlayer src="https://www.youtube.com/embed/s7SWG1gikbw" title="Reusing code steps as actions" />

You can publish any of your Node.js code steps into a reusable action. This enables you to write a Node.js code step once, and reuse it across many workflows without rewriting it.

To convert a Node.js code step into an publishable action, make sure to include the below properties in your Node.js step:
- `version`
- `name`
- `key`
- `type`

```javascript{6-9}
// Adding properties to a regular Node.js code step make it publishable
import { parseISO, format } from 'date-fns';

// Returns a formatted datetime string
export default defineComponent({
  name: 'Format Date',
  version: '0.0.1',
  key: 'format-date',
  type: 'action',
  props: {
    date: {
      type: "string",
      label: "Date",
      description: "Date to be formatted",
    },
    format: {
      type: 'string',
      label: "Format",
      description: "Format to apply to the date. [See date-fns format](https://date-fns.org/v2.29.3/docs/format) as a reference."
    }
  },
  async run({ $ }) {
    const formatted = format(parseISO(this.date), this.format);
    return formatted;
  },
})

```

Click **Test** to verify the step is working as expected. Only actions that have been successfully tested are to be published.

Then open the menu in the top righthand corner of the code step and select **Publish to My Actions**:

![Publish a Node.js code step to My Actions](https://res.cloudinary.com/pipedreamin/image/upload/v1664805822/docs/components/CleanShot_2022-10-03_at_10.03.08_2x_lpbjjs.png)

And now you've successfully saved a custom Node.js code step to your account. You'll be able to use this code step in any of your workflows.

::: details Why can't I use the `steps` variable in published Node.js code steps?

The `steps` variable contains the _workflows_ step exports.

When you publish a Node.js code step as an action, it becomes reusable across many workflows.

This means that the step exports available vary depending on the workflow it's running on. 

Defining props is a way to map inputs to actions and allow individual workflows to define which exports should be used.

:::

## Using your published actions

To use your custom action, create a new step in your workflow and select **My Actions**.

![Select My Actions in a new workflow step to access your actions](https://res.cloudinary.com/pipedreamin/image/upload/v1664806138/docs/components/CleanShot_2022-10-03_at_10.08.42_2x_qt1ht3.png)

From there you'll be able to view and select any of your published actions and use them as steps.

## Updating published Node.js code step actions

If you need to make a change and update the underlying code to your published Node.js code step, you can do so by incrementing the `version` field on the Node.js code step.

Every instance of your published action from a code step is editable. In any workflow where you've reused a published action, open the menu on the right side of the action and click **Edit action** button.

This will open up the code editor for this action, even if this wasn't the original code step.

Now increment the `version` field in the code:

```javascript{6}
import { parseISO, format } from 'date-fns';

// The version field on a Node.js action is versioned
export default defineComponent({
  name: 'Format Date',
  version: '0.0.2',
  key: 'format-date',
  type: 'action',
  props: {
    date: {
      type: "string",
      label: "Date",
      description: "Date to be formatted",
    },
    format: {
      type: 'string',
      label: "Format",
      description: "Format to apply to the date. [See date-fns format](https://date-fns.org/v2.29.3/docs/format) as a reference."
    }
  },
  async run({ $ }) {
    const formatted = format(parseISO(this.date), this.format);
    return formatted;
  },
})
```

Finally use the **Publish to My Actions** button in the right hand side menu to publish this new version.

::: details I'm not seeing an **Edit Action** button option in my step

The **Edit Action** button is only available for actions that are published from Node.js code steps.

Actions submitted to the public component registry can contain multiple files. At this time it's not possible to edit multi-file components direct in a code step.

:::

::: details Will publishing a new version of an action automatically update all other steps using it?

No, a new version of an action doesn't automatically update all instances of the same action across your workflows.

This gives you the control to gradually update. Learn how to [update steps to the newest action versions here](https://pipedream.com/docs/workflows/steps/actions/#updating-actions-to-the-latest-version).

:::

After publishing a new version, all other steps using this same action will have the option to [update to the latest version](/workflows/steps/actions/#updating-actions-to-the-latest-version).

## Differences between publishing actions from workflow Node.js code steps and directly from code

Publishing reusable actions from Node.js code steps allows you to quickly scaffold and publish Node.js code steps without leaving the Pipedream dashboard. The result is the same as publishing actions from code using the Pipedream CLI.

However, there are some differences.

1. Node.js code step actions cannot make use of [app files to further reduce redundancy](/components/guidelines/#promoting-reusability).
2. Node.js code step actions cannot be published to the [Pipedream Component Registry](/apps/contributing/).
3. Node.js code step actions have a slightly different structure than [action components](/components/api/#component-api).
