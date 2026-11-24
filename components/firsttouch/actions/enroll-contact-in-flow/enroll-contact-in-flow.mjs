import firsttouch from "../../firsttouch.app.mjs";

export default {
  key: "firsttouch-enroll-contact-in-flow",
  name: "Enroll Contact in Flow",
  description: "Add a contact to a FirstTouch flow. Identify the contact by email, LinkedIn profile URL, or first name + last name + company domain. [See the documentation](https://docs.firsttouch.com)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    firsttouch,
    flowId: {
      propDefinition: [
        firsttouch,
        "flowId",
      ],
    },
    email: {
      propDefinition: [
        firsttouch,
        "email",
      ],
    },
    linkedinUrl: {
      propDefinition: [
        firsttouch,
        "linkedinUrl",
      ],
      optional: true,
    },
    firstName: {
      propDefinition: [
        firsttouch,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        firsttouch,
        "lastName",
      ],
      optional: true,
    },
    companyDomain: {
      propDefinition: [
        firsttouch,
        "companyDomain",
      ],
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The contact's phone number",
      optional: true,
    },
    customVariables: {
      type: "object",
      label: "Custom Variables",
      description: "Values for the flow's custom inputs, by name. For example a `job_title` value fills the `ft.custom.job_title` placeholder in the flow's messages.",
      optional: true,
    },
    enrollmentMode: {
      type: "string",
      label: "Enrollment Mode",
      description: "Leave empty to use the flow's own setting",
      optional: true,
      options: [
        {
          label: "Add to Awaiting only",
          value: "manual",
        },
        {
          label: "Start now (flow must be published)",
          value: "enroll",
        },
      ],
    },
    skipExclusionCheck: {
      type: "boolean",
      label: "Skip Exclusion Check",
      description: "Enroll even if the contact matches one of your FirstTouch exclusions",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const clean = (value) => {
      const text = String(value ?? "").trim();
      return text === ""
        ? null
        : text;
    };
    const email = clean(this.email);
    const rawLinkedin = clean(this.linkedinUrl);
    const firstName = clean(this.firstName);
    const lastName = clean(this.lastName);
    const domain = clean(this.companyDomain);
    if (!email && !rawLinkedin && !(firstName && lastName && domain)) {
      throw new Error("Provide an email, a LinkedIn profile URL, or first name + last name + company domain.");
    }
    const customVariables = Object.fromEntries(Object.entries(this.customVariables || {})
      .filter(([
        key,
      ]) => key.trim() !== "")
      .map(([
        key,
        value,
      ]) => [
        key.trim(),
        String(value ?? ""),
      ]));
    const response = await this.firsttouch.addManualFlowEnrollment({
      $,
      data: {
        flowPlanId: this.flowId,
        includeWorkspaceRefresh: false,
        ...(this.enrollmentMode
          ? {
            enrollmentMode: this.enrollmentMode,
          }
          : {}),
        manualEnrollment: {
          prospect: {
            firstName,
            lastName,
            email,
            linkedinUrl: rawLinkedin
              ? this.firsttouch.normalizeProfileUrl(rawLinkedin)
              : null,
            phone: clean(this.phone),
          },
          company: {
            domain,
            linkedinUrl: null,
            linkedinId: null,
          },
          options: {
            ignoreExclusionCheck: this.skipExclusionCheck === true,
          },
          ...(Object.keys(customVariables).length
            ? {
              customVariables,
            }
            : {}),
        },
      },
    });
    $.export("$summary", response.summary || "Added contact to the flow");
    return response;
  },
};
