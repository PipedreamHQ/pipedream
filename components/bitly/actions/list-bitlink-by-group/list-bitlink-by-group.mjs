import { removeNullEntries } from "../../common/common.utils.mjs";
import bitly from "../../bitly.app.mjs";

export default {
  key: "bitly-list-bitlink-by-group",
  name: "List Bitlinks by group",
  description:
    "Retrieves all Bitlinks for a given group. [See the docs here](https://dev.bitly.com/api-reference#getBitlinksByGroup)",
  version: "0.0.1",
  type: "action",
  props: {
    bitly,
    group_guid: {
      type: "string",
      description: "A GUID for a Bitly group",
    },
    size: {
      type: "string",
      description: "The quantity of items to be be returned",
      optional: true,
      default: "10",
    },
    page: {
      type: "string",
      description: "Integer specifying the numbered result at which to start",
      optional: true,
      default: "1",
    },
    keyword: {
      type: "string",
      description: "Custom keyword to filter on history entries",
      optional: true,
    },
    query: {
      type: "string",
      description: "The value that you would like to search",
      optional: true,
    },
    created_before: {
      type: "string",
      description: "Timestamp as an integer unix epoch",
      optional: true,
    },
    created_after: {
      type: "string",
      description: "Timestamp as an integer unix epoch",
      optional: true,
    },
    modified_after: {
      type: "string",
      description: "Timestamp as an integer unix epoch",
      optional: true,
    },
    archived: {
      type: "string",
      description: "Whether or not to include archived bitlinks",
      default: "off",
      optional: true,
      options: ["on", "off", "both"],
    },
    deeplinks: {
      type: "string",
      description: "Filter to only Bitlinks that contain deeplinks",
      default: "both",
      optional: true,
      options: ["on", "off", "both"],
    },
    domain_deeplinks: {
      type: "string",
      description:
        "Filter to only Bitlinks that contain deeplinks configured with a custom domain",
      default: "both",
      optional: true,
      options: ["on", "off", "both"],
    },
    campaign_guid: {
      type: "string",
      description:
        "Filter to return only links for the given campaign GUID, can be provided",
      optional: true,
    },
    channel_guid: {
      type: "string",
      description:
        "Filter to return only links for the given channel GUID, can be provided, overrides all other parameters",
      optional: true,
    },
    custom_bitlink: {
      type: "string",
      description: "Filter to only Bitlinks that contain deeplinks",
      default: "both",
      optional: true,
      options: ["on", "off", "both"],
    },
    tags: {
      type: "string[]",
      description: "Filter by given tags",
      optional: true,
    },
    launchpad_ids: {
      type: "string[]",
      description: "Filter by launchpad id",
      optional: true,
    },
    encoding_login: {
      type: "string[]",
      description:
        "Filter by the login of the authenticated user that created the Bitlink",
      optional: true,
    },
  },
  async run({ $ }) {
    let next;
    let data = [];
    let pagination = {};
    let result = null;
    let params = removeNullEntries({
      size: this.size,
      page: this.page,
      keyword: this.keyword,
      query: this.query,
      created_before: this.created_before,
      created_after: this.created_after,
      modified_after: this.modified_after,
      archived: this.archived,
      deeplinks: this.deeplinks,
      domain_deeplinks: this.domain_deeplinks,
      campaign_guid: this.campaign_guid,
      channel_guid: this.channel_guid,
      custom_bitlink: this.custom_bitlink,
      tags: this.tags,
      launchpad_ids: this.launchpad_ids,
      encoding_login: this.encoding_login,
    });
    do {
      params.page++;
      result = await this.bitly.listBitlinkByGroup(this.group_guid, params);
      next = result.pagination?.next;
      result?.links?.length && (data = [...data, ...result.links]);
      pagination = result?.pagination;
    } while (next);
    $.export("$summary", `Successfully listed ${data.length} bitlinks.`);
    return data;
  },
};
