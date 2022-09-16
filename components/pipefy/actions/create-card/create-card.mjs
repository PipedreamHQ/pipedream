import pipefy from "../../pipefy.app.js";

export default {
  key: "pipefy-create-card",
  name: "Create Card",
  description: "Create a new Card in a Pipe. [See the docs here](https://api-docs.pipefy.com/reference/mutations/createCard/)",
  version: "0.1.2",
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
  async run() {
  /*
  Example query:

  mutation{
    createCard( input: {
      pipe_id: 219739
      fields_attributes: [
        {field_id: "assignee", field_value:[00000, 00001]}
        {field_id: "checklist_vertical", field_value: ["a", "b"]}
        {field_id: "email", field_value: "rocky.balboa@email.com"}
      ]
      parent_ids: ["2750027"]
    })
    { card { id title } }
  }
  */

    const data = {
      mutation: `{
        createCard( input: {
          pipe_id: ${this.pipe}
          fields_attributes: [
            {}
          ]
        })
        { card { id title } }
      }`,
    };

    return await this.pipefy._makeRequest(data, "graphql");
  },
};
