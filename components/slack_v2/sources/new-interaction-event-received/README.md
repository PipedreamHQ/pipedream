# Overview

Slack messages can contain interactive elements like buttons, dropdowns, radio buttons, and more. This source subscribes to interactive events, like when a button is clicked in a message.

![Example of a Slack button](https://res.cloudinary.com/pipedreamin/image/upload/v1668443788/docs/components/CleanShot_2022-11-10_at_10.17.172x_dxdz1o.png)

Then this source will be triggered when you or another Slack user in your workspace clicks a button, selects an option or fills out a form.

![Example feed of interaction events coming from Slack](https://res.cloudinary.com/pipedreamin/image/upload/v1668443818/docs/components/CleanShot_2022-11-10_at_10.19.152x_eyiims.png)

With this trigger, you can build workflows that perform some work with other APIs or services, and then reply back to the original message.

# Getting Started

<iframe width="560" height="315" src="https://www.youtube.com/embed/RZ3XQENkjeg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

What this short video to learn how to use this in a workflow, or follow the guide below.

First, if you haven’t already - send yourself a message containing one or more interactive elements. Use the ******************Sending the message with an interactive element****************** guide below to send a message containing a button.

If you have already sent a message containing an element, skip to **********************************************Configuring the source.**********************************************

## Sending the message with an interactive element

The easiest way is to send yourself a message using the ****************************Slack - Send Message Using Block Kit**************************** action:

![Selecting the Send Slack Message with Block Kit](https://res.cloudinary.com/pipedreamin/image/upload/v1668443844/docs/components/CleanShot_2022-11-10_at_10.25.522x_vxiooo.png))

Then select a **************Channel************** you’d like to send the message to, and use the **************[Block Kit Builder](https://app.slack.com/block-kit-builder/)************** to build a message, or just copy the example button blocks below:

```jsx
[
  {
    "type": "actions",
    "elements": [
      {
        "type": "button",
        "text": {
          "type": "plain_text",
          "text": "Click Me",
          "emoji": true
        },
        "value": "click_me_123",
        "action_id": "button_click"
      }
    ]
  }
]
```

Your ******************Slack - Send Message Using Block Kit****************** should look like this:

![Setting up the block kit message with a button block](https://res.cloudinary.com/pipedreamin/image/upload/v1668443887/docs/components/CleanShot_2022-11-10_at_10.29.552x_kvfznm.png)

## Configuring the source

By default, this source will listen to ******all****** interactive events from your Slack workspace that your connected Slack account has authorization to view. Please note that only messages created via [Slack - Send Block Kit Message](https://pipedream.com/apps/slack-v2/actions/send-block-kit-message) Action, or via API call from the Pipedream app will emit an interaction event with this trigger. Block kit messages sent directly via the Slack's block kit builder will not trigger an interaction event.

You can filter these events by selecting a specific **************channel************** and/or a specific **********action_id.**********

### Filtering interactive events by channel

Use the ****************Channels**************** dropdown to search for a specific channel for this source to subscribe to. ********Only******** button clicks, dropdown selects, etc. *in this selected channel* will trigger the source.

### Filtering interactive events by `action_id`

For more specificity, you can filter based on the passed `action_id` to the message.

The `action_id` is arbitrary. It’s defined on the initial message sending the button, dropdown, or other interactive element’s markup.

For example, in the section above using the Block Kit to create a message, we defined the button’s `action_id` as `"button_click"`. But you can choose whichever naming convention you’d like.

If you pass `button_click` as a required `action_id` to this source, then only interactivity events with the `action_id` of `"button_click"` will trigger this source.

## Troubleshooting

### I’m clicking buttons, but no events are being received

Follow these steps to make sure your source is configured correctly:

1. Make sure that your `action_id` or ****************channels**************** filters apply to that message, remove the filters to make sure that’s not the case.

1. Make sure that the message comes from the same Slack account that this source is configured with.

1. Make sure that the message was sent via Pipedream action (e.g. [Slack - Send Block Kit Message](https://pipedream.com/apps/slack-v2/actions/send-block-kit-message) Action) or via API call from the Pipedream app.
