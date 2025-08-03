import { IUserJWT } from "../user";

declare global {
    namespace Express {
        interface Request {
            user?: IUserJWT
        }
    }
}