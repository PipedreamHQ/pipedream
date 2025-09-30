import streak from "../../streak.app.mjs";

const docLink = "https://streak.readme.io/reference/update-field-value-for-a-box";

export default {
  key: "streak-update-box-field-value",
  name: "Update Box Field Value",
  description: `Update the values of the fields for a box. [See the docs](${docLink})`,
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    streak,
    pipelineId: {
      propDefinition: [
        streak,
        "pipelineId",
      ],
    },
    boxId: {
      propDefinition: [
        streak,
        "boxId",
        (c) => ({
          pipelineId: c.pipelineId,
        }),
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    const fields = await this.streak.listPipelineFields({
      pipelineId: this.pipelineId,
    });

    const fieldValues = (await this.streak.listBoxFields({
      boxId: this.boxId,
    })).reduce((fields, x) => ({
      ...fields,
      [x.key]: x.value,
    }), {});

    for (const field of fields) {
      const prop = this.streak.customFieldToProp(field, fieldValues[field.key]);
      props[`${this.boxId}_${field.key}`] = prop;
    }
    return props;
  },
  async run({ $ }) {
    const updateCustomFields = Object.keys(this)
      .filter((k) => k.includes(`${this.boxId}_`))
      .map((k) => this.streak.updateFieldValue({
        boxId: this.boxId,
        fieldId: k.split(`${this.boxId}_`)[1],
        value: this[k],
      }));
    await Promise.all(updateCustomFields);

    $.export("$summary", "Successfully updated box fields");
    return this.streak.getBox({
      boxId: this.boxId,
    });
  },
};
