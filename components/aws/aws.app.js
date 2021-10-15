const awsRegions = require("./regions");
const {
  generateRandomUniqueName,
  toSingleLineString,
} = require("./sources/common/utils");

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
    bucket: {
      type: "string",
      label: "Bucket",
      description: "The S3 bucket to watch for events",
      async options(context) {
        const { page = 0 } = context;
        if (page !== 0) {
          return [];
        }
        const buckets = await this._getBuckets();
        return buckets.map((bucket) => bucket.Name);
      },
    },
    secret: {
      type: "string",
      secret: true,
      label: "Secret",
      optional: true,
      description: toSingleLineString(`
        **Optional but recommended**: if you enter a secret here,
        you must pass this value in [the
        \`secret\` parameter of each HTTP POST request](https://git.io/JsJ6m)
      `),
    },
    ignoreDeleteMarkers: {
      type: "boolean",
      label: "Ignore Delete Markers",
      description: toSingleLineString(`
        When ignoring delete markers this will only emit events for permanently deleted files`),
    },
    domain: {
      label: "SES Domain",
      description: "The domain you'd like to configure a catch-all handler for",
      type: "string",
      options() {
        return this.sesIdentities();
      },
    },
    logGroupNames: {
      label: "CloudWatch Log Groups",
      description: "The log groups you'd like to query",
      type: "string[]",
      async options({ prevContext }) {
        const prevToken = prevContext.nextToken;
        const {
          logGroups,
          nextToken,
        } = await this.aws.logsInsightsDescibeLogGroups(this.region, prevToken);
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
    queryString: {
      label: "Logs Insights Query",
      description: toSingleLineString(`
        The query you'd like to run. See [this AWS
        doc](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html)
        for help with query syntax
      `),
      type: "string",
    },
    emitResultsInBatch: {
      type: "boolean",
      label: "Emit query results as a single event",
      description: toSingleLineString(`
        If \`true\`, all events are emitted as an array, within a single Pipedream event.
        If \`false\`, each row of results is emitted as its own event.
      `),
    },
    eventTypes: {
      type: "string[]",
      label: "Event Types",
      description: "The type of events to watch",
      options: [
        // See the AWS docs for more information about the supported events
        // emitted by S3: https://amzn.to/3AtmKy1
        "s3:ObjectCreated:Put",
        "s3:ObjectCreated:Post",
        "s3:ObjectCreated:Copy",
        "s3:ObjectCreated:CompleteMultipartUpload",
        "s3:ObjectRemoved:Delete",
        "s3:ObjectRemoved:DeleteMarkerCreated",
        "s3:ObjectRestore:Post",
        "s3:ObjectRestore:Completed",
        "s3:ReducedRedundancyLostObject",
        "s3:Replication:OperationFailedReplication",
        "s3:Replication:OperationMissedThreshold",
        "s3:Replication:OperationReplicatedAfterThreshold",
        "s3:Replication:OperationNotTracked",
      ],
    },
    topic: {
      label: "SNS Topic Name",
      description: toSingleLineString(`
        **Pipedream will create an SNS topic with this name in your account**,
        converting it to a [valid SNS topic
        name](https://docs.aws.amazon.com/sns/latest/api/API_CreateTopic.html).
      `),
      type: "string",
    },
    detectRestoreInitiation: {
      type: "boolean",
      label: "Detect Restore Initiation",
      description: toSingleLineString(`
        When enabled, this event source will also emit events whenever a restore is initiated
      `),
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
