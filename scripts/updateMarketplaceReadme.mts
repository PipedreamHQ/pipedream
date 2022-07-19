import * as path from "node:path";
import * as fs from "fs";
import { GraphQLClient, gql } from "graphql-request";

const pdClient = new GraphQLClient(
  "https://api.pipedream.com/graphql",
  {
    headers: {
      Authorization: `Bearer ${process.env.PD_API_KEY}`,
    },
  }
);

const run = async () => {
  // This script expects the first argument to be a comma seperated list of file paths.
  // Example: `components/slack/README.md,components/slack/actions/add-star/README.md`
  const fileCsv = process.argv[2];

  const filePaths = fileCsv.split(",");

  //   filePaths.forEach((p) => console.log(p));

  const readmePaths = filePaths.filter(
    (p) => p.startsWith("components/") && p.endsWith("/README.md")
  );

  for (const readmePath of readmePaths) {
    console.log("cwd", process.cwd());
    console.log("readmePath", readmePath);

    const p = path.join(process.cwd(), readmePath);

    console.log("processing file", p);
    const b64 = fs.readFileSync(p).toString("base64");

    const pathSegments = readmePath.split("/");

    let key: string;

    if (pathSegments.length === 3) {
      key = pathSegments[1];
    } else if (pathSegments.length === 5) {
      key = pathSegments[1] + "-" + pathSegments[3];
    } else {
      // TODO handle invalid file path
      console.warn(
        `"${readmePath}" is an invalid path. Cannot determine if this is an app or a component.`
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
      path: readmePath
    }

    const data = await pdClient.request(query, variables)

    console.log(JSON.stringify(data, null, 2))
  }
};

run();
