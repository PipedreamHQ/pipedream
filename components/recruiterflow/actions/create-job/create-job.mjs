import app from "../../recruiterflow.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "recruiterflow-create-job",
  name: "Create Job",
  description: "Creates a new job posting in Recruiterflow. [See the documentation](https://recruiterflow.com/swagger.yml)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    title: {
      type: "string",
      label: "Job Title",
      description: "The title of the job",
    },
    clientCompanyId: {
      propDefinition: [
        app,
        "companyId",
      ],
      label: "Client Company ID",
      description: "The ID of the client company for this job",
    },
    createdBy: {
      propDefinition: [
        app,
        "userId",
      ],
      label: "Created By",
      description: "ID of the user creating the job",
    },
    aboutPosition: {
      type: "string",
      label: "Job Description",
      description: "Detailed description of the job position",
      optional: true,
    },
    departmentId: {
      propDefinition: [
        app,
        "departmentId",
      ],
      optional: true,
    },
    employmentTypeId: {
      propDefinition: [
        app,
        "employmentTypeId",
      ],
      optional: true,
    },
    locations: {
      type: "string",
      description: "Array of location IDs for the job. Get the list from /api/external/location/list",
      optional: true,
      propDefinition: [
        app,
        "locationId",
      ],
    },
    salaryRangeStart: {
      type: "integer",
      label: "Salary Range Start",
      description: "Minimum salary for the position",
      optional: true,
    },
    salaryRangeEnd: {
      type: "integer",
      label: "Salary Range End",
      description: "Maximum salary for the position",
      optional: true,
    },
    experienceRangeStart: {
      type: "integer",
      label: "Experience Range Start",
      description: "Minimum years of experience required",
      optional: true,
    },
    experienceRangeEnd: {
      type: "integer",
      label: "Experience Range End",
      description: "Maximum years of experience required",
      optional: true,
    },
    skills: {
      type: "string[]",
      label: "Skills",
      description: "Array of required skills (e.g., [\"python\", \"java\"])",
      optional: true,
    },
    contacts: {
      type: "string[]",
      label: "Contact IDs",
      description: "Array of contact IDs associated with this job",
      optional: true,
    },
    hiringTeam: {
      type: "string[]",
      label: "Hiring Team",
      description: "Array of hiring team members. Format: `[{\"id\": role_id, \"values\": [{\"user_id\": user_id}]}]`",
      optional: true,
    },
    customFields: {
      type: "string[]",
      label: "Custom Fields",
      description: "Array of custom field objects. Format varies by field type - see API documentation for details",
      optional: true,
    },
  },
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  async run({ $ }) {
    const {
      app,
      title,
      clientCompanyId,
      createdBy,
      aboutPosition,
      departmentId,
      employmentTypeId,
      locations,
      salaryRangeStart,
      salaryRangeEnd,
      experienceRangeStart,
      experienceRangeEnd,
      skills,
      contacts,
      hiringTeam,
      customFields,
    } = this;

    const data = {
      title,
      client_company_id: clientCompanyId,
      created_by: createdBy,
      about_position: aboutPosition,
      department_id: departmentId,
      employment_type_id: employmentTypeId,
      locations,
      salary_range_start: salaryRangeStart,
      salary_range_end: salaryRangeEnd,
      experience_range_start: experienceRangeStart,
      experience_range_end: experienceRangeEnd,
      skills,
      contacts,
    };

    // Parse JSON strings for object arrays
    if (hiringTeam) {
      data.hiring_team = utils.parseJson(hiringTeam);
    }
    if (customFields) {
      data.custom_fields = utils.parseJson(customFields);
    }

    const response = await app.createJob({
      $,
      data,
    });

    $.export("$summary", `Successfully created job: ${title}`);
    return response;
  },
};
