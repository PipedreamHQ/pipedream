import waitwhile from "../../app/waitwhile.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Search Customers",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "waitwhile-search-customers",
  description: "Search for customers. [See the doc here](https://developers.waitwhile.com/reference/searchcustomers)",
  props: {
    waitwhile,
    locationId: {
      propDefinition: [
        waitwhile,
        "locationId",
      ],
    },
    state: {
      label: "State",
      type: "string",
      optional: true,
      description: "State of visit",
    },
    tag: {
      propDefinition: [
        waitwhile,
        "tag",
      ],
    },
    q: {
      label: "Query",
      type: "string",
      optional: true,
      description: "Search query, prefix match on name, phone, email or customer identifier",
    },
    limit: {
      propDefinition: [
        waitwhile,
        "limit",
      ],
    },
    page: {
      label: "Page",
      type: "integer",
      optional: true,
      description: "Page in results",
    },
    fromDate: {
      propDefinition: [
        waitwhile,
        "fromDate",
      ],
    },
    toDate: {
      propDefinition: [
        waitwhile,
        "toDate",
      ],
    },
    fromTime: {
      propDefinition: [
        waitwhile,
        "fromTime",
      ],
    },
    toTime: {
      propDefinition: [
        waitwhile,
        "toTime",
      ],
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const params = {
      locationId: this.locationId,
      state: this.state,
      tag: this.tag,
      q: this.q,
      limit: this.limit,
      page: this.page,
      fromDate: this.fromDate,
      toDate: this.toDate,
      fromTime: this.fromTime,
      toTime: this.toTime,
    };
    const data = await this.waitwhile.searchCustomers(params);
    $.export("summary", "Successfully searched for customers");
    return data;
  },
});
