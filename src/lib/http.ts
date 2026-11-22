export function jsonError(
  status: number,
  code: string,
  message: string,
  headers: Record<string, string> = {},
): Response {
  return Response.json({ error: { code, message } }, { status, headers });
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new SyntaxError("invalid_json");
  }
}
