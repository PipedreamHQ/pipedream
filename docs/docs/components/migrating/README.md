# Migrating from Legacy Actions

This document is targeted at developers who created actions in Pipedream's UI prior to April 2021. The purpose is to help users migrate legacy actions to the new component model. There is no current timeline for the deprecation of legacy actions, but developers are encouraged to migrate to the new model. 

# Key Changes

There are some important differences between the coding patterns for Pipedream's component model and legacy actions.

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

# Getting Started

If you’re ready to develop your first component action, we suggest starting with our Quickstart Guide and reviewing both our Component API reference and actions published to Pipedream’s Github repo.