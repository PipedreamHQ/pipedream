import postman from "../../postman.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "postman-execute-collection",
  name: "Execute Collection",
  description: "Initiates the running of a specific collection in Postman. [See the documentation](https://learning.postman.com/docs/developer/postman-api/intro-api/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    postman,
    collectionId: {
      propDefinition: [
        postman,
        "collectionId",
      ],
    },
    environmentId: {
      propDefinition: [
        postman,
        "environmentId",
        (c) => ({
          collectionId: c.collectionId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.postman.runCollection(this.collectionId, this.environmentId);
    $.export("$summary", `Successfully executed collection with ID: ${this.collectionId}`);
    return response;
  },
};
