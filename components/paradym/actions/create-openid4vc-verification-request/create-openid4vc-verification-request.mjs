import app from "../../paradym.app.mjs";

export default {
  key: "paradym-create-openid4vc-verification-request",
  name: "Create OpenID4VC Verification Request",
  description: "Initiates a verification request based on the selected template. [See the documentation](https://paradym.id/reference?full#tag/openid4vc-verification/post/v1/projects/{projectId}/openid4vc/verification/request)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    presentationTemplateId: {
      propDefinition: [
        app,
        "presentationTemplateId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
    },
  },
  methods: {
    createOpenID4VCVerificationRequest({
      projectId, ...args
    } = {}) {
      return this.app.post({
        path: `/projects/${projectId}/openid4vc/verification/request`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createOpenID4VCVerificationRequest,
      projectId,
      presentationTemplateId,
    } = this;

    const response = await createOpenID4VCVerificationRequest({
      $,
      projectId,
      data: {
        presentationTemplateId,
      },
    });
    $.export("$summary", `Successfully created OpenID4VC verification request with ID \`${response.id}\`.`);
    return response;
  },
};
