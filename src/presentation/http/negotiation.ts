import { type Request, type Response, type NextFunction, type RequestHandler } from "express";
import { toHtml, toXml } from "./renderer";
export const SUPPORTED_TYPES = ["application/json", "application/xml", "text/html"] as const;
export type Supported = typeof SUPPORTED_TYPES[number];
export function negotiate(req: Request, res: Response, supported: readonly string[] = SUPPORTED_TYPES): Supported | null {
const chosen = req.accepts(supported as unknown as string[]) as string | false;
if (!chosen) return null;
  const varyRes = res as Response & { vary?: (field: string) => void };
if (typeof varyRes.vary === "function") {
  varyRes.vary("Accept");
} 
  else {
    const prev = res.getHeader("Vary");
    const prevStr = Array.isArray(prev) ? prev.join(",") : String(prev ?? "");
    const values = new Set(prevStr.split(",").map(s => s.trim()).filter(Boolean));
    values.add("Accept");
    res.setHeader("Vary", Array.from(values).join(", "));
  }

  res.type(chosen);
  return chosen as Supported;
}
export async function sendNegotiated(
  req: Request,
  res: Response,
  payload: unknown,
  htmlTitle = 'Response',
  supported: readonly string[] = SUPPORTED_TYPES
): Promise<void> {
  const type = negotiate(req, res, supported);
  if (!type) {
    res.status(406).json({ success: false, error: `Not acceptable. Supported: ${supported.join(', ')}` });
    return;
  }
  try {
    if (type === 'application/json') {
      try {
        JSON.stringify(payload); 
        res.json(payload);
        return;
      } catch (err) {
        console.error('[neg] JSON serialization failed:', err);
        res.status(500).json({ success: false, error: 'Response payload not serializable' });
        return;
      }
    }
    if (type === 'application/xml') {
      try {
        const xml = toXml(payload);
        if (typeof xml !== 'string') throw new Error('toXml did not return string');
        res.type('application/xml').send(xml);
        return;
      } catch (err) {
        console.error('[neg] toXml failed:', err);
        res.status(500).json({ success: false, error: 'XML renderer error' });
        return;
      }
    }
    try {
      const html = toHtml(payload, htmlTitle);
      if (typeof html !== 'string') throw new Error('toHtml did not return string');
      res.type('text/html').send(html);
      return;
    } catch (err) {
      console.error('[neg] toHtml failed:', err);
      res.status(500).json({ success: false, error: 'HTML renderer error' });
      return;
    }
  } catch (err) {
    console.error('[neg] unexpected error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
    return;
  }
}
