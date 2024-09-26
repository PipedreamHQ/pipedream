import aws from "../aws.app.mjs";
import {
  IAMClient,
  CreateRoleCommand,
  DeleteRoleCommand,
  ListRolesCommand,
  ListRolePoliciesCommand,
  PutRolePolicyCommand,
  DeleteRolePolicyCommand,
} from "@aws-sdk/client-iam";
import { generateRandomUniqueName } from "../common/utils.mjs";

export default {
  props: {
    aws,
    region: {
      propDefinition: [
        aws,
        "region",
      ],
      description: "The AWS region tied to your Lambda, e.g `us-east-1` or `us-west-2`",
    },
    role: {
      type: "string",
      label: "Role",
      description: "An IAM Role ARN, e.g., `arn:aws:iam::650138640062:role/v3-lambda-tutorial-lambda-role`. [See docs](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html)",
      async options() {
        const response = await this.listRoles();
        return response.Roles.map((role) => ({
          label: role.RoleName,
          value: role.Arn,
        }));
      },
    },
  },
  methods: {
    _clientIam() {
      return this.aws.getAWSClient(IAMClient, this.region);
    },
    _getAssumeRolePolicyForService(service) {
      return {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: service,
            },
            Action: "sts:AssumeRole",
          },
        ],
      };
    },
    /**
     * This method creates an IAM role for an AWS service. The role will be
     * created in the specified region, and will grant `sts:AssumeRole`
     * permissions to the referred service.
     *
     * @param {string}  service - The service that will be granted
     * `sts:AssumeRole` permissions (e.g. `states.amazonaws.com` for Step
     * Functions). You can see [this
     * link]{@link https://gist.github.com/shortjared/4c1e3fe52bdfa47522cfe5b41e5d6f22}
     * for a community-driven list (the official AWS docs still don't have such
     * a list).
     * @param {string} [roleDescription] - A text describing the purpose of the
     * role
     * @returns {Promise<object>} An object containing the new role's name and
     * ARN (`roleName` and `roleArn` respectively)
     */
    async createServiceRole(service, roleDescription) {
      const assumeRolePolicyDocument = JSON.stringify(
        this._getAssumeRolePolicyForService(service),
      );
      const params = {
        AssumeRolePolicyDocument: assumeRolePolicyDocument,
        RoleName: generateRandomUniqueName(),
        Description: roleDescription,
        Path: "/pipedream/",
      };
      const { Role } = await this._clientIam().send(new CreateRoleCommand(params));
      return {
        roleArn: Role.Arn,
        roleName: Role.RoleName,
      };
    },
    /**
     * This method adds permissions to an IAM role in the form of inline
     * policies. However, such permissions are free-form as long as they are
     * compatible with the IAM format.
     *
     * @see {@link https://amzn.to/3tV5qyj IAM Policies Reference}
     *
     * @param {string} roleName - The name of the role to add permissions to
     * @param {object} permissions - An object containing the name and policy
     * document of the permissions to attach to the specified role
     * @param {string} permissions.name - The name of the inline permission to
     * attach to the specified role
     * @param {object} permissions.document - A JSON-serializable object with
     * the permissions to attach to the specified IAM role
     * @returns {Promise<void>}
     */
    async addPermissionsToRole(roleName, permissions) {
      const params = {
        PolicyDocument: JSON.stringify(permissions.document),
        PolicyName: permissions.name,
        RoleName: roleName,
      };
      await this._clientIam().send(new PutRolePolicyCommand(params));
    },
    async _deleteInlinePoliciesForRole(roleName) {
      const params = {
        RoleName: roleName,
      };

      while (true) {
        const { PolicyNames: policyNames = [] } = await this._clientIam().send(
          new ListRolePoliciesCommand(params),
        );

        if (policyNames.length <= 0) {
          // No more inline policies to delete, we can return now
          return;
        }

        await Promise.all(
          policyNames
            .map((policyName) => ({
              RoleName: roleName,
              PolicyName: policyName,
            }))
            .map((params) => this._clientIam().send(new DeleteRolePolicyCommand(params))),
        );
      }
    },
    /**
     * This method deletes a specific IAM role in the specified region.
     *
     * @param {string} roleName - The name of the role to add permissions to
     * @returns {Promise<void>}
     */
    async deleteRole(roleName) {
      // We must delete all the inline policies attached to the role before
      // we're allowed to delete it
      await this._deleteInlinePoliciesForRole(roleName);
      this._clientIam().send(new DeleteRoleCommand({
        RoleName: roleName,
      }));
    },
    async listRoles() {
      return this._clientIam().send(new ListRolesCommand({}));
    },
  },
};
