<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import type { PublicUser } from '#lib/features/auth/schema.js';
	import { useLocale } from '#lib/i18n/context.js';
	import { t } from '#lib/i18n/index.js';
	import { dashboardHref, loginHref } from '#lib/i18n/hrefs.js';
	import { roleLabelKeys } from './constants.js';

	type SessionUser = Pick<PublicUser, 'name' | 'role'>;
	type SessionState =
		{ status: 'loading' | 'guest' | 'error' } | { status: 'authenticated'; user: SessionUser };

	let session = $state<SessionState>({ status: 'loading' });
	let active = false;
	let latestRequest = 0;
	const currentLocale = useLocale();
	let locale = $derived(currentLocale());
	let isLoginRoute = $derived(page.route.id === '/login' || page.route.id === '/de/login');

	const refreshSession = async () => {
		const request = ++latestRequest;
		session = { status: 'loading' };
		try {
			const response = await fetch(resolve('/api/session'), {
				credentials: 'same-origin',
				cache: 'no-store'
			});
			if (!response.ok) throw new Error('Could not load the current session');
			const data = (await response.json()) as { user: SessionUser | null };
			if (!active || request !== latestRequest) return;
			session = data.user ? { status: 'authenticated', user: data.user } : { status: 'guest' };
		} catch {
			if (active && request === latestRequest) session = { status: 'error' };
		}
	};

	onMount(() => {
		active = true;
		void refreshSession();
		const handlePageShow = (event: PageTransitionEvent) => {
			if (event.persisted) void refreshSession();
		};
		window.addEventListener('pageshow', handlePageShow);
		return () => {
			active = false;
			latestRequest += 1;
			window.removeEventListener('pageshow', handlePageShow);
		};
	});
</script>

<div class="flex items-center gap-3" aria-live="polite">
	{#if session.status === 'authenticated'}
		<span
			class="flex max-w-28 flex-col text-xs leading-tight sm:max-w-36"
			title={session.user.name}
		>
			<span class="truncate font-bold text-foreground">{session.user.name}</span>
			<span class="text-muted">{t(locale, roleLabelKeys[session.user.role])}</span>
		</span>
		<a
			href={dashboardHref(locale)}
			class="rounded-control border border-border-strong px-3 py-1.5 text-xs font-bold text-foreground transition-colors hover:border-accent hover:bg-surface-raised"
			>{t(locale, 'nav.dashboard')}</a
		>
	{:else if session.status === 'guest'}
		<a
			href={loginHref(locale)}
			aria-current={isLoginRoute ? 'page' : undefined}
			class={`rounded-control border border-border-strong px-3 py-1.5 text-xs font-bold transition-colors hover:border-accent hover:text-foreground ${isLoginRoute ? 'bg-surface-raised text-foreground' : 'text-muted'}`}
			>{t(locale, 'nav.login')}</a
		>
	{:else if session.status === 'error'}
		<button
			type="button"
			onclick={() => void refreshSession()}
			class="rounded-control border border-border-strong px-3 py-1.5 text-xs font-bold text-muted transition-colors hover:border-accent hover:text-foreground"
			>{t(locale, 'nav.sessionRetry')}</button
		>
	{:else}
		<span
			class="inline-block h-8 w-20 animate-pulse rounded-control bg-surface-raised"
			aria-hidden="true"
		></span>
		<span class="sr-only">{t(locale, 'nav.sessionLoading')}</span>
	{/if}
</div>
