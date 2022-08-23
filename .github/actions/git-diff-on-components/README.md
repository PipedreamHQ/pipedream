# Git diff on components action

This action takes care of all components with dependencies that were modified but the version was not incremented.

## Inputs

### `base_commit`

**Required** Base commit SHA.

### `head_commit`

**Required** Head commit SHA.

### `all_files`

**Required** List of all files comming from `changed_files` step in `check_version` job github action workflow. It is necessary to set the action `jitterbit/get-changed-files@v1` output in json format like
```
...
with:
  format: json
```
in that way `steps.changed_files.outputs.all` will be converted in array of strings

## Example usage

```yaml
- name: Check git diff for version changes
  uses: ./.github/actions/git-diff-on-components
  with:
    all_files: ${{ steps.changed_files.outputs.all }}
    base_commit: ${{ github.event.pull_request.base.sha }}
    head_commit: ${{ github.event.pull_request.head.sha }}
```

## Build
You need to push all files generated in `dist` folder once you are finished with the build to test the new version of the github action in case you want to make modifications.
```
$ cd .github/actions/git-diff-on-components/
$ npm i && npm run build
```