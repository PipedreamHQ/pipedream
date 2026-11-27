import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../upload_post.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";
import sampleEmit from "./test-event.mjs";

const PAGE_SIZE = 100;
const DEPLOY_EMIT_LIMIT = 10;

export default {
  key: "upload_post-new-upload-completed",
  name: "New Upload Completed",
  description: "Emit new event when an upload finishes on a platform (one event per platform, successful or failed), with the post URL or the error message. [See the documentation](https://docs.upload-post.com/api/upload-history)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling Schedule",
      description: "How often to poll the Upload-Post API",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    profileUsername: {
      propDefinition: [
        app,
        "user",
      ],
      description: "Only emit uploads of this profile, e.g. `my_brand`. Use **List Profiles** to find it (the `username` field).",
      optional: true,
    },
    platform: {
      propDefinition: [
        app,
        "historyPlatform",
      ],
      description: "Only emit uploads to this platform, e.g. `youtube`.",
    },
    status: {
      propDefinition: [
        app,
        "uploadStatus",
      ],
      description: "Only emit successful or only failed uploads, e.g. `failed`. Both are emitted by default.",
    },
  },
  hooks: {
    async deploy() {
      await this.processEvents(DEPLOY_EMIT_LIMIT);
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    getTs(item) {
      return Date.parse(item.upload_timestamp) || 0;
    },
    generateMeta(item) {
      // A request publishes one history row per platform. The timestamp is part of
      // the id so a retried platform upload (same request_id) is emitted again.
      const id = utils.hashId(
        item.request_id || item.job_id || item.external_id,
        item.platform,
        item.upload_timestamp,
      );
      const platform = constants.PLATFORM_LABELS[item.platform] || item.platform;
      const result = item.success
        ? "succeeded"
        : "failed";
      const profile = item.profile_username
        ? ` (${item.profile_username})`
        : "";
      return {
        id,
        summary: `Upload to ${platform} ${result}${profile}`,
        ts: this.getTs(item) || Date.now(),
      };
    },
    /**
     * Pages through the history (most recent first) until reaching rows older than
     * the last emitted one, then emits the new rows in chronological order.
     * @param {number} [max] - cap on the number of rows to emit (first run only)
     */
    async processEvents(max) {
      const lastTs = this._getLastTs();
      const items = [];
      let page = 1;
      let done = false;

      while (!done) {
        const { history = [] } = await this.app.getUploadHistory({
          params: {
            page,
            limit: PAGE_SIZE,
            profile_username: this.profileUsername,
            platform: this.platform,
            status: this.status,
          },
        });
        for (const item of history) {
          // `>=` keeps rows sharing the last timestamp; dedupe drops the ones already emitted
          if (this.getTs(item) < lastTs) {
            done = true;
            break;
          }
          items.push(item);
          if (max && items.length >= max) {
            done = true;
            break;
          }
        }
        if (history.length < PAGE_SIZE) {
          done = true;
        }
        page++;
      }

      if (!items.length) {
        return;
      }

      items.reverse().forEach((item) => this.$emit(item, this.generateMeta(item)));

      // Update the checkpoint only after every event has been emitted
      this._setLastTs(Math.max(lastTs, ...items.map((item) => this.getTs(item))));
    },
  },
  async run() {
    await this.processEvents();
  },
  sampleEmit,
};
