import hubstaff from "../../hubstaff.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "hubstaff-schedule-updated",
  name: "Schedule Updated",
  description: "Emit new event when a schedule is updated in Hubstaff. [See the documentation](https://developer.hubstaff.com/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    hubstaff,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    organizationId: {
      propDefinition: [
        hubstaff,
        "organizationId",
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.run();
    },
    async activate() {
      // Logic to activate the source, if needed
    },
    async deactivate() {
      // Logic to deactivate the source, if needed
    },
  },
  methods: {
    _getLastCheckedTime() {
      return this.db.get("lastCheckedTime") || new Date().toISOString();
    },
    _setLastCheckedTime(time) {
      this.db.set("lastCheckedTime", time);
    },
  },
  async run() {
    const lastCheckedTime = this._getLastCheckedTime();
    const currentTime = new Date().toISOString();

    const schedules = await axios(this, {
      method: "GET",
      url: `${this.hubstaff._baseUrl()}/organizations/${this.organizationId}/schedules`,
      headers: {
        Authorization: `Bearer ${this.hubstaff.$auth.oauth_access_token}`,
      },
      params: {
        updated_since: lastCheckedTime,
      },
    });

    for (const schedule of schedules) {
      this.$emit(schedule, {
        id: schedule.id,
        summary: `Schedule updated: ${schedule.name}`,
        ts: new Date(schedule.updated_at).getTime(),
      });
    }

    this._setLastCheckedTime(currentTime);
  },
};
