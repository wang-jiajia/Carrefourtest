;//轮播图
(function($){
	function Banner(parent){ //传入banner盒子的选择器
		this.$bannerBox=$(parent);
		this.$bannerUl=$(parent+' .bannerList');
		this.$bannerLi=$(parent+' .bannerList li');
		this.$dotLi=$(parent+' .orderDot li');
		this.$left=$(parent+' .arrow-left');
		this.$right=$(parent+' .arrow-right');
		this.$bannerLiWidth=$(parent+' .bannerList li').eq(0).width(); //每个li的width
		this.$ind=0; //索引
		this.timer=null;
		this.switchLock=true;
		this.$loadingpic=$('.loadingpic') //切换开关，防止切换过快
	}
	Banner.prototype.init=function(){
		var that=this;
		this.$bannerLi.eq(0).clone().appendTo(this.$bannerUl); //克隆第一张和最后一张
		this.$bannerLi.eq(this.$bannerLi.length-1).clone().prependTo(this.$bannerUl);
		this.$bannerUl.css({
			width: this.$bannerLiWidth*(this.$bannerLi.length+2),
			left: -this.$bannerLiWidth
		}); //设置ul宽度为所有li宽度之和
		this.$dotLi.eq(0).addClass('active');
		this.$loadingpic.hide();
		this.$bannerBox.show(); //初始状态完成之后显示banner
		//左右按钮切换
		this.$left.on('click',function(){
			if(that.switchLock){
				that.switchLock=false;
				that.$ind--;
				that.picSwitch();
			}
		});
		this.$right.on('click',function(){
			if(that.switchLock){
				that.switchLock=false;
				that.$ind++;
				that.picSwitch();
			}
		});
		//小圆点切换
		this.$dotLi.on('mouseover',function(){
			that.$ind=$(this).index(); //修改索引
			that.picSwitch();
		});
		//自动切换
		this.timer=setInterval(function(){
			that.$ind++;
			that.picSwitch();
		},1500);
		//鼠标滑过banner区域，停止自动切换，显示左右按钮；移动恢复。
		this.$bannerBox.hover(function(){
			that.$left.show();
			that.$right.show();
			clearInterval(that.timer);
		},function(){
			that.$left.hide();
			that.$right.hide();
			that.timer=setInterval(function(){
				that.$ind++;
				that.picSwitch();
			},1500);
		});
	}
	Banner.prototype.picSwitch=function(){
		var that=this;
		if(this.$ind>this.$dotLi.length-1){ //索引大于最后一张的索引，则第0个加类，索引小于0，则最后一个加类
			this.$dotLi.eq(0).addClass('active').siblings('li').removeClass('active');
		}else if(this.$ind<0){
			this.$dotLi.eq(this.$dotLi.length-1).addClass('active').siblings('li').removeClass('active');
		}else{
			this.$dotLi.eq(this.$ind).addClass('active').siblings('li').removeClass('active');
		}
		this.$bannerUl.stop(true).animate({
			left: -this.$bannerLiWidth*(this.$ind+1)
		},400,function(){
			that.switchLock=true; //切换完成改变开关的值
			if(that.$ind>that.$dotLi.length-1){ //当运动到克隆的图片时，运动完成立即重新定位到原图片位置
				that.$ind=0
				that.$bannerUl.css({
					left: -that.$bannerLiWidth*(that.$ind+1)
				});
			}else if(that.$ind<0){
				that.$ind=that.$dotLi.length-1
				that.$bannerUl.css({
					left: -that.$bannerLiWidth*(that.$ind+1)
				});
			}
		});
	}
	setTimeout(function(){
		new Banner('.bannerBox').init();
		new Banner('.smallBannerBox').init();
	},500);
})(jQuery);

;//固定条
(function(){
	function FixedBar(){
		this.$bar=$('.fixedBar');
		this.$promotion=$('.promotion'); //标志元素
	}
	FixedBar.prototype.init=function(){
		var that=this;
		$(window).on('scroll',function(){
			that.scroll();
		});
	}
	FixedBar.prototype.scroll=function(){
		var st=$(document).scrollTop(); //滚动条高度
		if(st>this.$promotion.offset().top){ // 大于或小于标志元素的偏移值，则固定条移动。
			this.$bar.stop(true).animate({ //stop()需要添加
				top: 0
			},400);
		}else{
			this.$bar.stop(true).animate({
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
		this.$nav.css('left',$('.main_content').offset().left-100); //定位楼梯的位置为主内容的左侧100px
		$(window).on('resize',function(){
			that.$nav.css('left',$('.main_content').offset().left-100);
		});
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
	//滚轮事件
	Floor.prototype.scroll=function(){
		var that=this;
		var $scrolltop=$(document).scrollTop();
		if($scrolltop>=this.promotion.offset().top){ //到达标志元素位置，楼梯才显示
			this.$nav.stop(true).animate({
				width: 45,
				height: 360
			},100);
		}else{
			this.$nav.stop(true).animate({
				width: 0,
				height: 0
			},100);
		}
		this.$louceng.each(function(index){ //滚动时判断每个楼层的top值与scrollTop的关系(预设当scrollTop快要到达楼层时，对应楼梯高亮)
			if($scrolltop >= $(this).offset().top-200){
				that.$louti.eq(index).addClass('active').siblings('.sideNav li').removeClass('active');
			}
		});
	}
	//跳转对应楼层
	Floor.prototype.jump=function($ele){
		$ele.addClass('active').siblings('.sideNav li').removeClass('active');
		$('html,body').animate({
			scrollTop: this.$louceng.eq($ele.index('.sideNav li')).offset().top-60
		}, 200);
	}
	//回到顶部
	Floor.prototype.toTop=function(){
		$('html,body').animate({
			scrollTop: 0
		}, 600);
	}
	new Floor().init();
})(jQuery);

;//tab切换
(function($){
	 function tabSwitch(tabSelector,contentSelector){ //因两个部分的tabSwitch子元素类名没有设置一致(写结构是未考虑周全)，需传入完整选择器
	 	this.$tabs=$(tabSelector); //tabs选择器
	 	this.$content=$(contentSelector); //tabs对应内容选择器
	 }
	 tabSwitch.prototype.init=function(){
	 	var that=this;
	 	this.$tabs.on('mouseover',function(){
	 		$(this).addClass('active').siblings('li').removeClass('active');
	 		if(that.$tabs.length<=4){ //判断鼠标当前在哪个部分(promotion部分还是floor部分)的tabs上，以确定index和siblings的参数
	 			that.$content.eq($(this).index('.promotion .tabs li')).show().siblings('.proList').hide();
	 		}else{
	 			that.$content.eq($(this).index('.floor .floorTabs li')).show().siblings('.tabContent').hide();
	 		}
	 	});
	 }
	 new tabSwitch('.promotion .tabs li','.promotion .proList').init(); //promotion部分实例化
	 new tabSwitch('.floor .floorTabs li','.floor .tabContent').init();	//floor部分实例化
})(jQuery);

;//商品图片鼠标滑过，向左偏移
(function($){
	var $adpic=$('.rightAd img');
	var $imgBoxli=$('.itemList li,.tabContent li')
	$adpic.hover(function(){
		$(this).css({ //添加相对定位，方便偏移
			position: 'relative',
			zIndex: '1'
		});
		$(this).animate({ //鼠标滑过左移
			left: -10
		},200);
	},function(){
		$(this).animate({ //鼠标滑出还原
			left: 0
		},200);
	});
	$imgBoxli.hover(function(){
		$(this).find('img').css({
			position: 'relative',
			zIndex: '1'
		});
		$(this).find('img').animate({
			left: -10
		},200);
	},function(){
		$(this).find('img').animate({
			left: 0
		},200);
	})
})(jQuery);

;//登录功能
(function($){
	if($.cookie('username')){
		$('.not-logged-in').hide();
		$('.logged_in').show().find('.loginName').html($.cookie('username'));
	}
	$('.logout').on('click',function(){
		$.cookie('username',null,{expires: -1});
		$('.logged_in').hide();
		$('.not-logged-in').show();
	});
})(jQuery);