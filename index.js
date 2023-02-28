
const maxlen = 1200;
const topics = ['culture', 'entertainment', 'ethics', 'history', 'nature', 'philosophy', 'technology'];

function createArticle(title, paragraphs) {
    let text = "";
    for (p of paragraphs) {
        if (text.length < maxlen) {
            let cleaned = p.textContent.replaceAll(/\[\d+\]/g, '');
            text += cleaned + " ";
        }
    }
    $("#article-title").text(title);
    if (text.length > maxlen) text = text.slice(0, maxlen) + "...";
    $("#quote").text(text);
    return text;
}

$(document).ready(function () {
    // Choose topic based on day
    const d = new Date();
    let dayOfWeek = d.getDay();
    let topic = topics[dayOfWeek];
    $('#cat').text(topic);


    $.ajax({
        type: "GET",
        url: `https://en.wikipedia.org/wiki/Special:RandomInCategory/${topic}`,
        success: function (data) {
            let test = $(data);
            let paragraphs = test.find("p");

            if (paragraphs.length <= 5) {
                // We have a list of stuff :(
                let list = test.find("li a")
                list = list.filter((x) => list[x].getAttribute("href").startsWith("/wiki/") && !list[x].getAttribute("href").includes(":"));
                let selection = list[Math.floor(Math.random() * list.length-1)];
                let link = "https://en.wikipedia.org" + selection.getAttribute("href");
                $.ajax({
                    type: "GET",
                    url: link,
                    success: function (data) {
                        let test = $(data);
                        let paragraphs = test.find("p");
                        let title = test.find("h1 span.mw-page-title-main");
                        createArticle(title.text(), paragraphs);
                    }
                  });
            }
            else {
                let title = test.find("h1 span.mw-page-title-main");
                createArticle(title.text(), paragraphs);
            }
        }
      });
});

$('.quote').mouseup(function(){
    var span = document.createElement("span");
    span.className = "blacked-out";
    
    if (window.getSelection) {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var range = sel.getRangeAt(0).cloneRange();
            range.surroundContents(span);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
});