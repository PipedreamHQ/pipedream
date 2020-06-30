# Github API Integrations
### Integrate Github APIs and thousands of applications.  Free for developers.
=============================

Pipedream is a serverless integration and compute platform, and fully supports Github APIs.

We provide a free, hosted platform that makes it easy to connect apps and develop, execute and maintain event-driven workflows. The platform has over 300 fully integrated applications with managed authentication and support for over 1M npm packages.

**Key Features**:
* [Github API Event Sources](#github-api-event-sources) - Open source [components](https://github.com/PipedreamHQ/pipedream/tree/master/components) that emit events Github
* [Github API Actions](#github-api-actions) - Pre-built code steps that you can use in a workflow to perform common operations
* [Workflows](#workflows) - A sequence of linear steps - just Node.js code - triggered by a Github event
* Serverless - No server or cloud resources to manage
* [Free](#pricing) - No fees for individual developers (see [limits](https://docs.pipedream.com/limits/))

<a href="http://tod.ly/3fMdryW"><img src="https://i.ibb.co/m0bBsSL/deploy-clean.png" height="35"></a>

## Github API Event Sources

- [Custom Events](https://pipedream.com/sources/new?app=github) - Build your own event source using one or multiple events ([code](https://github.com/PipedreamHQ/pipedream/tree/master/components/github))
 - [New Issue](https://pipedream.com/sources/new?app=github) - Triggered when a new issue is created. ([code](https://github.com/PipedreamHQ/pipedream/tree/master/components/github))
 - [New Mention](https://pipedream.com/sources/new?app=github) - Triggers when your username is mentioned in a Commit, Comment, Issue or Pull Request. ([code](https://github.com/PipedreamHQ/pipedream/tree/master/components/github))
 - [New Commit Comment](https://pipedream.com/sources/new?app=github) - Triggered when a new comment on a commit is created. ([code](https://github.com/PipedreamHQ/pipedream/tree/master/components/github))
 - [New Branch](https://pipedream.com/sources/new?app=github) - Triggered when a new branch is created. ([code](https://github.com/PipedreamHQ/pipedream/tree/master/components/github))
 - [New Collaborator](https://pipedream.com/sources/new?app=github) - Triggered when you add a new collaborator. ([code](https://github.com/PipedreamHQ/pipedream/tree/master/components/github))
 - [New Review Request](https://pipedream.com/sources/new?app=github) - Triggered when a review is requested from you or a specified user. ([code](https://github.com/PipedreamHQ/pipedream/tree/master/components/github))
 - [New Gist](https://pipedream.com/sources/new?app=github) - Triggered when you add/star a gist (public or private). ([code](https://github.com/PipedreamHQ/pipedream/tree/master/components/github))
 - [New Repository](https://pipedream.com/sources/new?app=github) - Triggered when a new repository is created. ([code](https://github.com/PipedreamHQ/pipedream/tree/master/components/github))
 - [New Milestone](https://pipedream.com/sources/new?app=github) - Triggered when a new milestone is created. ([code](https://github.com/PipedreamHQ/pipedream/tree/master/components/github))
 - [New Global Event](https://pipedream.com/sources/new?app=github) - Triggered when anything happens from or to you, on any repo. ([code](https://github.com/PipedreamHQ/pipedream/tree/master/components/github))
 - [New Pull Request](https://pipedream.com/sources/new?app=github) - Triggered when a new pull request is created. ([code](https://github.com/PipedreamHQ/pipedream/tree/master/components/github))
 - [New Organization](https://pipedream.com/sources/new?app=github) - Triggered when a new organization is created. ([code](https://github.com/PipedreamHQ/pipedream/tree/master/components/github))
 - [New Release](https://pipedream.com/sources/new?app=github) - Triggered when a new release is added. ([code](https://github.com/PipedreamHQ/pipedream/tree/master/components/github))
 - [New Team](https://pipedream.com/sources/new?app=github) - Triggered when you are added to a team ([code](https://github.com/PipedreamHQ/pipedream/tree/master/components/github))
 - [New Label](https://pipedream.com/sources/new?app=github) - Triggered when a new label is created. ([code](https://github.com/PipedreamHQ/pipedream/tree/master/components/github))
 - [New Notification](https://pipedream.com/sources/new?app=github) - Triggered when a new notification is created. ([code](https://github.com/PipedreamHQ/pipedream/tree/master/components/github))
 - [New Watcher](https://pipedream.com/sources/new?app=github) - Triggered when a new watcher is added to a repo. ([code](https://github.com/PipedreamHQ/pipedream/tree/master/components/github))
 - [New Repo Event](https://pipedream.com/sources/new?app=github) - Triggered when anything happens on a repo. ([code](https://github.com/PipedreamHQ/pipedream/tree/master/components/github))
 - [New Commit](https://pipedream.com/sources/new?app=github) - Triggered when a new commit is created. Select your organization, repo and branch. ([code](https://github.com/PipedreamHQ/pipedream/tree/master/components/github)) 
  
Event sources can also be deployed via the [Pipedream CLI](https://docs.pipedream.com/cli/reference/):

```bash
curl https://cli.pipedream.com/install | sh
```

Once installed, you can deploy an event source by running:

```bash
pd deploy   # prompts you to select a component and pass required options
```

## Github API Actions

 - [Create Fork](https://pipedream.com/admin/actions/a_m8iXrd/edit) - Creates a fork given a repository for the authenticated user.
 - [Create Gist](https://pipedream.com/admin/actions/a_Nqi06R/edit) - Creates a new gist with one or more files.
 - [Create Git Blob](https://pipedream.com/admin/actions/a_2wim0x/edit) - Creates a Git blob object.
 - [Create Git Commit](https://pipedream.com/admin/actions/a_74iEgG/edit) - Creates a new Git commit object.
 - [Create Issue Comment](https://pipedream.com/admin/actions/a_a4iKxq/edit) - Creates a comment on an issue.
 - [Create Pull Request](https://pipedream.com/admin/actions/a_PNiwOa/edit) - Creates a pull requests in a repository.
 - [Create Repo Issue](https://pipedream.com/admin/actions/a_Vpi8z8/edit) - Creates an issue in a repository.
 - [Create Repository](https://pipedream.com/admin/actions/a_B0izJ7/edit) - Creates a repository in an organization.
 - [Create Tag](https://pipedream.com/admin/actions/a_YEiPo0/edit) - Creates a tag on a commit, tree, or blob.
 - [Follow a user](https://pipedream.com/admin/actions/a_G1iev0/edit) - Follow a user
 - [Get Auth User repo](https://pipedream.com/admin/actions/a_vgi8R0/edit) - Gets repositories that the authenticated user has explicit access permission.
 - [Get Commit](https://pipedream.com/admin/actions/a_EVioNG/edit) - Gets a commit in a repository.
 - [Get Git Commit](https://pipedream.com/admin/actions/a_Mdi8wj/edit) - Gets a got commit object.
 - [Get Issue Labels](https://pipedream.com/admin/actions/a_1WiqnE/edit) - Gets the labels on an issue.
 - [Get Org Repos](https://pipedream.com/admin/actions/a_jQiB0L/edit) - Gets an organization's repositories.
 - [Get Pull Request](https://pipedream.com/admin/actions/a_3Li12M/edit) - Gets details of a pull request by providing its number.
 - [Get Pull Request Commits](https://pipedream.com/admin/actions/a_eli5n0/edit) - Gets a maximum of 250 commits for a pull request. To receive a complete commit list for pull requests with more than 250 commits, use the Commit List API.
 - [Get Pull Request Merged State](https://pipedream.com/admin/actions/a_WYieB5/edit) - Get if a pull request has been merged.
 - [Get Repo](https://pipedream.com/admin/actions/a_Q3iwK3/edit) - Gets a repository's details.
 - [Get Repo Branch](https://pipedream.com/admin/actions/a_oVi31V/edit) - Gets a branch given its repository.
 - [Get Repo Branches](https://pipedream.com/admin/actions/a_8KiVaX/edit) - Gets a repository's branches.
 - [Get Repo Forks](https://pipedream.com/admin/actions/a_67ijXr/edit) - Gets forks of a repository.
 - [Get Repo Issues](https://pipedream.com/admin/actions/a_OOiaEV/edit) - Gets issues in a repository.
 - [Get Repo Stargazers](https://pipedream.com/admin/actions/a_0Mi8aM/edit) - Gets a repository's stargazers
 - [Get Repo Tags](https://pipedream.com/admin/actions/a_Jmi8V5/edit) - Gets a repository's tags.
 - [Get User Emails](https://pipedream.com/admin/actions/a_rJiLvX/edit) - Gets all email addresses from authenticated user, and specifies which one is visible to the public.
 - [Get User Followers](https://pipedream.com/admin/actions/a_2wim6x/edit) - Gets the authenticated user's followers.
 - [Get User Repo](https://pipedream.com/admin/actions/a_4riogQ/edit) - Gets public repositories for the specified user.
 - [Get User Teams](https://pipedream.com/admin/actions/a_74iE0G/edit) - Gets all the teams across all of the organizations to which the authenticated user belongs.
 - [List Auth User Repos](https://pipedream.com/admin/actions/a_2winpM/edit) - Lists repositories that the authenticated user has explicit permission to access.
 - [List commits on a repository](https://pipedream.com/admin/actions/a_dvikaP/edit) - List commits on a repository.
 - [List issues](https://pipedream.com/admin/actions/a_jQiBk5/edit) - List all issues assigned to the authenticated user across all visible repositories including owned repositories, member repositories, and organization repositories.
 - [Render markdown](https://pipedream.com/admin/actions/a_q1ioPJ/edit) - Renders an arbitrary Markdown document into HTML
 - [Search Code](https://pipedream.com/admin/actions/a_Lgijvx/edit) - Searches file contents via various criteria.
 - [Search Issues or Pull Requests](https://pipedream.com/admin/actions/a_wdijOP/edit) - Searches for issues or pull requests by state and keyword.
 - [Search Repositories](https://pipedream.com/admin/actions/a_rJiLmX/edit) - Searches repositories via various criteria.
 - [Star User Repo](https://pipedream.com/admin/actions/a_l0iLYA/edit) - Marks an authed user's repo as starred.
 - [Update Pull Request](https://pipedream.com/admin/actions/a_G1iBQ4/edit) - Updates details of a pull request by providing its number. 

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
* [Github](https://github.com/PipedreamHQ/pipedream/tree/master/components/github) ([deploy](https://pipedream.com/sources/new?app=github))
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
