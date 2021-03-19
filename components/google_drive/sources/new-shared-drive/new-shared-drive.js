const googleDrive = require("../../google_drive.app.js");

module.exports = {
  key: "google_drive-new-shared-drive",
  name: "New Shared Drive",
  description: "Emits a new event any time a shared drive is created.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    googleDrive,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 30 minutes
      },
    },
  },
  methods: {
    generateMeta(drive) {
      const ts = new Date(drive.createdTime).getTime();
      return {
        id: drive.id,
        summary: drive.name,
        ts,
      };
    },
  },
  async run() {
    const driveIds = this.db.get("driveIds") || [];
    const { options: drives } = await this.googleDrive.listDrives(null);
    for (const drive of drives) {
      if (driveIds.includes(drive.value) || drive.value == "myDrive") continue;
      driveIds.push(drive.value);
      const newDrive = await this.googleDrive.getDrive(drive.value);
      const meta = this.generateMeta(newDrive);
      this.$emit(newDrive, meta);
    }
    this.db.set("driveIds", driveIds);
  },
};