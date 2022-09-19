import cloudflare from "../../cloudflare_api_key.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "cloudflare_api_key-create-certificate",
  name: "Create a Certificate",
  description: "Creates an Origin CA certificate. [See the docs here](https://api.cloudflare.com/#origin-ca-create-certificate)",
  version: "0.0.1",
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
    const certificateData = {
      hostnames: this.hostnames,
      requested_validity: this.requestedValidity,
      request_type: this.requestType,
      csr: this.csr,
    };

    const response = await this.cloudflare.createCertificate(certificateData);
    $.export("$summary", `Successfully created certificate with ID ${response.result.id}`);

    return response;
  },
};
