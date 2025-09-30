import pipefy from "../../pipefy.app.mjs";

export default {
  key: "pipefy-look-up-pipe-by-id",
  name: "Look up Pipe by ID",
  description: "Lookup a pipe by its ID. [See the docs here](https://api-docs.pipefy.com/reference/queries/#pipe)",
  version: "0.2.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
  },
  async run({ $ }) {
  /* Example query:

  {
      pipe(id: 301498507) {
      id name description members{user{name}}
    }
  }
  */

    const response = await this.pipefy.getPipe(this.pipe);
    $.export("$summary", "Successfully retrieved pipe");
    return response;
  },
};
