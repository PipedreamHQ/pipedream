# Send Test Events

We provide the ability for you to send a test event through your workflow to test it before running it on real data.

We provide a default test event you can send to a workflow that helps you explore the features of the product. Click the **Send Test Event** button at the top of [the Inspector](/workflows/events/inspect/#the-inspector) to send this event to your workflow: 

<div>
<img alt="Send test event" width="300" src="./images/send-test-event-button.png">
</div>

**The contents of this test event varies depending on the source**.

When you're first learning how Pipedream works, you can trigger a workflow using this test event to learn how [code](/workflows/steps/code/), [actions](/workflows/steps/actions/), [destinations](/destinations/), and more.

Typically, though, you're processing events of a different shape in real workflow. **Press the pencil icon to the right of the Sent Test Event button to modify the test event**.

This will open a text editor next to the Inspector that lets you edit the test event for this workflow. You can add any valid JSON here and **Save** it. The next time you click the **Send Test Event** button, your new test event will be sent through your workflow.

Clicking the **Default** button in the **Edit Test Event** editor will revert your test event back to the original default. You'll have to **Save** this change, as well.

<Footer />
