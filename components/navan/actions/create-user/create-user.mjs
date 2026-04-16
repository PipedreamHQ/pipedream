import app from "../../navan.app.mjs";

export default {
  key: "navan-create-user",
  name: "Create User",
  description: "Creates a new user in the system. [See the documentation](https://u.pcloud.link/publink/show?code=XZ7Bww5ZoKb93VNf7ISOdR5UzVo6JzBLs7AX)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    userName: {
      propDefinition: [
        app,
        "userName",
      ],
    },
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
    },
    active: {
      propDefinition: [
        app,
        "active",
      ],
    },
    title: {
      propDefinition: [
        app,
        "title",
      ],
    },
    employeeNumber: {
      propDefinition: [
        app,
        "employeeNumber",
      ],
    },
    department: {
      propDefinition: [
        app,
        "department",
      ],
    },
    costCenter: {
      propDefinition: [
        app,
        "costCenter",
      ],
    },
    division: {
      propDefinition: [
        app,
        "division",
      ],
    },
    region: {
      propDefinition: [
        app,
        "region",
      ],
    },
    travelPolicy: {
      propDefinition: [
        app,
        "travelPolicy",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      userName,
      firstName,
      lastName,
      active,
      title,
      employeeNumber,
      department,
      costCenter,
      division,
      region,
      travelPolicy,
    } = this;

    const data = {
      schemas: [
        "urn:ietf:params:scim:schemas:core:2.0:User",
      ],
      userName,
      name: {
        givenName: firstName,
        familyName: lastName,
      },
      active,
      title,
      emails: [
        {
          value: userName,
          type: "work",
          primary: true,
        },
      ],
    };

    const enterpriseExtension = {};
    if (employeeNumber) {
      enterpriseExtension.employeeNumber = employeeNumber;
    }
    if (department) {
      enterpriseExtension.department = department;
    }
    if (costCenter) {
      enterpriseExtension.costCenter = costCenter;
    }
    if (division) {
      enterpriseExtension.division = division;
    }

    if (Object.keys(enterpriseExtension).length > 0) {
      data.schemas.push("urn:ietf:params:scim:schemas:extension:enterprise:2.0:User");
      data["urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"] = enterpriseExtension;
    }

    const navanExtension = {};
    if (region) {
      navanExtension.region = region;
    }
    if (travelPolicy) {
      navanExtension.travelPolicy = travelPolicy;
    }

    if (Object.keys(navanExtension).length > 0) {
      data.schemas.push("urn:ietf:params:scim:schemas:extension:navan:2.0:User");
      data["urn:ietf:params:scim:schemas:extension:navan:2.0:User"] = navanExtension;
    }

    const response = await app.createUser({
      $,
      data,
    });

    $.export("$summary", `Successfully created user \`${response.userName}\``);
    return response;
  },
};
