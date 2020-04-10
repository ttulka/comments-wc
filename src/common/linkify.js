export default function(text) {
    if (text) {
        return text.replace(/(https?:\/\/[^\s)("<>]+)/g,
                            url => '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + url + '</a>');
    }
}