# Email yourself on new RSS items

Next, let's create a workflow triggered on app events. This example builds on concepts covered in [previous sections](/quickstart/) and will cover how to:

[[toc]]

### Trigger a workflow on new items in an RSS feed

First, create a new workflow and search for the **RSS** app and select it:

![image-20210525193527287](./image-20210525193527287.png)

Then select the **New item in feed** trigger:

![image-20210525193554431](./image-20210525193554431.png)

For this example, let's use the feed of BBC's top stories. Add `http://feeds.bbci.co.uk/news/rss.xml` as the **Feed URL**. You can optionally customize the **Timer** (it controls how often to check for new items in the feed) and the **Name**. 

![image-20210525193800859](./image-20210525193800859.png) 

Next, click **Create Source**. Pipedream will instantiate the source and retrieve recent items from the RSS feed. You can use these events to help you build your workflow (you can expand the drop down menu to select a different event to help you build your workflow).

![image-20210525193936495](./image-20210525193936495.png)

Next, click **Send Test Event** to export the event for the trigger.

![image-20210525194015182](./image-20210525194015182.png)

### Send an email to the address associated with your Pipedream account

Next, select the **Send Yourself an Email** action from the step selection menu.

![image-20210525194049672](./image-20210525194049672.png)

To configure the action:

- Set **Subject** to <code v-pre>New Item in Feed: {{steps.trigger.event.title}}</code>
- Set **Text** to <code v-pre>{{steps.trigger.event.description}} - {{steps.trigger.event.link}}</code>

![image-20210525194252727](./image-20210525194252727.png)

Finally, click **Deploy** and click **Send Test Event** in the trigger again to run the workflow.

![image-20210525194340766](./image-20210525194340766.png)

Pipedream will send an email to the email address registered for your Pipedream account:

![image-20210525194431592](./image-20210525194431592.png)

### Run your workflow on new app events

Finally, to automatically run the workflow whenever a new item is detected in the RSS feed, enable the trigger.

![image-20210525194508356](./image-20210525194508356.png)

**For the final example of this guide, we'll address a real-world use case to post richly formatted Tweets to Slack. [Take me to the last example &rarr;](../real-world-example/)**

