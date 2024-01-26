# Update to the Node.js runtime on Pipedream (February 2024)

Effective 2024-02-01, the Node.js runtime will no longer load Amazon-specific certificate authority (CA) certificates by default.

[[toc]]

### Will this impact my workflows?

**Existing workflows that are not re-deployed will NOT be impacted.**

Only workflow that meet all of following criteria will be impacted:

- Is re-deployed or deployed after 2024-02-01
- Connects to an [AWS RDS](https://aws.amazon.com/rds/)-managed database (e.g., PostgreSQL, MySQL, or Microsoft SQL Server)
- Has server identity verification enabled (e.g., the `rejectUnauthorized` connection option is set to `true`)

::: tip
Workflows deployed on or after 2024-02-01 that do *not* integrate with AWS RDS will not be impacted.
:::

### Why are Amazon-specific CA certificates no longer loaded by default?

Pipedream's runtime, which is based on the [Amazon Web Services](https://aws.amazon.com/) (AWS) Lambda Node.js runtime, is being upgraded to support Node.js 20. Starting with Node.js 20, Lambda no longer loads and validates Amazon-specific CA certificates by default. This improves cold start performance.

For more information, see [Amazon's blog post](https://aws.amazon.com/blogs/compute/node-js-20-x-runtime-now-available-in-aws-lambda/).

### How will this impact my workflows?

Starting 2024-02-01, relevant database connection attempts will return a message like this:

![Missing CA Certificate](https://res.cloudinary.com/pipedreamin/image/upload/v1705428110/self-signed-cert-in-cert-chain-error_fkvph0.png)

### What do I need to do?

If you are not planning to update and re-deploy a workflow [impacted by this update](#will-this-impact-my-workflows), you do not need to do anything.

Otherwise, to successfully connect to your database, you can disable server identity verification or include CA certificates for your database.

For more information on secure connections and CAs, see the AWS docs: [Using SSL/TLS to encrypt a connection to a DB instance](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html)

Below are instructions for updating a workflow that connects to a [**MySQL**](#mysql), [**PostgreSQL**](#postgresql), or [**Microsoft SQL Server**](#microsoft-sql-server) DB instance.

#### MySQL

**Using a Pipedream action**:

- Option A: Disable server identity verification
  1. If given the option, update the action to the latest version by clicking the "Update" button in the workflow step. The lastest version of MySQL actions disable server identity verification by default.

      ![Update Action Button](https://res.cloudinary.com/pipedreamin/image/upload/v1705519878/update-action-button-mysql_fr549p.png)

- Option B: Use the [MySQL (SSL)](https://pipedream.com/apps/mysql-ssl) app
  1. Replace your MySQL action with the corresponding MySQL (SSL) action.
  2. [Connect](/connected-accounts/#connecting-accounts) your MySQL (SSL) account, specifying the `key`, `cert`, `ca`, and `rejectUnauthorized` connection options.

**Using a custom code step**:

- Option A: Disable server identity verification
  1. Set the `rejectUnauthorized` connection option to `false`. For example:

      ```javascript
      const connection = await mysql.createConnection({
        host,
        user,
        password,
        database,
        ssl: {
          rejectUnauthorized: false,
        }
      });
      ```

- Option B: Use the [MySQL (SSL)](https://pipedream.com/apps/mysql-ssl) app
  1. Replace the `mysql` app prop with a `mysql_ssl` app prop.
  2. Use the SSL connection options contained in the `$auth` object.

      Here's an example of an updated code step that uses the **`mysql_ssl`** app and the [`mysql2` npm package](https://www.npmjs.com/package/mysql2):

      ```javascript
      import mysql from 'mysql2/promise';
      export default defineComponent({
        props: {
          mysql: {
            type: "app",
            app: "mysql_ssl",
          }
        },
        async run({steps, $}) {
          const { host, port, username, password, database, ca, cert, key, rejectUnauthorized } = this.mysql.$auth;
          const connection = await mysql.createConnection({
            host,
            port,
            user: username,
            password,
            database,
            ssl: {
              rejectUnauthorized,
              ca,
              cert,
              key,
            }
          });
          const [rows] = await connection.execute('SELECT NOW()');
          return rows;
        },
      })
      ```

#### PostgreSQL

**Using a Pipedream action**:

1. If given the option, update the action to the latest version by clicking the "Update" button in the workflow step.

    ![Update Action Button](https://res.cloudinary.com/pipedreamin/image/upload/v1705519996/update-action-button-postgresql_aadmqm.png)

2. Set the **Reject Unauthorized** field to `false`.

    ![Reject Unauthorized Field](https://res.cloudinary.com/pipedreamin/image/upload/v1705520053/postgresql-reject-unauthorized-field_ualjtm.png)

**Using a custom code step**:

- Option A: Disable server identity verification
  1. Set the `rejectUnauthorized` connection option to `false`. For example:

      ```javascript
      const client = new Client({
        host,
        database,
        user,
        password,
        ssl: {
          rejectUnauthorized: false,
        },
      });
      ```

- Option B: Include all Amazon CA certificates
  1. Read the certificate file with all Amazon CA certificates located at `/var/runtime/ca-cert.pem`.
  2. Include the CA certificates in the database connection options.

      Here's an example code step that uses the [`pg` npm package](https://www.npmjs.com/package/pg):

      ```javascript
      import { Client } from "pg";
      import fs from "fs";
      export default defineComponent({
        props: {
          postgresql: {
            type: "app",
            app: "postgresql",
          }
        },
        async run({steps, $}) {
          const { host, user, password, port, database } = this.postgresql.$auth;
          const client = new Client({
            host,
            database,
            user,
            password,
            port,
            ssl: {
              rejectUnauthorized: true,
              ca: fs.readFileSync("/var/runtime/ca-cert.pem")
            },
          });
          await client.connect();
          const results = (await client.query("SELECT NOW()")).rows;
          $.export("results", results);
          await client.end();
        },
      });
      ```

- Option C: Include your region's certificate bundle
  1. Download the [certificate bundle for your AWS region](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html#UsingWithRDS.SSL.RegionCertificates).
  2. Import the certificate bundle into your workflow as an [attachment](/workflows/settings/#attachments).
  3. Include the CA certificates in the database connection options.

      Here's an example code step that uses the `pg` npm package:

      ```javascript
      import { Client } from "pg";
      import fs from "fs";
      export default defineComponent({
        props: {
          postgresql: {
            type: "app",
            app: "postgresql",
          }
        },
        async run({steps, $}) {
          const { host, user, password, port, database } = this.postgresql.$auth;
          const client = new Client({
            host,
            database,
            user,
            password,
            port,
            ssl: {
              rejectUnauthorized: true,
              ca: fs.readFileSync(steps.trigger.context.attachments["<aws-region>-bundle.pem"]).toString(),
            },
          });
          await client.connect();
          const results = (await client.query("SELECT NOW()")).rows;
          $.export("results", results);
          await client.end();
        },
      });
      ```
  
#### Microsoft SQL Server

**Using a Pipedream action**:

1. [Reconnect](/connected-accounts/#reconnecting-an-account) your Microsoft SQL Server account, setting the **trustServerCertificate** field to `true`.

**Using a custom code step**:

- Option A: Disable server identity verification
  1. Set the `trustServerCertificate` connection option to `true`. For example:

      ```javascript
      const config = {
        server,
        database,
        user,
        password,
        options: {
          trustServerCertificate: true,
        },
      };
      ```

- Option B: Include all Amazon CA certificates
  1. Read the certificate file with all Amazon certificates located at `/var/runtime/ca-cert.pem`.
  2. Include the certificates in the database connection options.

      Here's an example code step that uses the [`mssql` npm package](https://www.npmjs.com/package/mssql):

      ```javascript
      import sql from "mssql";
      import fs from "fs";
      export default defineComponent({
        props: {
          microsoft_sql_server: {
            type: "app",
            app: "microsoft_sql_server",
          }
        },
        async run({steps, $}) {
          const { host, username, password, port, database, encrypt, trustServerCertificate } = this.microsoft_sql_server.$auth;
          const config = {
            server: host,
            port: parseInt(port, 10),
            database,
            user: username,
            password,
            options: {
              encrypt,
              trustServerCertificate,
              cryptoCredentialsDetails: {
                ca: fs.readFileSync("/var/runtime/ca-cert.pem").toString(),
              },
            },
          };
          await sql.connect(config);
          return await sql.query`SELECT GETDATE()`;
        },
      });
      ```

- Option C: Include your region's certificate bundle
  1. Download the [certificate bundle for your AWS region](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html#UsingWithRDS.SSL.RegionCertificates).
  2. Import the certificate bundle into your workflow as an [attachment](/workflows/settings/#attachments).
  3. Include the certificates in the database connection options.

  Here's an example code step that uses the `mssql` npm package:

  ```javascript
  import sql from "mssql";
  import fs from "fs";
  export default defineComponent({
    props: {
      microsoft_sql_server: {
        type: "app",
        app: "microsoft_sql_server",
      }
    },
    async run({steps, $}) {
      const { host, username, password, port, database, encrypt, trustServerCertificate } = this.microsoft_sql_server.$auth;
      const config = {
        server: host,
        port: parseInt(port, 10),
        database,
        user: username,
        password,
        options: {
          encrypt,
          trustServerCertificate,
          cryptoCredentialsDetails: {
            ca: fs.readFileSync(steps.trigger.context.attachments["<aws-region>-bundle.pem"]).toString(),
          },
        },
      };
      await sql.connect(config);
      return await sql.query`SELECT GETDATE()`;
    },
  })
  ```
