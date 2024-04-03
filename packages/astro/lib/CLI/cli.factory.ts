/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { CLI } from './cli.enum';
import { SchematicsCli } from './schematics.cli';

export function CLIFactory(cli: CLI = CLI.SCHEMATICS) {
  switch (cli) {
    case CLI.SCHEMATICS:
      return new SchematicsCli();
  }
}
