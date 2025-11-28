import hubspot from "../../hubspot.app.mjs";
import { OBJECT_TYPE } from "../../common/constants.mjs";

export default {
  key: "hubspot-list-threads",
  name: "List Threads",
  description: "Retrieves a list of threads. [See the documentation](https://developers.hubspot.com/docs/api-reference/conversations-conversations-inbox-&-messages-v3/public-thread/get-conversations-v3-conversations-threads)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    hubspot,
    associatedContactId: {
      propDefinition: [
        hubspot,
        "objectId",
        () => ({
          objectType: OBJECT_TYPE.CONTACT,
        }),
      ],
      label: "Associated Contact ID",
      description: "The ID of the contact to filter threads by",
      optional: true,
    },
    association: {
      type: "string",
      label: "Association",
      description: "You can specify an association type here of TICKET. If this is set the response will included a thread associations object and associated ticket id if present. If there are no associations to a ticket with this conversation, then the thread associations object will not be present on the response.",
      options: [
        "TICKET",
      ],
      optional: true,
    },
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Whether to return only results that have been archived",
      optional: true,
    },
    inboxId: {
      propDefinition: [
        hubspot,
        "inboxId",
      ],
      description: "The ID of the conversations inbox you can optionally include to retrieve the associated messages for. This parameter cannot be used in conjunction with the associatedContactId property.",
      optional: true,
    },
    property: {
      type: "string",
      label: "Property",
      description: "A specific property to include in the thread response",
      optional: true,
    },
    after: {
      type: "string",
      label: "After",
      description: "The paging cursor token of the last successfully read resource will be returned as the paging.next.after JSON property of a paged response containing more results.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of results to display per page",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.hubspot.listThreads({
      $,
      params: {
        associatedContactId: this.associatedContactId,
        association: this.association,
        archived: this.archived,
        inboxId: this.inboxId,
        property: this.property,
        after: this.after,
        limit: this.limit,
      },
    });
    $.export("$summary", `Found ${response?.results?.length} thread${response?.results?.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
