import onedrive from "../../microsoft_onedrive.app.mjs";

export default {
  name: "Get Table",
  description: "Download a file stored in OneDrive",
  key: "microsoft_onedrive-download-file",
  version: "0.0.1",
  type: "action",
  props: {
    onedrive,
    folder: {
      propDefinition: [
        onedrive,
        "folder",
      ],
      description: "The folder where the file is located",
    },
  },
  async run(/*{ $ }*/) {
    return this.folder;
  },
};
