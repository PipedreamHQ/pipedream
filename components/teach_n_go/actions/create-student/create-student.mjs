import { PAYMENT_METHOD_OPTIONS } from "../../common/constants.mjs";
import app from "../../teach_n_go.app.mjs";

export default {
  key: "teach_n_go-create-student",
  name: "Create Student",
  description: "Registers a new student in Teach 'n Go. [See the documentation](https://intercom.help/teach-n-go/en/articles/6807235-new-student-and-class-registration-api)",
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
      propDefinition: [
        app,
        "firstName",
      ],
      description: "The student's first name.",
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
      description: "The student's last name.",
    },
    gender: {
      propDefinition: [
        app,
        "gender",
      ],
      description: "The student's gender.",
      optional: true,
    },
    registrationDate: {
      type: "string",
      label: "Registration Date",
      description: "The student's registration date. **Format: YYYY-MM-DD**",
      optional: true,
    },
    dateOfBirth: {
      propDefinition: [
        app,
        "dateOfBirth",
      ],
      description: "The student's date of birth. **Format: YYYY-MM-DD**",
      optional: true,
    },
    identificationNumber: {
      type: "string",
      label: "Identification Number",
      description: "The external number to identify the student.",
      optional: true,
    },
    preferredPaymentMethod: {
      type: "integer",
      label: "Preferred Payment Method",
      description: "The payment method the student want to use.",
      options: PAYMENT_METHOD_OPTIONS,
      optional: true,
    },
    discountPercentage: {
      type: "string",
      label: "Discount Percentage",
      description: "The discount percentage on the payment amount.",
      optional: true,
    },
    mobilePhoneCode: {
      type: "integer",
      label: "Mobile Phone Code",
      description: "The region code of the mobile phone. Min length: 2, Max length: 4",
      optional: true,
    },
    mobilePhone: {
      type: "integer",
      label: "Mobile Phone",
      description: "The student's mobile phone",
      optional: true,
    },
    homePhoneCode: {
      type: "integer",
      label: "Home Phone Code",
      description: "The region code of the home phone. Min length: 2, Max length: 4",
      optional: true,
    },
    homePhone: {
      type: "integer",
      label: "Home Phone",
      description: "The student's home phone",
      optional: true,
    },
    emailAddress: {
      propDefinition: [
        app,
        "emailAddress",
      ],
      description: "The student's email address.",
      optional: true,
    },
    streetNameAndNumber: {
      type: "string",
      label: "Street Name And Number",
      description: "The student's full address.",
      optional: true,
    },
    flatFloor: {
      type: "string",
      label: "Flat Floor",
      description: "The student's address flat floor if it exists.",
      optional: true,
    },
    area: {
      type: "string",
      label: "Area",
      description: "The student's address area.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The student's city.",
      optional: true,
    },
    postcode: {
      type: "string",
      label: "Postcode",
      description: "The student's postcode.",
      optional: true,
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "The student's ISO 2 letter country code, e.g. (US, UK, IN).",
      optional: true,
    },
    generalNotes: {
      type: "string",
      label: "General Notes",
      description: "Some student's additional notes.",
      optional: true,
    },
    medicalNotes: {
      type: "string",
      label: "Medical Notes",
      description: "Some student's additional medical notes.",
      optional: true,
    },
    courses: {
      propDefinition: [
        app,
        "courses",
      ],
      optional: true,
    },
    enrolmentDate: {
      type: "string",
      label: "Enrolment Date",
      description: "The date of the student's enrolment.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.registerStudent({
      $,
      data: {
        fname: this.firstName,
        lname: this.lastName,
        gender: this.gender,
        registration_date: this.registrationDate,
        date_of_birth: this.dateOfBirth,
        identification_number: this.identificationNumber,
        preferred_payment_method: this.preferredPaymentMethod,
        discount_percentage: this.discountPercentage && parseFloat(this.discountPercentage),
        mobile_phone_code: this.mobilePhoneCode,
        mobile_phone: this.mobilePhone,
        home_phone_code: this.homePhoneCode,
        home_phone: this.homePhone,
        email_address: this.emailAddress,
        street_name_and_number: this.streetNameAndNumber,
        flat_floor: this.flatFloor,
        area: this.area,
        city: this.city,
        postcode: this.postcode,
        country_code: this.countryCode,
        general_notes: this.generalNotes,
        medical_notes: this.medicalNotes,
        courses: this.courses,
        enrolment_date: this.enrolmentDate,
      },
    });

    $.export("$summary", `Successfully registered student with ID: ${response.data.id}`);
    return response;
  },
};
