import {
  GENDER_OPTIONS, LANGUAGE_OPTIONS,
} from "../../common/constants.mjs";
import lightspeedVt from "../../lightspeed_vt.app.mjs";

export default {
  key: "lightspeed_vt-create-new-user",
  name: "Create New User",
  description: "Creates a new user in the LightSpeed VT system. [See the documentation](https://lsvtapi.stoplight.io/docs/lsvt-rest-api/26844d671bbcf-create-user)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    lightspeedVt,
    isActive: {
      type: "boolean",
      label: "Is Active",
      description: "Set to return active or inactive users only.",
      optional: true,
    },
    locationId: {
      propDefinition: [
        lightspeedVt,
        "locationId",
      ],
    },
    username: {
      type: "string",
      label: "Username",
      description: "The username of the new user.",
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password for the new user.",
      secret: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the new user.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the new user.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the new user.",
    },
    middleName: {
      type: "string",
      label: "Middle Name",
      description: "The middle name of the new user.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the new user.",
      optional: true,
    },
    gender: {
      type: "string",
      label: "Gender",
      description: "The gender of the new user.",
      options: GENDER_OPTIONS,
      optional: true,
    },
    dob: {
      type: "string",
      label: "DOB",
      description: "Valid ISO 8601 timestamp, i.e. yyyyy-MM-ddTHH:mm:ssZ - User's date of birth.",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Default: en-us - Language to set for user - Any valid ISO 639-1 code with region.",
      options: LANGUAGE_OPTIONS,
      optional: true,
    },
    accessLevel: {
      type: "integer",
      label: "Access Level",
      description: "The access level for the new user. [See Access Levels Definition](https://support.lightspeedvt.com/docs/access-level-management)",
      min: 2,
      max: 12,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The company of the new user.",
      optional: true,
    },
    teamId: {
      propDefinition: [
        lightspeedVt,
        "teamId",
      ],
      optional: true,
    },
    jobPositionId: {
      propDefinition: [
        lightspeedVt,
        "jobPositionId",
      ],
      optional: true,
    },
    hireDate: {
      type: "string",
      label: "Hire Date",
      description: "Valid ISO 8601 timestamp, i.e. yyyyy-MM-ddTHH:mm:ssZ - User's hiring date.",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Valid ISO 8601 timestamp, i.e. yyyyy-MM-ddTHH:mm:ssZ - User's starting date.",
      optional: true,
    },
    releaseDate: {
      type: "string",
      label: "Release Date",
      description: "Valid ISO 8601 timestamp, i.e. yyyyy-MM-ddTHH:mm:ssZ - User's release date.",
      optional: true,
    },
    expireDate: {
      type: "string",
      label: "Expire Date",
      description: "Valid ISO 8601 timestamp, i.e. yyyyy-MM-ddTHH:mm:ssZ - User's account expiration date.",
      optional: true,
    },
    affiliateId: {
      type: "string",
      label: "Affiliate Id",
      description: "Affiliate Id associated with creation of user's account.",
      optional: true,
    },
    vendorId: {
      type: "string",
      label: "Vendor Id",
      description: "Custom vendor Id associated with creation of user's account.",
      optional: true,
    },
    misc1: {
      type: "string",
      label: "Misc 1",
      description: "Miscellaneous info field 1.",
      optional: true,
    },
    misc2: {
      type: "string",
      label: "Misc 2",
      description: "Miscellaneous info field 2.",
      optional: true,
    },
    phone1: {
      type: "string",
      label: "Phone 1",
      description: "User's phone number 1.",
      optional: true,
    },
    phone2: {
      type: "string",
      label: "Phone 2",
      description: "User's phone number 2.",
      optional: true,
    },
    contentRole: {
      propDefinition: [
        lightspeedVt,
        "contentRole",
      ],
      optional: true,
    },
    lockUsername: {
      type: "boolean",
      label: "Lock Username",
      description: "Restricts user from changing its username.",
      optional: true,
    },
    lockUsernamePassword: {
      type: "boolean",
      label: "Lock Username Password",
      description: "Restricts user from changing its username and password.",
      optional: true,
    },
    forcePasswordUpdate: {
      type: "boolean",
      label: "Force Password Update",
      description: "Forces user to update its password upon first sign in.",
      optional: true,
    },
    updateMyProfile: {
      type: "boolean",
      label: "Update My Profile",
      description: "Restricts user from updating its profile.",
      optional: true,
    },
    manageUsers: {
      type: "boolean",
      label: "Manage Users",
      description: "Restricts user from managing other users.",
      optional: true,
    },
    billingFrequency: {
      type: "integer",
      label: "Billing Frequency",
      description: "Use to specify the billing schedule frequency in months. **Required if your API settings are set to require this parameter**.",
      optional: true,
    },
    grossFeeCharged: {
      type: "string",
      label: "Gross Fee Charged",
      description: "Use to specify the fee per user. **Required if your API settings are set to require this parameter**.",
      optional: true,
    },
    promoCode: {
      type: "string",
      label: "Promo Code",
      description: "Promo code used during user's account creation.",
      optional: true,
    },
    address1: {
      type: "string",
      label: "Address 1",
      description: "User's address line 1.",
      optional: true,
    },
    address2: {
      type: "string",
      label: "Address 2",
      description: "User's address line 2.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "User's city.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "User's state or province.",
      optional: true,
    },
    zip: {
      type: "string",
      label: "ZIP",
      description: "User's zip or postal code.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "User's country.",
      optional: true,
    },
    mobile: {
      type: "string",
      label: "Mobile",
      description: "User's mobile phone.",
      optional: true,
    },
    addPhone: {
      type: "string",
      label: "Add Phone",
      description: "User's phone number 3.",
      optional: true,
    },
    cellCountry: {
      type: "string",
      label: "Cell Country",
      description: "User's mobile phone country code.",
      optional: true,
    },
    handle: {
      type: "string",
      label: "Handle",
      description: "This is the **Display Name** under **My Profile**. [View Support Article](https://support.lightspeedvt.com/knowledge-base/account-details/).",
      optional: true,
    },
    hometown: {
      type: "string",
      label: "Hometown",
      description: "User's hometown.",
      optional: true,
    },
    aboutMe: {
      type: "string",
      label: "About Me",
      description: "A short description about the user.",
      optional: true,
    },
    facebook: {
      type: "string",
      label: "Facebook",
      description: "Facebook username.",
      optional: true,
    },
    linkedIn: {
      type: "string",
      label: "LinkedIn",
      description: "LinkedIn username.",
      optional: true,
    },
    instagram: {
      type: "string",
      label: "Instagram",
      description: "Instagram username.",
      optional: true,
    },
    twitter: {
      type: "string",
      label: "Twitter",
      description: "Twitter handle.",
      optional: true,
    },
    youtube: {
      type: "string",
      label: "Youtube",
      description: "Youtube username.",
      optional: true,
    },
    tikTok: {
      type: "string",
      label: "TikTok",
      description: "TikTok username.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      lightspeedVt,
      grossFeeCharged,
      ...data
    } = this;

    const response = await lightspeedVt.createUser({
      data: {
        ...data,
        grossFeeCharged: grossFeeCharged && parseFloat(grossFeeCharged),
      },
    });
    $.export("$summary", `Successfully created new user with ID ${response.userId}`);
    return response;
  },
};
