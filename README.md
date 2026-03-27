![pipedream](https://i.ibb.co/LPhXtH1/logo.png)

<p align="center">
  <a href="https://pipedream.com/community"><img src="https://img.shields.io/badge/discourse-forum-brightgreen.svg?style=flat-square&link=https%3A%2F%2Fpipedream.com%2Fcommunity)](https://pipedream.com/community"></a>
  <a href="https://pipedream.com/support"><img src="https://img.shields.io/badge/-Join%20us%20on%20Slack-green?logo=slack&logoColor=34d28B&labelColor=150d11&color=34d28B&logoWidth=18&link=https%3A%2F%2Fpipedream.com%2Fsupport&link=https%3A%2F%2Fpipedream.com%2Fsupport)](https://pipedream.com/support"></a>
  <a href="https://twitter.com/intent/follow?original_referer=https%3A%2F%2Fpublish.twitter.com%2F%3FbuttonType%3DFollowButton%26query%3Dhttps%253A%252F%252Ftwitter.com%252Fpipedream%26widget%3DButton&ref_src=twsrc%5Etfw&region=follow_link&screen_name=pipedream&tw_p=followbutton"><img src="https://img.shields.io/twitter/follow/pipedream?label=Follow%20%40pipedream&style=social"></a>
  <a href="https://wellfound.com/company/pipedreamhq/jobs"><img src="https://img.shields.io/badge/%F0%9F%91%8B%F0%9F%8F%BC%20We're%20hiring!-Join%20us-brightgreen"></a>
</p>

Pipedream is an integration platform for developers.

Pipedream provides a free, hosted platform for connecting apps and developing event-driven automations. The platform has over 1,000 fully-integrated applications, so you can use pre-built components to quickly send messages to Slack, add a new row to Google Sheets, and more. You can also run any Node.js, Python, Golang, or Bash code when you need custom logic. Pipedream has demonstrated SOC 2 compliance and can provide a SOC 2 Type 2 report upon request (please email support@pipedream.com).

<p align="center">
  <br />
  <img src="./images/hero2.png" width="800px" alt="HTTP trigger + step selection menu" >
  <br />
</p>

This repo contains:

- [The code for all pre-built integration components](https://github.com/PipedreamHQ/pipedream/tree/master/components)
- [The product roadmap](https://github.com/PipedreamHQ/pipedream/issues)
- [The Pipedream docs](https://github.com/PipedreamHQ/pipedream/tree/master/docs)
- And other source code related to Pipedream.

This `README` explains the key features of the platform and how to get started.

To get support, please visit [https://pipedream.com/support](https://pipedream.com/support).

## Getting Started

1. **Sign up** for a free account at [pipedream.com](https://pipedream.com).
2. **Create a Workflow**: Choose a trigger (like an HTTP request or a schedule) and add actions to connect to 1,000+ APIs.
3. **Deploy**: Your workflow runs automatically in the cloud—no infrastructure to manage.
4. **CLI**: Install the [Pipedream CLI](https://pipedream.com/docs/cli/install/) to develop and deploy components from your local terminal.

## Key Features

- [Workflows](#workflows) - Workflows run automations. Workflows are sequences of steps - pre-built actions or custom [Node.js](https://pipedream.com/docs/code/nodejs/), [Python](https://pipedream.com/docs/code/python/), [Golang](https://pipedream.com/docs/code/go/), or [Bash](https://pipedream.com/docs/code/bash/) code - triggered by an event (HTTP request, timer, when a new row is added to a Google Sheets, and more).
- [Event Sources](#event-sources) - Sources trigger workflows. They emit events from services like GitHub, Slack, Airtable, RSS and [more](https://pipedream.com/apps). When you want to run a workflow when a