import { ConfigurationError } from "@pipedream/platform";
import common from "../common/common.mjs";

export default {
  ...common,
  key: "wealthbox-new-comment",
  name: "New Comment",
  description: "Emit new event for each new comment created in Wealthbox, deduplicated by comment id. Polls GET /comments and tracks by `created_at`. [See the documentation](http://dev.wealthbox.com/#comments)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    resourceType: {
      type: "string",
      label: "Resource Type",
      description: "Optional. Restrict comments to a resource type (for example `Contact`, `Task`, `Note`).",
      optional: true,
    },
    resourceId: {
      type: "string",
      label: "Resource ID",
      description: "Optional. Restrict comments to a specific resource id.",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    async getEvents({ params }) {
      if (this.resourceId && !this.resourceType) {
        throw new ConfigurationError("Resource Type is required when Resource ID is set.");
      }
      const response = await this.wealthbox.listComments({
        params: {
          ...params,
          resource_type: this.resourceType,
          resource_id: this.resourceId,
        },
      });
      return response?.comments || [];
    },
    generateMeta(comment) {
      return {
        id: comment.id,
        summary: `New Comment: ${comment.id}`,
        ts: this.getCreatedAtTs(comment),
      };
    },
  },
  async run() {
    await this.processEvent(false);
  },
};
