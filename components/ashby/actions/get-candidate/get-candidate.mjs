import app from "../../ashby.app.mjs";

export default {
  key: "ashby-get-candidate",
  name: "Get Candidate",
  description: "Retrieves the details of a specific candidate by ID. [See the documentation](https://developers.ashbyhq.com/reference/candidateinfo)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    candidateId: {
      propDefinition: [
        app,
        "candidateId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      candidateId,
    } = this;

    const response = await app.getCandidate({
      $,
      data: {
        id: candidateId,
      },
    });

    $.export("$summary", `Successfully retrieved candidate \`${candidateId}\``);

    return response;
  },
};
