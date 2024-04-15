import app from "../../simplebackups.app.mjs";

export default {
  name: "Get Download Link",
  version: "0.0.1",
  key: "simplebackups-get-download-link",
  description: "Get the download link for a backup or backup log. [See the documentation](https://simplebackups.docs.apiary.io/#/reference/backups/get-download-link)",
  props: {
    app,
    backupId: {
      type: "integer",
      label: "Backup ID",
      description: "The ID of the backup to get the download link for.",
    },
    backupLogId: {
      type: "integer",
      label: "Backup Log ID",
      description: "The ID of the backup log to get the download link for.",
      optional: true,
    },
  },
  type: "action",

  async run({ $ }) {
    const { data } = await this.app.getDownloadLink(
      $,
      this.backupId,
      this.backupLogId ?? null,
    );

    $.export("$summary", data.message);

    return {
      data,
    };
  },
};
