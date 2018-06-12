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
		this.$SwitchLiWidth=$('.picSwitch .scrollBox li').eq(0).width(); //底部图片列表li宽度
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
		this.$SwitchLi.on('mouseover',function(){
			that.changeurl($(this));
		});
		this.$SwitchUl.width(this.$SwitchLiWidth*this.$SwitchLi.length);
		this.$SwitchBack.on('click',function(){
			that.shiftBack();
		});
		this.$SwitchGo.on('click',function(){
			that.shiftGo();
		});
	}
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
	Scale.prototype.mouseout=function(){
		this.$scale.hide();
		this.$bigPicBox.hide();
	}
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
	Scale.prototype.changeurl=function($ele){
		var $picurl=$ele.find('img').attr('src');
		this.$smallpic.attr('src',$picurl);
		this.$bigpic.attr('src',$picurl);
		$ele.addClass('selected').siblings('li').removeClass('selected');
	}
	Scale.prototype.shiftBack=function(){
		this.$SwitchGo.css('opacity','1');
		if(this.num>5){
			this.num--;
			this.$SwitchUl.animate({
				left:-(this.num-5)*this.$SwitchLiWidth
			},200);
		}
		if(this.num<=5){
			this.$SwitchBack.css('opacity','0');
		}
	}
	Scale.prototype.shiftGo=function(){
		this.$SwitchBack.css('opacity','1');
		if(this.num<this.$SwitchLi.length){
			this.num++;
			this.$SwitchUl.animate({
				left:-(this.num-5)*this.$SwitchLiWidth
			},200);
		}
		if(this.num>=this.$SwitchLi.length){
			this.$SwitchGo.css('opacity','0');
		}
	}
	new Scale().init();

})(jQuery);