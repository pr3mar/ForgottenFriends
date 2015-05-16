/**
 * Created by pr3mar on 16.05.2015.
 */
//This is called with the results from from FB.getLoginStatus().
$(document).ready(function() {
    $.ajaxSetup({ cache: true });
    $.getScript('//connect.facebook.net/en_US/sdk.js', function(){
        FB.init({
            appId: '456455124529286',
            version: 'v2.3', // or v2.0, v2.1, v2.0
            cookie:true,
            xfbml:true
        });
        $('#loginbutton,#feedbutton').removeAttr('disabled');
        checkLoginState(initializeData);
    });
});
function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
        // Logged into your app and Facebook.
        //initializeData();
        return true;
    } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
        document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
        document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
    return false;
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState(func) {
    FB.getLoginStatus(function(response) {
        if(statusChangeCallback(response)) {
            func();
        }
    });
}


// Load the SDK asynchronously
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function initializeData() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
        console.log('Successful login for: ' + response.name);
        document.getElementById('navbar').innerHTML =
            '<form class="navbar-form navbar-right" style="color: #CCCCCC">' + response.name + '</form>';
        document.getElementById('calculate').innerHTML =
            ' <p><a class="btn btn-default" role="button" id="calculate">Calculate &raquo;</a></p>';
    });
}

$("#calculate").click(function(){
    console.log('Welcome!  Fetching your information.... ');
    var d = new Date();
    d.setMonth(d.getMonth() - 3);
    FB.api('/me/posts',{'since': d.getTime(),'limit': '500'}, function(response) {
        var ids = {};
        for(el in response.data) {
            try {
                var likes = response.data[el].likes.data;
                for (person in likes) {
                    console.log(likes[person]);
                    if (likes[person].name in ids) {
                        ids[likes[person].name] += 1;
                        //ids[likes[person].id] += 1;
                    } else {
                        ids[likes[person].name] = 1;
                        //ids[likes[person].id] = 1;
                    }
                }
            } catch(e) {
                console.log("error: ", e);
            }
        }
        console.log("ids:", ids);
    });
});
