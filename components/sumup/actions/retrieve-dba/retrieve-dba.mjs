import sumup from "../../sumup.app.mjs";

export default {
  key: "sumup-retrieve-dba",
  name: "Retrieve DBA",
  description: "Retrieves Doing Business As profile. [See the documenation](https://developer.sumup.com/api/merchant/get-doing-business-as)",
  version: "0.0.1",
  type: "action",
  props: {
    sumup,
  },
  async run({ $ }) {
    const response = await this.sumup.retrieveDba({
      $,
    });
    $.export("$summary", "Successfully retrieved DBA data");
    return response;
  },
};
