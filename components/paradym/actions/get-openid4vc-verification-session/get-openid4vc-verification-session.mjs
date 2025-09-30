import app from "../../paradym.app.mjs";

export default {
  key: "paradym-get-openid4vc-verification-session",
  name: "Get OpenID4VC Verification Session",
  description: "Fetches the verification session data for the specified session ID. [See the documentation](https://paradym.id/reference?full#tag/openid4vc-verification/get/v1/projects/{projectId}/openid4vc/verification/{openId4VcVerificationId})",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    openId4VcVerificationId: {
      propDefinition: [
        app,
        "openId4VcVerificationId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
    },
  },
  methods: {
    getOpenId4VcVerificationSessionUrl({
      projectId, openId4VcVerificationId, ...args
    } = {}) {
      return this.app._makeRequest({
        path: `/projects/${projectId}/openid4vc/verification/${openId4VcVerificationId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      getOpenId4VcVerificationSessionUrl,
      projectId,
      openId4VcVerificationId,
    } = this;

    const response = await getOpenId4VcVerificationSessionUrl({
      $,
      projectId,
      openId4VcVerificationId,
    });

    $.export("$summary", "Successfully fetched the verification session data for the specified session ID.");

    return response;
  },
};
