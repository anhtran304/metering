import { Request } from 'express';

export function logToConsole(req: Request): void {
  console.log(`METHOD: ${req.method} | URL: ${req.url} | TIME: ${Date()}`);
}
