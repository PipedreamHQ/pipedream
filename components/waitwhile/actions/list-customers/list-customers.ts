import waitwhile from "../../app/waitwhile.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "List Customers",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "waitwhile-list-customers",
  description: "List of customers. [See the doc here](https://developers.waitwhile.com/reference/listcustomers)",
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
    try {
      const data = await this.waitwhile.listCustomers(params);
      $.export("summary", "Successfully retrieved customers");
      return data;
    } catch (error) {
      const statusCode = error[Object.getOwnPropertySymbols(error)[1]].status;
      const statusText = error[Object.getOwnPropertySymbols(error)[1]].statusText;
      throw new Error(`Error status code: ${statusCode}. Error status response: ${statusText}`);
    }
  },
});
