import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "edusign",
  version: "0.0.1",
  propDefinitions: {
    courseId: {
      type: "string",
      label: "Course ID",
      description: "The unique identifier for the course",
    },
    courseName: {
      type: "string",
      label: "Course Name",
      description: "The name of the course",
    },
    courseDescription: {
      type: "string",
      label: "Course Description",
      description: "A description of the course",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the course (ISO 8601 format)",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date of the course (ISO 8601 format)",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the student",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the student",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The unique email identifier for the student",
    },
    studentId: {
      type: "string",
      label: "Student ID",
      description: "The unique identifier for the student",
    },
    address: {
      type: "string",
      label: "Address",
      description: "The address of the student",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the student",
      optional: true,
    },
    dateOfBirth: {
      type: "string",
      label: "Date of Birth",
      description: "The date of birth of the student (ISO 8601 format)",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://ext.edusign.fr/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        data,
        params,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        data,
        params,
        ...otherOpts,
      });
    },
    async createCourse({
      courseId, courseName, courseDescription, startDate, endDate,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/course",
        data: {
          ID: courseId,
          NAME: courseName,
          DESCRIPTION: courseDescription,
          START: startDate,
          END: endDate,
        },
      });
    },
    async registerStudent({
      firstName, lastName, email, studentId, address, phoneNumber, dateOfBirth,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/students",
        data: {
          firstName,
          lastName,
          email,
          studentId,
          address,
          phoneNumber,
          dateOfBirth,
        },
      });
    },
    async getCourseDetails({ courseId }) {
      return this._makeRequest({
        path: `/course/${courseId}`,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
