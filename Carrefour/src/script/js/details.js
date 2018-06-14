;//放大镜
(function($){
	function Scale(){
		this.$smallpic=$('.detail-left .smallPic');
		this.$smallpicBox=$('.detail-left .smallPicBox');
		this.$bigpic=$('.detail-left .bigPic');
		this.$scale=$('.detail-left .scale'); //放大镜
		this.$bigPicBox=$('.detail-left .bigPicBox');
		this.$SwitchLi=$('.picSwitch .scrollBox li'); //底部图片列表
		this.$SwitchUl=$('.picSwitch .scrollBox ul');
		this.$SwitchBack=$('.picSwitch .leftClick'); //左切换按钮
		this.$SwitchGo=$('.picSwitch .rightClick'); //右切换按钮
		this.$SwitchLiWidth=76; //底部图片列表li宽度,事件触发之前获取不到(定时器延迟除外)。因为是网站结构，一般不会改变，所以根据css设置写死
		this.num=5; //当前列表显示的最后一张图片为第几张
	}
	Scale.prototype.init=function(){
		var that=this;
		this.$smallpicBox.hover(function(){
			that.mouseover();
		},function(){
			that.mouseout();
		});
		this.$smallpicBox.on('mousemove',function(ev){
			that.mousemove(ev);
		});
		this.$SwitchUl.on('mouseover','li',function(){
			that.changeurl($(this));
		})
		this.$SwitchUl.width(this.$SwitchLiWidth*this.$SwitchUl.attr('childNum'));
		this.$SwitchBack.on('click',function(){
			that.shiftBack();
		});
		this.$SwitchGo.on('click',function(){
			that.shiftGo();
		});
	}
	//鼠标移入，显示放大镜和大图片
	Scale.prototype.mouseover=function(){
		this.$scale.show();
		this.$bigPicBox.show();
		//放大镜的尺寸以及放大比例放在这里赋值，因为图片大小可能存在不同，每次切换之后，这些值也需要发生改变。
		this.$scale.css({
			width:this.$smallpic.width()/this.$bigpic.width()*this.$bigPicBox.width(),
			height:this.$smallpic.height()/this.$bigpic.height()*this.$bigPicBox.height()
		});
		this.scaleRatio=this.$bigpic.width()/this.$smallpic.width();
	}
	//鼠标移出则隐藏
	Scale.prototype.mouseout=function(){
		this.$scale.hide();
		this.$bigPicBox.hide();
	}
	//鼠标在小图上移动，放大镜和大图也相应地移动
	Scale.prototype.mousemove=function(ev){
		var $left=ev.pageX-this.$smallpic.offset().left-this.$scale.width()/2;
		var $top=ev.pageY-this.$smallpic.offset().top-this.$scale.height()/2;
		if($left<=0){
			$left=0;
		}else if($left>=this.$smallpic.width()-this.$scale.width()){
			$left=this.$smallpic.width()-this.$scale.width();
		}
		if($top<=0){
			$top=0;
		}else if($top>=this.$smallpic.height()-this.$scale.height()){
			$top=this.$smallpic.height()-this.$scale.height();
		}
		this.$scale.css({
			left:$left,
			top:$top
		});
		this.$bigpic.css({
			left:-$left*this.scaleRatio,
			top:-$top*this.scaleRatio
		})
	}
	//鼠标划过下方切换列表的li，上方图片的src替换成当前鼠标当前悬停的图片src
	Scale.prototype.changeurl=function($ele){
		var $picurl=$ele.find('img').attr('src');
		this.$smallpic.attr('src',$picurl);
		this.$bigpic.attr('src',$picurl);
		$ele.addClass('selected').siblings('li').removeClass('selected');
	}
	//点击左按钮，向前移动图片列表ul
	Scale.prototype.shiftBack=function(){
		this.$SwitchGo.css('opacity','1');
		if(this.num>5){
			this.num--;
			this.$SwitchUl.animate({
				left:-(this.num-5)*this.$SwitchLiWidth
			},200);
		}
		if(this.num<=5){ //num是自定的一个标志，当num等于5，图片列表已经移动到最前。
			this.$SwitchBack.css('opacity','0');
		}
	}
	//点击右按钮，向后移动图片列表ul
	Scale.prototype.shiftGo=function(){
		this.$SwitchBack.css('opacity','1');
		if(this.num<this.$SwitchUl.attr('childNum')){
			this.num++;
			this.$SwitchUl.animate({
				left:-(this.num-5)*this.$SwitchLiWidth
			},200);
		}
		if(this.num>=this.$SwitchUl.attr('childNum')){
			this.$SwitchGo.css('opacity','0');
		}
	}
	new Scale().init();
})(jQuery);

;//商品购买数量设置
(function($){
	function BuyNum(){
		this.$numInput=$('.buyBtnBox .buyNumber');
		this.$numPlus=$('.input-plus');
		this.$numMinus=$('.input-minus');
		this.numToBuy=1;
	}
	BuyNum.prototype.init=function(){
		var that=this;
		this.$numPlus.on('click',function(){
			that.numP();
		});
		this.$numMinus.on('click',function(){
			that.numM();
		});
		this.$numInput.on('blur',function(){
			var $reg = /^\d+$/g;
			if($reg.test($(this).val())){
				if($(this).val()>=99){
					$(this).val(99);
					that.$numPlus.addClass('most');
					that.$numMinus.removeClass('least');
				}else if($(this).val()<=1){
					$(this).val(1);
					that.$numMinus.addClass('least');
					that.$numPlus.removeClass('most');
				}else{
					that.$numMinus.removeClass('least');
					that.$numPlus.removeClass('most');
				}
			}else{
				$(this).val(1);
				that.$numMinus.addClass('least');
				that.$numPlus.removeClass('most');
			}
			that.numToBuy=$(this).val();
		});
	}
	BuyNum.prototype.numP=function(){
		this.$numMinus.removeClass('least');
		if(this.numToBuy<99){
			this.numToBuy++;
			this.$numInput.val(this.numToBuy);
			if(this.numToBuy>=99){
				this.$numPlus.addClass('most');
			}
		}
	}
	BuyNum.prototype.numM=function(){
		this.$numPlus.removeClass('most');
		if(this.numToBuy>1){
			this.numToBuy--;
			this.$numInput.val(this.numToBuy);
			if(this.numToBuy<=1){
				this.$numMinus.addClass('least');
			}
		}
	}
	new BuyNum().init();
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
	$('.not-logged-in .toLogin').attr('href','login.html?'+location.search.slice(1));
})(jQuery);

;//加入购物车功能
(function($){
	//1.定义数组存放商品sid和商品数量
	var sidarr=[];
	var numarr=[];
	//2.获取cookie的函数，这里提前约定了存放信息的cookie的名称
	function getcookievalue(){
		if($.cookie('cartsid')){ //存放商品sid的cookie
			sidarr=$.cookie('cartsid').split(',');
		}
		if($.cookie('cartnum')){ //存放商品数量的cookie
			numarr=$.cookie('cartnum').split(',');
		}
	}
	//3.判断商品的sid是否已在cookie里，如果在，则无需再向cookie添加，只需把对应的商品数量增加即可
	$('.buyBtn').on('click',function(){
		var sid= $(this).parents('.detail-right').find('.comTitle h2').attr('sid');//当前按钮对应商品sid，存在商品标题元素h2的自定义属性上
		getcookievalue();//获取商品的id和数量,放到对应的数组中,利用数组进行匹配
		if($.inArray(sid, sidarr) != -1){ //当前的sid是否存在cookie中(-1表示不存在)
			//存在，则将之前的数据和当前存的数据相加，存放cookie里面
			var num=parseInt(numarr[$.inArray(sid,sidarr)])+parseInt($('.buyNumber').val());
			numarr[$.inArray(sid,sidarr)]=num;
			$.cookie('cartnum',numarr.toString(),{expires: 7});//修改后的结果
		}else{ //不存在，则直接加入cookie
			sidarr.push(sid);
			$.cookie('cartsid',sidarr.toString(),{expires: 7});
			numarr.push($('.buyNumber').val());
			$.cookie('cartnum',numarr.toString(),{expires: 7});
		}
	});
})(jQuery);