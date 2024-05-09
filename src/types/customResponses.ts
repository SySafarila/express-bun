import type { Response } from "express";

export interface AuthRespnose extends Response {
  locals: {
    token?: string;
    tokenId?: number;
    clientIp?: string;
    permissions?: Array<string>;
    roles?: Array<string>;
  };
}
