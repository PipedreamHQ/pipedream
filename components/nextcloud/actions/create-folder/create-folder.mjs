import nextcloud from "../../nextcloud.app.mjs";

export default {
  key: "nextcloud-create-folder",
  name: "Create Folder",
  description: "Creates a new folder at the specified path in Nextcloud.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    nextcloud,
    path: {
      propDefinition: [
        nextcloud,
        "path",
      ],
    },
  },
  async run({ $ }) {
    try {
      const response = await this.nextcloud.createFolder({
        path: this.path,
      });
      $.export("$summary", `Successfully created folder at ${this.path}`);
      return response;
    } catch (error) {
      console.error(error);
    }
  },
};
