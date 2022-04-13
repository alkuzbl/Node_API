import {Logger} from 'tslog'
import {ILogger} from "./logger.interface";

export class LoggerService implements ILogger{
    public logger: Logger;

    constructor() {
        this.logger = new Logger({
            displayFilePath: 'hidden',
            displayInstanceName: false,
            displayLoggerName: false,
            displayFunctionName: false
        })
    }
    log(...args: unknown[]){
        this.logger.info(...args);
    }

    error(...args: unknown[]){
        this.logger.error(...args);
    }

    warn(...args: unknown[]){
        this.logger.warn(...args);
    }
}
