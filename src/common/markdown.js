export default function(text) {
    console.log(text)
    return (text
        .replaceAll(/(```)[\s]*(((?!```)[\s\S])+)[\s]*(```)/g, "<pre><code>$2</code></pre>")
        .replaceAll(/(`)(((?!`).)+)(`)/g, "<code>$2</code>")
        .replaceAll(/(\*\*)(((?!\*\*).)+)(\*\*)/g, "<b>$2</b>")
        .replaceAll(/(\*)(((?!\*).)+)(\*)/g, "<i>$2</i>")
        .replaceAll(/(\_)(((?!\_).)+)(\_)/g, "<u>$2</u>")
    );
}