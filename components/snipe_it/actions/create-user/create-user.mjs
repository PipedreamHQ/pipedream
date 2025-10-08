import app from "../../snipe_it.app.mjs";

export default {
  key: "snipe_it-create-user",
  name: "Create User",
  description: "Creates a new user in Snipe-IT with profile information required for asset or license assignments. [See the documentation](https://snipe-it.readme.io/reference/users-2)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
    },
    username: {
      propDefinition: [
        app,
        "username",
      ],
    },
    password: {
      propDefinition: [
        app,
        "password",
      ],
    },
    passwordConfirmation: {
      propDefinition: [
        app,
        "passwordConfirmation",
      ],
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    activated: {
      propDefinition: [
        app,
        "activated",
      ],
    },
    phone: {
      propDefinition: [
        app,
        "phone",
      ],
    },
    jobtitle: {
      propDefinition: [
        app,
        "jobtitle",
      ],
    },
    managerId: {
      propDefinition: [
        app,
        "managerId",
      ],
    },
    employeeNum: {
      propDefinition: [
        app,
        "employeeNum",
      ],
    },
    notes: {
      description: "Notes about the user",
      propDefinition: [
        app,
        "notes",
      ],
    },
    companyId: {
      propDefinition: [
        app,
        "companyId",
      ],
    },
    twoFactorEnrolled: {
      propDefinition: [
        app,
        "twoFactorEnrolled",
      ],
    },
    twoFactorOptIn: {
      propDefinition: [
        app,
        "twoFactorOptIn",
      ],
    },
    departmentId: {
      propDefinition: [
        app,
        "departmentId",
      ],
    },
    locationId: {
      propDefinition: [
        app,
        "locationId",
      ],
    },
    remote: {
      propDefinition: [
        app,
        "remote",
      ],
    },
    groups: {
      propDefinition: [
        app,
        "groupIds",
      ],
    },
    autoAssignLicenses: {
      propDefinition: [
        app,
        "autoAssignLicenses",
      ],
    },
    vip: {
      propDefinition: [
        app,
        "vip",
      ],
    },
    startDate: {
      propDefinition: [
        app,
        "startDate",
      ],
    },
    endDate: {
      propDefinition: [
        app,
        "endDate",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      firstName,
      username,
      password,
      passwordConfirmation,
      lastName,
      email,
      activated,
      phone,
      jobtitle,
      managerId,
      employeeNum,
      notes,
      companyId,
      twoFactorEnrolled,
      twoFactorOptIn,
      departmentId,
      locationId,
      remote,
      groups,
      autoAssignLicenses,
      vip,
      startDate,
      endDate,
    } = this;

    const response = await app.createUser({
      $,
      data: {
        first_name: firstName,
        username,
        password,
        password_confirmation: passwordConfirmation,
        last_name: lastName,
        email,
        activated,
        phone,
        jobtitle,
        manager_id: managerId,
        employee_num: employeeNum,
        notes,
        company_id: companyId,
        two_factor_enrolled: twoFactorEnrolled,
        two_factor_optin: twoFactorOptIn,
        department_id: departmentId,
        location_id: locationId,
        remote,
        groups,
        autoassign_licenses: autoAssignLicenses,
        vip,
        start_date: startDate,
        end_date: endDate,
      },
    });

    $.export("$summary", `Successfully created user with ID \`${response.payload.id}\``);
    return response;
  },
};
