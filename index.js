'use strict';

const qs = require('querystring');
const got = require('got');

class Client {
	constructor(id, apiKey) {
		this.endpoint = 'https://www.googleapis.com';
		this.apiKey = apiKey;
		this.id = id;
	}

	search(query, options) {
		if (!query) {
			throw new TypeError('Expected a query');
		}

		return got(this.endpoint + '/customsearch/v1?' + this._buildOptions(query, options), {
			json: true
		}).then(this._buildResponse);
	}

	_buildOptions(query, options) {
		if (!options) {
			options = {};
		}

		var result = {
      cx: this.id,
      key: this.apiKey,
			q: query.replace(/\s/g, '+')
		};
		
		return qs.stringify(Object.assign(result, options));
	}

	_buildResponse(res) {
		return (res.body.items || []).map(function (item) {
			return {
				type: item.mime,
				width: item.image.width,
				height: item.image.height,
				size: item.image.byteSize,
				url: item.link,
				thumbnail: {
					url: item.image.thumbnailLink,
					width: item.image.thumbnailWidth,
					height: item.image.thumbnailHeight
				}
			};
		});
	}
}

module.exports = Client;
