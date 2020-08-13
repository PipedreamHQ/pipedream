# Github API Integrations 
### Integrate Github and thousands of applications with Pipedream.  Free for developers.

---

Pipedream is a serverless integration and compute platform.  We provide a free, hosted platform that makes it easy to connect apps and develop, execute and maintain event-driven workflows.

**Key Features**:
* [Github API Event Sources](#github-api-event-sources) - Open source [components](https://github.com/PipedreamHQ/pipedream/tree/master/components) that emit events from Github
* [Workflows](#workflows) - A sequence of linear steps - just Node.js code - triggered by a Github event
* Serverless - No server or cloud resources to manage
* [Free](#pricing) - No fees for individual developers (see [limits](https://docs.pipedream.com/limits/))

<a href="http://tod.ly/3fMdryW"><img src="https://i.ibb.co/m0bBsSL/deploy-clean.png" height="35"></a>

## Github API Event Sources

 - [Custom Events](http://tod.ly/3fMdryW) - Build your own event source using one or multiple events ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/custom-events.js))
 - [New Branch](http://tod.ly/3fMdryW) - Triggered when a new branch is created. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/new-branch.js))
 - [New Commit](http://tod.ly/3fMdryW) - Triggered when a new commit comment is created. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/new-commit.js))
 - [New Commit Comment](http://tod.ly/3fMdryW) - Triggered when a new comment on a commit is created. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/new-commit-comment.js))
 - [New Issue](http://tod.ly/3fMdryW) - Triggered when a new issue is created. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/new-issue.js))
 - [New Label](http://tod.ly/3fMdryW) - Triggered when a new label is created. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/new-label.js))
 - [New Mention](http://tod.ly/3fMdryW) - Triggers when your username is mentioned in a Commit, Comment, Issue or Pull Request. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/new-mention.js))
 - [New Milestone](http://tod.ly/3fMdryW) - Triggered when a new milestone is created. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/new-milestone.js))
 - [New Project Card](http://tod.ly/3fMdryW) - Triggered when a new project card is created. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/new-project-card.js))
 - [New Pull Request](http://tod.ly/3fMdryW) -  Triggered when a new pull request is created. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/new-pull-request.js))
 - [New Push](http://tod.ly/3fMdryW) - Triggered when a new push is created. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/push-event.js))
 - [New Repository](http://tod.ly/3fMdryW) - Triggered when a new repository is created. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/new-repository.js))
 - [New Review Request](http://tod.ly/3fMdryW) - Triggered when a new review request is created. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/new-review-request.js))
 - [New Security Alert](http://tod.ly/3fMdryW) - Triggered when a new security alert is created. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/new-security-alert.js))
 - [New Stars](http://tod.ly/3fMdryW) - Triggered when a new star is created. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/new-star.js))
 
Event sources can also be deployed via the [Pipedream CLI](https://docs.pipedream.com/cli/reference/):

```bash
curl https://cli.pipedream.com/install | sh
```

Once installed, you can deploy an event source by running:

```bash
pd deploy   # prompts you to select a component and pass required options
```

## Workflows

Workflows are a sequence of linear [steps](https://docs.pipedream.com/workflows/steps) - just Node.js code - triggered by an event (via event source, HTTP endpoint, or timer). Workflows make it easy to transform data and integrate with 300+ APIs from various apps and services.

* Trigger your workflow on any [Github event](https://pipedream.com/sources/new?app=github), a different event (e.g. [HTTP requests](https://docs.pipedream.com/workflows/steps/triggers/#http) or a [schedule](https://docs.pipedream.com/workflows/steps/triggers/#cron-scheduler)).
* Add steps to run [Node.js code](https://docs.pipedream.com/workflows/steps/code/) (using virtually any npm package) and [pre-built actions](https://docs.pipedream.com/workflows/steps/actions/).
* Steps are executed in the order they appear in your workflow.
* Data is shared between steps via [step exports](https://docs.pipedream.com/workflows/steps/#step-exports).

Workflow code is [public by default](https://docs.pipedream.com/public-workflows/) so the community can discover and [copy them](https://docs.pipedream.com/workflows/copy/). Your workflow execution and event data is private. 

You can copy [this example workflow](https://pipedream.com/@tod/use-http-requests-to-trigger-a-workflow-p_6lCy5y/readme) to get started, or review some [community-developed workflows](https://pipedream.com/explore) to see what others are building.

## Other Popular API Integrations

* [Airtable](https://github.com/PipedreamHQ/pipedream/tree/master/components/airtable) ([deploy](https://pipedream.com/sources/new?app=airtable))
* [AWS](https://github.com/PipedreamHQ/pipedream/tree/master/components/aws) ([deploy](https://pipedream.com/sources/new?app=aws))
* [Dropbox](https://github.com/PipedreamHQ/pipedream/tree/master/components/dropbox) ([deploy](https://pipedream.com/sources/new?app=dropbox))
* [Google Calendar](https://github.com/PipedreamHQ/pipedream/tree/master/components/google-calendar) ([deploy](https://pipedream.com/sources/new?app=google-calendar))
* [Google Drive](https://github.com/PipedreamHQ/pipedream/tree/master/components/google-drive) ([deploy](https://pipedream.com/sources/new?app=google-drive))
* [RSS](https://github.com/PipedreamHQ/pipedream/tree/master/components/rss) ([deploy](https://pipedream.com/sources/new?app=rss))
* [Twitter](https://github.com/PipedreamHQ/pipedream/tree/master/components/twitter) ([deploy](https://pipedream.com/sources/new?app=twitter))

## Pricing

Pipedream is currently free, subject to the [limits noted below](https://docs.pipedream.com/limits/). Paid tiers for higher volumes are coming soon.

If you exceed any of these limits, please [reach out](https://docs.pipedream.com/support/).

## Getting Support

You can get help [on our public Slack](https://pipedream.com/community) or [reach out to our team directly](https://docs.pipedream.com/support/) with any questions or feedback. We'd love to hear from you!

## Found a Bug? Have a Feature to suggest?

Before adding an issue, please search the [existing issues](https://github.com/PipedreamHQ/pipedream/issues) or [reach out to our team](https://docs.pipedream.com/support/) to see if a similar request already exists.

If an issue exists, please [add a reaction](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-conversations-on-github) or comment on your specific use case.
