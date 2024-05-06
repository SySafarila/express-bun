import type { Request } from "express";

export interface AuthRequest extends Request {
  token?: string;
  tokenId?: number;
  clientIp?: string;
}
