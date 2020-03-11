import { Request } from 'express';
import { ENV_VARIABLE } from '../../env';

export function logger(env: string | undefined, req: Request): void {
  env === ENV_VARIABLE.develop &&
    console.log(
      `METHOD: ${req.method} | URL: ${req.url} | 
      IP: ${req.ip} | TIME: ${Date()}`
    );
}
