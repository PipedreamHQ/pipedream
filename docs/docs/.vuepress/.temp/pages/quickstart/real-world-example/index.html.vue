<template><h1 id="real-world-twitter-slack" tabindex="-1"><a class="header-anchor" href="#real-world-twitter-slack" aria-hidden="true">#</a> Real-world Twitter -&gt; Slack</h1>
<p>For the last example in this quickstart, we'll use many of the patterns introduced in <a href="/quickstart/" target="_blank" rel="noopener noreferrer">earlier examples<ExternalLinkIcon/></a> to solve a real-world use case and will cover how to:</p>
<ul>
<li><a href="#trigger-a-workflow-anytime-pipedream-https-twitter-com-pipedream-is-mentioned-on-twitter">Trigger a workflow anytime @pipedream is mentioned on Twitter</a></li>
<li><a href="#construct-a-message-in-node-js-using-slack-block-kit">Construct a message in Node.js using Slack Block Kit</a></li>
<li><a href="#use-an-action-to-post-the-formatted-message-to-a-slack-channel">Use an action to post the formatted message to a Slack channel</a></li>
<li><a href="#run-a-live-test">Run a live test</a></li>
</ul>
<p>Following is an example of a Tweet that we'll richly format and post to Slack:</p>
<p><img src="@source/quickstart/real-world-example/images/image-20210518194229746.png" alt="image-20210518194229746"></p>
<div class="custom-container tip"><p class="custom-container-title">TIP</p>
<p>If you didn't complete the previous examples, we recommend you start from the <a href="/quickstart/" target="_blank" rel="noopener noreferrer">beginning of this guide<ExternalLinkIcon/></a> to learn the basics of workflow development. If you have any issues completing this example, you can <a href="https://pipedream.com/@gettingstarted/quickstart-real-world-twitter-slack-p_n1Co2dO" target="_blank" rel="noopener noreferrer">view, copy and run a completed version<ExternalLinkIcon/></a>.</p>
</div>
<h3 id="trigger-a-workflow-anytime-pipedream-is-mentioned-on-twitter" tabindex="-1"><a class="header-anchor" href="#trigger-a-workflow-anytime-pipedream-is-mentioned-on-twitter" aria-hidden="true">#</a> Trigger a workflow anytime <a href="https://twitter.com/pipedream" target="_blank" rel="noopener noreferrer"><code>@pipedream</code><ExternalLinkIcon/></a> is mentioned on Twitter</h3>
<p>First, create a new workflow and select the <strong>Twitter</strong> app:</p>
<p><img src="@source/quickstart/real-world-example/images/image-20210518190544989.png" alt="image-20210518190544989"></p>
<p>Select <strong>Search Mentions</strong> to trigger your workflow every time a new Tweet matches your search criteria:</p>
<p><img src="@source/quickstart/real-world-example/images/image-20210518190657509.png" alt="image-20210518190657509"></p>
<p>Connect your Twitter account and then enter <code>@pipedream</code> for the search term. This will trigger your workflow when Pipedream's handle is mentioned on Twitter.</p>
<p><img src="@source/quickstart/real-world-example/images/image-20210518190942880.png" alt="image-20210518190942880"></p>
<p>To complete the trigger setup, add an optional name (e.g., <code>Pipedream Mentions</code>) and click <strong>Create Source</strong>:</p>
<p><img src="@source/quickstart/real-world-example/images/image-20210518191055978.png" alt="image-20210518191055978"></p>
<p>Use the drop-down menu to select the event to help you build your workflow. Here we've selected a recent Tweet that includes an image (so we can incorporate that into our Slack message).</p>
<p><img src="@source/quickstart/real-world-example/images/image-20210518191509099.png" alt="image-20210518191509099"></p>
<h3 id="construct-a-message-in-node-js-using-slack-block-kit" tabindex="-1"><a class="header-anchor" href="#construct-a-message-in-node-js-using-slack-block-kit" aria-hidden="true">#</a> Construct a message in Node.js using Slack Block Kit</h3>
<p>Let's include the following data from the trigger event in our Slack message:</p>
<ul>
<li>Tweet text</li>
<li>Tweet Language</li>
<li>Tweet URL</li>
<li>Image (if the Tweet included an image, video or animated GIF)</li>
<li>Tweet timestamp</li>
<li>Screen name and profile picture of the user</li>
<li>Metadata for the user (number of followers, location and description)</li>
<li>Link to the workflow that generated the Slack message (so it's easy to get to if we need to make changes in the future)</li>
</ul>
<p>We can use Slack's Block Kit Builder to create a <a href="https://app.slack.com/block-kit-builder/TD5JFTFRQ#%7B%22blocks%22:%5B%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22*%3Chttps://twitter.com/nraboy/statuses/1392985537083019267%7CNew%20Mention%3E%20by%20%3Chttps://twitter.com/nraboy/%7Cnraboy%3E%20(Thu%20May%2013%2023:30:07%20+0000%202021):*%5Cn%3E%20Tomorrow%20(05/14)%20at%207PM%20PT,%20we%20have%20a%20serverless%20filled%20night%20at%20the%20Tracy%20Developer%20Meetup.%20RSVP%20to%20participate%20and%20learn%20from%20the%20one%20and%20only%20Raymond%20Camden!%20https://t.co/FFXBRemv5s%20cc%20@raymondcamden%20@pipedream%20@workvine209%20https://t.co/gYLut18lqC%5Cn%22%7D,%22accessory%22:%7B%22type%22:%22image%22,%22image_url%22:%22https://pbs.twimg.com/profile_images/1035554704988594178/stN0QpgC_normal.jpg%22,%22alt_text%22:%22Profile%20picture%22%7D%7D,%7B%22type%22:%22image%22,%22image_url%22:%22https://pbs.twimg.com/media/E1Tg9mAXMAEwFQF.jpg%22,%22alt_text%22:%22Tweet%20Image%22%7D,%7B%22type%22:%22context%22,%22elements%22:%5B%7B%22type%22:%22mrkdwn%22,%22text%22:%22*User:*%20nraboy%22%7D,%7B%22type%22:%22mrkdwn%22,%22text%22:%22*Followers:*%204.6k%22%7D,%7B%22type%22:%22mrkdwn%22,%22text%22:%22*Location:*%20Tracy,%20CA%22%7D,%7B%22type%22:%22mrkdwn%22,%22text%22:%22*Language:*%20English%20(en)%22%7D,%7B%22type%22:%22mrkdwn%22,%22text%22:%22*Description:*%20Pok%C3%A9mon%20Trainer%20%7C%20Developer%20Relations%20at%20@MongoDB%20%7C%20Author%20on%20The%20Polyglot%20Developer%20%7C%20Organizer%20of%20the%20Tracy%20Developer%20Meetup%20%7C%20@Mail_gun%20Maverick%22%7D%5D%7D,%7B%22type%22:%22actions%22,%22elements%22:%5B%7B%22type%22:%22button%22,%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22View%20on%20Twitter%22,%22emoji%22:true%7D,%22url%22:%22https://twitter.com/nraboy/statuses/1392985537083019267%22%7D%5D%7D,%7B%22type%22:%22context%22,%22elements%22:%5B%7B%22type%22:%22mrkdwn%22,%22text%22:%22Sent%20via%20%3Chttps://pipedream.com/@/p_OKCYGM3%7CPipedream%3E%22%7D%5D%7D,%7B%22type%22:%22divider%22%7D%5D%7D" target="_blank" rel="noopener noreferrer">JSON message template with placeholder values<ExternalLinkIcon/></a>. Next, we'll use a code step to replace the placeholder values with dynamic references to the event data that triggers the workflow.</p>
<p><img src="@source/quickstart/real-world-example/images/image-20210519012640800.png" alt="image-20210519012640800"></p>
<p>The action we will use accepts the array of blocks, so let's extract that and export a populated array from our code step (i.e., we don't need to generate the entire JSON payload).</p>
<p>Add a step to <strong>Run Node.js code</strong> and name it <code>steps.generate_slack_blocks</code>.</p>
<p><img src="@source/quickstart/real-world-example/images/image-20210518201050946.png" alt="image-20210518201050946"></p>
<p>Next, add the following code to <code>steps.generate_slack_blocks</code>:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token comment">// Require iso-639-1 to convert language codes into human readable names</span>
<span class="token keyword">const</span> <span class="token constant">ISO6391</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'iso-639-1'</span><span class="token punctuation">)</span>

<span class="token comment">// Require lodash to help extract values from intermittent fields in the Tweet object</span>
<span class="token keyword">const</span> _ <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'lodash'</span><span class="token punctuation">)</span>

<span class="token comment">// Function to return a friendly language name (or "Unknown") for ISO language codes</span>
<span class="token keyword">function</span> <span class="token function">getLanguageName</span><span class="token punctuation">(</span><span class="token parameter">isocode</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">try</span> <span class="token punctuation">{</span> <span class="token keyword">return</span> <span class="token constant">ISO6391</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span>isocode<span class="token punctuation">)</span> <span class="token punctuation">}</span>
	<span class="token keyword">catch</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token keyword">return</span> <span class="token string">'Unknown'</span> <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment">// Function to format numbers over 1000 from Stack Overflow https://stackoverflow.com/questions/9461621/format-a-number-as-2-5k-if-a-thousand-or-more-otherwise-900</span>
<span class="token keyword">function</span> <span class="token function">kFormatter</span><span class="token punctuation">(</span><span class="token parameter">num</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> Math<span class="token punctuation">.</span><span class="token function">abs</span><span class="token punctuation">(</span>num<span class="token punctuation">)</span> <span class="token operator">></span> <span class="token number">999</span> <span class="token operator">?</span> Math<span class="token punctuation">.</span><span class="token function">sign</span><span class="token punctuation">(</span>num<span class="token punctuation">)</span><span class="token operator">*</span><span class="token punctuation">(</span><span class="token punctuation">(</span>Math<span class="token punctuation">.</span><span class="token function">abs</span><span class="token punctuation">(</span>num<span class="token punctuation">)</span><span class="token operator">/</span><span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toFixed</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">'k'</span> <span class="token operator">:</span> Math<span class="token punctuation">.</span><span class="token function">sign</span><span class="token punctuation">(</span>num<span class="token punctuation">)</span><span class="token operator">*</span>Math<span class="token punctuation">.</span><span class="token function">abs</span><span class="token punctuation">(</span>num<span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token comment">// Format the Tweet (including line breaks) as a quoted Slack message</span>
<span class="token keyword">const</span> quotedMessage <span class="token operator">=</span> steps<span class="token punctuation">.</span>trigger<span class="token punctuation">.</span>event<span class="token punctuation">.</span>full_text
	<span class="token punctuation">.</span><span class="token function">split</span><span class="token punctuation">(</span><span class="token string">'\n'</span><span class="token punctuation">)</span>
	<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">line</span> <span class="token operator">=></span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">> </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>line<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span>
	<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token string">'\n'</span><span class="token punctuation">)</span>

<span class="token comment">// Construct URLs to reference in the formatted message</span>
<span class="token keyword">const</span> tweetUrl <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">https://twitter.com/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>steps<span class="token punctuation">.</span>trigger<span class="token punctuation">.</span>event<span class="token punctuation">.</span>user<span class="token punctuation">.</span>screen_name<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">/statuses/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>steps<span class="token punctuation">.</span>trigger<span class="token punctuation">.</span>event<span class="token punctuation">.</span>id_str<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>
<span class="token keyword">const</span> userUrl <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">https://twitter.com/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>steps<span class="token punctuation">.</span>trigger<span class="token punctuation">.</span>event<span class="token punctuation">.</span>user<span class="token punctuation">.</span>screen_name<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">/</span><span class="token template-punctuation string">`</span></span>

<span class="token comment">/*
Use lodash to get the URL for an image representing the media since
this object is not always present; `trigger.event.entities` will be present
when media — photos, animated GIFs or videos — are attached to the Tweet.
This object should always contain a photo, "even in cases of a video
and GIF being attached to Tweet."
https://developer.twitter.com/en/docs/twitter-api/v1/data-dictionary/object-model/entities
*/</span>
<span class="token keyword">const</span> mediaUrl <span class="token operator">=</span> _<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>steps<span class="token punctuation">,</span> <span class="token string">'trigger.event.entities.media[0].media_url_https'</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> mediaType <span class="token operator">=</span> _<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>steps<span class="token punctuation">,</span> <span class="token string">'trigger.event.entities.media[0].type'</span><span class="token punctuation">)</span>

<span class="token comment">// Format the message as Slack blocks - https://api.slack.com/block-kit</span>
<span class="token keyword">const</span> blocks <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
blocks<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
	<span class="token string-property property">"type"</span><span class="token operator">:</span> <span class="token string">"section"</span><span class="token punctuation">,</span>
	<span class="token string-property property">"text"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
		<span class="token string-property property">"type"</span><span class="token operator">:</span> <span class="token string">"mrkdwn"</span><span class="token punctuation">,</span>
		<span class="token string-property property">"text"</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">*&lt;</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>tweetUrl<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">|New Mention> by &lt;</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>userUrl<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">|</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>steps<span class="token punctuation">.</span>trigger<span class="token punctuation">.</span>event<span class="token punctuation">.</span>user<span class="token punctuation">.</span>screen_name<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">> (</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>steps<span class="token punctuation">.</span>trigger<span class="token punctuation">.</span>event<span class="token punctuation">.</span>created_at<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">):*\n</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>quotedMessage<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>
	<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token string-property property">"accessory"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
			<span class="token string-property property">"type"</span><span class="token operator">:</span> <span class="token string">"image"</span><span class="token punctuation">,</span>
			<span class="token string-property property">"image_url"</span><span class="token operator">:</span> steps<span class="token punctuation">.</span>trigger<span class="token punctuation">.</span>event<span class="token punctuation">.</span>user<span class="token punctuation">.</span>profile_image_url_https<span class="token punctuation">,</span>
			<span class="token string-property property">"alt_text"</span><span class="token operator">:</span> <span class="token string">"Profile picture"</span>
		<span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>mediaType<span class="token punctuation">)</span>

<span class="token comment">// If the Tweet contains a photo add it to the message</span>
<span class="token keyword">if</span><span class="token punctuation">(</span>mediaUrl <span class="token operator">&amp;&amp;</span> mediaType <span class="token operator">===</span> <span class="token string">'photo'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	blocks<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
		<span class="token string-property property">"type"</span><span class="token operator">:</span> <span class="token string">"image"</span><span class="token punctuation">,</span>
		<span class="token string-property property">"image_url"</span><span class="token operator">:</span> mediaUrl<span class="token punctuation">,</span>
		<span class="token string-property property">"alt_text"</span><span class="token operator">:</span> <span class="token string">"Tweet Image"</span>
	<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token comment">// Populate the context elements, button and footer</span>
blocks<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
	<span class="token string-property property">"type"</span><span class="token operator">:</span> <span class="token string">"context"</span><span class="token punctuation">,</span>
	<span class="token string-property property">"elements"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
		<span class="token punctuation">{</span>
			<span class="token string-property property">"type"</span><span class="token operator">:</span> <span class="token string">"mrkdwn"</span><span class="token punctuation">,</span>
			<span class="token string-property property">"text"</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">*User:* </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>steps<span class="token punctuation">.</span>trigger<span class="token punctuation">.</span>event<span class="token punctuation">.</span>user<span class="token punctuation">.</span>screen_name<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token punctuation">{</span>
			<span class="token string-property property">"type"</span><span class="token operator">:</span> <span class="token string">"mrkdwn"</span><span class="token punctuation">,</span>
			<span class="token string-property property">"text"</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">*Followers:* </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token function">kFormatter</span><span class="token punctuation">(</span>steps<span class="token punctuation">.</span>trigger<span class="token punctuation">.</span>event<span class="token punctuation">.</span>user<span class="token punctuation">.</span>followers_count<span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token punctuation">{</span>
			<span class="token string-property property">"type"</span><span class="token operator">:</span> <span class="token string">"mrkdwn"</span><span class="token punctuation">,</span>
			<span class="token string-property property">"text"</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">*Location:* </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>steps<span class="token punctuation">.</span>trigger<span class="token punctuation">.</span>event<span class="token punctuation">.</span>user<span class="token punctuation">.</span>location<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token punctuation">{</span>
			<span class="token string-property property">"type"</span><span class="token operator">:</span> <span class="token string">"mrkdwn"</span><span class="token punctuation">,</span>
			<span class="token string-property property">"text"</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">*Language:* </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token function">getLanguageName</span><span class="token punctuation">(</span>steps<span class="token punctuation">.</span>trigger<span class="token punctuation">.</span>event<span class="token punctuation">.</span>lang<span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> (</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>steps<span class="token punctuation">.</span>trigger<span class="token punctuation">.</span>event<span class="token punctuation">.</span>lang<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">)</span><span class="token template-punctuation string">`</span></span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token punctuation">{</span>
			<span class="token string-property property">"type"</span><span class="token operator">:</span> <span class="token string">"mrkdwn"</span><span class="token punctuation">,</span>
			<span class="token string-property property">"text"</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">*Description:* </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>steps<span class="token punctuation">.</span>trigger<span class="token punctuation">.</span>event<span class="token punctuation">.</span>user<span class="token punctuation">.</span>description<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>
		<span class="token punctuation">}</span>
	<span class="token punctuation">]</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">{</span>
	<span class="token string-property property">"type"</span><span class="token operator">:</span> <span class="token string">"actions"</span><span class="token punctuation">,</span>
	<span class="token string-property property">"elements"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
		<span class="token punctuation">{</span>
			<span class="token string-property property">"type"</span><span class="token operator">:</span> <span class="token string">"button"</span><span class="token punctuation">,</span>
			<span class="token string-property property">"text"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
				<span class="token string-property property">"type"</span><span class="token operator">:</span> <span class="token string">"plain_text"</span><span class="token punctuation">,</span>
				<span class="token string-property property">"text"</span><span class="token operator">:</span> <span class="token string">"View on Twitter"</span><span class="token punctuation">,</span>
				<span class="token string-property property">"emoji"</span><span class="token operator">:</span> <span class="token boolean">true</span>
			<span class="token punctuation">}</span><span class="token punctuation">,</span>
			<span class="token string-property property">"url"</span><span class="token operator">:</span> tweetUrl
		<span class="token punctuation">}</span>
	<span class="token punctuation">]</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">{</span>
	<span class="token string-property property">"type"</span><span class="token operator">:</span> <span class="token string">"context"</span><span class="token punctuation">,</span>
	<span class="token string-property property">"elements"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
		<span class="token punctuation">{</span>
			<span class="token string-property property">"type"</span><span class="token operator">:</span> <span class="token string">"mrkdwn"</span><span class="token punctuation">,</span>
			<span class="token string-property property">"text"</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Sent via &lt;https://pipedream.com/@/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>steps<span class="token punctuation">.</span>trigger<span class="token punctuation">.</span>context<span class="token punctuation">.</span>workflow_id<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">|Pipedream></span><span class="token template-punctuation string">`</span></span>
		<span class="token punctuation">}</span>
	<span class="token punctuation">]</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">{</span>
	<span class="token string-property property">"type"</span><span class="token operator">:</span> <span class="token string">"divider"</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token keyword">return</span> blocks
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br><span class="line-number">95</span><br><span class="line-number">96</span><br><span class="line-number">97</span><br><span class="line-number">98</span><br><span class="line-number">99</span><br><span class="line-number">100</span><br><span class="line-number">101</span><br><span class="line-number">102</span><br><span class="line-number">103</span><br><span class="line-number">104</span><br><span class="line-number">105</span><br><span class="line-number">106</span><br><span class="line-number">107</span><br><span class="line-number">108</span><br><span class="line-number">109</span><br><span class="line-number">110</span><br><span class="line-number">111</span><br><span class="line-number">112</span><br><span class="line-number">113</span><br><span class="line-number">114</span><br><span class="line-number">115</span><br><span class="line-number">116</span><br><span class="line-number">117</span><br><span class="line-number">118</span><br></div></div><p><strong>Deploy</strong> your workflow and send a test event. It should execute successfully and <code>steps.generate_slack_blocks</code> should return an array of Slack Blocks:</p>
<p><img src="@source/quickstart/real-world-example/images/image-20210518203135105.png" alt="image-20210518203135105"></p>
<h3 id="use-an-action-to-post-the-formatted-message-to-a-slack-channel" tabindex="-1"><a class="header-anchor" href="#use-an-action-to-post-the-formatted-message-to-a-slack-channel" aria-hidden="true">#</a> Use an action to post the formatted message to a Slack channel</h3>
<p>Next, click <strong>+</strong> to add a step and select the <strong>Slack</strong> app:</p>
<p><img src="@source/quickstart/real-world-example/images/image-20210525194859085.png" alt="image-20210525194859085"></p>
<p>Then, scroll or search to find the <strong>Send Message Using Block Kit</strong> action:</p>
<p><img src="@source/quickstart/real-world-example/images/image-20210518203402871.png" alt="image-20210518203402871"></p>
<p>To configure the step:</p>
<ol>
<li>Connect your Slack account</li>
<li>Select the channel where you want to post the message</li>
<li>Set the <strong>Blocks</strong> field to <code v-pre>{{steps.generate_slack_blocks.$return_value}}</code></li>
<li>Set the <strong>Notification Text</strong> field to <code v-pre>{{steps.trigger.event.full_text}}</code> (if you don't provide <strong>Notification Text</strong>, Slack's new message alerts may be blank or may not work)</li>
</ol>
<p><img src="@source/quickstart/real-world-example/images/image-20210518204014823.png" alt="image-20210518204014823"></p>
<p>Then <strong>Deploy</strong> and send a test event to your workflow.</p>
<p><img src="@source/quickstart/real-world-example/images/image-20210518204100063.png" alt="image-20210518204100063"></p>
<p>A formatted message should be posted to Slack:</p>
<p><img src="@source/quickstart/real-world-example/images/image-20210518204801812.png" alt="image-20210518204801812"></p>
<h1 id="run-a-live-test" tabindex="-1"><a class="header-anchor" href="#run-a-live-test" aria-hidden="true">#</a> Run a live test</h1>
<p>To run a live test, first turn on your trigger to run the workflow on every new matching Tweet:</p>
<p><img src="@source/quickstart/real-world-example/images/image-20210518210047896.png" alt="image-20210518210047896"></p>
<p>Next, post a Tweet mentioning <code>@pipedream</code> — <strong>click Post Tweet below to use our pre-written Tweet with an image</strong> (this image will be included in your formatted Slack message):</p>
<p style="text-align:center;">
<a href="https://twitter.com/intent/tweet?text=I%27m%20testing%20my%20%40pipedream%20workflow!%20Try%20for%20free%20at%20https%3A%2F%2Fpipedream.com%2Fquickstart%2F%20and%20learn%20to%20connect%20APIs%20with%20code%20level%20control%20when%20you%20need%20it%2C%20and%20no%20code%20when%20you%20don%27t!%20pic.twitter.com%2F3kLOEdPMQ1" target="_blank"><img src="@source/quickstart/real-world-example/images/post-tweet-content.png"> <img src="@source/quickstart/real-world-example/images/post-tweet.png"></a>
</p>
<!--
 or [use our pre-written Tweet](https://twitter.com/intent/tweet?text=I%20just%20completed%20the%20%40pipedream%20quickstart!%20https%3A%2F%2Fpipedream.com%2Fquickstart%20).
<a href="https://twitter.com/intent/tweet?text=I%20just%20completed%20the%20%40pipedream%20quickstart!%20https%3A%2F%2Fpipedream.com%2Fquickstart%20" target="_blank"><img src="@source/quickstart/real-world-example/images/image-20210524211931799.png"></a>
-->
<p>Your workflow will be triggered the next time the Twitter source runs (every 15 minutes by default). You can also trigger your source manually. Click on <strong>Edit code and configuration</strong> in your trigger step:</p>
<p><img src="@source/quickstart/real-world-example/images/image-20210526180913701.png" alt="image-20210526180913701"></p>
<p>This will bring up the code and configuration for the source (which you can edit). Click on the <strong>Events</strong> tab:</p>
<p><img src="@source/quickstart/real-world-example/images/image-20210526181036217.png" alt="image-20210526181036217"></p>
<p>Finally, click on <strong>Run Now</strong></p>
<p><img src="@source/quickstart/real-world-example/images/image-20210526181111074.png" alt="image-20210526181111074"></p>
<p>Your source will run and emit new Tweets. Each new Tweet will trigger your workflow. Messages should be posted to Slack, and you can return to the workflow to inspect the events.</p>
<p><strong>Congratulations! You completed the quickstart and you're ready to start building workflows on Pipedream!</strong> Click <strong>Next</strong> to learn about Pipedream's advanced features including state management, concurrency and execution rate controls and more.</p>
<p style="text-align:center;">
<a :href="$withBase('/quickstart/next-steps/')"><img src="@source/quickstart/next.png"></a>
</p>
</template>
