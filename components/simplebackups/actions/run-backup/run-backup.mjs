import app from "../../simplebackups.app.mjs";

export default {
  name: "Run Backup",
  version: "0.0.1",
  key: "run-backup",
  description: "Run a backup.",
  props: {
    app,
    backupId: {
      type: "integer",
      label: "Backup ID",
      description: "The ID of the backup to run.",
      optional: false,
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const { data } = await this.app.runBackup(this.backupId);

    $.export("$summary", `Backup ${this.backupId} has been run.`);

    return {
      data,
    };
  },
};
