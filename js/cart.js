'use strict'
let OPT_BILLING_ADDRESS = 0;
let Cart = (function() {
    let cookieName;

    function Cart(cookieName = 'dssf_cart') {
        this.cookieName = 'dssf_cart';
        this.readCookie = function() {
            return Cookies.getJSON(cookieName);
        }
    }

    function _switchCartButtons(status) {
        status = Number(status);
        var html = "<button class='btn btn-warning btn-buy-cart'><i class='fa fa-fw fa-shopping-cart'></i> GO TO CART</button>";
        if (status === 1) {
            html = "<button class='btn btn-info disabled'><i class='fa fa-fw fa-shopping-cart'></i> ADDING TO CART</button>";
        }
        $(".cart-btn-container").html(html);
    }

    Cart.prototype.showAlert = function(msg, type) {
        $(".alert-" + type).html(msg).show();
        setTimeout(function() {
            $(".alert-" + type).hide();
        }, 10000);
    }

    Cart.prototype.addPart = function(part) {
        let cart = this.readCookie();
        let products = {};
        if (typeof cart !== 'undefined') {
            products = cart;
        }
        if (part.gc_unique_id) {
            products[part.gc_unique_id] = part;
        } else {
            products[part.uuid] = part;
        }
        this.setCookie(products);
        _switchCartButtons(3);
        this.showAlert('Product added To Cart', 'info');
    }

    Cart.prototype.removePart = function(uuid) {
        let cart = this.readCookie();
        if (uuid in cart) {
            delete cart[uuid];
            this.setCookie(cart);
            this.checkCart();
            return true;
        }
        return false;
    }

    Cart.prototype.updatePart = function(part) {
        let uuid = part.uuid;
        let cart = this.readCookie();
        if (part.part_type == "GiftCertificate") {
            uuid = part.gc_unique_id;
        }
        if (uuid in cart) {
            cart[uuid] = part;
        }
        this.setCookie(cart);
    }

    Cart.prototype.isUUIDExists = function(uuid) {
        let cart = this.readCookie();
        if (uuid in cart) {
            return true;
        }
        return false;
    }

    Cart.prototype.checkCart = function() {
        if (this.cartCount() === 0) {
            $(".con-cart").html('<h3 class="text-center text-banner text-muted">Cart is Empty!</h3>');
        }
    }

    Cart.prototype.cartCount = function() {
        let cart = this.readCookie();
        return cart ? Object.keys(cart).length : 0;
    }

    Cart.prototype.cartTotal = function() {
        let cart = this.readCookie();
        if (typeof cart !== 'undefined') {
            let subTotal = 0.0;
            let ship_cost = 0;
            for (let key in cart) {
                let prod = cart[key];
                subTotal += Number(prod.price) * Number(prod.count);
            }
            $("#amountPayable").html("$" + subTotal.toFixed(2));
        } else {
            $("#amountPayable").html('$0.00');
        }
    }

    Cart.prototype.assignTotal = function() {
        $("#amountPayable").html(this.cartTotal());
    }

    Cart.prototype.assignCount = function() {
        $(".cart-count").html(this.cartCount());
    }

    Cart.prototype.setCookie = function(value) {
        var data = JSON.stringify(value);
        this.clearCookie();
        Cookies.set(this.cookieName, data, {
            expires: 7
        }, {
            domain: DOMAIN_NAME
        });
        this.assignTotal();
        this.assignCount();
    }

    Cart.prototype.clearCookie = function() {
        Cookies.set(this.cookieName, '', {
            expires: -1
        }, {
            domain: DOMAIN_NAME
        });
        this.assignTotal();
        this.assignCount();
    }

    return Cart;
})();

let XHR = (function() {
    let params, type, async, method, baseUrl;

    function XHR(baseUrl) {
        this.baseUrl = baseUrl;
    }

    let _toParam = (ary) => {
        if (!(ary instanceof Array)) {
            console.warn('Exception: Not an array');
            return false;
        }
        var str = '';
        for (var len = ary.length, i = 0; i < len; i++) {

            str += ary[i].join('=');
            str += (i === len - 1) ? '' : '&';
        }
        return str;
    }

    XHR.prototype.call = function(method, params = {}, type = 'GET', async = true) {
        this.method = method;
        this.params = Object.keys(params).map((i) => {
            return [i, params[i]]
        });
        this.type = type;
        this.async = async;

        return new Promise((resolve, reject) => {
            let url = this.baseUrl + method;
            let xhr = new XMLHttpRequest();


            xhr.open(this.type, url, this.async);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send(_toParam(this.params));
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 400) {
                    resolve(JSON.parse(xhr.response));
                } else {
                    reject(new Error(`${xhr.status} - Error Fetching Data form Server`));
                }
            };
            xhr.onerror = () => {
                reject(new Error(`${xhr.status} - Error Fetching Data form Server`));
            };
        });
    }

    return XHR;
})();

let cart = new Cart();
let xhr = new XHR(BASE_PATH + '/api/');

function init_cart() {
    cart.assignTotal();
    cart.assignCount();
}
window.onload = function() {
    init_cart();
}



function addToCart(handle, count, cInv,part_type='') {
    var e = document.getElementById("numProductQty");
    var isValid = (!cInv) ? true : e.validity.valid;

    if (handle && isValid) {
        let params = {handle: handle,part_type:( (part_type=="")?'product':part_type )};
        xhr.call('getPartDetails', params, 'POST')
            .then(function(data) {
                if (data.status) {
                    
                    $.notify({
                        from: "bottom",
                        title: "<strong></strong> ",
                        icon: 'glyphicon glyphicon-shopping-cart',
                        message: "Added to your cart successfully...!"
                    }, {
                        timer: 1000,
                        type: 'success',
                        animate: {
                            enter: 'animated lightSpeedIn',
                            exit: 'animated lightSpeedOut'
                        }
                    });
                    
                    data.data.count = count;
                    cart.addPart(data.data);
                    
                    location.reload();
                }
            });

    } else if (!e.validity.valid) {
        
        $.notify({
            title: "<strong class='insufficient-quantity-cart'></strong> ",
            icon: 'glyphicon glyphicon-shopping-cart',
            message: "Insufficient Quantity!"
        }, {
            timer: 2000,
            type: 'dangert',
            animate: {
                enter: 'animated lightSpeedIn',
                exit: 'animated lightSpeedOut'
            }
        });
        
        cart.showAlert('Insufficient Quantity!', 'danger');
        
       //setTimeout(window.location.href = BASE_PATH+"/products/"+handle , 6000);
       setTimeout( 
  function() {
    window.location.reload('BASE_PATH+"/products/"+handle');
  }, 3000);
    } else {
        
        $.notify({
            title: "<strong></strong> ",
            icon: 'glyphicon glyphicon-shopping-cart',
            message: "Unable to add product to cart!"
        }, {
            timer: 1000,
            type: 'dangert',
            animate: {
                enter: 'animated lightSpeedIn',
                exit: 'animated lightSpeedOut'
            }
        });
        
        cart.showAlert('Unable to add product to cart!', 'danger');
    }
}


if (CONTROLL == "calendar") {
    Array.prototype.contains = function(v) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === v) return true;
        }
        return false;
    };

    Array.prototype.unique = function() {
        var arr = [];
        for (var i = 0; i < this.length; i++) {
            if (!arr.contains(this[i])) {
                arr.push(this[i]);
            }
        }
        return arr;
    }
}

function addToCalCart(handle, count, type, travel_total, from_cart) {
    if (type == 'course' && checkAddStudentForm()) {
        getCourseRegisteredUsers();
        preserveContact(handle);
        if (REG_USERS.length > 0) {
            var reg_name = [];
            var reg_email = [];
            $.each(REG_USERS, function(i, item) {
                reg_name.push(item.name);
                reg_email.push(item.email);
            });
        }
        if (reg_name.unique().length != REG_USERS.length) {
            alert("You have entered more than one repeated student name, Please check and confirm?");
            return false;
        }
        if (reg_email.unique().length != REG_USERS.length) {
            //alert("You have entered more than one repeated student email, Please check and confirm?")
            //return false;
        }
        proceedAddToCalCart(handle, count, type, travel_total, from_cart);
    }
    if ((type == 'travel' || type == 'charter') && checkAddOptionForm()) {
        getTravelRegisteredUsers();
        getTravelAddonOptions();
        preserveContact(handle);
        if (REG_USERS.length > 0) {
            var reg_name = [];
            var reg_email = [];
            $.each(REG_USERS, function(i, item) {
                reg_name.push(item.name);
                reg_email.push(item.email);
            });
        }
        if (reg_name.unique().length != REG_USERS.length) {
            alert("You have entered more than one repeated traveller name, Please check and confirm?");
            return false;
        }
        if (reg_email.unique().length != REG_USERS.length) {
            //alert("You have entered more than one repeated traveller email, Please check and confirm?")
            //return false;
        }
        proceedAddToCalCart(handle, count, type, travel_total, from_cart);
    }
}
var cal_checkout_btn = false;
var cart_msg = '';
function proceedAddToCalCart(handle, count, type, travel_total, from_cart) {
    if (handle) {
        let params = {
            handle: handle,
            part_type: type,
            travel_total: travel_total
        };
        xhr.call('getPartDetails', params, 'POST')
            .then(function(data) {
                if (data.status) {
                    
                    $.notify({
                        title: "<strong></strong> ",
                        icon: 'glyphicon glyphicon-shopping-cart',
                        message: cart_msg //"Added to your cart successfully...!"
                    }, {
                        timer: 1000,
                        type: 'success',
                        animate: {
                            enter: 'animated lightSpeedIn',
                            exit: 'animated lightSpeedOut'
                        }
                    });
                    
                    if (type == 'travel' || type == 'charter') {
                        data.data.count = 1;
                    } else {
                        data.data.count = count;
                    }
                    data.data.original_count = count;
                    cart.addPart(data.data);
                    cart.assignCount();
                    if(cal_checkout_btn==true){
                       window.location.href = BASE_PATH+"/checkout"; 
                    }else{
                        if(from_cart == 'yes'){
                            window.location.href = BASE_PATH+"/cart";
                        }else{
                            location.reload();
                        }
                    }
                }
            });
        hideMainDialog();
    }
}

function deleteFromCart(uuid, el, unique_id) {
    if (unique_id != '') {
        var cart_res = cart.removePart(unique_id);
    } else {
        var cart_res = cart.removePart(uuid);
    }
    if (cart_res) {
        $(el).closest("tr").remove();

        $("li." + uuid).remove();

        var amount = ($("#amountPayable").length != 0) ? $("#amountPayable").html() : '$ 0.00';

        var tot_item = parseInt($(".tot_items").attr("data-tot")) - 1;
        $(".tot_items").attr("data-tot", tot_item);
        $(".amountPayable").html(amount);
        var tot_item = parseInt($(".tot_items").attr("data-tot"));
        $(".tot_items").attr("data-tot", tot_item);
        $(".tot_items").html(tot_item + " item(s) - " + amount);
        
        $.notify({
            title: "<strong></strong> ",
            icon: 'glyphicon glyphicon-shopping-cart',
            message: "Deleted from your cart successfully...!"
        }, {
            timer: 1000,
            type: 'success',
            animate: {
                enter: 'animated lightSpeedIn',
                exit: 'animated lightSpeedOut'
            }
        });
        

    }
}

function deleteFromCartTop(uuid, el, unique_id) {
    if (confirm('Are you sure you want to remove this item from your cart??')) {
        if (unique_id != '') {
            var cart_res = cart.removePart(unique_id);
        } else {
            var cart_res = cart.removePart(uuid);
        }
        if (cart_res) {
            $(el).parent().parent().remove();
            $.ajax({
                url: BASE_PATH + "/ajax/remove_shipping",
                success: function(result) {}
            });
            
            $.notify({
                title: "<strong></strong> ",
                icon: 'glyphicon glyphicon-shopping-cart',
                message: "Deleted from your cart successfully...!"
            }, {
                timer: 1000,
                type: 'success',
                animate: {
                    enter: 'animated lightSpeedIn',
                    exit: 'animated lightSpeedOut'
                }
            });
            
            setTimeout(location.reload(), 1000);
        }
    }
    return false;
}

function changeUnitCount(handle, uuid, e, product_type, original_count) {
    if (cart.isUUIDExists(uuid) && e.value > 0) {
        let params = {
            handle: handle,
            count: $(e).val(),
            product_type: product_type.toLowerCase()
        };
        if (product_type == "GiftCertificate") {
            params.gc_key = $(e).attr('data-key');
        }
        xhr.call('checkStock', params, 'POST')
            .then(function(data) {
                if (data.status) {
                    if($("#PSO_"+data.data.part['uuid']).length>0)
                    {
                        if(data.data.PSO_msg)
                        {
                            $("#PSO_"+data.data.part['uuid']).html(data.data.PSO_msg);
                        }else{
                            $("#PSO_"+data.data.part['uuid']).html('');
                        }
                    }
                    return data.data;
                }
            })
            .then(function(data) {
                if (!data.available) {
                    if(data.nla==true)
                    {
                        var alrmsg = 'This product is no longer available. Maximum order quantity available: '+data.stock;
                    }
                    else{
                        var alrmsg = 'We are Sorry! We are able to accomodate only '+ data.processed +' quantity of <strong>'+ data.title +'</strong> for each customer';
                    }
                    cart.showAlert(alrmsg, 'danger');
                }
                $(e).val(data.processed);
                if (product_type == "Travel" || product_type == "Charter" || product_type == "Course") {
                } else {
                    $(e).closest("tr").find(".sub-total").html(data.subTotal);
                }
                return data;
            })
            .then(function(data) {
                if (product_type == "Travel" || product_type == "Charter") {
                    if (data.available)
                        gotoCalenderRegister(handle, (original_count + 1), product_type);
                } else if (product_type == "Course") {
                    if (data.available)
                        gotoCalenderRegister(handle, (e.value), product_type);
                } else {
                    cart.updatePart(data.part);
                }
            });
    }
}

function gotoCalenderRegister(handle, count, product_type) {
    let params = {
        handle: handle,
        count: count,
        product_type: product_type
    };
    xhr.call('getCollection', params, 'POST')
        .then(function(data) {
            if (data.status) {
                if (product_type == "Course") {
                    window.location.href = BASE_PATH + "/calendar/register/" + data.data['collection_uuid'] + "/" + data.data['id'] + "/" + data.data['count'] + "/" + data.data['handle'];
                } else {
                    window.location.href = BASE_PATH + "/calendar/reserve/" + data.data['collection_uuid'] + "/" + data.data['id'] + "/" + count + "/" + data.data['handle'];
                }
            }
        })
}

function clearCookie() {
    cart.clearCookie();
}

function shippingOptionChanged(e) {
    var opt = $(e).val();

    if (opt === 'new_shipping') {
        OPT_BILLING_ADDRESS = 1;
        $("#conNewShipping").slideDown();
    } else if (opt === 'same_as_shipping') {
        OPT_BILLING_ADDRESS = 0;
        $("#conNewShipping").slideUp();
    }
}

$(document).on('click', '#terms_conditions ', function(){
    if($("#terms_conditions").prop("checked"))
    {
        $(".terms_conditions").removeClass("error").css({"font-weight":"600","padding":"0px 10px"});
        $(".terms_conditions_error").css({"border":"none","padding":"0px 10px","margin-bottom":"10px"});
    }
});
function pform_submit(fid)
{
    if($("#terms_conditions").length>0){
        if(!$("#terms_conditions").prop("checked"))
        {
            $(".terms_conditions").addClass("error").css({"font-weight":"600","padding":"0px 10px"});
            $(".terms_conditions_error").css({"border":"1px solid","padding":"0px 10px","margin-bottom":"10px"});
            alert("Please accept the terms & conditions to proceed further.");
            $('#btnSubmitPay').attr("disabled", false);
            return false;
        }else
        {
            
                $('#'+fid).submit();   
        }
    }
    else{
        $('#'+fid).submit();
    }
}
$(document).on('click', '#btnSubmitPay', function() {
    if($("#pay_by").attr("data-action")=="cc")
    {
        var cccn = $("#CreditCardCardNumber").val();
        var cccv = $("#CreditCardCvv").val();
        var cce = $("#CreditCardExpiry").val();
        var ccn = $("#CreditCardName").val();
        var amountPayable_ship = parseFloat($("#amountPayable_ship").attr("data-amount"));
        if( (cccn=='' || cccv=='' || cce=='' || ccn=='') && amountPayable_ship>0 )
        {
            if(amountPayable_ship>0)
            {
                $(".gc_error").html("The gift certificate you have entered don't have sufficient balance to complete the order. Enter an additional gift certificate or use credit card to pay the balance");//.fadeIn();
                //setTimeout(function(){ $(".gc_error").fadeOut(); },5000);
                $("#gc_serial_number").focus();
                return false;
            }
        }
    }
    if ($("#DirectPayAuthForm").length) {
        $('#btnSubmitPay').attr("disabled", true);
        pform_submit("DirectPayAuthForm");
    }
    else if ($("#CreditCardAuthForm").length) {
        if($("#CreditCardAuthForm").valid())
        {
            $('#btnSubmitPay').attr("disabled", true);
            pform_submit("CreditCardAuthForm");
        }
    }else if($("#CardConnectCreditCardAuthForm").length)
    {
    	if($("#CardConnectCreditCardAuthForm").valid()){
    		$('#btnSubmitPay').attr("disabled", true);
            pform_submit("CardConnectCreditCardAuthForm");
    	}
        
    }else if($("#WorldPayCreditCardAuthForm").length)
    { 
        $('#btnSubmitPay').attr("disabled", true);
        pform_submit("WorldPayCreditCardAuthForm");
    }
    
}); 

$(document).on('click', '.btn_place_order', function() {
    $("#signin_signup").show();
    $(".guest_acc").show();
    $.ajax({
        url: BASE_PATH + "/ajax/set_ref",
        success: function(result) {}
    });
});
$(document).on('click', '.guest_form_btn', function() {
    $("#signin_signup").hide();
    window.location.href = BASE_PATH + "/checkout";
});

function show_register_form(){
    $("#span_sign_in").css("display","none");
    $("#span_sign_up").css("display","block");
    if($("#LoginInfoCreateAccountForm").length)
    {
        $("#LoginInfoCreateAccountForm .simple_security").hide();
        if( !$('#LoginInfoCreateAccountForm #g-recaptcha-response').length )
            $('#LoginInfoCreateAccountForm #action').after("<input type='hidden' id='g-recaptcha-response' name='g-recaptcha-response' value=''  >");
        reset_captcha();
    }
}

function show_signin_form() {
    $("#span_sign_in").css("display", "block");
    $("#span_sign_up").css("display", "none");
}

function OpenForgotPass() {
    $("#forgot_password").show();
}

function hideshow(which) {
    $(which).hide();
}
$(document).on('click', '#pickup_in_store', function() {
    cart.assignTotal();
});

function shippingMethodChanged(e) {
    var opt = $(e).val();        
    let subTotal = 0.0;
    let ship_cost = 0;  
    subTotal = Number($("#hidden_subTotal").val());
    
    var shipObj = ''
    if($("#deliveryAmount_ship").length){    
        shipObj = $("#deliveryAmount_ship");                       
    }
    if($("#shipping_price").length){    
        shipObj = $("#shipping_price");                       
    }


    if($('#pickup_in_store').length && opt!="pickup_in_store")
    {
        $('#pickup_in_store').prop('checked',false);
    }
    if($('#free_shipping').length && opt!="free_shipping")
    {
        $('#free_shipping').prop('checked',false);
    }
    if($('#flat_rate').length && opt!="flat_rate")
    {
        $('#flat_rate').prop('checked',false);
    }
    if($('#price_based').length && opt!="price_based")
    {
        $('#price_based').prop('checked',false);
    }
    if($('#local_delivery').length && opt!="local_delivery")
    {
        $('#local_delivery').prop('checked',false);
    }
    if($('.ups_shipping').length)
    {
        $('.ups_shipping').prop('checked',false);
    }

    $.ajax({
        url: BASE_PATH+"/api/getShippingCost",
        method: 'post',
        data: {
           "shipping_method":opt,
           'free_shipping_flag': $("#hidden_free_shipping_flag").val()
        },
        success: function(result){
           var json = $.parseJSON(result);
           $("#amountPayable_ship").html(json.total);            
           shipObj.html(json.shipping_price);            
        }
     });
}

function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

$(document).on('click', '.alert_place_order', function() {
    $("#go-top").trigger("click");
    cart.showAlert('One or more reservations in your cart has expired. Please add the reservation details again to proceed', 'danger');
});

if ($("#CustomerInfoState").length) {

}
$(document).ready(function() {
    if ($("#CustomerInfoState").length) {
        $("#CustomerInfoState").trigger("change");
    }
});
$(document).on('change', '#CustomerInfoState', function() {
    var state = $(this).val();
    var cart_tax = parseFloat($("#cart_tax").attr('data-amount'));
    var amountPayable_ship = parseFloat($("#amountPayable_ship").attr("data-amount"));
    var cart_subtotal = parseFloat($("#cart_subtotal").attr("data-amount"));

    var amountPayable_ship1 = '';
    var tt_exempt = 0;
    if (state != '' && state != store_home_state && exempt_tax_out_state == 1) {
        amountPayable_ship1 = amountPayable_ship - cart_tax;
        cart_tax = 0;
        tt_exempt = 1;
    } else {
        amountPayable_ship1 = amountPayable_ship;
    }

    var charter_travel = {};
    $(".charter_travel").each(function() {
        var ct_id = $(this).attr("id");
        var ct_tax = parseFloat($(this).attr("data-tax"));
        var ct_amount = parseFloat($(this).attr("data-amount"));
        charter_travel[ct_id] = {};
        charter_travel[ct_id].tax = ct_tax;
        charter_travel[ct_id].amount = ct_amount;
    });

    $.ajax({
        url: BASE_PATH + "/ajax/set_currency",
        method: 'post',
        data: {
            "tax": cart_tax,
            "total": amountPayable_ship1,
            "sub": cart_subtotal,
            'charter_travel': charter_travel,
            "exempt_tax_out_state": tt_exempt
        },
        success: function(result) {
            var json = $.parseJSON(result);
            if (json.charter_travel) {
                $.each(json.charter_travel, function(i, part) {
                    $("#" + i).html($("#" + i).attr('data-count') + " x " + part.amount);
                });
            }
            if ($("#cart_tax").length) {
                $("#cart_tax").html(json.tax);
            }
            $("#amountPayable_ship").html(json.total);
            $("#cart_subtotal").html(json.sub);
        }
    });

});

$(document).on('click', '.proceed_pay ', function() {
    var cust_form = 'CustomerInfoShippingForm';
    if ($("#" + cust_form).attr('data-token') != '') {
        $("#" + cust_form).attr('action', '/checkout/payment/' + $("#" + cust_form).attr('data-token'));
    }
    if ($(".ck_email").length > 0 && $(".ck_email").val() != '') {
        $.ajax({
            url: BASE_PATH + "/site/checkEmail",
            type: "post",
            async: false,
            data: {
                email_id: function() {
                    return $("#CustomerInfoEmail").val();
                }
            },
            success: function(msg) {
                if ($.trim(msg) == "false") {
                    $("#signin_signup").show();
                } else {
                    $("#" + cust_form).submit();
                }
            }
        });
    } else {
        $("#" + cust_form).submit();
    }
});

$(document).on('change', '.ck_fname, .ck_lname, .ck_email ', function() {
    var dssf_tmp_id = this.value;
    if (dssf_tmp_id != 'new') {
        var data_type = $(this).attr("data-type");
        if (data_type == 'fname') {
            $(".ck_lname").val(dssf_tmp_id);
            $(".ck_email").val(dssf_tmp_id);
        } else if (data_type == "lname") {
            $(".ck_fname").val(dssf_tmp_id);
            $(".ck_email").val(dssf_tmp_id);
        } else if (data_type == "email") {
            $(".ck_fname").val(dssf_tmp_id);
            $(".ck_lname").val(dssf_tmp_id);
        }
        $("#CustomerInfoFirstName").val($(".ck_fname").find("option:selected").html()).attr("type", "hidden");
        $("#CustomerInfoLastName").val($(".ck_lname").find("option:selected").html()).attr("type", "hidden");
        if ($(".ck_email").val() != null) {
            $("#CustomerInfoEmail").val($(".ck_email").find("option:selected").html()).attr("type", "hidden");
            $(".ck_email").removeClass("hide");

            var res = $("#CustomerInfoEmail").val().split(" (");
            $("#CustomerInfoEmail").val(res[0]);

            $.ajax({
                url: BASE_PATH + "/site/checkEmail",
                type: "post",
                async: false,
                data: {
                    email_id: function() {
                        return $("#CustomerInfoEmail").val();
                    }
                },
                success: function(msg) {
                    if ($.trim(msg) == "false") {
                        $("#signin_signup").show();
                    }
                }
            });
        } else {
            $("#CustomerInfoEmail").attr("type", "text").val('');
            $(".ck_email").addClass("hide");
        }


        $("#CustomerInfoDssfTmpId").val(dssf_tmp_id).attr("type", "hidden");
        if ($("#CreditCardFirstName").length > 0) {
            $("#CreditCardFirstName").attr("type", 'hidden').val($(".ck_fname").find("option:selected").html());
        }
        if ($("#CreditCardLastName").length > 0) {
            $("#CreditCardLastName").attr("type", 'hidden').val($(".ck_fname").find("option:selected").html());
        }
    } else {
        $("#CustomerInfoDssfTmpId").val('');
        $(".ck_fname").remove();
        $(".ck_lname").remove();
        $(".ck_email").remove();
        $("#CustomerInfoFirstName").attr("type", 'text').val('');
        $("#CustomerInfoLastName").attr("type", 'text').val('');
        $("#CustomerInfoEmail").attr("type", 'text').val('');
        if ($("#CreditCardFirstName").length > 0) {
            $("#CreditCardFirstName").attr("type", 'text').val('');
            $("#CreditCardLastName").attr("type", 'text').val('');
        }
    }

});


$(document).ready(function() {
    $(".gc_amt_btn").click(function() {
        $(".gc_amt_btn").removeClass('gc-form-selected-btn');
        $(this).addClass('gc-form-selected-btn');

    });
    $("#add_to_cart_gc").click(function() {
        $("#add_to_cart_gc").attr("disabled", true);
        if ($("#gc_to_amount").val() == '' || $("#gc_to_amount").val() == 0) {
            if ($("#gc-amt-error").length == 0)
            {
                if($("#custom_gc_amount").length>0){
                    $("#gc_to_amount").after('<label id="gc-amt-error" style="color:#f00;font-weight:bold;">Please choose or enter gift card amount.</label>');
                }else{
                    $("#gc_to_amount").after('<label id="gc-amt-error" style="color:#f00;font-weight:bold;">Please choose gift card amount.</label>');
                }
            }

            $("#add_to_cart_gc").attr("disabled", false);
            return false;
        } else {
            $("#gc-amt-error").remove();
        }

        if ($("#gc_to_amount").val() < 1) {
            $("#gc_to_amount").after('<label id="gc-amt-error" style="color:#f00;font-weight:bold;">Gift card amount should be greater than 1.</label>');
            $("#add_to_cart_gc").attr("disabled", false);
            return false;
        }

        if ($("#gc_form").valid()) {
            var count = $("#gc_qty").val();
            let params = {
                handle: $(this).attr('data-handle'),
                part_type: 'GiftCertificate'
            };
            var formdata = $("#gc_form").serializeArray();
            $(formdata).each(function(index, obj) {
                params[obj.name] = obj.value;
            });
            var gc_unique_id = new Date().valueOf();
            params['gc_unique_id'] = gc_unique_id;

            xhr.call('getPartDetails', params, 'POST')
                .then(function(data) {
                    if (data.status) {
                        
                        $.notify({
                            from: "bottom",
                            title: "<strong></strong> ",
                            icon: 'glyphicon glyphicon-shopping-cart',
                            message: "Added to your cart successfully...!"
                        }, {
                            timer: 1000,
                            type: 'success',
                            animate: {
                                enter: 'animated lightSpeedIn',
                                exit: 'animated lightSpeedOut'
                            }
                        });
                        
                        data.data.count = count;
                        data.data.price = $("#gc_to_amount").val();
                        data.data.gc_unique_id = gc_unique_id;
                        cart.addPart(data.data);
                        window.location.href = BASE_PATH + '/cart';
                    }
                });
            return false;
        } else {
            $("#add_to_cart_gc").attr("disabled", false);
        }

    });
});

$(document).ready(function(){
    if($(".item_not_available").length>0)
    {

        if (CONTROLL == "checkout" && ACTION == "index" )
        {
            $(".proceed_pay").attr("disabled",true);
        }
        else if(CONTROLL == "checkout" && ACTION == "shipping")
        {
            $('#shipping_ahref').attr('disabled',true);
        }
        else if(CONTROLL == "checkout" && ACTION == "payment") 
        {
            $('#btnSubmitPay').attr('disabled',true);
        }
        else if (CONTROLL == "products" && ACTION == "cart" )
        {
            if($(".btn_place_order").length>0)
            {
                $(".btn_place_order").attr("disabled",true);
            }
            else if($("#place_order").length>0)
            {
                $("#place_order").attr("disabled",true);
            }
        }
        if (CONTROLL == "checkout")
        {
            setTimeout(function(){
                
                $.notify({
                    title: "",
                    icon: 'glyphicon glyphicon-cart',
                    message: "Please edit your cart and try again."
                }, {
                    offset: {
                        x: 50,
                        y: 200
                    },
                    timer: 1000,
                    type: 'danger',
                    animate: {
                        enter: 'animated lightSpeedIn',
                        exit: 'animated lightSpeedOut'
                    }
                });
                
            },1000);
        }
    }
});
function addToCartReplace(handle, count, cInv,pkg_replace,pkg_price,pkg_replace_price) {
     var e = document.getElementById("numProductQty");
    var isValid = (!cInv) ? true : e.validity.valid;
    if(handle && isValid) {
        let params = {handle: handle,part_type:'product'};
        xhr.call('getPartDetails', params, 'POST')
            .then(function(data) {
                if(data.status) {
                    data.data.count = count;
                    data.data.pkg_replace = pkg_replace;
                    if(pkg_price!='')
                    {
                        data.data.price = pkg_price;
                    }
                    data.data.pkg_replace_price = pkg_replace_price;
                    cart.addPart(data.data);
                    
                    $.notify({
                        from: "bottom",
                        title: "<strong></strong> ",
                        icon: 'glyphicon glyphicon-shopping-cart',
                        message: "Added to your cart successfully...!"
                    },{timer: 1000,type: 'success',animate: {enter: 'animated lightSpeedIn',exit: 'animated lightSpeedOut'}});
                    
                    window.location.reload();
                }
            });
        
    }else if(!e.validity.valid) {
          
          $.notify({
                title: "<strong></strong> ",
                icon: 'glyphicon glyphicon-shopping-cart',
                message: "Insufficient Quantity!"
          },{timer: 1000,type: 'danger',animate: {enter: 'animated lightSpeedIn',exit: 'animated lightSpeedOut'}});
          
        cart.showAlert('Insufficient Quantity!', 'danger');
        location.reload();
    }else {
        
          $.notify({
                title: "<strong></strong> ",
                icon: 'glyphicon glyphicon-shopping-cart',
                message: "Unable to add product to cart!"
          },{timer: 1000,type: 'dangert',animate: {enter: 'animated lightSpeedIn',exit: 'animated lightSpeedOut'}});
          
          cart.showAlert('Unable to add product to cart!', 'danger');
    }
}

if (CONTROLL == "checkout" && (ACTION == "payment" || ACTION == "confirm") ) 
{
    (function (global) {
        if(typeof (global) === "undefined")
        {
            throw new Error("window is undefined");
        }
        var _hash = "!";
        var noBackPlease = function () {
            global.location.href += "#";
            global.setTimeout(function () {
                global.location.href += "!";
            }, 50);
        };
        global.onhashchange = function () {
            if (global.location.hash !== _hash) {
                global.location.hash = _hash;
            }
        };
        global.onload = function () {
            noBackPlease();
            document.body.onkeydown = function (e) {
                var elm = e.target.nodeName.toLowerCase();
                if (e.which === 8 && (elm !== 'input' && elm  !== 'textarea')) {
                    e.preventDefault();
                }
                e.stopPropagation();
            };
            
        };
    })(window);
}

$(document).on('click', '.remove_coupon ', function() {
    var c_id = $(this).attr('data-id');
    $("#coupon_" + c_id).remove();
    $.ajax({
        url: BASE_PATH + "/api/remove_coupon",
        type: "post",
        async: false,
        data: {
            'coupon_code': c_id,
            'total': $("#amountPayable_ship").attr("data-amount")
        },
        success: function(result) {
            var obj = jQuery.parseJSON(result);
            $("#amountPayable_ship").attr("data-amount", obj.total).html(obj.tot_label);
            $("#coupon_value").html(obj.reward_val_label);
            $("#coupon_value").attr("data-amount", obj.reward_value);
            $("#coupon_code").attr('readonly', false);
            
            $.notify({
                from: "bottom",
                title: "<strong></strong> ",
                icon: 'glyphicon glyphicon-tags',
                message: ' Coupon removed successfully...!'
            }, {
                timer: 1000,
                type: 'success',
                animate: {
                    enter: 'animated lightSpeedIn',
                    exit: 'animated lightSpeedOut'
                }
            });
            
            
        }
    });
});
$(document).on('click', '#apply_coupon ', function() {
    var btnObj = $(this);
    if (CONTROLL == "checkout" && ACTION == "index") {
        var coupon_code = $("#coupon_code").val();
        if (coupon_code != '') {
            $.ajax({
                url: BASE_PATH + "/api/checkCouponValidity",
                type: "post",
                async: false,
                data: {
                    'coupon_code': coupon_code,
                    'total': $("#amountPayable_ship").attr("data-amount"),
                    'reward_value': $("#coupon_value").attr("data-amount")
                },
                success: function(result) {
                    var obj = jQuery.parseJSON(result);
                    if (obj.status == 1) {
                        $("#amountPayable_ship").attr("data-amount", obj.data.total).html(obj.data.tot_label);
                        $("#coupon_value").html(obj.data.reward_val_label);
                        $("#coupon_value").attr("data-amount", obj.data.reward_value);
                        
                        $.notify({
                            from: "bottom",
                            title: "<strong></strong> ",
                            icon: 'glyphicon glyphicon-tags',
                            message: '  "' + coupon_code + '" has been applied successfully...!'
                        }, {
                            timer: 1000,
                            type: 'success',
                            animate: {
                                enter: 'animated lightSpeedIn',
                                exit: 'animated lightSpeedOut'
                            }
                        });
                        
                        
                        var loyalty_reward_value = obj.data.reward_val_label1;
                        var loyalty_program_name = obj.data.program_name;
                        var loyalty_program_des = obj.data.description;
                        var str_html = '';
                        str_html += "<div class='row dotted_border' id='coupon_" + coupon_code + "'>";
                        str_html += "<div class='col-lg-2 RM_PLR15'>";
                        str_html += "<strong>" + coupon_code + "</strong>";
                        str_html += "</div>";
                        str_html += "<div class='col-lg-8 RM_PLR15'>";
                        str_html += "<strong>" + loyalty_program_name + "</strong> - ";
                        str_html += loyalty_program_des;
                        str_html += "</div>";
                        str_html += "<div class='col-lg-2 RM_PLR15'>";
                        str_html += loyalty_reward_value + "&nbsp;<i class='fa fa-trash-o remove_coupon' data-id='" + coupon_code + "'></i>";
                        str_html += "</div></div>";
                        $("#coupon_details").append(str_html);
                        $("#coupon_code").focus().val('');
                    } else {
                        var msg = '  "' + coupon_code + '" is invalid coupon.';
                        if (obj.message) {
                            msg = obj.message;
                        }
                        $.notify({
                            from: "bottom",
                            title: "<strong></strong> ",
                            icon: 'glyphicon glyphicon-tags',
                            message: msg
                        }, {
                            timer: 1000,
                            type: 'danger',
                            animate: {
                                enter: 'animated lightSpeedIn',
                                exit: 'animated lightSpeedOut'
                            }
                        });
                        
                        $("#coupon_code").focus().val('');
                    }
                }
            });
        } else {
            $("#coupon_code").focus().val('');
            $.notify({
                from: "bottom",
                title: "<strong></strong> ",
                icon: 'glyphicon glyphicon-tags',
                message: 'Please enter the coupon..!'
            }, {
                timer: 1000,
                type: 'danger',
                animate: {
                    enter: 'animated lightSpeedIn',
                    exit: 'animated lightSpeedOut'
                }
            });
        }
    }
});
$(document).on('click', '.remove_gc ', function() {
    $("#gc_serial_number").attr('readonly',false);
    $('#pay_by').attr("disabled",false);
    
    $(".gc_error").html("");
    var gc_serial_number = $(this).attr('data-gc');
    $("tr." +gc_serial_number).remove();

    if($(".gc_serial_number_list").find('tr').length==1)
    {
        $(".gc_serial_number_list").addClass("hide");
    }
    $("#gc_apply").attr('disabled',false);
    
    $.ajax({
        url: BASE_PATH + "/api/removeGiftSerialNumber",
        type: "post",
        async: false,
        data: {
            'gc_serial_number': gc_serial_number,
            'total': $("#amountPayable_ship").attr("data-amount")
        },
        success: function(result) {
            var obj = jQuery.parseJSON(result);
            if(obj.total_gc_price>0)
            {
                var str_html = '';
                str_html += "<div class='panel panel-default'>";
                str_html += "<div class='panel-heading'>";
                str_html += "<div class='row' id='gc_discount' data-amount='"+obj.total_gc_price+"'>";
                str_html += "<div class='col-lg-10 RM_PLR15'>";
                str_html += "<strong>Gift Certificate</strong>";
                str_html += "</div>";
                str_html += "<div class='col-lg-2 RM_PLR15' style='text-align:right'>";
                str_html +=  obj.total_gc_price_label;
                str_html += "</div></div>";
                str_html += "<div class='row' id='gc_discount' data-amount='"+obj.total_gc_price+"'>";
                str_html += "<div class='col-lg-10 RM_PLR15'>";
                str_html += "<strong>Amount Due</strong>";
                str_html += "</div>";
                str_html += "<div class='col-lg-2 RM_PLR15' style='text-align:right'>";
                str_html +=  obj.total_label;
                str_html += "</div></div>";
                str_html += "</div>";
                str_html += "</div>";
                if($("#gc_discount").length>0)
                {
                    $("#gc_discount").parent().parent().remove();
                }
                $(".costSummary").append(str_html);    
            }
            else
            {
                $("#gc_discount").parent().parent().remove();
            }
            $("#amountPayable_ship").attr("data-amount",obj.total).html(obj.total_label);
            if(obj.total>0)
            {
                if($(".gc_serial_number_list").find('tr').length==1)
                {
                    paybtn();
                }else{
                    $("#gc_serial_number").focus();
                    var emsg = "<p>The gift certificate you have entered don't have sufficient balance to complete the order. Enter an additional gift certificate or use credit card to pay the balance</p>";
                    var eclass = "gc_error";
                    paybtn(eclass,emsg);
                }
            }else{
                paybtn();
            }

            $.notify({
                from: "bottom",
                title: "<strong></strong> ",
                icon: 'glyphicon glyphicon-tags',
                message: ' Gift Certificate Number removed successfully...!'
            }, {
                timer: 1000,
                type: 'success',
                animate: {
                    enter: 'animated lightSpeedIn',
                    exit: 'animated lightSpeedOut'
                }
            });
        }
    });
});
$(document).on('keypress', '#gc_serial_number', function(event){
    if (event.keyCode === 13) {
        if($("#check_gc_balance").length>0){
            $("#check_gc_balance").trigger("click");
        }
        else if($("#gc_apply").length>0){
            $("#gc_apply").trigger("click");
        }
    }
});
$(document).on('keypress', '#UserCaptcha', function(event){
    if (event.keyCode === 13) {
        if($("#gc_captcha_verify").length>0){
            $("#gc_captcha_verify").trigger("click");
        }        
    }
});
$(document).on('click', '#gc_captcha_verify', function() {
    $('#gc_captcha_verify').attr("disabled",true).html("<img src='"+BASE_PATH +"/img/loading1.gif'>");
    if($("#UserCaptcha").is(":visible") && $("#UserCaptcha").val()!='') {
        var gc_captcha_data = { 'captcha_code':$("#UserCaptcha").val()   };
    }else{
       $(".gc_error").html("Please enter the captcha code"); 
       $('#gc_captcha_verify').attr("disabled",false).html("Submit");
       return false;
    }
    $.ajax({
        url: BASE_PATH + "/api/verifycaptcha",
        type: "post",
        async: false,
        data: gc_captcha_data,
        success: function(result) {
            setTimeout(function(){$('#gc_captcha_verify').attr("disabled",false).html("Submit");},1200);
            var obj = jQuery.parseJSON(result);
            if (obj.status == 0) {
                $(".gc_error").html("Invalid Captcha Code");
                gc_apply_click++;
                $(".creload:visible").trigger("click");
            }else{
                $(".gc_error").html("");
                $("#gc_serial_number").parent().parent().parent().removeClass("hide");
                $(".gc_captcha").addClass("hide");
                $("#gc_serial_number").focus();
                gc_apply_click = 0;
                if($(".gc_serial_number_list").find('tr').length>1)
                {
                    $(".gc_serial_number_list").removeClass("hide");
                }
                if(parseFloat($("#amountPayable_ship").attr("data-amount"))>0 && $(".gc_serial_number_list").find('tr').length>1)
                {
                    var err_msg = "<p>The gift certificate you have entered don't have sufficient balance to complete the order. Enter an additional gift certificate or use credit card to pay the balance</p>";
                    $(".gc_error").html(err_msg);
                }
                
            }
        }
    });
});
var gc_apply_click = 0;
$(document).on('click', '#gc_apply', function() {
    $('#gc_apply').attr("disabled",true).html("<img src='"+BASE_PATH +"/img/loading1.gif'>");
    if(gc_apply_click>=4)
    {
        $(".gc_captcha").removeClass("hide");
        $(".creload:visible").trigger("click");
        $("#UserCaptcha:visible").val("");
        $("#gc_serial_number").val("");
        $("#gc_serial_number").parent().parent().parent().addClass("hide");
        if($(".gc_serial_number_list").find('tr').length>1)
        {
            $(".gc_serial_number_list").addClass("hide");
        }
        $(".gc_error").html("");
        $('#gc_apply').attr("disabled",false).html("Apply");
        return false;
    }
    
    // if($("#UserCaptcha").is(":visible") && $("#UserCaptcha").val()=='') 
    // {
    //     $("#UserCaptcha").focus();
    //     $(".gc_error").html("Please enter the captcha code");  
    //     return false;
    // }
    
    $('#btnSubmitPay').attr("disabled", false);
    var gc_serial_number = $.trim($("#gc_serial_number").val());
    if(gc_serial_number=='')
    {
        $.notify({
            from: "bottom",
            title: "<strong></strong> ",
            icon: 'glyphicon glyphicon-gift',
            message: '  <b>Please enter Gift Certificate Number...!</b>'
        }, {
            timer: 1000,
            type: 'danger',
            offset: {   x: 50,  y: 200  },
            animate: {
                enter: 'animated lightSpeedIn',
                exit: 'animated lightSpeedOut'
            }
        });
        gc_apply_click++;
        $('#gc_apply').attr("disabled",false).html("Apply");
    }
    else
    {
        var gc_data = { 'gc_serial_number': gc_serial_number, 'total': $("#amountPayable_ship").attr("data-amount")   };
        // if($("#UserCaptcha").is(":visible") && $("#UserCaptcha").val()!='') 
        // {
        //     var gc_data = { 'gc_serial_number': gc_serial_number, 'total': $("#amountPayable_ship").attr("data-amount"), 'gc_captcha':$("#UserCaptcha").val()   };
        // }
        $.ajax({
            url: BASE_PATH + "/api/getGiftserialBalance",
            type: "post",
            async: false,
            data: gc_data,
            success: function(result) {
                setTimeout(function(){ $('#gc_apply').attr("disabled",false).html("Apply"); },1200);
                if($(".creload").is(":visible"))
                {
                    $(".creload:visible").trigger("click");
                    $("#UserCaptcha").val("");
                }
                var obj = jQuery.parseJSON(result);
                if (obj.status == 0) 
                {
                    $(".gc_error").html(obj.message);
                    gc_apply_click++;
                    paybtn();
                }
                else if(obj.status==1)
                {
                    var str_html = '';
                    str_html += "<div class='panel panel-default'>";
                    str_html += "<div class='panel-heading'>";
                    str_html += "<div class='row' id='gc_discount' data-amount='"+obj.total_gc_price+"'>";
                    str_html += "<div class='col-lg-10 RM_PLR15'>";
                    str_html += "<strong>Gift Certificate</strong>";
                    str_html += "</div>";
                    str_html += "<div class='col-lg-2 RM_PLR15'  style='text-align:right'>";
                    str_html +=  obj.total_gc_price_label;
                    str_html += "</div></div>";
                    str_html += "<div class='row' id='gc_discount' data-amount='"+obj.total_gc_price+"'>";
                    str_html += "<div class='col-lg-10 RM_PLR15'>";
                    str_html += "<strong>Amount Due</strong>";
                    str_html += "</div>";
                    str_html += "<div class='col-lg-2 RM_PLR15'  style='text-align:right'>";
                    str_html +=  obj.total_label;
                    str_html += "</div></div>";
                    str_html += "</div>";
                    str_html += "</div>";
                    if($("#gc_discount").length>0)
                    {
                        $("#gc_discount").parent().parent().remove();
                    }
                    $("#amountPayable_ship").attr("data-amount",obj.total);
                    $(".costSummary").append(str_html);
                    var str = "<tr class='tx_gc "+gc_serial_number+"'><td>"+gc_serial_number+" <a  href='javascript:void(0);' class='remove_gc' data-gc='"+gc_serial_number+"'>Remove</a></td><td>"+obj.gc_price_applied_label+"</td></tr>";
                    $(".gc_serial_number_list").removeClass("hide").append(str);
                    $("#gc_serial_number").val('');
                    $(".gc_error").html(obj.message); //.fadeIn();
                    if(obj.total==0)
                    {
                        $("#gc_serial_number").attr('readonly',true);
                        $("#gc_apply").attr('disabled',true);
                        $('#pay_by').attr("disabled",true);
                        paybtn();
                    }else{
                        $("#gc_serial_number").focus();
                        var emsg = "<p>The gift certificate you have entered don't have sufficient balance to complete the order. Enter an additional gift certificate or use credit card to pay the balance</p>";
                        var eclass = "gc_error";
                        paybtn(eclass,emsg);
                    }
                    gc_apply_click = 0;

                }
            }
        });
    }
});
$(document).on('click', '#pay_by ', function() {
    $('#btnSubmitPay').attr("disabled", false);
    var action = $(this).attr("data-action");
    if(action=="gc")
    { 
    	$('#worldpay_redirect_txt').css('display','none');
        $(this).attr("data-action",'cc').html('<i class="fa fa-credit-card"></i> Pay by Credit Card');
        $("#gc_pay").removeClass("hide");
        $("#card_pay").addClass("hide");
        $(".pay_m").html('Gift Certificate');
        paybtn();

        $(".gc_error").html("");
        $("#gc_serial_number").parent().parent().parent().removeClass("hide");
        $(".gc_captcha").addClass("hide");
        $("#gc_serial_number").focus();
        gc_apply_click = 0;
        if($(".gc_serial_number_list").find('tr').length>1)
        {
            $(".gc_serial_number_list").removeClass("hide");
        }
        if(parseFloat($("#amountPayable_ship").attr("data-amount"))>0 && $(".gc_serial_number_list").find('tr').length>1)
        {
            var err_msg = "<p>The gift certificate you have entered don't have sufficient balance to complete the order. Enter an additional gift certificate or use credit card to pay the balance</p>";
            $(".gc_error").html(err_msg);
        }

    }
    else
    {	$('#worldpay_redirect_txt').css('display','block');
        $(this).attr("data-action",'gc').html('<i class="fa fa-gift"></i> Pay by Gift Certificate');
        $("#gc_pay").addClass("hide");
        $("#card_pay").removeClass("hide");
        $(".pay_m").html('Credit Card');
        $('#btnSubmitPay').attr("disabled", false);
    }
});

function paybtn(eclass='',emsg='')
{
    if($("#CreditCardCardNumber").length>0){
        var cccn = $("#CreditCardCardNumber").val();
    }else
    {
        var cccn = $("#CreditCardCardNumber").val();
    }
    var cccv = $("#CreditCardCvv").val();
    var cce = $("#CreditCardExpiry").val();
    var ccn = $("#CreditCardName").val();
    var amountPayable_ship = parseFloat($("#amountPayable_ship").attr("data-amount"));
    if( (cccn=='' || cccv=='' || cce=='' || ccn=='' || $("#WorldPayCreditCardAuthForm").length) && amountPayable_ship>0 )
    {
        $('#btnSubmitPay').attr("disabled", true);    
    }
    else
    {
        $('#btnSubmitPay').attr("disabled", false);
    }
    if(emsg!='')
    {
        $('#btnSubmitPay').attr("disabled", true);
        $("."+eclass).append(emsg);  
    }
}