# Overview
 
The Pipedream Discord app enables you to build event-driven workflows that interact with the Discord API. When you authorize the Pipedream app's access to your guilds, you can use [Pipedream workflows](/workflows/) to perform common Discord [actions](#workflow-actions), or [write your own code](/code/) against the Discord API.

## Getting Started

To use the Discord Bot integration, you'll need to create a Discord bot and add that bot to your server(s). If you haven't created a Discord bot, [see these instructions](https://github.com/SinisterRectus/Discordia/wiki/Setting-up-a-Discord-application) or [watch this video](https://docs.pipedream.com/apps/discord/#discord-bot).

<iframe width="560" height="315" src="https://www.youtube.com/embed/IaKs8oA1-5g" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Not sure if you need to use the Discord or the Discord Bot integration for your workflow? Here's are the general similarities and differences:

Discord and Discord Bot actions and triggers _can_ both:

* Listen to events on Discord channels, guilds, etc.
* Perform actions like sending messages, managing channels, and members

However the Discord integration will perform actions with the official Pipedream Discord bot.

Using the Discord Bot integration will use a custom bot instead, with it's own name and photo.

### New Messages in Channel

[**Create this source here**](https://pipedream.com/sources?action=create&key=&app=discord_bot).

This event source emits events each time a new message is delivered to a Discord channel. By default, it emits an event for every message.

When you create this source, you'll be prompted to connect your Discord Bot token (press Connect Account and then New to add your token). The source will use that token to list the guilds / channels that bot has access to, asking you to select one:

<img alt="How to use Discord source GIF" src="/images/discord/2020-06-09 23.20.56.gif" />

We use Discord's API to poll for new messages in this channel **once a minute, by default**, but you can increase this to run up to once every 15 seconds, if you'd like.

The first time this source runs, it fetches up to the last 100 messages sent to your channel and stores the ID of the last message delivered to that channel. The next time the source runs, it polls your channel for messages sent after that ID.

By default, this event source is configured to emit an event for every new message in the channel. For example, if 5 messages are sent to the channel in one minute, the source will emit 5 events, one for each message. You can set the source to batch the events the source collects and emit them as a single event by setting the **Emit messages as a single event** parameter to `true`.

<img alt="Emit messages as a single event" src="/images/discord/emit-messages-as-single-event.png" />

In this example, the source would emit a single event: an array of 5 messages.
