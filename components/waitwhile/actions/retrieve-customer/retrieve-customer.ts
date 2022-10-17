import waitwhile from "../../app/waitwhile.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Retrieve Customer",
  version: "0.0.1",
  key: "waitwhile-retrieve-customer",
  description: "Retrieve a customer",
  props: {
    waitwhile,
    customerId: {
      propDefinition: [
        waitwhile,
        "customerId",
       
      ],
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    try {
      const data = await this.waitwhile.retrieveCustomer(this.customerId);
      $.export("summary", "Successfully retrieved a customer");
      return data;
    } catch (error) {
      const statusCode = error[Object.getOwnPropertySymbols(error)[1]].status;
      const statusText = error[Object.getOwnPropertySymbols(error)[1]].statusText;
      throw new Error(`Error status code: ${statusCode}. Error status response: ${statusText}. You need a Paid Plan to use this API `); 
    }
   
  },
});
