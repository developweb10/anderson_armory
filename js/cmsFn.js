$(window).on("load", function() {
    $("#preloader").fadeOut("slow");
    
});
$(document).ready(function() {
   
    $(".pix_sc_slider1").flexslider({
        animation: "slide",
        controlNav: true,
        directionNav:false
    });
    $('body').on("click", ".slide-top .hide-top", function() {
        $(".header-top").slideToggle();
        $("i", this).toggleClass("fa-angle-up fa-angle-down");
    });    
    $(window).scroll(function () {
        if ($(window).scrollTop() > 400) {
            $("#go-top").fadeIn(500)
        } else {
            $("#go-top").fadeOut(500)
        }
    });
   

});