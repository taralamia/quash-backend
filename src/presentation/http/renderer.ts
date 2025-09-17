export function escapeXml(v: string) {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
export function toHtml(obj: unknown, title = "Response"): string {
  const pre = escapeXml(JSON.stringify(obj, null, 2));
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${escapeXml(title)}</title>
  </head>
  <body>
    <h1>${escapeXml(title)}</h1>
    <pre>${pre}</pre>
  </body>
</html>`;
}
export function toXml(value: unknown, root = "response"): string {
  const xml = renderXml(value);
  return `<?xml version="1.0" encoding="UTF-8"?><${root}>${xml}</${root}>`;
}
function renderXml(value: unknown, key?: string): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) { 
    return escapeXml(value.toISOString());
  }
  if (Array.isArray(value)) {
    const itemName = key && key.endsWith('s') ? key.slice(0, -1) : 'item';
    return value.map(v => `<${itemName}>${renderXml(v)}</${itemName}>`).join("");
  }
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => `<${k}>${renderXml(v, k)}</${k}>`) 
      .join("");
  }
  return escapeXml(String(value));
}