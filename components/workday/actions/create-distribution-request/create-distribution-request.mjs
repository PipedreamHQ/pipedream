import workday from "../../workday.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "workday-create-distribution-request",
  name: "Create Distribution Request",
  description: "Create a new distribution request. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#journeys/v1/post-/distributionRequests)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    workday,
    builder: {
      type: "object",
      label: "Builder",
      description: "A journey builder object. Example: `{ \"id\": \"00000000000000000000000000000000\" }`",
    },
    category: {
      type: "object",
      label: "Category",
      description: "A journey category object. Example: `{ \"id\": \"00000000000000000000000000000000\" }`",
    },
    discoverableBuilder: {
      type: "object",
      label: "Discoverable Builder",
      description: "A discoverable journey builder object. Example: `{ \"id\": \"00000000000000000000000000000000\" }`",
    },
    includePreviousRecipients: {
      type: "boolean",
      label: "Include Previous Recipients",
      description: "Whether to include previous recipients. Example: `true`",
      optional: true,
    },
    relatedRole: {
      type: "object",
      label: "Related Role",
      description: "Related role object. Example: `{ \"id\": \"00000000000000000000000000000000\" }`",
    },
    descriptor: {
      type: "string",
      label: "Descriptor",
      description: "Display name for the instance. Example: `Distribution Request for Training`",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.builder || typeof this.builder !== "object" || !this.builder.id || !this.builder.id.trim()) {
      throw new ConfigurationError("Builder is required and must be an object with a non-empty id property.");
    }
    if (!this.category || typeof this.category !== "object" || !this.category.id || !this.category.id.trim()) {
      throw new ConfigurationError("Category is required and must be an object with a non-empty id property.");
    }
    if (this.discoverableBuilder && (typeof this.discoverableBuilder !== "object" || !this.discoverableBuilder.id || !this.discoverableBuilder.id.trim())) {
      throw new ConfigurationError("Discoverable Builder (if provided) must be an object with a non-empty id property.");
    }
    if (this.relatedRole && (typeof this.relatedRole !== "object" || !this.relatedRole.id || !this.relatedRole.id.trim())) {
      throw new ConfigurationError("Related Role (if provided) must be an object with a non-empty id property.");
    }

    const data = {
      builder: this.builder,
      category: this.category,
    };
    if (this.discoverableBuilder) data.discoverableBuilder = this.discoverableBuilder;
    if (typeof this.includePreviousRecipients === "boolean") data.includePreviousRecipients = this.includePreviousRecipients;
    if (this.relatedRole) data.relatedRole = this.relatedRole;
    if (this.descriptor) data.descriptor = this.descriptor;

    const response = await this.workday.createDistributionRequest({
      $,
      data,
    });
    $.export("$summary", "Distribution request created");
    return response;
  },
};
