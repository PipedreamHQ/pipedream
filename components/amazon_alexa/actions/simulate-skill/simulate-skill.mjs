import app from "../../amazon_alexa.app.mjs";

export default {
  key: "amazon_alexa-simulate-skill",
  name: "Simulate Alexa Skill",
  description: "Simulate a dialog from an Alexa-enabled device and receive the skill response for the specified example utterance. [See the documentation](https://developer.amazon.com/en-us/docs/alexa/smapi/skill-simulation-api.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    skillId: {
      propDefinition: [
        app,
        "skillId",
      ],
    },
    stage: {
      propDefinition: [
        app,
        "stage",
      ],
    },
    content: {
      propDefinition: [
        app,
        "inputContent",
      ],
    },
    locale: {
      propDefinition: [
        app,
        "deviceLocale",
      ],
    },
  },
  methods: {
    simulateSkill({
      skillId, stage, ...args
    }) {
      return this.app.post({
        path: `/skills/${skillId}/stages/${stage}/simulations`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      simulateSkill,
      skillId,
      stage,
      content,
      locale,
    } = this;

    const response = await simulateSkill({
      $,
      skillId,
      stage,
      data: {
        session: {
          mode: "DEFAULT",
        },
        input: {
          content,
        },
        device: {
          locale,
        },
      },
    });

    $.export("$summary", `Successfully simulated skill with ID: ${response.id}`);

    return response;
  },
};
