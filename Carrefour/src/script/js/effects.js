;
/*(function($){
	function Banner(parent){
		this.$bannerUl=$(parent+' .bannerList');
		this.$dotUl=$(parent+' .orderDot');
		this.num=0;
	}
	Banner.prototype.init=function(){
		//this.$bannerUl.css('width':);
	}
	Banner.prototype.switch=function(){

	}
	new Banner('.bannerBox').init();
})(jQuery);*/

;//固定条
(function(){
	function FixedBar(){
		this.bar=$('.fixedBar');
		this.promotion=$('.promotion'); //标志元素
	}
	FixedBar.prototype.init=function(){
		var that=this;
		$(window).on('scroll',function(){
			that.scroll();
		});
	}
	FixedBar.prototype.scroll=function(){
		var st=$('html,body').scrollTop(); //滚动条高度
		if(st>this.promotion.offset().top){ // 大于或小于标志元素的偏移值，则固定条移动。
			this.bar.stop(true).animate({ //stop()需要添加
				top: 0
			},400);
		}else{
			this.bar.stop(true).animate({
				top: -58
			},400);
		}
	}
	new FixedBar().init();
})();

;//楼梯
(function($){
	function Floor(){
		this.$nav=$('.sideNav');
		this.$louti=$('.sideNav li').not('.toTop'); //非最后一个的li
		this.$last=$('.sideNav li.toTop');
		this.$louceng=$('#main .floor'); //楼层
		this.promotion=$('.promotion'); //标志元素
	}
	Floor.prototype.init=function(){
		this.$nav.css('left',$('.main_content').offset().left-100);
		var that=this;
		$(window).on('scroll',function(){
			that.scroll();
		});
		this.$louti.on('click',function(){
			that.jump($(this));
		});
		this.$last.on('click',function(){
			that.toTop();
		})
	}
	Floor.prototype.scroll=function(){
		var that=this;
		var $scrolltop=$('body,html').scrollTop();
		if($scrolltop>=this.promotion.offset().top){
			this.$nav.show(400);
		}else{
			this.$nav.hide(400);
		}
		this.$louceng.each(function(index){
			if($scrolltop >= $(this).offset().top-200){
				that.$louti.eq(index).addClass('active').siblings('.sideNav li').removeClass('active');
			}
		});
	}
	Floor.prototype.jump=function($ele){
		$ele.addClass('active').siblings('.sideNav li').removeClass('active');
		$('body,html').animate({
			scrollTop: this.$louceng.eq($ele.index('.sideNav li')).offset().top-60
		}, 200);
	}
	Floor.prototype.toTop=function(){
		$('body,html').animate({
			scrollTop: 0
		}, 600);
	}
	new Floor().init();
})(jQuery);