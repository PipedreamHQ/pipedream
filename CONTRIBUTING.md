# Contributing to Pipedream

Our hope is that by providing a generous free tier, you will not only get value from Pipedream, but you will give back to improve the value of the product for the entire community. And there are so many ways you can contribute!

## Follow, Star & Subscribe

[Follow us](https://twitter.com/pipedream) on Twitter, [star](https://github.com/PipedreamHQ/pipedream) our GitHub repo and [subscribe](https://www.youtube.com/pipedreamhq) to our YouTube channel.

## Recommend Us!

There’s no better way of supporting Pipedream than recommending us to your friends and colleagues.

## Ask & Answer Questions

Do you have a question about Pipedream or how to solve a problem? Please ask us in our [community forum](https://pipedream.com/community)! Chances are that someone else has a similar question, so by helping you, we can help others encountering the same questions and challenges. Or pay it forward and help answer questions from other users.

## Share Your Workflows

If you have a workflow that others may find interesting -- whether it’s just a fun demo or solving a real problem -- make it public and share it in our [community](https://pipedream.com/community/c/show-tell/8) or on Twitter. We may feature it to help new users get started and give others new ideas to try out.

## Create Content

Write a blog post or create a video about how you use Pipedream. Also send it to us so we can list it on our site to send you some traffic! We also love to join live streams — just [contact us](https://pipedream.com/support/)!

## Report Bugs

Found an issue? [Report it](https://pipedream.com/community/c/bugs/9)

## Submit & Vote On Feature Requests

Help us build an amazing product! Submit [feature requests](https://pipedream.com/community/c/feature-requests/7) in our community forum, or [browse existing requests](https://github.com/PipedreamHQ/pipedream/issues) on GitHub and vote for the features want us to add!

## Request Apps

Need an app we don’t support? [Request it](https://github.com/PipedreamHQ/pipedream/issues/new?assignees=&labels=app%2C+enhancement&template=app---service-integration.md&title=[APP])

## Submit Updates to Docs

See a gap or mistake in our [docs](https://github.com/PipedreamHQ/pipedream/tree/master/docs)? Create a PR to submit an update.

## Develop Sources and Actions

[Contribute](https://pipedream.com/docs/components/guidelines/) to Pipedream's registry of components by:

- Creating new components (sources and actions)
- Updating existing components (e.g., fixing bugs, enhancing functionality)
- Adding or updating metadata (e.g., descriptions, labels)

### Setting up your Component Development Environment

Develop components without leaving your browser with the Pipedream Gitpod workspace _without installing any dependencies_.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/PipedreamHQ/pipedream)

1. Fork the official [Pipedream GitHub repository](https://github.com/PipedreamHQ/pipedream)
2. Add your PD API key to your [Gitpod Variables](https://gitpod.io/variables) as `PD_API_KEY`
3. Open a new Gitpod Workspace with your fork: `https://gitpod.io/#https://github.com/<your-github-username>/pipedream`
4. Run `pd init app` to scaffold a new app, or make changes to an existing one in the `components` directory

This workspace will automatically configure the Pipedream CLI client with your API key. This allows you to interact with the [advanced Pipedream CLI tool](https://pipedream.com/docs/cli/reference/) and develop components on the fly.

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
