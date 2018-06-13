;//用户注册，表单验证
(function($){
	function Register(){
		this.$protocolBox=$('.protocolCheckBox');
		this.$protocolBtn=$('.protocolCheckBox .agreeBtn');
		this.$formBox=$('.regFormBox');
		this.$form=$('#regForm');
		this.$username=$('#username');
		this.$password=$('#password');
		this.$confirm=$('#confirm');
		this.$email=$('#email');
		this.$tips=$('#regForm .tip');
		this.protocolLock=false; //以下五个是开关，验证点击提交时是否所有条件都已满足
		this.usernameLock=false;
		this.passwordLock=false;
		this.confirmLock=false;
		this.emailLock=false;
	}
	Register.prototype.init=function(){
		var that=this;
		this.$protocolBtn.on('click',function(){
			that.Vprotocol();
		});
		//输入框获得焦点时，弹出提示
		this.$username.on('focus',function(){
			that.$tips.eq(0).show().css('color','#999').html('请输入3-15个字符，支持汉字、字母、数字、下划线、连字符');
		});
		this.$password.on('focus',function(){
			that.$tips.eq(1).show().css('color','#999').html('请输入6-20个字符');
		});
		this.$confirm.on('focus',function(){
			that.$tips.eq(2).show().css('color','#999').html('请再次输入密码');
		});
		this.$email.on('focus',function(){
			that.$tips.eq(3).show().css('color','#999').html('请输入电子邮箱地址');
		});
		//输入框失去焦点时，进行验证
		this.$username.on('blur',function(){
			that.Vusername($(this));
		});
		this.$password.on('blur',function(){
			that.Vpassword($(this));
		});
		this.$confirm.on('blur',function(){
			that.Vconfirm($(this));
		});
		this.$email.on('blur',function(){
			that.Vemail($(this));
		});
		this.$form.on('submit',function(){
			return that.Vsubmit();
		});
	}
	//验证是否同意协议，同意了才显示注册页
	Register.prototype.Vprotocol=function(){
		this.protocolLock=true;
		this.$protocolBox.hide();
		this.$formBox.show();
	}
	//验证用户名是否符合要求
	Register.prototype.Vusername=function($ele){
		var that=this;
		var $value=$ele.val();
		var reg=/^[\u4e00-\u9fa5\w\-]{3,15}$/;
		if($value != ''){
			//通过ajax传输到后端验证用户名是否已存在
			if(reg.test($value)){
				$.ajax({
					url:'../../php/register.php',
					type:'post',
					data:{checkname: $value}
				}).done(function(data){
					if(!data){
						that.$tips.eq(0).css('color','#039D1C').html('✔');
						that.usernameLock=true;
					}else{
						that.$tips.eq(0).css('color','#F00').html('✘ 该用户名已经存在');
						that.usernameLock=false;
					}
				});
			}else{
				this.$tips.eq(0).css('color','#F00').html('✘ 用户名格式错误');
				that.usernameLock=false;
			}
		}else{
			this.$tips.eq(0).css('color','#F00').html('✘ 用户名不能为空');
			this.usernameLock=false;
		}
	}
	//验证密码是否符合要求
	Register.prototype.Vpassword=function($ele){
		var $value=$ele.val();
		var reg=/^[^\u4e00-\u9fa5]{6,20}$/;
		if($value != ''){
			if(reg.test($value)){
				var level=0;
				var regNumber=/[\d]+/;
				var regLetter=/[a-zA-Z]+/;
				var regSpecial=/[\W]+/;
				if(regNumber.test($value)){
					level++;
				}
				if(regLetter.test($value)){
					level++;
				}
				if(regSpecial.test($value)){
					level++;
				}
				switch(level){
					case 1:this.$tips.eq(1).css('color','#F00').html('✔ 密码强度：弱');break;
					case 2:this.$tips.eq(1).css('color','#FFBA02').html('✔ 密码强度：中');break;
					case 3:this.$tips.eq(1).css('color','#039D1C').html('✔ 密码强度：强');break;
				}
				this.passwordLock=true;
			}else{
				this.$tips.eq(1).css('color','#F00').html('✘ 密码格式错误');
				this.passwordLock=false;
			}
		}else{
			this.$tips.eq(1).css('color','#F00').html('✘ 密码不能为空');
			this.passwordLock=false;
		}
	}
	//验证两次密码是否一致
	Register.prototype.Vconfirm=function($ele){
		var $pvalue=this.$password.val();
		var $cvalue=$ele.val();
		if($cvalue != ''){
			if($cvalue == $pvalue){
				this.$tips.eq(2).css('color','#039D1C').html('✔');
				this.confirmLock=true;
			}else{
				this.$tips.eq(2).css('color','#F00').html('✘ 两次输入的密码不一致');
				this.confirmLock=false;
			}
		}else{
			this.$tips.eq(2).css('color','#F00').html('✘ 确认密码不能为空');
			this.confirmLock=false;
		}
	}
	//验证邮箱是否符合要求
	Register.prototype.Vemail=function($ele){
		var $value=$ele.val();
		var reg=/^[\w][\w\-]*\@[\w][\w\-]*\.[\w][\w\-\.]+$/;
		if($value != ''){
			if(reg.test($value)){
				this.$tips.eq(3).css('color','#039D1C').html('✔');
				this.emailLock=true;
			}else{
				this.$tips.eq(3).css('color','F00').html('✘ 电子邮箱格式错误');
				this.emailLock=false;
			}
		}else{
			this.$tips.eq(3).css('color','#F00').html('✘ 电子邮箱不能为空');
			this.$emailLock=false;
		}
	}
	//验证是否符合所有提交的前提条件
	Register.prototype.Vsubmit=function(){
		//防止跳过同意协议
		if(!this.protocolLock){
			alert('您必须先同意用户协议才能注册！');
			window.location.reload();
		}
		if(this.$username.val() == ''){
			this.$tips.eq(0).show().css('color','#F00').html('✘ 用户名不能为空');
		}
		if(this.$password.val()==''){
			this.$tips.eq(1).show().css('color','#F00').html('✘ 密码不能为空');
		}
		if(this.$confirm.val()==''){
			this.$tips.eq(2).show().css('color','#F00').html('✘ 确认密码不能为空');
		}
		if(this.$email.val()==''){
			this.$tips.eq(3).show().css('color','#F00').html('✘ 电子邮箱不能为空');
		}
		//只要有一个开关为false，就阻止提交
		if(!this.protocolLock ||!this.usernameLock || !this.passwordLock || !this.confirmLock || !this.emailLock){
			return false;
		}else{
			alert('注册成功！确定后跳转登录页');
		}
	}
	new Register().init();
})(jQuery);