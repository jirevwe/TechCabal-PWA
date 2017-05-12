(function () {

    let cacheArticles = (callback) => { 
        let feed = 'https://api.rss2json.com/v1/api.json?rss_url=http://techcabal.com/feed/';
        let number = 20;
        let placeHolders = '';

        fetch(feed)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            idbKeyval.set('topstories', response)
            .then(() => {
                console.log('[CACHE] topstories saved');
            })
            .catch((error) => {
                console.log('[TC FETCH ERROR]\n', error);
            });
            return callback();
        })
        .catch((error) => {
            console.log('[TC LIST FETCH ERROR] \n', error);
        });
    };

    let fetchCachedArticles = () => { 
        let number = 20;
        let placeHolders = '';
        let sequence = Promise.resolve();

        idbKeyval.get('topstories')
        .then((topstories) => {
            if (topstories){
                topstories.items.forEach((item) => {
                    placeHolders += '<tr class="athing">' +
                        '<td align="right" valign="top" class="title"></td>'+
                        '<td valign="top" class="votelinks">' +
                        '<center>' +
                        '<a href="vote?id=&amp;how=up&amp;goto=news">' +
                        '<div class="votearrow" title="upvote" hidden></div>' +
                        '</a>' +
                        '</center>' +
                        '</td>' +
                        '<td class="title"><a href="' + item.link +'"' +
                        'class="storylink">' + item.title +'</a>' +
                        // '<span class="sitebit comhead"> (<a href="from?site=modzero.ch"><span class="sitestr">modzero.ch</span></a>)</span>'+
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td colspan="2"></td>' +
                        '<td class="subtext">' +
                        '<span class="score">points</span> by ' + item.author +
                        '<span class="age">' + item.pubDate +'</span>' +
                        // '<a href="item?id=' + item.id +'">23&nbsp;comments</a> </td>' +
                        '</tr>' +
                        '<tr class="spacer" style="height:5px"></tr>';
                    document.getElementById('yc-table').innerHTML = placeHolders;
                });
            }else{
                toast('Nothing has been cached yet');
            }
        });
    };

    if(navigator.onLine){
        cacheArticles(() => {
            fetchCachedArticles();
        });
    }
    else{
        fetchCachedArticles();
    }

    document.getElementById('butRefresh').addEventListener('click', function() {
        // Get fresh, updated data from GitHub whenever you are clicked
        toast('Fetching latest data...');
         if(navigator.onLine)
            cacheArticles();
        else
            fetchCachedArticles();
    });
})();