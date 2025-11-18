import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-list-egift-links",
  name: "List eGift Links",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieve a list of all eGift links. [See the documentation](https://sendoso.docs.apiary.io/#reference/egift-management)",
  type: "action",
  props: {
    sendoso,
    limit: {
      propDefinition: [
        sendoso,
        "limit",
      ],
    },
    offset: {
      propDefinition: [
        sendoso,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const {
      limit,
      offset,
    } = this;

    const response = await this.sendoso.listEgiftLinks({
      $,
      params: {
        limit,
        offset,
      },
    });

    const count = Array.isArray(response) ?
      response.length :
      (response.data?.length || 0);
    $.export("$summary", `Successfully retrieved ${count} eGift link(s)`);
    return response;
  },
};

