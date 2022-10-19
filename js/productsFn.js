$(window).on("load", function() {
    $("#preloader").fadeOut("slow");
});

$(document).ready(function() {
    $('.selectbox').selectBox({
        mobile: true,
        menuSpeed: 'fast'
    });
    $('select[multiple].active.3col').multiselect({
        columns: 3,
        placeholder: 'Select Brands',
        search: true,
        searchOptions: {
            'default': 'Search Brands'
        },
        selectAll: true
    });
    // Init Smart Menu
    jQuery.SmartMenus.Bootstrap.init();
    $(".priceRange").slider({
        range: true,
        min: 0,
        max: 500,
        values: [0, 300],
        slide: function (event, ui) {
            $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
        }
    });
    $("#amount").val("$" + $(".priceRange").slider("values", 0) +
        " - $" + $(".priceRange").slider("values", 1));
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

    if ($(".enable_-_compare").hasClass("added")) {
        $(".enable_-_compare").on("click", function(event) {
            event.preventDefault();
            return false;
        });
    };
    


   
    $('body').on('click','.close-product',function(e){
        $('.portfolio-item').removeClass('current_item');
        $('.portfolio_details').slideUp('slow');
        $('#portfolio_details').slideUp('slow');
        return false;
    });

    /*-----------------------------------------------
        SHop 4 
    -------------------------------------------------*/
    // append dropdown sign
    $(".product-categories.type2 li a").each(function() {
        if($(this).next().is("ul.children")){
            $(this).append('<i class="fa fa-angle-right"></i>');
            if ( windowWidth.value < 768 ) {
                //change the dropdown icon, right arrow to down arrow
                $(this).children(".fa-angle-right").addClass("fa-angle-down");
            }
        }
    });

    $(".product-categories.type2 li a").on("click", function(event) {
        if ( windowWidth.value < 768 ) {
            if($(this).next().is(".children")){
                event.preventDefault();
                // slide down menu in mobile on click
                $(this).next("ul").slideToggle("slow")
            }
        }
    });


    $(".product-colors .color-options li").each(function() {
        //get the color from data-color
        var colorName = $(this).attr("data-color-name");

        $(this).children("span").css("background-color", colorName);
        $(this).on("click", function() {
            $(this).parent().children().removeClass("active");
            $(this).addClass("active");
            $(this).parents().eq(2).next(".product-sizes").addClass("active");
        });
        //$(this).parent().children().css("border-color", "transparent");
    });

    $(".product-colors .color-options li").on("click",function() {
       var colorName = $(this).attr("data-color-name");

        $(this).parent().children().css("border-color", "transparent");
        $(this).css("border-color", colorName);
    });

    $(".product-sizes .size-list li").on("click", function() {
        $(this).parent().children().removeClass("active");
        $(this).addClass("active");
        //$(this).parents().eq(2).next(".cart-btn").slideDown("slow");
        $(this).closest(".productItem").addClass("active");
    });

    $(".productItem .itemHover .closehover").on("click", function() {
        $(this).closest(".productItem").removeClass("active");
        $(this).parent(".itemHover").find(".color-options li").removeClass("active").removeAttr("style");
        $(this).parent(".itemHover").find(".product-sizes").removeClass("active");
        $(this).parent(".itemHover").find(".product-sizes li").removeClass("active");
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
        }, 1500, "easeInOutExpo")
    });
   

});


