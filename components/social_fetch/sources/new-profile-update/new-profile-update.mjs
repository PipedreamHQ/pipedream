import { createHash } from "node:crypto";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { getObjectDiff } from "../../common/utils.mjs";
import app from "../../social_fetch.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "social_fetch-new-profile-update",
  name: "New Profile Update",
  description:
    "Emit new event when a monitored profile changes. [See the documentation](https://www.socialfetch.dev/docs/api)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    platform: {
      propDefinition: [
        app,
        "platform",
      ],
    },
    handle: {
      propDefinition: [
        app,
        "handle",
      ],
    },
    profileUrl: {
      propDefinition: [
        app,
        "profileUrl",
      ],
    },
  },
  methods: {
    _getLastProfile() {
      return this.db.get("lastProfile") || {};
    },
    _setLastProfile(lastProfile) {
      this.db.set("lastProfile", lastProfile);
    },
    _buildEmitMetadata(profile, diff) {
      const identity =
        this.handle?.trim() ||
        this.profileUrl?.trim() ||
        profile?.profile?.platformUserId ||
        profile?.profile?.handle ||
        this.platform;
      const identityHash = createHash("sha256")
        .update(identity)
        .digest("hex")
        .slice(0, 16);
      const diffHash = createHash("sha256")
        .update(JSON.stringify(diff))
        .digest("hex")
        .slice(0, 16);

      return {
        id: `${this.platform}:${identityHash}:${diffHash}`,
        ts: Date.now(),
      };
    },
    async emitEvent() {
      const lastProfile = this._getLastProfile();
      const data = await this.app.getProfile({
        platform: this.platform,
        handle: this.handle,
        profileUrl: this.profileUrl,
      });

      const profile = data?.data ?? data;
      const diff = getObjectDiff(lastProfile, profile);

      if (Object.keys(diff).length > 0) {
        this._setLastProfile(profile);
        const label = this.app.profileSummaryLabel(
          this.platform,
          this.handle,
          this.profileUrl,
        );
        const {
          id, ts,
        } = this._buildEmitMetadata(profile, diff);
        this.$emit(
          {
            profile,
            diff,
          },
          {
            id,
            summary: `Profile update for ${label}`,
            ts,
          },
        );
      }
    },
  },
  async run() {
    await this.emitEvent();
  },
  sampleEmit,
};
