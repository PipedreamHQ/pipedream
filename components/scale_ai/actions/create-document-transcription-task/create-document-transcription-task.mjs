import app from "../../scale_ai.app.mjs";
import utils from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "scale_ai-create-document-transcription-task",
  name: "Create Document Transcription Task",
  description: "Create a document transcription task. [See the documentation](https://docs.scale.com/reference/document-transcription-1)",
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
    attachment: {
      description: "The url of the attachment of the data to be collected. We will use the HTTP content type to determine the type of the attachment. Either **Attachment** or **Attachments** is required. You can supply attachments instead of attachment if needed.",
      propDefinition: [
        app,
        "attachment",
      ],
    },
    attachments: {
      type: "string[]",
      label: "Attachments",
      description: "Used instead of **Attachment** - The urls of a multi-page document. Either **Attachment** or **Attachments** is required.",
      optional: true,
    },
    lang: {
      type: "string",
      label: "Language",
      description: "Language of the attachment. Defaults to `en-U`.",
      optional: true,
      default: "en-US",
    },
    geometry: {
      type: "string",
      label: "Geometry",
      description: "Geometry type for the annotations. Supported values are `box` for axis-aligned rectangles or `polygon` for rotated rectangles. Defaults to `box`.",
      optional: true,
      options: Object.values(constants.GEOMETRY_TYPE),
      default: constants.GEOMETRY_TYPE.BOX,
    },
    uniqueId: {
      propDefinition: [
        app,
        "uniqueId",
      ],
    },
    numberOfFeatures: {
      type: "integer",
      label: "Number Of Features",
      description: "The number of features to be collected. Defaults to `1`.",
      default: 1,
      reloadProps: true,
    },
  },
  methods: {
    featuresPropsMapper(prefix) {
      const {
        [`${prefix}type`]: type,
        [`${prefix}label`]: label,
        [`${prefix}title`]: title,
        [`${prefix}flags`]: flags,
      } = this;

      return {
        type,
        label,
        title,
        flags,
      };
    },
    getFeaturesPropDefinitions({
      prefix,
      label,
    } = {}) {
      return {
        [`${prefix}type`]: {
          type: "string",
          label: `${label} - Type`,
          description: "One of `text`, `block`, or `group`. See \"Feature Types\" for more information.",
          options: Object.values(constants.FEATURE_TYPE),
        },
        [`${prefix}label`]: {
          type: "string",
          label: `${label} - Label`,
          description: "Label for the annotation. It is required for block and text features.",
          optional: true,
        },
        [`${prefix}title`]: {
          type: "string",
          label: `${label} - Title`,
          description: "For `group`-type features, a group title must be provided as opposed to a label since a group itself is not labeled.",
          optional: true,
        },
        [`${prefix}flags`]: {
          type: "string[]",
          label: `${label} - Flags`,
          description: "A list of ContentFlag values. Content flags allow Scale to transcribe documents more effectively by enabling special tooling or modifying the default behavior for certain features.",
          optional: true,
          options: Object.values(constants.CONTENT_FLAG),
        },
      };
    },
    createDocumentTranscriptionTask(args = {}) {
      return this.app.post({
        path: "/task/documenttranscription",
        ...args,
      });
    },
  },
  async additionalProps() {
    const {
      numberOfFeatures,
      getFeaturesPropDefinitions,
    } = this;

    return utils.getAdditionalProps({
      numberOfFields: numberOfFeatures,
      fieldName: "feature",
      getPropDefinitions: getFeaturesPropDefinitions,
    });
  },
  async run({ $: step }) {
    const {
      createDocumentTranscriptionTask,
      project,
      instruction,
      callbackUrl,
      attachment,
      attachments,
      lang,
      geometry,
      uniqueId,
      numberOfFeatures,
      featuresPropsMapper,
    } = this;

    const response = await createDocumentTranscriptionTask({
      step,
      data: {
        project,
        instruction,
        callback_url: callbackUrl,
        attachment,
        attachments,
        lang,
        geometry,
        unique_id: uniqueId,
        features: utils.getFieldsProps({
          numberOfFields: numberOfFeatures,
          fieldName: "feature",
          propsMapper: featuresPropsMapper,
        }),
      },
    });

    step.export("$summary", `Successfully created document transcription task with ID  \`${response.task_id}\``);

    return response;
  },
};
