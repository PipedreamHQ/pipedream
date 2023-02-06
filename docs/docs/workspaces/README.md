# Workspaces

::: tip

Pipedream organizations are now **workspaces**. If you have an exisiting organization, it will be migrated to a workspace soon.

:::

When you sign up for a Pipedream account, you'll either be asked to create a workspace or join an existing workspace. You can invite your team to your workspace, create workflows, and organize them within projects and folders.

You can create and join any number of workspaces.

[[toc]]

## Creating a new workspace

To create another workspace, open the dropdown menu in the top left of the Pipedream dashboard.

Then select **Create new workspace**.

You'll be prompted to name the workspace. You can [change the name later](/workspaces/#renaming-a-workspace).

::: tip

**Free** and **Professional** tier accounts are limited to owning one workspace. [Browse plans](/pricing/) that include higher workspace usage.

:::

## Workspace settings

Find your current workspace settings like current members, under the **Settings** navigation menu item on the left hand side. Here is where you can manage your workspace settings, including the workspace name, members and member permissions.

### Inviting others to a join a workspace

After opening your workspace settings, open the **Membership** tab.

Invite members to your workspace by entering in their Pipedream username or email address and then clicking **Send**.

::: tip

Pipedream username names are formatted like `@pierce`. They can be found in the bottom left hand corner of the Pipedream dashboard.

![Example of a Pipedream username in the dashboard](https://res.cloudinary.com/pipedreamin/image/upload/v1673541487/docs/CleanShot_2023-01-12_at_11.37.56_ilk3v8.png)

:::

If the member does not yet have a Pipedream account, an email will be sent to their inbox containing an invitation link to create an account and join your workspace.

### Managing member permissions

By default, new workspace members are assigned the **Member** level permission.

**Members** will be able to perform general tasks like viewing, developing, and deploying workflows.

However, only **Admins** will be able to manage workspace level settings, like inviting new members, changing member roles, renaming workspaces, etc.

#### Promoting a member to admin

To promote a member to an admin level account in your workspace, click the corresponding checkbox under their member entry.

#### Demoting an admin to a member

To demote an admin back to a member, uncheck the **Admin** checkbox in that members record in your workspace settings.

### Finding your workspace's ID

Visit [https://pipedream.com/settings/account](https://pipedream.com/settings/account), and expand the **Programmatic Access** section. You'll see your workspace ID here.

### Configuring Single-sign on (SS0)

Workspaces on the Business and Enterprise plans can configure Single-sign on, so your users can login to Pipedream using your identity provider.

Pipedream supports SSO with Google, Okta, and any provider that supports the SAML protocol. See the guides below to configure SSO for your identity provider:

- [Okta](/workspaces/sso/okta/)
- [Google](/workspaces/sso/google/)

### Renaming a workspace

To rename a workspace, open your workspace settings and navigate to the **Account Settings** area.

Click the green check icon on the far right of the input to save the changes.

::: tip

This action is only available to workspace **admins**.

:::

### Deleting a workspace

To delete a workspace, open your workspace settings and navigate to the **Danger Zone**.

Click the **Delete workspace** button and confirm the action by entering in your workspace name and `delete my workspace` into the text prompt.

::: danger

Deleting a workspace will delete all **sources**, **workflows**, and other resources in your workspace.

Deleting a workspace is **irreversible** and permanent.

:::

## Switching between workspaces

To switch between workspaces, open the dropdown menu in the top left of the Pipedream dashboard.

Select which workspace you'd like to start working within, and your Pipedream dashboard context will change to that workspace.
