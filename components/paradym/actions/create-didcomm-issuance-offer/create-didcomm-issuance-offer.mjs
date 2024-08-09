import constants from "../../common/constants.mjs";
import common from "../common/create-issuance-offer.mjs";

export default {
  ...common,
  key: "paradym-create-didcomm-issuance-offer",
  name: "Create DIDComm Issuance Offer",
  description: "Create a DIDComm issuance offer for the selected credentials. [See the documentation](https://paradym.id/reference?full#tag/didcomm-issuance/post/v1/projects/{projectId}/didcomm/issuance/offer)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    credentialTemplateId: {
      reloadProps: true,
      propDefinition: [
        common.props.app,
        "anoncredsCredentialTemplateId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    createDIDCommCredentialOffer({
      projectId, ...args
    } = {}) {
      return this.app.post({
        path: `/projects/${projectId}/didcomm/issuance/offer`,
        ...args,
      });
    },
    getSummary() {
      return "Successfully created DIDComm credential offer.";
    },
    getCreateIssuanceOfferFunction() {
      return this.createDIDCommCredentialOffer;
    },
    getCredentialTemplateFunction() {
      return this.app.getAnonCredsCredentialTemplate;
    },
    getCreateIssuanceOfferFunctionArgs() {
      const {
        projectId,
        getCredential,
      } = this;
      return {
        projectId,
        data: {
          credential: getCredential(constants.TEMPLATE_SUFFIX.ANONYMOUS),
        },
      };
    },
    getDynamicProps({
      acc, key, attr,
    }) {
      return {
        ...acc,
        [`${constants.TEMPLATE_SUFFIX.ANONYMOUS}${key}`]: {
          type: constants.PROP_TYPE[attr.type],
          label: `Anonymous Attribute (${attr.name})`,
          description: `The ${key} attribute of the Anonymous credential template.`,
          optional: !attr.required,
        },
      };
    },
  },
};
