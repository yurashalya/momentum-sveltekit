export const CAMPAIGN_SORT = {
	NAME: 'name',
	BUDGET: 'budget',
	UPDATED_AT: 'updatedAt'
} as const;

export const SORT_DIRECTION = {
	ASC: 'asc',
	DESC: 'desc'
} as const;

export const CAMPAIGN_LIST_DEFAULTS = {
	QUERY: '',
	FILTER: 'all',
	SORT: CAMPAIGN_SORT.UPDATED_AT,
	DIRECTION: SORT_DIRECTION.DESC,
	PAGE: 1
} as const;

export const CAMPAIGN_PAGE_SIZE = 20;
