/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Command } from 'commander';
import { AbstractCommand } from './abstract.command';
import { Input } from './command.input.interface';
import { logger } from '../lib/utils';
import { AbstractAction } from 'actions';
import { kebabCase } from 'case-anything';

export class GeneratePageCommand extends AbstractCommand {
  public load(program: Command) {
    const generateCommand = program
      .command('generate')
      .alias('g')
      .description('Generate files for an astro project')
      .option(
        '-pm, --package-manager <manager>',
        'The package manager used to install dependencies.     [string] [choices: "npm", "yarn", "pnpm", "cnpm", "bun"]',
        (value: string) => {
          if (
            !['npm', 'yarn', 'pnpm', 'cnpm', 'bun'].some((v) => value === v)
          ) {
            logger.error(`You entered a not valid package manager`);
            process.exit(1);
          }

          return value;
        },
        'npm',
      );

    generateCommand
      .command('page <name>')
      .alias('p')
      .description('Generate a page')
      .option(
        '-l, --layout <layout>',
        'The name of the layout the you would like to use',
      )
      .option(
        '-t, --type <type>',
        'Which type of page do you want: astro, md, mdx',
        validateType,
        'astro',
      )
      .action((name: string, options: { [key: string]: any }) =>
        action(this.action, 'page', name, options),
      )
      .addHelpText(
        'after',
        `
Examples:
  $ pastro generate page MyPage --layout Main --type astro  # Generates an Astro page with Main layout
  $ pastro g p MyPage --layout MainLayout --type md              # Generates a Markdown page with MainLayout layout
  $ pastro g p MyPage --layout Blog --type mdx             # Generates an MDX page with Blog layout
`,
      );

    generateCommand
      .command('component <name>')
      .alias('c')
      .description('Generate a component')
      .option(
        '-a, --add-slot [addSlot]',
        'Add a slot to the component',
        (value) => value === 'true',
        false,
      )
      .action((name: string, options: { [key: string]: any }) =>
        action(this.action, 'component', name, options),
      )
      .addHelpText(
        'after',
        `
Examples:
  $ pastro generate component MyComponent --add-slot       # Explicitly adds a slot
  $ pastro generate component MyComponent --add-slot=true  # Also adds a slot
  $ pastro generate component MyComponent --add-slot=false # Does not add a slot
  $ pastro generate component MyComponent                  # Defaults to not adding a slot, depending on your default value
`,
      );

    generateCommand
      .command('layout <name>')
      .alias('l')
      .description('Generate a layout')
      .action((name: string, options: { [key: string]: any }) =>
        action(this.action, 'layout', name, options),
      );
  }
}

// Helper function to validate the type
function validateType(type) {
  const allowedTypes = ['astro', 'md', 'mdx'];
  if (!allowedTypes.includes(type)) {
    throw new Error(
      `Invalid type '${type}'. Allowed types are: ${allowedTypes.join(', ')}.`,
    );
  }
  return type;
}

async function action(
  action: AbstractAction,
  schematic: 'component' | 'layout' | 'page',
  name: string,
  options: { [key: string]: any },
) {
  const inputs: Input[] = [];
  const flags: Input[] = [];

  Object.entries(options).forEach(([name, value]) => {
    flags.push({
      name: kebabCase(name),
      value,
    });
  });

  inputs.push({
    name: 'name',
    value: name,
  });

  inputs.push({
    name: 'schematic',
    value: schematic,
  });

  await action.handle(inputs, flags);
}
