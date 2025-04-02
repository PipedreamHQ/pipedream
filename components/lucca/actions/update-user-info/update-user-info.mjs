import lucca from "../../lucca.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "lucca-update-user-info",
  name: "Update User Info",
  description: "Update profile or HR information for an existing user. [See the documentation](https://developers.lucca.fr/api-reference/legacy/directory/update-a-user-by-id)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    lucca,
    userId: {
      propDefinition: [
        lucca,
        "userId",
      ],
    },
    firstname: {
      type: "string",
      label: "First Name",
      description: "The user's first name",
      optional: true,
    },
    lastname: {
      type: "string",
      label: "Last Name",
      description: "The user's last name",
      optional: true,
    },
    mail: {
      type: "string",
      label: "Email",
      description: "The user's email",
      optional: true,
    },
    login: {
      type: "string",
      label: "Login",
      description: "The user's login",
      optional: true,
    },
    legalentityid: {
      type: "integer",
      label: "Legal Entity ID",
      description: "The ID of the legal entity",
      optional: true,
    },
    cspid: {
      type: "integer",
      label: "CSP ID",
      description: "The ID of the CSP",
      optional: true,
    },
    calendarid: {
      type: "integer",
      label: "Calendar ID",
      description: "The ID of the calendar",
      optional: true,
    },
    employeenumber: {
      type: "string",
      label: "Employee Number",
      description: "The employee number",
      optional: true,
    },
    birthdate: {
      type: "string",
      label: "Birth Date",
      description: "The birth date of the user. Format: 'YYYY-MM-DD'.",
      optional: true,
    },
    userworkcycles: {
      type: "string[]",
      label: "User Work Cycles",
      description: "An array of user work cycles in JSON format",
      optional: true,
    },
    departmentid: {
      type: "integer",
      label: "Department ID",
      description: "The ID of the department",
      optional: true,
    },
    managerid: {
      type: "integer",
      label: "Manager ID",
      description: "The ID of the manager",
      optional: true,
    },
    roleprincipalid: {
      type: "integer",
      label: "Role Principal ID",
      description: "The ID of the role principal",
      optional: true,
    },
    habilitedroles: {
      type: "string[]",
      label: "Habilited Roles",
      description: "An array of habilited roles in JSON format",
      optional: true,
    },
    cultureid: {
      type: "integer",
      label: "Culture ID",
      description: "The ID of the culture",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "The address of the user",
      optional: true,
    },
    bankname: {
      type: "string",
      label: "Bank Name",
      description: "The name of the bank",
      optional: true,
    },
    directline: {
      type: "string",
      label: "Direct Line",
      description: "The direct line of the user",
      optional: true,
    },
    jobtitle: {
      type: "string",
      label: "Job Title",
      description: "The job title of the user",
      optional: true,
    },
    gender: {
      type: "string",
      label: "Gender",
      description: "The gender of the user",
      optional: true,
    },
    nationality: {
      type: "string",
      label: "Nationality",
      description: "The nationality of the user",
      optional: true,
    },
    personalemail: {
      type: "string",
      label: "Personal Email",
      description: "The personal email of the user",
      optional: true,
    },
    personalmobile: {
      type: "string",
      label: "Personal Mobile",
      description: "The personal mobile of the user",
      optional: true,
    },
    professionalmobile: {
      type: "string",
      label: "Professional Mobile",
      description: "The professional mobile of the user",
      optional: true,
    },
    quote: {
      type: "string",
      label: "Quote",
      description: "The quote of the user",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      firstName: this.firstname,
      lastName: this.lastname,
      mail: this.mail,
      login: this.login,
      legalEntityId: this.legalentityid,
      cspId: this.cspid,
      calendarId: this.calendarid,
      employeeNumber: this.employeenumber,
      birthDate: this.birthdate,
      userWorkCycles: this.userworkcycles
        ? this.userworkcycles.map(JSON.parse)
        : [],
      departmentId: this.departmentid,
      managerId: this.managerid,
      rolePrincipalId: this.roleprincipalid,
      habilitedRoles: this.habilitedroles
        ? this.habilitedroles.map(JSON.parse)
        : [],
      cultureId: this.cultureid,
      address: this.address,
      bankName: this.bankname,
      directLine: this.directline,
      jobTitle: this.jobtitle,
      gender: this.gender,
      nationality: this.nationality,
      personalEmail: this.personalemail,
      personalMobile: this.personalmobile,
      professionalMobile: this.professionalmobile,
      quote: this.quote,
    };

    const response = await this.lucca.updateUserProfile({
      userId: this.userId,
      ...data,
    });

    $.export("$summary", `Successfully updated user with ID: ${this.userId}`);
    return response;
  },
};
