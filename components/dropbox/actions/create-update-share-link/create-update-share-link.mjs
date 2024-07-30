import common from "./common.mjs";
import consts from "../../common/consts.mjs";

export default {
  name: "Create/Update a Share Link",
  description: "Creates or updates a public share link to the file or folder (It allows you to share the file or folder with anyone). [See the documentation](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#sharingCreateSharedLinkWithSettings__anchor)",
  key: "dropbox-create-update-share-link",
  version: "0.0.10",
  type: "action",
  props: {
    ...common.props,
    alert: {
      type: "alert",
      alertType: "warning",
      content: `Dropbox Free and Basic users are able to create a publicly-available share link which allows downloads.
        \nIn order to utilize advanced link sharing functionality, you must be on a Dropbox Essentials plan or higher. See the Dropbox pricing [page](https://www.dropbox.com/plans?trigger=nr#:~:text=Collaborative%20sharing) for more details.`,
    },
    path: {
      propDefinition: [
        common.props.dropbox,
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
  },
  async additionalProps() {
    const props = {};

    const accountType = await this.getCurrentAccount();
    if (accountType !== "basic") {
      props.requirePassword = {
        type: "boolean",
        label: "Require Password",
        description: "Boolean flag to enable or disable password protection.",
        default: false,
        reloadProps: true,
      };
      props.linkPassword = {
        type: "string",
        label: "Link Password",
        description: "If `require_password` is `true`, this is needed to specify the password to access the link.",
        hidden: !this.requirePassword,
      };
      props.allowDownload = {
        type: "boolean",
        label: "Allow Downloads",
        description: "Boolean flag to allow or not allow capabilities for shared links.",
      };
      props.expires = {
        type: "string",
        label: "Expires",
        description: "Expiration time of the shared link. By default the link never expires. Make sure to use a valid [timestamp](https://dropbox.github.io/dropbox-sdk-js/global.html#Timestamp) value. Example: `2024-07-18T20:00:00Z`",
        optional: true,
      };
      props.access = {
        type: "string",
        label: "Access",
        description: "Requested access level you want the audience to gain from this link. Note, modifying access level for an existing link is not supported.",
        optional: true,
        options: consts.CREATE_SHARED_LINK_ACCESS_OPTIONS,
      };
    }

    return props;
  },
  methods: {
    async getCurrentAccount() {
      const dpx = await this.dropbox.sdk();
      const { result: { account_type: accountType } } = await dpx.usersGetCurrentAccount();
      return accountType[".tag"];
    },
  },
  async run({ $ }) {
    const {
      path,
      requirePassword,
      linkPassword,
      expires,
      access,
    } = this;

    const accountType = await this.getCurrentAccount();
    const allowDownload = accountType === "basic"
      ? true
      : this.allowDownload;

    if (requirePassword && !linkPassword) {
      throw new Error("Since the password is required, please add a linkPassword");
    }

    if (expires && Date.parse(expires) < Date.now()) {
      throw new Error("Expire date must be later than the current datetime");
    }

    const res = await this.dropbox.createSharedLink({
      path: this.dropbox.getPath(path),
      settings: {
        require_password: requirePassword,
        link_password: linkPassword,
        expires,
        access,
        allow_download: allowDownload,
      },
    });
    $.export("$summary", `Shared link for "${path?.label || path}" successfully created`);
    return res;
  },
};
