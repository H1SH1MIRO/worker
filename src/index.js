addEventListener('fetch', event => {
	event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
	const originalUrl = new URL(request.url);

	// Мы не убираем /vods, так как структура бакета, похоже, содержит эту папку
	let pathname = originalUrl.pathname;

	// Формируем URL для origin в virtual-hosted стиле
	const originUrl = `https://vods.s3w.firstvds.ru${pathname}${originalUrl.search}`;

	// Копируем заголовки, НЕ трогаем Host
	const headers = new Headers(request.headers);
	// Явно задаем Host для корректной работы с S3
	headers.set('Host', 'vods.s3w.firstvds.ru');

	return fetch(originUrl, {
		method: request.method,
		headers: headers,
		redirect: 'follow',
		body: request.body,
		cf: {
			// resolveOverride: 'vods.s3w.firstvds.ru', 
			// cacheEverything: false,  // если видео не нужно кэшировать
		}
	});
}