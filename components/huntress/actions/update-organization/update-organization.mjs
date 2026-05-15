import { ConfigurationError } from "@pipedream/platform";
import app from "../../huntress.app.mjs";

export default {
  key: "huntress-update-organization",
  name: "Update Organization",
  description: "Update an existing organization in your Huntress account. [See the documentation](https://api.huntress.io/docs#tag/organizations/patch/v1/organizations/{id})",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    organizationId: {
      propDefinition: [
        app,
        "organizationId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the organization. Value cannot be blank and must be 256 characters or less.",
      optional: true,
    },
    key: {
      type: "string",
      label: "Key",
      description: "Organization key used to associate a Huntress Agent into a grouping. Value cannot be blank and must be 256 characters or less.",
      optional: true,
    },
    reportRecipients: {
      type: "string[]",
      label: "Report Recipients",
      description: "Any emails specified here will automatically receive quarterly and monthly branded reports.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.name && !this.key && !this.reportRecipients) {
      throw new ConfigurationError("Please provide at least one of `Name`, `Key`, or `Report Recipients` to update.");
    }

    const response = await this.app.updateOrganization({
      $,
      id: this.organizationId,
      data: {
        name: this.name,
        key: this.key,
        report_recipients: this.reportRecipients,
      },
    });

    $.export("$summary", `Successfully updated organization \`${this.organizationId}\``);

    return response;
  },
};
