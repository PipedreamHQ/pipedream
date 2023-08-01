import os
import argparse
import templates.generate_actions


def main(app, prompt, verbose=False):
    validate_inputs(app, prompt)

    if verbose:
        os.environ['DEBUG'] = '1'

    # this is here so that the DEBUG environment variable is set before the imports
    from code_gen.generate_component_code import main

    result = main(app, prompt, templates.generate_actions)
    return result


def validate_inputs(app, prompt):
    if not (bool(app) and bool(prompt)):
        raise Exception('app and prompt are required')

    if type(app) != str and type(prompt) != str:
        raise Exception('app and prompt should be strings')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--app', '-a', help='the app_name_slug', required=True)
    parser.add_argument('prompt', help='the prompt to send to gpt-4, in between quotes')
    parser.add_argument('--verbose', dest='verbose', help='set the logging to debug', required=False, default=False, action='store_true')
    args = parser.parse_args()
    result = main(args.app, args.prompt, args.verbose)
    print(result)
