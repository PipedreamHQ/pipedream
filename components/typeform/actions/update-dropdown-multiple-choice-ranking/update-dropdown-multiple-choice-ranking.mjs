/* eslint-disable no-unused-vars */
import typeform from "../../typeform.app.mjs";
import common from "../common.mjs";
import constants from "../constants.mjs";

export default {
  key: "typeform-update-dropdown-multiple-choice-ranking",
  name: "Update Dropdown, Multiple Choice or Ranking",
  description: "Update Dropdown, Multiple Choice or Ranking Field Types. [See the docs here](https://developer.typeform.com/create/reference/update-form/)",
  type: "action",
  version: "0.0.1",
  methods: {
    ...common.methods,
    getUpdatedFields({
      fieldId, fields, existingChoices = [], addedChoices = [],
    }) {
      return fields.reduce((reduction, field) => {
        const {
          id,
          properties,
          ...fieldProperties
        } = field;

        if (id !== fieldId) {
          return [
            ...reduction,
            field,
          ];
        }

        const {
          choices,
          ...otherProperties
        } = properties;

        const keptChoices = existingChoices.map(({ id }) => id);
        const choicesToUpdate =
          choices.filter(({ id }) => keptChoices.includes(id));

        const propertiesToUpdate = {
          choices: [
            ...choicesToUpdate,
            ...addedChoices,
          ],
          ...otherProperties,
        };

        const updatedField = {
          id,
          properties: propertiesToUpdate,
          ...fieldProperties,
        };

        return [
          ...reduction,
          updatedField,
        ];
      }, []);
    },
    getExistingAndAddedChoices(choices = []) {
      return choices.reduce((reduction, choice) => {
        if (typeof(choice) === "string") {
          choice = JSON.parse(choice);
        }

        const [
          existingChoices = [],
          addedChoices = [],
        ] = reduction;

        if (choice.id) {
          return [
            [
              ...existingChoices,
              choice,
            ],
            addedChoices,
          ];
        }

        return [
          existingChoices,
          [
            ...addedChoices,
            choice,
          ],
        ];
      }, []);
    },
  },
  props: {
    typeform,
    formId: {
      propDefinition: [
        typeform,
        "formId",
      ],
    },
    field: {
      description: "Please select a field. Update Dropdown, Multiple Choice or Ranking",
      propDefinition: [
        typeform,
        "field",
        ({ formId }) => ({
          formId,
          allowedFields: [
            constants.FIELD_TYPES.DROPDOWN,
            constants.FIELD_TYPES.MULTIPLE_CHOICE,
            constants.FIELD_TYPES.RANKING,
          ],
          returnFieldObject: true,
        }),
      ],
    },
    choices: {
      type: "string[]",
      label: "Field's choices",
      description: "Please select the choices you want to include in your Question. In case you want to build yourself the selected options, the structure should look like this `{{[{\"label\":\"Choice 1\"}]}}`. Please provide at least one option.",
      options() {
        const { properties } = JSON.parse(this.field);
        return properties.choices.map((choice) => ({
          label: choice.label,
          value: JSON.stringify(choice),
        }));
      },
    },
  },
  async run({ $ }) {
    const {
      formId,
      field,
      choices,
    } = this;

    const { id: fieldId } = JSON.parse(field);

    if (!fieldId) {
      throw new Error("Field ID not found");
    }

    const {
      fields,
      ...formProperties
    } =
      await this.typeform.getForm({
        $,
        formId,
      });

    const [
      existingChoices,
      addedChoices,
    ] = this.getExistingAndAddedChoices(choices);

    const fieldsToUpdate = this.getUpdatedFields({
      fieldId,
      fields,
      existingChoices,
      addedChoices,
    });

    const {
      id,
      _links,
      ...otherFormProperties
    } = formProperties;

    const data = {
      ...otherFormProperties,
      fields: fieldsToUpdate,
    };

    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `🎉 Successfully updated... something`)

    return await this.typeform.updateForm({
      $,
      formId,
      data,
    });
  },
};
