import qualiobee from "../../qualiobee.app.mjs";

export default {
  key: "qualiobee-get-learner",
  name: "Get Learner",
  description: "Get a learner by UUID in Qualiobee. [See the documentation](https://app.qualiobee.fr/api/doc/#/Learner/PublicLearnerController_getOne)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    qualiobee,
    learnerUuid: {
      propDefinition: [
        qualiobee,
        "learnerUuid",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.qualiobee.getLearner({
      $,
      learnerUuid: this.learnerUuid,
    });
    $.export("$summary", `Successfully retrieved learner with UUID ${response.uuid}`);
    return response;
  },
};
