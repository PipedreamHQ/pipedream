import AWS from "aws-sdk";
import awsRegions from "./regions.mjs";
import { generateRandomUniqueName } from "./sources/common/utils.mjs";

export default {
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
    logGroupNames: {
      label: "CloudWatch Log Groups",
      description: "The name of the log group",
      type: "string[]",
      async options({
        region, prevContext,
      }) {
        const prevToken = prevContext.nextToken;
        const {
          logGroups,
          nextToken,
        } = await this.logsInsightsDescibeLogGroups(region, prevToken);
        const options = logGroups.map((group) => {
          return {
            label: group.logGroupName,
            value: group.logGroupName,
          };
        });
        return {
          options,
          context: {
            nextToken,
          },
        };
      },
    },
    logStreamNames: {
      label: "CloudWatch Log Streams",
      description: "The name of the log stream for the chosen log group",
      type: "string[]",
      async options({
        logGroupName, region, prevContext,
      }) {
        const prevToken = prevContext.nextToken;
        const {
          logStreams,
          nextToken,
        } = await this.logsInsightsDescibeLogStreams(region, logGroupName, prevToken);
        const options = logStreams.map((group) => {
          return {
            label: group.logStreamName,
            value: group.logStreamName,
          };
        });
        return {
          options,
          context: {
            nextToken,
          },
        };
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
     * you can find in the ${@linkcode ./regions.mjs regions.mjs} file, as well as
     * by calling the EC2 `DescribeRegions` API.
     * @returns A new configured instance of the AWS SDK
     */
    sdk(region) {
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
    _getCloudWatchLogsClient(region) {
      const AWS = this.sdk(region);
      return new AWS.CloudWatchLogs();
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
     * you can find in the ${@linkcode ./regions.mjs regions.mjs} file.
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
     * you can find in the ${@linkcode ./regions.mjs regions.mjs} file.
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
     * you can find in the ${@linkcode ./regions.mjs regions.mjs} file.
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
    /**
     * This method describes CloudWatch Log groups
     *
     * @param {string} region - The AWS region to which the AWS SDK will
     * connect. This string should be an acceptable value by the AWS SDK, which
     * you can find in the ${@linkcode ./regions.mjs regions.mjs} file.
     * @param {string} nextToken - The token for the next set of items to return.
     * (You received this token from a previous call.)
     * @returns {Promise<object>} An object containing the log groups and a nextToken
     * to use in subsequent calls (`logGroups` and `nextToken` respectively)
     */
    async logsInsightsDescibeLogGroups(region, lastToken) {
      const params = {
        nextToken: lastToken,
      };
      const data = await this.
        _getCloudWatchLogsClient(region)
        .describeLogGroups(params)
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
    /**
     * This method describes CloudWatch Log streams for a given log group
     *
     * @param {string} region - The AWS region to which the AWS SDK will
     * connect. This string should be an acceptable value by the AWS SDK, which
     * you can find in the ${@linkcode ./regions.mjs regions.mjs} file.
     * @param {string} logGroupName - The name of the log group.
     * @param {string} nextToken - The token for the next set of items to return.
     * (You received this token from a previous call.)
     * @returns {Promise<object>} An object containing the log streams and a nextToken
     * to use in subsequent calls (`logStreams` and `nextToken` respectively)
     */
    async logsInsightsDescibeLogStreams(region, logGroupName, lastToken) {
      const params = {
        logGroupName,
        nextToken: lastToken,
      };
      const data = await this.
        _getCloudWatchLogsClient(region)
        .describeLogStreams(params)
        .promise();
      const {
        logStreams,
        nextToken,
      } = data;
      return {
        logStreams,
        nextToken,
      };
    },
    /**
     * This method uploads a batch of log events to the specified log stream.
     *
     * @param {string} region - The AWS region to which the AWS SDK will
     * connect. This string should be an acceptable value by the AWS SDK, which
     * you can find in the ${@linkcode ./regions.mjs regions.mjs} file.
     * @param {string} logGroupName - The name of the log group.
     * @param {string} logStreamName - The name of the log stream.
     * @param {Array.<Object>} logEvents - An array of log events. Each log event
     * must contain a `timestamp` (the time the event occurred) and a `message`
     * @param {string} sequenceToken - The sequence token obtained from the
     * response of the previous PutLogEvents call
     * @returns {Promise<object>} An object containing the sequenceToken to use
     * to use in subsequent calls and rejected log events (`nextSequenceToken`
     * and `rejectedLogEventsInfo` respectively)
     */
    async logsPutLogEvents(region, logGroupName, logStreamName, logEvents, sequenceToken) {
      const params = {
        logGroupName,
        logStreamName,
        logEvents,
        sequenceToken,
      };
      const data = await this.
        _getCloudWatchLogsClient(region)
        .putLogEvents(params)
        .promise();
      const {
        nextSequenceToken,
        rejectedLogEventsInfo,
      } = data;
      return {
        nextSequenceToken,
        rejectedLogEventsInfo,
      };
    },
  },
};
