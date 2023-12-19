import os
import argparse
import requests
import markdown_to_json
from code_gen.generate_for_github_issue import generate_from_issue, generate_from_markdown


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--issue', help='The issue number on github', type=int, required=False)
    parser.add_argument(
        '--skip-pr', '--skip_pr', dest='skip_pr', help='Generate a PR on github', default=False, action='store_true')
    parser.add_argument(
        '--clean', dest='clean', help='Clean git stage', default=False, action='store_true')
    parser.add_argument(
        '--remote', dest='remote_name', help='The Git remote name', default='origin')
    parser.add_argument(
        '--output-dir', '--output_dir', help='The path for the output dir', default=os.path.join("..", "..", "components"))
    parser.add_argument(
        '--num-tries', '--num_tries', dest='tries', help='The number of times we call the model to generate code', type=int, default=2)
    parser.add_argument(
        '--instructions', help='The file with markdown instructions', required=False)
    parser.add_argument(
        '--verbose', dest='verbose', help='Set the logging to debug', default=False, action='store_true')
    args = parser.parse_args()

    def clean_instructions(instructions):
        return instructions.replace("\r", "").lower()

    if args.issue:
        # parse github issue description
        instructions = requests.get(
            f"https://api.github.com/repos/PipedreamHQ/pipedream/issues/{args.issue}").json()["body"]
        markdown = markdown_to_json.dictify(clean_instructions(instructions))
        generate_from_issue(markdown, args.issue, output_dir=args.output_dir, generate_pr=not args.skip_pr,
                            clean=args.clean, verbose=args.verbose, tries=args.tries, remote_name=args.remote_name)

    elif args.instructions:
        instructions = args.instructions

        if os.path.isfile(instructions):
            with open(instructions, 'r') as f:
                instructions = f.read()

        markdown = markdown_to_json.dictify(clean_instructions(instructions))
        generate_from_markdown(
            markdown, output_dir=args.output_dir, verbose=args.verbose, tries=args.tries)

    else:
        raise Exception("Missing required argument: issue or instructions")
