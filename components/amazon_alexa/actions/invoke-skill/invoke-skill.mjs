import amazonAlexa from "../../amazon_alexa.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "amazon_alexa-invoke-skill",
  name: "Invoke Alexa Skill",
  description: "Invoke the specified skill for testing with the given stage and intent. [See the documentation](https://developer.amazon.com/en-us/docs/alexa/smapi/skill-invocation-api.html)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    amazonAlexa,
    skillId: {
      propDefinition: [
        amazonAlexa,
        "skillId",
      ],
    },
    stage: {
      propDefinition: [
        amazonAlexa,
        "stage",
      ],
    },
    intent: {
      propDefinition: [
        amazonAlexa,
        "intent",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.amazonAlexa.invokeSkill({
      skillId: this.skillId,
      stage: this.stage,
      intent: this.intent,
    });

    $.export("$summary", `Successfully invoked Alexa skill with ID: ${this.skillId}`);
    return response;
  },
};
