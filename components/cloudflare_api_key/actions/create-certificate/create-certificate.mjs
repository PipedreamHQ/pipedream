import cloudflare from "../../cloudflare_api_key.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "cloudflare_api_key-create-certificate",
  name: "Create a Certificate",
  description: "Creates an Origin CA certificate. [See the documentation](https://developers.cloudflare.com/api/node/resources/origin_ca_certificates/methods/create/)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    cloudflare,
    hostnames: {
      type: "string[]",
      label: "Hostnames",
      description: "Array of hostnames or wildcard names (e.g., *.example.com) bound to the certificate",
      optional: true,
    },
    requestedValidity: {
      type: "integer",
      label: "Requested Validity",
      description: "The number of days for which the certificate should be valid",
      optional: true,
    },
    requestType: {
      type: "string",
      label: "Request Type",
      description: "Signature type desired on certificate",
      options: constants.CERTIFICATE_REQUEST_TYPE_OPTIONS,
    },
    csr: {
      type: "string",
      label: "Certificate Signing Request",
      description: "The Certificate Signing Request (CSR)",
    },
  },
  async run({ $ }) {
    const {
      cloudflare,
      hostnames,
      requestedValidity,
      requestType,
      csr,
    } = this;

    const response = await cloudflare.createCertificate({
      csr,
      hostnames,
      request_type: requestType,
      requested_validity: requestedValidity,
    });
    $.export("$summary", `Successfully created certificate with ID \`${response.result.id}\``);

    return response;
  },
};
