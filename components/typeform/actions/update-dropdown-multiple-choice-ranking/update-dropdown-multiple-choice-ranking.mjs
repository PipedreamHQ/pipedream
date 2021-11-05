import omit from "lodash.omit";
import typeform from "../../typeform.app.mjs";
import constants from "../../constants.mjs";

export default {
  key: "typeform-update-dropdown-multiple-choice-ranking",
  name: "Update Dropdown, Multiple Choice or Ranking",
  description: "Update a dropdown, multiple choice, or ranking field's choices. [See the docs here](https://developer.typeform.com/create/reference/update-form/)",
  type: "action",
  version: "0.0.1",
  props: {
    typeform,
    formId: {
      propDefinition: [
        typeform,
        "formId",
      ],
    },
    fieldId: {
      description: "Please select a field. Dropdown, multiple choice or ranking",
      propDefinition: [
        typeform,
        "fieldId",
        ({ formId }) => ({
          formId,
          allowedFields: [
            constants.FIELD_TYPES.DROPDOWN,
            constants.FIELD_TYPES.MULTIPLE_CHOICE,
            constants.FIELD_TYPES.RANKING,
          ],
        }),
      ],
    },
    choice: {
      type: "string",
      label: "New choice",
      description: "Please add the new choice you want to include in your Field",
    },
  },
  methods: {
    getUpdatedFields({
      fields, fieldId, newChoice,
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

        const updatedField = {
          ...fieldProperties,
          id,
          properties: {
            ...otherProperties,
            choices: [
              ...choices,
              newChoice,
            ],
          },
        };

        return [
          ...reduction,
          updatedField,
        ];

      }, []);
    },
  },
  async run({ $ }) {
    const {
      formId,
      fieldId,
      choice,
    } = this;

    const {
      fields,
      ...formProperties
    } =
      await this.typeform.getForm({
        $,
        formId,
      });

    const field = fields.find(({ id }) => id === fieldId);

    if (!field) {
      throw new Error("Field not found");
    }

    const newChoice = {
      label: choice,
    };

    const fieldsToUpdate = this.getUpdatedFields({
      fields,
      fieldId,
      newChoice,
    });

    const otherFormProperties = omit(formProperties, [
      "id",
      "_links",
    ]);

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
