import cloudinary from "../../cloudinary.app.mjs";

export default {
  key: "cloudinary-get-resources",
  name: "Get Resources",
  description: "Lists resources (assets) uploaded to your product environment. [See the documentation](https://cloudinary.com/documentation/admin_api#get_resources)",
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    cloudinary,
    resourceType: {
      propDefinition: [
        cloudinary,
        "resourceType",
      ],
    },
    type: {
      propDefinition: [
        cloudinary,
        "deliveryType",
      ],
    },
    prefix: {
      type: "string",
      label: "Filter by Prefix",
      description: "Find all assets with a public ID that starts with the specified prefix.",
      optional: true,
    },
    tags: {
      type: "boolean",
      label: "Include Tags",
      description: "Whether to include the list of tag names assigned to each asset.",
      default: false,
      optional: true,
    },
    context: {
      type: "boolean",
      label: "Include Context",
      description: "Whether to include key-value pairs of contextual metadata associated with each asset.",
      default: false,
      optional: true,
    },
    metadata: {
      type: "boolean",
      label: "Include Metadata",
      description: "Whether to include the structured metadata fields and values assigned to each asset.",
      default: false,
      optional: true,
    },
    moderation: {
      type: "boolean",
      label: "Include Moderation",
      description: "Whether to include the image moderation status of each asset.",
      default: false,
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of resources to return",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const options = {
      resource_type: this.resourceType,
      type: this.type,
      prefix: this.prefix,
      tags: this.tags,
      context: this.context,
      moderation: this.moderation,
    };

    const resources = [];
    try {
      let next;
      do {
        const response = await this.cloudinary.getResources(options);
        resources.push(...response.resources);
        next = response.next_cursor;
        options.next_cursor = next;
      } while (next && resources.length < this.maxResults);

      if (resources.length > this.maxResults) {
        resources.length = this.maxResults;
      }

      $.export("$summary", `Retrieved ${resources.length} resource${resources.length === 1
        ? ""
        : "s"}`);

      return resources;
    }
    catch (err) {
      throw new Error(`Cloudinary error response: ${err.error?.message ?? JSON.stringify(err)}`);
    }
  },
};
