import luminPdf from "../../lumin_pdf.app.mjs";

export default {
  name: "Get User Information",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "lumin_pdf-get-user-information",
  description: "Get information about the current authenticated user. [See the documentation](https://developers.luminpdf.com/api/get-user-information/)",
  type: "action",
  props: {
    luminPdf,
  },
  async run({ $ }) {
    const response = await this.luminPdf.getUserInformation({
      $,
    });

    $.export("$summary", `Successfully retrieved user information for ${response.user.email || response.user.id}`);
    return response;
  },
};
