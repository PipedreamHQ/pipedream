import * as path from "node:path";
import * as fs from "node:fs";
import { GraphQLClient, gql } from "graphql-request";
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.CI ? "production" : "development",
});

const pdClient = new GraphQLClient(
  "https://api.pipedream.com/graphql",
  {
    headers: {
      Authorization: `Bearer ${process.env.PD_API_KEY}`,
    },
  }
);

// This script expects the first argument to be a comma separated list of file paths.
// Example: `ts-node scripts/updateMarketplaceReadme.mts components/slack/README.md,components/slack/actions/add-star/README.md`
const run = async () => {
  const fileCsv = process.argv[2] || "";

  const filePaths = fileCsv.split(",").filter(Boolean);

  const readmePaths = filePaths.filter(
    (p) => p.startsWith("components/") && p.endsWith("/README.md")
  );

  for (const readmePath of readmePaths) {
    const fullReadmePath = path.join(process.cwd(), readmePath);

    console.log("processing file", fullReadmePath);

    const b64 = fs.readFileSync(fullReadmePath).toString("base64");

    const pathSegments = readmePath.split("/");

    let key: string;

    if (pathSegments.length === 3) {
      key = pathSegments[1];
    } else if (pathSegments.length === 5) {
      key = pathSegments[1] + "-" + pathSegments[3];
    } else {
      Sentry.captureMessage(
        "Unable to determine app/component key from file path.",
        {
          level: "error",
          extra: {
            readmePath,
            fullReadmePath,
          },
        }
      );
      console.warn(
        `"${readmePath}" is an invalid path. Cannot determine if this is an app or a component. Skipping...`
      );
      continue;
    }

    const query = gql`
      mutation addNewMarketplaceEntry(
        $markdownB64: String!
        $path: String!
        $key: String!
      ) {
        marketplaceContentSet(
          key: $key
          markdownB64: $markdownB64
          path: $path
        ) {
          marketplaceContent {
            id
          }
          errors
        }
      }
    `;

    const variables = {
      key,
      markdownB64: b64,
      path: readmePath,
    };

    try {
      const response = await pdClient.request(query, variables);

      if (response?.marketplaceContentSet?.errors?.length > 0) {
        Sentry.captureMessage("Set marketplace content error", {
          level: "error",
          extra: {
            errors: response.marketplaceContentSet.errors,
            key,
            fullReadmePath,
            readmePath,
          },
        });
      }

      console.log(JSON.stringify(response, null, 2));
    } catch (e) {
      Sentry.captureException(e, {
        extra: {
          key,
          fullReadmePath,
          readmePath,
        },
      });
    }
  }
};

run();
