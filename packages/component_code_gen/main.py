import os
import argparse
from code_gen.generate import main, available_templates
from code_gen.generate_for_github_issue import generate


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--issue', help='The issue number on github',
                        type=int, required=False)
    parser.add_argument('--skip-pr', dest='skip_pr', help='Generate a PR on github',
                        required=False, default=False, action='store_true')
    parser.add_argument('--clean', dest='clean', help='Clean git stage',
                        required=False, default=False, action='store_true')
    parser.add_argument('--type', help='Which kind of code you want to generate?',
                        choices=available_templates.keys())
    parser.add_argument('--app', help='The app_name_slug')
    parser.add_argument('--instructions', help='Markdown file with instructions: prompt + api docs',
                        default="instructions.md")
    parser.add_argument('--urls', help='A list of (space-separated) api docs urls to be parsed and sent with the prompt',
                        default=[], nargs="*")
    parser.add_argument('--num_tries', dest='tries', help='The number of times we call the model to generate code',
                        default=1, type=int)
    parser.add_argument(
        '--custom_path', help='The path for the location of custom files')
    parser.add_argument('--output_dir', help='The path for the output dir',
                        required=False, default=os.path.join("..", "..", "components"))
    parser.add_argument('--verbose', dest='verbose', help='Set the logging to debug',
                        default=False, action='store_true')
    parser.add_argument('--remote', dest='remote_name',
                        help='The Git remote name', default='origin')
    args = parser.parse_args()

    if args.issue:
        generate(args.issue, output_dir=args.output_dir, generate_pr=not args.skip_pr,
                 clean=args.clean, verbose=args.verbose, tries=args.tries, remote_name=args.remote_name)
    else:
        if not args.type:
            raise argparse.ArgumentTypeError("--type is required")
        if not args.app:
            raise argparse.ArgumentTypeError("--app is required")

        with open(args.instructions, 'r') as f:
            instructions = f.read()

        result = main(args.type, args.app, instructions, instructions, args.tries,
                      args.urls, args.custom_path, args.verbose)
        print(result)
