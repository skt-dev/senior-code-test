
const collections_url = "./mock/collections.json";
const articles_urls = "./mock/articles.json";
let collectionsData = "";

const getCollections = async () => {
    // Fetch Collections Data
    return fetch(`${collections_url}`, { method: 'get' }) // FIRST API CALL
        .then(response => {
            if (response.ok) {          // returns true if the response returned
                return response.json(); // pass the response as promise
            } else {                    // Failed
                setUserMessage("Some error occured");
            }
        }) // pass the response as promise
        .catch(err => {
            console.error('Request failed', err);
        })
}
const getArticles = async (collectionId) => {
    // Fetch Articles Data
    return fetch(`${articles_urls}#${collectionId}`) // SECOND API CALL to fetch articles and return a promise
        .then((response) => {
            if (response.ok) {          // returns true if the response returned
                return response.json(); // pass the response as promise
            } else {                    // Failed
                setUserMessage("Some error occured");
            }
        })
        .catch(err => {
            console.error('Request failed', err);
        })
}

const collectionsPromise = getCollections(); // Fetch data
collectionsPromise.then(data => {                    // applpy logic to fetch collection type landing
    if (data && data.Collections) {
        collectionsData = data.Collections.find(o => o.collectiontype === 'landing');
        const collectionId = collectionsData.collectionid;
        const articlesPromise = getArticles(collectionId); // Fetch data
        articlesPromise.then(ret => {
            if (ret) {
                const data = (collectionsData && collectionsData.collectionid) ? ret[collectionsData.collectionid] : ''; // Get articles of elected collectionid
                show(data);     // render data in UI
                hideloader();   // hide loader text container
            } else {
                setUserMessage("Some error occured");
            }
        });
    }
});

// hide loader text container
const hideloader = () => document.getElementById('loading').style.display = 'none';

const setUserMessage = (message) => document.getElementById('loading').innerHTML = message;

const show = (articlesData) => {
    // Process article data and render to UI.
    let article = `<div class="article-wrapper article-col article-0-wrapper">No Data</div>`
    if (articlesData) {
        articles = articlesData.map((article, index) => {
            return `<div class="article-wrapper article-col article-${index}-wrapper">
                            <div class="article-content ${article.content ? '' : 'article-empty-content'}">
                                <div class="article-media">
                                    <img src="${article.imageURL}" />
                                </div>
                                <div class="article-text">
                                    <div class="heading">
                                        <span class="publiched-clock icon icon-title"></span>
                                        ${article.title}
                                    </div>
                                    <div class="content">
                                    <span class="intro-text caps-on ${article.intro ? (index == 0 ? 'red-intro' : 'blue-intro') : ''}"">${article.intro}</span>
                                    <span class="main-text">${article.content}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="article-footer">
                                <span class="publiched-clock icon icon-clock"></span>
                                <span class="published-timer">${article.published}h</span>
                                <span class="published-comments icon icon-speach-bubble"></cpan>
                            </div>
                            <div class="divider-line"></div>
                            </div>`
        }).join('');
    }

    document.getElementById("content_wrapper").innerHTML = articles;    // append data to content wrapper
}
