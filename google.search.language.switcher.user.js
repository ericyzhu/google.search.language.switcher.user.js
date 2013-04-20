// ==UserScript==
// @name        Google 搜索语言切换
// @namespace   google.search.language.switcher@mozest.org
// @description 随意切换 Google 搜索的语言。仅在 NCR 下做过测试。添加或修改语言需要编辑脚本的 lang 变量。
// @version     0.0.1.1
// @include     http*://*.google.tld/search?*
// @include     http*://*.google.tld/#*q=*
// @include     http*://*.google.tld/
// @include     http*://*.google.tld/webhp*
// @include     http*://*.google.tld/images?*
// @include     http*://*.google.tld/imghp*
// @exclude     http*://*.google.tld/s?*
// @grant       none
// ==/UserScript==

var lang =
{
	'zh-CN|zh-TW' : 'Search Chinese (Simplified) and Chinese (Traditional) pages',
	'zh-CN'       : 'Search Chinese (Simplified) pages',
	'zh-TW'       : 'Search Chinese (Traditional) pages',
	'ja'          : 'Search Japanese pages'
};

(function()
{
	// google
	var clickEvent = function (a){if(!window.google.j||!window.google.j.init||!window.google.j.xmi){a=a||window.event;for(a=a.target||a.srcElement;a&&"A"!=a.tagName;)a=a.parentNode;if(a&&a.href){var b=a.getAttribute("href",2);_.qba.test(b)&&(a.href=(0,_.Xj)(b))}}};

	function replaceOriginalFieldValue(aURL, aField, aNewValue)
	{
		if (aURL.indexOf('&' + aField + '=') < 0)
		{
			aURL += '&' + aField + '=' + aNewValue;
		}
		else
		{
			aURL += '&';
			aURL = aURL.replace(new RegExp('([\\?&]' + aField + '=)(.*?)&', 'g'), '$1' + aNewValue + '&');
			aURL = aURL.replace(/&+$/, '');
		}

		return aURL;
	}

	var func = function()
	{
		setTimeout(function()
		{
			var liIDs = ['lr_'];
			var ctrl = document.getElementById('lr_').parentNode;
			if ( ! ctrl)
			{
				return;
			}

			var originalURL;
			for (var i = 0; i < ctrl.childNodes.length; ++i)
			{
				var a = ctrl.childNodes[i].getElementsByTagName('a')[0];
				if (a && a.href)
				{
					originalURL = a.href;
					break;
				}
			}

			if ( ! originalURL)
			{
				originalURL = location.href;
			}

			for (var key in lang)
			{
				var url = originalURL;
				var keys = key.split('|')
				url = replaceOriginalFieldValue(url, 'lr', 'lang_' + keys.join('%7Clang_'))
				url = replaceOriginalFieldValue(url, 'tbs', 'lr:lang_1' + keys.join('%7Clang_1'))

				var liID = 'lr_lang_1' + keys.join('_lang_1');

				var li = document.getElementById(liID);
				if (li)
				{
					li.firstChild.href = url;
					li.addEventListener('click', clickEvent, false);
				}
				else
				{
					var a = document.createElement('a');
					a.classList.add('q');
					a.classList.add('qs');
					a.href = url;
					a.appendChild(document.createTextNode(lang[key]));

					var li = document.createElement('li');
					li.setAttribute('id', liID);
					li.classList.add('hdtbItm');
					li.appendChild(a);
					li.addEventListener('click', clickEvent, false);

					ctrl.appendChild(li);
				}

				liIDs.push(liID);
			}

			// 移除其它语言。
			for (var i = 0; i < ctrl.childNodes.length; ++i)
			{
				var li = ctrl.childNodes[i];
				if (li && li.id)
				{
					if (liIDs.indexOf(li.id) < 0)
					{
						li.parentNode.removeChild(li);
					}
				}
			}
		}, 500);
	};

	func();
	document.addEventListener('DOMNodeInserted', func, false);
})();