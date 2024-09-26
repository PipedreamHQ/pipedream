# Pipedream Registry

When developing workflows with pre-built actions and triggers, under the hood you're using [components](/components/) from the [Pipedream Registry Github Repository](https://github.com/pipedreamhq/pipedream).

Components contributed to the [Pipedream Registry Github Repository](https://github.com/pipedreamhq/pipedream) are published to the [Pipedream marketplace](https://pipedream.com/apps) and are listed in
the Pipedream UI when building workflows.

::: tip What is a component?

If you haven't yet, we recommend starting with our Component Development Quickstart Guides for [sources](/components/quickstart/nodejs/sources/)
and [actions](/components/quickstart/nodejs/actions/) to learn how to build components and privately publish them to your account.

:::

## Registry Components Structure

All Pipedream registry components live in [this GitHub repo](https://github.com/PipedreamHQ/pipedream) under the [`components`](https://github.com/PipedreamHQ/pipedream/tree/master/components) directory.

Every integrated app on Pipedream has a corresponding directory that defines the actions and sources available for that app. Below is a simplified version of the [Airtable app directory](https://github.com/PipedreamHQ/pipedream/tree/master/components/airtable) within the registry:

```
airtable
├── README.md
├── actions
│   ├── get-record
│   │   └── get-record.mjs
├── airtable.app.mjs
├── node_modules
│   ├── ...here be dragons
├── package.json
└── sources
    └── new-records
        └── new-records.mjs
```

In the example above, the `components/airtable/actions/get-record/get-record.mjs` component is published as the **Get Record** action under the **Airtable** app within the workflow builder in Pipedream.

::: tip The repository is missing the app directory I'd like to add components for

You can request to have new apps integrated into Pipedream.

Once the Pipedream team integrates the app, we'll create a directory for the app in the [`components`](https://github.com/PipedreamHQ/pipedream/tree/master/components) directory of the GitHub repo.

:::

## Contribution Process

Anyone from the community can build [sources](/sources/) and [actions](/components#actions) for integrated apps.

To submit new components or update existing components:

1. Fork the public [Pipedream Registry Github Repository](https://github.com/pipedreamhq/pipedream).
2. Create a new component within the corresponding app's directory within the `components` directory (if applicable).
3. [Create a PR for the Pipedream team to review](https://github.com/PipedreamHQ/pipedream/compare).
4. Address any feedback provided by Pipedream based on the best practice [Component Guidelines & Patterns](/components/guidelines/).
5. Once the review is complete and approved, Pipedream will merge the PR to the `master` branch
6. The component will be available for use within workflows for all Pipedream developers! :tada:

### Component Development Discussion

Join the discussion with other Pipedream component developers at the [#contribute channel](https://pipedream-users.slack.com/archives/C01E5KCTR16) in Slack or [on Discourse](https://pipedream.com/community/c/dev/11).

:::tip Not sure what to build?

Need inspiration? Check out [sources](https://github.com/PipedreamHQ/pipedream/issues?q=is%3Aissue+is%3Aopen+%5BSOURCE%5D+in%3Atitle)
and [actions](https://github.com/PipedreamHQ/pipedream/issues?q=is%3Aissue+is%3Aopen+%5BACTION%5D+in%3Atitle+) requested by the community!

:::

## Reference Components

The following components arfor developing sources and
actions for Pipedream's registry.

### Reference Sources

| Name                                                                                                                                                          | App          | Type                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | -------------------------------------------- |
| [New Card](https://github.com/pipedreamhq/pipedream/blob/master/components/trello/sources/new-card/new-card.mjs)                                              | Trello       | Webhook                                      |
| [New or Modified Files](https://github.com/pipedreamhq/pipedream/blob/master/components/google_drive/sources/new-or-modified-files/new-or-modified-files.mjs) | Google Drive | Webhook + Polling                            |
| [New Submission](https://github.com/pipedreamhq/pipedream/blob/master/components/jotform/sources/new-submission/new-submission.mjs)                           | Jotform      | Webhook (with no unique hook ID)             |

### Reference Actions

| Name                                                                                                                                                  | App           |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| [Add Multiple Rows](https://github.com/PipedreamHQ/pipedream/blob/master/components/google_sheets/actions/add-multiple-rows/add-multiple-rows.mjs)    | Google Sheets |
| [Send Message](https://github.com/PipedreamHQ/pipedream/blob/master/components/discord_webhook/actions/send-message/send-message.mjs)                 | Discord       |
| [Append Text](https://github.com/PipedreamHQ/pipedream/blob/master/components/google_docs/actions/append-text/append-text.mjs)                        | Google Docs   |
| [`GET` request](https://github.com/PipedreamHQ/pipedream/blob/master/components/http/actions/get-request/get-request.mjs)                             | HTTP          |
