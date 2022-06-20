
const collections_url = "./mock/collections.json";
const articles_urls = "./mock/articles.json";
var collectionsData;
async function getData() {
    // Fetch API Data
    const articlesResult = fetch(`${collections_url}`, { method: 'get' }) // FIRST API CALL
        .then(response => response.json()) // pass the response as promise to next then block
        .then(data => {                    // applpy logic to fetch collection type landing
            collectionsData = data.Collections.find(o => o.collectiontype === 'landing')
            const collectionId = collectionsData.collectionid;
            return fetch(`${articles_urls}#${collectionId}`); // SECOND API CALL to fetch articles and return a promise
        })
        .then(function (response) {
            if (response) {
                hideloader();   // hide loader text container
            }
            return response.json()
        })
        .catch(err => {
            console.error('Request failed', err)
        })

    articlesResult.then(ret => {
        const data = ret[collectionsData.collectionid]; // Get articles of elected collectionid
        show(data);                                     // render data in UI
    });
}

getData(); // Fetch data

function hideloader() { // hide loader text container
    document.getElementById('loading').style.display = 'none';
}

function show(articlesData) {
    // Process article data and render to UI.
    const articles = articlesData.map((article, index) => {
        return `<div class="article-wrapper article-col article-${ index }-wrapper">
                        <div class="article-content ${ article.intro ? '' : 'article-empty-content' }">
                            <div class="article-media">
                                <img src="${ article.imageURL }" />
                            </div>
                            <div class="article-text">
                                <div class="heading">
                                    <span class="publiched-clock icon icon-title"></span>
                                    ${ article.title }
                                </div>
                                <div class="content">
                                <span class="intro-text caps-on ${ index % 2 == 0 ? 'odd-intro' : 'even-intro' }"">${ article.intro }</span>
                                <span class="main-text">${ article.content }</span>
                                </div>
                            </div>
                        </div>
                        <div class="article-footer">
                            <span class="publiched-clock icon icon-clock"></span>
                            <span class="published-timer">${ article.published }h</span>
                            <span class="published-comments icon icon-speach-bubble"></cpan>
                        </div>
                        <div class="divider-line"></div>
                        </div>`
    }).join('');

    document.getElementById("content_wrapper").innerHTML = articles;    // insert data to content wrapper
}
