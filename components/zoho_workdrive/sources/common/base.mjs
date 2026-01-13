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
    manuallyEnterFolderId: {
      type: "boolean",
      label: "Manually Enter Folder ID",
      description: "If true, the folder ID can be manually entered instead of being selected from the list of folders",
      default: false,
      optional: true,
      reloadProps: true,
    },
  },
  async additionalProps(existingProps) {
    return additionalFolderProps.call(this, existingProps);
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    _getValidatedLastDate() {
      const lastDate = this._getLastDate();
      if (Number.isInteger(lastDate)) {
        return lastDate;
      }
      const parsed = Date.parse(lastDate);
      return isNaN(parsed)
        ? 0
        : parsed;
    },
  },
  async run() {
    await this.startEvent();
  },
};
