# Overview

_This document details how to use code in [workflow steps](/workflows/steps/), without leaving your browser. If you're building a [component](/components/), please [reference the component API docs](/components/api/)._

Pipedream comes with thousands of prebuilt [triggers](/workflows/steps/triggers/) and [actions](/components/actions/) for [hundreds of apps](https://pipedream.com/apps). Often, these will be sufficient for building simple workflows.

But sometimes you need to run your own custom logic. You may need to make an API request to fetch additional metadata about the event, transform  data into a custom format, or end the execution of a workflow early under some conditions. **Code steps let you do this and more**.

Code steps let you execute [Node.js v{{$site.themeConfig.NODE_VERSION}}](https://nodejs.org/) (JavaScript) code, Python, Go or even Bash right in a workflow.

Choose a language to get started:

<div class="grid grid-cols-2">
<LanguageLink name="Node.js" link="/code/nodejs/" icon="https://res.cloudinary.com/pipedreamin/image/upload/v1646761316/docs/icons/icons8-nodejs_aax6wn.svg"/>
<LanguageLink name="Python" link="/code/python/" icon="https://res.cloudinary.com/pipedreamin/image/upload/v1646763734/docs/icons/icons8-python_ypgmya.svg"/>
<LanguageLink name="Go" link="/code/go/" icon="https://res.cloudinary.com/pipedreamin/image/upload/v1646763751/docs/icons/Go-Logo_Blue_zhkchv.svg"/>
<LanguageLink name="Bash" link="/code/bash/" icon="https://res.cloudinary.com/pipedreamin/image/upload/v1646763756/docs/icons/full_colored_dark_nllzkl.svg"/>
</div>

If you'd like to see another, specific language supported, please [let us know](https://pipedream.com/community).

<Footer />
