import pipefy from "../../pipefy.app.mjs";

export default {
  key: "pipefy-look-up-phase-by-id",
  name: "Look Up Phase By Id",
  description: "Looks up a phase by its ID. [See the docs here](https://api-docs.pipefy.com/reference/queries/#phase)",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipefy,
    organization: {
      propDefinition: [
        pipefy,
        "organization",
      ],
    },
    pipe: {
      propDefinition: [
        pipefy,
        "pipe",
        (c) => ({
          orgId: c.organization,
        }),
      ],
    },
    phase: {
      propDefinition: [
        pipefy,
        "phase",
        (c) => ({
          pipeId: c.pipe,
        }),
      ],
    },
  },
  async run({ $ }) {
  /*
  Example query:

  {
      phase(id: 309926591) {
      name description fields{label}
    }
  }
  */

    const response = await this.pipefy.getPhase(this.phase);
    $.export("$summary", "Successfully retrieved phase");
    return response;
  },
};
