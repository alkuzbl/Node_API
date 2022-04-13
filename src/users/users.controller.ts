import {BaseController} from "../common/base.controller";
import {LoggerService} from "../logger/logger.service";
import {NextFunction, Request, Response} from "express";
import {HttpError} from "../errors/http-error.class";

export class UsersController extends BaseController{

    constructor(
        logger: LoggerService
    ) {
        super(logger);
        this.bindRoutes([
            {path:'/login', method: 'post', func: this.login},
            {path:'/register', method: 'post', func: this.register},
        ])

    }

    login(req: Request, res: Response, next: NextFunction){
        next(new HttpError(401, 'Не авторизован', 'login'));
    }

    register(req: Request, res: Response, next: NextFunction){
        this.ok<string>(res, 'Register');
    }

}
