import { axios } from "@pipedream/platform";

export default {
  name: "Resume Backup",
  version: "0.0.1",
  key: "resume-backup",
  description: "Resume a backup.",
  props: {
    token: {
      type: "string",
      label: "API Token",
      description: "The API token for SimpleBackups.",
      optional: false,
    },
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
    const endpoint = `/backup/${this.backupId}/resume`;

    const response = await axios($, {
      url: `https://my.simplebackups.io/api${endpoint}`,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
        "Authorization": `Bearer ${this.token}`,
      },
    });

    console.log(response);

    return response;
  },
};
