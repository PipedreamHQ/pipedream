import videoask from "../../videoask.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "videoask-create-question",
  name: "Create Question",
  description: "Creates a question within a specified form in VideoAsk. [See the documentation](https://developers.videoask.com/#415deab5-fb71-42c7-97db-772d447f6eb7)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    videoask,
    organizationId: {
      propDefinition: [
        videoask,
        "organizationId",
      ],
    },
    formId: {
      propDefinition: [
        videoask,
        "formId",
        (c) => ({
          organizationId: c.organizationId,
        }),
      ],
    },
    mediaUrl: {
      type: "string",
      label: "Media URL",
      description: "The URL of the media item",
    },
    mediaType: {
      type: "string",
      label: "Media Type",
      description: "The media type of the question",
      options: constants.MEDIA_TYPES,
    },
    allowedAnswerMediaTypes: {
      type: "string[]",
      label: "Allowed Answer Media Types",
      description: "The allowed media types of answer to the question",
      options: constants.MEDIA_TYPES,
    },
  },
  async run({ $ }) {
    const response = await this.videoask.createQuestion({
      $,
      organizationId: this.organizationId,
      data: {
        form_id: this.formId,
        media_url: this.mediaUrl,
        media_type: this.mediaType,
        allowed_answer_media_types: this.allowedAnswerMediaTypes,
      },
    });
    $.export("$summary", `Successfully created question with ID: ${response.question_id}`);
    return response;
  },
};
