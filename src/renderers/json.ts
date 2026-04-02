export function outputSuccess(data: unknown): void {
  process.stdout.write(JSON.stringify({ success: true, data }, null, 2) + "\n");
}

export function outputError(message: string): void {
  process.stderr.write(JSON.stringify({ success: false, error: message }, null, 2) + "\n");
}
