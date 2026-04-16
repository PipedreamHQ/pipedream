import signpath from "../../signpath.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";

export default {
  key: "signpath-submit-signing-request",
  name: "Submit Signing Request",
  description: "Submit a signing request. [See the documentation](https://docs.signpath.io/build-system-integration#submit-a-signing-request)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    signpath,
    projectSlug: {
      type: "string",
      label: "Project Slug",
      description: "The project for which you want to create the signing request",
    },
    signingPolicySlug: {
      propDefinition: [
        signpath,
        "signingPolicySlug",
      ],
    },
    artifact: {
      type: "string",
      label: "Artifact",
      description: "Artifact file to be signed. You can also provide a URL to a file. Allowed extensions: .ps1, .psm1, .psd1, .psc1, .ps1xml",
    },
    description: {
      propDefinition: [
        signpath,
        "description",
      ],
    },
  },
  async run({ $ }) {
    const form = new FormData();
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.artifact);

    form.append("artifact", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });

    form.append("projectSlug", this.projectSlug);
    form.append("signingPolicySlug", this.signingPolicySlug);
    if (this.description) {
      form.append("description", this.description);
    }

    const response = await this.signpath.submitSigningRequest({
      $,
      data: form,
      headers: form.getHeaders(),
    });
    $.export("$summary", "Successfully submitted signing request");
    return response;
  },
};
