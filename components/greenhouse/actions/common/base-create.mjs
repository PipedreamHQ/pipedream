import {
  checkPhoneNumbers,
  parseObject,
} from "../../common/utils.mjs";
import greenhouse from "../../greenhouse.app.mjs";

export default {
  props: {
    greenhouse,
    userId: {
      propDefinition: [
        greenhouse,
        "userId",
      ],
    },
    firstName: {
      propDefinition: [
        greenhouse,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        greenhouse,
        "lastName",
      ],
    },
    company: {
      propDefinition: [
        greenhouse,
        "company",
      ],
      optional: true,
    },
    title: {
      propDefinition: [
        greenhouse,
        "title",
      ],
      optional: true,
    },
    phoneNumbers: {
      propDefinition: [
        greenhouse,
        "phoneNumbers",
      ],
      optional: true,
    },
    addressses: {
      propDefinition: [
        greenhouse,
        "addressses",
      ],
      optional: true,
    },
    emailAddresses: {
      propDefinition: [
        greenhouse,
        "emailAddresses",
      ],
      optional: true,
    },
    websiteAddresses: {
      propDefinition: [
        greenhouse,
        "websiteAddresses",
      ],
      optional: true,
    },
    socialMediaAddresses: {
      propDefinition: [
        greenhouse,
        "socialMediaAddresses",
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        greenhouse,
        "tags",
      ],
      optional: true,
    },
    customFields: {
      propDefinition: [
        greenhouse,
        "customFields",
      ],
      optional: true,
    },
    recruiterId: {
      propDefinition: [
        greenhouse,
        "userId",
      ],
      label: "Recruiter Id",
      description: "The ID of the recruiter - either id or email must be present.",
      optional: true,
    },
    recruiterEmail: {
      propDefinition: [
        greenhouse,
        "recruiterEmail",
      ],
      optional: true,
    },
    coordinatorId: {
      propDefinition: [
        greenhouse,
        "userId",
      ],
      label: "Coordinator Id",
      description: "The ID of the coordinator - either id or email must be present.",
      optional: true,
    },
    coordinatorEmail: {
      propDefinition: [
        greenhouse,
        "coordinatorEmail",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const addData = this.getData();
    if (this.recruiterEmail || this.recruiterId) {
      addData.recruiter = {
        email: this.recruiterEmail,
        id: this.recruiterId,
      };
    }
    if (this.coordinatorEmail || this.coordinatorId) {
      addData.coordinator = {
        email: this.coordinatorEmail,
        id: this.coordinatorId,
      };
    }

    const fn = this.getFunc();
    const response = await fn({
      $,
      headers: {
        "On-Behalf-Of": this.userId,
      },
      data: {
        first_name: this.firstName,
        last_name: this.lastName,
        company: this.company,
        title: this.title,
        phone_numbers: parseObject(checkPhoneNumbers(this.phoneNumbers))?.map((item) => ({
          value: item,
          type: "other",
        })),
        addressses: parseObject(this.addressses)?.map((item) => ({
          value: item,
          type: "other",
        })),
        email_addresses: parseObject(this.emailAddresses)?.map((item) => ({
          value: item,
          type: "other",
        })),
        website_addresses: parseObject(this.websiteAddresses)?.map((item) => ({
          value: item,
          type: "other",
        })),
        social_media_addresses: parseObject(this.socialMediaAddresses)?.map((item) => ({
          value: item,
        })),
        tags: parseObject(this.tags),
        custom_fields: this.customFields && Object.keys(this.customFields).map((key) => ({
          id: key,
          value: this.customFields[key],
        })),
        ...addData,
      },
    });

    $.export("$summary", this.getSummary(response));
    return response;
  },
};
