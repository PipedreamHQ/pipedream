import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { getObjectDiff } from "../../common/utils.mjs";
import app from "../../scrapecreators.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "scrapecreators-new-profile-update",
  name: "New Profile Update",
  description: "Emit new event when a new profile is updated. [See the documentation](https://docs.scrapecreators.com/introduction)",
  version: "0.0.1",
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
    profileId: {
      propDefinition: [
        app,
        "profileId",
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
    async emitEvent() {
      const lastProfile = this._getLastProfile();
      const data = await this.app.fetchCreatorProfile({
        platform: this.platform,
        profileId: this.profileId,
      });

      const profile = data?.data?.user || data?.data || data;

      const diff = getObjectDiff(lastProfile, profile);

      if (Object.keys(diff).length > 0) {
        this._setLastProfile(profile);
        this.$emit({
          profile,
          diff,
        }, {
          id: Date.now(),
          summary: `New profile update for ${this.profileId}`,
          ts: Date.parse(new Date()),
        });
      }

    },
  },
  hooks: {
    async deploy() {
      await this.emitEvent();
    },
  },
  async run() {
    await this.emitEvent();
  },
  sampleEmit,
};
