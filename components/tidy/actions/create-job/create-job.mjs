import tidy from "../../tidy.app.mjs";

export default {
  key: "tidy-create-job",
  name: "Create Job",
  description: "Creates a new job in Tidy. [See the documentation](https://help.tidy.com/create-a-job)",
  version: "0.0.1",
  type: "action",
  props: {
    tidy,
    addressId: {
      propDefinition: [
        tidy,
        "addressId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.tidy.createJob({
      data: {},
      $,
    });

    if (response?.id) {
      $.export("$summary", `Successfully created job with ID ${response.id}.`);
    }

    return response;
  },
};
