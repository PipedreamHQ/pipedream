import app from "../../content_snare.app.mjs";

export default {
  key: "content_snare-create-request",
  name: "Create Request",
  description: "Initiates a novel request on Content Snare. [See the documentation](https://api.contentsnare.com/partner_api/v1/documentation#post-/partner_api/v1/requests)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Request Name",
      description: "The name of the request to initiate on Content Snare.",
    },
    clientEmail: {
      propDefinition: [
        app,
        "clientEmail",
      ],
    },
    clientFullName: {
      propDefinition: [
        app,
        "clientFullName",
      ],
    },
    clientPhone: {
      propDefinition: [
        app,
        "clientPhone",
      ],
    },
    companyName: {
      propDefinition: [
        app,
        "companyName",
      ],
    },
    requestTemplateName: {
      type: "string",
      label: "Request Template Name",
      description: "The name of the request template to use for this request. Either this field or **Request Template ID** must be provided.",
      optional: true,
    },
    requestTemplateId: {
      propDefinition: [
        app,
        "requestTemplateId",
      ],
      optional: true,
    },
  },
  methods: {
    createRequest(args = {}) {
      return this.app.post({
        path: "/requests",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createRequest,
      name,
      clientEmail,
      clientFullName,
      clientPhone,
      companyName,
      requestTemplateName,
      requestTemplateId,
    } = this;

    const response = await createRequest({
      $,
      data: {
        name,
        client_email: clientEmail,
        client_full_name: clientFullName,
        client_phone: clientPhone,
        company_name: companyName,
        request_template_name: requestTemplateName,
        request_template_id: requestTemplateId,
      },
    });

    $.export("$summary", `Successfully created request with ID \`${response.id}\``);

    return response;
  },
};
