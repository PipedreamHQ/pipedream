import os
import argparse
import templates.generate_webhook_sources


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--app', '-a', help='the app_name_slug', required=True)
    parser.add_argument('prompt', help='the prompt to send to gpt-4, in between quotes')
    parser.add_argument('--verbose', dest='verbose', help='set the logging to debug', required=False, default=False, action='store_true')
    args = parser.parse_args()

    if args.verbose:
        os.environ['DEBUG'] = '1'

    # this is here so that the DEBUG environment variable is set before the imports
    from code_gen.generate_component_code import main

    result = main(args.app, args.prompt, templates.generate_webhook_sources)
    print(result)


if __name__ == '__main__':
    main()
