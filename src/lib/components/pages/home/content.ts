import type { TranslationKey } from '#lib/i18n/index.js';

export const features = [
	{
		number: '01',
		titleKey: 'home.features.overview.title',
		descriptionKey: 'home.features.overview.description'
	},
	{
		number: '02',
		titleKey: 'home.features.nextMove.title',
		descriptionKey: 'home.features.nextMove.description'
	},
	{
		number: '03',
		titleKey: 'home.features.sync.title',
		descriptionKey: 'home.features.sync.description'
	}
] as const satisfies readonly {
	number: string;
	titleKey: TranslationKey;
	descriptionKey: TranslationKey;
}[];

export const plans = [
	{
		id: 'starter',
		nameKey: 'home.pricing.starter.name',
		price: 0,
		periodKey: 'home.pricing.month',
		descriptionKey: 'home.pricing.starter.description',
		featureKeys: [
			'home.pricing.starter.feature1',
			'home.pricing.starter.feature2',
			'home.pricing.starter.feature3'
		],
		featured: false
	},
	{
		id: 'team',
		nameKey: 'home.pricing.team.name',
		price: 24,
		periodKey: 'home.pricing.seatMonth',
		descriptionKey: 'home.pricing.team.description',
		featureKeys: [
			'home.pricing.team.feature1',
			'home.pricing.team.feature2',
			'home.pricing.team.feature3'
		],
		featured: true
	},
	{
		id: 'scale',
		nameKey: 'home.pricing.scale.name',
		price: null,
		periodKey: null,
		descriptionKey: 'home.pricing.scale.description',
		featureKeys: [
			'home.pricing.scale.feature1',
			'home.pricing.scale.feature2',
			'home.pricing.scale.feature3'
		],
		featured: false
	}
] as const satisfies readonly {
	id: string;
	nameKey: TranslationKey;
	price: number | null;
	periodKey: TranslationKey | null;
	descriptionKey: TranslationKey;
	featureKeys: readonly TranslationKey[];
	featured: boolean;
}[];

export const testimonials = [
	{
		id: 'lead',
		quoteKey: 'home.stories.lead.quote',
		roleKey: 'home.stories.lead.role',
		initialsKey: 'home.stories.lead.initials'
	},
	{
		id: 'operations',
		quoteKey: 'home.stories.operations.quote',
		roleKey: 'home.stories.operations.role',
		initialsKey: 'home.stories.operations.initials'
	}
] as const satisfies readonly {
	id: string;
	quoteKey: TranslationKey;
	roleKey: TranslationKey;
	initialsKey: TranslationKey;
}[];
