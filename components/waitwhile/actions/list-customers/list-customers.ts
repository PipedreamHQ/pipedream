import waitwhile from "../../app/waitwhile.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "List Customers",
  version: "0.0.1",
  key: "waitwhile-list-customers",
  description: "List of customers",
  props: {
    waitwhile,
    limit: {
      label: "Limit",
      type: "integer",
      optional: true,
      description: "Max number of results",
    },
    startAfter: {
      label: "Start After",
      type: "string",
      optional: true,
      description: "Identifier(s) or value(s) to paginate results (comma-separated)",
    },
    desc: {
      label: "Desc",
      type: "boolean",
      optional: true,
      description: "Show result in descending order",
    },
    locationId: {
      propDefinition: [
        waitwhile,
        "locationId",
      ],
    },
    externalId: {
      propDefinition: [
        waitwhile,
        "externalId",
      ],
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
      limit: this.limit,
      startAfter: this.startAfter,
      desc: this.desc,
      locationId: this.locationId,
      externalId: this.externalId,
      fromDate: this.fromDate,
      toDate: this.toDate,
      fromTime: this.fromTime,
      toTime: this.toTime,
    };
    const data = await this.waitwhile.listCustomers(params);
    $.export("summary", "Successfully retrieved customers");
    return data;
  },
});
