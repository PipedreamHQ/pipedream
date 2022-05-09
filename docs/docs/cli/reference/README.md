# CLI Reference

The Pipedream CLI currently allows you to manage [components](/components/). If you'd like to see support for managing [workflows](/workflows/), please +1 [this issue on Github](https://github.com/PipedreamHQ/pipedream/issues/220).

When this document uses the term "component", the corresponding feature applies to both sources and actions. If a specific feature applies to only sources _or_ actions, the correct term will be used.

[[toc]]

## Installing the CLI

[See the CLI installation docs](/cli/install/) to learn how to install the CLI for your OS / architecture.

## Command Reference

Run `pd` to see a list of all commands with basic usage info, or run `pd help <command>` to display help docs for a specific command.

We've also documented each command below, with usage examples for each.

### General Notes

Everywhere you can refer to a specific component as an argument, you can use the component's ID _or_ its name slug. For example, to retrieve details about a specific source using `pd describe`, you can use either of the following commands:

```
λ ~/ pd describe dc_abc123

  id: dc_abc123
  name: http
  endpoint: https://myendpoint.m.pipedream.net

λ ~/ pd describe http
Searching for sources matching http

  id: dc_abc123
  name: http
  endpoint: https://myendpoint.m.pipedream.net
```

### `pd delete`

Deletes an event source. Run:

```
pd delete <source-id-or-name>
```

Run `pd list so` to display a list of your event sources.

### `pd deploy`

Deploy an event source from local or remote code.

Running `pd deploy`, without any arguments, brings up an interactive menu asking you select a source. This list of sources is retrieved from the registry of public sources [published to Github](https://github.com/PipedreamHQ/pipedream/tree/master/components).

When you select a source, we'll deploy it and start listening for new events.

You can also deploy a specific source via the source's `key` (defined in the component file for the source):

```
pd deploy http-new-requests
```

or author a component locally and deploy that local file:

```
pd deploy http.js
```

[Read more about authoring your own event sources](/components/quickstart/nodejs/sources/).

### `pd describe`

Display the details for a source: its id, name, and other configuration details:

```
pd describe <source-id-or-name>
```

### `pd dev`

`pd dev` allows you to interactively develop a source from a local file.`pd dev` will link your local file with the deployed component and watch your local file for changes. When you save changes to your local file, your component will automatically be updated on Pipedream.

```
pd dev <file-or-name>
```

If you quit `pd dev` and want to link the same deployed source to your local file, you can pass the deployed component ID using the `--dc` flag:

```
pd dev --dc <existing-deployed-component-id> <file-or-name>
```


### `pd events`

Returns historical events sent to a source, and streams emitted events directly to the CLI.

```
pd events <source-id-or-name>
```

By default, `pd events` prints (up to) the last 10 events sent to your source.

```
pd events -n 100 <source-id-or-name>
```

`pd events -n N` retrieves the last `N` events sent to your source. We store the last 100 events sent to a source, so you can retrieve a max of 100 events using this command.

```
pd events -f <source-id-or-name>
```

`pd events -f` connects to the [SSE stream tied to your source](/api/sse/) and displays events as the source produces them.

```
pd events -n N -f <source-id-or-name>
```

You can combine the `-n` and `-f` options to list historical events _and_ follow the source for new events.

### `pd help`

Displays help for any command. Run `pd help events`, `pd help describe`, etc.

### `pd init`

Generate new app and component files from templates.

#### `pd init app`

Creates a directory and [an app file](/components/guidelines/#app-files) from a template

```
# Creates google_calendar/ directory and google_calendar.mjs file
pd init app google_calendar
```

#### `pd init action`

Creates a new directory and [a component action](/components#actions) from a template.

```
# Creates add-new-event/ directory and add-new-event.mjs file
pd init action add-new-event
```

#### `pd init source`

Creates a new directory and [an event source](/sources/) from a template.

```
# Creates cancelled-event/ directory and cancelled_event.mjs file
pd init source cancelled-event
```

You can attach [database](/components/api/#db), [HTTP](/components/api/#http), or [Timer](/components/api/#timer) props to your template using the following flags:

| Prop type | Flag      |
| --------- | --------- |
| Database  | `--db`    |
| HTTP      | `--http`  |
| Timer     | `--timer` |

For example, running:

```
pd init source cancelled-event --db --http --timer
```

will include the following props in your new event source:

```javascript
props: {
  db: "$.service.db",
  http: "$.interface.http",
  timer: "$.interface.timer",
}
```

### `pd list`

Lists Pipedream sources running in your account. Running `pd list` without any arguments prompts you to select the type of resource you'd like to list.

You can also list specific resource types directly:

```
pd list components
```

```
pd list streams
```

`sources` and `streams` have shorter aliases, too:

```
pd list so
```

```
pd list st
```

### `pd login`

Log in to Pipedream CLI and persist API key locally. See [Logging into the CLI](/cli/login/) for more information.

### `pd logout`

Unsets the local API key tied to your account.

Running `pd logout` without any arguments removes the default API key from your [config file](/cli/reference/#cli-config-file).

You can remove the API key for a specific profile by running:

```
pd logout -p <profile>
```

### `pd logs`

Event sources produce logs that can be useful for troubleshooting issues with that source. `pd logs` displays logs for a source.

Running `pd logs <source-id-or-name>` connects to the [SSE logs stream tied to your source](/sources/logs/), displaying new logs as the source produces them.

Any errors thrown by the source will also appear here.

### `pd publish`

To publish an action, use the `pd publish` command.

```bash
pd publish <filename>
```

E.g.,

```bash
pd publish my-action.js
```

### `pd signup`

Sign up for Pipedream via the CLI and persist your API key locally. See the docs on [Signing up for Pipedream via the CLI](/cli/login/#signing-up-for-pipedream-via-the-cli) for more information.

### `pd update`

Updates the code, props, or metadata for an event source.

If you deployed a source from Github, for example, someone might publish an update to that source, and you may want to run the updated code.

```
pd update <source-id-or-name> --code https://github.com/PipedreamHQ/pipedream/blob/master/components/http/sources/new-requests/new-requests.js
```

You can change the name of a source:

```
pd update <source-id-or-name> --name new-awesome-name
```

You can deactivate a source if you want to stop it from running:

```
pd update <source-id-or-name> --deactivate
```

or activate a source you previously deactivated:

```
pd update <source-id-or-name> --activate
```

## Profiles

Profiles allow you to work with multiple, named Pipedream accounts via the CLI.

### Creating a new profile

When you [login to the CLI](/cli/login/), the CLI writes the API key for that account to your config file, in the `api_key` field:

```
api_key = abc123
```

You can set API keys for other, named profiles, too. Run

```
pd login -p <profile>
```

`<profile>` can be any string of shell-safe characters that you'd like to use to identify this new profile. The CLI opens up a browser asking you to login to your target Pipedream account, then writes the API key to a section of the config file under this profile:

```
[your_profile]
api_key = def456
```

You can also run `pd signup -p <profile>` if you'd like to sign up for a new Pipedream account via the CLI and set a named profile for that account.

### Creating a profile for an organization

If you're working with resources in an [organization](/orgs/), you'll need to add an `org_id` to your profile.

1. [Retrieve your organization's ID](/orgs/#finding-your-organization-s-id)
2. Open up your [Pipedream config file](#cli-config-file) and create a new [profile](#profiles) with the following information:

```
[profile_name]
api_key = <API Key from org settings>
org_id = <Org ID from org settings>
```

When using the CLI, pass `--profile <profile_name>` when running any command. For example, if you named your profile `my_org`, you'd run this command to publish a component:

```bash
pd publish file.js --profile my_org
```

### Using profiles

You can set a profile on any `pd` command by setting the `-p` or `--profile` flag. For example, to list the sources in a specific account, run:

```
pd list sources --profile <profile>
```

## Version

To get the current version of the `pd` CLI, run

```
pd --version
```

## Auto-upgrade

The CLI is configured to check for new versions automatically. This ensures you're always running the most up-to-date version.

## CLI config file

The `pd` config file contains your Pipedream API keys (tied to your default account, or other [profiles](#profiles)) and other configuration used by the CLI.

If the `XDG_CONFIG_HOME` env var is set, the config file will be found in `$XDG_CONFIG_HOME/pipedream`.

Otherwise, it will be found in `$HOME/.config/pipedream`.

## Analytics

Pipedream tracks CLI usage data to report errors and usage stats. We use this data exclusively for the purpose of internal analytics (see [our privacy policy](https://pipedream.com/privacy) for more information).

If you'd like to opt-out of CLI analytics, set the `PD_CLI_DO_NOT_TRACK` environment variable to `true` or `1`.

<Footer />
