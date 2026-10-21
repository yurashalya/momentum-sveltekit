<script lang="ts">
	import { untrack } from 'svelte';
	import PublicFooter from '#lib/components/layout/PublicFooter.svelte';
	import PublicHeader from '#lib/components/layout/PublicHeader.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Card from '#lib/components/ui/Card.svelte';
	import Container from '#lib/components/ui/Container.svelte';
	import Heading from '#lib/components/ui/Heading.svelte';
	import Input from '#lib/components/ui/Input.svelte';
	import { LOGIN_FIELD_MAX_LENGTH } from '#lib/features/auth/constants.js';
	import { loginSchema } from '#lib/features/auth/schema.js';
	import { loginFieldErrors, type LoginFieldErrors } from '#lib/features/auth/validation.js';
	import { useLocale } from '#lib/i18n/context.js';
	import { t } from '#lib/i18n/index.js';

	type FormData = {
		email?: string;
		errors?: LoginFieldErrors;
		invalidCredentials?: boolean;
	};

	const passwordErrorKeys = {
		required: 'login.passwordRequired',
		tooLong: 'login.passwordTooLong',
		whitespace: 'login.passwordNoSpaces'
	} as const;

	let { form }: { form: FormData | null | undefined } = $props();
	const currentLocale = useLocale();
	let locale = $derived(currentLocale());
	let email = $state(untrack(() => form?.email ?? ''));
	let password = $state('');
	let edited = $state(false);
	let emailTouched = $state(false);
	let passwordTouched = $state(false);
	let submitting = $state(false);
	let parsedInput = $derived(loginSchema.safeParse({ email, password }));
	let fieldErrors = $derived(parsedInput.success ? {} : loginFieldErrors(parsedInput.error.issues));
	let emailError = $derived(
		(emailTouched ? fieldErrors.email : form?.errors?.email)
			? t(locale, 'login.emailInvalid')
			: undefined
	);
	let passwordErrorCode = $derived(passwordTouched ? fieldErrors.password : form?.errors?.password);
	let passwordError = $derived(
		passwordErrorCode ? t(locale, passwordErrorKeys[passwordErrorCode]) : undefined
	);

	const markTouched = (field: 'email' | 'password') => {
		if (field === 'email') emailTouched = true;
		else passwordTouched = true;
	};

	const handleInput = (field: 'email' | 'password') => {
		markTouched(field);
		edited = true;
		submitting = false;
	};

	const validate = (event: SubmitEvent) => {
		const parsed = loginSchema.safeParse({ email, password });
		if (!parsed.success) {
			event.preventDefault();
			emailTouched = true;
			passwordTouched = true;
			submitting = false;
			return;
		}
		submitting = true;
	};
</script>

<svelte:head>
	<title>{t(locale, 'login.title')} — Momentum</title>
	<meta name="description" content={t(locale, 'login.seo.description')} />
	<meta name="robots" content="noindex,follow" />
</svelte:head>

<div id="top" class="flex min-h-screen flex-col bg-canvas text-foreground">
	<PublicHeader />
	<main id="main" class="relative flex flex-1 items-center overflow-hidden py-section">
		<div
			aria-hidden="true"
			class="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-accent/10 blur-[100px]"
		></div>
		<Container
			class="relative grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-20"
		>
			<div>
				<p class="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-accent">
					{t(locale, 'login.eyebrow')}
				</p>
				<Heading level={1}>{t(locale, 'login.title')}</Heading>
				<p class="mt-6 max-w-xl text-lg leading-relaxed text-muted">{t(locale, 'login.intro')}</p>
				<div class="mt-10 max-w-lg rounded-card border border-border/70 bg-surface-muted/60 p-card">
					<p class="text-caption font-bold text-foreground">{t(locale, 'login.demoTitle')}</p>
					<p class="mt-2 text-caption text-muted">{t(locale, 'login.demoHint')}</p>
					<p class="mt-5 font-mono text-caption text-accent">
						editor@demo.test <span class="text-muted">/</span> demo1234
					</p>
				</div>
			</div>
			<Card variant="featured" class="w-full max-w-xl lg:ml-auto">
				<form method="POST" novalidate onsubmit={validate} class="grid gap-5">
					<Heading level={2} class="text-subheading">{t(locale, 'login.formTitle')}</Heading>
					<Input
						id="login-email"
						name="email"
						type="email"
						autocomplete="username"
						maxlength={LOGIN_FIELD_MAX_LENGTH.email}
						required
						label={t(locale, 'login.email')}
						bind:value={email}
						error={emailError}
						oninput={() => handleInput('email')}
						onblur={() => markTouched('email')}
					/>
					<Input
						id="login-password"
						name="password"
						type="password"
						autocomplete="current-password"
						maxlength={LOGIN_FIELD_MAX_LENGTH.password}
						required
						label={t(locale, 'login.password')}
						hint={t(locale, 'login.passwordHint')}
						bind:value={password}
						error={passwordError}
						oninput={() => handleInput('password')}
						onblur={() => markTouched('password')}
					/>
					{#if !edited && form?.invalidCredentials}
						<p
							role="alert"
							class="rounded-control border border-danger/40 bg-danger-soft px-4 py-3 text-caption text-danger"
						>
							{t(locale, 'login.error')}
						</p>
					{/if}
					<Button type="submit" loading={submitting} class="mt-1 w-full"
						>{t(locale, 'login.submit')}</Button
					>
				</form>
			</Card>
		</Container>
	</main>
	<PublicFooter />
</div>
