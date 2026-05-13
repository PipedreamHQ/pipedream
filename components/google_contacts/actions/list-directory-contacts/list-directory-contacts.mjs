import common from "../common/base.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "google_contacts-list-directory-contacts",
  name: "List Directory Contacts",
  description: "Lists contacts from the Google Workspace directory (domain contacts). Use this to search directory profiles and domain shared contacts, as opposed to the user's personal contacts. Requires directory.readonly OAuth scope. Returns names, email addresses, phone numbers, and other fields specified in the read mask. [See the documentation](https://developers.google.com/people/api/rest/v1/people/listDirectoryPeople)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    fields: {
      propDefinition: [
        common.props.googleContacts,
        "fields",
      ],
    },
    source: {
      type: "string",
      label: "Source",
      description: "Directory source to return",
      options: constants.SOURCE_OPTIONS,
    },
    mergeSources: {
      type: "string[]",
      label: "Merge Sources",
      description: "Optional. Additional data to merge into the directory sources if they are connected through verified join keys such as email addresses or phone numbers.",
      options: constants.MERGE_SOURCE_OPTIONS,
      optional: true,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Optional. The number of people to include in the response. Valid values are between 1 and 1000, inclusive. Defaults to 100 if not set",
      optional: true,
      default: 100,
      min: 1,
      max: 1000,
    },
    pageToken: {
      type: "string",
      label: "Page Token",
      description: "Optional. A page token, received from a previous response nextPageToken. Provide this to retrieve the subsequent page.",
      optional: true,
    },
    requestSyncToken: {
      type: "boolean",
      label: "Request Sync Token",
      description: "Optional. Whether the response should return nextSyncToken. It can be used to get incremental changes since the last request by setting it on the request syncToken.",
      optional: true,
    },
    syncToken: {
      type: "string",
      label: "Sync Token",
      description: "Optional. A sync token, received from a previous response nextSyncToken Provide this to retrieve only the resources changed since the last request.",
      optional: true,
    },
  },
  methods: {
    async processResults(client) {
      const params = {
        readMask: this.fields.join(),
        sources: this.source,
        mergeSources: this.mergeSources?.join(),
        pageSize: this.pageSize,
        pageToken: this.pageToken,
        requestSyncToken: this.requestSyncToken,
        syncToken: this.syncToken,
      };

      const response = await this.googleContacts.listDirectoryContacts(client, params);
      return response;
    },
    emitSummary($, response) {
      const count = Array.isArray(response)
        ? response.length
        : (response?.people?.length ?? 0);
      $.export("$summary", `Successfully retrieved ${count} directory contacts`);
    },
  },
};
