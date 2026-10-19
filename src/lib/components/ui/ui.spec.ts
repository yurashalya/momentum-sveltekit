import { describe, expect, it } from 'vitest';
import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import Button from './Button.svelte';
import Dialog from './Dialog.svelte';

const content = (html: string) => createRawSnippet(() => ({ render: () => html }));

describe('UI primitives', () => {
	it('keeps a loading button labelled while blocking submission', () => {
		const { body } = render(Button, {
			props: { children: content('Save changes'), type: 'submit', loading: true }
		});
		expect(body).toContain('Save changes');
		expect(body).toContain('aria-busy="true"');
		expect(body).toMatch(/<button[^>]*disabled/);
	});

	it('gives a dialog a visible title, description and close control', () => {
		const { body } = render(Dialog, {
			props: {
				id: 'confirm-rename',
				title: 'Rename campaign',
				description: 'This changes the campaign name.',
				children: content('<p>Campaign details</p>')
			}
		});
		expect(body).toContain('aria-labelledby="confirm-rename-title"');
		expect(body).toContain('aria-describedby="confirm-rename-description"');
		expect(body).toContain('id="confirm-rename-title"');
		expect(body).toContain('Campaign details');
		expect(body).toContain('aria-label="Close dialog"');
	});
});
