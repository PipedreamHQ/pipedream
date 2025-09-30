import app from "../../google_tag_manager.app.mjs";

export default {
  name: "Update Tag",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "google_tag_manager-update-tag",
  description: "Update a tag in a workspace. [See the documentation](https://developers.google.com/tag-platform/tag-manager/api/v2/reference/accounts/containers/workspaces/tags/update)",
  type: "action",
  props: {
    app,
    accountId: {
      optional: false,
      propDefinition: [
        app,
        "accountId",
      ],
    },
    containerId: {
      optional: false,
      propDefinition: [
        app,
        "containerId",
        (c) => ({
          accountId: c.accountId,
        }),
      ],
    },
    workspaceId: {
      optional: false,
      propDefinition: [
        app,
        "workspaceId",
        (c) => ({
          accountId: c.accountId,
          containerId: c.containerId,
        }),
      ],
    },
    tagId: {
      optional: false,
      propDefinition: [
        app,
        "tagId",
        (c) => ({
          accountId: c.accountId,
          containerId: c.containerId,
          workspaceId: c.workspaceId,
        }),
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
      optional: true,
    },
    type: {
      propDefinition: [
        app,
        "type",
      ],
    },
    liveOnly: {
      propDefinition: [
        app,
        "liveOnly",
      ],
    },
    notes: {
      propDefinition: [
        app,
        "notes",
      ],
    },
    parameter: {
      propDefinition: [
        app,
        "parameter",
      ],
    },
    consentSettings: {
      propDefinition: [
        app,
        "consentSettings",
      ],
    },
    monitoringMetadata: {
      propDefinition: [
        app,
        "monitoringMetadata",
      ],
    },
  },
  async run({ $ }) {
    const parameter = typeof this.parameter === "string"
      ? JSON.parse(this.parameter)
      : this.parameter;
    const consentSettings = typeof this.consentSettings === "string"
      ? JSON.parse(this.consentSettings)
      : this.consentSettings;
    const monitoringMetadata = typeof this.monitoringMetadata === "string"
      ? JSON.parse(this.monitoringMetadata)
      : this.monitoringMetadata;

    const response = await this.app.updateTag({
      $,
      accountId: this.accountId,
      containerId: this.containerId,
      workspaceId: this.workspaceId,
      tagId: this.tagId,
      data: {
        name: this.name,
        type: this.type,
        liveOnly: this.liveOnly,
        notes: this.notes,
        parameter,
        consentSettings,
        monitoringMetadata,
      },
    });

    if (response) {
      $.export("$summary", `Successfully updated tag with ID ${response.tagId}`);
    }

    return response;
  },
};
