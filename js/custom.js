let Utility = (function () {
	let sort = 'name_asc',
		view = 'grid',
		allViews = ['list', 'grid'],
		allSorts = ['price_desc', 'price_asc', 'created_desc', 'created_asc', 'name_desc', 'name_asc'];

	function Utility() { }
	let _toParam = function (ary) {
		if (!(ary instanceof Array)) {
			console.warn('Exception: Not an array');
			return false;
		}
		var str = '';
		for (var len = ary.length, i = 0; i < len; i++) {
			str += (i === 0) ? '?' : '';
			str += ary[i].join('=');
			str += (i === len - 1) ? '' : '&';
		}
		return str;
	}
	let _getParams = function (sort, view) {
		var ary = [
			['sort_type', sort],
			['view', view]
		];
		return _toParam(ary);
	}
	Utility.prototype.setSort = function (srt) {
		localStorage.dssf_sort = srt;
		return _getParams(this.getSort(), this.getView());
	}
	Utility.prototype.getSort = function () {
		return localStorage.dssf_sort || sort;
	}
	Utility.prototype.setView = function (vw) {
		localStorage.dssf_view = vw;
		return _getParams(this.getSort(), this.getView());
	}
	Utility.prototype.getView = function () {
		return localStorage.dssf_view || view;
	}
	Utility.prototype.initFilterButtons = function () {
		$('.btn-filter').removeClass('text-primary').addClass('text-muted');
		if (this.getView() === 'grid') {
			$('.btn-filter.fa-th-large').addClass('text-primary');
		} else {
			$('.btn-filter.fa-th-list').addClass('text-primary');
		}
	}
	return Utility;
})();

let util = new Utility();
var filter_products = {};

var urlParams = new URLSearchParams(window.location.search);
var entries = urlParams.entries();
var price = {};
for(var pair of entries) {
	
  if (pair[0]=="category") {
	var category = {};
	category.id = pair[1];
	filter_products.category = category;
  }
  else if (pair[0]=="manufacture") {
	var mf = pair[1].split(",");
	filter_products.manufacture = mf;
	
  }
  else if (pair[0]=="min") {
	price.min = pair[1];
	filter_products.price = price;
	
  }
  else if (pair[0]=="max") {	
	price.max = pair[1];
	filter_products.price = price;
	
  }
}




document.addEventListener("DOMContentLoaded", function (e) {
	$(document).on('click', '.btn-buy-cart', function () {
		location.href = BASE_PATH + '/cart';
	});
	$('.search-mobile-icon').click(function () {
		$('.search-ico').slideToggle();
	});
	var slide_count = 0;
	$(".bxslider li").map(function (i, n) {
		slide_count++;
	});
	var auto_enable_slide = true;
	if (slide_count == 1) {
		auto_enable_slide = false;
	}
	if ($('.bxslider').length == true) {
		$('.bxslider').bxSlider({
			auto: auto_enable_slide,
			adaptiveHeight: true,
			touchEnabled: !1,
			pager: auto_enable_slide
		});
	}
	if ($("#enable_expanded_sidebar").val() == 1) {
	}
	var imgMain = document.getElementById("imgMain");
	if (imgMain) {
		var x1 = 0,
			y1 = 0;
		var box = document.getElementById("magnifierBox");
		imgMain.addEventListener("mousemove", function (e) {
			$(".thumbnail.zoom").show();
			x1 = -(e.offsetX - 150);
			y1 = -(e.offsetY - 150);
			setTimeout(function () {
				$("#imgMainZoom").css({
					"transform": "scale(2) translate3d(" + x1 + "px, " + y1 + "px, 0)"
				});
			}, 10);
		});
		imgMain.addEventListener("mouseleave", function (e) {
			$(".thumbnail.zoom").hide();
		});
	}
	var imgMain = $(".imgMain");
	if (imgMain) {
		var x1 = 0,
			y1 = 0;
		var box = $("#magnifierBox");
		imgMain.mousemove(function( e ) {
			$(".thumbnail.zoom").show();
			x1 = -(e.offsetX - 150);
			y1 = -(e.offsetY - 150);
			setTimeout(function () {
				$("#imgMainZoom").css({
					"transform": "scale(2) translate3d(" + x1 + "px, " + y1 + "px, 0)"
				});
			}, 10);
		});
		imgMain.mouseleave(function( e ) {
			$(".thumbnail.zoom").hide();
		});
	}
	
	util.initFilterButtons();
	var cur_handle = '';
	var match_vgp = '';
	$(".variant-images .variant_pro").on('mouseenter', function (e) {
		var varaint_name = '';
		var vur_variant_pos = $(this).parent().find(".loop_value").val();
		if (vur_variant_pos == 1) {
			var first_variant = $(this)[0].id;
			varaint_name += "/" + first_variant;
			if ($("#hightlight_value_2").val() != undefined) {
				var second_variant = $("#hightlight_value_2").val();
				varaint_name += "/" + second_variant;
			}
			if ($("#hightlight_value_3").val() != undefined) {
				var third_variant = $("#hightlight_value_3").val();
				varaint_name += "/" + third_variant;
			}
			
		} else if (vur_variant_pos == 2) {
			if ($("#hightlight_value_1").val() != undefined) {
				var first_variant = $("#hightlight_value_1").val();
				varaint_name += "/" + first_variant;
			}
			var second_variant = $(this)[0].id;
			varaint_name += "/" + second_variant;
			if ($("#hightlight_value_3").val() != undefined) {
				var third_variant = $("#hightlight_value_3").val();
				varaint_name += "/" + third_variant;
			}

		} else if (vur_variant_pos == 3) {
			if ($("#hightlight_value_1").val() != undefined) {
				var first_variant = $("#hightlight_value_1").val();
				varaint_name += "/" + first_variant;
			}
			if ($("#hightlight_value_2").val() != undefined) {
				var second_variant = $("#hightlight_value_2").val();
				varaint_name += "/" + second_variant;
			}
			var third_variant = $(this)[0].id;
			varaint_name += "/" + third_variant;
		}
		var part_ex = 0;
		maincontent.forEach(function (item, index) {
			var vfxs = item['variant_code'];
			vfxs = vfxs.replace(/\$##\$/g, "/").replace('N/A', "Unavailable").replace(/"/g,"").toLowerCase();
			vfxs  = vfxs.split("/");
			if(vfxs.length>=3){
				if(vfxs[0]==0 || vfxs[0]==1){
			    	vfxs.shift();
			    }	
			}
			vfxs = "/"+vfxs.join("/");
			if ( vfxs == varaint_name.toLowerCase() ) {
				$(".unavailable_msg").hide();
				var mainImg = document.getElementById('imgMain');
				if (!mainImg) {mainImg = $(".imgMain");}
				mainImg.src = item['product_image'];
				cur_handle = item['handle'];
				if ($("#" + cur_handle).val() == 0) {
					part_ex = 1;
					cur_handle = '';
				}
			}
		});
		if (cur_handle == "" && part_ex==0) {
			match_vgp = $(this).find("a").html().trim().toLowerCase();
			maincontent.forEach(function (item, index) {
				item['variant_code'] = item['variant_code'].replace('N/A', "Unavailable").toLowerCase();
				var vc = item['variant_code'].split("$##$");
				if(vc.find(matching_vc))
				{
					cur_handle = item['handle'];
					if ($("#" + cur_handle).val() == 0) {
						cur_handle = '';
					}
				}
			});
		}
		if (cur_handle == "") {
			$(this).find("a").attr("data-original-title", "Out of Stock");
			$(this).find("a").attr("title", "Out of Stock");
		}
	});
	function matching_vc(arg){
		return (match_vgp==arg)?true:false;
	}
	$(".variant-images .variant_pro").click(function (e) {
		if (cur_handle != "") {
			window.location.href = BASE_PATH + "/products/" + cur_handle;
		}
	});
	$(".variant-images .variant_pro").mouseleave(function () {
		$(".unavailable_msg").hide();
		var main_img = document.getElementById('main_img_lg').value;
		var mainImg = document.getElementById('imgMain');
		if (!mainImg) {mainImg = $(".imgMain");}
		cur_handle = '';
		mainImg.src = main_img;
	});
	$("#contact_us_btn").on("click", function () {
		$("#contact_us_model").show();
	});
	$(".contact_us_btn").on("click", function () {
		$("#contact_us_model").show();
		$("#contact_part_number").val($(this).attr("data-part"));
	});
	$("#close_popup").on('click', function () {
		$("#contact_us_model").hide();
	});
	if (CONTROLL == "products" && (ACTION == "index" || ACTION == "collection" || ACTION == "mywishlist")) {
		var option = '';
		let min_price_filter = min_price;
		let max_price_filter = max_price;
		var count = manufacturer_keys.length;
		manufacturer_values.sort();
		for (var g = 0; g < count; g++) {
			var str = manufacturer_values[g].split("#@#");
			if ($.inArray(str[1], filter_products.manufacture) >= 0) option += '<option selected="selected" value="' + str[1] + '">' + str[0] + '</option>';
			else option += '<option value="' + str[1] + '">' + str[0] + '</option>';
		}
		var counts = [products_per_row, "25", "50", "75", "100", "125"];
		var counts_options = '';
		for (var k = 0; k < counts.length; k++) {
			counts_options += '<option value="' + counts[k] + '">' + counts[k] + '</option>';
		}
		$('#productlimiter').append(counts_options);
		$('#productlimiter_sample').append(counts_options);
		$('#selectManufacture').append(option);
		$('#selectManufacture').multiselect({
			columns: 1,
			placeholder: 'Brands',
			search: true
		});
		var instance = $('#selectManufacture');
		var placeholder = $(instance).next('.ms-options-wrap').find('> button:first-child');
		var optionsWrap = $(instance).next('.ms-options-wrap').find('> .ms-options');
		var select = optionsWrap.parent().prev();
		optionsWrap.on('click', 'input[type="checkbox"]', function () {
			optionsWrap.find('input[type="checkbox"]').prop("disabled", true);
			$(this).closest('li').toggleClass('selected');
			var select = optionsWrap.parent().prev();
			let selOpts = [];
			select.find('option[value="' + $(this).val() + '"]').prop('selected', $(this).is(':checked')).closest('select').trigger('change');
			select.find('option:selected').each(function () {
				if ($(this).val() == "") {
					selOpts.push('null');
				} else {
					if ($(this).val() == "Unknown") {
						selOpts.push(0);
					} else {
						selOpts.push($(this).val());
					}
				}
			});
			filter_products.manufacture = selOpts;
			load_products();
		});
		$("#slider-range").slider({
			range: true,
			min: min_price,
			max: max_price,
			values: [min_price, max_price],
			slide: function (event, ui) {
				$("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
				min_price_filter = Number(ui.values[0]);
				max_price_filter = Number(ui.values[1]);
				var select = optionsWrap.parent().prev();
				let selOpts = [];
				select.find('option[value="' + $(this).val() + '"]').prop('selected', $(this).is(':checked')).closest('select').trigger('change');
				select.find('option:selected').each(function () {
					if ($(this).val() == "") {
						selOpts.push('null');
					} else {
						selOpts.push($(this).val());
					}
				});
			}
		});
		if ($("#slider-range").length == true) {
			setTimeout(function () {
				$("#amount").val("$" + $("#slider-range").slider("values", 0) + " - $" + $("#slider-range").slider("values", 1));
			}, 1500);
		}
		if (view === 'grid') {
			$('.btn-filter.fa-th-large').addClass('text-primary');
			$('.btn-filter.fa-th-list').removeClass('text-primary');
		} else {
			$('.btn-filter.fa-th-list').addClass('text-primary');
			$('.btn-filter.fa-th-large').removeClass('text-primary');
		}
		setTimeout(function () {
			if ($('#filtered_products > div').length > 0) {
				setHeight($('#filtered_products > div'));
			} else if ($('#filtered_products > li').length > 0) {
				setHeight($('#filtered_products > li'));
			}
		}, 1000);
		if ($("#productlimiter_sample").length > 0) {
			$("#productlimiter_sample").on('change', function () {
				var show_count = this.value;
				products_per_row = show_count;
				var select = optionsWrap.parent().prev();
				let selOpts = [];
				select.find('option[value="' + $(this).val() + '"]').prop('selected', $(this).is(':checked')).closest('select').trigger('change');
				select.find('option:selected').each(function () {
					if ($(this).val() == "") {
						selOpts.push('null');
					} else {
						selOpts.push($(this).val());
					}
				});
				applyFilters(selOpts, min_price_filter, max_price_filter, '');
			});
		}
		if ($("#productlimiter").length > 0) {
			$("#productlimiter").val(item_per_page);
			$("#productlimiter").selectbox({
				onChange: function (val, inst) {
					var show_count = val;
					products_per_row = show_count;
					var select = optionsWrap.parent().prev();
					let selOpts = [];
					select.find('option[value="' + $(this).val() + '"]').prop('selected', $(this).is(':checked')).closest('select').trigger('change');
					select.find('option:selected').each(function () {
						if ($(this).val() == "") {
							selOpts.push('null');
						} else {
							selOpts.push($(this).val());
						}
					});
					item_per_page = $(this).val();
					load_products();
				}
			});
		}
	}
	if ($("#store_theme").length == 1 && ($("#store_theme").val() == "SAMPLE" || $("#store_theme") == "DEFAULT")) {
		$(".sub-menu li").hover(function () {
			if ($(this).height() > 30) {
				$(this).children("ul").css("margin-top", "-45px");
			}
		});
	}
	$('img').each(function () {
		var a = $(this).attr('data-filename');
		if (a != undefined && a != "") {
			if ($(this).width() >= $(window).width()) {
				$(this).css("width", "100%", "!important");
			}
		}
	});
	$(".product-description *").each(function () {
		if ($(this).width() >= $(this).closest(".panel-body").width()) {
			$(this).css("width", "100%", "!important");
		}
	});
	if ($('#reviewlist > li').length > 0) {
	}
	if ($('#filtered_products > li').length > 0) {
		$("#filtered_products_section").val("li");
	} else if ($('#filtered_products > div').length > 0) {
		$("#filtered_products_section").val("div");
	}
	if ($('#filter_slider').length) {
		$('#filter_slider').slideReveal({
			push: false,
			position: "left",
			trigger: $(".handle"),
			shown: function (obj) {
				obj.find(".handle").html('<i class="fa fa-arrow-left">Filters</i>');
				obj.addClass("left-shadow-overlay");
			},
			hidden: function (obj) {
				obj.find(".handle").html('<i class="fa fa-arrow-right">Filters</i>');
				obj.removeClass("left-shadow-overlay");
			}
		});
	}
});

function setHeight(col) {
	var $col = $(col);
	var $maxHeight = 0;
	$col.each(function () {
		var $thisHeight = $(this).outerHeight() - 20;
		if ($thisHeight > $maxHeight) {
			$maxHeight = $thisHeight;
		}
	});
	$("#spinner").css("display", "none");
}

function apply_text_length() {
	$(".webpt").each(function () {
		if (isUpperCase($(this).text())) {
			var st = $(this).text();
			$(this).text(st.substring(0, 20) + "..");
		}
	});
}

function isUpperCase(str) {
	return str === str.toUpperCase();
}

function changeMainImage(e, evt) {
	evt.preventDefault();
	var mainImg = document.getElementById('imgMain');
	var mainImgZoom = document.getElementById('imgMainZoom');
	if (mainImg) {
		mainImg.src = e.dataset.large;
	}
	mainImgZoom.src = e.dataset.xlarge;	
}

function getProductImg($url, $size) {
	let $image = '../img/no-product.png';
	if ($url) {
		let $imgName = $url.split('part_images/');
		$image = $imgName[0] + 'thumb/' + $size + '_' + $imgName[1];
	}
	return $image;
}
var recaptchaUserCreateCallback = function recaptchaUserCreateCallback(response) {
	$("#hiddenRecaptcha").val(response);
};
var recaptchaUserForgetCallback = function recaptchaUserForgetCallback(response) {
	$("#hiddenRecaptchaForget").val(response);
};
var recaptchaCallback = function recaptchaCallback(response) {
	$("#hiddenRecaptchaContactus").val(response).css('color','#f00');
};
var recaptchaCallbackReview = function recaptchaCallbackReview(response) {
	$("#hiddenRecaptchaReview").val(response);
};

function applyFilters(selOpts, min_price_filter, max_price_filter, catOpts) {
	var filtered_products = [];
	var products = all_products;
	if (catOpts) {
		filtered_products = [];
		var k = 0;
		for (var j = 0; j < products.length; j++) {
			if ((
				(products[j]['Category']['id'] == catOpts.id && catOpts.type == 'c') || (products[j]['Category']['parent_category_id'] == catOpts.id && catOpts.type == 'p') || (products[j]['Category']['parent_category_id'] == null && products[j]['Category']['id'] == catOpts.id && catOpts.type == 'p'))) {
				filtered_products[k] = products[j];
				k++;
			}
		}
		displayFilteredProducts(filtered_products);
	} else if (selOpts.length > 0) {
		filtered_products = [];
		var k = 0;
		for (var i = 0; i < selOpts.length; i++) {
			for (var j = 0; j < products.length; j++) {
				if (products[j]['Manufacturer']['manufacture_name'] == null) {
					products[j]['Manufacturer']['manufacture_name'] = "Unknown";
				}
				var man_name = products[j]['Manufacturer']['manufacture_name'].charAt(0).toUpperCase() + products[j]['Manufacturer']['manufacture_name'].slice(1).toLowerCase();
				if (man_name == selOpts[i] && (products[j]['PartPriceLevel']['price'] >= min_price_filter && products[j]['PartPriceLevel']['price'] <= max_price_filter)) {
					filtered_products[k] = products[j];
					k++;
				}
			}
		}
		displayFilteredProducts(filtered_products);
	} else {
		filtered_products = [];
		var k = 0;
		for (var j = 0; j < products.length; j++) {
			if (products[j]['PartPriceLevel']['price'] >= min_price_filter && products[j]['PartPriceLevel']['price'] <= max_price_filter) {
				filtered_products[k] = products[j];
				k++;
			}
		}
		displayFilteredProducts(filtered_products);
	}
}

function displayFilteredProducts(filtered_products) {
	var minimized = ((tileCount == 2) ? true : false);
	var size = 'md';
	var strLen = 60;
	if (minimized) {
		var strLen = 15;
		var size = 'sm';
	}
	var data_pro = "";
	if (filtered_products.length > 0) {
		for (var m = 0; m < filtered_products.length; m++) {
			var url = filtered_products[m]['Part']['part_image_url'];
			var image = getProductImg(url, size);
			var height = '';
			if (image == "../img/no-product.png" && size == 'sm' && view === 'grid') {
				height = "height:150px !important";
			} else {
				if (view === 'grid') {
					height = "width:auto !important";
				} else {
					height = "margin-left:5px;";
				}
			}
			if (view === 'list') {
				if ($("#filtered_products_section").val() == "div" || $('#filtered_products > div').length > 0) {
					data_pro += '<div class="col-md-12 m10-0 product_grids">';
				} else if ($("#filtered_products_section").val() == "li" || $('#filtered_products > li').length > 0) {
					data_pro += '<li class="col-md-12 m10-0">';
				}
			} else {
				if ($("#filtered_products_section").val() == "div" || $('#filtered_products > div').length > 0) {
					data_pro += '<div class="col-lg-' + tileCount + ' col-md-4 col-sm-4 col-xs-6 product_grids" >';
				} else if ($("#filtered_products_section").val() == "li" || $('#filtered_products > li').length > 0) {
					data_pro += '<li class="col-lg-' + tileCount + ' col-md-4 col-sm-4 col-xs-6">';
				}
			}
			if ($("#filtered_products_section").val() == "li" || $('#filtered_products > li').length > 0) {
				data_pro += '<a class="wrapper" href="/products/' + filtered_products[m]['Part']['handle'] + '">';
			}
			if (view === 'list') {
				if ($("#filtered_products_section").val() == "div" || $('#filtered_products > div').length > 0) {
					data_pro += '<div data-product-id="' + filtered_products[m]['Part']['id'] + '" class="productListView chkProductID">';
					data_pro += '<div class="media">';
					var cls = "list_img";
					data_pro += '<div class="media-left productThumb">';
					data_pro += "<div style='width:231px;background-color: transpatant;position: relative;'>";
					data_pro += '<img src="' + image + '" class="' + cls + '" alt="" style="width:231px;position:relative;top:0;right:0;bottom:0;left:0;margin:auto;" >';
					data_pro += "</div>";
					data_pro += '</div>';
					data_pro += '<div class="media-body productInfo">';
					data_pro += '<div class="productTitle"><h3><a href="/products/' + filtered_products[m]['Part']['handle'] + '">';
					if (filtered_products[m]['Part']['website_part_title'].length > 60) {
						data_pro += filtered_products[m]['Part']['website_part_title'].substring(0, 60) + '..';
					} else {
						data_pro += filtered_products[m]['Part']['website_part_title'].substring(0, 60);
					}
					data_pro += '</a></h3>';
					if (filtered_products[m]['Manufacturer']["manufacture_name"] != '' && filtered_products[m]['Manufacturer']["manufacture_name"] != null) {
						data_pro += '<h5 class="manuf">' + filtered_products[m]['Manufacturer']["manufacture_name"] + '</h5>';
					}
					data_pro += '<span class="price">' + filtered_products[m]['PartPriceLevel']['price_label'] + '</span></div>';
					data_pro += '<div class="sortDesc"><p>Part# <small>' + filtered_products[m]['Part']['part_number'] + '</small></p>';
					if (filtered_products[m]['Part']["website_part_description"] != '' && filtered_products[m]['Part']["website_part_description"] != null) {
						data_pro += '<p>' + filtered_products[m]['Part']["website_part_description"] + '</p>';
					}
					data_pro += '</div>';
					var checkInventory = true;
					var inStock = false;
					var stock = '<span class="text-danger">Out of Stock!</span>';
					if (filtered_products[m]['Part']['check_inventory'] || filtered_products[m]['Part']['stock'] == 1) {
						stock = '<span class="text-success">In Stock</span>';
						checkInventory = false;
						inStock = true;
					}
					if (filtered_products[m]['Part']['stock'] > 0) {
						stock = '<span class="text-success">In Stock</span>';
						inStock = true;
					}
					var str = '';
					str += '<div class="pdMetas"><ul class="clear"><input type="hidden" id="numProductQty" value="1" />';
					if (pl_value == 2) {
						if (inStock) {
							var st = true;
							if (st == true) {
								str += '<li><a href="#" onclick="var count = 1; if(!' + checkInventory + ') { count = 1;  } addToCart(\'' + filtered_products[m]['Part']['handle'] + '\', count, ' + checkInventory + ');$(this).removeAttr(\'onclick\');$(this).attr(\'href\',\'' + DSSF_PAGE_HOME + '/cart\');$(this).html(\'<i class=\'fa fa-fw fa-shopping-cart\'></i> GO TO CART\');return false;"><i class="fa fa-fw fa-shopping-cart"></i> ADD TO CART</a></li>';
							} else {
								str += '<li><a href="' + DSSF_PAGE_HOME + '/cart"><i class="fa fa-fw fa-shopping-cart"></i> GO TO CART</a></li>';
							}
						} else {
							str += '<li><a href="javascript:void(0);"><span class="text-danger"><i class="fa fa-cart-arrow-down"></i> Out of stock</span></a></li>';
						}
					} else {}
					str += '<li><a  href="javascript:;"  data-id="' + filtered_products[m]['Part']['category_id'] + '" data-type="' + category_type[filtered_products[m]['Part']['category_id']] + '" onclick="category_filter(' + filtered_products[m]['Part']['category_id'] + ',\'' + category_type[filtered_products[m]['Part']['category_id']] + '\')" ><i class="fa fa-tags"></i>' + categoriesid[filtered_products[m]['Part']['category_id']] + '</a></li>';
					str += '<li>';
					str += '<center><div class="rating product-rating bottom_rating" style=\'display: inline-block!important;\' >';
					var min = 1;
					var max = 9999;
					var random = Math.floor(Math.random() * (+max - +min)) + +min;
					var rid = "rateYo_" + filtered_products[m]['Part']['id'] + "_" + random;
					var wid = "110px";
					if (filtered_products[m]['Part']['avg_rating'].length < 2) {
						wid = "100px";
					} else if (filtered_products[m]['Part']['avg_rating'].length > 2) {
						wid = "117px";
					}
					str += '<div id="' + rid + '"></div>';
					str += '<div class="counter" style="float: left;font-family:serif;margin-left: ' + wid + ';margin-top: -12px;">(' + filtered_products[m]['Part']['avg_rating'] + ')</div>';
					str += '<input class="rating_value" value="' + filtered_products[m]['Part']['avg_rating'] + '" type="hidden"/>';
					str += '<script>'
					str += '$(function () {';
					str += '$("#' + rid + '").rateYo({';
					str += 'starWidth: "12px",';
					str += 'normalFill: "transparent",';
					str += 'ratedFill: "#FDB634",';
					str += 'spacing: \'2px\','
					str += 'rating: ' + filtered_products[m]['Part']['avg_rating'] + ',';
					str += 'readOnly: true';
					str += '});';
					str += '$("polygon").css("stroke","#999");';
					str += '});</script>';
					str += '</div></center>';
					str += '</li>';
					str += '</ul></div>';
					data_pro += str;
					data_pro += '</div>';
					data_pro += '</div>';
					data_pro += '</div>';
				} else if ($("#filtered_products_section").val() == "li" || $('#filtered_products > li').length > 0) {
					data_pro += '<div class="flex-wrap border light">';
					data_pro += '<div class="flex"><div class="thumb md">';
					data_pro += '<img src="' + image + '" alt="" style="' + height + '">';
					data_pro += '</div></div><div class="flex flex-auto"><div class="col-md-9"><h4 class="pb10">';
					if (filtered_products[m]['Part']['website_part_title'].length > 60) {
						data_pro += '<strong>' + filtered_products[m]['Part']['website_part_title'].substring(0, 60) + '..</strong>';
					} else {
						data_pro += '<strong>' + filtered_products[m]['Part']['website_part_title'].substring(0, 60) + '</strong>';
					}
					if (filtered_products[m]['Manufacturer']['manufacture_name'] != null) {
						data_pro += '<br><small>by ' + filtered_products[m]['Manufacturer']['manufacture_name'] + '</small>';
					}
					data_pro += '</h4>';
					data_pro += '<p>Part# <small>' + filtered_products[m]['Part']['part_number'] + '</small></p>';
					if (filtered_products[m]['Part']['model'] != "") {
						data_pro += '<p>Model <small>' + filtered_products[m]["Part"]["model"] + '</small></p>';
					}
					data_pro += '</div><div class="col-md-3">';
					data_pro += '<h4><strong>' + filtered_products[m]['PartPriceLevel']['price_label'] + '</strong><br><small>Free Shipping**</small></h4>';
					data_pro += '</div>';
					data_pro += '</div>';
					data_pro += '</div>';
				}
			} else {
				if ($("#filtered_products_section").val() == "div" || $('#filtered_products > div').length > 0) {
					data_pro += '<div data-product-id="' + filtered_products[m]['Part']['id'] + '" class="productBorder chkProductID">';
					var cls = "home_img";
					data_pro += "<div style='width:100%;height:190px;background-color: transpatant;position: relative;'>";
					data_pro += '<img src="' + image + '" alt="" class="img-responsive ' + cls + '" style="max-width:100%;max-height: 190px;position:absolute;top:0;right:0;bottom:0;left:0;margin:auto;">';
					data_pro += "</div>";
					data_pro += '<div class="productBorderHover verticalMiddle">';
					data_pro += '<a href="/products/' + filtered_products[m]['Part']['handle'] + '">';
					data_pro += '<div class="verticalInner">';
					data_pro += '<h4>';
					if (filtered_products[m]['Part']['website_part_title'].length > 60) {
						data_pro += filtered_products[m]['Part']['website_part_title'].substring(0, 60) + '..';
					} else {
						data_pro += filtered_products[m]['Part']['website_part_title'].substring(0, 60);
					}
					data_pro += '</h4>';
					data_pro += '<!--p class="rating">';
					data_pro += '</p-->';
					data_pro += '<div class="price">';
					data_pro += '<span class="amount">' + filtered_products[m]['PartPriceLevel']['price_label'] + '</span>';
					data_pro += '</div>';
					data_pro += '</a>';
					data_pro += '</div>';
					data_pro += '</div>';
					data_pro += '<div class="frontinfo">';
					data_pro += '<h4 class="mainshopthumb">';
					data_pro += '<a href="/products/' + filtered_products[m]['Part']['handle'] + '">';
					var limt = 60;
					if (tileCount == 2) {
						limt = 30;
					} else if (tileCount == '5ths') {
						limt = 40;
					} else if (tileCount == 3) {
						limt = 50;
					}
					if (filtered_products[m]['Part']['website_part_title'].length > limt) {
						data_pro += filtered_products[m]['Part']['website_part_title'].substring(0, limt) + '..';
					} else {
						data_pro += filtered_products[m]['Part']['website_part_title'].substring(0, limt);
					}
					data_pro += '</a>';
					data_pro += '</h4>';
					if (filtered_products[m]['Manufacturer']["manufacture_name"] != '' && filtered_products[m]['Manufacturer']["manufacture_name"] != null) {
						data_pro += '<h5 class="manuf">' + filtered_products[m]['Manufacturer']["manufacture_name"] + '</h5>';
					}
					data_pro += '<center><div class="rating product-rating bottom_rating" style=\'display: inline-block!important;\' >';
					var min = 1;
					var max = 9999;
					var random = Math.floor(Math.random() * (+max - +min)) + +min;
					var rid = "rateYo_" + filtered_products[m]['Part']['id'] + "_" + random;
					var wid = "110px";
					if (filtered_products[m]['Part']['avg_rating'].length < 2) {
						wid = "100px";
					} else if (filtered_products[m]['Part']['avg_rating'].length > 2) {
						wid = "117px";
					}
					data_pro += '<div id="' + rid + '"></div>';
					data_pro += '<div class="counter" style="float: left;font-family:serif;margin-left: ' + wid + ';margin-top: -10px;">(' + filtered_products[m]['Part']['avg_rating'] + ')</div>';
					data_pro += '<input class="rating_value" value="' + filtered_products[m]['Part']['avg_rating'] + '" type="hidden"/>';
					data_pro += '<script>'
					data_pro += '$(function () {';
					data_pro += '$("#' + rid + '").rateYo({';
					data_pro += 'starWidth: "12px",';
					data_pro += 'normalFill: "transparent",';
					data_pro += 'ratedFill: "#FDB634",';
					data_pro += 'spacing: \'2px\','
					data_pro += 'rating: ' + filtered_products[m]['Part']['avg_rating'] + ',';
					data_pro += 'readOnly: true';
					data_pro += '});';
					data_pro += '$("polygon").css("stroke","#999");';
					data_pro += '});</script>';
					data_pro += '</div></center>';
					data_pro += '<div class="amount">' + filtered_products[m]['PartPriceLevel']['price_label'] + '</div>';
					data_pro += '</div>';
					data_pro += '<ul class="productMetas">';
					data_pro += '<li><a href="/products/product_quick/' + filtered_products[m]['Part']['handle'] + '" class="ajax-view"><span><i class="fa fa-eye"></i></span> Quick View</a></li>';
					data_pro += '<li><a href="#"><span><i class="fa fa-shopping-cart"></i></span> Add to Cart</a></li>';
					data_pro += '<li><a href="#"><span><i class="fa fa-heart-o"></i></span> Wishlist</a></li>';
					data_pro += '</ul>';
					data_pro += '<span class="linetop"></span>';
					data_pro += '<span class="lineright"></span>';
					data_pro += '<span class="linebottom"></span>';
					data_pro += '<span class="lineleft"></span>';
					data_pro += '</div>';
				} else if ($("#filtered_products_section").val() == "li" || $('#filtered_products > li').length > 0) {
					data_pro += '<div class="thumbnail con-product inner_div"><div class="img-wrapper thumb">';
					data_pro += '<img src="' + image + '" alt="" style="' + height + '">';
					data_pro += '</div>';
					data_pro += '<div class="text-caption">';
					data_pro += '<p class="webpt">';
					var limt = strLen;
					if (filtered_products[m]['Part']['website_part_title'].length > limt) {
						filtered_products[m]['Part']['website_part_title'] = filtered_products[m]['Part']['website_part_title'].substring(0, limt) + "...";
					}
					data_pro += filtered_products[m]['Part']['website_part_title'];
					data_pro += '</p>';
					data_pro += '<p class="text-danger">' + filtered_products[m]['PartPriceLevel']['price_label'] + '</p>';
					data_pro += '</div></div>';
				}
			}
			if ($("#filtered_products_section").val() == "div" || $('#filtered_products > div').length > 0) {
				data_pro += '</div>';
			} else if ($("#filtered_products_section").val() == "li" || $('#filtered_products > li').length > 0) {
				data_pro += '</li>';
			}
		}
	} else {
		data_pro += '<br><br><br><h3 class="text-center">OOPS! No Products Found!</h3><br><br><br>';
	}
	$("#filtered_products").html("");
	$("#filtered_products").html(data_pro);
	$(".webpt").each(function (index) {
		var p_tag_height = $(this).height();
		var limt = 20;
		if (p_tag_height > limt) {
			$(this).html($(this).html().substr(0, 25) + "...");
		}
	});
}

function download_receipt() {
	$("#download_receipt").html("<img src='"+BASE_PATH+"/img/loading1.gif'>Loading...").attr("onclick","javascript:void(0);");
	$.ajax({
		url: BASE_PATH + '/checkout/download_receipt/' + $("#generated_id").val(),
		type: "post",
		data: {
			generated_id: $("#generated_id").val()
		},
		success: function (data) {
			$("#download_receipt").html("Download Receipt").attr("onclick","download_receipt();");
			window.location.href = BASE_PATH + "/checkout/save_pdf/" + data;
		}
	});
}

function OpenForgotPass() {
	$("#forgot_password").modal();
}
$(document).ready(function () {
	setTimeout(function () {
		var wishlist_part = getCookie('WISHLISTPART');
		var con_obj = $("#contact_user_id");
		if (wishlist_part != '' && con_obj.length > 0 && con_obj.val() != '') {
			msg = "Added to wishlist";
			icon = 'fa-heart';
			setCookie('WISHLISTPART', '', 0);
			$.notify({
				title: "",
				icon: 'fa ' + icon,
				message: msg
			}, {
				timer: 1000,
				type: 'success',
				animate: {
					enter: 'animated lightSpeedIn',
					exit: 'animated lightSpeedOut'
				}
			});

		}
	}, 2500);
});
$(document).on('click', '.add_wishlists', function () {
	var part_id = $(this).attr("data-part");
	setCookie('WISHLISTPART', part_id, 0);
	$("#signin_signup").show();
	$(".guest_acc").hide();
});
$(document).on('click', '.add_my_wishlists', function () {
	var part_id = $(this).attr("data-part");
	var obj = $(this);
	var list_view = $("#part_" + part_id).length;
	if (list_view) {
		$("#part_" + part_id).remove();
		if ($(".product_grids").length == 0) {
			$("#filtered_products1").html("<br><br><br><h3 class='text-center'>OOPS! No Products Found!</h3><br><br><br>");
		}
	}
	var search_val = parseInt(obj.html().search("fa-heart-o"));
	var msg = "Removed from wishlist";
	var icon = 'fa-heart-o';
	if (search_val >= 0) {
		msg = "Added to wishlist";
		icon = 'fa-heart';
	}
	if (!list_view) {
		obj.html("<span><i class='fa fa-spinner fa-spin'></i></span> Loading....");
	}
	$.ajax({
		url: BASE_PATH + '/products/add_wishlist/',
		type: "post",
		data: {
			'id': part_id,
			'msg': msg
		},
		success: function (data) {
			if (!list_view) {
				if (obj.attr('data-btn')) {
					data = "<button class='btn btn-warning btn-add-cart '>" + data + "</button>";
				}
				obj.html(data);
			}
			
			$.notify({
				title: "",
				icon: 'fa ' + icon,
				message: msg
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
	if ($(this).attr("data-load") == 1) {
		window.location.reload();
	}
});

function email_validation(arg) {
	var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	if (!emailReg.test(arg)) {
		return false;
	} else {
		return true;
	}
}
$(document).on('click', '.newsletter_submit', function (e) {
	var tim = $(this).attr('data_news');
	var obj = $("#" + this.id);
	obj.val("Loading...").attr("disabled", true);
	var name = $("#newsletter_name_" + tim).val();
	var email = $("#newsletter_email_" + tim).val();
	var sh = 0;
	if (name == '') {
		
		$.notify({
			title: "<strong>Name</strong> ",
			icon: 'glyphicon glyphicon-user',
			message: "must not be empty!"
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
		
		$("#newsletter_name_" + tim).focus();
		obj.val("Submit").attr("disabled", false);
		sh++;
	}
	if (email == '' || !email_validation(email)) {
		
		$.notify({
			title: "<strong>Email</strong> ",
			icon: 'glyphicon glyphicon-envelope',
			message: (email != '') ? "invalid" : "must not be empty!"
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
		
		$("#newsletter_email_" + tim).focus();
		obj.val("Submit").attr("disabled", false);
		sh++;
	}
	if (sh > 0) {
		return false;
	}
	$.ajax({
		type: "POST",
		url: BASE_PATH + "/ajax/signup_newsletter",
		cache: false,
		data: {
			'name': name,
			'email': email
		},
		success: function (data) {
			var json = $.parseJSON(data);
			if (json.status == true) {
				$("#newsletter_name_" + tim).val('');
				$("#newsletter_email_" + tim).val('');
				
				$.notify({
					title: "<strong>Newsletter</strong> ",
					icon: 'glyphicon glyphicon-envelope',
					message: "Thanks for signing up!"
				}, {
					offset: {
						x: 50,
						y: 200
					},
					timer: 1000,
					type: 'success',
					animate: {
						enter: 'animated lightSpeedIn',
						exit: 'animated lightSpeedOut'
					}
				});
				
			} else {
				
				$.notify({
					title: "<strong>Error:</strong> ",
					icon: 'glyphicon glyphicon-envelope',
					message: json.response
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
				
			}
			obj.val("Submit").attr("disabled", false);
		}
	});
});
function setCookie(name, value, days) {
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return false;
}

function eraseCookie(name) {
	document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
function gotomenu(arg, url, obj) {
	var name = "CURRENT_MENU";
	setCookie(name, arg, 0);
	if ($(obj).attr('target') == '_blank') {
		window.open(url, $(obj).attr('target'));
	} else {
		window.location.href = url;
	}
}

function gotoCart(arg) {
	$.confirm({
		title: '',
		type: 'orange',
		typeAnimated: true,
		content: 'This product is already in the cart. Do you want to proceed to cart?',
		buttons: {
			cancel: {
				text: 'No',
				btnClass: 'btn-default',
				keys: ['esc', 'n'],
				action: function () {
				}
			},
			confirm: {
				text: 'Yes',
				btnClass: 'btn-warning',
				keys: ['enter', 'y'],
				action: function () {
					window.location.href = arg;
				},
			}
		}
	});
}
setTimeout(function () {
	if ($(".pix_sc_slider1").length > 0) {
		$('.pix_sc_slider1').flexslider({
			animation: "slide",
			pauseOnHover: true,
			directionNav: false,
			smoothHeight: true,
			slideshow: true,
			easing: "easeOutQuad",
			useCSS: false,
			touch: true,
			slideshow: false,
			controlNav: true,
			slideshowSpeed: 7000,
			animationSpeed: 600,
			initDelay: 0,
			start: function (slider) { 
				var slide_count = slider.count - 1;
				$(slider).find('img.lazy:eq(0)').each(function () {
					var src = $(this).attr('data-src');
					$(this).attr('src', src).removeAttr('data-src');
				});
			},
			before: function (slider) {
				var slides = slider.slides,
					index = slider.animatingTo,
					$slide = $(slides[index]),
					$img = $slide.find('img[data-src]'),
					current = index,
					nxt_slide = current + 1,
					prev_slide = current - 1;
				$slide.parent().find('img.lazy:eq(' + current + '), img.lazy:eq(' + prev_slide + '), img.lazy:eq(' + nxt_slide + ')').each(function () {
					var src = $(this).attr('data-src');
					$(this).attr('src', src).removeAttr('data-src');
				});
			}
		});
	}
}, 1000);

function page_slider() {
	$('.pix_sc_slider1').flexslider({
		animation: "slide",
		pauseOnHover: true,
		directionNav: false,
		smoothHeight: true,
		slideshow: true,
		easing: "easeOutQuad",
		useCSS: false,
		slideshowSpeed: 3000,
		start: function (slider) { 
			var slide_count = slider.count - 1;
			$(slider).find('img.lazy:eq(0)').each(function () {
				var src = $(this).attr('data-src');
				$(this).attr('src', src).removeAttr('data-src');
			});
		},
		before: function (slider) {
			var slides = slider.slides,
				index = slider.animatingTo,
				$slide = $(slides[index]),
				$img = $slide.find('img[data-src]'),
				current = index,
				nxt_slide = current + 1,
				prev_slide = current - 1;
			$slide.parent().find('img.lazy:eq(' + current + '), img.lazy:eq(' + prev_slide + '), img.lazy:eq(' + nxt_slide + ')').each(function () {
				var src = $(this).attr('data-src');
				$(this).attr('src', src).removeAttr('data-src');
			});
		}
	});
}
var asidebar = false;
$(document).ready(function() {
    setTimeout(function() {
        slider();
    }, 1000);
});

function slider(){
$('.lazy-slider').slick({		
		lazyLoad: 'ondemand',
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows:true,
		dots: true,
		autoplay: true,
		autoplaySpeed: 3000,
		nextArrow: '<i class="fa fa-arrow-right"></i>',
		prevArrow: '<i class="fa fa-arrow-left"></i>',
	});
}
$(document).ready(function () {
	$('content').each(function (i) {
		var ObjParent = $(this).parent();
		var content_id = $(this).attr('data-id');
		$.ajax({
			type: "POST",
			url: BASE_PATH + "/ajax/getcontent",
			cache: false,
			data: {
				'content_id': content_id
			},
			success: function (res) {
				ObjParent.html(res);
			}
		});
	});
	function call_wid(){
		$('upcoming').each(function (i) {
			var ObjParent = $(this).parent();
			ObjParent.html("<center><img src='img/loading1.gif'>Loading upcoming...</center>");
			$.ajax({
				type: "POST",
				url: BASE_PATH + "/ajax/upcoming_events",
				data: {
					'title': $(this).attr("data-title")
				},
				cache: false,
				success: function (res) {
					ObjParent.html(res);
				}
			});
		});
		$('upcoming_events').each(function (i) {
			var ObjParent = $(this).parent();
			ObjParent.html("<center><img src='img/loading1.gif'>Loading upcoming events...</center>");
			$.ajax({
				type: "POST",
				url: BASE_PATH + "/ajax/upcoming_events/misc",
				data: {
					'title': $(this).attr("data-title")
				},
				cache: false,
				success: function (res) {
					ObjParent.html(res);
				}
			});
		});
		$('upcoming_courses').each(function (i) {
			var ObjParent = $(this).parent();
			ObjParent.html("<center><img src='img/loading1.gif'>Loading upcoming courses...</center>");
			$.ajax({
				type: "POST",
				url: BASE_PATH + "/ajax/upcoming_events/course",
				data: {
					'title': $(this).attr("data-title")
				},
				cache: false,
				success: function (res) {
					ObjParent.html(res);
				}
			});
		});
		$('upcoming_trips').each(function (i) {
			var ObjParent = $(this).parent();
			ObjParent.html("<center><img src='img/loading1.gif'>Loading upcoming trips...</center>");
			$.ajax({
				type: "POST",
				url: BASE_PATH + "/ajax/upcoming_events/travel&charter",
				data: {
					'title': $(this).attr("data-title")
				},
				cache: false,
				success: function (res) {
					ObjParent.html(res);
				}
			});
		});
		$('gallery').each(function (i) {
			var ObjParent = $(this).parent();
			ObjParent.html("<center><img src='img/loading1.gif'>Loading gallery...</center>");
			var album_id = $(this).attr('data-id');
			var album_type = $(this).attr('data-type');
			$.ajax({
				type: "POST",
				url: BASE_PATH + "/ajax/getalbum",
				cache: false,
				data: {
					'album_id': album_id
				},
				success: function (res) {
					var response = $.parseJSON(res);
					if (response.status == true) {
						var html = '';
						if (album_type == 1) {
							html += '<div class="lazy-slider">';
						} else if (album_type == 2) {
							html += '<div class="row gallery-filterable fullwidth">';
						}
						$.each(response.data, function (i, item) {
							var img_count = response.data.length;
							if (album_type == 1) {
								if( img_count == 1 ){
									html += '<div class="slick-item"><img class="lazy-image single-image" src="' + item.link + '" /></div>';
								}
								else{
								html += '<div class="slick-item"><img class="lazy-image" data-lazy="' + item.link + '" /></div>';
								}
							} else if (album_type == 2) {
								html += '<div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">';
								html += '<div class="portfolio-item">';
								html += '<div class="portfolio-hover">';
								html += '<a href="' + item.link + '" data-lightbox="product">';
								html += '<img src="' + item.link + '" alt="portfolio" class="img-responsive">';
								html += '</a>';
								html += '</div>';
								html += '<div class="portfolio_details"></div>';
								html += '</div>';
								html += '</div>';
							}
						});
						if (album_type == 1) {
							html += '</div>';
						} else if (album_type == 2) {
							html += '</div>';
						}
						ObjParent.html(html);
						if (album_type == 1) {
							page_slider();
						} else if (album_type == 2) {}
					} else {
					}
					
				}
			});
		});
		$('customform').each(function (i) {
			var ObjParent = $(this).parent();
			ObjParent.html("<center><img src='img/loading1.gif'>Loading form...</center>");
			var form_id = $.trim($(this).attr('data-id'));
			//alert(form_id)
			$.ajax({
				type: "POST",
				url: BASE_PATH + "/ajax/render_form",
				cache: false,
				data: {
					'form_id': form_id
				},
				success: function (html) {
					ObjParent.html(html);
					setTimeout(function(){
						$.ajax({
							url: BASE_PATH + "/ajax/simple_captcha", 
							success: function(result){
								var form_uuid = $("#custom_form_id_"+form_id).val();
								//alert("------------------"+form_uuid);
						    	$("#ss_captcha_"+form_uuid).html(result).hide();
						    	$("#ss_captcha_"+form_uuid).find("#UserCaptcha").attr("id","UserCaptcha_"+form_uuid);
						    	if( !$('#custom_data_form_'+form_uuid+' #g-recaptcha-response').length )
						    	{
			    					$('#custom_data_form_'+form_uuid+' #action_'+form_uuid).after("<input type='hidden' id='g-recaptcha-response_"+form_uuid+"' name='g-recaptcha-response' value=''  >");
						    	}
			    				reset_captcha(form_uuid);
						 	}
						});
					},1000);
			    	
				}
			});
		});
		$('popular_courses').each(function (i) {
			var ObjParent = $(this).parent();
			ObjParent.html("<center><img src='img/loading1.gif'>Loading Popular Courses....</center>");
			$.ajax({
				type: "POST",
				url: BASE_PATH + "/ajax/popular_courses",
				data: {
					'title': $(this).attr("data-title")
				},
				cache: false,
				success: function (res) {
					if($(ObjParent).parent().attr("class")=="sidebar")
					{
						asidebar = true;
					}
					ObjParent.html(res);
					call_Carousel();
				}
			});
		});
		$('popular_trips').each(function (i) {
			var ObjParent = $(this).parent();
			ObjParent.html("<center><img src='img/loading1.gif'>Loading Popular Trips....</center>");
			$.ajax({
				type: "POST",
				url: BASE_PATH + "/ajax/popular_trips",
				data: {
					'title': $(this).attr("data-title")
				},
				cache: false,
				success: function (res) {
					if($(ObjParent).parent().attr("class")=="sidebar")
					{
						asidebar = true;
					}
					ObjParent.html(res);
					call_Carousel();
				}
			});
		});
	}
	$('widget').each(function (i) {
		var ObjParent = $(this).parent();
		var sw_id = $(this).attr('data-id');
		$.ajax({
			type: "POST",
			url: BASE_PATH + "/ajax/getwidget",
			cache: false,
			data: {
				'sw_id': sw_id
			},
			success: function (res) {
				ObjParent.html(res);
				autocomplete_search();
				call_wid();
			}
		});
	});
	call_wid();
});
$(document).ready(function () {
	if (flash_success_msg)
	{
		setTimeout(function(){
			flash_success_msg = flash_success_msg.split("#@#");
			for (var msg in flash_success_msg) {
				
				$.notify({
					title: "",
					icon: 'glyphicon glyphicon-user',
					message: flash_success_msg[msg]
				}, {
					offset: {
						x: 50,
						y: 200
					},
					timer: 1000,
					type: 'success',
					animate: {
						enter: 'animated lightSpeedIn',
						exit: 'animated lightSpeedOut'
					}
				});
				
			}
		},2500);
	}
	
	var sm = 0;
	$(".sitemessage").each(function () {
		sm++;
		if (sm > 1) {
			this.remove();
		}
	});
	if (CONTROLL == "products" && (ACTION == "index" || ACTION == "collection" || ACTION == "mywishlist")) {
	}
});
function price_filter() {
	var price = {};
	if ($("#slider-range").length == true) {
		price.min = $("#slider-range").slider("values", 0);
		price.max = $("#slider-range").slider("values", 1);
	} else {
		price.min = $(".priceRange").slider("values", 0);
		price.max = $(".priceRange").slider("values", 1);
	}
	filter_products.price = price;
	load_products();
}

function reset_filter() {
	filter_products.category = '';
	filter_products.manufacture = '';
	filter_products.price = '';
	load_products();
}

function category_filter(id, type) {
	var category = {};
	category.id = id;
	category.type = type;
	filter_products.category = category;
	load_products();
}

function changeSortType(value, url) {
	sort_type = value;
	load_products();
}

function changeView(view, url, e) {
	url = BASE_PATH + url;
	location.href = url + util.setView(view);
}
$(document).on('click', '#show_more', function () {
	offset = parseInt(offset) + parseInt(products_per_row);
	load_products();
});
$(document).on('click', '#part_search_button', function () {
	load_products();
});
$(document).ready(function () {
	$('#part_search_form').on('submit', function (e) {
		e.preventDefault();
		load_products();
	});
});
function load_products() {
	var dataobj = {};
	dataobj.limit = item_per_page;
	
	var search_part_val = '';
	if ($("#search_part").length) {
		search_part_val = $("#search_part").val();
	}
	
	if (search_part_val != '') {
		dataobj.search_part = search_part_val;
	}
	if (sort_type != '') {
		dataobj.sort_type = sort_type;
	} else {
		dataobj.sort_type = $("#selectSortType").children("option:selected").val();
	}
	if (filter_products.category && filter_products.category != '') {
		dataobj.category = filter_products.category.id;
	}
	if (filter_products.manufacture && filter_products.manufacture!='') {
		dataobj.manufacture = filter_products.manufacture;
	}
	if (filter_products.price && filter_products.price != '') {
		if(filter_products.price.min)
			dataobj.min = filter_products.price.min;
		else 
			dataobj.min = '0';
		if(filter_products.price.max)
			dataobj.max = filter_products.price.max;
	}
	if (collection_handle != "") {
		dataobj.collection_handle = collection_handle;
	}
	if (mywishlist != '') {
		dataobj.mywishlist = mywishlist;
	}
	if (industry_type == "Petshop") {
		dataobj.animal_type_id = animal_type_id;
		dataobj.cat_id = cat_id;
	}
	
	var text = [];
	var x;
	for (x in dataobj) {
		if (dataobj[x]!='') {
			text.push(x + "=" + dataobj[x]);
		}
	}
	var p_url = part_url + "?" + text.join('&');
	window.location.href = p_url;
}

function update_showing_part(no, cnt) {
}

function manufacture_filter(id) {
	var selOpts = []
	selOpts.push(id);
	filter_products.manufacture = selOpts;
	
	$('#go-top').trigger("click");
	load_products();
}

function custom_data_filter(val) {
	filter_products.custom_data = val;
	$('#go-top').trigger("click");
	load_products();
}
$('body').on("click", ".slide-top .hide-top", function () {
	$(".header-top").slideToggle();
	$("i", this).toggleClass("fa-angle-up fa-angle-down");
});
setTimeout(function () {
	if (CONTROLL == "products" && (ACTION == "index" || ACTION == "collection" || ACTION == "mywishlist")) {
		$(".priceRange").slider({
			range: true,
			min: min_price,
			max: max_price,
			values: [min_price, max_price],
			slide: function (event, ui) {
				$("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
				var selOpts = [];
				$("#selectManufacture :selected").map(function (i, el) {
					selOpts.push($(el).val());
				});
			}
		});
		$("#amount").val("$" + $(".priceRange").slider("values", 0) + " - $" + $(".priceRange").slider("values", 1));
	}
}, 1500);


$(document).ready(function () {
	$("body").scroll(function () {
		if ($(this).scrollTop() >= 400) {
			$('#go-top').fadeIn();
		} else {
			$('#go-top').fadeOut();
		}
	});
	$("#go-top").on('click', function () {
		$("html, body").stop().animate({
			scrollTop: 0
		}, 1500, "easeInOutExpo")
	});
	if ($(".ajax-view").length > 0) {
		$(".ajax-view").magnificPopup({
			type: "ajax",
			alignTop: false,
			overflowY: 'scroll',
			preloader: true,
			midClick: true,
			closeOnContentClick: false,
			enableEscapeKey: true,
			showCloseBtn: false,
			closeOnBgClick: false,
			mainClass: 'mfp-fade',
		});
	}
	if ($(".selectbox").length == true) {
		$(".selectbox").selectbox();
	}
	if ($(".image-popup-zoomin").length) {
		$(".image-popup-zoomin").magnificPopup({
			type: "image",
			removalDelay: 500, 
			gallery: {
				enabled: true, 
				arrowMarkup: '<button title="%title%" type="button" class="fa fa-angle-%dir%"></button>',
			},
			callbacks: {
				beforeOpen: function () {
					$(".mfp-bg").addClass("mfp-bg-white");
					this.st.image.markup = this.st.image.markup.replace("mfp-figure", "mfp-figure mfp-with-anim");
					this.st.mainClass = this.st.el.attr("data-effect");
				}
			},
			closeOnContentClick: true,
			midClick: true 
		});
	}
});
if ($(".service-carousel").length) {
	$(".service-carousel").owlCarousel({
		loop: true,
		items: 3,
		autoplay: true,
		dots: false,
		margin: 30,
		nav: true,
		smartSpeed: 800,
		autoplayHoverPause: true,
		navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
		responsive: {
			0: {
				items: 1
			},
			480: {
				items: 1
			},
			768: {
				items: 2
			},
			1050: {
				items: 3
			}
		}
	});
}


function addPartDetails(handle,part_title)
{

	$("#ContactName").val('').removeClass('error').next().remove();
	$("#ContactEmail").val('').removeClass('error').next().remove();
	$("#ContactMessage").val('');
	$("#hiddenRecaptchaContactus").val('').removeClass('error').next().find('label').remove();	
	$("#enq_reset_captch").click();
	$('#contact_part_number').val('');
	$('#contact_size').val('');
	$('#contact_color').val('');
	$('#contact_description').val('');
	$("#part_title").html(part_title);
	$('#ContactContactUsForm #action').next().remove();
	$(".simple_security").hide();
	$.ajax({
		url:BASE_PATH+"/site/getContactUsdata",
		type:"POST",
		data: {
			handle:handle,			
		},
		success:function(msg){
			$('.contact_us_form_btn').attr('disabled',false);
			var data=msg.split('$@$');
			if(data[0]!=''){
				$('#contact_part_number').val(data[0]);
				$('#contact_size').val(data[2]);
				$('#contact_color').val(data[1]);
				$('#contact_description').val(data[3]);
				$('#ContactContactUsForm #action').after("<input type='hidden' id='g-recaptcha-response' name='g-recaptcha-response' value=''  >"); 
				reset_captcha();
			}else{
				window.history.back();
			}
		}
    });
}



var enq_cap_error = false;
$(document).on('click', '.contact_us_form_btn', function(){
	var ContactContactUsForm_validate = $("#ContactContactUsForm").valid();
	if(  ContactContactUsForm_validate == true )
	{
		var btnObj = this;
		$(btnObj).attr('disabled',true);
		$.ajax({
			url:BASE_PATH+"/site/verify_captcha",
			type:"POST",
			data: {
				captcha:$("#ContactContactUsForm #g-recaptcha-response").val(),
				action: $("#action").val(),
				UserCaptcha : ($("#ContactContactUsForm #UserCaptcha").length)?$("#ContactContactUsForm #UserCaptcha").val():'',
				scode : ($("#ContactContactUsForm #UserCaptcha").length)?$("#ContactContactUsForm #UserCaptcha").attr('data-val'):''
			},
			success:function(res){
				reset_captcha();
				var obj = JSON.parse(res);
				if( 	(Object.keys(obj).length>1 && obj.success==true && obj.action && obj.score==captcha_threshold) ||  
						(Object.keys(obj).length==1 && obj.success==true)
					) 
				{
					$("#ContactContactUsForm #g-recaptcha-response").val('');	
					$("#ContactContactUsForm").submit();
				}
				else
				{
					$(btnObj).attr('disabled',false);
					$('.creload:visible').trigger('click');
					$(".simple_security").fadeIn();
					$(btnObj).attr('disabled',false);
					if(enq_cap_error==true){
						if(obj.message){
							$("#ContactContactUsForm #UserCaptcha").after('<label id="usercaptcha-error" class="error" for="usercaptcha">'+obj.message+'</label>');
						}else{
							$("#ContactContactUsForm #UserCaptcha").after('<label id="usercaptcha-error" class="error" for="usercaptcha">Please enter the security code</label>');	
						}
					}else{
						enq_cap_error = true;
					}
					
				}
			}
		});
	}
});

var pwd_cap_error = false;
$(document).on('click', '.login_form_btn', function(){
	if($("#LoginInfoCreateAccountForm:visible").length)
	{
		var LoginInfoCreateAccountForm_validate = $("#LoginInfoCreateAccountForm:visible").valid();
		if(  LoginInfoCreateAccountForm_validate == true )
		{
			var btnObj = this;
			$(btnObj).attr('disabled',true);
			$.ajax({
				url:BASE_PATH+"/site/verify_captcha",
				type:"POST",
				data: {
					captcha:$("#LoginInfoCreateAccountForm #g-recaptcha-response").val(),
					action: $("#LoginInfoCreateAccountForm #action").val(),
					UserCaptcha : ($("#LoginInfoCreateAccountForm #UserCaptcha").length)?$("#LoginInfoCreateAccountForm #UserCaptcha").val():'',
					scode : ($("#LoginInfoCreateAccountForm #UserCaptcha").length)?$("#LoginInfoCreateAccountForm #UserCaptcha").attr('data-val'):''

				},
				success:function(res){
					reset_captcha();
					var obj = JSON.parse(res);
					if( 	(Object.keys(obj).length>1 && obj.success==true && obj.action && obj.score==captcha_threshold) ||  
							(Object.keys(obj).length==1 && obj.success==true)
						) 
					{
						$("#LoginInfoCreateAccountForm #g-recaptcha-response").val('');	
						$("#LoginInfoCreateAccountForm").submit();
					}
					else
					{
						$(btnObj).attr('disabled',false);
						$('.creload:visible').trigger('click');
						$(".simple_security").fadeIn();
						$(btnObj).attr('disabled',false);
						if(pwd_cap_error==true){
							if(obj.message){
								$("#LoginInfoCreateAccountForm #UserCaptcha").after('<label id="usercaptcha-error" class="error" for="usercaptcha">'+obj.message+'</label>');
							}else{
								$("#LoginInfoCreateAccountForm #UserCaptcha").after('<label id="usercaptcha-error" class="error" for="usercaptcha">Please enter the security code</label>');	
							}
						}else{
							pwd_cap_error = true;
						}
						
					}
				}
			});
		}
	}
	else if($("#ContactForgetPasswordForm:visible").length)
	{
		var ContactForgetPasswordForm_validate = $("#ContactForgetPasswordForm:visible").valid();
		if(  ContactForgetPasswordForm_validate == true )
		{
			var btnObj = this;
			$(btnObj).attr('disabled',true);
			$.ajax({
				url:BASE_PATH+"/site/verify_captcha",
				type:"POST",
				data: {
					captcha:$("#ContactForgetPasswordForm #g-recaptcha-response").val(),
					action: $("#ContactForgetPasswordForm #action").val(),
					UserCaptcha : ($("#ContactForgetPasswordForm #UserCaptcha").length)?$("#ContactForgetPasswordForm #UserCaptcha").val():'',
					scode : ($("#ContactForgetPasswordForm #UserCaptcha").length)?$("#ContactForgetPasswordForm #UserCaptcha").attr('data-val'):''
				},
				success:function(res){
					reset_captcha();
					var obj = JSON.parse(res);
					if( 	(Object.keys(obj).length>1 && obj.success==true && obj.action && obj.score==captcha_threshold) ||  
							(Object.keys(obj).length==1 && obj.success==true)
						) 
					{
						$("#ContactForgetPasswordForm #g-recaptcha-response").val('');	
						$("#ContactForgetPasswordForm").submit();
					}
					else
					{
						$(btnObj).attr('disabled',false);
						$('#ContactForgetPasswordForm:visible .creload').trigger('click');
						$(".simple_security").fadeIn();
						$(btnObj).attr('disabled',false);
						if(pwd_cap_error==true){
							if(obj.message){
								$("#ContactForgetPasswordForm #UserCaptcha").after('<label id="usercaptcha-error" class="error" for="usercaptcha">'+obj.message+'</label>');
							}else{
								$("#ContactForgetPasswordForm #UserCaptcha").after('<label id="usercaptcha-error" class="error" for="usercaptcha">Please enter the security code</label>');	
							}
						}else{
							pwd_cap_error = true;
						}
					}
				}
			});
		}
	}
});

		
$(document).on('click', '.creload', function(){
    var mySrc = $(this).prev().attr('src');
    var glue = '?';
    if(mySrc.indexOf('?')!=-1)  {
        glue = '&';
    }
    $(this).prev().attr('src', mySrc + glue + new Date().getTime());
    setTimeout(function(){
	    $.post(BASE_PATH+"/ajax/getSecurityCode", function(data, status){
	    	$("#UserCaptcha").attr("data-val",$.trim(data));
	  	});
    },750);
    return false;
});

var rew_cap_error = false;		
$(document).on('click', '#submit_preview', function(){
	var ReviewProductForm_validate = $("#ReviewProductForm").valid();
	if(  ReviewProductForm_validate == true )
	{
		var btnObj = this;
		$(btnObj).attr('disabled',true);
		$.ajax({
			url:BASE_PATH+"/site/verify_captcha",
			type:"POST",
			data: {
				captcha:$("#ReviewProductForm #g-recaptcha-response").val(),
				action: $("#action").val(),
				UserCaptcha : ($("#ReviewProductForm #UserCaptcha").length)?$("#ReviewProductForm #UserCaptcha").val():'',
				scode : ($("#ReviewProductForm #UserCaptcha").length)?$("#ReviewProductForm #UserCaptcha").attr('data-val'):''
			},
			success:function(res){
				reset_captcha();
				var obj = JSON.parse(res);
				if( 	(Object.keys(obj).length>1 && obj.success==true && obj.action && obj.score==captcha_threshold) ||  
						(Object.keys(obj).length==1 && obj.success==true)
					) 
				{
					$("#ReviewProductForm #g-recaptcha-response").val('');	
					$("#ReviewProductForm").submit();
				}
				else
				{
					$(btnObj).attr('disabled',false);
					$('#ReviewProductForm:visible .creload').trigger('click');
					$("#ReviewProductForm:visible .simple_security").fadeIn();
					$(btnObj).attr('disabled',false);
					if(rew_cap_error==true)
					{
						if(obj.message){
							$("#ReviewProductForm:visible #UserCaptcha").after('<label id="usercaptcha-error" class="error" for="usercaptcha">'+obj.message+'</label>');
						}else{
							$("#ReviewProductForm:visible #UserCaptcha").after('<label id="usercaptcha-error" class="error" for="usercaptcha">Please enter the security code</label>');	
						}
					}else{
						rew_cap_error = true;
					}
				}
			}
		});
	}
});

$( document ).ready(function() {
	$(".clabel").val('');
    if($("#LoginInfoCreateAccountForm:visible").length)
    {
    	$("#LoginInfoCreateAccountForm .simple_security").hide();
    	if( !$('#LoginInfoCreateAccountForm #g-recaptcha-response').length )
    		$('#LoginInfoCreateAccountForm #action').after("<input type='hidden' id='g-recaptcha-response' name='g-recaptcha-response' value=''  >");
    	reset_captcha();
    }
    else if($("#ContactForgetPasswordForm:visible").length)
	{
		$("#ContactForgetPasswordForm .simple_security").hide();
    	if( !$('#ContactForgetPasswordForm #g-recaptcha-response').length )
    		$('#ContactForgetPasswordForm #action').after("<input type='hidden' id='g-recaptcha-response' name='g-recaptcha-response' value=''  >");
    	reset_captcha();
	}
	else if($("#ReviewProductForm").length)
	{
		$("#ReviewProductForm .simple_security").hide();
    	if( !$('#ReviewProductForm #g-recaptcha-response').length )
    		$('#ReviewProductForm #action').after("<input type='hidden' id='g-recaptcha-response' name='g-recaptcha-response' value=''  >");
    	reset_captcha();
	}
	else if($("#custom_data_form").length)
	{
	 	$("#custom_data_form .simple_security").hide();
     	if( !$('#custom_data_form #g-recaptcha-response').length )
     		$('#custom_data_form #action').after("<input type='hidden' id='g-recaptcha-response' name='g-recaptcha-response' value=''  >");
     	reset_captcha();
	}
});

function reset_captcha(uuid='')
{
	grecaptcha.ready(function() {
        grecaptcha.execute( GOOGLE_RECAPTCHA_SITE_KEY , {action:'validate_captcha'})
                  .then(function(token) {
                  	
            if($("#LoginInfoCreateAccountForm:visible").length)
            {
            	$('#LoginInfoCreateAccountForm:visible #hiddenRecaptcha').val(token);
	    		$("#LoginInfoCreateAccountForm:visible #g-recaptcha-response").val(token);	
            }
            if($("#ContactForgetPasswordForm:visible").length)
            {
            	$('#ContactForgetPasswordForm:visible #hiddenRecaptchaForget').val(token);
	    		$("#ContactForgetPasswordForm:visible #g-recaptcha-response").val(token);	
            }
            if($("#ReviewProductForm").length)
            {
            	$('#ReviewProductForm #hiddenRecaptchaReview').val(token);
	    		$("#ReviewProductForm #g-recaptcha-response").val(token);	
            }
            if($("#custom_data_form_"+uuid).length)
            {
            	$("#hiddenRecaptchaReview_"+uuid).val(token);
	    		$("#g-recaptcha-response_"+uuid).val(token);	
            }
            else
            {
            	$("#ContactContactUsForm:visible #hiddenRecaptchaContactus").val(token);
	    		$("#ContactContactUsForm:visible #g-recaptcha-response").val(token);
	    	}
        });
    });
}

$(document).ready(function () {
	if($('.gallery-2column').length>0)
	{
		$('.gallery-2column').removeClass('hide');
		$(".gallery-2column").css({"width":"100%!important"});
		var itemSelector = '.filter';
		var $container = $('.gallery-2column').isotope({
			itemSelector: itemSelector,
		});
		var responsiveIsotope = [	[480, 4],	[720, 6]	];
		var itemsPerPageDefault = (fitemsPerPage)?fitemsPerPage:10;
		var itemsPerPage = defineItemsPerPage();
		var currentNumberPages = 1;
		var currentPage = 1;
		var currentFilter = '*';
		var filterAtribute = 'data-filter';
		var pageAtribute = 'data-page';
		var pagerClass = 'isotope-pager';
	}

	function changeFilter(selector) {
		$container.isotope({
			filter: selector
		});
	}

	function goToPage(n) {
		if(itemSelector)
		{
			currentPage = n;
			var selector = itemSelector;
			selector += (currentFilter != '*') ?  currentFilter  : '';
			selector += '[' + pageAtribute + '="' + currentPage + '"]';
			
			changeFilter(selector);
		}
	}

	function defineItemsPerPage() {
		if(responsiveIsotope){
			var pages = itemsPerPageDefault;
			for (var i = 0; i < responsiveIsotope.length; i++) {
				if ($(window).width() <= responsiveIsotope[i][0]) {
					pages = responsiveIsotope[i][1];
					break;
				}
			}
			return pages;
		}
	}

	function setPagination() {
        if (itemSelector) {
            var SettingsPagesOnItems = function() {
                var itemsLength = $container.children(itemSelector).length;
                var pages = Math.ceil(itemsLength / itemsPerPage);
                var item = 1;
                var page = 1;
                var selector = itemSelector;
                selector += (currentFilter != '*') ? currentFilter : '';
                $container.children(selector).each(function() {
                    if (item > itemsPerPage) {
                        page++;
                        item = 1;
                    }
                    $(this).attr(pageAtribute, page);
                    item++;
                });
                currentNumberPages = page;
            }();
            var CreatePagers = function() {
                var $isotopePager = ($('.' + pagerClass).length == 0) ? $('<div class="' + pagerClass + '"></div>') : $('.' + pagerClass);
                $isotopePager.html('');
                for (var i = 0; i < currentNumberPages; i++) {
                    var $pager = $('<a href="javascript:void(0);" class="pager page' + (i + 1) + '" ' + pageAtribute + '="' + (i + 1) + '"></a>');
                    $pager.html(i + 1);
                    $pager.click(function() {
                        $(".pager").css({
                            'color': '#FFF',
                            'font-weight': 'normal',
                            'background-color': '#052542 !important'
                        });
                        $(".page" + $(this).html()).css({
                            'color': '#fff',
                            'font-weight': 'bold',
                            'background-color': '#7c7c7c !important'
                        });
                        var page = $(this).eq(0).attr(pageAtribute);
                        goToPage(page);
                    });
                    $pager.appendTo($isotopePager);
                }
                $container.after($isotopePager);
            }();
            homepart_isotope();
            $(".pager:first-child").css({
                'color': '#fff',
                'font-weight': 'bold',
                'background-color': '#7c7c7c !important'
            });
        }
    }
	if($('.gallery-2column').length>0)
	{
		setPagination();
		goToPage(1);
		$('.gallery-filter a').click(function () {
			$('.gallery-filter .active').removeClass('active');
			$(this).addClass('active');
			var filter = $(this).attr(filterAtribute);
			currentFilter = filter;
			setPagination();
			goToPage(1);
		});
	}
	$(window).resize(function () {
		itemsPerPage = defineItemsPerPage();
		setPagination();
		goToPage(1);
	});
});


function homepart_isotope()
{
	if($(".isotope-pager").length>0)
	{
		$(".isotope-pager").css({
			'text-align'	: 'right'
		});
	}
	if($(".isotope-pager .pager").length>0)
	{
		$(".isotope-pager .pager").css({
			'display'	: 'inline-block',
			'padding'   : '5px 10px',
			'background-color' : '#052542',
			'margin-right':'17px',
			'color': 'aliceblue',
			'border-radius': '5px'
		});
	}
}
if($(window).width() <= 1024){
    $(document).on('click touchstart', '.btn_place_order', function () {
      $("#signin_signup").show();      
    });
    $(document).on('click touchstart', '.close_icon_popup', function () {
        $("#signin_signup").hide();
    });
    
}
$(document).on('click touchstart', '.resend_otp', function () {
	$("#ContactOtpLoginEmail-error").remove();
	$("#ContactLoginEmailOtp-error").remove();
	$("#ContactLoginEmailOtp").val('').hide();
	$("#ContactLoginEmailOtp").prev().hide();
	$(".resend_otp").hide();
	$(".otp_mail").html("<img src='img/loading1.gif'>").removeClass("error");
	$.ajax({
			url:BASE_PATH+"/api/sent_otp_login_email",
			type:"POST",
			data: {
				'email' : $("#ContactOtpLoginEmail").val()
			},
			success:function(response){
				var json = $.parseJSON(response);
				if(json.status==true)
				{
					otp_counter();
					if(json.sms_to){
						var res_msg = "Please enter the OTP sent to '"+json.sms_to+"'";
					}
					if(json.mail_to){
						var res_msg = "Please enter the OTP sent to '"+json.mail_to+"'";
					}
					$(".otp_mail").html(res_msg);
					$("#ContactOtpLoginNumber").focus();
					$("#ContactLoginEmailOtp").val('').show();
					$("#ContactLoginEmailOtp").prev().show();
				}
				else
				{
					$(".otp_mail").html(json.message).addClass("error")
					$("#ContactOtpLoginEmail").focus();
					$(".resend_otp").hide();	
					$("#ContactLoginEmailOtp").val('').hide();
					$("#ContactLoginEmailOtp").prev().hide();	
				}
			}
		});
	$(".login_otp_form_btn").show();
});
$(document).on('click touchstart', '.signin_otp', function () {
	$("#signin_otp_modal").show();
	$(".otp_mail").html("").removeClass("error");
	$("#ContactLoginEmailOtp").val('').hide();
	$("#ContactLoginEmailOtp").prev().hide();
	$(".resend_otp").hide();
	$('#otp_counter').text('');
	$("#ContactOtpLoginEmail-error").remove();
	$("#ContactLoginEmailOtp-error").remove();
	$("#ContactOtpLoginEmail").val("");
	$(".login_otp_form_btn").show();
});
$(document).on('click touchstart', '.login_otp_form_btn', function () {
	var ContactSigninOtpForm =  $("#ContactSigninOtpForm").valid();
	if(ContactSigninOtpForm)
	{
		if($("#ContactOtpLoginEmail").val()!='' && $("#ContactLoginEmailOtp").val()!='')
		{
			$("#ContactSigninOtpForm").submit();
		}
		else if($("#ContactOtpLoginEmail").val()!='' && $("#ContactLoginEmailOtp").val()=='')
		{
			$(".login_otp_form_btn").hide();
			$(".otp_mail").html("<img src='img/loading1.gif'>").removeClass("error");
			$.ajax({
				url:BASE_PATH+"/api/sent_otp_login_email",
				type:"POST",
				data: {
					'email' : $("#ContactOtpLoginEmail").val()
				},
				success:function(response){
					var json = $.parseJSON(response);
					if(json.status==true)
					{
						otp_counter();
						if(json.sms_to){
							var res_msg = "Please enter the OTP sent to '"+json.sms_to+"'";
						}
						if(json.mail_to){
							var res_msg = "Please enter the OTP sent to '"+json.mail_to+"'";
						}
						$(".otp_mail").html(res_msg);
						$("#ContactOtpLoginNumber").focus();
						$("#ContactLoginEmailOtp").val('').show();
						$("#ContactLoginEmailOtp").prev().show();
					}
					else
					{
						$(".otp_mail").html(json.message).addClass("error")
						$("#ContactOtpLoginEmail").focus();
						$(".resend_otp").hide();	
						$("#ContactLoginEmailOtp").val('').hide();
						$("#ContactLoginEmailOtp").prev().hide();	
					}
					$(".login_otp_form_btn").show();
				}
			});
		}
	}
});

function otp_counter()
{
	$(".login_otp_form_btn").attr('disabled',false);
	var counter = 120;
	var interval = setInterval(function() {
	    counter--;
	    if (counter <= 0) {
	     	clearInterval(interval);
	      	$('#otp_counter').text('');
			$(".login_otp_form_btn").attr('disabled',true);
	      	$(".resend_otp").show();
	        return;
	    }else{
	    	var minutes = "00";
	    	if( parseInt(counter/60) >=1 )
	    	{
	    		var minutes = "01";
	    	}
	    	var counter_html = minutes+":"+(counter%60)+" Seconds";
	    	$('#otp_counter').html(counter_html);
	    }
	}, 1000);
}

$(document).ready(function () {
	var owl = $('.one-slide-anim');
	if (owl.length > 0) {
		owl.owlCarousel({
			items: 1,
			nav: owl.children().length > 1,
			loop: owl.children().length > 1,
			dots: false,
			autoplay: true,
			smartSpeed: 900,
			autoplayHoverPause: true,
			navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>']
		});
	}
	var testimonial = $('.home-testimonials');
	if (testimonial.length > 0) {
		testimonial.owlCarousel({
		loop: true,
		items: 24,
		autoplay: true,
		dots: false,
		nav: true,
		margin: 30,
		autoplayHoverPause: true,
		navText: ["<span class='fa fa-chevron-left'></span>","<span class='fa fa-chevron-right'></span>"],
		responsive: {
			0: {
				items: 1
			},
			480: {
				items: 1
			},
			768: {
				items: 2
			},
			1050: {
				items: 3
			}
		}
		});
	}
	var testimonial = $('.home-testimonial');
	if (testimonial.length > 0) {
		testimonial.owlCarousel({
		loop: true,
		items: 24,
		autoplay: true,
		dots: false,
		nav: true,
		margin: 30,
		autoplayHoverPause: true,
		navText: ["<span class='fa fa-chevron-left'></span>","<span class='fa fa-chevron-right'></span>"],
		responsive: {
			0: {
				items: 1
			},
			480: {
				items: 1
			},
			768: {
				items: 2
			},
			1050: {
				items: 2
			}
		}
		});
	}
 });
$(document).ready(function() {
	call_Carousel();
	autocomplete_search();
});
$(document).on('keyup', '.productSearch', function(event){
	if($(this).val().length>=3)
	{
		$(this).addClass("loading");
	}else{
		$(this).removeClass("loading");
	}
});
$(document).on('keypress', '.productSearch', function(event){
	if (event.keyCode === 10 || event.keyCode === 13) {
		$(this).addClass("loading");
		$(this).next(".productSearch_btn").trigger("click");
		event.preventDefault();
	}
});

$(document).on('click', '.productSearch_btn', function(){
	$(this).prev().addClass("loading");
	if ($(this).prev().val().length < 3) {
		
		$.notify({
			title: "<strong>Search</strong> ",
			icon: 'fa fa-search',
			message: " please make sure the input is above 3 characters long"
		}, {
			timer: 1000,
			type: 'warning',
			animate: {
				enter: 'animated lightSpeedIn',
				exit: 'animated lightSpeedOut'
			}
		});
		
		$(this).removeClass("loading");
	} else {
		$(this).prev("#productSearch,.productSearch").focus();
		$(this).prev("#productSearch,.productSearch").trigger("keydown");
	}
});
function autocomplete_search()
{
	if($("#productSearch").length>0 || $(".productSearch").length>0)
    {
    	$("#productSearch,.productSearch").autocomplete({
			source: BASE_PATH + '/api/search/',
			minLength: 3,
			autoFocus: true,
			delay: 1000,
			open: function( event, ui ) {
				$("#productSearch,.productSearch").removeClass("loading");
			},
			create: function () {
				var i = 0;
				$(this).data('ui-autocomplete')._renderItem = function (ul, item) {
					let path = BASE_PATH + '/products/' + item.handle;
					let price = Number(item.price);
					var html = '';
					if (item.handle) html += '<a href="' + path + '">';
					html += '<div class="row">';
					html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">';
					html += '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2">';
					if (item.image) html += '<img src="' + item.image + '" width="40px" alt="product">';
					html += '</div>';
					html += '<div class="col-xs-10 col-sm-10 col-md-10 col-lg-10">';
					html += '<p class="autocomplete-product-para"><span class="autocomplete-product-title">' + item.title + '</span>';
					if (item.price) html += ' - $' + price.toFixed(2);
					html += '</p>';
					html += '</div>';
					html += '</div>';
					html += '</div>';
					if (item.handle) html += '</a>';
					return  $('<li>').append(html).appendTo(ul);
					i++;
				}
			}
		});		
	}
}
function call_Carousel() {	
	if ($(".owl-carousel.owl-theme").length > 0) {
        carousel_plugin(".owl-carousel.owl-theme",1);
    }	
    if ($("#spn_sc_slider_1").length > 0) 
    {
        carousel_plugin("#spn_sc_slider_1",2);
    }
    if ($("#spn_sc_slider_2").length > 0) 
    {
        carousel_plugin("#spn_sc_slider_2",2);
    }
    if ($("#spn_sc_slider_5").length > 0) 
    {
        carousel_plugin("#spn_sc_slider_5",2);
    }
    
    if($(".pics-carousel").length>0)
    {
    	carousel_plugin(".pics-carousel",3);	
    }
    if($(".quotes-carousel").length>0)
    {
    	carousel_plugin(".quotes-carousel",3);	
    }
    if($(".clients-carousel").length>0)
    {
    	carousel_plugin(".clients-carousel",3);	
    }
    
    if($(".team-carousel").length>0)
    {
    	carousel_plugin(".team-carousel",4);		
    }
    if($(".services-carousel").length>0)
    {
    	carousel_plugin(".services-carousel",4);		
    }
    if($(".testimonials-carousel").length>0)
    {
    	carousel_plugin(".testimonials-carousel",4);		
    }
    
    if($('#owl').length>0)
    {
    	carousel_plugin("#owl2",5);	
    }
    if($('#owl2').length>0)
    {
    	carousel_plugin("#owl2",5);	
    }
    
    if ($(".service-carousel").length>0) {
    	carousel_plugin(".service-carousel",6);	
    }
	
}
function carousel_plugin(obj,arg){
	var currentli = $('.home-carousel').parent().attr('id');	
	var carousel = $('#head').children().attr('id');
	var carousel_five1 = $('#head').children().attr('id');
	var carousel_five = $('#home_courses').children().attr('id');
	var carousel_three = $('#head').children().attr('id');
	var carousel_travel_three = $('#home_trip_three').children().attr('id');
	var margin = $('#head').children().attr('id');
	var margin5px = $('#head').children().attr('id');
	console.log(margin);
	if(arg==1){
		if(asidebar==true){
			asidebar = false;
			var resp = { 0	: {	items: 1	},480	: {	items: 1	},768	: {	items: 1	},1050: {	items: 1	} };
		}else if(currentli == "carousel_header_top")
		{
			var resp = { 0	: {	items: 1	},480	: {	items: 1	},768	: {	items: 3	},1050: {	items: 3	} };
		}else if(carousel_three == "home_carousel_three")
		{
			var resp = { 0	: {	items: 1	},480	: {	items: 1	},768	: {	items: 2	},1050: {	items: 3	} };
		}else if(carousel_travel_three == "home_carousel_trip")
		{
			var resp = { 0	: {	items: 1	},480	: {	items: 1	},768	: {	items: 2	},1050: {	items: 3	} };
		}else if(carousel == "home_carousel_five")
		{
			var resp = { 0	: {	items: 1	},480	: {	items: 1	},768	: {	items: 3	},1050: {	items: 5	} };
		}else if(carousel_five == "home_carousel_five")
		{
			var resp = { 0	: {	items: 1	},480	: {	items: 1	},768	: {	items: 3	},1050: {	items: 5	} };
		}else if(carousel_five1 == "westshorescuba")
		{
			var resp = { 0	: {	items: 1	},480	: {	items: 1	},768	: {	items: 3	},1050: {	items: 5	} };
		}else{
			if($(obj).width()<1050){
				var resp = { 0	: {	items: 1	},480	: {	items: 1	},768	: {	items: 2	},1050: {	items: 3	} };	
			}else{
				var resp = { 0	: {	items: 1	},480	: {	items: 1	},768	: {	items: 2	},1050: {	items: 4	} };
			}
		}
		if(margin == "divephoto"){
		$(obj).owlCarousel({
	        nav 		: $(obj).children().length > 1,
        	loop 		: $(obj).children().length > 1,
	        items 		: 24,	
	        margin 		: 10,	
	        dots 		: false,
	        navText 	: ["<span class='fa fa-chevron-left'></span>", "<span class='fa fa-chevron-right'></span>"],
	        responsive 	: resp
	    });
		}
		else if(carousel_five1 == "westshorescuba"){
		$(obj).owlCarousel({
	        nav 		: $(obj).children().length > 1,
        	loop 		: $(obj).children().length > 1,
	        items 		: 24,	
	        margin 		: 5,	
	        dots 		: false,
	        navText 	: ["<span class='fa fa-angle-left'></span>", "<span class='fa fa-angle-right'></span>"],
	        responsive 	: resp
	    });
		}
		else if(margin5px == "margin5px"){
		$(obj).owlCarousel({
	        nav 		: $(obj).children().length > 1,
        	loop 		: $(obj).children().length > 1,
	        items 		: 24,	
	        margin 		: 5,	
	        dots 		: false,
	        navText 	: ["<span class='fa fa-angle-left'></span>", "<span class='fa fa-angle-right'></span>"],
	        responsive 	: resp
	    });
		}
		else{
		$(obj).owlCarousel({
	        nav 		: $(obj).children().length > 1,
        	loop 		: $(obj).children().length > 1,
	        items 		: 24,	
	        margin 		: 30,	
	        dots 		: false,
	        navText 	: ["<span class='fa fa-chevron-left'></span>", "<span class='fa fa-chevron-right'></span>"],
	        responsive 	: resp
	    });
		}
	}
	else if(arg==2)
	{
		$(obj).owlCarousel({
            nav 		: $(obj).children().length > 1,
        	loop 		: $(obj).children().length > 1,
            items   	: 24,	
            dots    	: false,	
            margin  	: 30,
            navText  	: ["<span class='fa fa-chevron-left'></span>","<span class='fa fa-chevron-right'></span>"],
            responsive 	: {
                0	: {	items: 1	},480	: {	items: 2	},768	: {	items: 3	},1050: {	items: 3	}
            }
        });
	}
	else if(arg==3)
	{
		$(obj).owlCarousel({
	        autoPlay: 5000,
	        slideSpeed: 500,
	        items: 1,
	        itemsDesktop: [1199, 1],
	        itemsDesktopSmall: [979, 1],
	        itemsTablet: [768, 1],
	        itemsMobile: [479, 1],
	        autoHeight: false,
	        pagination: false,
	        navigation: true,
	        transitionStyle: "fade",        
	        navigationText: [
	            "<i class='fa fa-angle-left'></i>",
	            "<i class='fa fa-angle-right'></i>"
	        ],
	    });
	}
	else if (arg==4)
	{
		$(obj).owlCarousel({
	        autoPlay: false,
	        slideSpeed: 500,
	        items: 4,
	        itemsDesktop: [1199, 4],
	        itemsDesktopSmall: [979, 3],
	        itemsTablet: [768, 2],
	        itemsMobile: [479, 1],
	        autoHeight: false,
	        pagination: true,
	        navigation: false,
	        transitionStyle: "fade",        
	        navigationText: [
	            "<i class='fa fa-angle-left'></i>",
	            "<i class='fa fa-angle-right'></i>"
	        ],
    	});
	}
	else if (arg==5)
	{
		$(obj).owlCarousel({
	        nav    : true,
	        loop    : true,
	        items     : 24,
	        margin  : 30,
	        dots    : false,
	        autoplay:true,
	        autoplayTimeout:3000,
	        autoplayHoverPause:true,
	        navText  : ["<span class='icon-arrow-left10'></span>","<span class='icon-uniE936'></span>"],
	        responsiveClass: true,
	        responsive 	: {
	        	0	: {	items: 1	},480	: {	items: 2	},768	: {	items: 4	},1050: {	items: 4	}
	        }
	    });
	}
	else if(arg==6)
	{
		$(".service-carousel").owlCarousel({
			loop: true,
			items: 24,
			autoplay: true,
			dots: false,
			margin: 30,
			nav: true,
			smartSpeed: 800,
			autoplayHoverPause: true,
			navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
			responsive: {
				0: {
					items: 1
				},
				480: {
					items: 1
				},
				768: {
					items: 2
				},
				1050: {
					items: 3
				}
			}
		});
	}
	
	
}
$(document).on('change', '.dive_country ', function() {
    var country = $(this).val();
    $.ajax({
        url: BASE_PATH + '/ajax/getStates/',
        type: "post",
        data: {
            'country': country
        },
        success: function(result) {
            if(result!=''){
                $(".dive_states").children("option").remove();
                $(".dive_states").append(result);
            }
        }
    });
	
});
$(document).ready(function(){
    $(".featured_products ul li a").each(function(){
        $(this).attr("href", "javascript:void(0);");
    });
	
});	
$(window).on('load', function(){
	$('.pix_sc_slider3').flexslider({
		animation: "slide",
		pauseOnHover: true,
		smoothHeight: true,
		directionNav: false
	});
});