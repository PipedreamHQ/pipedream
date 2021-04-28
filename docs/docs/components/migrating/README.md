# Migrating from Legacy Actions to Components

- [Overview](#overview)
- [Key Changes](#key-changes)
- [Getting Started](#getting-started)
- [Migration Example](#migration-example)
  * [Legacy Code Example](#legacy-code-example)
  * [Converting into a Basic Component-Based Action](#converting-into-a-basic-component-based-action)
  * [Advanced: Using Async Options](#advanced--using-async-options)
  * [Publishing and Using Actions](#publishing-and-using-actions)

## Overview
This document is for developers who previously created actions in [Pipedream's UI](https://pipedream.com/actions). The purpose is to help users migrate exiting actions to Pipedream's new [component model](/components). There is currently no deprecation timeline for actions developed in the UI, but developers are encouraged to migrate to the new model. 

## Key Changes

Following are the key changes when migrating from developing actions in Pipedream's UI to components:

**`props` replace `params`** 

The component model does not support `params`. You need to migrate `params` references to `props`. Unlike `params`, `props` must be explicitlly declared and defined prior to using them in code (in the old model, an input form was automatically generated when  `params` were used in code -- `params` were not explicitly declared).

**Managed Auth**

The model for linking an app to legacy actions as well as the syntax for referencing credentials is different with Pipedream components. In the old model, apps were linked to steps in Pipedream's workflow builder UI, and credentials were referenced via the `auths` object.

When using the component model, apps are defined as `props` and credentials are referenced as properties of the app. For example, to use managed auth for Github, the component `props` must contain a key (`gh` in the example below) with an app definition for the value (the app definition is an object):

```javascript
gh: {
  type: "app",
  app: "github"
}
```

The component's `run()` method can then reference the credentials for Github via `this.gh.$auth.oauth_access_token`.

**Develop locally and host on Github**
Actions are no longer developed in Pipedream's UI. Develop actions locally using your preferred editor, publish to Pipedream via CLI and maintain the code in your own Github repo.

**Update with a click**
When you publish a new version of an action, you can update actions used in workflows with a click (updating legacy actions in workflows requires action steps to be deleted, re-added and re-configured).

**Support for Async Options**
Async options allow action authos to render a paginated drop down menu allowing users to select from vaues that are programatically generated. The most common use case is to populate the drop down based on results of an API request (e.g., to list Google Sheets in a user's drive).

**Simplified Discovery**
Actions you publish are now grouped under **My Actions** when adding a step to a workflow. NOTE: this option will appear in the workflow builder *after* you publish your first action.

## Getting Started

If you’re ready to develop your first action using Pipedream's component model, we suggest starting with our [quickstart guide](/components/quickstart/nodejs/actions/). Then review both our [component API reference](/components/api) and [actions published to Pipedream’s Github repo](https://github.com/pipedreamhq/pipedream/compnents).

## Migration Example

Let's walk through an example that migrates code for a legacy action to a Pipedream component. 

### Legacy Code Example

Following is the code for the legacy action to get a Github repo (Github was linked to this action via Pipedream's UI):

```javascript
const config = {
  url: `https://api.github.com/repos/${params.owner}/${params.repo}`,
  headers: {
    Authorization: `Bearer ${auths.github.oauth_access_token}`,
  }
}
return await require("@pipedreamhq/platform").axios(this, config)
```

Also, following is the associated JSON schema that defines metadata for the `params` inputs:

```json
{
  "type": "object",
  "properties": {
    "owner": {
      "type": "string",
      "description": "Name of repository owner."
    },
    "repo": {
      "type": "string",
      "description": "Name of repository."
    }
  },
  "required": [
    "owner",
    "repo"
  ]
}
```

### Converting to the Component Model

To convert the code above to the component model, we need to:

1. Link the Github app to the component using `props` so we can use Pipedream managed auth
2. Define `props` for `owner` and `repo` so we can capture user input. The definition for each prop includes the `type` and `description` metadata. Additionally, `props` are required by default, so that property doesn't need to be declared (set `optional` to `true` for optional `props`). This metadata was previously captured in the JSON schema.
3. Replace references to `params` in the `run()` method. `props` are referenced via `this`. 
4. Update the reference to the Github OAuth token from `auths.github.oauth_access_token` to `this.github.$auth.oauth_access_token` (note: `github` in this context references the name of the prop, not the name of the app; if the prop was named `gh` then the auth would be referenced via `this.gh.$auth.oauth_access_token`).
5. Replace the `@pipedreamhq/platform`  npm package with the standard `axios` package

```javascript
const axios = require("axios")

module.exports = {
  type: "action",
  name: "Get Repo Example",
  key: "github_get-repo-example",
  version: "0.0.1",
  props: {
  	github: {
  		type: "app",
  		app: "github",
  	},
    owner: {
    	type: "string",
    	description: "Name of repository owner.",
  	},
    repo: {
      type: "string",
      description: "Name of repository.",
    }
  },
  async run() {
    const config = {
      url: `https://api.github.com/repos/${this.owner}/${this.repo}`,
      headers: {
        Authorization: `Bearer ${this.github.$auth.oauth_access_token}`,
      }
    }

    return (await axios(config)).data
  },
}
```

### Advanced: Using Async Options

Next, let's take the example one step further. Instead of asking users to enter the owner and repo name, let's use `async options` so users can select the repo from a drow-down menu. To do that, well:

1. Remove the `owner` and `repo` props
2. Add a `repoFullName` prop that makes a request to `https://api.github.com/user/repos` to retrieve a list of (paginated) repos
3.  Update the `run()` function to use the `repoFullName` prop 

```javascript
const axios = require("axios")

module.exports = {
  type: "action",
  name: "Get Repo Example",
  key: "github_get-repo-example",
  version: "0.0.2",
  props: {
  	github: {
  		type: "app",
  		app: "github",
  	},
    repoFullName: {
      type: "string",
      label: "Repo",
      async options(page) {
        const repos = (await axios({
          url: "https://api.github.com/user/repos",
          params: {
            page,
            per_page: 100,
          },
          headers: {
            Authorization: `Bearer ${this.github.$auth.oauth_access_token}`,
          }
        })).data
        return repos.map((repo) => repo.full_name);
      },
    },
  },
  async run() {
    const config = {
      url: `https://api.github.com/repos/${this.repoFullName}`,
      headers: {
        Authorization: `Bearer ${this.github.$auth.oauth_access_token}`,
      }
    }
    return (await axios(config)).data
  },
}
```

### Publishing and Using Actions

In the old model, actions were published via Pipedream's UI. To learn how to publish component-based actions using Pipedream's CLI and use them in workflows, review our [quickstart guide](/components/quickstart/nodejs/actions/). To contribute actions to the Pipedream registry, review our [guidelines](/components/guidelines/).