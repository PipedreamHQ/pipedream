/* eslint-disable no-unused-vars */
import common from "../common.mjs";
import constants from "../../constants.mjs";

const { typeform } = common.props;

export default {
  ...common,
  key: "typeform-update-dropdown-multiple-choice-ranking",
  name: "Update Dropdown, Multiple Choice or Ranking",
  description: "Update a dropdown, multiple choice, or ranking field's choices. [See the docs here](https://developer.typeform.com/create/reference/update-form/)",
  type: "action",
  version: "0.0.1",
  props: {
    ...common.props,
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
    choice: {
      type: "string",
      label: "New choice",
      description: "Please add the new choice you want to include in your Question",
    },
  },
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
  async run({ $ }) {
    const {
      formId,
      field,
      choice,
    } = this;

    const {
      id: fieldId,
      properties,
    } = JSON.parse(field);

    const { choices: currentChoices } = properties;
    const choices = [
      ...currentChoices,
      {
        label: choice,
      },
    ];

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

    return await this.typeform.updateForm({
      $,
      formId,
      data,
    });
  },
};
