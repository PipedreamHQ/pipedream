import dropbox from "../../dropbox.app.mjs";

export default {
  name: "Get Shared Link File",
  description: "Get a file from a shared link. [See the documentation](https://www.dropbox.com/developers/documentation/http/documentation#sharing-get_shared_link_file)",
  key: "dropbox-get-shared-link-file",
  version: "0.0.1",
  type: "action",
  props: {
    dropbox,
    sharedLinkUrl: {
      propDefinition: [
        dropbox,
        "sharedLinkUrl",
      ],
    },
    linkPassword: {
      propDefinition: [
        dropbox,
        "linkPassword",
      ],
    },
  },
  async run({ $ }) {
    const { result } = await this.dropbox.getSharedLinkFile({
      url: this.sharedLinkUrl,
      link_password: this.linkPassword,
    });
    $.export("$summary", "Successfully retrieved shared link file");
    return result;
  },
};
