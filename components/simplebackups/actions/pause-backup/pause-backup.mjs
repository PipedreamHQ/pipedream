import app from "../../simplebackups.app.mjs";

export default {
  name: "Pause Backup",
  version: "0.0.1",
  key: "simplebackups-pause-backup",
  description: "Pause a backup schedule given its ID. [See the documentation](https://simplebackups.docs.apiary.io/#/reference/backups/pause-backup)",
  props: {
    app,
    backupId: {
      type: "integer",
      label: "Backup ID",
      description: "The ID of the backup to get the download link for.",
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const { data } = await this.app.pauseBackup($, this.backupId);

    $.export(
      "$summary",
      `Backup paused successfully. Backup ID: ${this.backupId}`,
    );

    return {
      data,
    };
  },
};
