import dropbox from "../../dropbox.app.mjs";
import get from "lodash/get.js";
import consts from "../../consts.mjs";

export default {
  name: "Create/Update a Share Link",
  description: "Creates or updates a public share link to the file or folder (It allows to share the file or folder with anyone). [See docs here](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#sharingCreateSharedLinkWithSettings__anchor)",
  key: "dropbox-create-update-update-a-share-link",
  version: "0.0.1",
  type: "action",
  props: {
    dropbox,
    path: {
      propDefinition: [
        dropbox,
        "pathFileFolder",
      ],
      description: "The path to be shared by the shared link.",
    },
    requirePassword: {
      type: "boolean",
      label: "Require Password",
      description: "Boolean flag to enable or disable password protection.",
      default: false,
    },
    linkPassword: {
      type: "string",
      label: "Link Password",
      description: "If `require_password` is `true`, this is needed to specify the password to access the link.",
      optional: true,
    },
    expires: {
      type: "string",
      label: "Expires",
      description: "Expiration time of the shared link. By default the link won't expire. You should use a valid [Timestamp](https://dropbox.github.io/dropbox-sdk-js/global.html#Timestamp) value",
      optional: true,
    },
    audience: {
      type: "string",
      label: "Audience",
      description: "The new audience who can benefit from the access level specified by the link's access level specified in the `link_access_level` field of `LinkPermissions`. This is used in conjunction with team policies and shared folder policies to determine the final effective audience type in the `effective_audience` field of `LinkPermissions.",
      optional: true,
      options: consts.CREATE_SHARED_LINK_AUDIENCE_OPTIONS,
    },
    access: {
      type: "string",
      label: "Access",
      description: "Requested access level you want the audience to gain from this link. Note, modifying access level for an existing link is not supported.",
      optional: true,
      options: consts.CREATE_SHARED_LINK_ACCESS_OPTIONS,
    },
    requestedVisibility: {
      type: "string",
      label: "Access",
      description: "Use audience instead. The requested access for this shared link.",
      optional: true,
      options: consts.CREATE_SHARED_LINK_REQUESTED_VISIBILITY_OPTIONS,
    },
    allowDownload: {
      type: "boolean",
      label: "Allow Download",
      description: "Boolean flag to allow or not download capabilities for shared links.",
      optional: true,
    },
    removeExpiration: {
      type: "boolean",
      label: "Remove Expiration",
      description: "If set to true, removes the expiration of the shared link. (Only used if you are editing a link)",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      path,
      requirePassword,
      linkPassword,
      expires,
      audience,
      access,
      requestedVisibility,
      allowDownload,
      removeExpiration,
    } = this;

    if (requirePassword && !linkPassword) {
      throw new Error("Since the password is required, please add a linkPassword");
    }

    const res = await this.dropbox.createSharedLink({
      path: get(path, "value", path),
      settings: {
        require_password: requirePassword,
        link_password: linkPassword,
        expires,
        audience,
        access,
        requested_visibility: requestedVisibility,
        allow_download: allowDownload,
      },
      remove_expiration: removeExpiration,
    });
    $.export("$summary", "Shared link successfully created");
    return res;
  },
};
