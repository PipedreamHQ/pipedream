import app from "../../redcircle_api.app.mjs";

export default {
  key: "redcircle_api-add-zipcode",
  name: "Add Zipcode",
  description: "Add a zipcode to Redcircle API. [See the documentation](https://docs.trajectdata.com/redcircleapi/zipcodes-api/add)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    zipcode: {
      propDefinition: [
        app,
        "zipcode",
      ],
    },
    domain: {
      propDefinition: [
        app,
        "domain",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.addZipcode({
      $,
      data: [
        {
          zipcode: this.zipcode,
          domain: this.domain,
        },
      ],
    });
    $.export("$summary", "Successfully sent the request");
    return response;
  },
};
