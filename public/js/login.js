

$(document).ready(function () {
    //  console.log('hhhhhhhhhh', $(".fab fa-facebook-square"))

    console.log('user', userId);
    $("#fblogin").click(function () {
        window.fbAsyncInit = function () {
            FB.init({
                appId: FBID,
                cookie: true,
                xfbml: true,
                version: 'v3.2'
            });

            FB.AppEvents.logPageView();
            FB.getLoginStatus(function (response) {
                statusChangeCallback(response);
            });

        };
        function statusChangeCallback(response) {
            if (response.status === 'connected') {
                console.log('already have an account');
            } else {
                fblogin()
            }

        }
        function fblogin() {
            FB.api("/me?fields=name,email", function (response) {
                console.log("response after login", response);
            });

        }
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    })
})