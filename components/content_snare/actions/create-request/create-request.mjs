import contentSnare from "../../content_snare.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "content_snare-create-request",
  name: "Create Request on Content Snare",
  description: "Initiates a novel request on Content Snare. The mandatory prop is name and all other props are optional. [See the documentation](https://api.contentsnare.com/partner_api/v1/documentation)",
  version: `0.0.${new Date().getTime()}`,
  type: "action",
  props: {
    contentSnare,
    requestName: {
      propDefinition: [
        contentSnare,
        "requestName"
      ]
    },
    companyName: {
      propDefinition: [
        contentSnare,
        "companyName",
        (c) => ({ optional: true })
      ],
      optional: true
    },
    clientEmail: {
      propDefinition: [
        contentSnare,
        "clientEmail",
        (c) => ({ optional: true })
      ],
      optional: true
    },
    clientFullName: {
      propDefinition: [
        contentSnare,
        "clientFullName",
        (c) => ({ optional: true })
      ],
      optional: true
    },
    clientPhone: {
      propDefinition: [
        contentSnare,
        "clientPhone",
        (c) => ({ optional: true })
      ],
      optional: true
    },
    additionalProps: {
      propDefinition: [
        contentSnare,
        "additionalProps",
        (c) => ({ optional: true })
      ],
      optional: true
    },
  },
  async run({ $ }) {
    const additionalProps = this.additionalProps || {};
    
    const response = await this.contentSnare.initiateRequest({
      requestName: this.requestName,
      companyName: this.companyName,
      clientEmail: this.clientEmail,
      clientFullName: this.clientFullName,
      clientPhone: this.clientPhone,
      ...additionalProps,
    });

    $.export("$summary", `Successfully initiated request with name: ${this.requestName}`);
    return response;
  },
};