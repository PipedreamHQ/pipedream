import {
  parseArray,
  toSingleLineString,
} from "../../common/utils.mjs";
import personio from "../../personio.app.mjs";

export default {
  key: "personio-create-application",
  name: "Create Application",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Creates a new application. [See the documentation](https://developer.personio.de/reference/post_v1-recruiting-applications)",
  type: "action",
  props: {
    personio,
    companyId: {
      type: "string",
      label: "Company Id",
      description: "Your company id provided at https://{YOUR_COMPANY}.personio.de/configuration/api/credentials/management",
    },
    recruitingAccessToken: {
      type: "string",
      label: "Recruiting Access Token",
      description: "Your recruiting access Token provided at https://{YOUR_COMPANY}.personio.de/configuration/api/credentials/management",
      secret: true,
    },
    firstName: {
      propDefinition: [
        personio,
        "firstName",
      ],
      description: "First name(s) of the applicant. Must not be empty or only whitespaces.",
    },
    lastName: {
      propDefinition: [
        personio,
        "lastName",
      ],
      description: "Last name(s) of the applicant. Must not be empty or only whitespaces.",
    },
    email: {
      propDefinition: [
        personio,
        "email",
      ],
      description: "Email address of the applicant.",
    },
    jobPositionId: {
      type: "integer",
      label: "Job Position Id",
      description: toSingleLineString(
        `The personio internal id of the job this application should belong to.
        Access your positions page at https://{YOUR_COMPANY}.personio.de/recruiting/positions; Select a position;
        If your current URL is https://{YOUR_COMPANY}.personio.de/recruiting/positions/12345, then your Job Position ID is \`12345\``,
      ),
    },
    recruitingChannelId: {
      type: "string",
      label: "Recruiting Channel Id",
      description: "The recruiting channel this application was sourced from. See https://{YOUR_COMPANY}.personio.de/configuration/recruiting/channels.",
      optional: true,
    },
    externalPostingId: {
      type: "string",
      label: "External Posting Id",
      description: "The external id of the job posting (E.g. the external id forwarded by Gohiring).",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "The applicant supplied free-text message.",
      optional: true,
    },
    applicationDate: {
      type: "string",
      label: "Application Date",
      description: "The application date (yyyy-mm-dd). It cannot be a date in the future.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags to be associated with this application. Non-existing tags will be created. See https://{YOUR_COMPANY}.personio.de/configuration/recruiting/tags.",
      optional: true,
    },
    files: {
      type: "string[]",
      label: "Files",
      description: "A list of references to previously updated files. These will be attached to the new application. Each file item consists of an uuid, an original_filename and a category. [See the documentation](https://developer.personio.de/reference/post_v1-recruiting-applications).",
      optional: true,
    },
    attributes: {
      type: "string[]",
      label: "Attributes",
      description: "A list of attributes for this applicant. Each attribute item consists of an id and a value. [See the documentation](https://developer.personio.de/reference/post_v1-recruiting-applications).",
      optional: true,
    },
    phaseType: {
      type: "string",
      label: "Phase Type",
      description: "The type of application phase.",
      options: [
        "system",
        "custom",
      ],
      optional: true,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.phaseType) {
      props.phaseId = (this.phaseType === "system")
        ? {
          type: "string",
          label: "Phase Id",
          description: "The Id of the phase.",
          options: [
            "unassigned",
            "rejected",
            "withdrawn",
            "offer",
            "accepted",
          ],
        }
        : {
          type: "string",
          label: "Phase Id",
          description: "The Id for your custom phase can be found under your personio settings (https://{YOUR_COMPANY}.personio.de/configuration/recruiting/phases).",
          default: "",
        };
    }
    return props;
  },
  async run({ $ }) {
    const {
      personio,
      companyId,
      recruitingAccessToken,
      firstName,
      lastName,
      jobPositionId,
      recruitingChannelId,
      externalPostingId,
      applicationDate,
      phaseType,
      phaseId,
      tags,
      files,
      attributes,
      ...data
    } = this;

    const phase = {};
    if (phaseType) phase.type = phaseType;
    if (phaseId) phase.id = phaseId;

    const info = {
      first_name: firstName,
      last_name: lastName,
      job_position_id: jobPositionId,
      recruiting_channel_id: recruitingChannelId,
      external_posting_id: externalPostingId,
      application_date: applicationDate,
      tags: parseArray(tags),
      files: parseArray(files),
      attributes: parseArray(attributes),
      ...data,
    };

    if (Object.entries(phase).length) {
      info.phase = phase;
    }

    const response = await personio.createApplication({
      $,
      headers: {
        "X-Company-Id": companyId,
        "Authorization": `Bearer ${recruitingAccessToken}`,
      },
      data: info,
    });

    $.export("$summary", "A new application was successfully created!");
    return response;
  },
};
