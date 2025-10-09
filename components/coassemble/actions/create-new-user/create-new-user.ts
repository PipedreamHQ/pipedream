import coassemble from "../../app/coassemble.app";

export default {
  key: "coassemble-create-new-user",
  name: "Create New User",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a user as a member of your campus or add an existing user to it. [See the docs here](https://developers.coassemble.com/api/users#add-users)",
  type: "action",
  props: {
    coassemble,
    email: {
      type: "string",
      label: "Email",
      description: "The user's email address.",
    },
    userType: {
      type: "string",
      label: "User type",
      description: "Add this user to either your learners (student) or trainers (team).",
      optional: true,
      options: [
        "student",
        "team",
      ],
    },
    username: {
      type: "string",
      label: "Username",
      description: "A username for the new user. If omitted, their email address will be used instead.",
      optional: true,
    },
    password: {
      type: "string",
      label: "Password",
      description: "New user's password. If omitted, they will be prompted to set a password on first login.",
      optional: true,
      secret: true,
    },
    firstname: {
      type: "string",
      label: "First Name",
      description: "The new user's first name. If omitted, their email address will be used instead.",
      optional: true,
    },
    lastname: {
      type: "string",
      label: "Last Name",
      description: "The new user's last name, if they have one. This is completely optional.",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "The new user's timezone. Will be automatically detected if not provided.",
      optional: true,
    },
    avatar: {
      type: "string",
      label: "Avatar",
      description: "URL pointing to the new user's avatar. They can set this later, or not at all, if desired.",
      optional: true,
    },
    emailVerified: {
      type: "boolean",
      label: "Email Verified",
      description: "Whether you'd like to skip the email verification process for this user.",
      optional: true,
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "The user's locale (language and region). Will be automatically detected if not provided.",
      optional: true,
    },
    active: {
      type: "boolean",
      label: "Active",
      description: "Whether you'd like to skip activation for this user. Recommended for SSO usage.",
      optional: true,
    },
    disableCourseEnrolmentNotification: {
      type: "boolean",
      label: "Disable course enrolment notification",
      description: "Prevent this user from receiving notification emails when enrolled in a course.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      coassemble,
      emailVerified: email_verified,
      disableCourseEnrolmentNotification: disable_course_enrolment_notification,
      ...data
    } = this;
    const response = await coassemble.createUser({
      $,
      data: {
        ...data,
        email_verified,
        disable_course_enrolment_notification,
      },
    });

    $.export("$summary", `A new User with id: ${response.id} was successfully created!`);
    return response;
  },
};
