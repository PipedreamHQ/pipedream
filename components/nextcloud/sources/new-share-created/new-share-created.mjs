import nextcloud from "../../nextcloud.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  key: "nextcloud-new-share-created",
  name: "New Share Created",
  description: "Emit new event whenever a share is created in Nextcloud. [See the documentation](https://docs.nextcloud.com/server/latest/developer_manual/_static/openapi.html#/operations/files_sharing-shareapi-get-shares)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    nextcloud,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    path: {
      propDefinition: [
        nextcloud,
        "path",
      ],
      optional: true,
    },
    itemType: {
      type: "string",
      label: "Item Type",
      description: "Filter results to only files or folders",
      optional: true,
      options: [
        "file",
        "folder",
      ],
    },
  },
  methods: {
    isRelevant(share) {
      return !this.itemType || share.item_type === this.itemType;
    },
    generateMeta(share) {
      return {
        id: share.id,
        summary: `New Share created: ${share.path}`,
        ts: share.stime,
      };
    },
  },
  async run() {
    const params = this.path
      ? {
        path: this.path,
      }
      : {};
    const { ocs: { data } } = await this.nextcloud.listShares({
      params,
    });
    for (const item of data) {
      if (this.isRelevant(item)) {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      }
    }
  },
  sampleEmit,
};
