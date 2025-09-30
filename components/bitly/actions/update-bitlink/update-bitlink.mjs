import bitly from "../../bitly.app.mjs";
import { formatArrayStrings } from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

export default {
  name: "Update Bitlink",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "bitly-update-bitlink",
  description: "Updates fields in the specified link",
  props: {
    bitly,
    bitlink: {
      type: "string",
      label: "Bitlink",
      description: "A Bitlink made of the domain and hash",
    },
    references: {
      type: "object",
      optional: true,
      label: "References",
      description: "Bitlink references",
    },
    link: {
      type: "string",
      optional: true,
      label: "Link",
      description: "Complete bitlink url",
    },
    id: {
      type: "string",
      optional: true,
      label: "ID",
      description: "Bitlink ID",
    },
    longUrl: {
      type: "string",
      optional: true,
      label: "Long Url",
      description: "Url that was shortened",
    },
    title: {
      type: "string",
      optional: true,
      label: "Bitlink Title",
      description: "Bitlink title",
    },
    archived: {
      type: "boolean",
      optional: true,
      label: "Bitlink Archived",
      description: "Archived bitlink (true or false)",
    },
    createdAt: {
      type: "string",
      optional: true,
      label: "Created At",
      description: "Bitlink created date. Example: 2006-03-12T16:29:46+0000",
    },
    createdBy: {
      type: "string",
      optional: true,
      label: "Created By",
      description: "Bitlink created_by ID",
    },
    clientId: {
      type: "string",
      optional: true,
      label: "Client ID",
      description: "Bitlink client ID",
    },
    customBitlinks: {
      type: "string[]",
      optional: true,
      label: "Custom Bitlinks",
      description: `Provide an array of custom bitlinks
        Example: 
        \`[
          "https://microsoft.com/documentation",
          "https://github.com/contact",          
          "https://gitlab.com/forum",
          "https://pipedream.com/chat          
        ]\`
      `,
    },
    tags: {
      type: "string[]",
      optional: true,
      label: "Tags",
      description: "Enter array of tags",
    },
    launchpadIds: {
      type: "string[]",
      optional: true,
      label: "Launchpad IDs",
      description: "Enter array of Launchpad IDs",
    },
    deeplinks: {
      type: "string[]",
      optional: true,
      label: "Deeplinks",
      description: `Provide an object. Each object should represent a row.
        Example: 
        \`
            { 
              "guid": "Ra1bcD2eF3h", 
              "bitlink": "bit.ly/documentation", 
              "app_uri_path": "/store?id': '123456", 
              "install_url": "https://play.google.com/store/apps/details?id=com.bitly.app',
              "app_guid": "Ab1cdE2fG3h", 
              "os": "android", 
              "install_type": "promote_install",
              "created": "2011-10-05T14:48:00.000Z",
              "modified": "2011-10-06T14:48:00.000Z"
              "brand_guid": "Ba1bc23dE4F" 
            } 
        \`
      `,
    },
    isDeleted: {
      type: "boolean",
      optional: true,
      label: "Is Deleted",
      description: "Bitlink deleted (true or false)",
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const {
      bitlink,
      deeplinks,
      tags,
    } = this;

    const updatedDeepLink = formatArrayStrings(
      deeplinks,
      constants.ALLOWED_DEEPLINK_KEYS,
      "deeplinks",
    );

    const payload = {
      references: this.references,
      link: this.link,
      id: this.id,
      long_url: this.longUrl,
      title: this.title,
      archived: this.archived,
      created_at: this.createdAt,
      created_by: this.createdBy,
      client_id: this.clientId,
      custom_bitlinks: this.customBitlinks,
      launchpad_ids: this.launchpadIds,
      is_deleted: this.isDeleted,
    };

    tags?.length && (payload.tags = tags);
    updatedDeepLink?.length && (payload.deeplinks = updatedDeepLink);
    const response = await this.bitly.updateBitlink(bitlink, payload);
    response && $.export("$summary", "Bitlink updated successfully");
    return response;
  },
};
