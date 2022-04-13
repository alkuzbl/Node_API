import {NextFunction, Request, Response} from "express";
import {LoggerService} from "../logger/logger.service";
import {IExceptionFilter} from "../errors/exception.filter.interface";
import {HttpError} from "../errors/http-error.class";

export class ExceptionFilter implements IExceptionFilter{
    logger: LoggerService;

    constructor(logger: LoggerService) {
        this.logger = logger;
    }
    catch(err: Error | HttpError, req: Request, res: Response, next: NextFunction){
        if(err instanceof HttpError){
            this.logger.error(`[${err.context}] Ошибка ${err.statusCode} : ${err.message}`);
            res.status(err.statusCode).send({error: err.message})
        } else {
            this.logger.error(`${err.message}`);
            res.status(500).send({error: err.message})
        }


    }
}
