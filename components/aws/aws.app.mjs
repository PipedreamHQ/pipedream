import axios from "axios"; // need axios response headers
import AdmZip from "adm-zip";
import dedent from "dedent";
import common from "./common/common.mjs";
import constants from "./common/constants.mjs";
import {
  generateRandomUniqueName,
  toSingleLineString,
} from "./common/utils.mjs";
import { DescribeRegionsCommand } from "@aws-sdk/client-ec2";
import {
  ListTablesCommand,
  DescribeTableCommand,
  CreateTableCommand,
  UpdateTableCommand,
  ExecuteStatementCommand,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import {
  CreateRoleCommand,
  DeleteRoleCommand,
  ListRolesCommand,
  ListRolePoliciesCommand,
  PutRolePolicyCommand,
  DeleteRolePolicyCommand,
} from "@aws-sdk/client-iam";
import {
  DescribeLogStreamsCommand,
  DescribeLogGroupsCommand,
  PutLogEventsCommand,
} from "@aws-sdk/client-cloudwatch-logs";
import {
  ListTopicsCommand,
  PublishCommand,
} from "@aws-sdk/client-sns";
import {
  ListQueuesCommand,
  SendMessageCommand,
} from "@aws-sdk/client-sqs";
import {
  ListEventBusesCommand,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";
import {
  ListBucketsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import {
  InvokeCommand,
  ListFunctionsCommand,
  CreateFunctionCommand,
} from "@aws-sdk/client-lambda";

export default {
  type: "app",
  app: "aws",
  propDefinitions: {
    region: {
      type: "string",
      label: "AWS Region",
      description: "The AWS region",
      default: common.defaultRegion,
      async options() {
        try {
          const response = await this.ec2ListRegions();
          return response.Regions
            .map((regionInfo) => regionInfo.RegionName)
            .sort();
        } catch (error) {
          // Retrieval of available regions can fail if the registered account
          // does not have enough permissions to call the EC2 `DescribeRegions`
          // API. In that case, we default to the static list of regions.
          console.log(`Could not retrieve available regions from AWS. ${error}, falling back to default regions`);
          return common.awsRegions;
        }
      },
    },
    role: {
      type: "string",
      label: "Role",
      description: "An IAM Role ARN, e.g., arn:aws:iam::650138640062:role/v3-lambda-tutorial-lambda-role. [See docs](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html)",
      async options({ region }) {
        const response = await this.listRoles(region);
        return response.Roles.map((role) => role.Arn);
      },
    },
    bucket: {
      type: "string",
      label: "S3 Bucket Name",
      description: "The S3 Bucket Name",
      async options() {
        const response = await this.s3ListBuckets();
        return response.Buckets.map((bucket) => bucket.Name);
      },
    },
    key: {
      type: "string",
      label: "S3 Filename Key",
      description: "The name of the S3 key with extension you'd like to upload this file to",
    },
    eventBusName: {
      type: "string",
      label: "Event Bus Name",
      description: "The name of the EventBridge event bus",
      async options({ prevContext }) {
        const response = await this.eventBridgeListEventBuses({
          NextToken: prevContext.NextToken,
        });
        return {
          options: response.EventBuses.map((eventBus) => eventBus.Name),
          context: {
            NextToken: response.NextToken,
          },
        };
      },
    },
    queueUrl: {
      type: "string",
      label: "SQS Queue URL",
      description: "The URL of the SQS Queue",
      async options({ prevContext }) {
        const response = await this.sqsListQueues({
          NextToken: prevContext.NextToken,
        });
        return {
          options: response.QueueUrls,
          context: {
            NextToken: response.NextToken,
          },
        };
      },
    },
    topic: {
      type: "string",
      label: "SNS Topic",
      description: "The ARN of the SNS Topic",
      async options({ prevContext }) {
        const response = await this.snsListTopics({
          NextToken: prevContext.NextToken,
        });
        return {
          options: response.Topics.map((topic) => topic.TopicArn),
          context: {
            NextToken: response.NextToken,
          },
        };
      },
    },
    lambdaFunction: {
      type: "string",
      label: "Function Name",
      description: "The name of your Lambda function. Also accepts a function ARN",
      async options({
        region, prevContext,
      }) {
        const response = await this.lambdaListFunctions({
          Region: region,
          Marker: prevContext.NextMarker,
        });
        return {
          options: response.Functions.map((fn) => fn.FunctionName),
          context: {
            NextMarker: response.NextMarker,
          },
        };
      },
    },
    lambdaCode: {
      type: "string",
      label: "Code",
      description: "The function code in Node.js. [See docs](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html)",
      default: dedent`exports.handler = async (event) => {
                        console.log("Received event");
                        const response = {
                            statusCode: 200,
                        };
                        return response;
                      };`,
    },
    eventData: {
      type: "object",
      label: "Event data",
      description: "A JSON object that will be sent as an event",
      optional: true,
    },
    logGroupNames: {
      type: "string[]",
      label: "CloudWatch Log Groups",
      description: "The name of the log group",
      async options({
        region, prevContext,
      }) {
        const {
          logGroups,
          nextToken,
        } = await this.cloudWatchLogsInsightsDescribeLogGroups(region, {
          nextToken: prevContext.nextToken,
        });
        const options = logGroups.map((group) => ({
          label: group.logGroupName,
          value: group.logGroupName,
        }));
        return {
          options,
          context: {
            nextToken,
          },
        };
      },
    },
    logStreamNames: {
      type: "string[]",
      label: "CloudWatch Log Streams",
      description: "The name of the log stream for the chosen log group",
      async options({
        region, logGroupName, prevContext,
      }) {
        const {
          logStreams,
          nextToken,
        } = await this.cloudWatchLogsInsightsDescribeLogStreams(region, {
          logGroupName,
          nextToken: prevContext.nextToken,
        });
        const options = logStreams.map((group) => ({
          label: group.logStreamName,
          value: group.logStreamName,
        }));
        return {
          options,
          context: {
            nextToken,
          },
        };
      },
    },
    tableName: {
      type: "string",
      label: "Table Name",
      description: "The name of the table",
      async options({
        region, prevContext,
      }) {
        const {
          TableNames,
          LastEvaluatedTableName,
        } = await this.dynamodbListTables(region, {
          ExclusiveStartTableName: prevContext.LastEvaluatedTableName,
        });
        return {
          options: TableNames,
          context: {
            LastEvaluatedTableName,
          },
        };
      },
    },
    keyPrimaryAttributeName: {
      type: "string",
      label: "Key Hash Attribute Name",
      description: "The name of the partition key",
    },
    keyPrimaryAttributeType: {
      type: "string",
      label: "Key Hash Attribute Type",
      description: "The data type of the primary key",
      options: constants.dynamodb.keyAttributeTypes,
    },
    keySecondaryAttributeName: {
      type: "string",
      label: "Key Range Attribute Name",
      description: "The name of the sort key",
      optional: true,
    },
    keySecondaryAttributeType: {
      type: "string",
      label: "Key Range Attribute Type",
      description: "The data type of the sort key",
      options: constants.dynamodb.keyAttributeTypes,
      optional: true,
    },
    billingMode: {
      type: "string",
      label: "Billing Mode",
      description: "Controls how you are charged for read and write throughput and how you manage capacity",
      options: Object.keys(constants.dynamodb.billingModes),
    },
    streamSpecificationEnabled: {
      type: "boolean",
      label: "Stream Specification Enabled",
      description: "Indicates whether DynamoDB Streams is to be enabled (true) or disabled (false)",
      optional: true,
    },
    streamSpecificationViewType: {
      type: "string",
      label: "Stream Specification View Type",
      description: toSingleLineString(`
        When an item in the table is modified, StreamViewType determines what information is written to the table's stream.
        [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/createtablecommandinput.html#streamspecification)
      `),
      optional: true,
      options: constants.dynamodb.streamSpecificationViewTypes,
    },
    expressionAttributeNames: {
      type: "object",
      label: "Expression Attribute Names",
      description: toSingleLineString(`
        One or more substitution tokens for attribute names in an expression.
        Example:
        \`
        {
          "#execs": "execs"
        }
        \`
        [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/modules/updateiteminput.html#expressionattributenames)
      `),
      optional: true,
    },
    expressionAttributeValues: {
      type: "object",
      label: "Expression Attribute Values",
      description: toSingleLineString(`
        One or more values that can be substituted in an expression.
        Use the : (colon) character in an expression to dereference an attribute value.
        Example:
        \`
        {
          ":echo": {
              "S": "echo"
            },
          ":oneh": {
            "N": "100"
          }
        }
        \`
        [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/modules/updateiteminput.html#expressionattributevalues)
      `),
      optional: true,
    },
    keyConditionExpression: {
      type: "string",
      label: "Key Condition Expression",
      description: toSingleLineString(`
        The condition that specifies the key values for items to be retrieved by the Query action.
        Example:
        \`
        partitionKeyName = :partitionkeyval AND sortKeyName = :sorteyval
        \`
        [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/querycommandinput.html#keyconditionexpression)
      `),
    },
    projectionExpression: {
      type: "string",
      label: "Projection Expression",
      description: toSingleLineString(`
        A string that identifies one or more attributes to retrieve from the specified table or index.
        If no attribute names are specified, then all attributes will be returned.
        If any of the requested attributes are not found, they will not appear in the result.
      `),
      optional: true,
    },
  },
  methods: {
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
    async getAWSAccountId(region) {
      const { Account } = await this._getSTSClient(region).getCallerIdentity()
        .promise();
      return Account;
    },
    getAWSClient(clientType, region = common.defaultRegion) {
      return new common.awsClients[clientType]({
        credentials: {
          accessKeyId: this.$auth.accessKeyId,
          secretAccessKey: this.$auth.secretAccessKey,
        },
        region,
      });
    },
    async pagination(fn, region, params, nextTokenAttr, lastTokenAttr = null) {
      let response;
      const results = [];
      do {
        response = await fn(region, params);
        results.push(...response.Items);
        params[nextTokenAttr] = lastTokenAttr
          ? response[lastTokenAttr]
          : response[nextTokenAttr];
      } while (params[nextTokenAttr]);
      response.Items = results;
      return response;
    },
    decodeResponsePayload(response) {
      response.Payload = JSON.parse(new TextDecoder("utf-8").decode(response.Payload) || {});
    },
    createZipArchive(data) {
      const zip = new AdmZip();
      zip.addFile("index.js", Buffer.from(data, "utf-8"));
      return zip.toBuffer();
    },
    async streamFile(fileUrl) {
      return axios.get(fileUrl, {
        responseType: "stream",
      });
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
      const client = this.getAWSClient(constants.clients.iam, region);
      const { Role } = await client.send(new CreateRoleCommand(params));
      console.log(Role);
      return {
        roleArn: Role.Arn,
        roleName: Role.RoleName,
      };
    },
    /**
     * This method creates an S3 bucket in the specified region.
     *
     * @param {string} region - The AWS region to which the AWS SDK will
     * connect. This string should be an acceptable value by the AWS SDK, which
     * you can find in the ${@linkcode ./regions.mjs regions.mjs} file.
     * @param {string} bucketName - The name of the S3 bucket you'd like to create
     * @returns {Promise<object>} An object containing the new bucket's Location
     */
    async createS3Bucket(region, bucketName) {
      const params = {
        Bucket: bucketName,
      };
      // S3 throws an error if you specify us-east-1 as the region in
      // the create bucket LocationConstraint. See https://stackoverflow.com/a/51912090
      if (region !== "us-east-1") {
        params.CreateBucketConfiguration = {
          LocationConstraint: region,
        };
      }
      const { Location } = await this
        ._getS3Client(region)
        .createBucket(params)
        .promise();
      console.log(Location);
      return {
        Location,
      };
    },
    /**
     * This method sets an S3 bucket's policy
     *
     * @param {string} region - The AWS region to which the AWS SDK will
     * connect. This string should be an acceptable value by the AWS SDK, which
     * you can find in the ${@linkcode ./regions.mjs regions.mjs} file.
     * @param {string} bucketName - The name of the S3 bucket you'd like to create
     * @param {string} policy - The bucket policy JSON
     * @returns {Promise<object>} An object containing the put bucket policy response
     */
    async putS3BucketPolicy(region, bucketName, policy) {
      const params = {
        Bucket: bucketName,
        Policy: policy,
      };
      const putBucketPolicyResp = await this
        ._getS3Client(region)
        .putBucketPolicy(params)
        .promise();
      console.log(putBucketPolicyResp);
      return putBucketPolicyResp;
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
      const client = this.getAWSClient(constants.clients.iam, region);
      await client.send(new PutRolePolicyCommand(params));
    },
    async _deleteInlinePoliciesForRole(region, roleName) {
      const params = {
        RoleName: roleName,
      };

      const client = this.getAWSClient(constants.clients.iam, region);
      while (true) {
        const { PolicyNames: policyNames = [] } = await client.send(
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
            .map((params) => client.send(new DeleteRolePolicyCommand(params))),
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
      const client = this.getAWSClient(constants.clients.iam, region);
      client.send(new DeleteRoleCommand({
        RoleName: roleName,
      }));
    },
    async listRoles(region) {
      const client = this.getAWSClient(constants.clients.iam, region);
      return client.send(new ListRolesCommand({}));
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
    async cloudWatchLogsInsightsDescribeLogGroups(region, params) {
      const client = this.getAWSClient(constants.clients.cloudWatchLogs, region);
      return client.send(new DescribeLogGroupsCommand(params));
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
    async cloudWatchLogsInsightsDescribeLogStreams(Region, params) {
      const client = this.getAWSClient(constants.clients.cloudWatchLogs, Region);
      return client.send(new DescribeLogStreamsCommand(params));
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
    async cloudWatchLogsPutLogEvents(Region, params) {
      const client = this.getAWSClient(constants.clients.cloudWatchLogs, Region);
      return client.send(new PutLogEventsCommand(params));
    },
    async ec2ListRegions() {
      const client = this.getAWSClient(constants.clients.ec2);
      return client.send(new DescribeRegionsCommand({}));
    },
    async s3ListBuckets() {
      const client = this.getAWSClient(constants.clients.s3);
      return client.send(new ListBucketsCommand({}));
    },
    async s3UploadFile(Region, params) {
      const client = this.getAWSClient(constants.clients.s3, Region);
      return client.send(new PutObjectCommand(params));
    },
    async eventBridgeListEventBuses(params) {
      const client = this.getAWSClient(constants.clients.eventBridge);
      return client.send(new ListEventBusesCommand(params));
    },
    async eventBridgeSendEvent(Region, params) {
      const client = this.getAWSClient(constants.clients.eventBridge, Region);
      return client.send(new PutEventsCommand(params));
    },
    async sqsListQueues(params) {
      const client = this.getAWSClient(constants.clients.sqs);
      return client.send(new ListQueuesCommand(params));
    },
    async sqsSendMessage(Region, params) {
      const client = this.getAWSClient(constants.clients.sqs, Region);
      return client.send(new SendMessageCommand(params));
    },
    async snsListTopics(params) {
      const client = this.getAWSClient(constants.clients.sns);
      return client.send(new ListTopicsCommand(params));
    },
    async snsSendMessage(Region, params) {
      const client = this.getAWSClient(constants.clients.sns, Region);
      return client.send(new PublishCommand(params));
    },
    async lambdaListFunctions(params) {
      const { Region } = params;
      const client = this.getAWSClient(constants.clients.lambda, Region);
      return client.send(new ListFunctionsCommand(params));
    },
    async lambdaCreateFunction(Region, params, code) {
      params.Code = {
        ZipFile: this.createZipArchive(code),
      };
      const client = this.getAWSClient(constants.clients.lambda, Region);
      return client.send(new CreateFunctionCommand(params));
    },
    async lambdaInvokeFunction(Region, params) {
      const client = this.getAWSClient(constants.clients.lambda, Region);
      return client.send(new InvokeCommand(params));
    },
    async dynamodbListTables(Region, params) {
      const client = this.getAWSClient(constants.clients.dynamodb, Region);
      return client.send(new ListTablesCommand(params));
    },
    async dynamodbDescribeTable(Region, params) {
      const client = this.getAWSClient(constants.clients.dynamodb, Region);
      return client.send(new DescribeTableCommand(params));
    },
    async dynamodbCreateTable(Region, params) {
      const client = this.getAWSClient(constants.clients.dynamodb, Region);
      return client.send(new CreateTableCommand(params));
    },
    async dynamodbUpdateTable(Region, params) {
      const client = this.getAWSClient(constants.clients.dynamodb, Region);
      return client.send(new UpdateTableCommand(params));
    },
    async dynamodbExecuteTransaction(Region, params) {
      const client = this.getAWSClient(constants.clients.dynamodb, Region);
      return client.send(new ExecuteStatementCommand(params));
    },
    async dynamodbGetItem(Region, params) {
      const client = this.getAWSClient(constants.clients.dynamodb, Region);
      return client.send(new GetItemCommand(params));
    },
    async dynamodbPutItem(Region, params) {
      const client = this.getAWSClient(constants.clients.dynamodb, Region);
      return client.send(new PutItemCommand(params));
    },
    async dynamodbQuery(Region, params) {
      const client = this.getAWSClient(constants.clients.dynamodb, Region);
      return client.send(new QueryCommand(params));
    },
    async dynamodbScan(Region, params) {
      const client = this.getAWSClient(constants.clients.dynamodb, Region);
      return client.send(new ScanCommand(params));
    },
    async dynamodbUpdateItem(Region, params) {
      const client = this.getAWSClient(constants.clients.dynamodb, Region);
      return client.send(new UpdateItemCommand(params));
    },
  },
};
