!function(o){function e(){this.$username=o("#username"),this.$password=o("#password"),this.$loginBtn=o(".loginBtn .button"),this.$remember_input=o("#rememberCheck"),this.$remember_label=o(".rememberMe"),this.$rememberWarning=o(".rememberWarning"),this.$errorBox=o(".loginError")}e.prototype.init=function(){var e=this;this.$remember_input.hover(function(){e.$rememberWarning.show()},function(){e.$rememberWarning.hide()}),this.$remember_label.hover(function(){e.$rememberWarning.show()},function(){e.$rememberWarning.hide()}),this.$username.on("focus",function(){e.nameFocus(o(this))}),this.$username.on("blur",function(){e.nameBlur(o(this))}),this.$loginBtn.on("click",function(){e.loginSub()})},e.prototype.nameFocus=function(e){"邮箱/用户名/手机号"==e.val()&&e.removeClass("grayColor").val("")},e.prototype.nameBlur=function(e){""==e.val()&&e.addClass("grayColor").val("邮箱/用户名/手机号")},e.prototype.loginSub=function(){var r=this,n=this.$username.val(),e=this.$password.val();""!=n&&""!=e?o.ajax({url:"../../php/login.php",type:"post",data:{username:n,password:e}}).done(function(e){e?(1==r.$remember_input.prop("checked")?o.cookie("username",n,{expires:7}):o.cookie("username",n),"sid"==location.search.slice(1,4)?location.href="details.html"+location.search:"?fromcart"==location.search?location.href="cart.html":location.href="index.html"):r.$errorBox.show().html("用户名或密码错误")}):this.$errorBox.show().html("用户名或密码不能为空")},(new e).init()}(jQuery);