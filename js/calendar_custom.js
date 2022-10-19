'use strict'
var REG_USERS = [];
var REG_ADDON = [];
var stu_count = 1;
var IS_PHONE_VALID = false;
var OVR_COST = 0;
var TRAVEL_REGISTRATIONS = [];
var MINIMUM_DEPOSIT = 0.00;

var DISPLAY_CALENDAR = false;3
var all_customer = [];
var finalAr = [];
var popoverElement;
$(document).ready(function(){
	var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)-20;

	var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

	var asRatio = w/h;
	var fontSize = Math.round(h/30);
	
	var EVENTS = '';

	try{
		$.fn.datepicker.defaults.format = "mm-dd-yyyy";
		$.fn.datepicker.defaults.autoclose = true;
	}catch(e) {	}

	//console.log(BASE_PATH);

	//check contact 
	//checkContact();

	//Helpers
	$.fn.serializeObject = function()
	{
	    var o = {};
	    var a = this.serializeArray();
	    $.each(a, function() {
	        if (o[this.name] !== undefined) {
	            if (!o[this.name].push) {
	                o[this.name] = [o[this.name]];
	            }
	            o[this.name].push(this.value || '');
	        } else {
	            o[this.name] = this.value || '';
	        }
	    });
	    return o;
	};

	$.fn.getFormData = function() {
		return $(this).serializeObject();
	};
	try{
		if(typeof jsonArray !== 'undefined') {
			initCalendar(jsonArray);		
			initMiniCalendar(jsonArray);
			if(ACCESS_TYPE === 'widget')$(".sec-calendar").hide();
		}
	}catch(e) {	}
	//$("#header > .pg-title").css({"font-size": fontSize+"px"});
	//$(".fc-left > h2").css({"font-size": fontSize+"px"})	
	//
	try {
		$("#CreditCardCardNumber").validateCreditCard(function(result){
			if(result.card_type)
			$('#CreditCardCardNumber').addClass(result.card_type.name);
			
			if(result.valid) {
				$('#CreditCardCardNumber').removeClass('error');
				$('#CreditCardCardNumber').addClass('valid');	
			}else {
				$('#CreditCardCardNumber').removeClass('valid');
				$('#CreditCardCardNumber').addClass('error');
			}
		})
	}catch(e) {	}

	$(document).ajaxStart(function(){
		$(".loader").show();
	});

	$(document).ajaxComplete(function(){
		$(".loader").hide();
	});

	$("#btnRegisterContact").click(function(){
		preserveContact();
	});
	
	function goToBottom() {
		$("html, body").animate({ scrollTop: $(document).height() }, 1000);
	}

	function showDialog() {
		$(".mask").show();
		$(".dialog-add-user").show();
	}

	function hideDialog() {
		$('.mask').hide();
		$(".dialog-add-user").hide();
	}

	function loadData(){
		$.ajax({
			url:BASE_PATH+"/calendar/getCoursesAndTravelsAsJson",
			type:'POST',
			async:true,
			dataType:'json',
			success:function(data){
				initCalendar(data);
				initMiniCalendar(data);
			}
		});
	}

	function isPastDate(date,time_zone) {		
		var dateObj = calcTime(time_zone);
		var d_month = dateObj.getMonth() + 1; //months from 1-12
		var d_day = dateObj.getDate();
		var d_year = dateObj.getFullYear();
		var d_hour = dateObj.getHours();
		var d_min = dateObj.getMinutes();
				
		if(d_month<10) d_month = "0" + d_month;
		if(d_day<10) d_day = "0" + d_day;
		
		if(d_hour<10) d_hour = "0" + d_hour;
		if(d_min<10) d_min = "0" + d_min;
				
		var d_date = d_year + "-" + d_month + "-" + d_day + " " + d_hour + ":" + d_min;
				
		var cal_date = date.split(" ");		
		var time = cal_date[1];
		var cal_time = time.split(":");
		
		var hours = Number(cal_time[0]);
		var minutes = Number(cal_time[1]);		
		
		var AMPM = cal_date[2];		
		if(AMPM == "PM" && hours<12) hours = hours+12;
		if(AMPM == "AM" && hours==12) hours = hours-12;
		var sHours = hours.toString();
		var sMinutes = minutes.toString();
		if(hours<10) sHours = "0" + sHours;
		if(minutes<10) sMinutes = "0" + sMinutes;
		var d_time = sHours + ":" + sMinutes;
		
		//console.log(d_date+"--------"+cal_date[0]+" "+d_time);

		var fromDate = d_date;
	    fromDate=fromDate.replace("-", "/");
	    fromDate=fromDate.replace("-", "/");
	    var toDate = cal_date[0]+" "+d_time;
	    toDate=toDate.replace("-", "/");
	    toDate=toDate.replace("-", "/");

		var fromDate=(new Date(fromDate).getTime()/1000);
		var toDate=(new Date(toDate).getTime()/1000);

		if(fromDate > toDate){
			return true;
		} else {
			return false;
		}
	}

	function calcTime(offset) {

	    // create Date object for current location
		var d = new Date();

	    // convert to msec
	    // add local time zone offset 
	    // get UTC time in msec
	    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

	    // create new Date object for different city
	    // using supplied offset
	    var nd = new Date(utc + (3600000*offset));

	    // return time as a string
	    return nd;

	}
	
	function initCalendar(events){
		var calView = "listWeek";
		var isMobile = {
			Android: function() {
				return navigator.userAgent.match(/Android/i);
			},
			BlackBerry: function() {
				return navigator.userAgent.match(/BlackBerry/i);
			},
			iOS: function() {
				return navigator.userAgent.match(/iPhone|iPad|iPod/i);
			},
			Opera: function() {
				return navigator.userAgent.match(/Opera Mini/i);
			},
			Windows: function() {
				return navigator.userAgent.match(/IEMobile/i);
			},
			any: function() {
				return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
			}
		};
		if( isMobile.any() ) {
			calView = "agendaWeek";
		}
		$("#calendar").fullCalendar({
			defaultView: calView,
			eventLimit:true,
			events: events,
			aspectRatio:asRatio,
			header: {
				right: 'today prev,next',
				center: 'title',
				left: 'month,agendaWeek'
			},
			eventClick:function(evt, elm, view){		
				if(evt.type === 'Course') {
					//if(isPastDate(evt.course_start+" "+evt.start_time,evt.time_zone))return false;
					/*if(evt.available_seats <= 0 ) {						
						showAlert('Not currently available online, please call us at '+STORE_PHONE+ '.');
						return true;
					}*/

					(ACCESS_TYPE === 'widget') ?
						window.open(BASE_PATH+'/courses/'+evt.collection) : location.href = BASE_PATH+'/courses/'+evt.collection;
					//return true;
				}else if(evt.type === 'Event') {
					//closePopovers();
					if(evt.all_day_event==1){
						var end_t="24:00";
						
					}else{
						var end_t=evt.end_time;
					}
					if(isPastDate(evt.end_date+" "+end_t,evt.time_zone))return false;
					if($('#show_misc_event_popup').val()==1){
					popoverElement = $(this);
					$(this).children().popover({
			            html:true,
						animation:true,
						title:"",
						placement:'auto',
						container:'.fc-view',
						content:getPopoverContent(evt),
						trigger: 'manual'
			        });
			        $('.popover.in').remove();
	        		$(this).children().popover('show');
	        		$('.popover').css( "max-width", "540px" );
	        		var popover_left=$('.popover').css("left");
	        		popover_left=popover_left.split('px')[0];
	        		if(popover_left>650){
	        			var popoverleft=(popover_left*35)/100;
	        			popoverleft=popover_left-popoverleft;
	        			$('.popover').css("left", popoverleft+"px" );
	        			
	        		}
        			$('.arrow').css("display", "none" ); 
				}else{
					
					var event_id=evt.handle;
					var show_more_link_attribute=evt.show_more_link_attribute;
					if(show_more_link_attribute==1){
						var link_target="_blank";
						window.open(BASE_PATH+'/calendar/events/'+event_id,link_target) ;

					}else{
						var link_target="";
						window.location.href=BASE_PATH+'/calendar/events/'+event_id;

					}

				}
	        		
				}else {
					//if(isPastDate(evt.start._i+" 24:00",evt.time_zone))return false;
					popoverElement = $(this);
					var calView = $('#calendar').fullCalendar('getView').name;
					if(calView=='listWeek')
					{
						$(this).find(".fc-list-item-title").popover({
							html:true,
							animation:true,
							title:evt.title,
							placement:'auto',
							container:'.fc-view',
							content:getPopoverContent(evt),
							trigger: 'manual'
						});	
					}else{
						$(this).children().popover({
							html:true,
							animation:true,
							title:evt.title,
							placement:'auto',
							container:'.fc-view',
							content:getPopoverContent(evt),
							trigger: 'manual'
						});
					} 
			        $('.popover.in').remove();
	        		$(this).children().popover('show');
				}				
			},
			eventRender: function (evt, elm) {
				if(evt.type === 'Course') {
					var html = '';
					html += '<div class="evt-detail ' +(isPastDate(evt.course_start+" "+evt.start_time,evt.time_zone) ? 'text-muted' : '')+ '">';
						html += '<span class="evt-time">' +evt.start_time.replace(/^0+/, '')+ '</span>';
						html += '<span class="evt-title">: ' +evt.title+ '</span>';
						html += '<p class="evt-description">' +evt.desc+ '</p>'
						
						if(!isPastDate(evt.start._i+" "+evt.start_time,evt.time_zone)) {
							if(evt.available_seats > 0 && evt.available_seats <= 3)
								html += '<span class="evt-warning"><span class="glyphicon glyphicon-user" aria-hidden="true"></span> ' +evt.available_seats+ ' Left!</span>';
							else if(evt.available_seats <= 0)
								html += '<span class="evt-warning">Sold Out!</span>';
						}
					html += '</div>';

					elm.find('.fc-title').html(html);
				}else if(evt.type === 'Travel' || evt.type === 'Charter') {
					var html = '';
					html += '<div class="evt-detail ' +(isPastDate(evt.start._i+" 24:00",evt.time_zone) ? 'text-muted' : '')+ '">';
					html += '<span class="evt-time">' +evt.start_time.replace(/^0+/, '')+ '</span>';
					html += '<span class="evt-title">: ' +evt.title+ '</span>';
					html += '</div>';

					elm.find('.fc-title').html(html);
				}else if(evt.type === 'Event') {
					var html = '';
					if(evt.all_day_event==1){
						var end_t="24:00";
						
					}else{
						var end_t=evt.end_time;
					}
					html += '<div class="evt-detail ' +(isPastDate(evt.end_date+" "+end_t,evt.time_zone) ? 'text-muted' : '')+ '">';
					 if(evt.all_day_event==1){
						 html += '<span class="evt-time">All day event</span>';
					 }else{
						 html += '<span class="evt-time">' +evt.start_time1.replace(/^0+/, '')+ '</span>';
					 }
						
						html += '<span class="evt-title">: ' +evt.title+ '</span>';

					html += '</div>';

					elm.find('.fc-title').html(html)
				}
			},
			eventAfterRender: function (event, element, view) {				
				if(event.type == 'Course') {
					element.css('background-color', course_event_color);
					element.css('color', course_event_text_color);
				}else if(event.type == 'Travel') {
					element.css('background-color', travel_event_color);
					element.css('color', travel_event_text_color);
				}else if(event.type == 'Event') {
					element.css('background-color', misc_event_color);
					element.css('color', misc_event_text_color);
				}else{
					element.css('background-color', charter_event_color);
					element.css('color', charter_event_text_color);
				}
			}
		});
	}
	
	function initMiniCalendar(events){
		//$("#display_date_div").hide();
		$(".register_new_btn").hide();
		var default_start_date = "";
        if(typeof events[0] != "undefined") {
            $.each(events[0], function (key, val) {
                if (key == "start") {
                    if (events[0].type == "Course") {
                        var sel_date = new Date(selected_date * 1);
                        //console.log(selected_date);
                        if (sel_date == "Invalid Date")
                            default_start_date = selected_date;
                        else {
                            var full_month = (sel_date.getMonth() + 1);
                            var full_date = sel_date.getDate();
                            var month = full_month, date = full_date,
                                str = month.toString(), month_len = str.length,
                                str1 = date.toString(), date_len = str1.length;

                            if (month_len == 1) full_month = "0" + full_month;
                            if (date_len == 1) full_date = "0" + full_date;
                            default_start_date = sel_date.getFullYear() + "-" + full_month + "-" + full_date;
                        }
                    } else {
                        default_start_date = val
                    }
                }
            });
        }
	    
		$("#calendar_mini").fullCalendar({
			eventLimit:true,
			events: events,
			aspectRatio:asRatio,			
			header: {
				right: 'today prev,next',
				center: 'title',
				left: 'month,agendaWeek'
			},
			defaultDate: moment(default_start_date),
			eventClick:function(event, elm){
				if(isPastDate(event.start))return false;
				$( '#calendar_mini .fc-event' ).each(function () {					
				    this.style.setProperty( 'background-color', '#009688', 'important' );
				});
				this.style.setProperty( 'background-color', '#65ace4', 'important' );				
				var monthNames = ["January", "February", "March", "April", "May", "June",
					                  "July", "August", "September", "October", "November", "December"
					                ];
				var DayNames = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                var d = new Date(event.start);
				
                var d_suffix = ordinal_suffix_of(d.getUTCDate());
                var date_div = "<span class='month_day'>"+DayNames[d.getUTCDay()]+", "+monthNames[d.getUTCMonth()]+" "+d_suffix+" "+d.getUTCFullYear()+"</span>";
                	date_div += "<br>";
                	date_div += "Click below to register";
                $("#display_date_div").html(date_div);
                $("#display_date_div").show();
                $(".register_new_btn").show();
			},
			eventRender: function (evt, elm) {				
				if(evt.type === 'Course') {
					if(isPastDate(evt.start)){
						$(elm).css('opacity',"0.5");							
					}
					var html = '';
					html += '<div class="evt-detail ' +((evt.available_seats <= 0 || isPastDate(evt.start)) ? 'text-muted' : '')+ '">';
						html += '<span class="evt-time">' +evt.start_time+ '</span>';												
						
						if(!isPastDate(evt.start)) {
							if(evt.available_seats > 0 && evt.available_seats <= 3)
								html += '<span class="evt-warning"><span class="glyphicon glyphicon-user" aria-hidden="true"></span> ' +evt.available_seats+ ' Left!</span>';
							else if(evt.available_seats <= 0)
								html += '<span class="evt-warning"><span class="glyphicon glyphicon-earphone" aria-hidden="true"></span> Contact us to Book!</span>';
						}
					html += '</div>';					
					elm.find('.fc-title').html(html);
				}
			}
		});

	}

	function ordinal_suffix_of(i) {
	    var j = i % 10,
	        k = i % 100;
	    if (j == 1 && k != 11) {
	        return i + "st";
	    }
	    if (j == 2 && k != 12) {
	        return i + "nd";
	    }
	    if (j == 3 && k != 13) {
	        return i + "rd";
	    }
	    return i + "th";
	}
	
	function onEventRender(evt, elm, view){
		var popup = elm.popover({
			html:true,
			animation:true,
			title:'Sample',
			placement:'auto',
			container:'.fc-view',
			content:getPopoverContent(evt)
		});
	}

	function getPopoverContent(evt) {
		var st_date = evt.start._i.split(" ");
		var s_data = st_date[0].split("-");
		var mm_date = s_data[1] + "-" + s_data[2] + "-" + s_data[0];
		var html = '';
		if (evt.type === 'Event') {
			// MISCELLENIOUS EVENT
			var event_id=evt.handle;
			var show_more_link_attribute=evt.show_more_link_attribute;
			if(show_more_link_attribute==1){
				var link_target="_blank";
			}else{
				var link_target="";
			}
			html += '   <div id="editpop" class="events gun" style="max-width:525px;">   ' + '<button type="button" class="close" data-dismiss="popover" aria-hidden="true" onclick="$(\'.popover\').hide()">X</button>' + '   	<div class="top">  ';
			html += '   		<div class="datesq">  ' + '   			<div class="day">' + evt.start_day + '</div>  ' + '   			<div class="mo">' + evt.start_month + '</div>  ' + '   			<div class="yr">' + evt.start_year + '</div>  ' + '   		</div>  ';
			html += '   		<div class="desc">  ' + '   			<div class="evtitle">' + evt.title + '</div>  ' + '   			<div class="evdesc">' + evt.title + '</div>  ';
			if (evt.all_day_event == 1) {
				html += '<div class="evtime">All day Event</div>';
			} else {
				html += ' <div class="evtime">From ' + evt.start_time1 + ' until ' + evt.end_time1 + '</div>  ';
			}
			html += '   		</div>  ' + '   	</div>  ' + '   	<div class="options">  ' + '   	  <div class="scroll">  ';
			'<div class="event" id="event_0">  ';
			html += evt.description;
			html += '</div>';
			console.log(evt.full_description);
			if(evt.full_description!='' && evt.full_description!=null && typeof evt.full_description !== 'undefined'){
			html += '<div class="event" id="eventd" style="float:right">  '  ; 
			html +='<a style="color: #5585FF !important; text-decoration: none !important;font-weight: bold;" href="'+BASE_PATH+'/calendar/events/'+event_id+'" target="'+link_target+'">More Info</a>';
			html +='</div>'  ;
			}
			html += '</div>  ';
			html += '  </div> </div> ';
		} else {
			html += '<div class="wrap">';
			//console.log(evt);
			if(evt.category)
				html +='<div class="evt evt-cat">'+evt.category+'</div>';
			html += '<div class="evt evt-start">' + mm_date + '</div>';
			html += '<div class="evt evt-tot-seat">Total Seats : ' + evt.tot_seats + '</div>';
			html += '<div class="evt evt-avl-seat">Available Seats : ' + evt.available_seats + '</div>';
			if (evt.available_seats > 0) {
					var target = (ACCESS_TYPE === 'widget') ? '_target' : '_self';
					if(evt.type == 'Travel')
						html +='<a target="'+ target +'" href="'+BASE_PATH+'/trips/'+evt.collection+'"><button class="btn btn-sm btn-success">View</button></a>';
					else if (evt.type == 'Charter')
						html +='<a target="'+ target +'" href="'+BASE_PATH+'/charters/'+evt.collection+'"><button class="btn btn-sm btn-success">View</button></a>';
					else
						html +='<a target="'+ target +'" href="'+BASE_PATH+'/courses/'+evt.collection+'"><button class="btn btn-sm btn-success">View</button></a>';
			} else {
					var target = (ACCESS_TYPE === 'widget') ? '_target' : '_self';
					if(evt.type == 'Travel')
						html +='<a target="'+ target +'" href="'+BASE_PATH+'/trips/'+evt.collection+'"><button class="btn btn-sm btn-default">Sold Out</button></a>';
					else if (evt.type == 'Charter')
						html +='<a target="'+ target +'" href="'+BASE_PATH+'/charters/'+evt.collection+'"><button class="btn btn-sm btn-default">Sold Out</button></a>';
					else
						html +='<a target="'+ target +'" href="'+BASE_PATH+'/courses/'+evt.collection+'"><button class="btn btn-sm btn-default">Sold Out</button></a>';
			}
			html += '</div>';
		}
		return html;
	}

	$("#ContactState").prepend("<option value=''>Select State</option>").val('');

	$("#ContactRegisterForm #ContactCountry").on('change', function(){
		var phone = $("#ContactRegisterForm #ContactPhoneNumber").val();
		var code = $(this).val();

		if(phone && code){
			getFormmatedPhone(phone, code, 'course');
		}
	});

	$("#ContactReserveForm #ContactCountry").on('change', function(){
		var phone = $("#ContactReserveForm #ContactPhoneNumber").val();
		var code = $(this).val();

		if(phone && code){
			getFormmatedPhone(phone, code, 'travel');
		}
	});

	$("#ContactReserveForm #ContactPhoneNumber").on('focusout', function(){
		var phone = $(this).val();
		var code = $("#ContactReserveForm #ContactCountry").val();
		if(phone && code){
			getFormmatedPhone(phone, code, 'travel');
		}
	});

	$("#ContactRegisterForm #ContactPhoneNumber").on('focusout', function(){
		var phone = $(this).val();
		var code = $("#ContactRegisterForm #ContactCountry").val();
		if(phone && code){
			getFormmatedPhone(phone, code, 'course');
		}
	});
	
	$("#ContactRegisterForm #ContactPhoneNumber").ready(function(){		
		var phone = $("#ContactRegisterForm #ContactPhoneNumber").val();
		var code = $("#ContactRegisterForm #ContactCountry").val();
		if(phone && code){
			getFormmatedPhone(phone, code, 'course');
		}
	});
	
	$("#ContactReserveForm #ContactPhoneNumber").ready(function(){		
		var phone = $("#ContactReserveForm #ContactPhoneNumber").val();
		var code = $("#ContactReserveForm #ContactCountry").val();
		if(phone && code){
			getFormmatedPhone(phone, code, 'course');
		}
	});
	
	$("#btnAddAddon").click(function(){
		addonToCart();
	})

	$(document).on('keyup', '.input-qty', function(){
		var obj = $(this);
		var qt = 1;
		if( $(obj).hasClass("input-qty") ) {
			obj = $(obj).closest("tr").find("select");
		}

		if( $(obj).hasClass('addon-options') ) {
			qt = $(obj).closest("tr").find(".input-qty").val();
		}
		$(obj).closest("tr").find(".input-price").html("$0.00");
		var tmp_id = $(obj).attr('id').split("_")[1];
		var val = $(obj).val();

		if(qt == 0 || $(obj).val() == '') {
			unRegisterTravelOption(tmp_id, val);
			getTravelCost(this);
			return;
		}
		checkTravelAvailability(val, obj, tmp_id);	
	});
	$(document).on('change', '.travel-options, .row-addon .input-qty', function(){
		var obj = $(this);
		var qt = 1;
		if( $(obj).hasClass("input-qty") ) {
			obj = $(obj).closest("tr").find("select");
		}

		if( $(obj).hasClass('addon-options') ) {
			qt = $(obj).closest("tr").find(".input-qty").val();
		}
		$(obj).closest("tr").find(".input-price").html("$0.00");
		var tmp_id = $(obj).attr('id').split("_")[1];
		var val = $(obj).val();

		if(qt == 0 || $(obj).val() == '') {
			unRegisterTravelOption(tmp_id, val);
			getTravelCost(this);
			return;
		}
		checkTravelAvailability(val, obj, tmp_id);	
	});

	$(".mask").click(function(){
		$(this).hide();
		$(".dialog").hide();
	})

	$("#btnPayment").click(function(){
		if( $("#ContactReserveForm").valid() && isPhoneValid() ) {
			if( checkAddOptionForm() && getTravelRegisteredUsers()) {
				var val = $("#paymentAMount").val();
				if(val && Number(val) >= Number(MINIMUM_DEPOSIT) && Number(val) <= Number(OVR_COST) ){
					preserveContact();
					getTravelCost(null);
					if($(this).html() != "Make Reservation"){
						showCreditDialog();
					}else{
						setTimeout(function(){
							processRegistration();		
						}, 2000);						
					}

					$("#totalAmount").html("$"+val);
					$("#paymentAMount").removeClass("error");
					$("#CreditCardCardNumber").focus();
				}else{
					$("#paymentAMount").addClass("error").focus();
				}
			}
		}else {
			$("#ContactReserveForm #ContactFirstName").focus();
		}
	});

	$("#btnProceedToPay").click(function(){		
		if( $("#ContactRegisterForm").valid() && isPhoneValid() ) {
			preserveContact();
			getCourseCost();
			if($(this).html() != "Make Reservation"){
				showCreditDialog();
			}else{
				setTimeout(function(){
					processRegistration();		
				}, 2000);
			}			
			$("#CreditCardCardNumber").focus();
		}else {
			$("#ContactFirstName").focus();
		}
	});

	function goToBottom() {
		$("html, body").animate({ scrollTop: $(document).height() }, 1000);
	}

	/*$("#btnAddUser").click(function(){
		checkCourseAvailability();		
	});*/
	
	function showDialog() {
		$(".mask").show();
		$(".dialog-add-user").show();
	}

	function hideDialog() {
		$('.mask').hide();
		$(".dialog-add-user").hide();
	}

	$(document).on('click', '.btn-remove-user', function(){		
		var id = $(this).attr('id').split("_")[1];
		$(this).closest("tr").remove();
		stu_count--;
		removeUser(id);	
		getCourseCost(stu_count);				
		//console.log(stu_count);
	});

	$("#ContactRegisterForm").show(function(){
		//checkContact();
	});

	$("#ContactRegisterForm #ContactFirstName, #ContactRegisterForm #ContactLastName, #ContactRegisterForm #ContactEmailId").keyup(function(){		
		if($(this).attr('id') == "ContactEmailId") {
			$(".dftEmail").html( $(this).val() );
		}else {
			var fname = $("#ContactFirstName").val();
			var lname = $("#ContactLastName").val();

			$(".dftName").html(fname+" "+lname);
		}
	});

	$("#ContactReserveForm #ContactFirstName, #ContactReserveForm #ContactLastName").keyup(function(){ 
		var fname = $("#ContactReserveForm #ContactFirstName").val();
		var lname = $("#ContactReserveForm #ContactLastName").val();

		$(".input-firstname").val(fname);
		$(".input-lastname").val(lname);
	});
	
	
	$(".btn-back").click(function(){
		hideCreditDialog();
	});

	$(".btn-cal-switch").click(function(){
		$('.btn-cal-switch').removeClass('btn-active');
		$('.btn-cal-switch').addClass('btn-inactive');
		$(this).removeClass('btn-inactive');
		$(this).addClass('btn-active');

		if( $(this).attr('id') === 'switchCalendar' ) {
			$('section.sec-calendar').slideDown();
			if($("#show_activity_area").val() == 1){
		    	$('section.sec-activity').show();
		    }else{
		    	$('section.sec-activity').hide();
		    }
		}else {
			$('section.sec-calendar').slideUp();
			$('section.sec-activity').show();
		}
	});
	
	$("#call_to_book_btn").click(function(){
		$("#contact_us_model").show();
	});
    
    $("#close_popup").on('click',function(){
    	$("#contact_us_model").hide();
    });
   
    if($("#show_activity_area").val() == 1){
    	$('section.sec-activity').show();
    }else{
    	$('section.sec-activity').hide();
    }
    
    $(".sub-menu").parent().hover(function(){    	
    	if($(this).children("ul").position()['left'] > 1050){
    		$(this).children("ul").css("margin-left","-166px");
    	}
    });
    if(typeof(GROUP_ID) !== 'undefined') {
		//getCourseCost(1,"initial");
	}
    $(".product-description *").each(function(){ 
    	if($(this).width()>=$(this).closest(".label-grp").width()){
    		$(this).css("width","100%","!important");
    	} 	        	
    });
    $('.fc-prev-button').click(function(){
    	 var moment = $('#calendar').fullCalendar('getDate');    	 
    	 var history_state = BASE_PATH+"/calendar/"+moment.format("YYYY/MM/DD");
    	 history.pushState(null, null, history_state);
	});

	$('.fc-next-button').click(function(){
		 var moment = $('#calendar').fullCalendar('getDate');		 
		 var history_state = BASE_PATH+"/calendar/"+moment.format("YYYY/MM/DD");
		 history.pushState(null, null, history_state);
	});
	gotoDate();
	
	$('#calendar').on('click', function (e) {
	    // close the popover if: click outside of the popover || click on the close button of the popover
	    if (popoverElement && ((!popoverElement.is(e.target) && popoverElement.has(e.target).length === 0 && $('.popover').has(e.target).length === 0) || (popoverElement.has(e.target) && e.target.id === 'closepopover'))) {
	        ///$('.popover').popover('hide'); --> works
	        closePopovers();
	    }
	});
	function closePopovers() {
	    $('.popover').not(this).popover('hide');
	}
});

function retrieveTravelCost(parts, obj) {
	$.ajax({
		url:BASE_PATH+"/calendar/getTravelCost",
		dataType:'json',
		async:true,
		method:'POST',
		data:{
			id : TRAVEL_PART_ID,
			options : parts,
			minimum_deposit : $("#paymentAMount").val()
		},
		success:function(data) {
			$.each(data.options, function(i, item){
				if( obj !== null ) {
					if( $(obj).val() == item.id ) {
						$(obj).closest("tr").find(".input-price").html(item.total_cost_f);
					}
				}

				$("#tvlSubTotal").html(data.f_base_amount);
				$("#tvlTax").html(data.f_tax_total);
				$("#tvlTotal").html(data.f_total_amount);
				$("#paymentAMount").val(data.total_amount);

				var ovrl = data.f_total_amount;
				OVR_COST = data.total_amount;
				MINIMUM_DEPOSIT = data.minimum_deposit;
				
				if(data.f_total_amount == "$0.00" && data.minimum_deposit == 0){
					$("#btnPayment").html("Make Reservation");
				}
			});
		}
	})
}
function unRegisterTravelOption(id, val) {
	$.each(TRAVEL_REGISTRATIONS, function(i, item){
		if(item.id == id) {
			TRAVEL_REGISTRATIONS.splice(i, 1);
		}
	});
}

function registerTravelOption(id, val) {
	var found = false;
	$.each(TRAVEL_REGISTRATIONS, function(i, item){
		if(item.id == id) {
			if(val == '')
				TRAVEL_REGISTRATIONS.splice(i, 1);
			else
				item.val = val;
			found = true;
		}
	});

	if(!found) {
		var opt = {};
		opt.id = id;
		opt.val = val;
		TRAVEL_REGISTRATIONS.push(opt);
	}
	return true;
}




function getTravelCost(obj) {
	var parts = [];
	$.each($('.travel-options'), function(i, item){
		var id = $(item).val();
		if(id) {
			var qty = $(item).closest("tr").find(".input-qty").val();
			if(!qty)qty = 1;

			var part = {};
			part.id = id;
			part.qty = qty;

			if(qty && qty > 0)
			parts.push(part);
		}
	});
	
	$.each($('.addon-options'), function(i, item){
		var id = $(item).val();
		if(id) {
			var qty = $(item).closest("tr").find(".input-qty").val();
			if(!qty)qty = 1;

			var part = {};
			part.id = id;
			part.qty = qty;

			if(qty && qty > 0)
			parts.push(part);
		}
	});
	if(parts && parts.length > 0) {
		retrieveTravelCost(parts, obj);
	}
	else {
		$("#tvlSubTotal, #tvlTax, #tvlTotal").html('$0.00');
	}
}
function checkMainTravelAvailability(id, qty, myInput) {	
	$.ajax({
		url:BASE_PATH+"/calendar/checkAvailability",
		dataType:'json',
		async: false,
		method:'POST',
		data:{
			id : id,
			qty : qty,
			type : 3
		},
		success:function(data) {
			if(data.is_available && qty <= data.available_seat) {
				myInput.value = (+myInput.value + 1) || 0;
			}else {
				alert("Sorry! Dont have sufficient seats!");
				false;
			}
		}
	})
}

function checkTravelAvailability(id, obj, tmp_id) {
	var qty = getOptionRegisteredQty(id, tmp_id, obj);
	$.ajax({
		url:BASE_PATH+"/calendar/checkAvailability",
		dataType:'json',
		async: false,
		method:'POST',
		data:{
			id : id,
			qty : qty,
			type : 2
		},
		success:function(data) {
			if(data.is_available) {
				registerTravelOption(tmp_id, id);
				getTravelCost(obj);
			}else {
				$(obj).val('');
				alert("Sorry! Dont have sufficient seats!");
			}
		}
	})
}
function getOptionRegisteredQty(id, tmp_id, obj) {
	var qty = 0;

	//calculating qty for addon
	/*var $obj = $('#option_'+tmp_id);
	if($obj.hasClass('base-options')) {
		qty++;
	}*/
	
	$(".base-options").each(function(){
		if($(this).val() == id){
			qty++;
		}		
	});
	
	
	$(".addon-options").each(function(){
		if($(this).val() == id){
			qty =  qty+parseInt($(this).closest("tr").find(".input-qty").val());
		}		
	});

	/*$.each(TRAVEL_REGISTRATIONS, function(i, item){
		if(item.val == id) {
			if($obj.hasClass('addon-options')) {
				qty = qty + $obj.closest("tr").find(".input-qty").val();
			}else {
				qty++;
			}
		}
	});*/
	return qty;
}

if (window.history && window.history.pushState) {
    window.history.pushState('forward', null, '');
    $(window).on('popstate', function() {    	
    	var referrer =  document.referrer;    	
    	var getLocation = function(href) {
    	    var l = document.createElement("a");
    	    l.href = href;
    	    return l;
    	};
    	
    	var l = getLocation(referrer);
    	var pathvalue = l.pathname;
    	var path_name = pathvalue.trim();   	
    	var full_url = referrer.trim();       	
    	
    	var vars = full_url.split('/');
    	var varsc = window.location.href.split('/');
    	if((varsc[4]=='register' || varsc[4]=='reserve') && vars[4]!=varsc[4]){
    		window.location.href = full_url;
    	}else{
    		gotoDate();
    	}
    });
  }
function gotoDate(){
	var history_loc = window.location.href;
	var nav_date = history_loc.split("/calendar/")[1];
	if(nav_date != undefined){
		var reg_index = nav_date.indexOf('register');
		var res_index = nav_date.indexOf('reserve');
		var tra_index = nav_date.indexOf('travel');
		var crs_index = nav_date.indexOf('course');
		var chrs_index = nav_date.indexOf('charter');
		if(nav_date != '' && reg_index == -1 && res_index == -1 && tra_index == -1 && crs_index == -1 && chrs_index == -1){
			var cal_dat = nav_date.split("/");
			var gotoDate = cal_dat[0]+"-"+cal_dat[1]+"-"+cal_dat[2];
			$('#calendar').fullCalendar('gotoDate',gotoDate);
		}
	}
}
function getId() {
	var rand = Math.floor(Math.random() * 26) + Date.now();
	return rand++;
}
function removeUser(id) {		
	$.each(REG_USERS, function(i, item){
		if(item.id == id){
			REG_USERS.splice(i, 1);
		}
	});
	//console.log("===removeUser");
	//console.log(REG_USERS);
	//fillUsersInView();
}	

function showCreditDialog() {
	$(".mask").show();
	$("#totalAmount").html(OVR_COST);
	$(".pnl-credit").show();
}

function hideCreditDialog() {
	$(".mask").hide();
	$(".pnl-credit").hide();
}

function processRegistration(){
	$.ajax({
		url:BASE_PATH+"/calendar/make_reservation/"+$('#ContactContactId').val(),
		type:'POST',			
		async: false,
		success:function(data) {
			window.location.href = BASE_PATH+"/calendar/confirm/"; 
		}
	});
}
function preserveContact(handle='') {	
	var contact = {};
	if($("#dftId").val() != ""){
		contact.id = $("#dftId").val();
	}else{
		contact.id = getId();
	}
	if($("#dftEmail").find(".input-email").val()){
		contact.email = $("#dftEmail").find(".input-email").val();
	}else{
		contact.email = "";
	}	
	if($("#dftDob").find(".input-dob").val()){		
		var tmp = $("#dftDob").find(".input-dob").val().split("-");
		var dt = new Date(tmp[2], Number(tmp[0])-1, tmp[1]);
		contact.dob = $.format.date(dt, "yyyy-MM-dd");
	}else{
		contact.dob = "";
	}
	contact.fname = $("#dftFirstName").find(".input-firstname").val();
	contact.lname = $("#dftLastName").find(".input-lastname").val();
	contact.name = contact.fname+" "+contact.lname;
	//console.log("@@@@@@@@@@00000000000000000000000000000-----")
	//console.log(REG_USERS)
	//https://kliotech.atlassian.net/browse/DS-3746
	if(REG_USERS[0].name!=''){
		REG_USERS[0].fname = contact.fname
		REG_USERS[0].lname = contact.lname
		REG_USERS[0].name = contact.name
		if (contact.email) {
			REG_USERS[0].email = contact.email
		}
		if (contact.dob) {
			REG_USERS[0].dob = contact.dob
		}
	}
	//https://kliotech.atlassian.net/browse/DS-3746
	
	$.ajax({
		url:BASE_PATH+"/calendar/preserveContact",
		type:'POST',
		async:true,
		data: {
			handle:handle,
			contact:contact,
			additionalUsers:REG_USERS,
			addonoptions:REG_ADDON
		},
		dataType:'json',
		success: function(data){
		}
	})
}

function showMainDialogTravel(key) {
	$.ajax({
		url:BASE_PATH+"/calendar/ajax_show_dialog_travel",
		type:'POST',
		async:true,
		data: {
			part_value:jsonArray[key]
		},		
		success: function(data){
			$("#add_new_popup").html(data);
			$("#add_new_popup").modal('show');
			//alert($("#cust_section").find("tr").length());
		}
	});
}

function showMainDialog(part_id,handle) {
	
	$.ajax({
		url:BASE_PATH+"/calendar/ajax_show_dialog",
		type:'POST',
		async:true,
		data: {
			part_id:part_id,
			handle:handle
		},
		success: function(data){
			$("#add_new_popup").html(data);
			$("#add_new_popup").modal('show');
			
		}
	});
}
function hideMainDialog() {	
	$("#add_new_popup").modal('hide');
}

window.onload = function() {
	init_cart();
	var e = document.getElementById("selectRegistration");
	
	if(typeof(GROUP_ID) !== 'undefined') {
		//getCourseCost(1,"initial");
	}

	if(e !== null && e.value > 0) {
		addRegistrationForm(e.value);

		if(typeof(GROUP_ID) !== 'undefined') {
			//getCourseCost(e.value,"initial");
		}
	}
}

function showAlert(msg) {
	$("#calAlert .alert-message").html(msg);
	$("#calAlert").show();

	setTimeout(function(){
		$("#calAlert").hide();		
	}, 10000);
}

$(document).on('click', '.remove-panel', function(){
	var e = document.getElementById("selectRegistration");
	
	if(e.value > 1) {
		$(this).closest(".panel-registration").remove();
		e.value = e.value -1 ;
		return;
	}

	alert('Must have atleast one user!');
});

function addRegistration(e) {
	addRegistrationForm(e.value);
	getCourseCost(e.value);
}

function addRegistrationForm(count) {
	var form = '';
	for (var i = count - 1; i >= 0; i--) {
		form += createForm();
	}
	$("#course-registrations-panel").html(form);
}

function createForm() {
	var html = '';
	html+= '<div class="col-md-6 panel-registration">';
		html+= '<div class="panel panel-primary custom-bg">';
			html+= '<span class="glyphicon glyphicon-remove remove-panel"></span>';
			html+= '<div class="panel-body">';
				html+= '<div class="form-group">';
					html+= '<label for="">Full Name</label>';
					html+= '<div class="input-group">';
						html+= '<input type="text" class="form-control" placeholder="Full Name" required>';
						html+= '<div class="input-group-addon text-danger">*</div>';
					html+= '</div>';
					html+= '<small><i>Please include First Name , Last Name and Middle Name</i></small>';
				html+= '</div>';
				
				html+= '<div class="form-group">';
					html+= '<label for="">Date of birth</label>';
					html+= '<input type="text" class="form-control" placeholder="Eg., 01-01-1990">';
				html+= '</div>';

				html+= '<div class="form-group">';
					html+= '<label for="">Height</label>';
					html+= '<div class="input-group">';
						html+= '<input type="text" class="form-control" placeholder="Enter your height" required>';
						html+= '<div class="input-group-addon text-danger">*</div>';
					html+= '</div>';
				html+= '</div>';

				html+= '<div class="form-group">';
					html+= '<label for="">Height</label>';
					html+= '<div class="input-group">';
						html+= '<input type="text" class="form-control" placeholder="Enter your weight" required>';
						html+= '<div class="input-group-addon text-danger">*</div>';
					html+= '</div>';
				html+= '</div>';
			html+= '</div>';
		html+= '</div>';
	html+= '</div>';
	return html;
}

/**
 * [getCourseCost function to retrieve course cost]
 * @return {[type]} [description]
 */
function getCourseCost(qty,when) {
	//qty = qty ? qty : REG_USERS.length+1;
	$.ajax({
		url:BASE_PATH+"/calendar/getCourseCost",
		type:'POST',
		data:{
			id : $("#check_course_id").val(),
			qty : qty,//$('#qty_'+$("#check_course_id").val()).val()
		},
		dataType:'json',
		async: true,
		success:function(data) {
			$("#crsSubTotal").html(data.f_base_amount);
			$("#totalAmount").html(data.f_total_amount);
			$("#crsTax").html(data.f_tax_total);
			$("#crsOverallTotal").html(data.f_total_amount)
			$("#hid_total_amount").val(data.hid_total_amount);
			
			if(data.f_total_amount == "$0.00"){
				$("#btnProceedToPay").html("Make Reservation");
			}
		}
	});
}

/**
 * [validateDiversForm description]
 * @return {[type]} [description]
 */
function validateDiversForm() {
	$.each($(".con-registration, .base-info").find("input"), function(i, e) {
		if(e.required) {
			(e.value === '') ? ($(e).addClass('error')) : ($(e).removeClass('error'));
		}
	});
}

/**
 * [completeBooking description]
 * @return {[type]} [description]
 */
function completeBooking() {
	validateDiversForm();
	if( $("#ContactRegisterForm").valid() && $("#CreditCardAuthForm").valid() ) {
		preserveContact2();
	}
}

function preserveContact2() {
	var id = 'ContactRegisterForm';
	var formData = {};
	if($("#ContactRegisterForm").length == 0 ) {
		id = 'ContactReserveForm'
	}

	if( !$("#"+id).valid() ) {
		return;
	}

	var contact = {};
	
	if(id == 'ContactRegisterForm') {
		contact.firstName = $("#ContactFirstName").val();
		contact.lastName = $("#ContactLastName").val();
		contact.email = $("#ContactEmailId").val();
		contact.retype_email = $("#ContactRetypeEmail").val();
		contact.phone_number = $("#ContactPhoneNumber").val();

		contact.address = 'NA';
		contact.city = 'NA';
		contact.state = 'NA';
		contact.zip = '000000';
		contact.country = 'USA';	
	}else {
		contact.firstName = $("#ContactFirstName").val();
		contact.lastName = $("#ContactLastName").val();
		contact.email = $("#ContactEmailId").val();
		contact.retype_email = $("#ContactRetypeEmail").val();
		contact.phone_number = $("#ContactPhoneNumber").val();
		contact.address = $("#ContactAddress").val();
		contact.city = $("#ContactCity").val();
		contact.state = $("#ContactState").val();
		contact.zip = $("#ContactZip").val();
		contact.country = $("#ContactCountry").val();	
	}
	

	$.ajax({
		url:BASE_PATH+"/calendar/preserveContact",
		type:'POST',
		async:true,
		data: {
			contact:contact,
		},
		dataType:'json',
		success: function(data){
			document.getElementById("CreditCardAuthForm").submit();
		}
	})
}

function recaptchaCallback() {
  $('#hiddenRecaptcha').valid();
};

function show_register_form(){
	$("#span_sign_in").css("display","none");
	$("#span_sign_up").css("display","block");
}
function show_signin_form(){
	$("#span_sign_in").css("display","block");
	$("#span_sign_up").css("display","none");
}

function OpenForgotPass(){
	$("#forgot_password").show();
}

$(document).on('click', '.guest_form_btn', function() {
    $("#signin_signup").hide();    
    if(part_type == "Course")
    	window.location.href = BASE_PATH+"register/"+uuid;
    else if(part_type == "Travel")
    	window.location.href = BASE_PATH+"reserve/"+uuid;
});
function hideshow(which){	
	$(which).hide();
}

/*function download_receipt(){
	$.ajax({
		url : BASE_PATH+'/calendar/download_receipt/'+$("#generated_id").val(),
		type : "post",
		data :{
			generated_id:$("#generated_id").val()
		},
		success: function (data){
			window.location.href = BASE_PATH+"/calendar/save_pdf/"+data; 
		}
	});
}*/
function checkAddStudentForm() {
	var isValid = true;
	$.each( $("#formAddStudent").find("input, select"), function(i, obj){
		if($(obj).attr("id") != "dftId"){
			if( $(obj).val() === '' ) {
				isValid = false;
				addError(obj);
				$(obj).focus();
			}else {
				addPass(obj);
			}
		}
	});
	return isValid;
}
function addError(obj) {
	$(obj).removeClass('valid');
	$(obj).addClass('error');
}

function addPass(obj) {
	$(obj).removeClass('error');
	$(obj).addClass('valid');
}
function checkAddOptionForm() {
	var isValid = true;
	$.each( $("#formAddOption").find("input, select"), function(i, obj){
		
		var dob_required = true;
		if ($(obj).hasClass("input-dob")==true && DOB_REQ==false) {
			dob_required = false;
		}
		//console.log($(obj).attr("id")+"--------------"+dob_required)
		if($(obj).attr("id") != "dftId"){
			if( $(obj).val() === '' && dob_required ) {
				isValid = false;
				addError(obj);
				$(obj).focus();
			}else {
				addPass(obj);
			}
		}		
	});
	return isValid;
}
function getFormmatedPhone(phone, code, type) {
	//console.log(phone, code);
	$.ajax({
		url:BASE_PATH+'/calendar/getFormattedPhone',
		dataType:'json',
		async:true,
		method:'POST',
		data:{
			phone:phone,
			code:code
		},
		success:function(data) {
			if(data.data && data.status) {
				var $iFormat = data.data.international;
				
				if(!data.is_valid){
					$("#ContactPhoneNumber").addClass("num-error");
					IS_PHONE_VALID = false;
				}else {
					$("#ContactPhoneNumber").removeClass("num-error");
					IS_PHONE_VALID = true;
				}

				if($iFormat) {
					$("#ContactPhoneNumber").val($iFormat);
				}
			}
		},
		error:function(e) {
			console.log(e);	
		}
	})
}
function checkContact() {	
	var uuid = $("#check_course_uuid").val();
	if($("#ContactRegisterForm").length !== 0 || $("#ContactReserveForm").length !== 0) {		
		var cont_arr = CONTACTS_ARY;
	//	console.log(cont_arr);
		var g = 0;
		all_customer = [];
		$.each(cont_arr, function(index, item){
			$.each(item['additionalUsers'], function(i, value){
				all_customer[g] = value;
				g++;
			});
		});			
		finalAr = [];
		for(var i=0;i<all_customer.length;i++){
			var currentPair = all_customer[i];
			var pos = null;
			for(var j=0;j<finalAr.length;j++){
		  	if(finalAr[j]['name'] == currentPair['name']){
		    	pos = j;
		    }
		  }
		  if(pos == null){
			  finalAr.push(currentPair);
		  }
		}
		//console.log(finalAr);
		if( typeof(CONTACTS_ARY[uuid]) !== 'undefined' && CONTACTS_ARY[uuid] != '') {				
			if(CONTACTS_ARY[uuid].additionalUsers != '' && CONTACTS_ARY[uuid].additionalUsers != null) {						
				//console.log("CONTACTS_ARY[uuid].additionalUsers");
				//console.log(CONTACTS_ARY[uuid].additionalUsers);
				addUsers(CONTACTS_ARY[uuid].additionalUsers);
			}
			if(CONTACTS_ARY[uuid].addonoptions != '' && CONTACTS_ARY[uuid].addonoptions != null) {						
				addUsersaddon(CONTACTS_ARY[uuid].addonoptions);
			}
		}
	}
}

function addonToCart() {
	var cost = 0;
	$.each($('.input-price'), function(i, im){
		des = $(this).closest("article").find("select").val();
		//console.log(des);
		if($(this).val()){
			cost = cost + Number($(this).val());

		}
	});
	$("#txtTotalPrice").html(cost);
	if(cost) {
		$("#btnProceedToPay").show();
	}
}
function addAnotherCust(){
	stu_count++;	
	var all_item = finalAr[stu_count-1];
	var email = '';
	var first_name = '';
	var last_name = '';	
	if(all_item){
		first_name = all_item.fname;
		last_name = all_item.lname;
		if(all_item.email){
			email = all_item.email;
		}
	}	
	var html='<tr class="default">';
	html+='<td>'+stu_count+'</td>';
	html+='<td class="dftName" id="add_dftFirstName"><input type="text" class="elm input-firstname" placeholder="FirstName" value="'+first_name+'"></td>';
	html+='<td class="dftName" id="add_dftLastName"><input type="text" class="elm input-lastname" placeholder="LastName" value="'+last_name+'"></td>';
	html+='<td class="dftEmail" id="add_dftEmail" style="text-align: left;"><input style="width:80%" type="text" class="elm input-email" placeholder="Email" value="'+email+'"></td>';
	html+='<td class="dftPrice" id="dftPrice">$'+COURSE_PRICE+'</td>';
	html+='<td><button class="btn btn-sm btn-danger-outline btn-remove-user">Remove</button></td>';
	html+='</tr>';

	$(".tbl-reg-body").append(html);
    var par = $(this).parent().parent();
    var user = {};
	user.id = ""; 
	user.fname = par.find(".input-firstname").val();
	user.lname = par.find(".input-lastname").val();
	user.name = user.fname+" "+user.lname;
	user.email = par.find(".input-email").val();
	user.id = getId();
	 
	$(".btn-remove-user:last").attr("id","btn_"+user.id);
	REG_USERS.push(user);
	$.each(REG_USERS, function(k,v) {
		if(v['id'] == user.id){
			console.log("::::::::::::::");
			v['fname'] = first_name;
			v['lname'] = last_name;
			v['name'] = first_name+' '+last_name;
			v['email'] = email;
		}
	});	
	console.log(REG_USERS);
	getCourseCost(stu_count);
	
	$(".input-firstname,.input-lastname,.input-email").each(function(){
    	$(this).on('focusout',function(){
    		getCourseCost(stu_count);
    		var par = $(this).parent().parent();
    		var rm_btn = par.find(".btn-remove-user");
    		if(rm_btn && rm_btn.attr('id')){
    			var rm_btn_id = rm_btn.attr('id').split("_")[1];
	    		var user = {};
	    		user.fname = par.find(".input-firstname").val();
	    		user.lname = par.find(".input-lastname").val();
	    		user.name = user.fname+" "+user.lname;
	    		user.email = par.find(".input-email").val();
	    		
	    		$.each(REG_USERS, function(k,v) {
	    			if(v['id'] == rm_btn_id){
	    				v['fname'] = user.fname;
	    				v['lname'] = user.lname;
	    				v['name'] = user.name;
	    				v['email'] = user.email;
	    			}
    			});	    		
    		}    		
    	});
    });	
}

function isPhoneValid() {
	return true;
}

function fillUsersInView(full_qty) {	
	var html = '';	
	var int_qty = 1;
	//console.log("REG_USERS--------->4");
	//console.log(REG_USERS);
	if (REG_USERS.length>1) {
		REG_USERS = $.grep(REG_USERS,function(n){
			if(n.fname){			
				return n;
			}
		 });
	}
	//console.log("REG_USERS--------->5");
	//console.log(REG_USERS);
	
	$.each(REG_USERS, function(i, item){
		//console.log("item");
		//console.log(item);
		if(i == 0){		
			if(item.fname == ''){
				if(finalAr.length > 0){
					item = finalAr[0];
				}
			}
			$("#dftFirstName").find(".input-firstname").val(item.fname);
			$("#dftLastName").find(".input-lastname").val(item.lname);			
			$("#dftEmail").find(".input-email").val(item.email);
			$(".btn-remove-user:first").attr("id","btn_"+item.id);
			$("#dftId").val(item.id);
		}
		if(i > 0 && i<full_qty){
			int_qty++;		
			stu_count++;
			var html='<tr class="default">';
			html+='<td>'+(Number(i)+1)+'</td>';
			html+='<td class="dftName" id="add_dftFirstName"><input type="text" class="elm input-firstname" placeholder="FirstName" value="'+item.fname+'"></td>';
			html+='<td class="dftName" id="add_dftLastName"><input type="text" class="elm input-lastname" placeholder="LastName" value="'+item.lname+'"></td>';
			html+='<td class="dftEmail" id="add_dftEmail" style="text-align: left;"><input style="width:80%" type="text" class="elm input-email" placeholder="Email" value="'+item.email+'"></td>';
			html+='<td class="dftPrice" id="dftPrice">$'+COURSE_PRICE+'</td>';
			html+='<td><button id="btn_'+item.id+'" class="btn btn-sm btn-danger-outline btn-remove-user">Remove</button></td>';
			html+='</tr>';	
			$(".tbl-reg-body").append(html);
		}
		
	});	
	if(int_qty < full_qty){
		for(var h=0;h<(full_qty-int_qty);h++){
			addAnotherCust();
		}
	}
	setTimeout(function(){
		getCourseCost(full_qty);		
	}, 2000);	
}
function fillUsersInViewTravel(full_qty){
	var html = '';	
	var int_qty = 1;
	
	REG_USERS = $.grep(REG_USERS,function(n){
		if(n.fname){			
			return n;
		}
	 });
	//console.log("@@@@@@@@@@@@@##################Addon");
	//console.log(REG_USERS);
	if(REG_USERS.length == 0){
		if(finalAr.length > 0){
			var iteml = finalAr[0];
			$("#dftFirstName").find(".input-firstname").val(iteml.fname);
			$("#dftLastName").find(".input-lastname").val(iteml.lname);	
			var item_dob = '';
			if(iteml.dob){
				item_dob = (iteml.dob).split("-");
				item_dob = item_dob[2]+"-"+item_dob[1]+"-"+item_dob[0];
			}
			$("#dftDob").find(".input-dob").val(item_dob);	
		}
	}
	//console.log(REG_ADDON);
	$.each(REG_USERS, function(i, item){
		var item_dob = '';
		if(item.dob && item.dob!="NaN-NaN-NaN"){
			item_dob = (item.dob).split("-");
			item_dob = item_dob[2]+"-"+item_dob[1]+"-"+item_dob[0];
		}
		if(i == 0){		
			if(i == 0){
				$("#dftFirstName").find(".input-firstname").val(item.fname);
				$("#dftLastName").find(".input-lastname").val(item.lname);
				var item_dob = '';
				if(item.dob && item.dob!="NaN-NaN-NaN"){
					item_dob = (item.dob).split("-");
					item_dob = item_dob[2]+"-"+item_dob[1]+"-"+item_dob[0];
				}
				$("#dftDob").find(".input-dob").val(item_dob);				
			}
			$.each(baseOptionsAry, function(i, base){
				if(item.option_id == base.id){
					$("#option_1").val(item.option_id);
				}
			});			
			$(".dob1").val(item_dob);
		}		
		if(i > 0 && i<full_qty){
			int_qty++;	
			stu_count++;
			var html='<tr>';
			html+='<td><select name="" class="elm travel-options base-options" id="option_'+getId()+'" style="max-width:unset;">';
			html+='<option value="">Select Base Option</option>'
			$.each(baseOptionsAry, function(i, base){
				if(item.option_id == base.id){
					html+='<option value="'+base.id+'" selected>'+base.desc+'</option>';
				}else{
					html+='<option value="'+base.id+'">'+base.desc+'</option>';
				}
			});
			html+='</select></td>';
			html+='<td><input type="text" class="elm input-firstname" placeholder="FirstName" value="'+item.fname+'"></td>';
			html+='<td><input type="text" class="elm input-lastname" placeholder="LastName" value="'+item.lname+'"></td>';
			html+='<td><input type="text" data-provide="datepicker" class="elm input-dob" placeholder="MM-DD-YYYY" value="'+item_dob+'"></td>';
			html+='<td><label class="elm input-price"></label></td>';
			html+='<td><button class="btn btn-sm btn-danger-outline btn-remove-base">Remove</button><input type="hidden" class="elm key_value" value="'+stu_count+'"></td>';
			html+='</tr>';
			
			$("#rowBaseOptions").append(html);
		}		
		$.each($('.travel-options'), function(i, item){
			var obj = $(this);
			var qt = 1;
			if( $(obj).hasClass("input-qty") ) {
				obj = $(obj).closest("tr").find("select");
			}

			if( $(obj).hasClass('addon-options') ) {
				qt = $(obj).closest("tr").find(".input-qty").val();
			}
			$(obj).closest("tr").find(".input-price").html("$0.00");
			var tmp_id = $(obj).attr('id').split("_")[1];
			var val = $(obj).val();

			if(qt == 0 || $(obj).val() == '') {
				unRegisterTravelOption(tmp_id, val);
				return;
			}
			checkTravelAvailability(val, obj, tmp_id);	
		});
	});	
	if(int_qty < full_qty){
		for(var h=0;h<(full_qty-int_qty);h++){
			addMoreBaseOption();
		}
	}
	//console.log("@CCCCCCOOOOOOOLLLLL");
	//console.log(REG_ADDON);
	
	var sstu_count = 0;
	$("#rowAddonOptions").html('');
	$.each(REG_ADDON, function(i, item){
		sstu_count++;
		var html='<tr>';
		var rid = getId();
		html+='<td><select name="" class="elm addon-options base-options" id="option_'+rid+'">';
		html+='<option value="">Select Addon Option</option>'
		$.each(addonOptionsAry, function(i, base){
			if(item.option_id == base.id){
				html+='<option value="'+base.id+'" selected>'+base.desc+'</option>';
			}else{
				html+='<option value="'+base.id+'">'+base.desc+'</option>';
			}
		});
		html+='</select></td>';
		html+='<td><input type="text" class="elm SS input-qty" data-id="option_'+rid+'"  placeholder="Quantity"  value="'+item.qty+'"></td>';
		html+='<td></td>';
		html+='<td></td>';
		html+='<td><label class="elm input-price"></label></td>';
		//if (sstu_count==1) {
		//	html+='<td></td>';
		//}else{
			html+='<td><button class="btn btn-sm btn-danger-outline btn-remove-base">Remove</button><input type="hidden" class="elm key_value" value="'+sstu_count+'"></td>';
		//}
		html+='</tr>';
		$("#rowAddonOptions").append(html);
		
		$.each($('.addon-options'), function(i, item){
			var obj = $(this);
			var qt = 1;
			if( $(obj).hasClass("input-qty") ) {
				obj = $(obj).closest("tr").find("select");
			}
			if( $(obj).hasClass('addon-options') ) {
				qt = $(obj).closest("tr").find(".input-qty").val();
			}
			$(obj).closest("tr").find(".input-price").html("$0.00");
			var tmp_id = $(obj).attr('id').split("_")[1];
			var val = $(obj).val();
			if(qt == 0 || $(obj).val() == '') {
				unRegisterTravelOption(tmp_id, val);
				return;
			}
			//console.log(val+"--"+obj+"--"+tmp_id);
			checkTravelAvailability(val, obj, tmp_id);	
		});
		
		
	});
	//if (REG_ADDON.length==0) {
		addMoreAddonOption();
	//}
}
function addMoreBaseOption() { 
	stu_count++;
	var all_item = finalAr[stu_count-1];
	var item_dob = '';
	var first_name = '';
	var last_name = '';	
	if(all_item){
		first_name = all_item.fname;
		last_name = all_item.lname;
		if(all_item.dob){
			item_dob = (all_item.dob).split("-");
			item_dob = item_dob[2]+"-"+item_dob[1]+"-"+item_dob[0];
		}
	}
	var html='<tr>';
		html+='<td><select name="" class="elm travel-options base-options" id="option_'+getId()+'" style="max-width:unset;">';
			html+='<option value="">Select Base Option</option>'
		$.each(baseOptionsAry, function(i, item){
			html+='<option value="'+item.id+'">'+item.desc+'</option>';
		});
		html+='</select></td>';
		html+='<td><input type="text" class="elm input-firstname" placeholder="FirstName" value="'+first_name+'"></td>';
		html+='<td><input type="text" class="elm input-lastname" placeholder="LastName" value="'+last_name+'"></td>';
		html+='<td><input type="text" data-provide="datepicker" class="elm input-dob" placeholder="MM-DD-YYYY" value="'+item_dob+'"></td>';
		html+='<td><label class="elm input-price"></label></td>';
		html+='<td><button class="btn btn-sm btn-danger-outline btn-remove-base">Remove</button><input type="hidden" class="elm key_value" value="'+stu_count+'"></td>';
	html+='</tr>';
	$("#rowBaseOptions").append(html);
}

function addMoreAddonOption() {
	if(addonOptionsAry.length > 0) {
		var html='<tr>';
			html+='<td><select name="" class="elm addon-options base-options" id="option_'+getId()+'">';
				html+='<option value="">Select Addon Option</option>'
			$.each(addonOptionsAry, function(i, item){
				html+='<option value="'+item.id+'">'+item.desc+'</option>';
			});
			html+='</select></td>';
			html+='<td><input type="text" class="elm DD input-qty" placeholder="Quantity" value="1"></td>';
			html+='<td></td>';
			html+='<td></td>';
			html+='<td><label class="elm input-price"></label></td>';
			html+='<td><button class="btn btn-sm btn-danger-outline btn-remove-base">Remove</button></td>';
		html+='</tr>';
		$("#rowAddonOptions").append(html);
		$("#rowAddonOptions tr:first").find(".btn-remove-base").remove();
	}
}

function getTravelRegisteredUsers() {
	REG_USERS = [];
	$.each( $("#rowBaseOptions tr"), function(i, row){			
		var user = {};
		user.id = $(row).find(".input-contact_id").val();
		user.fname = $(row).find(".input-firstname").val();
		user.lname = $(row).find(".input-lastname").val();
		user.name = user.fname+" "+user.lname;
		var tmp = $(row).find(".input-dob").val().split("-");
		var dt = new Date(tmp[2], Number(tmp[0])-1, tmp[1]);
		user.dob = $.format.date(dt, "yyyy-MM-dd");
		user.option_id = $(row).find(".travel-options").val();
		REG_USERS.push(user);
	});	
	return true;
}

function getTravelAddonOptions() {
	REG_ADDON = [];
	$.each( $("#rowAddonOptions tr"), function(i, row){			
		var user = {};
		if ($(row).find(".input-qty").val()>0) {
			user.qty = $(row).find(".input-qty").val();
			user.option_id = $(row).find(".addon-options").val();
			REG_ADDON.push(user);
		}
	});	
	return true;
}

function addUsers(users) {
	//console.log("-----------users------"+stu_count);
	//console.log(users);
	REG_USERS = users;
}
function addUsersaddon(addon) {
	REG_ADDON = addon;
}
function checkCourseAvailability(course_id,qty,myInput) {
	if(myInput != null){
		 qty = qty;
	}else{
		 qty = qty+1;
	}
	$.ajax({
		url:BASE_PATH+"/calendar/checkAvailability",
		type:'POST',
		data:{
			id : course_id,
			qty : qty,
			type : 1
		},
		dataType:'json',
		async: false,
		success:function(data) {
			if(data.is_available && qty <= data.available_seat) {
				if(myInput != null){
					myInput.value = (+myInput.value + 1) || 0;
				}else{
					if(checkAddStudentForm()){
						addAnotherCust();
					}
				}
			}else {
				alert("Sorry! No more seats available!");
				return false;
			}
		}
	});
}