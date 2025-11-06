# Overview

The GitHub API is a powerful gateway to interaction with GitHub's vast web of data and services, offering a suite of endpoints to manipulate and retrieve information on repositories, pull requests, issues, and more. Harnessing this API on Pipedream, you can orchestrate automated workflows that respond to events in real-time, manage repository data, streamline collaborative processes, and connect GitHub with other services for a more integrated development lifecycle.

# GitHub API Integration Platform

### Connect GitHub to 2,200+ apps, remarkably fast.

---

Pipedream is an integration platform for developers. Pipedream provides a free, hosted platform for connecting apps and developing event-driven automations.

<a href="https://tod.ly/github"><img src="https://i.ibb.co/n38r3KV/github.png" alt="github" border="0" height="50" /></a>

## Demo

Click the image below to watch a brief demo on YouTube.

<p align="left">
  <br />
  <a href="https://bit.ly/3ytGgyR">
    <img src="https://github.com/PipedreamHQ/pipedream/blob/master/images/demo.png" width="500px" alt="Pipedream demo static image" />
  </a>
</p>

## Key Features

- [Workflows](#workflows) - Workflows run automations. Workflows are sequence of steps - pre-built actions or custom [Node.js](https://pipedream.com/docs/code/nodejs/), [Python](https://pipedream.com/docs/code/python/), [Golang](https://pipedream.com/docs/code/go/), or [Bash](https://pipedream.com/docs/code/bash/) code - triggered by an event (HTTP request, timer, new row added to a Google Sheet, and more).

- [Event Sources](#event-sources) - Sources trigger workflows. They emit events from services like GitHub, Slack, Airtable, RSS and [more](https://pipedream.com/apps). When you want to run a workflow when an event happens in any third-party app, you're using an event source.

- [Actions](#actions) - Actions are pre-built code steps that you can use in a workflow to perform common operations across Pipedream's 2000+ API integrations. For example, you can use actions to send email, add a row to a Google Sheet, [and more](https://pipedream.com/apps).

- [Custom code](#code) - Most integrations require custom logic. Code is often the best way to express that logic, so Pipedream allows you to run any [Node.js](https://pipedream.com/docs/code/nodejs/), [Python](https://pipedream.com/docs/code/python/), [Golang](https://pipedream.com/docs/code/go/), or [Bash](https://pipedream.com/docs/code/bash/) code. You can import any package from the languages' package managers, connect to any Pipedream connected app, and more. Pipedream is "low-code" in the best way: you can use pre-built components when you're performing common actions, but you can write custom code when you need to.

- [Destinations](#destinations) - Deliver events asynchronously to common destinations like Amazon S3, Snowflake, HTTP and email

- [Free](#pricing) - No fees for individual developers (see [limits](https://docs.pipedream.com/limits/))

## Workflows

Workflows are a sequence of linear [steps](https://pipedream.com/docs/workflows/steps) triggered by an event (like an HTTP request, or when a new row is added to a Google sheet). You can quickly develop complex automations using workflows and connect to any of our 500+ integrated apps.

[See our workflow quickstart](https://pipedream.com/docs/quickstart/) to get started.

<p align="left">
  <br />
  <img src="https://github.com/PipedreamHQ/pipedream/blob/master/images/github6.png" width="800px" alt="HTTP trigger + step selection menu" >
  <br />
</p>

## GitHub API Event Sources ([explore](https://pipedream.com/apps/github))

[Event Sources](https://pipedream.com/docs/sources/) watch for new data from services like GitHub, Slack, Airtable, RSS and [more](https://pipedream.com/apps). When a source finds a new event, it emits it, triggering any linked workflows.

- [New Branch](https://pipedream.com/new?h=eyJuIjoiTmV3IEJyYW5jaCB3aXRoIHRoZSBHaXRIdWIgQVBJIiwidiI6MiwidCI6WyJzY19hOGlkeDhBIl0sInMiOltdLCJjIjp7fX0) - Triggers an event when a branch is created. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/sources/new-branch/new-branch.mjs))
- [New Card in Column (Classic Projects)](https://pipedream.com/new?h=eyJuIjoiTmV3IENhcmQgaW4gQ29sdW1uIChDbGFzc2ljIFByb2plY3RzKSB3aXRoIHRoZSBHaXRIdWIgQVBJIiwidiI6MiwidCI6WyJzY181WmlHOWdCIl0sInMiOltdLCJjIjp7fX0) - Triggers an event when a (classic) project card is created or moved to a specific column. For Projects V2 use New Issue with Status trigger. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/sources/new-card-in-column/new-card-in-column.mjs))
- [New Collaborator](https://pipedream.com/new?h=eyJuIjoiTmV3IENvbGxhYm9yYXRvciB3aXRoIHRoZSBHaXRIdWIgQVBJIiwidiI6MiwidCI6WyJzY182UWlrVlJyIl0sInMiOltdLCJjIjp7fX0) - Triggers an event when a collaborator is added. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/sources/new-collaborator/new-collaborator.mjs))
- [New Commit](https://pipedream.com/new?h=eyJuIjoiTmV3IENvbW1pdCB3aXRoIHRoZSBHaXRIdWIgQVBJIiwidiI6MiwidCI6WyJzY18zdmliVlo1Il0sInMiOltdLCJjIjp7fX0) - Triggers an event when commits are pushed to a branch. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/sources/new-commit/new-commit.mjs))
- [New Commit Comment](https://pipedream.com/new?h=eyJuIjoiTmV3IENvbW1pdCBDb21tZW50IHdpdGggdGhlIEdpdEh1YiBBUEkiLCJ2IjoyLCJ0IjpbInNjX2RvaVdvTTYiXSwicyI6W10sImMiOnt9fQ) - Triggers an event when a commit comment is created. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/sources/new-commit-comment/new-commit-comment.mjs))
- [New Discussion](https://pipedream.com/new?h=eyJuIjoiTmV3IERpc2N1c3Npb24gd2l0aCB0aGUgR2l0SHViIEFQSSIsInYiOjIsInQiOlsic2NfeU9pakJNSyJdLCJzIjpbXSwiYyI6e319) - Triggers an event when a discussion is created. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/sources/new-discussion/new-discussion.mjs))
- [New Fork](https://pipedream.com/new?h=eyJuIjoiTmV3IEZvcmsgd2l0aCB0aGUgR2l0SHViIEFQSSIsInYiOjIsInQiOlsic2NfamRpWmU0MCJdLCJzIjpbXSwiYyI6e319) - Triggers an event when a repository is forked. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/sources/new-fork/new-fork.mjs))
- [New Gist](https://pipedream.com/new?h=eyJuIjoiTmV3IEdpc3Qgd2l0aCB0aGUgR2l0SHViIEFQSSIsInYiOjIsInQiOlsic2NfcE1pdm5ZMiJdLCJzIjpbXSwiYyI6e319) - Triggers an event when new gists are created by the authenticated user. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/sources/new-gist/new-gist.mjs))
- [New Issue with Status (Projects V2)](https://pipedream.com/new?h=eyJuIjoiTmV3IElzc3VlIHdpdGggU3RhdHVzIChQcm9qZWN0cyBWMikgd2l0aCB0aGUgR2l0SHViIEFQSSIsInYiOjIsInQiOlsic2NfZ2xpM09vZyJdLCJzIjpbXSwiYyI6e319) - Triggers an event when a project issue is tagged with a specific status. Currently supports Organization Projects only. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/sources/new-issue-with-status/new-issue-with-status.mjs))
- [New Label](https://pipedream.com/new?h=eyJuIjoiTmV3IExhYmVsIHdpdGggdGhlIEdpdEh1YiBBUEkiLCJ2IjoyLCJ0IjpbInNjX0I1aXdWZVEiXSwicyI6W10sImMiOnt9fQ) - Triggers an event when a new label is created. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/sources/new-label/new-label.mjs))
- [New Mention](https://pipedream.com/new?h=eyJuIjoiTmV3IE1lbnRpb24gd2l0aCB0aGUgR2l0SHViIEFQSSIsInYiOjIsInQiOlsic2NfMUxpS2xCTSJdLCJzIjpbXSwiYyI6e319) - Triggers an event when you are @mentioned in a new commit, comment, issue, or pull request. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/sources/new-mention/new-mention.mjs))
- [New Notification](https://pipedream.com/new?h=eyJuIjoiTmV3IE5vdGlmaWNhdGlvbiB3aXRoIHRoZSBHaXRIdWIgQVBJIiwidiI6MiwidCI6WyJzY19XR2kwNlkzIl0sInMiOltdLCJjIjp7fX0) - Triggers an event when you receive a new notification. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/sources/new-notification/new-notification.mjs))
- [New or Updated Issue](https://pipedream.com/new?h=eyJuIjoiTmV3IG9yIFVwZGF0ZWQgSXNzdWUgd2l0aCB0aGUgR2l0SHViIEFQSSIsInYiOjIsInQiOlsic2NfNVppRzl6UiJdLCJzIjpbXSwiYyI6e319) - Triggers an event when an issue is created or updated. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/sources/new-or-updated-issue/new-or-updated-issue.mjs))
- [New or Updated Milestone](https://pipedream.com/new?h=eyJuIjoiTmV3IG9yIFVwZGF0ZWQgTWlsZXN0b25lIHdpdGggdGhlIEdpdEh1YiBBUEkiLCJ2IjoyLCJ0IjpbInNjX2RvaVdvangiXSwicyI6W10sImMiOnt9fQ) - Triggers an event when a milestone is created or updated. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/sources/new-or-updated-milestone/new-or-updated-milestone.mjs))
- [New or Updated Pull Request](https://pipedream.com/new?h=eyJuIjoiTmV3IG9yIFVwZGF0ZWQgUHVsbCBSZXF1ZXN0IHdpdGggdGhlIEdpdEh1YiBBUEkiLCJ2IjoyLCJ0IjpbInNjXzN2aWJWd2siXSwicyI6W10sImMiOnt9fQ) - Triggers an event when a pull request is opened or updated. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/sources/new-or-updated-pull-request/new-or-updated-pull-request.mjs))
- [New Organization](https://pipedream.com/new?h=eyJuIjoiTmV3IE9yZ2FuaXphdGlvbiB3aXRoIHRoZSBHaXRIdWIgQVBJIiwidiI6MiwidCI6WyJzY195T2lqQllWIl0sInMiOltdLCJjIjp7fX0) - Triggers an event when the authenticated user is added to a new organization. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/sources/new-organization/new-organization.mjs))
- [New Release](https://pipedream.com/new?h=eyJuIjoiTmV3IHJlbGVhc2Ugd2l0aCB0aGUgR2l0SHViIEFQSSIsInYiOjIsInQiOlsic2NfamRpWmVwbCJdLCJzIjpbXSwiYyI6e319) - Triggers an event when a new release is created. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/sources/new-release/new-release.mjs))
- [New Repository](https://pipedream.com/new?h=eyJuIjoiTmV3IHJlbGVhc2Ugd2l0aCB0aGUgR2l0SHViIEFQSSIsInYiOjIsInQiOlsic2NfamRpWmVwbCJdLCJzIjpbXSwiYyI6e319) - Triggers an event when new repositories are created. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/sources/new-repository/new-repository.mjs))
- [New Review Request](https://pipedream.com/new?h=eyJuIjoiTmV3IFJldmlldyBSZXF1ZXN0IHdpdGggdGhlIEdpdEh1YiBBUEkiLCJ2IjoyLCJ0IjpbInNjX01laUU2MFEiXSwicyI6W10sImMiOnt9fQ) - Triggers an event when you or a team you're a member of are requested to review a pull request. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/sources/new-review-request/new-review-request.mjs))
- [New Security Alert](https://pipedream.com/new?h=eyJuIjoiTmV3IFNlY3VyaXR5IEFsZXJ0IHdpdGggdGhlIEdpdEh1YiBBUEkiLCJ2IjoyLCJ0IjpbInNjX0I1aXdWZTQiXSwicyI6W10sImMiOnt9fQ) - Triggers an event when GitHub discovers a security vulnerability in one of your repositories. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/sources/new-security-alert/new-security-alert.mjs))
- [New Star By User](https://pipedream.com/new?h=eyJuIjoiTmV3IFN0YXIgQnkgVXNlciB3aXRoIHRoZSBHaXRIdWIgQVBJIiwidiI6MiwidCI6WyJzY18xTGlLbEJkIl0sInMiOltdLCJjIjp7fX0) - Triggers an event when the specified user stars a repository. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/sources/new-star-by-user/new-star-by-user.mjs))
- [New Star](https://pipedream.com/new?h=eyJuIjoiTmV3IFN0YXJzIHdpdGggdGhlIEdpdEh1YiBBUEkiLCJ2IjoyLCJ0IjpbInNjX3gwaXB5VlciXSwicyI6W10sImMiOnt9fQ) - Triggers an event when a repository is starred. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/sources/new-star/new-star.mjs))
- [New Team](https://pipedream.com/new?h=eyJuIjoiTmV3IFRlYW0gd2l0aCB0aGUgR2l0SHViIEFQSSIsInYiOjIsInQiOlsic2NfRHBpV3ZPSyJdLCJzIjpbXSwiYyI6e319) - Triggers an event when the user is added to a new team. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/sources/new-team/new-team.mjs))
- [New Webhook Event (Instant)](https://pipedream.com/new?h=eyJuIjoiTmV3IFdlYmhvb2sgRXZlbnQgKEluc3RhbnQpIHdpdGggdGhlIEdpdEh1YiBBUEkiLCJ2IjoyLCJ0IjpbInNjXzhuaWE1TVkiXSwicyI6W10sImMiOnt9fQ) - Triggers an event for each selected event type. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/sources/webhook-events/webhook-events.mjs))

You can also consume events emitted by sources using [Pipedream's REST API](https://pipedream.com/docs/api/rest/) or a private, real-time [SSE stream](https://pipedream.com/docs/api/sse/).

When a pre-built source doesn't exist for your use case, [you can build your own](https://pipedream.com/docs/components/quickstart/nodejs/sources/). Here is the simplest event source: it exposes an HTTP endpoint you can send any request to, and prints the contents of the request when invoked:

```javascript
export default {
  name: "http",
  version: "0.0.1",
  props: {
    http: "$.interface.http",
  },
  run(event) {
    console.log(event); // event contains the method, payload, etc.
  },
};
```

<a href="https://pipedream.com/sources/new?app=http"><img src="https://i.ibb.co/m0bBsSL/deploy-clean.png" height="35"></a>

You can find the code for all pre-built sources in [the `components` directory](https://github.com/PipedreamHQ/pipedream/tree/master/components). If you find a bug or want to contribute a feature, [see our contribution guide](https://pipedream.com/docs/components/guidelines/#process).

## GitHub API Actions ([explore](https://pipedream.com/apps/github))

[Actions](https://pipedream.com/docs/components/actions/) are pre-built code steps that you can use in a workflow to perform common operations across Pipedream's 2,000+ API integrations. For example, you can use actions to send email, add a row to a Google Sheet, [and more](https://pipedream.com/apps).

- [Create Issue](https://pipedream.com/new?h=eyJuIjoiQ3JlYXRlIElzc3VlIHdpdGggdGhlIEdpdEh1YiBBUEkiLCJ2IjoyLCJ0IjpbXSwicyI6W3sia2V5IjoiZ2l0aHViLWNyZWF0ZS1pc3N1ZSJ9XSwiYyI6e319) - Create a new issue in a GitHub repo. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/actions/create-issue/create-issue.mjs))
- [Search Issues and Pull Requests](https://pipedream.com/new?h=eyJuIjoiU2VhcmNoIElzc3VlcyBhbmQgUHVsbCBSZXF1ZXN0cyB3aXRoIHRoZSBHaXRIdWIgQVBJIiwidiI6MiwidCI6W10sInMiOlt7ImtleSI6ImdpdGh1Yi1zZWFyY2gtaXNzdWVzLWFuZC1wdWxsLXJlcXVlc3RzIn1dLCJjIjp7fX0) - Find issues and pull requests by state and keyword. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/actions/search-issues-and-pull-requests/search-issues-and-pull-requests.mjs))
- [Create Branch](https://pipedream.com/new?h=eyJuIjoiQ3JlYXRlIEJyYW5jaCB3aXRoIHRoZSBHaXRIdWIgQVBJIiwidiI6MiwidCI6W10sInMiOlt7ImtleSI6ImdpdGh1Yi1jcmVhdGUtYnJhbmNoIn1dLCJjIjp7fX0) - Create a new branch in a GitHub repo. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/actions/create-branch/create-branch.mjs))
- [Create Gist](https://pipedream.com/new?h=eyJuIjoiQ3JlYXRlIEdpc3Qgd2l0aCB0aGUgR2l0SHViIEFQSSIsInYiOjIsInQiOltdLCJzIjpbeyJrZXkiOiJnaXRodWItY3JlYXRlLWdpc3QifV0sImMiOnt9fQ) - Allows you to add a new gist with one or more files. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/actions/create-gist/create-gist.mjs))
- [Create Issue Comment](https://pipedream.com/new?h=eyJuIjoiQ3JlYXRlIElzc3VlIENvbW1lbnQgd2l0aCB0aGUgR2l0SHViIEFQSSIsInYiOjIsInQiOltdLCJzIjpbeyJrZXkiOiJnaXRodWItY3JlYXRlLWlzc3VlLWNvbW1lbnQifV0sImMiOnt9fQ) - Create a new comment in a issue. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/actions/create-issue-comment/create-issue-comment.mjs))
- [Create or update file contents](https://pipedream.com/new?h=eyJuIjoiQ3JlYXRlIG9yIHVwZGF0ZSBmaWxlIGNvbnRlbnRzIHdpdGggdGhlIEdpdEh1YiBBUEkiLCJ2IjoyLCJ0IjpbXSwicyI6W3sia2V5IjoiZ2l0aHViLWNyZWF0ZS1vci11cGRhdGUtZmlsZS1jb250ZW50cyJ9XSwiYyI6e319) - Create or update a file in a repository. This will replace an existing file. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/actions/create-or-update-file-contents/create-or-update-file-contents.mjs))
- [Create Pull Request](https://pipedream.com/new?h=eyJuIjoiQ3JlYXRlIFB1bGwgUmVxdWVzdCB3aXRoIHRoZSBHaXRIdWIgQVBJIiwidiI6MiwidCI6W10sInMiOlt7ImtleSI6ImdpdGh1Yi1jcmVhdGUtcHVsbC1yZXF1ZXN0In1dLCJjIjp7fX0) - Creates a new pull request for a specified repository. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/actions/create-pull-request/create-pull-request.mjs))
- [Create Repository](https://pipedream.com/new?h=eyJuIjoiQ3JlYXRlIFJlcG9zaXRvcnkgd2l0aCB0aGUgR2l0SHViIEFQSSIsInYiOjIsInQiOltdLCJzIjpbeyJrZXkiOiJnaXRodWItY3JlYXRlLXJlcG9zaXRvcnkifV0sImMiOnt9fQ) - Creates a new repository for the authenticated user. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/actions/create-repository/create-repository.mjs))
- [Get Issue Assignees](https://pipedream.com/new?h=eyJuIjoiR2V0IElzc3VlIEFzc2lnbmVlcyB3aXRoIHRoZSBHaXRIdWIgQVBJIiwidiI6MiwidCI6W10sInMiOlt7ImtleSI6ImdpdGh1Yi1nZXQtaXNzdWUtYXNzaWduZWVzIn1dLCJjIjp7fX0) - Get assignees for an issue in a GitHub repo. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/actions/get-issue-assignees/get-issue-assignees.mjs))
- [Get Repository](https://pipedream.com/new?h=eyJuIjoiR2V0IFJlcG9zaXRvcnkgd2l0aCB0aGUgR2l0SHViIEFQSSIsInYiOjIsInQiOltdLCJzIjpbeyJrZXkiOiJnaXRodWItZ2V0LXJlcG9zaXRvcnkifV0sImMiOnt9fQ) - Get specific repository. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/actions/get-repository/get-repository.mjs))
- [Get Repository Content](https://pipedream.com/new?h=eyJuIjoiR2V0IFJlcG9zaXRvcnkgQ29udGVudCB3aXRoIHRoZSBHaXRIdWIgQVBJIiwidiI6MiwidCI6W10sInMiOlt7ImtleSI6ImdpdGh1Yi1nZXQtcmVwb3NpdG9yeS1jb250ZW50In1dLCJjIjp7fX0) - Get the content of a file or directory in a specific repository. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/actions/get-repository-content/get-repository-content.mjs))
- [Get Reviewers](https://pipedream.com/new?h=eyJuIjoiR2V0IFJldmlld2VycyB3aXRoIHRoZSBHaXRIdWIgQVBJIiwidiI6MiwidCI6W10sInMiOlt7ImtleSI6ImdpdGh1Yi1nZXQtcmV2aWV3ZXJzIn1dLCJjIjp7fX0) - Get reviewers for a PR. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/actions/get-reviewers/get-reviewers.mjs))
- [List Gists for a User](https://pipedream.com/new?h=eyJuIjoiTGlzdCBHaXN0cyBmb3IgYSBVc2VyIHdpdGggdGhlIEdpdEh1YiBBUEkiLCJ2IjoyLCJ0IjpbXSwicyI6W3sia2V5IjoiZ2l0aHViLWxpc3QtZ2lzdHMtZm9yLWEtdXNlciJ9XSwiYyI6e319) - Lists public gists for the specified user. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/actions/list-gists-for-a-user/list-gists-for-a-user.mjs))
- [List Releases](https://pipedream.com/new?h=eyJuIjoiTGlzdCBSZWxlYXNlcyB3aXRoIHRoZSBHaXRIdWIgQVBJIiwidiI6MiwidCI6W10sInMiOlt7ImtleSI6ImdpdGh1Yi1saXN0LXJlbGVhc2VzIn1dLCJjIjp7fX0) - List releases for a repository. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/actions/list-releases/list-releases.mjs))
- [Update Gist](https://pipedream.com/new?h=eyJuIjoiVXBkYXRlIEdpc3Qgd2l0aCB0aGUgR2l0SHViIEFQSSIsInYiOjIsInQiOltdLCJzIjpbeyJrZXkiOiJnaXRodWItdXBkYXRlLWdpc3QifV0sImMiOnt9fQ) - Allows you to update a gist's description and to update, delete, or rename gist files. Files from the previous version of the gist that aren't explicitly changed during an edit are unchanged. At least one of description or files is required. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/actions/update-gist/update-gist.mjs))
- [Update Issue](https://pipedream.com/new?h=eyJuIjoiVXBkYXRlIElzc3VlIHdpdGggdGhlIEdpdEh1YiBBUEkiLCJ2IjoyLCJ0IjpbXSwicyI6W3sia2V5IjoiZ2l0aHViLXVwZGF0ZS1pc3N1ZSJ9XSwiYyI6e319) - Update a new issue in a GitHub repo. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/actions/update-issue/update-issue.mjs))

You can [create your own actions](https://pipedream.com/docs/components/quickstart/nodejs/actions/), which you can re-use across workflows. You can also [publish actions to the entire Pipedream community](https://pipedream.com/docs/components/guidelines/), making them available for anyone to use.

Here's an action that accepts a `name` as input and prints it to the workflow's logs:

```javascript
export default {
  name: "Action Demo",
  description: "This is a demo action",
  key: "action_demo",
  version: "0.0.1",
  type: "action",
  props: {
    name: {
      type: "string",
      label: "Name",
    }
  },
  async run() {
    return `hello ${this.name}!`
  },
}
```

You can find the code for all pre-built actions in [the `components` directory](https://github.com/PipedreamHQ/pipedream/tree/master/components). If you find a bug or want to contribute a feature, [see our contribution guide](https://pipedream.com/docs/components/guidelines/#process).

## Other Popular API Integrations

- [Airtable](https://github.com/PipedreamHQ/pipedream/tree/master/components/airtable) ([explore](https://pipedream.com/apps/airtable))
- [AWS](https://github.com/PipedreamHQ/pipedream/tree/master/components/aws) ([explore](https://pipedream.com/apps/aws))
- [Dropbox](https://github.com/PipedreamHQ/pipedream/tree/master/components/dropbox) ([explore](https://pipedream.com/apps/dropbox))
- [Google Sheets](https://github.com/PipedreamHQ/pipedream/tree/master/components/google-sheets) ([explore](https://pipedream.com/apps/google-sheets))
- [Google Drive](https://github.com/PipedreamHQ/pipedream/tree/master/components/google-drive) ([explore](https://pipedream.com/apps/google-drive))
- [RSS](https://github.com/PipedreamHQ/pipedream/tree/master/components/rss) ([explore](https://pipedream.com/apps/rss))
- [Twitter](https://github.com/PipedreamHQ/pipedream/tree/master/components/twitter) ([explore](https://pipedream.com/apps/twitter))

### Custom code

Most integrations require custom logic. Code is often the best way to express that logic, so Pipedream allows you to run custom code in a workflow using:

<table align="center">
  <tr>
    <td>
      <a href="https://pipedream.com/docs/code/nodejs/">
        <img alt="Node.js" src="https://res.cloudinary.com/pipedreamin/image/upload/v1646761316/docs/icons/icons8-nodejs_aax6wn.svg" width="100">
      </a>
    </td>
    <td>
      <a href="https://pipedream.com/docs/code/python/">
        <img alt="Python" src="https://res.cloudinary.com/pipedreamin/image/upload/v1647356607/docs/icons/python-logo-generic_k3o5w2.svg" width="100">
      </a>
    </td>
  </tr>
  </tr>
    <td>
      <a href="https://pipedream.com/docs/code/go/">
        <img alt="Go" src="https://res.cloudinary.com/pipedreamin/image/upload/v1646763751/docs/icons/Go-Logo_Blue_zhkchv.svg" width="100">
      </a>
    </td>
    <td>
      <a href="https://pipedream.com/docs/code/bash/">
        <img alt="Bash" src="https://res.cloudinary.com/pipedreamin/image/upload/v1647356698/docs/icons/full_colored_dark_1_-svg_vyfnv7.svg" width="100">
      </a>
    </td>
  </tr>
</table>

You can import any package from the languages' package managers by declaring the imports directly in code. Pipedream will parse and download the necessary dependencies.

```javascript
// Node.js
import axios from 'axios'
```

```python
# Python
import pandas as pd
```

```golang
// Go
import (
    "fmt"
    pd "github.com/PipedreamHQ/pipedream-go"
)
```

You can also [connect to any Pipedream connected app in custom code steps](https://pipedream.com/docs/code/nodejs/auth/). For example, you can connect your Slack account and send a message to a channel:

```javascript
import { WebClient } from '@slack/web-api'

export default defineComponent({
  props: {
    // This creates a connection called "slack" that connects a Slack account.
    slack: {
      type: 'app',
      app: 'slack'
    }
  },
  async run({ steps, $ }) {
    const web = new WebClient(this.slack.$auth.oauth_access_token)

    return await web.chat.postMessage({
      text: "Hello, world!",
      channel: "#general",
    })
  }
});
```

### Destinations

[Destinations](https://pipedream.com/docs/destinations/), like actions, abstract the connection, batching, and delivery logic required to send events to services like Amazon S3, or targets like HTTP and email.

For example, sending data to an Amazon S3 bucket is as simple as calling `$send.s3()`:

```javascript
$send.s3({
  bucket: "your-bucket-here",
  prefix: "your-prefix/",
  payload: event.body,
});
```

Pipedream supports the following destinations:

- [Amazon S3](https://docs.pipedream.com/destinations/s3/)
- [Snowflake](https://docs.pipedream.com/destinations/snowflake/)
- [HTTP](https://docs.pipedream.com/destinations/http/)
- [Email](https://docs.pipedream.com/destinations/email/)
- [SSE](https://docs.pipedream.com/destinations/sse/)

## Contributors

Thank you to everyone who has contributed to the Pipedream codebase. We appreciate you!

<a href="https://github.com/PipedreamHQ/pipedream/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=PipedreamHQ/pipedream" />
</a>

## Pricing

Pipedream has a [generous free tier](https://pipedream.com/docs/pricing/#developer-tier). You can run sources and workflows for free within the limits of the free tier. If you hit these limits, you can upgrade to one of our [paid tiers](https://pipedream.com/docs/pricing/).

## Limits

The Pipedream platform imposes some runtime limits on sources and workflows. [Read more about those in our docs](https://pipedream.com/docs/limits/).

## Found a Bug? Have a Feature to suggest?

Before adding an issue, please search the [existing issues](https://github.com/PipedreamHQ/pipedream/issues) or [reach out to our team](https://pipedream.com/support/) to see if a similar request already exists.

If an issue exists, please [add a reaction](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-conversations-on-github) or add a comment detailing your specific use case.

If an issue _doesn't_ yet exist and you need to create one, please [use the issue templates](https://github.com/PipedreamHQ/pipedream/issues/new/choose).

## Security

You can read about our platform security and privacy [here](https://pipedream.com/docs/privacy-and-security/).

If you'd like to report a suspected vulnerability or security issue, or have any questions about the security of the product, please contact our security team at **security@pipedream.com**.

## Troubleshooting

Note: Event Source [New Card in Column](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/sources/new-card-in-column/new-card-in-column.mjs) only supports legacy (classic) projects.

Please [reach out](https://pipedream.com/support/) to the Pipedream team with any technical issues or questions about the GitHub integration. We're happy to help!

# Getting Started

## GitHub Triggers: Webhooks vs. Polling
The GitHub triggers in Pipedream enable you to get notified immediately via a webhook if you have `admin` rights on the repo you're watching. Otherwise you can still poll for updates at a regular interval for any other repo where you might not have `admin` rights.

**Example: New or Updated Issue**
If you are an admin on the repo, this trigger will be configured as a webhook — so any time there is a new or updated issue in the repo, an event will immediately get emitted.
<img src="https://res.cloudinary.com/dpenc2lit/image/upload/v1710954167/Screenshot_2024-03-20_at_9.58.01_AM_s1yych.png" width=600> 

If you do not have `admin` rights on the repo you're watching, you can configure the Pipedream trigger to poll for updates on a regular interval.
<img src="https://res.cloudinary.com/dpenc2lit/image/upload/v1710954167/Screenshot_2024-03-20_at_9.58.39_AM_xu5r2t.png" width=600>

# Example Use Cases

- **Automated Issue Management Workflow**: Trigger a workflow on Pipedream when new GitHub issues are opened. Automatically label them based on content, assign to the correct team member, or prioritize by sending details to a project management tool like Trello or Jira.

- **Code Quality Control Workflow**: Upon each push to a repository, use Pipedream to run the code through automated tests and linters, reporting back the status directly in the commit or pull request. Integrate with Slack to notify the development team about the code quality status or any failed checks.

- **Release Management Workflow**: Automate the process of releasing new versions of software. When a new tag is pushed to GitHub, Pipedream can build the code, run tests, deploy the release to production environments, and notify stakeholders through email or a messaging app like Microsoft Teams.
