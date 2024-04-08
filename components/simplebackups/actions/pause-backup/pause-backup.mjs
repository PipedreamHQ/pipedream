import app from "../../simplebackups.app.mjs";

export default {
  name: "Pause Backup",
  version: "0.0.1",
  key: "pause-backup",
  description: "Pause a backup.",
  props: {
    app,
    backupId: {
      type: "integer",
      label: "Backup ID",
      description: "The ID of the backup to get the download link for.",
      optional: false,
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const { data } = await this.app.pauseBackup(this.backupId);

    $.export(
      "$summary",
      `Backup paused successfully. Backup ID: ${this.backupId}`,
    );

    return {
      data,
    };
  },
};
