import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../zoho_workdrive.app.mjs";
import { additionalFolderProps } from "../../common/additionalFolderProps.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Zoho WorkDrive on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    teamId: {
      propDefinition: [
        app,
        "teamId",
      ],
    },
  },
  async additionalProps() {
    return additionalFolderProps.call(this);
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
  },
  async run() {
    await this.startEvent();
  },
};
