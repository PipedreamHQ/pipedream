# Migrating from Legacy Actions

[TOC]

## Overview
This document is targeted at developers who created actions in Pipedream's UI prior to April 2021. The purpose is to help users migrate legacy actions to the new component model. There is no current timeline for the deprecation of legacy actions, but developers are encouraged to migrate to the new model. 

## Key Changes

Following are the key changes to the development patterns for creating actions using Pipedream's component and legacy models.

**User Input**

Legacy actions supported user input via `params`. `params` were used in code and the definition was derived. 

The component model does not support `params`. You need to migrate `params` references to `props`. `props` must be explicitlly declared and defined prior to using them in code.

**Managed Auth**

The model for linking an app to legacy actions as well as the syntax for referencing credentials is different with Pipedream components. Apps were linked to steps in Pipedream's UI, and credentials were referenced via the `auths` object.

The component model operates differently. Apps are defined as `props` and credentials are referenced as properties of the app. For example, to use managed auth for Github, the component `props` must contain a key (`gh` in this example) with an object with an app definition for the value:

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
When you publish a new version of an action, you can update action instances with a click (updating legacy actions in workflows requires action steps to be deleted, re-added and re-configured).Getting Started

**Support for Async Options**
Async options allow users to select programmatically generated prop values (e.g., display a drop-down menu based on a real-time API response).

**Simplified Discovery**
Actions you publish are now grouped under **My Actions** when adding a step to a workflow. NOTE: this option will appear in the workflow builder *after* you publish your first action.

## Getting Started

If you’re ready to develop your first component action, we suggest starting with our Quickstart Guide and reviewing both our Component API reference and actions published to Pipedream’s Github repo.

## Migration Example

### Legacy Code Example

Let's walk through an example. Following is code that retrieves information about a Github repo (this code assumes you've linked the Github app to your code step):

```javascript
const axios = require("axios")

const config = {
  url: `https://api.github.com/repos/${params.owner}/${params.repo}`,
  headers: {
    Authorization: `Bearer ${auths.github.oauth_access_token}`,
  }
}

return (await axios(config)).data
```

And following is the associated JSON schema that defines metadata for the `params` inputs:

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

### Converting into a Basic Component-Based Action

To convert the code above into a component-based action, we need to:

1. Link the Github app to the component using `props` so we can use Pipedream managed auth
2. Define `props` for `owner` and `repo` so we can capture user input. The definition includes the the `type` and `description`. Additionally, `props` are required by default, so that doesn't need to be declared (set `optional` to `true` for optional `props`). This metadata was previously captured in the JSON schema.
3. Replace references to `params` in the `run()` method. `props` are referenced via `this`. 
4. Update the reference to the Github OAuth token from `auths.github.oauth_access_token` to `this.github.$auth.oauth_access_token` (note: `github` in this context references the name of the prop, not the name of the app; if the prop was named `gh` then the auth would be referenced via `this.gh.$auth.oauth_access_token`).

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

