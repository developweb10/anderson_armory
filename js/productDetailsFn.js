$(window).on('load', function () {
    $("#preloader").fadeOut("slow");
});
$(document).ready(function() {
    // Init Smart Menu
   jQuery.SmartMenus.Bootstrap.init();
    $('body').on("click", ".slide-top .hide-top", function() {
            $(".header-top").slideToggle();
            $("i", this).toggleClass("fa-angle-up fa-angle-down");
    });

    $("body").on("click", ".enable_-_compare", function(){
        var data = {
            id: $(this).closest(".chkProductID").attr("data-product-id")
        }
        // appear data product ID in compare button
        $(this).attr("data-product-id",data.id)
    });
     $(".flex-with-thumb").flexslider({
         animation: "slide",
         controlNav: false,
         animationLoop: false,
         slideshow: false,
         sync: ".slide-thumbs"
     });
    $(window).scroll(function () {
        if ($(window).scrollTop() > 400) {
            $("#go-top").fadeIn(500)
        } else {
            $("#go-top").fadeOut(500)
        }
    });
    $("#go-top").on('click', function () {
        $("html, body").stop().animate({
            scrollTop: 0
        }, 1500)
    });
});

