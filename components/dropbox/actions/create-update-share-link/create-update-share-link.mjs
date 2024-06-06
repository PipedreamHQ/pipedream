import dropbox from "../../dropbox.app.mjs";
import consts from "../../common/consts.mjs";

export default {
  name: "Create/Update a Share Link",
  description: "Creates or updates a public share link to the file or folder (It allows to share the file or folder with anyone). [See docs here](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#sharingCreateSharedLinkWithSettings__anchor)",
  key: "dropbox-create-update-share-link",
  version: "0.0.9",
  type: "action",
  props: {
    dropbox,
    path: {
      propDefinition: [
        dropbox,
        "path",
        () => ({
          initialOptions: [],
          filter: ({ metadata: { metadata: { [".tag"]: type } } }) => [
            "file",
            "folder",
          ].includes(type),
        }),
      ],
      description: "Type the file or folder name to search for it in the user's Dropbox.",
    },
    requirePassword: {
      type: "boolean",
      label: "Require password",
      description: "Boolean flag to enable or disable password protection.",
      default: false,
    },
    linkPassword: {
      type: "string",
      label: "Link password",
      description: "If `require_password` is `true`, this is needed to specify the password to access the link.",
      optional: true,
    },
    allowDownload: {
      type: "boolean",
      label: "Allow downloads",
      description: "Boolean flag to allow or not allow capabilities for shared links.",
    },
    expires: {
      type: "string",
      label: "Expires",
      description: "Expiration time of the shared link. By default the link never expires. Make sure to use a valid [timestamp](https://dropbox.github.io/dropbox-sdk-js/global.html#Timestamp) value.",
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
      path: this.dropbox.getPath(path),
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
    $.export("$summary", `Shared link for "${path?.label || path}" successfully created`);
    return res;
  },
};
