const fs = require('fs');
const csv = require('csv-parser');

// Initialize an empty array to hold the JSON objects
const jsonObjects = [];

// Read the CSV file and parse each row into a JSON object
fs.createReadStream('data/app_test_requests.csv')
  .pipe(csv())
  .on('data', (row) => {
    const prompt = `Generate a Pipedream component that makes a request against the ${row["test_url"]} endpoint of the ${row["app_name"]} API\n\n###\n\n`
    let completion = ` ${row["pipedream_component_code"]}\n\n###\n\n`

    // Check if the prompt string is greater than 2048 characters
    if (prompt.length > 2048) {
      return;
    }
    
    // Check if the sum of the prompt and completion strings exceeds 2048 characters
    if (prompt.length + completion.length > 2048) {
      // Truncate the completion string to ensure the sum is no more than 2048 characters
      completion = `${completion.slice(0, 2040 - prompt.length)}\n\n###\n\n`;
    }

    const jsonObject = {
      prompt,
      completion,
    };
    
    // Add the JSON object to the list
    jsonObjects.push(jsonObject);
  })
  .on('end', () => {
    // Write the JSON objects to a file, with newlines delimiting each record
    fs.writeFileSync('test_request_prompts.jsonl', jsonObjects.map(obj => JSON.stringify(obj)).join('\n'));
  });
