import { ConfigurationError } from "@pipedream/platform";
import app from "../../paradym.app.mjs";

export default {
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    credentialTemplateId: {
      reloadProps: true,
      propDefinition: [
        app,
        "sdJWTVCCredentialTemplateId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
    },
  },
  async additionalProps() {
    const {
      projectId,
      credentialTemplateId,
      getCredentialTemplateFunction,
      getDynamicProps,
    } = this;

    const getCredentialTemplate = getCredentialTemplateFunction();

    const credentialTemplate =
      credentialTemplateId && await getCredentialTemplate({
        projectId,
        credentialTemplateId,
      });

    return Object.entries(credentialTemplate?.attributes)
      .reduce((acc, [
        key,
        attr,
      ]) => getDynamicProps({
        acc,
        key,
        attr,
      }), {});
  },
  methods: {
    getCredentialTemplateFunction() {
      throw new ConfigurationError("getCredentialTemplateFunction is not implemented.");
    },
    getSummary() {
      throw new ConfigurationError("getSummary is not implemented.");
    },
    getCreateIssuanceOfferFunction() {
      throw new ConfigurationError("getCreateIssuanceOfferFunction is not implemented.");
    },
    getCreateIssuanceOfferFunctionArgs() {
      throw new ConfigurationError("getCreateIssuanceOfferFunctionArgs is not implemented.");
    },
    getDynamicProps() {
      throw new ConfigurationError("getDynamicProps is not implemented.");
    },
    getCredential(propSuffix) {
      const {
        credentialTemplateId,
        ...attrs
      } = this;

      const attributes = Object.entries(attrs)
        .filter(([
          key,
        ]) => key.startsWith(propSuffix))
        .reduce((acc, [
          key,
          value,
        ]) => ({
          ...acc,
          [key.replace(propSuffix, "")]: value,
        }), {});

      return {
        credentialTemplateId,
        attributes,
      };
    },
  },
  async run({ $ }) {
    const {
      getSummary,
      getCreateIssuanceOfferFunction,
      getCreateIssuanceOfferFunctionArgs,
    } = this;
    const createIssuanceOfferFunction = getCreateIssuanceOfferFunction();

    const response = await createIssuanceOfferFunction({
      $,
      ...getCreateIssuanceOfferFunctionArgs(),
    });

    $.export("$summary", getSummary());

    return response;
  },
};
