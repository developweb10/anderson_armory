if(typeof jQuery == 'undefined'){
        document.write('<script type="text/javascript" src="https://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.1.min.js"></'+'script>');
  }
function submit_form_response(form_uuid){
	var k=0;
	var val_flag=true;
	
	$(".custom_fld_div").each(function() {
		var inputtype=$('#custom_field_type'+k).val();
		var custom_fld_name=$('#custom_fld_name'+k).val();
		var custom_fld_validation_flag=$('#custom_field_validate'+k).val();
		if(custom_fld_validation_flag==1){
			if(inputtype =='checkbox' || inputtype =='radio'){
				var inputname=$('#custom_fld_data_hidden'+k).attr('name');
				if($('#custom_fld_data_hidden'+k).val()==''){
					$('#custom_fld_data_hidden'+k).siblings('.help-block').html('Please select '+custom_fld_name);
					$('#custom_fld_data_hidden'+k).siblings('.help-block').addClass('error');
					val_flag=false;
				}else{
					$('#custom_fld_data_hidden'+k).siblings('.help-block').html('');
					$('#custom_fld_data_hidden'+k).siblings('.help-block').removeClass('error');
	
				}
			}else{
				if($('#custom_fld_data'+k).val()==''){
					$('#custom_fld_data'+k).siblings('.help-block').html('Please select '+custom_fld_name);
					$('#custom_fld_data'+k).siblings('.help-block').addClass('error');
					val_flag=false;
				}else{
					$('#custom_fld_data'+k).siblings('.help-block').html('');
					$('#custom_fld_data'+k).siblings('.help-block').removeClass('error');
				}
			}
		}
	k++;
	});
	
	if($('#hiddenRecaptchaReview').val()!=''){
		$('#captcha_error').html('');
		$('#captcha_error').removeClass('error');
	}else{
		$('#captcha_error').html('Please validate captcha');
		$('#captcha_error').addClass('error');
		val_flag=false;
	}
	if(form_uuid !='' && val_flag==true){
		 var obj = $('#custom_form_submit_btn');
		 obj.html("<span><i class='fa fa-spinner fa-spin'></i></span> Loading....");
		$('#custom_form_submit_btn').attr('disabled',true);
		 $.ajax({
	            type:"POST",
	            url:$('#custom_form_base_path').val()+"/forms/ajax_save_form_responses/"+form_uuid,
	            cache:false,
	            data:$('#custom_data_form').serialize(),
	            success: function(data){
	            	 var obj = $('#custom_form_submit_btn');
	            	 obj.html("Submit");
	                if(data.trim() == 'success'){
						$.notify({
								title: "<strong></strong> ",
								icon: 'glyphicon glyphicon-edit',
								message: $('#successmsg_on_submit').val()
						},{offset: {x: 50,y: 200},timer: 1000,type: 'success',animate: {enter: 'animated lightSpeedIn',exit: 'animated lightSpeedOut'} });
							                    
	                    $('#custom_form_div_holder').css('display','none');
	                    //location.reload();
	                }else{
	                	
	                }
	                $('#custom_form_submit_btn').attr('disabled',false);
	            }
	        });
	}
	
}

function check_uncheck_custom_fld(value,i,s){
	
	var tot=$('#custom_field_list_qty'+i).val();
	var checked_values=[];
	for(var j=0; j<=tot;j++){
		var dataaa=$('#custom_fld_data'+i+'_'+j).attr('data_attr');
        if($('#custom_fld_data'+i+'_'+j).prop("checked") == true){
        	checked_values.push(dataaa.trim());
        }
        else{
            
        }
	}
	$('#custom_fld_data_hidden'+i).val(checked_values)
	console.log(checked_values);
  
}