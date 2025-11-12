import cloudpresenter from "../../cloudpresenter.app.mjs";
import {
  getCustomFieldProps, parseCustomFields,
} from "../../common/utils.mjs";

export default {
  key: "cloudpresenter-create-contact",
  name: "Create Contact",
  description: "Creates a new contact within the Cloudpresenter application. [See the documentation](https://cloudpresenter.stoplight.io/docs/cloudpresenter-public-apis/gnglqnrsy7k38-create-contact)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    cloudpresenter,
    firstName: {
      propDefinition: [
        cloudpresenter,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        cloudpresenter,
        "lastName",
      ],
    },
    email: {
      propDefinition: [
        cloudpresenter,
        "email",
      ],
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
    const response = await this.cloudpresenter.createContact({
      $,
      data: {
        contact: {
          first_name: this.firstName,
          last_name: this.lastName,
          email: this.email,
          company: this.company || null,
          job_title: this.jobTitle || null,
          address: this.streetAddress || null,
          city: this.city || null,
          state: this.state || null,
          country: this.country || null,
          phone_number: this.phone || null,
          tags: this.tagIds || [],
          custom_fields: parseCustomFields(this),
        },
      },
    });
    $.export("$summary", `Successfully created contact: ${this.firstName} ${this.lastName}`);
    return response;
  },
};
