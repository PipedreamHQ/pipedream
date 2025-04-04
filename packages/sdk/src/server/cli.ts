import { createBackendClient } from "./index.js";
import { program } from "commander";

const {
  CLIENT_ID, CLIENT_SECRET, PROJECT_ID, API_HOST, ENVIRONMENT,
} = process.env;

if (!CLIENT_ID || !CLIENT_SECRET || !PROJECT_ID) {
  console.error("Error: Missing required environment variables (CLIENT_ID, CLIENT_SECRET, PROJECT_ID).");
  process.exit(1);
}

const client = createBackendClient({
  credentials: {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
  },
  projectId: PROJECT_ID,
  apiHost: API_HOST,
  environment: ENVIRONMENT === "production"
    ? "production"
    : "development",
});

program
  .name("connect-cli")
  .description("CLI for interacting with the Pipedream Connect API")
  .version("1.0.0");

const handleError = (error: unknown, message: string) => {
  if (error instanceof Error) {
    console.error(`${message}:`, error.message);
  } else {
    console.error(`${message}:`, String(error));
  }
};

program
  .command("list-project-info")
  .description("List information about the project, including linked apps.")
  .action(async () => {
    try {
      const projectInfo = await client.getProjectInfo();
      console.log(JSON.stringify(projectInfo, null, 2));
    } catch (error) {
      handleError(error, "Failed to fetch project info");
    }
  });

program
  .command("delete-account <accountId>")
  .description("Delete an account by its ID.")
  .action(async (accountId) => {
    try {
      await client.deleteAccount(accountId);
      console.log(`Account with ID ${accountId} has been deleted.`);
    } catch (error) {
      handleError(error, "Failed to delete account");
    }
  });

program
  .command("delete-accounts-by-app <appId>")
  .description("Delete all accounts associated with a specific app.")
  .action(async (appId) => {
    try {
      await client.deleteAccountsByApp(appId);
      console.log(`All accounts associated with app ID ${appId} have been deleted.`);
    } catch (error) {
      handleError(error, "Failed to delete accounts by app");
    }
  });

program
  .command("delete-external-user <externalId>")
  .description("Delete all accounts associated with a specific external ID.")
  .action(async (externalId) => {
    try {
      await client.deleteExternalUser(externalId);
      console.log(`All accounts associated with external ID ${externalId} have been deleted.`);
    } catch (error) {
      handleError(error, "Failed to delete external user");
    }
  });

program
  .command("create-connect-token <externalUserId>")
  .description("Create a new Pipedream Connect token.")
  .option("--success-redirect-uri <uri>", "URL to redirect the user to upon successful connection")
  .option("--error-redirect-uri <uri>", "URL to redirect the user to upon failed connection")
  .option("--webhook-uri <uri>", "Webhook URI that Pipedream can invoke on success or failure of connection requests")
  .option("--allowed-origins <origins>", "Comma-separated list of allowed origins")
  .action(async (externalUserId, options) => {
    try {
      const tokenResponse = await client.createConnectToken({
        external_user_id: externalUserId,
        success_redirect_uri: options.successRedirectUri,
        error_redirect_uri: options.errorRedirectUri,
        webhook_uri: options.webhookUri,
        allowed_origins: options.allowedOrigins
          ? options.allowedOrigins.split(",")
          : undefined,
      });
      console.log(JSON.stringify(tokenResponse, null, 2));
    } catch (error) {
      handleError(error, "Failed to create connect token");
    }
  });

program
  .command("get-accounts")
  .description("Retrieve the list of accounts associated with the project.")
  .option("--include-credentials <include>", "Include credentials in the response")
  .action(async (options) => {
    try {
      const params = options.includeCredentials
        ? {
          include_credentials: options.includeCredentials,
        }
        : {};
      const accounts = await client.getAccounts(params);
      console.log(JSON.stringify(accounts, null, 2));
    } catch (error) {
      handleError(error, "Failed to fetch accounts");
    }
  });

program
  .command("get-account-by-id <accountId>")
  .description("Retrieve a specific account by ID.")
  .action(async (accountId) => {
    try {
      const account = await client.getAccountById(accountId);
      console.log(JSON.stringify(account, null, 2));
    } catch (error) {
      handleError(error, "Failed to fetch account by ID");
    }
  });

program
  .command("list-apps")
  .description("Retrieve the list of apps.")
  .option("--query <query>", "Query string to filter apps")
  .action(async (options) => {
    try {
      const apps = await client.apps({
        q: options.query,
      });
      console.log(JSON.stringify(apps, null, 2));
    } catch (error) {
      handleError(error, "Failed to fetch apps");
    }
  });

program
  .command("get-app <idOrNameSlug>")
  .description("Retrieve a specific app by ID or name slug.")
  .action(async (idOrNameSlug) => {
    try {
      const app = await client.app(idOrNameSlug);
      console.log(JSON.stringify(app, null, 2));
    } catch (error) {
      handleError(error, "Failed to fetch app");
    }
  });

program
  .command("list-components")
  .description("Retrieve the list of components.")
  .option("--app <app>", "Filter components by app")
  .option("--query <query>", "Query string to filter components")
  .option("--component-type <type>", "Filter components by type (trigger or action)")
  .action(async (options) => {
    try {
      const components = await client.components({
        app: options.app,
        q: options.query,
        componentType: options.componentType,
      });
      console.log(JSON.stringify(components, null, 2));
    } catch (error) {
      handleError(error, "Failed to fetch components");
    }
  });

program
  .command("get-component <key>")
  .description("Retrieve a specific component by key.")
  .action(async (key) => {
    try {
      const component = await client.component({
        key,
      });
      console.log(JSON.stringify(component, null, 2));
    } catch (error) {
      handleError(error, "Failed to fetch component");
    }
  });

program
  .command("configure-component")
  .description("Configure a component.")
  .requiredOption("--user-id <userId>", "User ID")
  .requiredOption("--component-id <componentId>", "Component ID")
  .requiredOption("--prop-name <propName>", "Property name")
  .requiredOption("--configured-props <props>", "Configured properties as JSON string")
  .option("--dynamic-props-id <id>", "Dynamic properties ID")
  .action(async (options) => {
    try {
      const configuredProps = JSON.parse(options.configuredProps);
      const response = await client.componentConfigure({
        userId: options.userId,
        componentId: options.componentId,
        propName: options.propName,
        configuredProps,
        dynamicPropsId: options.dynamicPropsId,
      });
      console.log(JSON.stringify(response, null, 2));
    } catch (error) {
      handleError(error, "Failed to configure component");
    }
  });

program
  .command("reload-component-props")
  .description("Reload component properties.")
  .requiredOption("--user-id <userId>", "User ID")
  .requiredOption("--component-id <componentId>", "Component ID")
  .requiredOption("--configured-props <props>", "Configured properties as JSON string")
  .option("--dynamic-props-id <id>", "Dynamic properties ID")
  .action(async (options) => {
    try {
      const configuredProps = JSON.parse(options.configuredProps);
      const response = await client.componentReloadProps({
        userId: options.userId,
        componentId: options.componentId,
        configuredProps,
        dynamicPropsId: options.dynamicPropsId,
      });
      console.log(JSON.stringify(response, null, 2));
    } catch (error) {
      handleError(error, "Failed to reload component properties");
    }
  });

program
  .command("run-action")
  .description("Run an action.")
  .requiredOption("--user-id <userId>", "User ID")
  .requiredOption("--action-id <actionId>", "Action ID")
  .requiredOption("--configured-props <props>", "Configured properties as JSON string")
  .option("--dynamic-props-id <id>", "Dynamic properties ID")
  .action(async (options) => {
    try {
      const configuredProps = JSON.parse(options.configuredProps);
      const response = await client.actionRun({
        userId: options.userId,
        actionId: options.actionId,
        configuredProps,
        dynamicPropsId: options.dynamicPropsId,
      });
      console.log(JSON.stringify(response, null, 2));
    } catch (error) {
      handleError(error, "Failed to run action");
    }
  });

// Parse and execute commands
program.parse(process.argv);
