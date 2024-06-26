import { Request } from 'express';

export function extractHeaderTokens(req: Request): string | undefined {
  const [type, token] = req.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}
