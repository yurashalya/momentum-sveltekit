const supported = new Set(['en', 'de']);

const handler = (request) => {
	const preferred = request.headers.get('accept-language') ?? '';
	const locale =
		preferred
			.split(',')
			.map((part, index) => {
				const [tag, ...parameters] = part.trim().split(';');
				const quality = Number(
					parameters
						.find((value) => value.trim().startsWith('q='))
						?.trim()
						.slice(2) ?? '1'
				);
				return {
					locale: tag.trim().toLowerCase().split('-')[0],
					quality: Number.isFinite(quality) ? quality : 0,
					index
				};
			})
			.filter(({ quality }) => quality > 0 && quality <= 1)
			.sort((a, b) => b.quality - a.quality || a.index - b.index)
			.find(({ locale: value }) => supported.has(value))?.locale ?? 'en';
	return Response.json(
		{ locale },
		{ headers: { 'cache-control': 'public, max-age=0, s-maxage=3600', vary: 'Accept-Language' } }
	);
};

export default handler;
