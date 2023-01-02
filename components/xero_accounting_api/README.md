# Using Webhooks

Xero supports webhooks for instant notifications of specific event changes.

To create and use a webhook with Pipedream:

1. Create a **Webhook Event Received (Instant)** trigger in a workflow. You may leave the `Webhook Key` prop empty in this step.
2. Copy the generated URL endpoint from the trigger.
3. Go to your app in [Xero Developer](https://developer.xero.com/app/manage) and go to Webhooks.
4. Select the event types you want to be notified and paste the trigger URL in the **Delivery URL** field.
5. Copy the **Webhooks key** and click on **Save**.
6. Go to the Pipedream trigger and update the **Webhook Key** prop with the copied value.
7. Go back to Xero and click on **Send 'Intent to receive'** to start the verification process.
8. Wait for a few seconds until it shows **Status OK**.
9. You should then be able to receive notifications for changes in this trigger.

For more information, please read Xero's [Creating a Webhook Guide](https://developer.xero.com/documentation/guides/webhooks/creating-webhooks/).

If you have issues with this integration, please join our public Slack and ask for help.
