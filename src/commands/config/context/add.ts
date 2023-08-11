import { Flags } from '@oclif/core';
import Command from '../../../base';
import { addContext } from '../../../models/Context';
import {
  MissingContextFileError,
  ContextFileWrongFormatError,
} from '../../../errors/context-error';

export default class ContextAdd extends Command {
  static description = 'Add a context to the store';
  static flags = {
    help: Flags.help({ char: 'h' }),
    debug: Flags.boolean({
      char: 'd',
      description: 'Print any errors that arise',
      default: false,
      required: false,
    })
  };

  static args = [
    { name: 'context-name', description: 'context name', required: true },
    {
      name: 'spec-file-path',
      description: 'file path of the spec file',
      required: true,
    },
  ];

  async run() {
    const { args, flags } = await this.parse(ContextAdd);
    const contextName = args['context-name'];
    const specFilePath = args['spec-file-path'];
    const debugFlag = flags['debug'];

    try {
      await addContext(contextName, specFilePath);
      this.log(
        `Added context "${contextName}".\n\nYou can set it as your current context: asyncapi config context use ${contextName}\nYou can use this context when needed by passing ${contextName} as a parameter: asyncapi validate ${contextName}`
      );
    } catch (e) {
      if(debugFlag){
        this.log(`---DEBUGGING INFO---\n\n`,e,`\n\n---END DEBUGGING INFO---\n`);
      }

      if (
        e instanceof (MissingContextFileError || ContextFileWrongFormatError)
      ) {
        this.log(
          'You have no context file configured. Run "asyncapi config context init" to initialize it.'
        );
        return;
      }
      {
        throw e;
      }
    }
  }
}
