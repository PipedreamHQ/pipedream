<template><h1 id="discord" tabindex="-1"><a class="header-anchor" href="#discord" aria-hidden="true">#</a> Discord</h1>
<div>
<img style="display: inline-block;" src="@source/apps/discord/images/discord_plus_pipedream_transparent.png" alt="Discord" width="130px">
</div>
<p>Pipedream supports a few different ways to connect to <a href="https://discordapp.com" target="_blank" rel="noopener noreferrer">Discord<ExternalLinkIcon/></a>:</p>
<ul>
<li><strong><a href="#discord-webhook">Discord Webhook</a>:</strong> If you just need to send messages to a channel, use this integration.</li>
<li><strong><a href="#discord-bot">Discord Bot</a>:</strong> This integration lets you interact with the <a href="https://discordapp.com/developers/docs/intro" target="_blank" rel="noopener noreferrer">Discord API<ExternalLinkIcon/></a> to programmatically create channel invites, kick users from a guild, and more. You'll need to create your own bot and add it to your guild before using this integration (<a href="#discord-bot">details below</a>).</li>
<li><strong><a href="#pipedream-bot-in-discord">Pipedream Bot in Discord</a>:</strong> This integration creates a Discord source that emits messages from your guild to a Pipedream workflow.</li>
</ul>
<p><strong>You can also use any combination of Discord integrations in the same workflow! Read on to learn more.</strong></p>
<nav class="table-of-contents"><ul><li><RouterLink to="#discord-webhook">Discord Webhook</RouterLink><ul><li><RouterLink to="#using-the-discord-webhook-integration">Using the Discord Webhook integration</RouterLink></li><li><RouterLink to="#example-send-an-embed">Example: Send an embed</RouterLink></li></ul></li><li><RouterLink to="#discord-bot">Discord Bot</RouterLink><ul><li><RouterLink to="#using-the-discord-bot-integration">Using the Discord Bot integration</RouterLink></li><li><RouterLink to="#requesting-more-discord-bot-actions">Requesting more Discord Bot Actions</RouterLink></li><li><RouterLink to="#limitations-of-the-bot-integration-on-pipedream">Limitations of the Bot integration on Pipedream</RouterLink></li></ul></li><li><RouterLink to="#pipedream-bot-in-discord">Pipedream Bot in Discord</RouterLink><ul><li><RouterLink to="#using-the-pipedream-bot-integration">Using the Pipedream Bot integration</RouterLink></li><li><RouterLink to="#discord-event-source">Discord Event Source</RouterLink></li></ul></li></ul></nav>
<h2 id="discord-webhook" tabindex="-1"><a class="header-anchor" href="#discord-webhook" aria-hidden="true">#</a> Discord Webhook</h2>
<p>The <strong>Discord Webhook</strong> integration is the easiest way to send messages to a channel.</p>
<p>You can use Pipedream to automate any workflow where you need to receive a message in Discord. For example, you can:</p>
<ul>
<li>Receive data <a href="/workflows/steps/triggers/#http" target="_blank" rel="noopener noreferrer">via webhooks<ExternalLinkIcon/></a>, <a href="/workflows/steps/code/" target="_blank" rel="noopener noreferrer">modify it with code<ExternalLinkIcon/></a>, and format a specific Discord message.</li>
<li><a href="/workflows/steps/triggers/#schedule" target="_blank" rel="noopener noreferrer">Run code on a schedule<ExternalLinkIcon/></a> to hit an API and send the data on to a Discord channel.</li>
<li>Use the <a href="/workflows/steps/triggers/#email" target="_blank" rel="noopener noreferrer">email trigger<ExternalLinkIcon/></a> to accept emails and forward them to Discord.</li>
</ul>
<p>Watch this video to see how to create a new Discord webhook using Pipedream, and how to send the name of a random Star Wars character to a Discord channel once an hour:</p>
<iframe width="560" height="315" src="https://www.youtube.com/embed/SLNqwnMbAKA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<p><a href="https://pipedream.com/@dylburger/send-a-random-star-wars-character-name-to-a-discord-channel-discord-webhooks-p_QPCNpq/readme" target="_blank" rel="noopener noreferrer">See the finished workflow here<ExternalLinkIcon/></a>. We'll walk through the setup described in the video below.</p>
<h3 id="using-the-discord-webhook-integration" tabindex="-1"><a class="header-anchor" href="#using-the-discord-webhook-integration" aria-hidden="true">#</a> Using the Discord Webhook integration</h3>
<p>To use this integration, add a new step to your workflow and choose the <strong>Discord Webhook</strong> app:</p>
<div>
<img alt="Discord Webhook integration" src="@source/apps/discord/images/discord-webhook.png" width="300">
</div>
<p>select the <strong>Send Message to Channel</strong> action:</p>
<div>
<img alt="Discord send a message to channel action" src="@source/apps/discord/images/send-message-to-channel.png" width="600">
</div>
<p>then <a href="/connected-accounts/#connecting-accounts" target="_blank" rel="noopener noreferrer">connect your Discord account<ExternalLinkIcon/></a>. When authorizing Pipedream access to your Discord account, you'll be asked to create a webhook for your target Discord server and channel.</p>
<p>If you'd like to create another webhooks in another channel, you can create another Discord Webhook connection. You can send a message to any number of Discord webhooks within a single workflow.</p>
<h3 id="example-send-an-embed" tabindex="-1"><a class="header-anchor" href="#example-send-an-embed" aria-hidden="true">#</a> Example: Send an embed</h3>
<p><a href="https://discordjs.guide/popular-topics/embeds.html" target="_blank" rel="noopener noreferrer">Discord embeds<ExternalLinkIcon/></a> are richly-formatted messages that include images, fields, and text, arranged in a custom way. You can send embeds using the Discord Webhook <strong>Send Message to Channel</strong> action in Pipedream.</p>
<p><a href="https://pipedream.com/@dylburger/discord-embed-example-p_6lCoe8/edit" target="_blank" rel="noopener noreferrer"><strong>Copy this example workflow to get started</strong><ExternalLinkIcon/></a>. This workflow formats an example embed in the <code>format_embed_message</code> step, <a href="/workflows/steps/#step-exports" target="_blank" rel="noopener noreferrer">exporting it<ExternalLinkIcon/></a> for use in future steps.</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">this</span><span class="token punctuation">.</span>msg <span class="token operator">=</span> <span class="token punctuation">[</span>
  <span class="token punctuation">{</span>
    <span class="token literal-property property">title</span><span class="token operator">:</span> <span class="token string">"Hello!"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">"Hi! :grinning:"</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">]</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>In the next step, we use the Discord Webhook <strong>Send Message to Channel</strong> action. This action expects <em>either</em> a <strong>Message</strong> <em>or</em> an <strong>Embeds</strong> parameter, which is delivered to your target channel. In this example workflow, we've selected the <strong>Embeds</strong> param, turned structured mode <strong>off</strong> (this allows us to <a href="/workflows/steps/params/#params-types" target="_blank" rel="noopener noreferrer">enter an expression<ExternalLinkIcon/></a> for the Embeds array), and entered the value <code v-pre>{{steps.format_embed_message.msg}}</code>, which evaluates to the array of objects we formatted in the step above:</p>
<div>
<img alt="Discord embed parameter" src="@source/apps/discord/images/discord-embed.png" width="400">
</div>
<p>This should send a message to Discord that looks something like:</p>
<div>
<img alt="Discord embed message in channel" src="@source/apps/discord/images/discord-embed-message.png" width="300">
</div>
<h2 id="discord-bot" tabindex="-1"><a class="header-anchor" href="#discord-bot" aria-hidden="true">#</a> Discord Bot</h2>
<p>The <strong>Discord Bot</strong> integration should be used when you have a Discord bot that you've added to a server, and you want to automate interaction with the Discord API using Pipedream. You can use this integration to:</p>
<ul>
<li>Accept HTTP requests from a <a href="/workflows/steps/triggers/#http" target="_blank" rel="noopener noreferrer">webhook<ExternalLinkIcon/></a> and automate common server actions, like automatically sending any new user who signs up for your app a channel invite.</li>
<li><a href="/workflows/steps/triggers/#schedule" target="_blank" rel="noopener noreferrer">Run code on a schedule<ExternalLinkIcon/></a> to regularly check your <a href="https://discordapp.com/developers/docs/resources/audit-log" target="_blank" rel="noopener noreferrer">Discord audit log<ExternalLinkIcon/></a> and send you an email of any events you want to monitor.</li>
<li>Any other administrative action you want to drive programmatically, triggered from any event.</li>
</ul>
<p>If you just want to send messages to a channel, check out the <a href="#discord-webhook"><strong>Discord Webhook</strong></a> integration, instead.</p>
<p>Watch this video to see how to create your own Discord bot, add it to a server, and make some requests to the Discord API from Pipedream:</p>
<iframe width="560" height="315" src="https://www.youtube.com/embed/8pTx0MD1Cjw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<p><a href="https://pipedream.com/@dylburger/modify-a-discord-server-name-using-a-discord-bot-p_OKC1Jb/readme" target="_blank" rel="noopener noreferrer">See the finished workflow here<ExternalLinkIcon/></a>. We'll walk through the setup described in the video below.</p>
<h3 id="using-the-discord-bot-integration" tabindex="-1"><a class="header-anchor" href="#using-the-discord-bot-integration" aria-hidden="true">#</a> Using the Discord Bot integration</h3>
<p>You'll need to create a Discord bot and add it to your server before you begin. Watch the first couple minutes of the video above, or <a href="https://github.com/SinisterRectus/Discordia/wiki/Setting-up-a-Discord-application" target="_blank" rel="noopener noreferrer">follow the instructions in this guide<ExternalLinkIcon/></a> to create that bot and add it to your server.</p>
<p>Once that's done, add a new step to your workflow and choose the <strong>Discord Bot</strong> app:</p>
<div>
<img alt="Discord Bot integration" src="@source/apps/discord/images/discord-bot.png" width="250">
</div>
<p>select any of the actions that appear:</p>
<div>
<img alt="Discord bot actions" src="@source/apps/discord/images/discord-bot-actions.png" width="300">
</div>
<p>and <a href="/connected-accounts/#connecting-accounts" target="_blank" rel="noopener noreferrer">connect your account<ExternalLinkIcon/></a>. You'll be asked to add your Discord bot token, which you can find under the <strong>Bot</strong> section of your app. Then deploy your workflow and start making API requests.</p>
<h3 id="requesting-more-discord-bot-actions" tabindex="-1"><a class="header-anchor" href="#requesting-more-discord-bot-actions" aria-hidden="true">#</a> Requesting more Discord Bot Actions</h3>
<p>To request a new Discord Bot action, please file an issue on our <a href="https://github.com/PipedreamHQ/pipedream" target="_blank" rel="noopener noreferrer">Github repo<ExternalLinkIcon/></a>.</p>
<h3 id="limitations-of-the-bot-integration-on-pipedream" tabindex="-1"><a class="header-anchor" href="#limitations-of-the-bot-integration-on-pipedream" aria-hidden="true">#</a> Limitations of the Bot integration on Pipedream</h3>
<p>Right now, the Discord Bot integration cannot utilize the <a href="https://discordapp.com/developers/docs/topics/gateway" target="_blank" rel="noopener noreferrer">Discord Gateway<ExternalLinkIcon/></a> to receive events via websockets or make API requests that require an initial connection to the gateway.</p>
<p>Please <a href="https://pipedream.com/support" target="_blank" rel="noopener noreferrer">reach out<ExternalLinkIcon/></a> if prevents you from building a workflow. We're happy to prioritize support for this in the future.</p>
<h2 id="pipedream-bot-in-discord" tabindex="-1"><a class="header-anchor" href="#pipedream-bot-in-discord" aria-hidden="true">#</a> Pipedream Bot in Discord</h2>
<h3 id="using-the-pipedream-bot-integration" tabindex="-1"><a class="header-anchor" href="#using-the-pipedream-bot-integration" aria-hidden="true">#</a> Using the Pipedream Bot integration</h3>
<p>To get started with this integration, <a href="https://pipedream.com/new" target="_blank" rel="noopener noreferrer">create a new workflow<ExternalLinkIcon/></a>. When setting up the trigger, select &quot;Discord&quot; as the app, then choose &quot;New Message&quot;.</p>
<div>
<img alt="Discord App integration" src="@source/apps/discord/images/discord-app-trigger.png" width="800">
</div>
<p>You'll be prompted to sign in to your Discord account if you haven't already connected it to Pipedream, then you can select the channel(s) to which you'd like to add the Pipedream Bot, and create the source. You should now see the Pipedream Bot in your relevant Discord channel(s).</p>
<div>
<img alt="Pipedream Bot" src="@source/apps/discord/images/pipedream-bot.png" width="350">
</div>
<h3 id="discord-event-source" tabindex="-1"><a class="header-anchor" href="#discord-event-source" aria-hidden="true">#</a> Discord Event Source</h3>
<p><a href="/event-sources/" target="_blank" rel="noopener noreferrer">Event sources<ExternalLinkIcon/></a> in Pipedream let you trigger workflows on new events from the partner API. In the case of Discord for example, you can create <a href="https://pipedream.com/apps/discord/triggers/new-message" target="_blank" rel="noopener noreferrer">a source that listens for new messages in a Discord channel<ExternalLinkIcon/></a>, and trigger a workflow to run on each new message.</p>
</template>
