# Pipedream Docs

## Modifying docs and testing locally

First, install the dependencies for the repo:

```bash
yarn install
```

Then, run the Vuepress app locally:

```bash
yarn docs:dev
```

This should run a local development server on `http://localhost:8080/`. When you make changes to the Markdown files in the repo, the app should hot reload and refresh the browser automatically.

And that's it! You're ready to develop Pipedream documentation 🏄

## The Pull Request process

When contributing new code to this repo, please do so on a new Git branch, and submit a pull request to merge changes on that branch into `master`.

A member of the Pipedream team will automatically be notified when you open a pull request. You can also reach out to us on [our community](https://pipedream.com/community/c/dev/11) or [Slack](https://pipedream.com/support).

### Spellchecking

A spellchecker is automatically run on Markdown files in PRs. If you see this check fail when you open a PR, check the output for misspelled words:

```text
Misspelled words:
<htmlcontent> README.md: html>body>p
--------------------------------------------------------------------------------
lkjsdflkjsdflkjsdflk
--------------------------------------------------------------------------------

!!!Spelling check failed!!!
Files in repository contain spelling errors
```

Some technical words (like Pipedream or JavaScript) aren't in an English dictionary. If the spellchecker fails on a real word, please add it to the `.wordlist.txt` file.

The spellchecker configuration can be found in `.spellcheck.yml`. The spellchecking is handled by [this GitHub action](https://github.com/rojopolis/spellcheck-github-actions), which uses [PySpelling](https://facelessuser.github.io/pyspelling/).
