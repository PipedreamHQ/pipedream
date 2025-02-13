const fs = require("fs")
const core = require("@actions/core");
const { execSync } = require("child_process");

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ywxbxfcsskoyjwnlpqms.supabase.co"
const supabaseKey = core.getInput("supabase_anon_key");
// const changedFiles = JSON.parse(core.getInput("changed_files") || "[]");

const changedFiles = [
  '.github/workflows/push-registry-app-files-supabase.yaml',
  'components/a123formbuilder/a123formbuilder.app.mjs',
  'components/a123formbuilder/sources/a123formbuilder.app.mjs',
  'components/twitter/app/twitter.app.ts',
];

const ignoreDirectories = [
  "/actions/",
  "/common/",
  "/sources/"
]

const shouldInclude = (file) => {
  if (!(file.endsWith(".app.mjs") || file.endsWith(".app.ts"))) {
    return false
  }
  for (let i = 0; i< ignoreDirectories.length; i++) {
    const dirToIgnore = ignoreDirectories[i]
    if (file.includes(dirToIgnore)) {
      return false
    }
  }
  return true
}

const root = "../../../";

function createMjsPayload(payload, appMjsFiles) {
  for (let i = 0; i < appMjsFiles.length; i++) {
    const filePath = root + appMjsFiles[i]
    const app = filePath.split("/").pop().replace(".app.mjs", "")
    const content = fs.readFileSync(filePath, { encoding: "utf-8" })
    payload.push({
      app,
      app_file: content,
      updated_at: new Date().toISOString(),
    });
  }
}

async function createTsPayload(payload, appTsFiles) {
  if (appTsFiles.length > 0) {
    console.log("Generating mjs files from ts files for: ", appTsFiles)
    execSync(`cd ${root} && pnpm run build`);
  }

  for (let i = 0; i < appTsFiles.length; i++) {
    const filePath = root + appTsFiles[i]
    const app = filePath.split("/").pop().replace(".app.ts", "")
    const appDirectory = `${root}components/${app}`
    const content = fs.readFileSync(`${appDirectory}/dist/app/${app}.app.mjs`, {encoding: "utf-8"})
    payload.push({
      app,
      app_file: content,
      updated_at: new Date().toISOString(),
    });
  }
}

async function uploadToSupabase(payload) {
  if (payload && payload.length) {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { error } = await supabase
        .from("registry_app_files")
        .upsert(payload, { onConflict: 'app' })
    if (error) {
      console.error(`Error bulk uploading files:`, error)
    } else {
      console.log(`Successfully bulk uploaded files`)
    }
  }
}

async function run() {
  const filesToUpsert = changedFiles.filter(shouldInclude)
  console.log("Working directory: ")
  execSync("pwd && ls -al")
  console.log("Files to upsert: ", filesToUpsert)

  const appMjsFiles = filesToUpsert.filter(file => file.endsWith('.app.mjs'))
  const appTsFiles = filesToUpsert.filter(file => file.endsWith('.app.ts'))

  const payload = [];
  createMjsPayload(payload, appMjsFiles)
  await createTsPayload(payload, appTsFiles)
  await uploadToSupabase(payload)
}

run().catch(error => core.setFailed(error ?? error?.message));
