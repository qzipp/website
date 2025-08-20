import { mdsvex } from 'mdsvex';
import adapter from "svelte-adapter-bun";
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: [vitePreprocess(), mdsvex()],
	kit: { 
		adapter: adapter(),
		alias: {
			"$src/*": "./src/*",
			"$transitions/*": "./src/lib/transitions/*",
			"$types/*": "./src/lib/types/*",
			"$utils/*": "./src/lib/utils/*",

			"$components/*": "./src/lib/components/*",
			"$std/*": "./src/lib/std/*",
			"$stores/*": "./src/lib/stores/*",
			"$applications/*": "./src/lib/components/applications/*",
		}
	},
	extensions: ['.svelte', '.svx']
};

export default config;
