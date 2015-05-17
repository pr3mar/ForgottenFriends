/**
 * Created by pr3mar on 16.05.2015.
 */
$("#calculate").click(function(){
    console.log('Welcome!  Fetching your information.... ');
    var d = new Date();
    d.setMonth(d.getMonth() - 3);
    FB.api('/me', function(me){
        me = me.id;
        FB.api('/me/posts',{'since': d.toISOString(),'limit': '500'}, function(response) {
            var data = {};
            for(el in response.data) {
                try {
                    //var likes = response.data[el].likes.data;
                    var id = response.data[el].id;
                    //var comments = response.data[el].comments.data;
                    FB.api(id+"/likes", {"limit":200}, function(response) {
                        var likes = response.data;
                        for (person in likes) {
                            if (likes[person].name in data && likes[person].name != me) {
                                data[likes[person].name][0] += 1;
                            } else if(likes[person].name != me) {
                                data[likes[person].name] = [1, Number.MAX_VALUE, likes[person].id];
                            }
                        }
                    });
                    /*for (person in comments) {
                        if (comments[person].from.name in data) {
                            data[comments[person].from.name][1] += 1;
                        } else {
                            data[comments[person].from.name] = [0, 1, Number.MAX_VALUE];
                        }
                    }*/
                } catch(e) {
                    //console.log("undefined");
                }
            }
            //data = sortMapByValue(data);
            getMessages(data, me);
        });
    });
});

function sortMapByValue(map) {
    var tupleArray = [];
    for (var key in map) tupleArray.push([key, map[key]]);
    tupleArray.sort(function (a, b) { return a[1][1] - b[1][1] });
    return tupleArray;
}

function getMessages(data, me) {
    var d = new Date();
    d.setMonth(d.getFullYear() - 1);
    console.log("messages:");
    FB.api('/me/inbox',{/*'since': d.toISOString()*/'limit': '500'}, function(response) {
        //console.log(response);
        for(i in response.data) {
            thread = response.data[i];
            for(j in thread.to.data) {
                //console.log(j, thread.to.data[j].name, thread.to.data[j].id, me);
                if(thread.to.data[j].name in data && thread.to.data[j].id != me) {
                    var tmp = (new Date().getTime()) - (new Date(response.data[i].updated_time)).getTime();
                    //console.log(thread.to.data[j].name, (new Date()).getTime(), (new Date(response.data[i].updated_time)).getTime(), tmp);
                    if(data[thread.to.data[j].name][1] > tmp) {
                        data[thread.to.data[j].name][1] = tmp;
                    }
                    //console.log(data[thread.to.data[j].name]);
                }
            }
        }
        data = sortMapByValue(data);
        //console.log(data);
        criticalIndex = getCriticalIndex(data);
        var newData = [];
        for(i = 0; i < data.length; i++) {
            newData.push([]);
            newData[i].push(data[i][0]);
            newData[i].push(data[i][1][1] / data[i][1][0]);
            newData[i].push(data[i][1][2]);
            FB.api(newData[i][2]+"/picture", function (response) {
                newData[i].push(response.data.url);
            });
            //console.log(newData[i][1])
            //console.log(newData[i][0], newData[i][1], newData[i][2]);
        }
        console.log(newData);
        printMoreThanWeek(newData, criticalIndex);
        printDeletionProposal(newData, criticalIndex);

    });
}

function getCriticalIndex(data) {
    for(i = 0; i < data.length; i++) {
        if(data[i][1][1] == Number.MAX_VALUE) {
            return i;
        }
    }
}

function printMoreThanWeek(data, criticalIndex) {
    console.log(criticalIndex);
    document.getElementById("forgotten").innerHTML =
        '<table class="table table-striped"><thead><tr><td>Name</td><td>FB Link</td></tr></thead><tbody><tr><th>' + data[criticalIndex] + '</th></tr></tbody></table>';
    /*for(i = criticalIndex; i > (criticalIndex - 5); i--){
        document.getElementById("tabela-forgotten").innerHTML = '<tr><th>' + data[i] + '</th></tr>'
    }*/
}

function printDeletionProposal(data, criticalIndex) {

}
