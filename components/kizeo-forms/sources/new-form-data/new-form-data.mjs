import { axios } from "@pipedream/platform";
import kizeoForms from "../../kizeo-forms.app.mjs";

export default {
  key: "kizeo-forms-new-form-data",
  name: "New Form Data",
  description: "Emits an event each time new form data is created in Kizeo Forms. [See the documentation](https://kizeo.github.io/kizeo-forms-documentations/docs/en/restv3)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    kizeoForms,
    db: "$.service.db",
    formId: {
      propDefinition: [
        kizeoForms,
        "formId",
      ],
    },
    userId: {
      propDefinition: [
        kizeoForms,
        "userId",
        (c) => ({
          optional: true,
        }),
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    async _getUnreadFormData() {
      return this.kizeoForms.retrieveUnreadFormData({
        formId: this.formId,
        userId: this.userId,
      });
    },
    _setLastProcessedTimestamp(timestamp) {
      this.db.set("lastProcessedTimestamp", timestamp);
    },
    _getLastProcessedTimestamp() {
      return this.db.get("lastProcessedTimestamp") || 0;
    },
  },
  hooks: {
    async deploy() {
      // Emit the last 50 unread form data during deploy
      const unreadData = await this._getUnreadFormData();
      const toEmit = unreadData.slice(-50).reverse();
      toEmit.forEach((data) => {
        const ts = Date.parse(data.time);
        this.$emit(data, {
          id: data.id,
          summary: `New form data: ${data.id}`,
          ts,
        });
      });
      const lastChecked = toEmit.length > 0
        ? Date.parse(toEmit[0].time)
        : new Date().getTime();
      this._setLastProcessedTimestamp(lastChecked);
    },
  },
  async run() {
    const lastProcessedTimestamp = this._getLastProcessedTimestamp();
    const unreadData = await this._getUnreadFormData();
    const newUnreadData = unreadData.filter((data) => {
      const dataTimestamp = Date.parse(data.time);
      return dataTimestamp > lastProcessedTimestamp;
    });

    newUnreadData.forEach((data) => {
      const ts = Date.parse(data.time);
      this.$emit(data, {
        id: data.id,
        summary: `New form data: ${data.id}`,
        ts,
      });
    });

    if (newUnreadData.length > 0) {
      const latestDataTime = newUnreadData[newUnreadData.length - 1].time;
      this._setLastProcessedTimestamp(Date.parse(latestDataTime));
    }
  },
};
