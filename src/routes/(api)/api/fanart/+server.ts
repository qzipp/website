import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { readdir } from "node:fs/promises";

const files = await readdir("static/fanart");
files.sort();

export const GET: RequestHandler = async () => {
	return json({
    files: files,
    count: files.length
  })
}