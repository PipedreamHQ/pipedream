const { google } = require("googleapis");
const get = require("lodash.get");

module.exports = {
  type: "app",
  app: "google_drive",
  propDefinitions: {
    file: {
      description: "The files you want to watch for changes",
      label: "Files",
      type: "string[]",
      optional: true,
    },
  },
  methods: {
    _tokens() {
      const access_token = get(this, "$auth.oauth_access_token");
      const refresh_token = get(this, "$auth.oauth_refresh_token");
      return {
        access_token,
        refresh_token,
      };
    },
    // Returns an authenticated drive object you can use to interact with the Drive API
    drive() {
      const auth = new google.auth.OAuth2();
      auth.setCredentials(this._tokens());
      return google.drive({ version: "v3", auth });
    },
    async listFiles() {
      const drive = this.drive();
      const { files } = (await drive.files.list()).data;
      return files.map((file) => {
        return { label: file.name, value: file.id };
      });
    },
    async startNotifications(files) {
      // Make watch request for files. If empty, watch changes for all files
      return {
        channelID,
        expiration,
      };
    },
    async stopNotifications(channelID) {},
  },
};
