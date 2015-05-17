/**
 * Created by pr3mar on 16.05.2015.
 */
$("#calculate").click(function(){
    console.log('Welcome!  Fetching your information.... ');
    var d = new Date();
    d.setMonth(d.getMonth() - 3);
    FB.api('/me/posts',{'since': d.toISOString(),'limit': '500'}, function(response) {
        var data = {};
        for(el in response.data) {
            try {
                var likes = response.data[el].likes.data;
                var comments = response.data[el].comments.data;
                for (person in likes) {
                    if (likes[person].name in data) {
                        data[likes[person].name][0] += 1;
                    } else {
                        data[likes[person].name] = [1, 0, Number.MAX_VALUE];
                    }
                }
                for (person in comments) {
                    if (comments[person].from.name in data) {
                        data[comments[person].from.name][1] += 1;
                    } else {
                        data[comments[person].from.name] = [0, 1, Number.MAX_VALUE];
                    }
                }
            } catch(e) {
                //console.log("undefined");
            }
        }
        //data = sortMapByValue(data);
        FB.api('/me', function(response){
            getMessages(data, response.id);
        });

    });
});

function sortMapByValue(map) {
    var tupleArray = [];
    for (var key in map) tupleArray.push([key, map[key]]);
    tupleArray.sort(function (a, b) { return a[1][2] - b[1][2] });
    return tupleArray;
}

function getMessages(data, me) {
    var d = new Date();
    d.setMonth(d.getFullYear() - 1);
    console.log("messages:")
    FB.api('/me/inbox',{/*'since': d.toISOString()*/'limit': '500'}, function(response) {
        for(i in response.data) {
            thread = response.data[i];
            for(j in thread.to.data) {
                //console.log(j, thread.to.data[j].name, thread.to.data[j].id, me);
                if(thread.to.data[j].name in data && thread.to.data[j].id != me) {
                    var tmp = (new Date().getTime()) - (new Date(response.data[i].updated_time)).getTime();
                    //console.log(thread.to.data[j].name, (new Date()).getTime(), (new Date(response.data[i].updated_time)).getTime(), tmp);
                    if(data[thread.to.data[j].name][2] > tmp) {
                        data[thread.to.data[j].name][2] = tmp;
                    }
                    //console.log(data[thread.to.data[j].name]);
                }
            }
        }
        data = sortMapByValue(data);
        for(i = 0; i < data.length; i++) {
            console.log(data[i][0], data[i][1][0], data[i][1][1], data[i][1][2])
        }
        criticalIndex = getCriticalIndex(data);
        printMoreThanWeek(data, criticalIndex);
        printDeletionProposal(data, criticalIndex);
    });
}

function getCriticalIndex(data) {
    for(i = 0; i < data.length; i++) {
        if(data[i][1][2] == Number.MAX_VALUE) {
            return i;
        }
    }
}

function printMoreThanWeek(data, criticalIndex) {

}

function printDeletionProposal(data, criticalIndex) {

}
