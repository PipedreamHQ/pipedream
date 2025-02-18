# Push registry app files to Supabase

This action pushes new and modified `*.app.mjs/*.app.ts` files to Supabase.

## Inputs

### `changed_files`

**Required** List of changed files.

### `supabase_anon_key`

**Required** Supabase key

```
...
with:
  format: json
```

in that way `steps.changed_files.outputs.all` will be converted into an array of strings

## Example usage

```yaml
  - name: Upload modified or newly added *.app.mjs files to Supabase
    uses: ./.github/actions/push-registry-app-files-supabase
    with:
      changed_files: ${{ steps.changed_files.outputs.all }}
      supabase_anon_key: ${{ secrets.SUPABASE_ANON_KEY }}
```

## Local Development + Build

Run the following command from this action directory to update `dist/index.js` if `src/index.js` has been modified:
```bash
cd .github/actions/push-registry-app-files-supabase
npm run dev
```

The above command will build and run the dist/index.js. Commit the `dist` directory.
You might want to change the `on` trigger to `push` event on your local branch when making changes to the action so you
can test it on GitHub:

## Master
```yaml
# .github/workflows/push-registry-app-files-supabase.yaml
on:
  pull_request:
    branches:
      - master
    paths:
      - 'components/**'
```

## During development
```yaml
# .github/workflows/push-registry-app-files-supabase.yaml
on:
  push:
    branches:
      - feature-branch-name
    paths:
      - 'components/**'
      - '.github/actions/push-registry-app-files-supabase/**'
```

