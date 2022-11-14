# Overview

Slack messages can contain interactive elements like buttons, dropdowns, radio buttons, and more. This source subscribes to interactive events, like when a button is clicked in a message.

![CleanShot 2022-11-10 at 10.17.17@2x.png](new-interaction-event-received%209ff85784a4e2447fa2d74f6d7d42a34e/CleanShot_2022-11-10_at_10.17.172x.png)

Then this source will be triggered when you or another Slack user in your workspace clicks a button, selects an option or fills out a form.

![CleanShot 2022-11-10 at 10.19.15@2x.png](new-interaction-event-received%209ff85784a4e2447fa2d74f6d7d42a34e/CleanShot_2022-11-10_at_10.19.152x.png)

With this trigger, you can build workflows that perform some work with other APIs or services, and then reply back to the original message.

# Getting Started

[https://youtu.be/RZ3XQENkjeg](https://youtu.be/RZ3XQENkjeg)

What this short video to learn how to use this in a workflow, or follow the guide below.

First, if you haven’t already - send yourself a message containing one or more interactive elements. Use the ******************Sending the message with an interactive element****************** guide below to send a messsage containing a button.

If you have already sent a message containing an element, skip to **********************************************Configuring the source.**********************************************

## Sending the message with an interactive element

The easiest way is to send yourself a message using the ****************************Slack - Send Message Using Block Kit**************************** action:

![CleanShot 2022-11-10 at 10.25.52@2x.png](new-interaction-event-received%209ff85784a4e2447fa2d74f6d7d42a34e/CleanShot_2022-11-10_at_10.25.522x.png)

Then select a **************Channel************** you’d like to send the message to, and use the **************[Block Kit Builder](https://app.slack.com/block-kit-builder/)************** to build a message, or just copy the example button blocks below:

```jsx
[
  {
    type: "actions",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Click Me",
          emoji: true,
        },
        value: "click_me_123",
        action_id: "button_click",
      },
    ],
  },
];
```

Your ******************Slack - Send Message Using Block Kit****************** should look like this:

![CleanShot 2022-11-10 at 10.29.55@2x.png](new-interaction-event-received%209ff85784a4e2447fa2d74f6d7d42a34e/CleanShot_2022-11-10_at_10.29.552x.png)

## Configuring the source

By default, this source will listen to ******all****** interactive events from your Slack workspace that your connected Slack account has authorization to view.

You can filter these events by selecting a specific **************channel************** and/or a specific **********action_id.**********

### Filtering interactive events by channel

Use the ****************Channels**************** dropdown to search for a specific channel for this source to subscribe to. ********Only******** button clicks, dropdown selects, etc. *in this selected channel* will trigger the source.

### Filtering interactive events by `action_id`

For more specificity, you can filter based on the passed `action_id` to the message.

The `action_id` is arbitrary. It’s defined on the initial message sending the button, dropdown, or other interactive element’s markup.

For example, in the section above using the Block Kit to create a message, we defined the button’s `action_id` as `"button_click"`. But you can choose whichever naming convention you’d like.

If you pass `button_click` as a required `action_id` to this source, then only interactivity events with the `action_id` of `"button_click"` will trigger this source.

# Troubleshooting

## I’m clicking buttons, but no events are being received

Follow these steps to make sure your source is configured correctly:

1. Make sure that your `action_id` or ****************channels**************** filters apply to that message, remove the filters to make sure that’s not the case.

1. Make sure that the message comes from the same Slack account that this source is configured with.
