const awsRegions = require("./regions");
const { generateRandomUniqueName } = require("./sources/common/utils");

module.exports = {
  type: "app",
  app: "aws",
  propDefinitions: {
    region: {
      label: "AWS Region",
      description: "The AWS region string where you'd like to create your SNS topic",
      type: "string",
      default: "us-east-1",
      options({ page = 0 }) {
        if (page !== 0) {
          return [];
        }

        return this._getAvailableRegions();
      },
    },
  },
  methods: {
    /**
     * This function configures and returns a new reference to the AWS SDK. The
     * configuration involves setting the region based on the provided argument,
     * as well as setting up the credentials previously provided by the user
     * when setting up their AWS account.
     *
     * @param {string} region - The AWS region to which the AWS SDK will
     * connect. This string should be an acceptable value by the AWS SDK, which
     * you can find in the ${@linkcode ./regions.js regions.js} file, as well as
     * by calling the EC2 `DescribeRegions` API.
     * @returns A new configured instance of the AWS SDK
     */
    sdk(region) {
      const AWS = require("aws-sdk");
      const {
        accessKeyId,
        secretAccessKey,
      } = this.$auth;
      AWS.config.update({
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
        region,
      });
      return AWS;
    },
    async _getAvailableRegions() {
      let awsResponse;
      try {
        awsResponse = await this
          ._getEc2Client()
          .describeRegions()
          .promise();
      } catch (error) {
        // Retrieval of available regions can fail if the registered account
        // does not have enough permissions to call the EC2 `DescribeRegions`
        // API. In that case, we default to the static list of regions.
        console.log(`Could not retrieve available regions from AWS: ${error}`);
        return awsRegions;
      }

      return awsResponse
        .Regions
        .map((regionInfo) => regionInfo.RegionName)
        .sort();
    },
    _getEc2Client(region = "us-east-1") {
      const AWS = this.sdk(region);
      return new AWS.EC2();
    },
    _getIamClient(region) {
      const AWS = this.sdk(region);
      return new AWS.IAM();
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
     * @param {string} region - The AWS region to which the AWS SDK will
     * connect. This string should be an acceptable value by the AWS SDK, which
     * you can find in the ${@linkcode ./regions.js regions.js} file.
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
    async createServiceRole(region, service, roleDescription) {
      const assumeRolePolicyDocument = JSON.stringify(
        this._getAssumeRolePolicyForService(service),
      );
      const params = {
        AssumeRolePolicyDocument: assumeRolePolicyDocument,
        RoleName: generateRandomUniqueName(),
        Description: roleDescription,
        Path: "/pipedream/",
      };
      const { Role } = await this
        ._getIamClient(region)
        .createRole(params)
        .promise();
      console.log(Role);
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
     * @param {string} region - The AWS region to which the AWS SDK will
     * connect. This string should be an acceptable value by the AWS SDK, which
     * you can find in the ${@linkcode ./regions.js regions.js} file.
     * @param {string} roleName - The name of the role to add permissions to
     * @param {object} permissions - An object containing the name and policy
     * document of the permissions to attach to the specified role
     * @param {string} permissions.name - The name of the inline permission to
     * attach to the specified role
     * @param {object} permissions.document - A JSON-serializable object with
     * the permissions to attach to the specified IAM role
     * @returns {Promise<void>}
     */
    async addPermissionsToRole(region, roleName, permissions) {
      const params = {
        PolicyDocument: JSON.stringify(permissions.document),
        PolicyName: permissions.name,
        RoleName: roleName,
      };
      await this
        ._getIamClient(region)
        .putRolePolicy(params)
        .promise();
    },
    async _deleteInlinePoliciesForRole(region, roleName) {
      const params = {
        RoleName: roleName,
      };

      while (true) {
        const { PolicyNames: policyNames = [] } = await this
          ._getIamClient(region)
          .listRolePolicies(params)
          .promise();

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
            .map(
              (params) => this
                ._getIamClient(region)
                .deleteRolePolicy(params)
                .promise(),
            ),
        );
      }

    },
    /**
     * This method deletes a specific IAM role in the specified region.
     *
     * @param {string} region - The AWS region to which the AWS SDK will
     * connect. This string should be an acceptable value by the AWS SDK, which
     * you can find in the ${@linkcode ./regions.js regions.js} file.
     * @param {string} roleName - The name of the role to add permissions to
     * @returns {Promise<void>}
     */
    async deleteRole(region, roleName) {
      // We must delete all the inline policies attached to the role before
      // we're allowed to delete it
      await this._deleteInlinePoliciesForRole(region, roleName);

      const params = {
        RoleName: roleName,
      };
      await this
        ._getIamClient(region)
        .deleteRole(params)
        .promise();
    },
    async logsInsightsDescibeLogGroups(region, lastToken) {
      const AWS = this.sdk(region);
      const cloudwatchlogs = new AWS.CloudWatchLogs();
      const data = await cloudwatchlogs
        .describeLogGroups({
          nextToken: lastToken,
        })
        .promise();
      const {
        logGroups,
        nextToken,
      } = data;
      return {
        logGroups,
        nextToken,
      };
    },
  },
};
