import dropbox from "../../dropbox.app.mjs";

export default {
  name: "Get Shared Link Metadata",
  description: "Retrieves the shared link metadata for a given shared link. [See the documentation](https://www.dropbox.com/developers/documentation/http/documentation#sharing-get_shared_link_metadata)",
  key: "dropbox-get-shared-link-metadata",
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
    const { result } = await this.dropbox.getSharedLinkMetadata({
      url: this.sharedLinkUrl,
      link_password: this.linkPassword,
    });
    $.export("$summary", "Successfully retrieved shared link metadata");
    return result;
  },
};
