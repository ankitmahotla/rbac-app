import { UserJwtPayload } from "./auth";

declare global {
  namespace Express {
    interface Request {
      user?: UserJwtPayload | string | jwt.JwtPayload;
    }
  }
}
