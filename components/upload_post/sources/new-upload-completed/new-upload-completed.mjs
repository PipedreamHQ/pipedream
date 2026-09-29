import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../upload_post.app.mjs";
import constants from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

const PAGE_SIZE = 100;
const MAX_PAGES = 10;
const DEPLOY_EMIT_LIMIT = 10;

export default {
  key: "upload_post-new-upload-completed",
  name: "New Upload Completed",
  description: "Emit new event when an upload finishes on a platform (one event per platform, successful or failed). [See the documentation](https://docs.upload-post.com/api/upload-history)",
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
      description: "Only emit uploads of this profile",
      optional: true,
    },
    platform: {
      type: "string",
      label: "Platform",
      description: "Only emit uploads to this platform",
      options: constants.HISTORY_PLATFORMS.map((value) => ({
        label: constants.PLATFORM_LABELS[value],
        value,
      })),
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Only emit successful or only failed uploads. Emits both by default.",
      options: [
        "success",
        "failed",
      ],
      optional: true,
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
      const ts = this.getTs(item);
      // A request publishes one history row per platform. The timestamp is part of
      // the id so a retried platform upload (same request_id) is emitted again.
      const id = [
        item.request_id || item.job_id || item.external_id || "",
        item.platform,
        item.upload_timestamp,
      ].join("-");
      const result = item.success
        ? "succeeded"
        : "failed";
      return {
        id,
        summary: `Upload to ${constants.PLATFORM_LABELS[item.platform] || item.platform} ${result}${item.profile_username
          ? ` (${item.profile_username})`
          : ""}`,
        ts: ts || Date.now(),
      };
    },
    async processEvents(max) {
      const lastTs = this._getLastTs();
      const items = [];
      let page = 1;
      let done = false;

      // History is returned most recent first: page until reaching already-seen rows
      while (!done && page <= MAX_PAGES) {
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

      this._setLastTs(Math.max(lastTs, ...items.map((item) => this.getTs(item))));

      // Emit in chronological order
      items.reverse().forEach((item) => this.$emit(item, this.generateMeta(item)));
    },
  },
  async run() {
    await this.processEvents();
  },
  sampleEmit,
};
