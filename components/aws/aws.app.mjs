import {
  EC2Client,
  DescribeRegionsCommand,
} from "@aws-sdk/client-ec2";
import {
  S3Client,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import {
  RedshiftServerlessClient,
  ListWorkgroupsCommand,
} from "@aws-sdk/client-redshift-serverless";
import {
  RedshiftDataClient,
  ExecuteStatementCommand,
  DescribeStatementCommand,
  GetStatementResultCommand,
  ListDatabasesCommand,
  ListSchemasCommand,
  ListTablesCommand,
  DescribeTableCommand,
} from "@aws-sdk/client-redshift-data";
import {
  regions,
  defaultRegion,
} from "./common/regions.mjs";

export default {
  type: "app",
  app: "aws",
  propDefinitions: {
    region: {
      type: "string",
      label: "AWS Region",
      description: "The AWS region",
      default: defaultRegion,
      async options() {
        try {
          const { Regions } = await this.ec2ListRegions();
          return Regions.map((regionInfo) => regionInfo.RegionName).sort();
        } catch (error) {
          // Retrieval of available regions can fail if the registered account
          // does not have enough permissions to call the EC2 `DescribeRegions`
          // API. In that case, we default to the static list of regions.
          console.log(`Could not retrieve available regions from AWS. ${error}, falling back to default regions`);
          return regions;
        }
      },
    },
    workgroupName: {
      type: "string",
      label: "Workgroup Name",
      description: "The name of the serverless workgroup. Required if Cluster Identifier is not provided.",
      async options({ region }) {
        const { workgroups } = await this.listWorkgroups(region);
        return workgroups.map((workgroup) => workgroup.workgroupName);
      },
    },
    database: {
      type: "string",
      label: "Database Name",
      description: "The name of the database to connect to.",
      async options({
        region,
        database = "dev",
        workgroupName,
      }) {
        if (!workgroupName) {
          return [];
        }
        const { Databases: databases } = await this.listDatabases({
          region,
          WorkgroupName: workgroupName,
          Database: database,
        });
        return databases;
      },
    },
    schema: {
      type: "string",
      label: "Schema",
      description: "The schema to perform the action on.",
      async options({
        region,
        database = "dev",
        workgroupName,
      }) {
        if (!workgroupName) {
          return [];
        }
        const { Schemas: schemas } = await this.listSchemas({
          region,
          Database: database,
          WorkgroupName: workgroupName,
        });
        return schemas;
      },
    },
    table: {
      type: "string",
      label: "Table",
      description: "The table to perform the action on.",
      async options({
        region,
        workgroupName,
        database = "dev",
        schema,
      }) {
        if (!workgroupName) {
          return [];
        }

        const { Tables: tables } = await this.listTables({
          region,
          Database: database,
          WorkgroupName: workgroupName,
        });
        return tables
          .filter((table) => table.type === "TABLE" && table.schema === schema)
          .map(({ name }) => name);
      },
    },
    uniqueColumn: {
      type: "string",
      label: "Unique Column",
      description: "A unique, auto-incrementing column used to identify new rows.",
      async options({
        region,
        workgroupName,
        database,
        schema,
        table,
        filter = () => true,
      }) {
        if (!table) {
          return [];
        }
        const { ColumnList: columns } = await this.describeTable({
          region,
          workgroupName,
          database,
          schema,
          table,
        });
        return columns
          .filter(filter)
          .map((column) => column.name);
      },
    },
    eventData: {
      type: "object",
      label: "Event data",
      description: "A JSON object that will be sent as an event",
      optional: true,
    },
    objectKey: {
      type: "string",
      label: "Key",
      description: "The key of the object to download.",
      async options({
        region, bucket,
      }) {
        if (!bucket) {
          return [];
        }
        const { Contents: resources } = await this.listObjects({
          region,
          params: {
            Bucket: bucket,
          },
        });
        return resources
          .filter(({ Key: key }) => !key.endsWith("/"))
          .map(({ Key: key }) => key);
      },
    },
    sqlParameters: {
      type: "object",
      label: "Parameters For WHERE Clause",
      description: "An object with parameters to use in the WHERE clause. e.g. `{ \"id\": 1 }`",
      optional: true,
    },
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "info",
      content: "Get started with Amazon Redshift Serverless data warehouses by [reading the documentation here](https://docs.aws.amazon.com/redshift/latest/gsg/new-user-serverless.html).",
    },
  },
  methods: {
    getAWSClient(clientType, region = defaultRegion) {
      return new clientType({
        credentials: {
          accessKeyId: this.$auth.accessKeyId,
          secretAccessKey: this.$auth.secretAccessKey,
        },
        region,
      });
    },
    async ec2ListRegions() {
      const client = this.getAWSClient(EC2Client);
      return client.send(new DescribeRegionsCommand({}));
    },
    listObjects({
      params, region,
    }) {
      const client = this.getAWSClient(S3Client, region);
      return client.send(new ListObjectsV2Command(params));
    },
    async pagination(fn, params, nextTokenAttr, lastTokenAttr = null) {
      let response;
      const results = [];
      do {
        response = await fn(params);
        results.push(...response.Items);
        params[nextTokenAttr] = lastTokenAttr
          ? response[lastTokenAttr]
          : response[nextTokenAttr];
      } while (params[nextTokenAttr]);
      response.Items = results;
      return response;
    },
    listWorkgroups(region) {
      const client = this.getAWSClient(RedshiftServerlessClient, region);
      const command = new ListWorkgroupsCommand({});
      return client.send(command);
    },
    listDatabases({
      region, ...args
    } = {}) {
      const client = this.getAWSClient(RedshiftDataClient, region);
      const command = new ListDatabasesCommand(args);
      return client.send(command);
    },
    listSchemas({
      region, ...args
    } = {}) {
      const client = this.getAWSClient(RedshiftDataClient, region);
      const command = new ListSchemasCommand(args);
      return client.send(command);
    },
    listTables({
      region, ...args
    } = {}) {
      const client = this.getAWSClient(RedshiftDataClient, region);
      const command = new ListTablesCommand(args);
      return client.send(command);
    },
    async describeTable({
      region, workgroupName, database, schema, table,
    } = {}) {
      const client = this.getAWSClient(RedshiftDataClient, region);
      const command = new DescribeTableCommand({
        WorkgroupName: workgroupName,
        Database: database,
        Schema: schema,
        Table: table,
      });
      return client.send(command);
    },
    async executeStatement({
      region, workgroupName, database, sql, parameters,
    } = {}) {
      const client = this.getAWSClient(RedshiftDataClient, region);

      const executeStatementResponse = await client.send(
        new ExecuteStatementCommand({
          WorkgroupName: workgroupName,
          Database: database,
          Sql: sql,
          Parameters: parameters,
        }),
      );

      let describeStatementResponse;

      do {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        describeStatementResponse = await client.send(
          new DescribeStatementCommand({
            Id: executeStatementResponse.Id,
          }),
        );

        if (
          describeStatementResponse.Status === "FAILED"
          || describeStatementResponse.Status === "ABORTED"
        ) {
          throw new Error(`Query failed: ${describeStatementResponse.Error}`);
        }
      } while (
        describeStatementResponse.Status === "STARTED"
        || describeStatementResponse.Status === "PICKED"
        || describeStatementResponse.Status === "SUBMITTED"
      );

      if (!describeStatementResponse.HasResultSet) {
        return describeStatementResponse;
      }

      if (describeStatementResponse.Status === "FINISHED") {
        const getStatementResultResponse = await client.send(
          new GetStatementResultCommand({
            Id: executeStatementResponse.Id,
          }),
        );

        return getStatementResultResponse;
      }
    },
  },
};
