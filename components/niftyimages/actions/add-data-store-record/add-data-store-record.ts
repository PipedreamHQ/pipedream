import niftyimages from "../../app/niftyimages.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Add Data Store Record",
  description:
    "Create or update a Data Store Record [See docs here](https://api.niftyimages.com/)",
  key: "niftyimages-add-data-store-record",
  version: "0.0.1",
  type: "action",
  methods: {
    additionalProps() {
      const props = {};

      // build props from "fieldsToUpdate"

      return props;  
    }
  },
  props: {
    niftyimages,
    fieldsToUpdate: {
      propDefinition: [
        niftyimages,
        "fieldsToUpdate",
      ],
    },
  },
  async run({ $ }): Promise<object> {
    const data = {};

    const params = {
      $,
      data,
    };

    const response = await this.niftyimages.addRecord(params);

    $.export("$summary", "Created document successfully");

    return response;
  },
});
