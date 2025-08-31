import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { readdir } from "node:fs/promises";

const files = await readdir("static/fanart");
files.sort();

export const GET: RequestHandler = async () => {
	return json({
    files: files.map((filename) => {
      const [author, unique_garbage] = (() => { 
        const arr = filename.split("."); 
        arr.pop();
        return arr.join("."); // fixes a bug with author having a dot in the name
        // breaks the intended split 
      })().split("-");

      return {
        filename: filename,
        author: author,
      }
    }),
    count: files.length
  })
}