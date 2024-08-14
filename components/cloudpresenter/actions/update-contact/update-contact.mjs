import cloudpresenter from "../../cloudpresenter.app.mjs";
import {
  getCustomFieldProps, getPaginatedResources, parseCustomFields,
} from "../../common/utils.mjs";

export default {
  key: "cloudpresenter-update-contact",
  name: "Update Contact",
  description: "Updates an existing contact within the Cloudpresenter application. [See the documentation](https://cloudpresenter.stoplight.io/docs/cloudpresenter-public-apis/tjbk1nm3qvbg2-update-contact)",
  version: "0.0.1",
  type: "action",
  props: {
    cloudpresenter,
    contactId: {
      propDefinition: [
        cloudpresenter,
        "contactId",
      ],
    },
    firstName: {
      propDefinition: [
        cloudpresenter,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        cloudpresenter,
        "lastName",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        cloudpresenter,
        "email",
      ],
      optional: true,
    },
    company: {
      propDefinition: [
        cloudpresenter,
        "company",
      ],
    },
    jobTitle: {
      propDefinition: [
        cloudpresenter,
        "jobTitle",
      ],
    },
    streetAddress: {
      propDefinition: [
        cloudpresenter,
        "streetAddress",
      ],
    },
    city: {
      propDefinition: [
        cloudpresenter,
        "city",
      ],
    },
    state: {
      propDefinition: [
        cloudpresenter,
        "state",
      ],
    },
    country: {
      propDefinition: [
        cloudpresenter,
        "country",
      ],
    },
    phone: {
      propDefinition: [
        cloudpresenter,
        "phone",
      ],
    },
    tagIds: {
      propDefinition: [
        cloudpresenter,
        "tagIds",
      ],
    },
    customFieldIds: {
      propDefinition: [
        cloudpresenter,
        "customFieldIds",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    return getCustomFieldProps(this);
  },
  async run({ $ }) {
    const contacts = await getPaginatedResources({
      resourceFn: this.cloudpresenter.listContacts,
      resourceType: "contacts",
    });
    const contact = contacts.find(({ uuid }) => uuid === this.contactId);
    contact.tags = contact?.tags
      ? contact.tags.map(({ id }) => id)
      : [];
    contact.custom_fields = contact?.custom_fields
      ? contact.custom_fields.filter((field) => field.custom_field).map((field) => ({
        id: field.custom_field.id,
        value: field.value,
      }))
      : [];

    const response = await this.cloudpresenter.updateContact({
      $,
      contactId: this.contactId,
      data: {
        contact: {
          first_name: this.firstName || contact.first_name,
          last_name: this.lastName || contact.last_name,
          email: this.email || contact.email,
          company: this.company || contact.company,
          job_title: this.jobTitle || contact.job_title,
          address: this.streetAddress || contact.address,
          city: this.city || contact.city,
          state: this.state || contact.state,
          country: this.country || contact.country,
          phone_number: this.phone || contact.phone,
          tags: this.tagIds || contact.tags,
          custom_fields: this.customFieldIds
            ? parseCustomFields(this)
            : contact.custom_fields,
        },
      },
    });
    $.export("$summary", `Successfully updated contact with ID: ${this.contactId}`);
    return response;
  },
};
