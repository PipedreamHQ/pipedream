import os
import argparse
from code_gen.generate_component_code import main
from code_gen.transform_code import transform


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--app', '-a', help='the app_name_slug', required=True)
    parser.add_argument('prompt', help='the prompt to send to gpt-4, in between quotes')
    parser.add_argument('--verbose', '-v', dest='verbose', help='set the logging to debug', required=False, default=False, action='store_true')
    args = parser.parse_args()

    if args.verbose:
        os.environ['DEBUG'] = '1'
        import config.config as config

    code = main(args.app, args.prompt)
    result = transform(code)
    print(result)
