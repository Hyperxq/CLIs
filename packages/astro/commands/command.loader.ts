/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Command } from 'commander';
import { ERROR_PREFIX } from '../lib/ui';
import { colors } from '../lib/utils';
import { GeneratePageCommand } from './generate.command';
import { GenerateAction } from '../actions';

export class CommandLoader {
  public static async load(program: Command): Promise<void> {
    new GeneratePageCommand(new GenerateAction()).load(program);
    // new GeneratePageCommand(new ExecuteAction()).load(program);
    // new GeneratePageCommand(new ExecuteAction()).load(program);

    this.handleInvalidCommand(program);
  }

  private static handleInvalidCommand(program: Command) {
    program.on('command:*', () => {
      console.error(
        `\n${ERROR_PREFIX} Invalid command: ${colors.red('%s')}`,
        program.args.join(' '),
      );
      console.log(
        `See ${colors.red('--help')} for a list of available commands.\n`,
      );
      process.exit(1);
    });
  }
}
