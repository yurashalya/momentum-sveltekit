<script lang="ts">
	import Container from '#lib/components/ui/Container.svelte';
</script>

<svelte:head>
	<title>Momentum — SvelteKit foundation</title>
	<meta
		name="description"
		content="Momentum: SvelteKit foundation for a fast public site and an interactive dashboard."
	/>
</svelte:head>

<main id="main" class="flex min-h-screen flex-col justify-center py-section">
	<Container>
		<p class="mb-5 text-sm font-semibold uppercase tracking-widest text-accent">Momentum</p>
		<h1 class="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
			A solid start for the product.
		</h1>
		<p class="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
			The SvelteKit foundation is ready. The public experience and dashboard will be built on shared
			design tokens, validated mock data, and route-specific rendering.
		</p>
		<div class="mt-10 rounded-card border border-border bg-surface p-6">
			<p class="text-sm font-medium">Project setup</p>
			<p class="mt-2 text-sm text-muted">
				Svelte 5 · TypeScript · Tailwind CSS · Vitest · Playwright
			</p>
		</div>
	</Container>
</main>
