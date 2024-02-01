# Projects

A workspace can contain one or more _projects_. Projects are a way to organize your workflows into specific groupings or categories.

<div class="flex justify-center">
  <img width="450px" src="https://res.cloudinary.com/pipedreamin/image/upload/v1674143831/docs/New_Project_5_zep4ii.png" alt="How workspaces are organized" />
</div>

[[toc]]

## Getting started with projects

### Creating projects

To create a new project, first [open the Projects section in the dashboard](https://pipedream.com/projects).

Then click **Create project** to start a new project.

Enter in your desired name for the project in the prompt, then click **Create**.

That's it, you now have a dedicated new project created within your workspace. Now you can create workflows within this project, or move workflows into it or create folders for further organization.

::: details How do I limit workspace members from viewing or developing workflows in certain projects?

Members of a given workspace can see all projects in the workspace.

If you need to limit certain project's visibility to only some members, then those members belong in a different workspace.

:::

### Creating folders and workflows in projects

Within a given project, you can create folders for your workflows.

Open your project, and then click the **New** button for a dropdown to create a workflow in your current project.

::: tip

Helpful hotkeys to speed up your development

* `C then F` creates a new folder.
* `C then W` creates a new workflow.

:::


Folders can also contain sub-folders, which allows you to create a filing system to organize your workflows.

### Moving workflows into folders

To move workflows into folders, simply drag and drop the workflow into the folder.

You can move workflows or folders up a level by dragging and dropping the workflow to the folder icon at the top of the list.


### Importing workflows into projects

::: tip

This only applies to Pipedream accounts that created workflows before the projects feature was released.

:::

To import a workflow from the general **Workflows** area of your dashboard into a project, first open up the specific project you'd like to import the workflow into.

Then at the top right of the project's page, click the **Import** button.

You'll be prompted to select a workflow from your **Workflows** area to import.

### Moving workflows between projects

To move a workflow from one project to another project, first check the workflow and then click **Move** to open a dropdown of projects. Select the project to move this workflow to, and click **Move** once more to complete the move.

![How to move workflows from one project to another in the Pipedream dashboard.](https://res.cloudinary.com/pipedreamin/image/upload/v1695662665/docs/docs/projects/CleanShot_2023-09-25_at_13.23.38_2x_dyrtlv.png)

::: warning Github Sync limitation

At this time it's not possible to move workflows out of GitHub Synchronized Projects.

:::

## Access permissions

The [project list view](https://pipedream.com/projects) contains **Owner** and **Access** columns.

**Owner** indicates who within the workspace owns each project. This is typically the person who created the project.

![Project Listing (Owner)](./images/project-listing-owner.png)

::: warning Some projects may not have owners
Projects created before February 2024 don't automatically have owners.
:::

**Access** indicates which workspace members have access to each project, and this can be displayed as "me", "Workspace", or "N members".

![Project Listing (Access)](./images/project-listing-access.png)

### Permissions
Workspace owners and admins are able to perform all actions in projects, whereas members are restricted from performing certain actions.

| Operations | Project creator | Workspace members |
| --  | :--: | :--: | :--: |
| View in [projects listing](https://pipedream.com/projects) | :white_check_mark: | :white_check_mark: |
| View in [Event History](https://pipedream.com/event-history) | :white_check_mark: | :white_check_mark: |
| View in global search | :white_check_mark: | :white_check_mark: |
| Manage project workflows | :white_check_mark: | :white_check_mark: |
| Manage project files | :white_check_mark: | :white_check_mark: |
| Manage project variables | :white_check_mark: | :white_check_mark: |
| Manage project access | :white_check_mark: | :x: |
| Manage GitHub Sync settings | :white_check_mark: | :x: |
| Delete project | :white_check_mark: | :x: |

_Access and permissions for workspace admins and owners mirror the project creator for all projects in the workspace._

### Managing access
:::tip By default, all projects are accessible to everyone in the workspace.
Workspaces on the [Business plan](https://pipedream.com/pricing) can restrict members' access to specific projects.
:::

You can easily modify the access rules for a project directly from the [project list view](https://pipedream.com/projects), either by clicking the access badge in the project row (fig 1) or clicking the 3 dots to open the action menu, then selecting **Manage Access** (fig 2).

Access badge (fig 1):

![Click the access badge to manage access](./images/access-badge-click.png)

Via the action menu (fig 2):

![Click manage access from the action menu](./images/manage-access-overflow-menu.png)

From here, a slideout drawer reveals the access management configuration:

![Manage access slideout workspace access](./images/slideout-workspace-share.png)

Toggle the **Restrict access to this project** switch to manage access:

![Manage access slideout restricted](./images/slideout-restricted.png)

Select specific members of the workspace to grant access:

![Manage access slideout showing member dropdown](./images/slideout-member-dropdown.png)

You can always see who has access and remove access if necessary:

![Manage access showing members with access](./images/slideout-member-list.png)

## Frequently asked questions

### Can sources and connected accounts be organized into projects as well?

At this time no, but that is on our roadmap. Projects will eventually contain all the resources needed for a complete system of workflows to work together.

### Can projects be synchronized to a Github repository?

Yes, [please read here](/projects/git/) for more information on the Github synchronization feature for projects.
