#!/usr/bin/env node

import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import { diff } from "json-diff";
import { json2csv } from "json-2-csv";

const GREEN_CHECK = "\x1b[32m✔\x1b[0m";
const RED_CROSS = "\x1b[31m✖\x1b[0m";

let totalEvals = 0;
let totalSuccesses = 0;
let apiResults = []

const apiHost = process.env.API_BASE_URL || "https://api.pipedream.com";

// json-diff shows the diff as __old and __new keys, which isn't descriptive,
// so we replace them with custom labels
function customDiff(original, updated, oldLabel = "expected", newLabel = "actual") {
  const result = diff(original, updated);

  function replaceLabels(obj) {
    if (Array.isArray(obj)) {
      return obj.map(replaceLabels);
    } else if (typeof obj !== "object" || obj === null) {
      return obj;
    }

    const newObj = {};
    for (const key in obj) {
      if (key === "__old") {
        newObj[oldLabel] = replaceLabels(obj[key]);
      } else if (key === "__new") {
        newObj[newLabel] = replaceLabels(obj[key]);
      } else {
        newObj[key] = replaceLabels(obj[key]);
      }
    }
    return newObj;
  }

  return replaceLabels(result);
}

async function exportToCsv(filePath, limit, threshold) {
  const csvData = json2csv(apiResults, {
    fields: ["query", "evalTriggers", "apiTriggers", "evalActions", "apiActions", "success"]
  });
  const parts = filePath.split("/")
  const path = parts[parts.length -1].split(".json")[0]
  await fs.writeFile(`./csv/${path}-${limit}-${threshold}.csv`, csvData);
}

function arrayToString(items) {
  if (items) return items.join(",")
  return ""
}

async function processEvalFile(filePath) {
  const limit = 3
  const threshold = 0.65
  try {
    const content = await fs.readFile(filePath, "utf-8");
    const evalData = JSON.parse(content);

    for (const evalTest of evalData.evaluationTests) {
      totalEvals++;
      const {
        query, triggers, actions,
      } = evalTest;

      const encodedQuery = encodeURIComponent(query);
      const apiUrl = `${apiHost}/v1/components/search?query=${encodedQuery}&similarity_threshold=${threshold}&limit=${limit}`;

      const response = await fetch(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.PIPEDREAM_API_KEY}`,
        },
      });
      const apiData = await response.json();


      // Compare actual and expected
      const apiTriggers = apiData?.triggers ?? [];
      const apiActions = apiData?.actions ?? [];

      const triggersMatch =
        JSON.stringify(apiTriggers.sort()) === JSON.stringify(triggers.sort());
      const actionsMatch =
        JSON.stringify(apiActions.sort()) === JSON.stringify(actions.sort());

      let success = false
      if (triggersMatch && actionsMatch) {
        totalSuccesses++;
        success = true
        console.log(`${GREEN_CHECK} Success for query: "${query}"`);
      } else {
        console.log(`${RED_CROSS} Failure for query: "${query}"`);
        console.log("Differences:");
        console.log(customDiff({
          triggers,
          actions,
        }, apiData));
      }

      const record = {
        query: query.replace("\"", ""),
        apiTriggers: arrayToString(apiTriggers),
        apiActions: arrayToString(apiActions),
        evalTriggers: arrayToString(triggers),
        evalActions: arrayToString(actions),
        success: success
      };
      apiResults.push(record)
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
  }
  await exportToCsv(filePath, limit, threshold)
}

async function main() {
  const evalFiles = process.argv.slice(2);

  if (evalFiles.length === 0) {
    console.error("Please provide at least one eval JSON file.");
    process.exit(1);
  }

  for (const file of evalFiles) {
    const filePath = path.resolve(file);
    await processEvalFile(filePath);
  }

  const successRate = ((totalSuccesses / totalEvals) * 100).toFixed(2);
  console.log(`\nTotal Evals: ${totalEvals}`);
  console.log(`Total Successes: ${totalSuccesses}`);
  console.log(`Success Rate: ${successRate}%`);
}

main();
