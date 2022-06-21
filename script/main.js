
const collectionsUrl        = "./mock/collections.json";
const articlesUrls          = "./mock/articles.json";
const collectionTypeToLoad  = 'landing';
let collectionsData         = "";

const getCollections = () => {
    // Fetch Collections Data
    return fetch(`${collectionsUrl}`, { method: 'get' }) // FIRST API CALL
        .then(response => {
            return handleApiResponse(response);
        })
        .catch(err => {
            console.error('Request failed', err);
        })
}

const getArticles = (collectionId) => {
    // Fetch Articles Data
    return fetch(`${articlesUrls}#${collectionId}`) // SECOND API CALL to fetch articles and return a promise
        .then((response) => {
            return handleApiResponse(response);
        })
        .catch(err => {
            console.error('Request failed', err);
        })
}

const handleApiResponse = (response) => {
    if (response.ok) {          // returns true if the response returned
        return response.json(); // pass the response as promise
    } else {                    // Failed
        setUserMessage("Some error occured");
    }
}

const collectionsPromise = getCollections(); // Fetch data
collectionsPromise.then(data => {                    // applpy logic to fetch collection type landing
    if (data && data.Collections) {
        collectionsData = data.Collections.find(o => o.collectiontype === collectionTypeToLoad);
        if (collectionsData) {
            const collectionId = collectionsData.collectionid;
            const articlesPromise = getArticles(collectionId); // Fetch data
            articlesPromise.then(result => {
                if (result) {
                    const data = (collectionsData && collectionsData.collectionid) ? result[collectionsData.collectionid] : ''; // Get articles of elected collectionid
                    show(data);     // render data in UI
                    hideloader();   // hide loader text container
                } else {
                    setUserMessage("Some error occured");
                }
            });
        } else {
            setUserMessage("No Data available for"+ collectionTypeToLoad);
        }
    }
});

// hide loader text container
const hideloader = () => document.getElementById('loading').style.display = 'none';

const setUserMessage = (message) => document.getElementById('loading').innerHTML = message;

const show = (articlesData) => {
    // Process article data and render to UI.
    let articles = `<div class="article-wrapper article-col article-0-wrapper">No Data</div>`;
    if (articlesData) {
        articlesData.sort((a, b) => a.index - b.index); // to order articles based on the index value given
        articles = articlesData.map((article, index) => {
            return `<div class="article-wrapper article-col article-${index}-wrapper">
                        <div class="article-content ${article.content ? '' : 'article-empty-content'}">` +
                            generateTag({ tag: 'div', classList: 'article-media', innerContent: generateTag({ tag: 'img', src: article.imageURL }) }) + `
                            <div class="article-text">
                                <div class="heading">`+
                                    generateTag({ tag: 'span', classList: 'icon icon-title' }) + `
                                    ${article.title}
                                </div>
                                <div class="content">`+
                                    generateTag({ tag: 'span', classList: 'intro-text caps-on ' + (article.intro ? (index == 0 ? 'red-intro' : 'blue-intro') : 'empty'), innerContent: article.intro + `&nbsp;` }) +
                                    generateTag({ tag: 'span', classList: 'main-text', innerContent: article.content }) + `
                                </div>
                            </div>
                        </div>
                        <div class="article-footer">`+
                            generateTag({ tag: 'span', classList: 'icon icon-clock' }) +
                            generateTag({ tag: 'span', classList: 'published-timer', innerContent: article.published + 'h' }) +
                            generateTag({ tag: 'span', classList: 'icon icon-speach-bubble' }) + `
                        </div>`+
                        generateTag({ tag: 'div', classList: 'divider-line' }) + `
                    </div>`
        }).join('');
    }
    
    if (document.getElementById("content_wrapper")) {
        document.getElementById("content_wrapper").innerHTML = articles;    // append data to content wrapper
    }
};

const generateTag = ({ tag = '', classList = '', innerContent = '', src = '' }) => {
    // generic method which will generata html element and return as string
    const element = document.createElement(tag);
    if (classList) {
        element.classList.add(...classList.split(' '));
    }
    if (innerContent) {
        element.innerHTML = innerContent;
    }
    if (src) {
        element.src = src;
    }
    return element.outerHTML;
}
