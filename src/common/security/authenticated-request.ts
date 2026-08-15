import { Request } from 'express';

export interface AuthenticatedUser {
  sub: string;
  userSeq: number;
  typ: 'access';
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
