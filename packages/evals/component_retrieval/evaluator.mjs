#!/usr/bin/env node

import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import { diff } from "json-diff";
import { json2csv } from "json-2-csv";
import { program } from "commander";

const GREEN_CHECK = "\x1b[32m✔\x1b[0m";
const RED_CROSS = "\x1b[31m✖\x1b[0m";

let totalPrecision = 0;
let totalRecall = 0;
let totalF1Score = 0;
let totalEvals = 0;
let totalSuccesses = 0;
let apiResults = [];

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
    fields: [
      "query",
      "evalTriggers",
      "apiTriggers",
      "evalActions",
      "apiActions",
      "precision",
      "recall",
      "f1Score",
    ],
  });
  const parts = filePath.split("/");
  const path = parts[parts.length - 1].split(".json")[0];
  try {
    await fs.access("./csv");
  } catch (error) {
    await fs.mkdir("./csv");
  }
  await fs.writeFile(`./csv/${path}-${limit}-${threshold}.csv`, csvData);
}

function arrayToString(items) {
  if (items) return items.join(",");
  return "";
}

async function processEvalFile(filePath, options) {
  const limit = 2;
  const threshold = 0.7;
  const content = await fs.readFile(filePath, "utf-8");
  const evalData = JSON.parse(content);

  for (const evalTest of evalData.evaluationTests) {
    totalEvals++;
    const {
      query, sources, actions,
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
    if (options.debug) {
      console.log(`\nQuery: "${query}"`);
      console.log(JSON.stringify(apiData, null, 2));
    }

    // Calculate precision, recall, and F1 score
    const expectedItems = [
      ...(sources || []),
      ...(actions || []),
    ];
    const retrievedTriggers = apiData?.sources ?? [];
    const retrievedActions = apiData?.actions ?? [];
    const retrievedItems = [
      ...retrievedTriggers,
      ...retrievedActions,
    ];

    const correctlyRetrievedItems = retrievedItems.filter((item) => expectedItems.includes(item));
    const numCorrectlyRetrieved = correctlyRetrievedItems.length;
    const numRetrieved = retrievedItems.length;
    const numExpected = expectedItems.length;

    let precision, recall, f1Score;

    if (numExpected === 0 && numRetrieved === 0) {
      // This case is expected — our test has no expected items, and the API returned no items
      precision = 1;
      recall = 1;
      f1Score = 1;
    } else {
      // Standard calculations
      precision = numRetrieved > 0
        ? numCorrectlyRetrieved / numRetrieved
        : 0;
      recall = numExpected > 0
        ? numCorrectlyRetrieved / numExpected
        : 0;
      f1Score = (precision + recall) > 0
        ? (2 * precision * recall) / (precision + recall)
        : 0;
    }

    // Accumulate totals for averaging later
    totalPrecision += precision;
    totalRecall += recall;
    totalF1Score += f1Score;

    console.log(`Precision: ${precision.toFixed(2)}`);
    console.log(`Recall: ${recall.toFixed(2)}`);
    console.log(`F1 Score: ${f1Score.toFixed(2)}`);

    // Compare actual and expected data for debugging
    const apiTriggers = apiData?.sources ?? [];
    const apiActions = apiData?.actions ?? [];

    const sourcesMatch =
        JSON.stringify(apiTriggers.sort()) === JSON.stringify(sources.sort());
    const actionsMatch =
        JSON.stringify(apiActions.sort()) === JSON.stringify(actions.sort());

    let success = false;
    if (sourcesMatch && actionsMatch) {
      totalSuccesses++;
      success = true;
      console.log(`${GREEN_CHECK} Success for query: "${query}"`);
    } else {
      console.log(`${RED_CROSS} Failure for query: "${query}"`);
      if (options.debug) {
        console.log("Differences:");
        console.log(customDiff({
          sources,
          actions,
        }, apiData));
      }
    }

    const record = {
      query: query.replace("\"", ""),
      apiTriggers: arrayToString(apiTriggers),
      apiActions: arrayToString(apiActions),
      evalTriggers: arrayToString(sources),
      evalActions: arrayToString(actions),
      success: success,
    };
    apiResults.push(record);
  }
  await exportToCsv(filePath, limit, threshold);
}

async function main() {
  program
    .version("1.0.0")
    .usage("[options] <evalFiles...>")
    .option("-d, --debug", "output extra debugging")
    .parse(process.argv);

  const options = program.opts();
  const evalFiles = program.args;

  if (evalFiles.length === 0) {
    console.error("Please provide at least one eval JSON file.");
    process.exit(1);
  }

  if (evalFiles.length === 0) {
    console.error("Please provide at least one eval JSON file.");
    process.exit(1);
  }

  for (const file of evalFiles) {
    const filePath = path.resolve(file);
    await processEvalFile(filePath, options);
  }

  const successRate = ((totalSuccesses / totalEvals) * 100).toFixed(2);
  console.log(`\nTotal Evals: ${totalEvals}`);
  console.log(`Perfect Matches: ${totalSuccesses}`);
  console.log(`Perfect Match Rate: ${successRate}%`);

  const averagePrecision = totalPrecision / totalEvals;
  const averageRecall = totalRecall / totalEvals;
  const averageF1Score = totalF1Score / totalEvals;

  // Convert average F1 Score to success percentage
  const successPercentage = (averageF1Score * 100).toFixed(2);

  console.log(`\nAverage Precision: ${averagePrecision.toFixed(2)}`);
  console.log(`Average Recall: ${averageRecall.toFixed(2)}`);
  console.log(`Average F1 Score: ${averageF1Score.toFixed(2)}`);
  console.log(`\nOverall Success Percentage: ${successPercentage}%`);
}

main();
