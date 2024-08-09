import constants from "../../common/constants.mjs";
import common from "../common/create-issuance-offer.mjs";

export default {
  ...common,
  key: "paradym-create-openid4vc-credential-offer",
  name: "Create OpenID4VC Credential Offer",
  description: "Create a OpenID4VC issuance offer for the selected credentials. [See the documentation](https://paradym.id/reference?full#tag/openid4vc-issuance/post/v1/projects/{projectId}/openid4vc/issuance/offer)",
  version: "0.0.1",
  type: "action",
  methods: {
    ...common.methods,
    createOpenID4VCCredentialOffer({
      projectId, ...args
    } = {}) {
      return this.app.post({
        path: `/projects/${projectId}/openid4vc/issuance/offer`,
        ...args,
      });
    },
    getSummary() {
      return "Successfully created OpenID4VC credential offer.";
    },
    getCredentialTemplateFunction() {
      return this.app.getSDJWTVCCredentialTemplate;
    },
    getCreateIssuanceOfferFunction() {
      return this.createOpenID4VCCredentialOffer;
    },
    getCreateIssuanceOfferFunctionArgs() {
      const {
        projectId,
        getCredential,
      } = this;
      return {
        projectId,
        data: {
          credentials: [
            getCredential(constants.TEMPLATE_SUFFIX.SDJWTVC),
          ].filter(Boolean),
        },
      };
    },
    getDynamicProps({
      acc, key, attr,
    }) {
      return {
        ...acc,
        [`${constants.TEMPLATE_SUFFIX.SDJWTVC}${key}`]: {
          type: constants.PROP_TYPE[attr.type],
          label: `SD-JWT-VC Attribute (${attr.name})`,
          description: `The ${key} attribute of the SD-JWT-VC credential template.`,
          optional: !attr.required,
        },
      };
    },
  },
};
