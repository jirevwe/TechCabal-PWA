(function () {

    let cacheArticles = (callback) => { 
        let latest = 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty';
        let number = 20;
        let placeHolders = '';
        let sequence = Promise.resolve();

        fetch(latest)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            idbKeyval.set('topstories', response)
            .then(() => {
                console.log('[CACHE] topstories saved');
                response.forEach(function(element) {
                    sequence = fetch('https://hacker-news.firebaseio.com/v0/item/' + element + '.json?print=pretty')
                    .then((all_responses) => {
                        return all_responses.json();
                    })
                    .then((hn_item) => {
                        idbKeyval.get(''+hn_item.id)
                        .then((result) => {
                            if(result == undefined){
                                idbKeyval.set(''+hn_item.id, hn_item)
                                .then(() => {
                                    console.log('[CACHE] ' + hn_item.id + ' saved');
                                });
                            }
                        }).catch((err) => {
                            console.log('[ERROR SAVING DATA] => \n', err);
                        });
                    })
                    .catch((error) => {
                        console.log('[HN ITEM FETCH ERROR] Error Fetching HN Item From Hacker News API => \n', error);        
                    });
                });
            });
            return callback();
        })
        .catch((error) => {
            console.log('[HN LIST FETCH ERROR] Error Fetching Data From Hacker News API => \n', error);
        });
    };

    let fetchCachedArticles = () => { 
        let number = 20;
        let placeHolders = '';
        let sequence = Promise.resolve();

        idbKeyval.get('topstories')
        .then((topstories) => {
            if (topstories){
                topstories.forEach((hn_item) => {
                    sequence = sequence.then(() => {
                        idbKeyval.get(''+hn_item)
                        .then((result) => {
                            placeHolders += '<tr class="athing" id="' + result.id +'">' +
                                '<td align="right" valign="top" class="title"></td>'+
                                '<td valign="top" class="votelinks">' +
                                '<center>' +
                                '<a id="up_' + result.id +'" href="vote?id=' + result.id +'&amp;how=up&amp;goto=news">' +
                                '<div class="votearrow" title="upvote" hidden></div>' +
                                '</a>' +
                                '</center>' +
                                '</td>' +
                                '<td class="title"><a href="' + result.url +'"' +
                                'class="storylink">' + result.title +'</a>' +
                                // '<span class="sitebit comhead"> (<a href="from?site=modzero.ch"><span class="sitestr">modzero.ch</span></a>)</span>'+
                                '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td colspan="2"></td>' +
                                '<td class="subtext">' +
                                '<span class="score" id="score_' + result.id +'">' + result.score +' points</span> by user1' +
                                '<span class="age">' + result.time +'</span>|' +
                                '<a href="item?id=' + result.id +'">23&nbsp;comments</a> </td>' +
                                '</tr>' +
                                '<tr class="spacer" style="height:5px"></tr>';
                            $('#yc-table').append(placeHolders);
                        }).catch((err) => {
                            console.log('[ERROR SAVING DATA] => \n', err);
                        });
                    });
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