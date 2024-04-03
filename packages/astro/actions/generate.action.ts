/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Collection } from '../lib/schematics';
import { Input } from '../commands';
import { CLIFactory, SchematicsCli } from '../lib/CLI';
import { CLI } from '../lib/CLI/cli.enum';
import { findInput, logger } from '../lib/utils';
import { AbstractAction } from './abstract.action';

export class GenerateAction extends AbstractAction {
  public async handle(inputs: Input[], flags: Input[]) {
    await executeSchematic(inputs, flags);
  }
}

const executeSchematic = async (inputs: Input[] = [], flags: Input[] = []) => {
  try {
    const name = findInput(inputs, 'name')?.value as string;
    const schematic = findInput(inputs, 'schematic')?.value as string;

    const schematicCli = CLIFactory(CLI.SCHEMATICS) as SchematicsCli;
    await schematicCli.runCommand(
      schematicCli.getExecuteCommand(
        Collection.ASTRO,
        schematic,
        [name],
        flags,
      ),
    );
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
};
