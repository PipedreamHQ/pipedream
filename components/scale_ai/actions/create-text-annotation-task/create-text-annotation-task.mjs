import app from "../../scale_ai.app.mjs";
import utils from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "scale_ai-create-text-annotation-task",
  name: "Create Text Annotation Task",
  description: "Create a text annotation task. [See the documentation](https://docs.scale.com/reference/text-collection)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    project: {
      propDefinition: [
        app,
        "project",
      ],
    },
    batch: {
      propDefinition: [
        app,
        "batch",
      ],
    },
    instruction: {
      propDefinition: [
        app,
        "instruction",
      ],
    },
    callbackUrl: {
      propDefinition: [
        app,
        "callbackUrl",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the task to be shown to scalers.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the task to be shown to scalers.",
      optional: true,
    },
    responsesRequired: {
      type: "integer",
      label: "Responses Required",
      description: "The number of responses required for the task to build consensus before returning the callback response. Upper bound of 100.",
      optional: true,
    },
    priority: {
      propDefinition: [
        app,
        "priority",
      ],
    },
    uniqueId: {
      propDefinition: [
        app,
        "uniqueId",
      ],
    },
    clearUniqueIdOnError: {
      type: "boolean",
      label: "Clear Unique ID on Error",
      description: "If set to be true, if a task errors out after being submitted, the **Unique ID** on the task will be unset. This param allows workflows where you can re-submit the same **Unique ID** to recover from errors automatically.",
      optional: true,
    },
    numberOfFields: {
      type: "integer",
      label: "Number of Fields",
      description: "The number of fields to be labeled",
      default: 1,
      reloadProps: true,
    },
    numberOfAttachments: {
      type: "integer",
      label: "Number of Attachments",
      description: "The number of attachments to be labeled",
      default: 1,
      reloadProps: true,
    },
  },
  methods: {
    choiceFieldsPropsMapper(prefix) {
      const {
        [`${prefix}label`]: label,
        [`${prefix}value`]: value,
        [`${prefix}hint`]: hint,
      } = this;

      return {
        label,
        value,
        hint,
      };
    },
    getChoiceFieldPropDefinitions({
      prefix, label,
    } = {}) {
      return {
        [`${prefix}label`]: {
          type: "string",
          label: `${label} - Label`,
          description: "The label of the choice.",
        },
        [`${prefix}value`]: {
          type: "string",
          label: `${label} - Value`,
          description: "The value of the choice.",
        },
        [`${prefix}hint`]: {
          type: "string",
          label: `${label} - Hint`,
          description: "The hint of the choice.",
          optional: true,
        },
      };
    },
    fieldsPropsMapper(prefix) {
      const {
        [`${prefix}type`]: type,
        [`${prefix}fieldId`]: fieldId,
        [`${prefix}title`]: title,
        [`${prefix}numberOfChoices`]: numberOfChoices,
        choiceFieldsPropsMapper,
      } = this;

      return {
        type,
        field_id: fieldId,
        title,
        choices: utils.getFieldsProps({
          numberOfFields: numberOfChoices,
          fieldName: "choice",
          prefix,
          propsMapper: choiceFieldsPropsMapper,
        }),
      };
    },
    getFieldsPropDefinitions({
      prefix,
      label,
    } = {}) {
      const {
        [`${prefix}numberOfChoices`]: numberOfChoices,
        getChoiceFieldPropDefinitions,
      } = this;

      return {
        [`${prefix}type`]: {
          type: "string",
          label: `${label} - Type`,
          description: "The type of field to be labeled.",
          optional: true,
          options: Object.values(constants.FIELD_CHOICE_TYPE),
        },
        [`${prefix}fieldId`]: {
          type: "string",
          label: `${label} - Field ID`,
          description: "A unique identifier for the field.",
          optional: true,
        },
        [`${prefix}title`]: {
          type: "string",
          label: `${label} - Title`,
          description: "The title of the field.",
          optional: true,
        },
        [`${prefix}numberOfChoices`]: {
          type: "integer",
          label: `${label} - Number of Choices`,
          description: "The number of choices for the field.",
          optional: true,
          default: 1,
          reloadProps: true,
        },
        ...utils.getAdditionalProps({
          numberOfFields: numberOfChoices,
          fieldName: "choice",
          prefix,
          label,
          getPropDefinitions: getChoiceFieldPropDefinitions,
        }),
      };
    },
    attachmentsPropsMapper(prefix) {
      const {
        [`${prefix}type`]: type,
        [`${prefix}content`]: content,
      } = this;

      return {
        type,
        content,
      };
    },
    getAttachmentsPropDefinitions({
      prefix,
      label,
    } = {}) {
      return {
        [`${prefix}type`]: {
          type: "string",
          label: `${label} - Type`,
          description: "The type of attachment. See [TextCollectionAttachment](https://docs.scale.com/reference/textcollectionattachment). One of `pdf`, `image`, `text`, `video`, `website`, or `audio`.",
          optional: true,
          options: Object.values(constants.ATTACHMENT_TYPE),
        },
        [`${prefix}content`]: {
          type: "string",
          label: `${label} - Content`,
          description: "The content of the attachment. See [TextCollectionAttachment](https://docs.scale.com/reference/textcollectionattachment).",
          optional: true,
        },
      };
    },
    createTextAnnotationTask(args = {}) {
      return this.app.post({
        path: "/task/textcollection",
        ...args,
      });
    },
  },
  async additionalProps() {
    const {
      numberOfFields,
      numberOfAttachments,
      getFieldsPropDefinitions,
      getAttachmentsPropDefinitions,
    } = this;

    const fields =  utils.getAdditionalProps({
      numberOfFields,
      fieldName: "field",
      getPropDefinitions: getFieldsPropDefinitions,
    });

    const attachments =  utils.getAdditionalProps({
      numberOfFields: numberOfAttachments,
      fieldName: "attachment",
      getPropDefinitions: getAttachmentsPropDefinitions,
    });

    return {
      ...fields,
      ...attachments,
    };
  },
  async run({ $: step }) {
    const {
      createTextAnnotationTask,
      project,
      batch,
      instruction,
      callbackUrl,
      title,
      description,
      responsesRequired,
      priority,
      uniqueId,
      clearUniqueIdOnError,
      numberOfFields,
      fieldsPropsMapper,
      numberOfAttachments,
      attachmentsPropsMapper,
    } = this;

    const response = await createTextAnnotationTask({
      step,
      data: {
        project,
        batch,
        instruction,
        callback_url: callbackUrl,
        title,
        description,
        responses_required: responsesRequired,
        priority,
        unique_id: uniqueId,
        clear_unique_id_on_error: clearUniqueIdOnError,
        fields: utils.getFieldsProps({
          numberOfFields,
          fieldName: "field",
          propsMapper: fieldsPropsMapper,
        }),
        attachments: utils.getFieldsProps({
          numberOfFields: numberOfAttachments,
          fieldName: "attachment",
          propsMapper: attachmentsPropsMapper,
        }),
      },
    });

    step.export("$summary", `Successfully created text annotation task with ID \`${response.task_id}\``);

    return response;
  },
};
