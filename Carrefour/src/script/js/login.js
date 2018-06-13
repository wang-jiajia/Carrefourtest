;//登录验证
(function($){
	function Login(){
		this.$username=$('#username');
		this.$password=$('#password');
		this.$loginBtn=$('.loginBtn .button');
		this.$remember_input=$('#rememberCheck');
		this.$remember_label=$('.rememberMe');
		this.$rememberWarning=$('.rememberWarning');
		this.$errorBox=$('.loginError');
	}
	Login.prototype.init=function(){
		var that=this;
		this.$remember_input.hover(function(){
			that.$rememberWarning.show();
		},function(){
			that.$rememberWarning.hide();
		});
		this.$remember_label.hover(function(){
			that.$rememberWarning.show();
		},function(){
			that.$rememberWarning.hide();
		});
		this.$username.on('focus',function(){
			that.nameFocus($(this));
		});
		this.$username.on('blur',function(){
			that.nameBlur($(this));
		});
		this.$loginBtn.on('click',function(){
			that.loginSub();
		});
	}
	Login.prototype.nameFocus=function($ele){
		if($ele.val() == '邮箱/用户名/手机号'){
			$ele.removeClass('grayColor').val('');
		}
	}
	Login.prototype.nameBlur=function($ele){
		if($ele.val() == ''){
			$ele.addClass('grayColor').val('邮箱/用户名/手机号');
		}
	}
	Login.prototype.loginSub=function(){
		var that=this;
		var $uvalue=this.$username.val();
		var $pvalue=this.$password.val();
		if($uvalue!='' && $pvalue!=''){
			$.ajax({
				url: '../../php/login.php',
				type: 'post',
				data: {
					username: $uvalue,
					password: $pvalue
				}
			}).done(function(data) {
				if(data){
					if(that.$remember_input.prop('checked') == true){
						$.cookie('username', $uvalue, { expires: 7 });
					}else{
						$.cookie('username', $uvalue);
					}
					if(location.search){
						location.href='details.html'+location.search;
					}else{
						location.href='index.html';
					}
				}else{
					that.$errorBox.show().html('用户名或密码错误');
				}
			});
		}else{
			this.$errorBox.show().html('用户名或密码不能为空');
		}
	}
	new Login().init();
})(jQuery);