import app from "../../kaleido.app.mjs";

export default {
  key: "kaleido-create-contract",
  name: "Create Contract",
  description: "Create a contract in Kaleido. [See the documentation](https://api.kaleido.io/platform.html#tag/Contracts/paths/~1consortia~1%7Bconsortia_id%7D~1contracts/post)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    type: {
      propDefinition: [
        app,
        "type",
      ],
    },
    consortiaId: {
      propDefinition: [
        app,
        "consortiaId",
      ],
    },
    membershipId: {
      propDefinition: [
        app,
        "membershipId",
        (c) => ({
          consortiaId: c.consortiaId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createContract({
      $,
      consortiaId: this.consortiaId,
      data: {
        name: this.name,
        description: this.description,
        type: this.type,
        membership_id: this.membershipId,
      },
    });

    $.export("$summary", `Successfully created contract with ID '${response._id}'`);

    return response;
  },
};
