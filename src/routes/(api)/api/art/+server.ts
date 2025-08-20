import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { readdir } from "node:fs/promises";

const files = await readdir("static/art");
files.sort();

export const GET: RequestHandler = async () => {
	return json({
    files: files.map((filename) => {
      const parsed = filename.split(".")[0].split("-");
      const info = (parsed.length > 3) ?  parsed.pop() : "";
      const date = parsed.join("-")

      return {
        filename: filename,
        date: date,
        info: info
      }
    }).reverse(),
    count: files.length
  })
}