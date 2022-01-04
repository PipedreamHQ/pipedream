import dropbox from "../../dropbox.app.mjs";
import common from "../common.mjs";

export default {
  ...common,
  name: "Create a Text File",
  description: "Creates a brand new text file from plain text content you specify. [See docs here](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesUpload__anchor)",
  key: "dropbox-create-a-text-file",
  version: "0.0.1",
  type: "action",
  props: {
    dropbox,
    name: {
      type: "string",
      label: "File name",
      description: "Your new file name.",
    },
    path: {
      propDefinition: [
        dropbox,
        "pathFolder",
      ],
      description: "The Path in the user's Dropbox to create the file. If not filled, it will be created on the root folder. (Please use a valid path to filter the values)",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of you new file",
    },
  },
  async run({ $ }) {
    const {
      name,
      content,
      path,
    } = this;

    const res = await this.dropbox.uploadFile({
      contents: Buffer.from(content),
      path: this.getNormalizedPath(path, true) + name,
      autorename: true,
    });

    $.export("$summary", "Text file successfully created");
    return res;
  },
};
