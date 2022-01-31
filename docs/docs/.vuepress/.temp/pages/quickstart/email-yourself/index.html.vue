<template><h1 id="email-yourself-on-new-rss-items" tabindex="-1"><a class="header-anchor" href="#email-yourself-on-new-rss-items" aria-hidden="true">#</a> Email yourself on new RSS items</h1>
<p>Next, let's create a workflow triggered on app events. This example builds on concepts introduced in <a href="/quickstart/" target="_blank" rel="noopener noreferrer">previous sections<ExternalLinkIcon/></a> and will cover how to:</p>
<nav class="table-of-contents"><ul><li><RouterLink to="#trigger-a-workflow-on-new-items-in-an-rss-feed">Trigger a workflow on new items in an RSS feed</RouterLink></li><li><RouterLink to="#send-an-email-to-the-address-associated-with-your-pipedream-account">Send an email to the address associated with your Pipedream account</RouterLink></li><li><RouterLink to="#activate-the-trigger-to-run-your-workflow-on-new-app-events">Activate the trigger to run your workflow on new app events</RouterLink></li></ul></nav>
<div class="custom-container tip"><p class="custom-container-title">TIP</p>
<p>If you didn't complete the previous examples, we recommend you start from the <a href="/quickstart/" target="_blank" rel="noopener noreferrer">beginning of this guide<ExternalLinkIcon/></a> to learn the basics of workflow development. If you have any issues completing this example, you can <a href="https://pipedream.com/@gettingstarted/quickstart-email-yourself-on-new-rss-items-p_5VCKggW" target="_blank" rel="noopener noreferrer">view, copy and run a completed version<ExternalLinkIcon/></a>.</p>
</div>
<h3 id="trigger-a-workflow-on-new-items-in-an-rss-feed" tabindex="-1"><a class="header-anchor" href="#trigger-a-workflow-on-new-items-in-an-rss-feed" aria-hidden="true">#</a> Trigger a workflow on new items in an RSS feed</h3>
<p>First, create a new workflow and search for the <strong>RSS</strong> app and select it:</p>
<p><img src="@source/quickstart/email-yourself/images/image-20210525193527287.png" alt="image-20210525193527287"></p>
<p>Then select the <strong>New item in feed</strong> trigger:</p>
<p><img src="@source/quickstart/email-yourself/images/image-20210525193554431.png" alt="image-20210525193554431"></p>
<p>For this example, let's use the feed of BBC's top stories. Add <code>http://feeds.bbci.co.uk/news/rss.xml</code> as the <strong>Feed URL</strong>. You can optionally customize the <strong>Timer</strong> (it controls how often to check for new items in the feed) and the <strong>Name</strong>.</p>
<p><img src="@source/quickstart/email-yourself/images/image-20210525193800859.png" alt="image-20210525193800859"></p>
<p>Next, click <strong>Create Source</strong>. Pipedream will instantiate the source and retrieve recent items from the RSS feed. You can use these events to help you build your workflow (you can expand the drop down menu to select a different event).</p>
<p><img src="@source/quickstart/email-yourself/images/image-20210525193936495.png" alt="image-20210525193936495"></p>
<p>Next, click <strong>Send Test Event</strong> to export the event for the trigger.</p>
<p><img src="@source/quickstart/email-yourself/images/image-20210525194015182.png" alt="image-20210525194015182"></p>
<h3 id="send-an-email-to-the-address-associated-with-your-pipedream-account" tabindex="-1"><a class="header-anchor" href="#send-an-email-to-the-address-associated-with-your-pipedream-account" aria-hidden="true">#</a> Send an email to the address associated with your Pipedream account</h3>
<p>Next, select the <strong>Send Yourself an Email</strong> action from the step selection menu.</p>
<p><img src="@source/quickstart/email-yourself/images/image-20210525194049672.png" alt="image-20210525194049672"></p>
<p>To configure the action:</p>
<ul>
<li>Set <strong>Subject</strong> to <code v-pre>New Item in Feed: {{steps.trigger.event.title}}</code></li>
<li>Set <strong>Text</strong> to <code v-pre>{{steps.trigger.event.description}} - {{steps.trigger.event.link}}</code></li>
</ul>
<p><img src="@source/quickstart/email-yourself/images/image-20210525194252727.png" alt="image-20210525194252727"></p>
<p>Finally, click <strong>Deploy</strong> and click <strong>Send Test Event</strong> in the trigger again to run the workflow.</p>
<p><img src="@source/quickstart/email-yourself/images/image-20210525194340766.png" alt="image-20210525194340766"></p>
<p>Pipedream will send an email to the address associated with your Pipedream account:</p>
<p><img src="@source/quickstart/email-yourself/images/image-20210525194431592.png" alt="image-20210525194431592"></p>
<h3 id="activate-the-trigger-to-run-your-workflow-on-new-app-events" tabindex="-1"><a class="header-anchor" href="#activate-the-trigger-to-run-your-workflow-on-new-app-events" aria-hidden="true">#</a> Activate the trigger to run your workflow on new app events</h3>
<p>Finally, to automatically run the workflow whenever a new item is detected in the RSS feed, enable the trigger.</p>
<p><img src="@source/quickstart/email-yourself/images/image-20210525194508356.png" alt="image-20210525194508356"></p>
<p><strong>For the final example of this guide, we'll address a real-world use case to post richly-formatted Tweets to Slack. <RouterLink to="/quickstart/real-world-example/">Take me to the last example →</RouterLink></strong></p>
<p style="text-align:center;">
<a :href="$withBase('/quickstart/real-world-example/')"><img src="@source/quickstart/next.png"></a>
</p>
</template>
