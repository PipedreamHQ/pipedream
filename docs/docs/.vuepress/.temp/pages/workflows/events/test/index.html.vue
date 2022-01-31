<template><h1 id="send-test-events" tabindex="-1"><a class="header-anchor" href="#send-test-events" aria-hidden="true">#</a> Send Test Events</h1>
<p>We provide the ability for you to send a test event through your workflow to test it before running it on real data.</p>
<p>We provide a default test event you can send to a workflow that helps you explore the features of the product. Click the <strong>Send Test Event</strong> button at the top of <a href="/workflows/events/inspect/#the-inspector" target="_blank" rel="noopener noreferrer">the Inspector<ExternalLinkIcon/></a> to send this event to your workflow:</p>
<div>
<img alt="Send test event" width="300" src="@source/workflows/events/test/images/send-test-event-button.png">
</div>
<p><strong>The contents of this test event varies depending on the source</strong>.</p>
<p>When you're first learning how Pipedream works, you can trigger a workflow using this test event to learn how <a href="/workflows/steps/code/" target="_blank" rel="noopener noreferrer">code<ExternalLinkIcon/></a>, <a href="/components/actions/" target="_blank" rel="noopener noreferrer">actions<ExternalLinkIcon/></a>, <a href="/destinations/" target="_blank" rel="noopener noreferrer">destinations<ExternalLinkIcon/></a>, and other functionality works.</p>
<p>Typically, though, you're processing events of a different shape in real workflow. <strong>Press the pencil icon to the right of the Sent Test Event button to modify the test event</strong>.</p>
<p>This will open a text editor next to the Inspector that lets you edit the test event for this workflow. You can add any valid JSON here and <strong>Save</strong> it. The next time you click the <strong>Send Test Event</strong> button, your new test event will be sent through your workflow.</p>
<p>Clicking the <strong>Default</strong> button in the <strong>Edit Test Event</strong> editor will revert your test event back to the original default. You'll have to <strong>Save</strong> this change, as well.</p>
<Footer />
</template>
