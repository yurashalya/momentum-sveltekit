import type { Metric } from 'web-vitals';

const endpoint = '/api/telemetry';
const sampleRate = 0.1;
let initialized = false;

const path = () => window.location.pathname.slice(0, 240);

const send = (event: Record<string, string | number>) => {
	try {
		const body = JSON.stringify({ ...event, path: path() });
		const blob = new Blob([body], { type: 'application/json' });
		if (navigator.sendBeacon?.(endpoint, blob)) return;
		void fetch(endpoint, {
			method: 'POST',
			body,
			headers: { 'content-type': 'application/json' },
			keepalive: true
		}).catch(() => {});
	} catch {
		// Reporting must never break navigation or the error boundary.
	}
};

const sampled = () => {
	try {
		const saved = sessionStorage.getItem('momentum-rum-sample');
		if (saved) return saved === 'yes';
		const selected = Math.random() < sampleRate;
		sessionStorage.setItem('momentum-rum-sample', selected ? 'yes' : 'no');
		return selected;
	} catch {
		return Math.random() < sampleRate;
	}
};

export const reportClientError = (
	error: unknown,
	source: 'boundary' | 'navigation' | 'window' | 'promise'
) => {
	const value = error instanceof Error ? error : new Error(String(error));
	send({
		kind: 'error',
		name: value.name.slice(0, 80) || 'Error',
		message: value.message.slice(0, 240),
		source
	});
};

export const initTelemetry = async () => {
	if (initialized) return;
	initialized = true;
	window.addEventListener('error', (event) =>
		reportClientError(event.error ?? event.message, 'window')
	);
	window.addEventListener('unhandledrejection', (event) =>
		reportClientError(event.reason, 'promise')
	);
	if (!sampled()) return;

	const { onCLS, onINP, onLCP, onTTFB } = await import('web-vitals');
	const report = (metric: Metric) =>
		send({
			kind: 'vital',
			name: metric.name,
			id: metric.id,
			value: metric.value,
			rating: metric.rating
		});
	onCLS(report);
	onINP(report);
	onLCP(report);
	onTTFB(report);
};
