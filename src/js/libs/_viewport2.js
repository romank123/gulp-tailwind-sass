console.log('viewport false.js')
document.addEventListener("DOMContentLoaded", function(){

    resize_viewport ();

    function resize_viewport (){

        let view = document.getElementById('view');

        if (screen.width <= 384) {

            view.setAttribute('content', 'width=384, user-scalable=no');

        } else {

            view.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=no');
        }

    }

    window.addEventListener(`resize`, () => {

        resize_viewport ();


    });

});