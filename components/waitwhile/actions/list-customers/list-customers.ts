import waitwhile from "../../app/waitwhile.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "List Customers",
  version: "0.0.2",
  key: "waitwhile-list-customers",
  description: "List of customers",
  props: {
    waitwhile,
    limit: {
      propDefinition: [
        waitwhile,
        "limit",
      ],
    },
    startAfter: {
      propDefinition: [
        waitwhile,
        "startAfter",
      ],
    },
    desc: {
      propDefinition: [
        waitwhile,
        "desc",
      ],
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
