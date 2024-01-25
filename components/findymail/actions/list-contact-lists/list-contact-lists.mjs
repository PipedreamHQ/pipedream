import findymail from "../../findymail.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "findymail-list-contact-lists",
  name: "List Contact Lists",
  description: "Get a list of all contact lists in Findymail. [See the documentation](https://app.findymail.com/docs/#contacts-getapi-lists)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    findymail,
  },
  async run({ $ }) {
    const response = await this.findymail.getListOfContactLists();
    $.export("$summary", "Retrieved contact lists successfully");
    return response;
  },
};
