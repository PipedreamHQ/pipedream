import app from "../../homerun.app.mjs";

export default {
  key: "homerun-create-job-application",
  name: "Create Job Application",
  description: "Creates a new job application. [See the documentation](https://developers.homerun.co/#tag/Job-Applications/operation/job-applications.post).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the applicant. Make sure you don't include numbers or special characters.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the applicant. Make sure you don't include numbers or special characters.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the applicant.",
    },
    dateOfBirth: {
      type: "string",
      label: "Date of Birth",
      description: "The date of birth of the applicant in the format of `YYYY-MM-DD`.",
      optional: true,
    },
    vacancyId: {
      optional: true,
      propDefinition: [
        app,
        "vacancyId",
      ],
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the applicant.",
      optional: true,
    },
    photo: {
      type: "string",
      label: "Photo",
      description: "The URL of the applicant's photo.",
      optional: true,
    },
    experience: {
      type: "string",
      label: "Experience",
      description: "The experience of the applicant.",
      optional: true,
    },
    education: {
      type: "string",
      label: "Education",
      description: "The education of the applicant.",
      optional: true,
    },
    facebook: {
      type: "string",
      label: "Facebook",
      description: "The Facebook URL of the applicant. eg. `https://facebook.com/username`",
      optional: true,
    },
    twitter: {
      type: "string",
      label: "X",
      description: "The X URL of the applicant. eg. `https://x.com/username`",
      optional: true,
    },
    linkedin: {
      type: "string",
      label: "LinkedIn",
      description: "The LinkedIn URL of the applicant. eg. `https://linkedin.com/in/username`",
      optional: true,
    },
    github: {
      type: "string",
      label: "GitHub",
      description: "The GitHub URL of the applicant. eg. `https://github.com/username`",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "The website URL of the applicant. eg. `https://username.com`",
      optional: true,
    },
  },
  methods: {
    createJobApplication(args = {}) {
      return this.app.post({
        path: "/job-applications",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createJobApplication,
      firstName,
      lastName,
      email,
      dateOfBirth,
      vacancyId,
      phoneNumber,
      photo,
      experience,
      education,
      facebook,
      twitter,
      linkedin,
      github,
      website,
    } = this;

    const response = await createJobApplication({
      $,
      data: {
        vacancyId,
        first_name: firstName,
        last_name: lastName,
        email,
        date_of_birth: dateOfBirth,
        phone_number: phoneNumber,
        photo,
        experience,
        education,
        facebook,
        twitter,
        linkedin,
        github,
        website,
      },
    });

    $.export("$summary", "Successfully created a job application.");
    return response;
  },
};
