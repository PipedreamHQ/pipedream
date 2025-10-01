import hyperise from "../../hyperise.app.mjs";

export default {
  key: "hyperise-create-personalised-short-link",
  name: "Create Personalised Short Link",
  description: "Creates a personalised short URL from provided inputs. [See the documentation](https://support.hyperise.com/en/api/Personalised-Short-Links-API)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hyperise,
    imageTemplateHash: {
      propDefinition: [
        hyperise,
        "imageTemplateHash",
      ],
    },
    destinationUrl: {
      type: "string",
      label: "Destination URL",
      description: "The URL to create a personalised short URL for",
    },
    pageTitle: {
      type: "string",
      label: "Page Title",
      description: "Title of the page",
    },
    pageDescription: {
      type: "string",
      label: "Page Description",
      description: "Description of the page",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Personalisation Data - first name",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Personalisation Data",
      optional: true,
    },
    profileUrl: {
      type: "string",
      label: "Profile URL",
      description: "Personalisation Data - Image URL of the prospects profile image",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "Personalisation Data - job title",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Personalisation Data - email address",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Personalisation Data - phone number",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.hyperise.createPersonalisedShortUrl({
      $,
      data: {
        image_hash: this.imageTemplateHash,
        url: this.destinationUrl,
        title: this.pageTitle,
        desc: this.pageDescription,
        query_params: {
          first_name: this.firstName,
          last_name: this.lastName,
          profile_url: this.profileUrl,
          job_title: this.jobTitle,
          email: this.email,
          phone: this.phone,
        },
      },
    });
    $.export("$summary", `Successfully created personalised short URL: ${response.link}`);
    return response;
  },
};
