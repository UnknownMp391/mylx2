import { snackbar } from 'mdui/functions/snackbar.js'
import { alert } from 'mdui/functions/alert.js';

function mduiSnackbar(message) {
	snackbar({
		message: message,
	})
}

function mduiAlert(title,desc,callback = null,confirmText = "OK") {
	alert({
		headline: title,
		description: desc,
		confirmText: confirmText,
		closeOnOverlayClick: true,
		closeOnEsc: true,
		onConfirm: () => { if (callback) callback() }
	})
}

function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&")
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=")
        if(pair[0] == variable){return pair[1]}
    }
    return(null);
}

const escapeHtml = (text) =>
    text
      .replace(/&/g, "&amp;") // 转义 &
      .replace(/</g, "&lt;") // 转义 <
      .replace(/>/g, "&gt;") // 转义 >
      .replace(/"/g, "&quot;") // 转义 "
      .replace(/'/g, "&#39;"); // 转义 '

function escapeAndFormatText(input) {
  // 防止 XSS 攻击，转义 HTML 特殊字符

  // 转义文本
  let escapedText = escapeHtml(input);

  // 替换空格为 `&nbsp;`
  escapedText = escapedText.replace(/ /g, "&nbsp;");

  // 替换制表符为 4 个空格
  escapedText = escapedText.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");

  // 替换换行符为 `<br>`
  escapedText = escapedText.replace('\n', "<br/>");
  escapedText = escapedText.replace('\r', "<br/>");

  return escapedText;
}

function getCookie(name) {
	const cookieArr = document.cookie.split(";")
	for (let i = 0; i < cookieArr.length; i++) {
		const cookiePair = cookieArr[i].trim()
		if (cookiePair.startsWith(name + "=")) {
			return cookiePair.substring(name.length + 1);
		}
  }
  return null;
}

function setCookie(name, value, days = 3650) {
	var expires = ""
	if (days) {
		var date = new Date()
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toUTCString()
	}
	document.cookie = name + "=" + value + expires + "; path=/";
}


function objectToQueryString(obj, parentKey = '') {
	const parts = []
	for (let key in obj) {
		if (!Object.prototype.hasOwnProperty.call(obj, key)) continue
		let value = obj[key]
		let newKey = parentKey ? `${parentKey}[${key}]` : key
		if (typeof value === 'object' && value !== null) {
			parts.push(objectToQueryString(value, newKey))
		} else {
			parts.push(encodeURIComponent(newKey) + '=' + encodeURIComponent(value))
		}
	}
	return parts.join('&')
}

function formatUnixTimestamp(unixTimestamp, timeZone) {
    const date = new Date(unixTimestamp * 1000); // 将 UNIX 时间戳转换为毫秒
    const options = {
        timeZone: timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone, // 使用指定时区或浏览器本地时区
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // 24小时制
    };

    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(date);

    const formatMap = {};
    parts.forEach(({ type, value }) => {
        formatMap[type] = value;
    });

    return `${formatMap.year}-${formatMap.month}-${formatMap.day} ${formatMap.hour}:${formatMap.minute}:${formatMap.second}`;
}

export { mduiSnackbar, mduiAlert, getQueryVariable, escapeAndFormatText, setCookie, getCookie, objectToQueryString, formatUnixTimestamp }
