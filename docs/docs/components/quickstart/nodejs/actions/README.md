# Quickstart: Action Development

After completing this quickstart, you will understand the basic patterns to:

- Develop actions using Pipedream's component model
- Publish private actions to Pipedream and use them in workflows
- Use props to capture user input
- Publish an update to an action and update a workflow to use the latest version
- Use npm packages in components
- Use Pipedream managed auth for a 3rd party app in a component

We recommend that you execute the examples in order — each one builds on the concepts and practices of earlier examples.

- [Prerequisites](#prerequisites)
- [Examples](#examples)
  - [hello world!](#hello-world)
  - [hello [name]!](#hello-name)
  - [Use an npm Package](#use-an-npm-package)
  - [Use Managed Auth](#use-managed-auth-to-pull-data-from-github-10-mins)
- [What's Next?](#whats-next)

# Prerequisites

**Step 1.** Create a free account at [https://pipedream.com](https://pipedream.com). Just sign in with your Google or Github account.

**Step 2.** [Download and install the Pipedream CLI](https://docs.pipedream.com/cli/install/).

**Step 3.** Once the CLI is installed, [link your Pipedream account to the CLI](https://docs.pipedream.com/cli/login/#existing-pipedream-account):

```bash
pd login
```

See the [CLI reference](https://docs.pipedream.com/cli/reference/) for detailed usage and examples beyond those covered below.

# Quickstart Examples

**hello world! (~5 minutes)**

- Develop a `hello world!` action
- Publish it (private to your account) using the Pipedream CLI
- Add it to a workflow and run

**hello [name]! (~5 minutes)**

- Use a simple string prop to capture user input
- Publish a new version of an action 
- Update a action in an existing workflow

**Use an npm Package (~5 mins)**

- Require the `axios` npm package
- Make a request to the Star Wars REST API
- Reference the `name` field of the payload returned by the API in the return value

**Use Managed Auth (~10 mins)**

- Use Pipedream managed OAuth with Github's API (using the `octokit` npm package) 
- Retrieve details for a repo and return them from the action

## hello world!

The following code represents a simple component that can be published as an action. When used in a workflow, it will export `hello world!` as the return value for the step.

```javascript
module.exports = {
  name: "Action Demo",
  description: "This is a demo action",
  key: "action_demo",
  version: "0.0.1",
  type: "action",
  async run() {
    return `hello world!`
  },
}
```

To use it, save the code to a local `.js` file (e.g., `action.js`) and run the following CLI command:

```
pd publish action.js
```

The CLI will publish the component as an action in your account with the key `action_demo`. **The key must be unique across all components in your account (sources and actions). If it's not unique, the component with the matching key will be updated.**

The CLI should output similar to this:

```
sc_v4iaWB  Action Demo                             0.0.1    just now             action_demo
```

To test the action:

1. Open Pipedream in your browser 
2. Create a new workflow with a cron trigger (to simplify testing)
3. Click the **+** button to add a step to your workflow
4. You should see an option to select **My Actions** (the option only appears after you publish an action to your account; if you don't see it, confirm the publish step was successful). Click on **My Actions** and then **Action Demo** to add it to your workflow.
5. Deploy your workflow
6. Click **RUN NOW** to execute your workflow and action

You should see `hello world!` returned as the value for `steps.action_demo.$return_value`. 

Keep the browser tab open. We'll return to this workflow in the rest of the examples.

## hello [name]!

Next, we'll update the same component to capture user input and go through the action update process. We'll include snippets for each instruction and the updated code for the entire component below.

First, add a string prop called `name` to the component.

```java
props: {
	name: "string",
},
```

Next, update the `run()` function to reference `this.name` in the return value.

```javascript
async run() {
	return `hello ${this.name}!`
},
```

Finally, update the version to `0.0.2`. If you fail to update the version, the CLI will throw an error.

```javascript
version: "0.0.2",
```

Following is the updated component code.

```java
module.exports = {
  name: "Action Demo",
  description: "This is a demo action",
  key: "action_demo",
  version: "0.0.2",
  type: "action",
  props: {
    name: "string",
  },
  async run() {
    return `hello ${this.name}!`
  },
}
```

Save the file and run the `pd publish` command again to update the action in your account.

```
pd publish action.js
```

The CLI will update the component with the key `action_demo` in your account. You should see something like this:

```
sc_Egip04  Action Demo                             0.0.2    just now             action_demo
```

Next, let's update and run the action in the workflow from the previous example. 

1. Hover over the action — you will see the following icon at the top right 
   ![image-20210410223659322](image-20210410223659322.png)

   Click that icon to update the action in the workflow to the latest version. 

2. Save the workflow to update the configuration form
3. Enter a value for the `Name` input (e.g., `foo`)
4. Deploy the workflow and click **RUN NOW**

You should see `hello foo!` (or the value you entered for `Name`) as the value returned by the step.

## Use an npm Package

Next, we'll update the component to get data from the Star Wars API using the `axios` npm package. In this example, we'll retrieve a name via the API so we can remove the `name` prop. Next, we'll update the 

> **Note:** To use most npm packages on Pipedream, just require them — there is no `package.json` or `npm install` required.

To use the `axios` package, just require it.

```javascript
const axios = require("axios")
```

Then, update the `run()` method to:

- Make a request to the following endpoing for the Star Wars API: `https://swapi.dev/api/people/1/`
- Reference the `name` field of the payload returned by the API

```javascript
const response = await axios.get("https://swapi.dev/api/people/1/")
return `hello ${response.data.name}!`
```

Finally, update the version to `0.0.3`. If you fail to update the version, the CLI will throw an error.

```javascript
version: "0.0.3",
```

Following is the updated component code.

```javascript
const axios = require("axios")

module.exports = {
  name: "Action Demo",
  description: "This is a demo action",
  key: "action_demo",
  version: "0.0.3",
  type: "action",
  async run() {
    const response = await axios.get("https://swapi.dev/api/people/1/")
    return `hello ${response.data.name}!`
  },
}
```

Save the file and run the `pd publish` command again to update the action in your account.

```
pd publish action.js
```

The CLI will update the component with the key `action_demo` in your account. You should see something like this:

```
sc_ZriKEn  Action Demo                             0.0.3    1 second ago         action_demo
```

Follow the steps in the previous example to update and run the action in your workflow. You should see `hello Luke Skywalker!` as the return value for the step.

## Use Managed Auth

For the last example, we'll use Pipedream managed auth to retrieve and emit data from the Github API (which uses OAuth for authentication). First, remove `axios` and clear the `run()` function from the last example. Your code should look like this:

```javascript
module.exports = {
  name: "Action Demo",
  description: "This is a demo action",
  key: "action_demo",
  version: "0.0.3",
  type: "action",
  async run() {
    
  },
}
```

Next, let's require Github's `octokit` npm package at the top of the file:

```javascript
const { Octokit } = require('@octokit/rest')

module.exports = {
  name: "Action Demo",
  description: "This is a demo action",
  key: "action_demo",
  version: "0.0.3",
  type: "action",
  async run() {
  	
  },
}
```

Then add an **app prop**, which will enable us to use Pipedream managed auth with this component. For this example, we'll add Github:

```javascript
const { Octokit } = require('@octokit/rest')

module.exports = {
  name: "Action Demo",
  description: "This is a demo action",
  key: "action_demo",
  version: "0.0.3",
  type: "action",
  props: {
    github: {
      type: "app",
      app: "github",
    }
  },
  async run() {
  	
  },
}
```

> **Note:** The value for the `app` property is the name slug for the app in Pipedream. This is not currently discoverable, but it will be in the near future on app pages in the [Pipedream Marketplace](https://pipedream.com/explore). For the time being, if you want to know how to reference an app, please reach out on our public Slack.

Finally, we'll update the `run()` method to get a repo from Github and return it. For this example, we'll pass static values to get the `pipedreamhq/pipedream` repo. Notice that we're passing the `oauth_access_token` in the authorization header by referencing the app prop `this.github.$auth.oauth_access_token`. You can discover the auth tokens provided in the **Authentication Strategy** section for each app in the [Pipedream Marketplace](https://pipedream.com/explore). 

```javascript
const { Octokit } = require('@octokit/rest')

module.exports = {
  name: "Action Demo",
  description: "This is a demo action",
  key: "action_demo",
  version: "0.0.3",
  type: "action",
  props: {
    github: {
      type: "app",
      app: "github",
    }
  },
  async run() {
  	const octokit = new Octokit({
      auth: this.github.$auth.oauth_access_token
    })
    
    return (await octokit.repos.get({
      owner: `pipedreamhq`,
      repo: `pipedream`,
    })).data
  },
}
```

Finally, update the version to `0.0.4`. If you fail to update the version, the CLI will throw an error.

```javascript
const { Octokit } = require('@octokit/rest')

module.exports = {
  name: "Action Demo",
  description: "This is a demo action",
  key: "action_demo",
  version: "0.0.4",
  type: "action",
  props: {
    github: {
      type: "app",
      app: "github",
    }
  },
  async run() {
  	const octokit = new Octokit({
      auth: this.github.$auth.oauth_access_token
    })
    
    return (await octokit.repos.get({
      owner: `pipedreamhq`,
      repo: `pipedream`,
    })).data
  },
}
```

Save the file and run the `pd publish` command again to update the action in your account.

```
pd publish action.js
```

The CLI will update the component with the key `action_demo` in your account. You should see something like this:

```
sc_k3ia53  Action Demo                            0.0.4    just now             action_demo
```

Follow the steps in the previous example to update the action in your workflow (you may need to save your workflow after refreshing the action). You should now see a prompt to connect your Github account to the step:
![image-20210411114410883](image-20210411114410883.png)

Select an existing account or connect a new one, and then deploy your workflow and click **RUN NOW**. You should see the results returned by the action:

![image-20210411114522610](image-20210411114522610.png)

# What's Next?

You're ready to start authoring and publishing actions on Pipedream! You can also check out the [detailed component reference](COMPONENT-API.md) at any time!

If you have any questions or feedback, please [reach out](https://pipedream.com/community)!

