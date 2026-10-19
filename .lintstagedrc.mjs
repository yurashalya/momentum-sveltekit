export default {
	'*.{js,cjs,mjs,ts,svelte}': ['prettier --write', 'eslint --fix'],
	'*.{css,html,json,md,yaml,yml}': ['prettier --write']
};
