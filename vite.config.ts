import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	preview: {
		allowedHosts: ["qzip.nyanlabs.men", "qzip.tc-labs.win", "qzip.gay"]
	}
});
