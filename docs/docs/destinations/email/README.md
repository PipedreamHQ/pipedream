# Email

The Email Destination allows you send an email to _yourself_ — the email address tied to the account you signed up with — at any step of a workflow.

You can use this to email yourself when you receive a specific event, for example when a user signs up on your app. You can send yourself an email when a cron job finishes running, or when a job fails. Anywhere you need an email notification, you can use the Email Destination! 

[[toc]]

## Adding an Email Destination

### Adding an Email Action

First, [add a new Action](/workflows/steps/actions/#adding-a-new-action), then select the **Send Yourself an Email** Action. You can modify the **Subject** and the message (either **Plain Text** or **HTML**) however you want.

### Using `$.send.email` in workflows

You can send data to an Email Destination in [Node.js code steps](/workflows/steps/code/), too, using the `$.send.email()` function. **This allows you to send emails to yourself programmatically, if you need more control than actions provide**.

`$.send.email()` takes the same parameters as the corresponding action:

```javascript
defineComponent({
  async run({ steps, $ }) {
    $.send.email({
      subject: "Your subject",
      text: "Plain text email body",
      html: "HTML email body"
    });
  }
});
```

The `html` property is optional. If you include both the `text` and `html` properties, email clients that support HTML will prefer that over the plaintext version.

Like with any `$.send` function, you can use `$.send.email()` conditionally, within a loop, or anywhere you'd use a function normally in Node.js.

### Using `$.send.email` in component actions

If you're authoring a [component action](/components/actions/), you can deliver data to an email destination using `$.send.email`.

`$.send.email` functions the same as [`$.send.email` in workflow code steps](#using-send-email-in-workflows):

```javascript
defineComponent({
  async run({ steps, $ }) {
    $.send.email({
      subject: "Your subject",
      text: "Plain text email body",
      html: "HTML email body"
    });
  }
})
```

## Delivery details

All emails come from **notifications@pipedream.com**.

<Footer />
