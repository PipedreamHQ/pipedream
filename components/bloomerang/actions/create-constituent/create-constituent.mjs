import bloomerang from "../../bloomerang.app.mjs";
import {
  COMMUNICATION_CHANNEL_OPTIONS,
  CONSTITUENT_GENDER_OPTIONS,
  CONSTITUENT_PREFIX_OPTIONS,
  CONSTITUENT_STATUS_OPTIONS,
  CONSTITUENT_SUFFIX_OPTIONS,
  CONSTITUENT_TYPE_OPTIONS,
} from "../../common/constants.mjs";

export default {
  key: "bloomerang-create-constituent",
  name: "Create Constituent",
  description: "Creates a new constituent in Bloomerang. [See the documentation](https://bloomerang.co/product/integrations-data-management/api/rest-api/#/Constituents/post_constituent)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bloomerang,
    type: {
      type: "string",
      label: "Constituent Type",
      description: "Filter constituents by type",
      options: CONSTITUENT_TYPE_OPTIONS,
      reloadProps: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the constituent",
      options: CONSTITUENT_STATUS_OPTIONS,
      optional: true,
    },
    fullName: {
      type: "string",
      label: "Organization Name",
      description: "The organization's name of the constituent",
      hidden: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the constituent",
      hidden: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the constituent",
      hidden: true,
    },
    middleName: {
      type: "string",
      label: "Middle Name",
      description: "The middle name of the constituent",
      optional: true,
    },
    prefix: {
      type: "string",
      label: "Title",
      description: "The prefix of the constituent",
      options: CONSTITUENT_PREFIX_OPTIONS,
      optional: true,
    },
    suffix: {
      type: "string",
      label: "Suffix",
      description: "The suffix of the constituent",
      options: CONSTITUENT_SUFFIX_OPTIONS,
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "The job title of the constituent",
      optional: true,
    },
    gender: {
      type: "string",
      label: "Gender",
      description: "The gender of the constituent",
      options: CONSTITUENT_GENDER_OPTIONS,
      optional: true,
    },
    birthdate: {
      type: "string",
      label: "Birthdate",
      description: "The birth date of the constituent",
      optional: true,
    },
    employer: {
      type: "string",
      label: "Employer",
      description: "The employer of the constituent",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "An website of the constituent",
      optional: true,
    },
    facebookId: {
      type: "string",
      label: "Facebook",
      description: "The constituent's facebook page",
      optional: true,
    },
    twitterId: {
      type: "string",
      label: "Twitter ID",
      description: "The constituent's twitter ID",
      optional: true,
    },
    linkedInId: {
      type: "string",
      label: "LinkedIn",
      description: "The constituent's linkedIn page",
      optional: true,
    },
    preferredCommunicationChannel: {
      type: "string",
      label: "Preferred Communication Channel",
      description: "The preferred comunication channel of the constituent",
      options: COMMUNICATION_CHANNEL_OPTIONS,
      optional: true,
    },
  },
  async additionalProps(props) {
    const isIndividual = this.type === "Individual";
    props.firstName.hidden = !isIndividual;
    props.lastName.hidden = !isIndividual;
    props.fullName.hidden = isIndividual;
    return {};
  },
  async run({ $ }) {
    const data = {
      Type: this.type,
      Status: this.status,
      Prefix: this.prefix,
      Suffix: this.suffix,
      JobTitle: this.jobTitle,
      Gender: this.gender,
      Birthdate: this.birthdate,
      Employer: this.employer,
      Website: this.website,
      FacebookId: this.facebookId,
      TwitterId: this.twitterId,
      LinkedInId: this.linkedInId,
      PreferredCommunicationChannel: this.preferredCommunicationChannel,
    };
    if (this.type === "Individual") {
      data.FirstName = this.firstName;
      data.LastName = this.lastName;
      data.MiddleName = this.middleName;
    } else {
      data.FullName = this.fullName;
    }

    const response = await this.bloomerang.createConstituent({
      $,
      data,
    });

    $.export("$summary", `Successfully created constituent with ID ${response.Id}`);
    return response;
  },
};
