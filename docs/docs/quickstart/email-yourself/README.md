# Email yourself on new RSS items

For the next example, create a new workflow and search for the **RSS** app

![image-20210516235511476](../images/image-20210516235511476.png)

Click on **RSS** and thenselect the **New item in feed** trigger:

![image-20210516235609560](../images/image-20210516235609560.png)

For this example, let's use the feed of CNN's top stories. Add `http://rss.cnn.com/rss/cnn_topstories.rss` as the **Feed URL**. You can optionally customize the **Timer** (it controls how often to check for new items in the feed) and the **Name**. 

![image-20210517001147611](../images/image-20210517001147611.png) 

Next, click **Create Source**. Pipedream will instantiate the source and retrieve recent items from the RSS feed. You can use these events to help you build your workflow (you can expand the drop down menu to select a different event to help you build your workflow).

![image-20210517002158566](../images/image-20210517002158566.png)

Next, click **Send Test Event** to export the event for the trigger.

![image-20210517002427147](../images/image-20210517002427147.png)

Next, select the **Send Yourself an Email** action from the step selection menu.

![image-20210517002515704](../images/image-20210517002515704.png)

To configure the action:

- Set **Subject** to <code v-pre>New Item in Feed: {steps.trigger.event.title}</code>
- Set **Text** to <code v-pre>{steps.trigger.event.description}</code>
- Add the optional **Html** field and set it to <code v-pre>{steps.trigger.event.description}</code>

![image-20210517002850288](../images/image-20210517002850288.png)

Finally, click **Deploy** and click **Send Test Event** in the trigger again to run the workflow.

![image-20210517003047680](../images/image-20210517003047680.png)

Pipedream will send an email to the email address registered for your Pipedream account:

![image-20210517003138966](../images/image-20210517003138966.png)

Finally, to automatically run the workflow whenever a new item is detected in the RSS feed, enable the trigger.

![image-20210517003247789](../images/image-20210517003247789.png)