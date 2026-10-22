/**
 * Utility functions for FeedSpider2
 */
var Utils = {
	/**
	 * Decodes HTML entities in a string
	 * Converts entities like &amp; &quot; &#39; etc. to their actual characters
	 * @param {string} html - The string containing HTML entities
	 * @return {string} The decoded string
	 */
	decodeHtmlEntities: function(html) {
		if (!html || typeof html !== 'string') {
			return html;
		}

		// Create a temporary element to leverage browser's HTML parsing
		var tempElement = document.createElement('div');
		tempElement.innerHTML = html;

		// Use textContent for modern browsers, innerText for older IE
		var decoded = tempElement.textContent || tempElement.innerText || '';

		// Clean up
		tempElement = null;

		return decoded;
	}
};
