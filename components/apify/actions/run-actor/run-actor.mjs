import apify from "../../apify.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "apify-run-actor",
  name: "Run Actor",
  description: "Performs an execution of a selected actor in Apify. [See the documentation](https://docs.apify.com/api/v2#/reference/actors/run-collection/run-actor)",
  version: "0.0.1",
  type: "action",
  props: {
    apify,
    actorId: {
      propDefinition: [
        apify,
        "actorId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.apify.runActor({
      actorId: this.actorId,
    });
    $.export("$summary", `Successfully started actor run with ID: ${response.id}`);
    return response;
  },
};
