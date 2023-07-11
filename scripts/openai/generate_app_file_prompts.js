const fs = require('fs');
const path = require('path');

// Read the input file
const appFile = fs.readFileSync(process.argv[2], 'utf8');

// Extract the app name from the file path
const appName = path.basename(process.argv[2]).split('.')[0];

const propDefPrompt = `Generate the propDefinitions section of a Pipedream app file for ${appName}. Props correspond to API parameters, and are reusable across components. You should generate a prop for every parameter used across every ${appName} API operation\n\n###\n\n`
let propDefAppFile = ` ${appFile.replace(/"?methods"?:(\n|\s)*{[\s\S]*?}\n/gm, 'methods: {}\n')}\n\n###\n\n`

const methodPrompt = `Generate the methods section of a Pipedream app file for ${appName}. Methods correspond to API operations. You should generate a method for every parameter used across every ${appName} API endpoint, with a JSDoc comment above the method\n\n###\n\n`
let methodAppFile = ` ${appFile.replace(/"?propDefinitions"?:(\n|\s)*{[\s\S]*?}\n/gm, 'propDefinitions: {}\n')}\n\n###\n\n`

if (propDefPrompt.length < 2048) {
  // Check if the sum of the prompt and completion strings exceeds 2048 characters
  if (propDefPrompt.length + propDefAppFile.length > 2048) {
    // Truncate the completion string to ensure the sum is no more than 2048 characters
    propDefAppFile = `${propDefAppFile.slice(0, 2048 - propDefPrompt.length)}\n\n###\n\n`;
  }
  fs.appendFileSync('app_file_prop_defs.jsonl', JSON.stringify({ prompt: propDefPrompt, completion: propDefAppFile }) + '\n');
}

if (methodPrompt.length < 2048) {
  // Check if the sum of the prompt and completion strings exceeds 2048 characters
  if (methodPrompt.length + methodAppFile.length > 2048) {
    // Truncate the completion string to ensure the sum is no more than 2048 characters
    methodAppFile = `${methodAppFile.slice(0, 2048 - methodPrompt.length)}\n\n###\n\n`;
  }
  fs.appendFileSync('app_file_methods.jsonl', JSON.stringify({ prompt: methodPrompt, completion: methodAppFile }) + '\n');
}