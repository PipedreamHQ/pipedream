import aweberApp from "../../aweber.app.mjs";

export default {
  key: "aweber-create-broadcast",
  name: "Create Broadcast",
  description: "Create a broadcast under the specified account and list. [See the docs here](https://api.aweber.com/#tag/Broadcasts/paths/~1accounts~1%7BaccountId%7D~1lists~1%7BlistId%7D~1broadcasts/post).",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    aweberApp,
    accountId: {
      propDefinition: [
        aweberApp,
        "accountId",
      ],
    },
    listId: {
      propDefinition: [
        aweberApp,
        "listId",
        ({ accountId }) => ({
          accountId,
        }),
      ],
    },
    bodyHTML: {
      type: "string",
      label: "Body HTML",
      description: "The content of the message in HTML format. If `Body Text` is not provided, it will be auto-generated. If `Body Text` is not provided, `Body HTML` must be provided.",
    },
    bodyText: {
      type: "string",
      label: "Body Text",
      description: "The content of the message in plain text, used when HMTL is not supported. If `Body HTML` is not provided, the broadcast will be sent using only the `Body Text`. If `Body Text` is not provided, `Body HMTL` must be provided.",
    },
    bodyAmp: {
      type: "string",
      label: "Body AMP",
      description: "The content of the message in AMP format. [Read Aweber KB article before using this field](https://help.aweber.com/hc/en-us/articles/360025741194)",
      optional: true,
    },
    clickTrackingEnabeld: {
      type: "boolean",
      label: "Click Tracking Enabled",
      description: "Enables links in the email message to be tracked.",
      optional: true,
    },
    excludeLists: {
      propDefinition: [
        aweberApp,
        "listSelfLink",
        ({ accountId }) => ({
          accountId,
        }),
      ],
      type: "string[]",
      label: "Exclude Lists",
      description: "List of [Lists](https://api.aweber.com/#tag/Lists) URLs to exclude in the delivery of this broadcast. **e.g. `https://api.aweber.com/1.0/accounts/<account_id>/lists/<list_id>`**",
      optional: true,
    },
    includeLists: {
      propDefinition: [
        aweberApp,
        "listSelfLink",
        ({ accountId }) => ({
          accountId,
        }),
      ],
      type: "string[]",
      label: "Include Lists",
      description: "List of [Lists](https://api.aweber.com/#tag/Lists) URLs to include in the delivery of this broadcast. **e.g. `https://api.aweber.com/1.0/accounts/<account_id>/lists/<list_id>`**",
      optional: true,
    },
    facebookIntegration: {
      propDefinition: [
        aweberApp,
        "integrations",
        ({ accountId }) => ({
          accountId,
          serviceName: "facebook",
        }),
      ],
      label: "Facebook Integration",
      description: "URL to the [Facebook broadcast integration](https://api.aweber.com/#tag/Integrations) to use for this broadcast. When the broadcast is sent, the subject of the broadcast will be posted to this Facebook integration - **e.g. `https://api.aweber.com/1.0/accounts/<account_id>/integrations/<integration_id>`**.",
      optional: true,
    },
    isArchived: {
      type: "boolean",
      label: "Is Archived",
      description: "Whether the broadcast enabled sharing via an archive URL.",
      optional: true,
    },
    notifyOnSend: {
      type: "boolean",
      label: "Notify on Send",
      description: "If true, notify when stats are available on a sent broadcast message.",
      optional: true,
    },
    segmentLink: {
      propDefinition: [
        aweberApp,
        "segmentSelfLink",
        ({
          accountId, listId,
        }) => ({
          accountId,
          listId,
        }),
      ],
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The broadcast subject line. Subject must not be empty nor contain only whitespace.",
    },
    twitterIntegration: {
      propDefinition: [
        aweberApp,
        "integrations",
        ({ accountId }) => ({
          accountId,
          serviceName: "twitter",
        }),
      ],
      label: "Twitter Integration",
      description: "URL to the [Twitter broadcast integration](https://api.aweber.com/#tag/Integrations) to use for this broadcast. When the broadcast is sent, the subject of the broadcast will be tweeted - **e.g. `https://api.aweber.com/1.0/accounts/<account_id>/integrations/<integration_id>`**.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.aweberApp.createBroadcast({
      $,
      accountId: this.accountId,
      listId: this.listId,
      data: {
        body_html: this.bodyHTML,
        body_text: this.bodyText,
        body_amp: this.bodyAmp,
        click_tracking_enabled: this.clickTrackingEnabled,
        exclude_lists: this.excludeLists,
        include_lists: this.includeLists,
        facebook_integration: this.facebookIntegration,
        is_archived: this.isArchived,
        notify_on_send: this.notifyOnSend,
        segment_link: this.segmentLink,
        subject: this.subject,
        twitter_integration: this.twitterIntegration,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    $.export("$summary", `Successfully created broadcast with **UUID: ${response.uuid}**.`);
    return response;
  },
};
