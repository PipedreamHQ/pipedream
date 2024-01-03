# Github Sync

When Github Syncing is enabled on your project, Pipedream will serialize your workflows and synchronize changes to a GitHub repo.

Capabilities include:

- Bi-directional GitHub sync (push and pull changes)
- Edit in development branches
- Track commit and merge history
- Link users to commits
- Merge from Pipedream or create PRs and merge from GitHub
- Edit in Pipedream or use a local editor and synchronize via GitHub (e.g., edit code, find and replace across multiple steps or workflows)
- Organize workflows into projects with support for nested folders

::: tip

Follow our [quickstart guide](/quickstart/github-sync/) to start building projects on Pipedream using GitHub Sync.

:::

## Getting Started

### Create a new project and enable GitHub Sync

Projects are a new concept we are introducing to Pipedream. A project may contain one or more workflows and may be further organized using nested folders. Each project may be synchronized to a single GitHub repo.

- Go to `https://pipedream.com/projects`
- Create a new project
- Enter a project name and check the box to **Configure GitHub Sync**
  - To use **OAuth**
    - Select a connected account, GitHub scope and repo name
    - Pipedream will automatically create a new, empty repo in GitHub
    - ![Enabling Github on a Pipedream project](https://pipedream.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F6b546c6b-2f90-4ec4-9188-320c01576259%2FUntitled.png?id=5db64a5f-e762-431e-bfb7-cdd495ad458c&table=block&spaceId=6e16aa4c-a31f-4db8-a947-0d80bcdcf984&width=860&userId=&cache=v2)
  - To use **Deploy Keys**
    - Create a new repo in GitHub
    - Follow the instructions to configure the deploy key
    - Test your setup and create a new project
    - ![Enabling Github sync with a Deploy Key](https://pipedream.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F6be64329-bb8b-43eb-a278-a11ad93113c0%2FUntitled.png?id=37f9afd8-ba14-431b-bd40-1846421440b6&table=block&spaceId=6e16aa4c-a31f-4db8-a947-0d80bcdcf984&width=860&userId=&cache=v2)

### Create a branch to edit a project

::: tip Branches are required to make changes

All changes to resources in a project must be made in a development branch.

Examples of changes include creating, editing, deleting, enabling, disabling and renaming workflows. This also includes changing workflow settings like concurrency, VPC assignment and auto-retries.

:::

To edit a git-backed project you must create a development branch by clicking **Edit > Create Branch**

![Creating a new git backed development branch in a workflow](https://pipedream.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fcf1e386b-7674-4843-8709-f1d5eef8ef00%2FUntitled.png?id=3af32b86-6ca2-4051-98cc-de31940eb609&table=block&spaceId=6e16aa4c-a31f-4db8-a947-0d80bcdcf984&width=2000&userId=&cache=v2)

Next, name the branch and click **Create**:

![Enter your desired branch name, and click create to create the branch](https://pipedream.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F5d404d86-3f35-4db8-a2e8-e8d7bdb3e2c0%2FUntitled.png?id=33ebf62f-cde3-43fb-a76b-5c869338226f&table=block&spaceId=6e16aa4c-a31f-4db8-a947-0d80bcdcf984&width=2000&userId=&cache=v2)

To exit development mode without merging to production, click **Exit Development Mode**:

![Exiting the branch without committing the changes](https://pipedream.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F7e72331c-54b8-453a-ae47-36f4b2355fac%2FUntitled.png?id=a55ea908-d904-4218-bfd3-72e568fee6ea&table=block&spaceId=6e16aa4c-a31f-4db8-a947-0d80bcdcf984&width=2000&userId=&cache=v2)

Your changes will be saved to the branch, if you choose to revisit them later.

### Merge changes to production

Once you've committed your changes, you can deploy your changes by merging them into the `production` branch through the Pipedream UI or GitHub.

When you merge a Git-backed project to production, all modified resources in the project will be deployed. Multiple workflows may be deployed, modified, or deleted in production through a single merge action.

#### Merge via the Pipedream UI

To merge changes to production, click on **Merge to production:**

![Click on the Merge to production button in the top right of the UI to merge the changes](https://pipedream.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F7ffe8211-90de-4512-824a-f3cc1b5a9382%2FUntitled.png?id=0043c13f-ade3-4e0e-b9ae-a98b9f293885&table=block&spaceId=6e16aa4c-a31f-4db8-a947-0d80bcdcf984&width=2000&userId=&cache=v2)

Pipedream will present a diff between the development branch and the `production`. Validate your changes and click **Merge to production** to complete the merge:

![In the confirmation modal, click Merge to production to confirm the changes](https://pipedream.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fac27c067-f948-424c-9d6e-6360a759730c%2FUntitled.png?id=19f8d51c-82fb-47d6-a183-b84e2173b72d&table=block&spaceId=6e16aa4c-a31f-4db8-a947-0d80bcdcf984&width=2000&userId=&cache=v2)

#### Create a Pull Request in Github

To create a pull request in GitHub, either choose Open GitHub pull request from the git-actions menu in Pipedream or in GitHub:

  <img src="https://pipedream.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F2fe3a718-2558-47de-aab4-818801c5a344%2FUntitled.png?id=55bb9040-28fa-4af2-833c-854eb5733d99&table=block&spaceId=6e16aa4c-a31f-4db8-a947-0d80bcdcf984&width=2000&userId=&cache=v2" alt="Opening a PR request in Pipedream" />

You can also review and merge changes directly from GitHub using the standard pull request process.

::: warning Pull request reviews cannot be required

PR reviews cannot be required. That feature is on the roadmap for the Business tier.

:::

### Commit changes

To commit changes without merging to production, select **Commit Changes** from the Git Actions menu:

![Select commit changes from the dropdown menu to make a commit](https://pipedream.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F2523c3fb-d832-4e99-b5cc-5c3b7275c9fe%2FUntitled.png?id=9f871c2d-12f4-4484-a76f-b0d83c4d8ee9&table=block&spaceId=6e16aa4c-a31f-4db8-a947-0d80bcdcf984&width=2000&userId=&cache=v2)

You can review the diff and enter a commit message:

![Preview your changes and approve them with a commit message](https://pipedream.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F01f0b4f8-36d6-43a8-8568-99183a7a1d4c%2FUntitled.png?id=77f5b85a-c14d-47aa-8cbe-2e3d5ea64786&table=block&spaceId=6e16aa4c-a31f-4db8-a947-0d80bcdcf984&width=2000&userId=&cache=v2)

### Pull changes and resolve conflicts

If remote changes are detected, you'll be prompted to pull the changes:

![Click the Pull <branch name> to pull in the latest changes to your current branch](https://pipedream.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fac13c163-7816-4e67-bb4a-ccbfb97471c4%2FUntitled.png?id=434ad559-bf3c-4e9c-96a3-c784122793a9&table=block&spaceId=6e16aa4c-a31f-4db8-a947-0d80bcdcf984&width=2000&userId=&cache=v2)

Pipedream will attempt to automatically merge changes. If there are conflicts, you will be prompted to manually resolve it:

![Example of a commit that requires manual resolution to continue with the commit](https://pipedream.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F7849edd0-ee5f-47e9-9a23-b245435faf2b%2FUntitled.png?id=35308854-6572-4575-8fef-6531986fdb7f&table=block&spaceId=6e16aa4c-a31f-4db8-a947-0d80bcdcf984&width=2000&userId=&cache=v2)

### Move existing workflows to projects

::: warning Not available for v1 workflows

Legacy (v1) workflows are not supported in projects. [Follow this guide to migrate your v1 workflows to v2 workflows](/migrate-from-v1/).

:::

First, select the workflow(s) you want to move from the [workflows listing page](https://pipedream.com/workflows) and click **Move** in the top action menu:

![Select your workflows you'd like to transfer to a project, then click the Move button in the top right](https://pipedream.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F70c4da87-2aa3-435d-9226-c29fcc1cd881%2FUntitled.png?id=10fbba0c-2a92-49da-b7f1-22b1b46fb96c&table=block&spaceId=6e16aa4c-a31f-4db8-a947-0d80bcdcf984&width=2000&userId=&cache=v2)

Then, select the project to move the selected workflows to:

![Select which project to move the selected workflows into in the dropdown in the top right of the screen](https://pipedream.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F5fcb3357-9957-4307-aac9-e28ed59f85b0%2FUntitled.png?id=7fca27aa-28ec-4bcc-940d-9b66d1d692be&table=block&spaceId=6e16aa4c-a31f-4db8-a947-0d80bcdcf984&width=2000&userId=&cache=v2)

::: tip Undeployed changes are automatically assigned a development branch

If any moved workflows have undeployed changes, those changes will staged in a branch prefixed with `undeployed-changes` (e.g., `undeployed-changes-27361`).

:::

### Use the changelog

The changelog tracks all git activity (for projects with GitHub sync enabled). If you encounter an error merging your project, go to the changelog and explore the log details to help you troubleshoot issues in your workflows:

![Opening the changelog of commits on the left hand menu](https://pipedream.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fe7043a8c-597c-4722-86f6-464f582faf6f%2FUntitled.png?id=6e2f00f1-c768-4d13-9800-d6361afbe26d&table=block&spaceId=6e16aa4c-a31f-4db8-a947-0d80bcdcf984&width=2000&userId=&cache=v2)

### Local development

Projects that use GitHub sync may be edited outside of Pipedream. You can edit and commit directly via GitHub’s UI or clone the repo locally and use your preferred editor (e.g., VSCode).

To test external edits in Pipedream:

1. Commit and push local changes to your development branch in GitHub
2. Open the project in Pipedream’s UI and load your development branch
3. Use the Git Actions menu to pull changes from GitHub

## Known Issues

Below are a list of known issues that do not currently have solutions, but are in progress:

- Project branches on Pipedream cannot be deleted.
- If a workflow uses an action that has been deprecated, merging to production will fail.
- Legacy (v1) workflows are not supported in projects.
- Self-hosted GitHub Server instances are not yet supported. [Please contact us for help](https://pipedream.com/support).
- Workflow attachments are not supported

## Github Enterprise Cloud

If your repository hosted on an Github Enterprise account, you can allow the static Pipedream IP address to sync your project changes.

[Follow the directions here](https://docs.github.com/en/enterprise-cloud@latest/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/managing-allowed-ip-addresses-for-your-organization) to add an IP address.

Then add this static IP address `3.214.142.179` to allow Pipedream to sync changes.

:::warning Github Sync is available on Business and above plans

To use this public IP address and connect to Github Enterprise Cloud hosted repositories, you'll need to have a Pipedream Business plan. [View our plans](https://pipedream.com/pricing).

:::

## Frequently Asked Questions

### How are Pipedream workflows synchronized to Github?

Pipedream will serialize your project's workflows and their configuration into a standard YAML format for storage in Github.

Then Pipedream will commit your changes to your connected Github account.

### Do you have a definition of this YAML?

Not yet, please stay tuned!

### Can I sync multiple workflows to a single Github Repository?

Yes, _projects_ are synced to a single Github Repository which allows you to store multiple workflows into a single Github Repository for easier organization and management.

### Can I use this feature to develop workflows locally?

Yes, you can use the Github Syncing feature to develop your workflows from YAML files checked into your Pipedream connected Github Repository.

Then pushing changes to the `production` branch will trigger a deploy for your Pipedream workflows.

### Why am I seeing an error about "private auth mismatch" when trying to merge a branch to production?
![Private Auth Mismatch](https://res.cloudinary.com/pipedreamin/image/upload/v1704258143/private_auth_mismatch_kzdd7e.png)

This error occurs when **both** of the below conditions are met:
1. The referenced workflow is using a connected account that's not shared with the entire workspace
2. The change was merged from outside the Pipedream UI (via github.com or locally)

Since Pipedream can't verify the person who merged that change should have access to use the connected account in a workflow in this case, we block these deploys.

To resolve this error:
1. Make sure all the connected accounts in the project's workflows are [accessible to the entire workspace](/connected-accounts/#access-control)
2. Re-trigger a sync with Pipedream by making a nominal change to the workflow **from outside the Pipedream UI** (via github.com or locally), then merge that change to production

### Can I sync an existing GitHub Repository with workflows to a new Pipedream Project?

No, at this time it’s not possible because of how resources are connected during the bootstrapping process from the workflow YAML specification.
However, this is on our roadmap, [please subscribe to this issue](https://github.com/PipedreamHQ/pipedream/issues/9255) for the latest details.

### How does the `production` branch work?

Anything merged to the `production` branch will be deployed to your production workflows on Pipedream.

From a design perspective, we want to let you manage any branching strategy on your end, since you may be making commits to the repo outside of Pipedream. Once we support managing Pipedream workflows in a monorepo, where you may have other changes, we wanted to use a branch that didn’t conflict with a conventional main branch (like `main` or `master`).

In the future, we also plan to support you changing the default branch name.
