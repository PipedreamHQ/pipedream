import { removeNullEntries } from "../../common/utils.mjs";
import bitly from "../../bitly.app.mjs";

export default {
  key: "bitly-list-bitlink-by-group",
  name: "List Bitlinks by group",
  description:
    "Retrieves all Bitlinks for a given group. [See the docs here](https://dev.bitly.com/api-reference#getBitlinksByGroup)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    bitly,
    groupGuid: {
      type: "string",
      label: "Group GUID",
      description: "A GUID for a Bitly group",
    },
    size: {
      type: "string",
      label: "Size",
      description: "The quantity of items to be be returned",
      optional: true,
      default: "10",
    },
    page: {
      type: "string",
      label: "Page",
      description: "Integer specifying the numbered result at which to start",
      optional: true,
      default: "1",
    },
    keyword: {
      type: "string",
      label: "Keyword",
      description: "Custom keyword to filter on history entries",
      optional: true,
    },
    query: {
      type: "string",
      label: "Query",
      description: "The value that you would like to search",
      optional: true,
    },
    createdBefore: {
      type: "string",
      label: "Created before",
      description: "Timestamp as an integer unix epoch",
      optional: true,
    },
    createdAfter: {
      type: "string",
      label: "Created after",
      description: "Timestamp as an integer unix epoch",
      optional: true,
    },
    modifiedAfter: {
      type: "string",
      label: "Modified after",
      description: "Timestamp as an integer unix epoch",
      optional: true,
    },
    archived: {
      type: "string",
      label: "Archived",
      description: "Whether or not to include archived bitlinks",
      default: "off",
      optional: true,
      options: [
        "on",
        "off",
        "both",
      ],
    },
    deeplinks: {
      type: "string",
      label: "Deeplinks",
      description: "Filter to only Bitlinks that contain deeplinks",
      default: "both",
      optional: true,
      options: [
        "on",
        "off",
        "both",
      ],
    },
    domainDeeplinks: {
      type: "string",
      label: "Domain deeplinks",
      description:
        "Filter to only Bitlinks that contain deeplinks configured with a custom domain",
      default: "both",
      optional: true,
      options: [
        "on",
        "off",
        "both",
      ],
    },
    campaignGuid: {
      type: "string",
      label: "Campaign guid",
      description:
        "Filter to return only links for the given campaign GUID, can be provided",
      optional: true,
    },
    channelGuid: {
      type: "string",
      label: "Channel guid",
      description:
        "Filter to return only links for the given channel GUID, can be provided, overrides all other parameters",
      optional: true,
    },
    customBitlink: {
      type: "string",
      label: "Custom bitlink",
      description: "Filter to only Bitlinks that contain deeplinks",
      default: "both",
      optional: true,
      options: [
        "on",
        "off",
        "both",
      ],
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Filter by given tags",
      optional: true,
    },
    launchpadIds: {
      type: "string[]",
      label: "Launchpad IDs",
      description: "This is an array of strings",
      optional: true,
    },
    encodingLogin: {
      type: "string[]",
      label: "Encoding Login",
      description:
        "Filter by the login of the authenticated user that created the Bitlink. This is an array of strings",
      optional: true,
    },
  },
  async run({ $ }) {
    let next;
    let data = [];
    let result = null;
    let params = removeNullEntries({
      size: this.size,
      page: this.page,
      keyword: this.keyword,
      query: this.query,
      created_before: this.createdBefore,
      created_after: this.createdAfter,
      modified_after: this.modifiedAfter,
      archived: this.archived,
      deeplinks: this.deeplinks,
      domain_deeplinks: this.domainDeeplinks,
      campaign_guid: this.campaignGuid,
      channel_guid: this.channelGuid,
      custom_bitlink: this.customBitlink,
      tags: this.tags,
      launchpad_ids: this.launchpadIds,
      encoding_login: this.encodingLogin,
    });
    do {
      params.page++;
      result = await this.bitly.listBitlinkByGroup(this.groupGuid, params);
      next = result.pagination?.next;
      result?.links?.length && (data = [
        ...data,
        ...result.links,
      ]);
    } while (next);
    $.export("$summary", `Successfully listed ${data.length} bitlinks.`);
    return data;
  },
};
