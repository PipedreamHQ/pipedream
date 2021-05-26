# Real-world Twitter -> Slack

For the last example in this quickstart, we'll use many of the patterns introduced in [earlier examples](/quickstart) to solve a real-world use case and will cover how to:

- [Trigger a workflow anytime @pipedream is mentioned on Twitter](#trigger-a-workflow-anytime-pipedream-https-twitter-com-pipedream-is-mentioned-on-twitter)
- [Construct a message in Node.js using Slack Block Kit](#construct-a-message-in-node-js-using-slack-block-kit)
- [Use an action to post the formatted message to a Slack channel](#use-an-action-to-post-the-formatted-message-to-a-slack-channel)

Following is an example of a Tweet that we'll richly format and post to Slack:

![image-20210518194229746](./image-20210518194229746.png)

### Trigger a workflow anytime [`@pipedream`](https://twitter.com/pipedream) is mentioned on Twitter

First, create a new workflow and select the **Twitter** app:

![image-20210518190544989](./image-20210518190544989.png)

Select **Search Mentions** to trigger your workflow every time a new Tweet matches your search criteria:

![image-20210518190657509](./image-20210518190657509.png)

Connect your Twitter account and then enter `@pipedream` for the search term. This will trigger your workflow when Pipedream's handle is mentioned on Twitter.

![image-20210518190942880](./image-20210518190942880.png)

To complete the trigger setup, add an optional name (e.g., `Pipedream Mentions`) and click **Create Source**:

![image-20210518191055978](./image-20210518191055978.png)

Use the drop down menu to select the event to help you build your workflow. Here we've selected a recent Tweet that includes an image (so we can incorporate that into our Slack message).

![image-20210518191509099](./image-20210518191509099.png)

### Construct a message in Node.js using Slack Block Kit

Let's include the following data from the trigger event in our Slack message:

- Tweet text
- Tweet Language
- Tweet URL
- Image (if present in the Tweet)
- Tweet timestamp
- Screen name and profile picture of the user
- Metadata for the user (number of followers, location and description)
- Link to the workflow that generated the Slack message (so it's easy to get to if we need to make changes in the future)

We can use Slack's Block Kit Builder to create a [JSON message template with placeholder values](https://app.slack.com/block-kit-builder/TD5JFTFRQ#%7B%22blocks%22:%5B%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22*%3Chttps://twitter.com/nraboy/statuses/1392985537083019267%7CNew%20Mention%3E%20by%20%3Chttps://twitter.com/nraboy/%7Cnraboy%3E%20(Thu%20May%2013%2023:30:07%20+0000%202021):*%5Cn%3E%20Tomorrow%20(05/14)%20at%207PM%20PT,%20we%20have%20a%20serverless%20filled%20night%20at%20the%20Tracy%20Developer%20Meetup.%20RSVP%20to%20participate%20and%20learn%20from%20the%20one%20and%20only%20Raymond%20Camden!%20https://t.co/FFXBRemv5s%20cc%20@raymondcamden%20@pipedream%20@workvine209%20https://t.co/gYLut18lqC%5Cn%22%7D,%22accessory%22:%7B%22type%22:%22image%22,%22image_url%22:%22https://pbs.twimg.com/profile_images/1035554704988594178/stN0QpgC_normal.jpg%22,%22alt_text%22:%22Profile%20picture%22%7D%7D,%7B%22type%22:%22image%22,%22image_url%22:%22https://pbs.twimg.com/media/E1Tg9mAXMAEwFQF.jpg%22,%22alt_text%22:%22Tweet%20Image%22%7D,%7B%22type%22:%22context%22,%22elements%22:%5B%7B%22type%22:%22mrkdwn%22,%22text%22:%22*User:*%20nraboy%22%7D,%7B%22type%22:%22mrkdwn%22,%22text%22:%22*Followers:*%204.6k%22%7D,%7B%22type%22:%22mrkdwn%22,%22text%22:%22*Location:*%20Tracy,%20CA%22%7D,%7B%22type%22:%22mrkdwn%22,%22text%22:%22*Language:*%20English%20(en)%22%7D,%7B%22type%22:%22mrkdwn%22,%22text%22:%22*Description:*%20Pok%C3%A9mon%20Trainer%20%7C%20Developer%20Relations%20at%20@MongoDB%20%7C%20Author%20on%20The%20Polyglot%20Developer%20%7C%20Organizer%20of%20the%20Tracy%20Developer%20Meetup%20%7C%20@Mail_gun%20Maverick%22%7D%5D%7D,%7B%22type%22:%22actions%22,%22elements%22:%5B%7B%22type%22:%22button%22,%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22View%20on%20Twitter%22,%22emoji%22:true%7D,%22url%22:%22https://twitter.com/nraboy/statuses/1392985537083019267%22%7D%5D%7D,%7B%22type%22:%22context%22,%22elements%22:%5B%7B%22type%22:%22mrkdwn%22,%22text%22:%22Sent%20via%20%3Chttps://pipedream.com/@/p_OKCYGM3%7CPipedream%3E%22%7D%5D%7D,%7B%22type%22:%22divider%22%7D%5D%7D). Next, we'll use a code step to replace the placeholder values with dynamic references to the event data that triggers the workflow.

![image-20210519012640800](./image-20210519012640800.png)

 The action we will use accepts the array of blocks, so let's extract that and export a populated array from our code step (i.e., we don't need to generate the entire JSON payload).

Add a step to **Run Node.js code** and name it `steps.generate_slack_blocks`. 

![image-20210518201050946](./image-20210518201050946.png)

Next, add the following code to `steps.generate_slack_blocks` (a step by step explanation of this code is in the [appendix](#appendix-code-breakdown)):

```javascript
const ISO6391 = require('iso-639-1')
const _ = require('lodash') 

// Return a friendly language name for ISO language codes
function getLanguageName(isocode) {
  try { return ISO6391.getName(isocode) } 
	catch (err) { return 'Unknown' }
}

// Format numbers over 1000
function kFormatter(num) {
    return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
}

// Format the Tweet as a quoted Slack message
let quotedMessage = ''
steps.trigger.event.full_text.split('\n').forEach(line => quotedMessage = quotedMessage + '> ' + line + '\n' )

// Define metadata to include in the Slack message
const tweetUrl = `https://twitter.com/${steps.trigger.event.user.screen_name}/statuses/${steps.trigger.event.id_str}`
const userUrl = `https://twitter.com/${steps.trigger.event.user.screen_name}/`
const mediaUrl = _.get(steps, 'trigger.event.extended_entities.media[0].media_url_https', '')
const mediaType = _.get(steps, 'trigger.event.extended_entities.media[0].type', '')

// Format the message as Slack blocks
// https://api.slack.com/block-kit
const blocks = []
blocks.push({
	"type": "section",
	"text": {
		"type": "mrkdwn",
		"text": `*<${tweetUrl}|New Mention> by <${userUrl}|${steps.trigger.event.user.screen_name}> (${steps.trigger.event.created_at}):*\n${quotedMessage}`
	},
		"accessory": {
			"type": "image",
			"image_url": steps.trigger.event.user.profile_image_url_https,
			"alt_text": "Profile picture"
		}
})

if(mediaUrl !== '' && mediaType === 'photo') {
	blocks.push({
		"type": "image",
		"image_url": mediaUrl,
		"alt_text": "Tweet Image"
	})
}

blocks.push({
	"type": "context",
	"elements": [
		{
			"type": "mrkdwn",
			"text": `*User:* ${steps.trigger.event.user.screen_name}`
		},
		{
			"type": "mrkdwn",
			"text": `*Followers:* ${kFormatter(steps.trigger.event.user.followers_count)}`
		},
		{
			"type": "mrkdwn",
			"text": `*Location:* ${steps.trigger.event.user.location}`
		},
		{
			"type": "mrkdwn",
			"text": `*Language:* ${getLanguageName(steps.trigger.event.lang)} (${steps.trigger.event.lang})`
		},
		{
			"type": "mrkdwn",
			"text": `*Description:* ${steps.trigger.event.user.description}`
		}
	]
},
{
	"type": "actions",
	"elements": [
		{
			"type": "button",
			"text": {
				"type": "plain_text",
				"text": "View on Twitter",
				"emoji": true
			},
			"url": tweetUrl
		}
	]
},
{
	"type": "context",
	"elements": [
		{
			"type": "mrkdwn",
			"text": `Sent via <https://pipedream.com/@/${steps.trigger.context.workflow_id}|Pipedream>`
		}
	]
},
{
	"type": "divider"
})

return blocks
```

**Deploy** your workflow and send a test event. It should execute successfully and `steps.generate_slack_blocks` should return an array of Slack Blocks with 6 elements:

![image-20210518203135105](./image-20210518203135105.png)

### Use an action to post the formatted message to a Slack channel

Next, click **+** to add a step and select the **Slack** app:

![image-20210525194859085](./image-20210525194859085.png)

Then, scroll or search to find the **Send Message Using Block Kit** action:

![image-20210518203402871](./image-20210518203402871.png)

To configure the step:

1. Connect your Slack account
2. Select the channel where you want to post the message
3. Set the **Blocks** field to <code v-pre>{{steps.generate_slack_blocks.$return_value}}</code>
4. Set the **Notification Text** field to <code v-pre>{{steps.trigger.event.full_text}}</code> (if you don't provide **Notification Text**, Slack's new message alerts may be blank or may not work)

![image-20210518204014823](./image-20210518204014823.png)

Then **Deploy** and send a test event to your workflow.

![image-20210518204100063](./image-20210518204100063.png)

A formatted message should be posted to Slack:

![image-20210518204801812](./image-20210518204801812.png)

Finally, turn on your trigger to run it on every new matching Tweet:

![image-20210518210047896](./image-20210518210047896.png)

To test out your workflow, post a Tweet mentioning `@pipedream` — or [click here to use our pre-written Tweet](https://twitter.com/intent/tweet?text=I%20just%20completed%20the%20%40pipedream%20quickstart!%20https%3A%2F%2Fpipedream.com%2Fquickstart%20).

![image-20210524211931799](./image-20210524211931799.png)

Your workflow will be triggered the next time the Twitter source runs (every 15 minutes by default, but you can manage your source and customize the interval).

<p style="text-align:center;">
<a href="/quickstart/next-steps/"><img src="../next.png"></a>
</p>

### APPENDIX: Code Breakdown

First, `require` the npm packages we need — we'll use the `iso-639-1`  package to convert the language code provided by Twitter into a human readable name, and we'll use `lodash` to help us extract values.

```javascript
const ISO6391 = require('iso-639-1')
const _ = require('lodash') 
```

Next, we'll define two functions to help us construct the message. First, we'll add a function to return the language name or `Unknown`:

```javascript
// Return a friendly language name for ISO language codes
function getLanguageName(isocode) {
  try { return ISO6391.getName(isocode) } 
	catch (err) { return 'Unknown' }
}
```

Next, we'll add a function to format the number of followers for a user (we can reuse this function we found via Google search on [Stack Overflow](https://stackoverflow.com/questions/9461621/format-a-number-as-2-5k-if-a-thousand-or-more-otherwise-900)).

```javascript
// Format numbers over 1000
function kFormatter(num) {
    return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
}
```

Next, let's format the Tweet text `steps.trigger.event.full_text` using Slack's quote formatting. Since Tweets can contain line breaks, we need to hande that case as well:

```javascript
// Format the Tweet as a quoted Slack message
let quotedMessage = ''
steps.trigger.event.full_text.split('\n').forEach(line => quotedMessage = quotedMessage + '> ' + line + '\n' )

```

Next, let's extract some values to make our message generation easier. We'll use `lodash` to extract values from keys that may not be present for some events (and set a default if missing).

```javascript
// Define metadata to include in the Slack message
const tweetUrl = `https://twitter.com/${steps.trigger.event.user.screen_name}/statuses/${steps.trigger.event.id_str}`
const userUrl = `https://twitter.com/${steps.trigger.event.user.screen_name}/`
const mediaUrl = _.get(steps, 'trigger.event.extended_entities.media[0].media_url_https', '')
const mediaType = _.get(steps, 'trigger.event.extended_entities.media[0].type', '')
```

Then, we'll start populating the Slack Blocks template:

```javascript
// Format the message as Slack blocks
// https://api.slack.com/block-kit
const blocks = []
blocks.push({
	"type": "section",
	"text": {
		"type": "mrkdwn",
		"text": `*<${tweetUrl}|New Mention> by <${userUrl}|${steps.trigger.event.user.screen_name}> (${steps.trigger.event.created_at}):*\n${quotedMessage}`
	},
		"accessory": {
			"type": "image",
			"image_url": steps.trigger.event.user.profile_image_url_https,
			"alt_text": "Profile picture"
		}
})
```

Next, if the Tweet contains a photo we'll add it to the message:

```javascript
if(mediaUrl !== '' && mediaType === 'photo') {
	blocks.push({
		"type": "image",
		"image_url": mediaUrl,
		"alt_text": "Tweet Image"
	})
}
```

Next, we'll populate the data in the message context elements...

```javascript
blocks.push({
	"type": "context",
	"elements": [
		{
			"type": "mrkdwn",
			"text": `*User:* ${steps.trigger.event.user.screen_name}`
		},
		{
			"type": "mrkdwn",
			"text": `*Followers:* ${kFormatter(steps.trigger.event.user.followers_count)}`
		},
		{
			"type": "mrkdwn",
			"text": `*Location:* ${steps.trigger.event.user.location}`
		},
		{
			"type": "mrkdwn",
			"text": `*Language:* ${getLanguageName(steps.trigger.event.lang)} (${steps.trigger.event.lang})`
		},
		{
			"type": "mrkdwn",
			"text": `*Description:* ${steps.trigger.event.user.description}`
		}
	]
},
```

...add the Tweet URL to the action button...

```javascript
{
	"type": "actions",
	"elements": [
		{
			"type": "button",
			"text": {
				"type": "plain_text",
				"text": "View on Twitter",
				"emoji": true
			},
			"url": tweetUrl
		}
	]
},
```

...and add the workflow ID by referencing `steps.trigger.context.workflow_id`:

```javascript
{
	"type": "context",
	"elements": [
		{
			"type": "mrkdwn",
			"text": `Sent via <https://pipedream.com/@/${steps.trigger.context.workflow_id}|Pipedream>`
		}
	]
},
{
	"type": "divider"
})
```

Finally, we'll return the array of blocks:

```javascript
return blocks
```
