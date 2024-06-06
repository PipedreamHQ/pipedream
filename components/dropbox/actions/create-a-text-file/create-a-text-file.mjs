import dropbox from "../../dropbox.app.mjs";

export default {
  name: "Create a Text File",
  description: "Creates a brand new text file from plain text content you specify. [See docs here](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesUpload__anchor)",
  key: "dropbox-create-a-text-file",
  version: "0.0.9",
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
        "path",
        () => ({
          filter: ({ metadata: { metadata: { [".tag"]: type } } }) => type === "folder",
        }),
      ],
      description: "Type the folder name to search for it in the user's Dropbox. If not filled, it will be created in the root folder.",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of your new file",
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
      path: this.dropbox.getNormalizedPath(path, true) + name,
      autorename: true,
    });

    $.export("$summary", `${name} successfully created in the folder ${path?.label || path}`);
    return res;
  },
};
