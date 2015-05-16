/**
 * Created by pr3mar on 16.05.2015.
 */
$(document).ready(function() {
    $.ajaxSetup({ cache: true });
    $.getScript('//connect.facebook.net/en_US/sdk.js', function(){
        FB.init({
            appId: '{your-app-id}',
            version: 'v2.3' // or v2.0, v2.1, v2.0
        });
        $('#loginbutton,#feedbutton').removeAttr('disabled');
        FB.getLoginStatus(updateStatusCallback);
    });
});