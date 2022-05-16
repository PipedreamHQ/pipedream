# Overview

<VideoPlayer url="https://www.youtube.com/embed/2mQgJbl8FMA" title="Creating a code step in your Pipedream workflows" />

_This document details how to use code in [workflow steps](/workflows/steps/), without leaving your browser. If you're building a [component](/components/), please [reference the component API docs](/components/api/)._

Pipedream comes with thousands of prebuilt [triggers](/workflows/steps/triggers/) and [actions](/components#actions) for [hundreds of apps](https://pipedream.com/apps). Often, these will be sufficient for building simple workflows.

But sometimes you need to run your own custom logic. You may need to make an API request to fetch additional metadata about the event, transform  data into a custom format, or end the execution of a workflow early under some conditions. **Code steps let you do this and more**.

Code steps let you execute [Node.js v{{$site.themeConfig.NODE_VERSION}}](https://nodejs.org/) (JavaScript) code, Python, Go or even Bash right in a workflow.

Choose a language to get started:

<div class="grid grid-cols-2">
<LanguageLink name="Node.js" link="/docs/code/nodejs/" :icon="this.$site.themeConfig.icons.nodejs.with_title"/>
<LanguageLink name="Python" link="/docs/code/python/" :icon="this.$site.themeConfig.icons.python.with_title"/>
<LanguageLink name="Go" link="/docs/code/go/" :icon="this.$site.themeConfig.icons.go.with_title"/>
<LanguageLink name="Bash" link="/docs/code/bash/" :icon="this.$site.themeConfig.icons.bash.with_title"/>
</div>

If you'd like to see another, specific language supported, please [let us know](https://pipedream.com/community).

<Footer />
