import app from "../../podio.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  type: "action",
  key: "podio-create-status",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Create Status",
  description: "Creates a status to the given workspace. [See the documentation](https://developers.podio.com/doc/status/add-new-status-message-22336)",
  props: {
    app,
    orgId: {
      propDefinition: [
        app,
        "orgId",
      ],
    },
    spaceId: {
      propDefinition: [
        app,
        "spaceId",
        (configuredProps) => ({
          orgId: configuredProps.orgId,
        }),
      ],
    },
    alertInvite: {
      type: "boolean",
      label: "Alert Invite",
      description: "True if any mentioned user should be automatically invited to the workspace if the user does not have access to the object and access cannot be granted to the object. Default value: `false`",
      optional: true,
    },
    value: {
      type: "string",
      label: "Value",
      description: "The actual status message",
    },
    embedId: {
      type: "string",
      label: "Embed ID",
      description: "The id of an embedded link that has been created with the Add an embed operation in the Embed area",
      optional: true,
    },
    embedUrl: {
      type: "string",
      label: "Embed URL",
      description: "The url to be attached",
      optional: true,
    },
    question: {
      type: "string",
      label: "Question",
      description: "Any question to be attached. Must be a valid JSON object, e.g. `{\"text\": \"Some Question?\",\"options\": [\"option1\", \"option2\",...]}`",
      optional: true,
    },
  },
  async run ({ $ }) {
    const resp = await this.app.createStatus({
      $,
      spaceId: this.spaceId,
      params: {
        alert_invite: this.alertInvite,
      },
      data: {
        value: this.value,
        embed_id: this.embedId,
        embed_url: this.embedUrl,
        question: utils.extractOne(this.question),
      },
    });
    $.export("$summary", `The status has been created. (ID:${resp.status_id})`);
    return resp;
  },
};
