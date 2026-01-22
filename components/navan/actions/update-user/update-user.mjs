import app from "../../navan.app.mjs";

export default {
  key: "navan-update-user",
  name: "Update User",
  description: "Performs partial updates to a user using SCIM patch operations. [See the documentation](https://u.pcloud.link/publink/show?code=XZ7Bww5ZoKb93VNf7ISOdR5UzVo6JzBLs7AX)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
    },
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
      optional: true,
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
  },
  async run({ $ }) {
    const {
      app,
      userId,
      firstName,
      lastName,
      active,
      title,
      employeeNumber,
      department,
      costCenter,
      division,
    } = this;

    const operations = [];

    if (firstName) {
      operations.push({
        op: "replace",
        path: "name.givenName",
        value: firstName,
      });
    }

    if (lastName) {
      operations.push({
        op: "replace",
        path: "name.familyName",
        value: lastName,
      });
    }

    if (active) {
      operations.push({
        op: "replace",
        path: "active",
        value: active,
      });
    }

    if (title) {
      operations.push({
        op: "replace",
        path: "title",
        value: title,
      });
    }

    if (employeeNumber) {
      operations.push({
        op: "replace",
        path: "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:employeeNumber",
        value: employeeNumber,
      });
    }

    if (department) {
      operations.push({
        op: "replace",
        path: "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:department",
        value: department,
      });
    }

    if (costCenter) {
      operations.push({
        op: "replace",
        path: "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:costCenter",
        value: costCenter,
      });
    }

    if (division) {
      operations.push({
        op: "replace",
        path: "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:division",
        value: division,
      });
    }

    const response = await app.updateUser({
      $,
      userId,
      data: {
        schemas: [
          "urn:ietf:params:scim:api:messages:2.0:PatchOp",
        ],
        Operations: operations,
      },
    });

    $.export("$summary", `Successfully updated user \`${response.userName}\``);
    return response;
  },
};
