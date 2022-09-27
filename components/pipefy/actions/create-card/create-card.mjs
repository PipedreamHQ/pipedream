import pipefy from "../../pipefy.app.mjs";

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
    phase: {
      propDefinition: [
        pipefy,
        "phase",
        (c) => ({
          pipeId: c.pipe,
        }),
      ],
      reloadProps: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the new card",
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    const fields = await this.pipefy.listPhaseFields(this.phase);
    for (const field of fields) {
      props[field.id] = {
        type: "string",
        label: field.label,
        description: field.description,
        optional: !field.required,
      };
      if (field.options.length > 0) {
        props[field.id].options = field.options;
      }
    }
    return props;
  },
  async run({ $ }) {
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

    const fieldsAttributes = [];
    const fields = await this.pipefy.listFields(this.phase);
    for (const field of fields) {
      if (this[field.id]) {
        fieldsAttributes.push({
          field_id: field.id,
          field_value: this[field.id],
        });
      }
    }

    const variables = {
      pipeId: this.pipe,
      phaseId: this.phase,
      title: this.title,
      fieldsAttributes,
    };

    const response = await this.pipefy.createCard(variables);
    $.export("$summary", "Successfully created card");
    return response;
  },
};
