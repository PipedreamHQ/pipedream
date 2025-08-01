const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

async function run() {
  try {
    // Get inputs - handle both core.getInput and environment variables for composite actions
    const githubToken = core.getInput('github-token') || process.env.INPUT_GITHUB_TOKEN;
    const validationReportJson = core.getInput('validation-report-json') || process.env.INPUT_VALIDATION_REPORT_JSON;
    const validationReportTxt = core.getInput('validation-report-txt') || process.env.INPUT_VALIDATION_REPORT_TXT;
    const workflowRunNumber = core.getInput('workflow-run-number') || process.env.INPUT_WORKFLOW_RUN_NUMBER;
    const workflowRunId = core.getInput('workflow-run-id') || process.env.INPUT_WORKFLOW_RUN_ID;
    const serverUrl = core.getInput('server-url') || process.env.INPUT_SERVER_URL;
    const repository = core.getInput('repository') || process.env.INPUT_REPOSITORY;

    // Validate required inputs
    if (!githubToken) {
      throw new Error('github-token is required');
    }
    if (!validationReportJson) {
      throw new Error('validation-report-json is required');
    }
    if (!workflowRunNumber || !workflowRunId || !serverUrl || !repository) {
      throw new Error('workflow metadata (run-number, run-id, server-url, repository) is required');
    }

    // Initialize GitHub client
    const octokit = github.getOctokit(githubToken);
    const context = github.context;
    
    // Set up repository context for composite actions
    const [owner, repo] = repository.split('/');
    const repoContext = {
      owner: owner || context.repo?.owner,
      repo: repo || context.repo?.repo
    };

    // Read and parse validation reports
    let reportData = null;
    let failedCount = 0;
    let summaryText = '';

    // Resolve file paths relative to the workspace, not the action directory
    const workspacePath = process.env.GITHUB_WORKSPACE || process.cwd();
    const jsonReportPath = validationReportJson.startsWith('/') 
      ? validationReportJson 
      : `${workspacePath}/${validationReportJson}`;
    const txtReportPath = validationReportTxt && !validationReportTxt.startsWith('/') 
      ? `${workspacePath}/${validationReportTxt}` 
      : validationReportTxt;

    core.info(`Reading validation report from: ${jsonReportPath}`);

    try {
      if (fs.existsSync(jsonReportPath)) {
        const jsonReport = fs.readFileSync(jsonReportPath, 'utf8');
        reportData = JSON.parse(jsonReport);
        failedCount = reportData.summary.failed;
        
        summaryText = `
📊 **Summary:**
- Total Components: ${reportData.summary.total}
- ✅ Validated: ${reportData.summary.validated}
- ❌ Failed: ${reportData.summary.failed}
- ⏭️ Skipped: ${reportData.summary.skipped}
- 📈 Publishable: ${reportData.summary.publishable}
- 📉 Failure Rate: ${reportData.summary.failureRate}%
        `;

        core.info(`Parsed JSON report: ${failedCount} failures found`);
      } else {
        core.warning(`JSON report file not found: ${jsonReportPath}`);
        failedCount = 0;
      }
    } catch (error) {
      core.warning(`Failed to parse JSON report: ${error.message}`);
      
      // Fallback to text report
      try {
        if (txtReportPath && fs.existsSync(txtReportPath)) {
          const report = fs.readFileSync(txtReportPath, 'utf8');
          const failedPackages = report.match(/❌.*FAILED:/g) || [];
          failedCount = failedPackages.length;
          summaryText = `Failed to parse JSON report. Found ${failedCount} failures in text report.`;
          core.info(`Fallback to text report: ${failedCount} failures found`);
        }
      } catch (txtError) {
        core.error(`Failed to read text report: ${txtError.message}`);
        failedCount = 0;
      }
    }

    // Exit early if no failures
    if (failedCount === 0) {
      core.info('No failures detected, skipping issue creation');
      core.setOutput('issue-created', 'false');
      core.setOutput('issue-url', '');
      return;
    }

    core.info(`Processing ${failedCount} failures`);

    // Generate failed packages list
    let failedPackagesList = '';
    if (reportData && reportData.failed) {
      const topFailures = reportData.failed.slice(0, 10);
      failedPackagesList = topFailures.map(pkg => {
        const failureTypes = pkg.failures.map(f => f.check).join(', ');
        return `- **${pkg.packageName}** (${pkg.app}): ${failureTypes}`;
      }).join('\n');
      
      if (reportData.failed.length > 10) {
        failedPackagesList += `\n- ... and ${reportData.failed.length - 10} more packages`;
      }
    } else {
      failedPackagesList = 'See full report for details.';
    }

    // Create issue body
    const today = new Date().toDateString();
    const issueBody = `
# 📦 Scheduled Package Validation Report - ${today}

${summaryText}

## 🔗 Links
- **Workflow Run**: [#${workflowRunNumber}](${serverUrl}/${repository}/actions/runs/${workflowRunId})
- **Download Reports**: Check the workflow artifacts for detailed JSON and text reports

## ❌ Failed Packages
${failedPackagesList}

## 📋 Failure Categories
${reportData ? generateFailureCategoriesText(reportData) : 'Categories unavailable - check full report'}

## Full Report
The complete validation report is available as an artifact in the workflow run.

## Next Steps
1. Review the failed packages listed above
2. Check the full validation report artifact for detailed error messages
3. Fix import/dependency issues in failing packages
4. Consider updating package.json configurations
5. Ensure all main files have proper exports

## 🔧 Quick Commands
To test a specific package locally:
\`\`\`bash
npm run validate:package -- <package-name>
\`\`\`

To run validation on all packages:
\`\`\`bash
npm run validate:packages:verbose
\`\`\`

---
*This issue was automatically created by the scheduled package validation workflow.*
    `;

    // Check for existing open issues
    core.info('Checking for existing open issues...');
    const { data: issues } = await octokit.rest.issues.listForRepo({
      owner: repoContext.owner,
      repo: repoContext.repo,
      labels: ['package-validation', 'automated'],
      state: 'open'
    });

    const existingIssue = issues.find(issue => 
      issue.title.includes(today) && 
      issue.title.includes('Scheduled Package Validation Report')
    );

    let issueUrl = '';
    let issueCreated = false;
    let issueUpdated = false;

    if (existingIssue) {
      // Update existing issue with a comment
      core.info(`Updating existing issue #${existingIssue.number}`);
      
      const comment = await octokit.rest.issues.createComment({
        owner: repoContext.owner,
        repo: repoContext.repo,
        issue_number: existingIssue.number,
        body: `## 🔄 Updated Report - Run #${workflowRunNumber}

${issueBody}

---
*Issue updated at ${new Date().toISOString()}*`
      });

      issueUrl = existingIssue.html_url;
      issueCreated = false;
      issueUpdated = true;
      core.info(`Updated issue: ${issueUrl}`);
    } else {
      // Create new issue
      core.info('Creating new issue...');
      
      const newIssue = await octokit.rest.issues.create({
        owner: repoContext.owner,
        repo: repoContext.repo,
        title: `📦 Scheduled Package Validation Report - ${today} - ${failedCount} failures`,
        body: issueBody,
        labels: ['package-validation', 'automated', 'bug']
      });

      issueUrl = newIssue.data.html_url;
      issueCreated = true;
      issueUpdated = false;
      core.info(`Created new issue: ${issueUrl}`);
    }

    // Set outputs for both regular and composite actions
    core.setOutput('issue-created', issueCreated.toString());
    core.setOutput('issue-updated', issueUpdated.toString());
    core.setOutput('issue-url', issueUrl);
    core.setOutput('failed-count', failedCount.toString());
    
    // For composite actions, also write to GITHUB_OUTPUT file
    if (process.env.GITHUB_OUTPUT) {
      const outputData = [
        `issue-url=${issueUrl}`,
        `failed-count=${failedCount.toString()}`,
        `issue-created=${issueCreated.toString()}`,
        `issue-updated=${issueUpdated.toString()}`
      ].join('\n') + '\n';
      
      fs.appendFileSync(process.env.GITHUB_OUTPUT, outputData);
    }

  } catch (error) {
    core.setFailed(`Action failed: ${error.message}`);
    console.error('Full error:', error);
  }
}

function generateFailureCategoriesText(reportData) {
  if (!reportData.failed || reportData.failed.length === 0) {
    return 'No failure categories to display.';
  }

  const failuresByCategory = {};
  
  reportData.failed.forEach(({ packageName, failures }) => {
    failures.forEach(failure => {
      if (!failuresByCategory[failure.check]) {
        failuresByCategory[failure.check] = [];
      }
      failuresByCategory[failure.check].push({
        packageName,
        error: failure.error
      });
    });
  });

  let categoriesText = '';
  Object.entries(failuresByCategory).forEach(([category, failures]) => {
    categoriesText += `\n### 🔍 ${category.toUpperCase()} Failures (${failures.length})\n`;
    
    failures.slice(0, 3).forEach(({ packageName, error }) => {
      categoriesText += `- **${packageName}**: ${error}\n`;
    });
    
    if (failures.length > 3) {
      categoriesText += `- ... and ${failures.length - 3} more\n`;
    }
  });

  return categoriesText;
}

// Run the action
if (require.main === module) {
  run();
}

module.exports = { run };