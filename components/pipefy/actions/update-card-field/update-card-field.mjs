import pipefy from "../../pipefy.app.mjs";

export default {
  key: "pipefy-update-card-field",
  name: "Update Card Field",
  description: "Updates a Card Field in a Pipe. [See the docs here](https://api-docs.pipefy.com/reference/mutations/updateCardField/)",
  version: "0.1.3",
  annotations: {
    destructiveHint: true,
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
    card: {
      propDefinition: [
        pipefy,
        "card",
        (c) => ({
          pipeId: c.pipe,
        }),
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    const { card } = await this.pipefy.getCard(this.card);
    const phaseId = card.current_phase.id;
    const fields = await this.pipefy.listPhaseFields(phaseId);
    props.field = {
      type: "string",
      label: "Field",
      description: "Field to update",
      options: fields.map((field) => ({
        label: field.label,
        value: field.id,
      })),
      reloadProps: true,
    };
    if (this.field) {
      const field = fields.find((field) => field.id == this.field);
      props[field.id] = {
        type: "string",
        label: field.label,
        description: field.description,
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

  mutation {
    updateCardField( input: {
      card_id: 2750027
      field_id: "where_do_you_live"
      new_value: "Auckland"
    })
    { card { id } }
  }
  */

    const variables = {
      cardId: this.card,
      fieldId: this.field,
      newValue: this[this.field],
    };

    const response = await this.pipefy.updateCardField(variables);
    $.export("$summary", "Successfully updated card field");
    return response;
  },
};
