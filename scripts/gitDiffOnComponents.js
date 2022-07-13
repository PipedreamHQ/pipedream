const core = require("@actions/core");
const github = require("@actions/github");

try {
  console.log("Action version 0.0.1");
  
  const baseCommit = core.getInput("base_commit");
  const headCommit = core.getInput("head_commit");
  const allFiles = core.getInput("all_files");

  console.log("baseCommit", baseCommit);
  console.log("headCommit", headCommit);
  console.log("allFiles", allFiles);

  core.setOutput("baseCommit output", baseCommit);
  core.setOutput("headCommit output", headCommit);
  core.setOutput("allFiles output", allFiles);

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);

} catch (error) {
  core.setFailed(error.message);
}