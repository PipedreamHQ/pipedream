import { createClient } from '@supabase/supabase-js'
import { readFile } from 'fs/promises'
import { glob } from 'glob'
import path from 'path'
import 'dotenv/config'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error('Missing required environment variables SUPABASE_URL and/or SUPABASE_KEY')
}

// Configure Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

async function findAndUploadFiles() {
  try {
    // Find all .app.mjs files recursively
    const files = await glob('../components/**/*.app.mjs', {
      // No need to recurse into the standard subdirs, since app files are always at 
      // the root of the components/${app} directory
      ignore: ['node_modules/**', 'actions/**', 'common/**', 'sources/**'],
      absolute: true
    })

    console.log(`Found ${files.length} .app.mjs files`)

    for (const filePath of files) {
      try {
        const content = await readFile(filePath, 'utf8')

        const filename = path.basename(filePath)
        const app = filename.replace('.app.mjs', '')

        const { data, error } = await supabase
          .from('registry_app_files')
          .insert({
            app: app,
            app_file: content
          })

        if (error) {
          console.error(`Error uploading ${filename}:`, error)
          continue
        }

        console.log(`Successfully uploaded ${filename}`)
      } catch (err) {
        console.error(`Error processing ${filePath}:`, err)
      }
    }
  } catch (err) {
    console.error('Error finding files:', err)
  }
}

// Run the script
findAndUploadFiles()
  .then(() => console.log('Upload complete'))
  .catch(err => console.error('Script failed:', err))