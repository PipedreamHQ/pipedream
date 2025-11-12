import dex from "../../dex.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "dex-create-update-contact",
  name: "Create or Update Contact",
  description: "Adds a new contact or updates an existing one if the email address already exists in the Dex system. [See the documentation](https://guide.getdex.com/dex-user-api/post-contact)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dex,
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the contact",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "Job title of the contact",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the contact",
      optional: true,
    },
    education: {
      type: "string",
      label: "Education",
      description: "Education of the contact",
      optional: true,
    },
    imageUrl: {
      type: "string",
      label: "Image URL",
      description: "Image URL of the contact",
      optional: true,
    },
    linkedin: {
      type: "string",
      label: "LinkedIn",
      description: "LinkedIn URL of the contact",
      optional: true,
    },
    twitter: {
      type: "string",
      label: "Twitter",
      description: "Twitter URL of the contact",
      optional: true,
    },
    instagram: {
      type: "string",
      label: "Instagram",
      description: "Instagram URL of the contact",
      optional: true,
    },
    telegram: {
      type: "string",
      label: "Telegram",
      description: "Telegram URL of the contact",
      optional: true,
    },
    birthdayYear: {
      type: "string",
      label: "Birthday Year",
      description: "Birthday year of the contact",
      optional: true,
    },
  },
  async run({ $ }) {
    const { search_contacts_by_exact_email: match } = await this.dex.getContact({
      $,
      params: {
        email: this.email,
      },
    });
    const data = utils.cleanObject({
      first_name: this.firstName,
      last_name: this.lastName,
      job_title: this.jobTitle,
      description: this.description,
      education: this.education,
      image_url: this.imageUrl,
      linkedin: this.linkedin,
      twitter: this.twitter,
      instagram: this.instagram,
      telegram: this.telegram,
      birthday_year: this.birthdayYear,
    });
    let response;
    if (match?.length) {
      const contact = match[0];
      response = await this.dex.updateContact({
        $,
        contactId: contact.id,
        data: utils.cleanObject({
          contactId: contact.id,
          changes: data,
          update_contact_phone_numbers: this.phoneNumber
            ? true
            : undefined,
          contact_phone_numbers: this.phoneNumber
            ? [
              {
                contact_id: contact.id,
                phone_number: this.phoneNumber,
              },
            ]
            : undefined,
        }),
      });
    } else {
      response = await this.dex.createContact({
        $,
        data: {
          contact: utils.cleanObject({
            ...data,
            contact_emails: {
              data: {
                email: this.email,
              },
            },
            contact_phone_numbers: this.phoneNumber
              ? {
                data: {
                  phone_number: this.phoneNumber,
                },
              }
              : undefined,
          }),
        },
      });
    }

    $.export("$summary", `Successfully ${match?.length
      ? "updated"
      : "created"} contact ${this.email}`);
    return response;
  },
};
