import diffbot from "../../diffbot.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "diffbot-enhance-person",
  name: "Enhance Person",
  description: "Enhance a person profile using their name. [See the documentation](https://www.diffbot.com/dev/docs/person/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    diffbot,
    personName: {
      propDefinition: [
        diffbot,
        "personName",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.diffbot.searchPerson({
      personName: this.personName,
    });

    $.export("$summary", `Successfully enhanced person profile: ${this.personName}`);
    return response;
  },
};
