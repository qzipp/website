import { mdsvex } from 'mdsvex';
import adapter from "svelte-adapter-bun";
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: [vitePreprocess(), mdsvex()],
	kit: { 
		adapter: adapter(),
		alias: {
			"$src/*": "./src/*",
			"$components/*": "./src/lib/components/*",
			"$transitions/*": "./src/lib/transitions/*",
			"$executables/*": "./src/lib/components/executables/*",
			"$stores/*": "./src/lib/stores/*",
			"$types/*": "./src/lib/types/*",
			"$utils/*": "./src/lib/utils/*",
		}
	},
	extensions: ['.svelte', '.svx']
};

export default config;
