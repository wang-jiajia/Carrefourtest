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

;//以下为购物车功能
(function($){
	//1.根据cookie值，创建一个商品列表的函数
	function createcart(sid,num){
		$.ajax({
			url:'../../php/detailsData.php',
			dataType: 'json',
			data:{sid: sid}
		}).done(function(data){
			var $clone= $('.goodsInfo:hidden').clone(true);//对隐藏的模块进行克隆
			var urlarr=data.url.split(',');
			//给对应模块赋值
			$clone.find('.li01').find('img').attr({
				src: urlarr[0],
				sid: sid
			});
			$clone.find('.li01').find('.goodstitle span').html(data.title);
			$clone.find('.li01').find('a').attr('href','details.html?sid='+sid);
			$clone.find('.li02').find('span').html(data.price);
			$clone.find('.li03').find('.number-input').val(num);
			//计算总价
			var $unitprice=parseFloat(data.price.slice(1)); //单价
			$clone.find('.li04').find('span').html(($unitprice*num).toFixed(2)); //总价
			$clone.show();
			$('.goodsInfoUl').append($clone);
			checkempty(); //检测购物车是否为空
			totalcalculate(); //计算购物车总金额
		});
	}

	//2.页面加载检测购物车是否为空
	function checkempty(){
		if($.cookie('cartsid')){
			$('.cart-empty').hide();
			$('.cart-filled').show();
		}else{
			$('.cart-empty').show();
			$('.cart-filled').hide();
		}
	}
	checkempty();

	//3.页面加载检测购物车(cookie里面)是否有数据，有的话创建商品列表
	var sidarr=[];
	var numarr=[];
	function cookieToArray(){ //cookie转数组的函数
		sidarr=$.cookie('cartsid').split(',');
		numarr=$.cookie('cartnum').split(',');
	}
	if($.cookie('cartsid') && $.cookie('cartnum')){
		cookieToArray();
		$.each(sidarr,function(index,value){
			createcart(value,numarr[index]);
		});
	}

	//4.求取购物车总金额和总数量
	function totalcalculate(){
		var totalprice=0; //总价
		var totalnum=0;	//总数量
		$('.goodsInfo:visible').each(function(){ //遍历可视商品列表，叠加总价和数量
			if($(this).find('input:checkbox').is(':checked')){
				totalprice+=parseFloat($(this).find('.li04 span').html());
				totalnum+=parseFloat($(this).find('.li03 .number-input').val());
			}
		});
		//赋值
		$('.total-info .totalPrice strong').html('￥'+totalprice.toFixed(2));
		$('.total-info .goodsNumber').html(totalnum);
		$('.total-info .big-total-price strong').html('￥'+totalprice.toFixed(2));
	}

	//5.全选功能
	$('.all-select').on('change',function(){
		$('.goodsInfo:visible').find('input:checkbox').prop('checked',$(this).prop('checked'));
		$('.all-select').prop('checked',$(this).prop('checked'));
		totalcalculate();
	});
	var $inputchecked=$('.goodsInfo:visible').find('input:checkbox'); //获取委托元素(开始获取不到动态创建元素)
	$('.goodsInfo').on('change',$inputchecked,function(){
		var $inputchecked=$('.goodsInfo:visible').find('input:checkbox');//此时已经可以获取到新创建的元素，所以重新获取
		if($('.goodsInfo:visible').find('input:checked').length == $inputchecked.size()){
			$('.all-select').prop('checked',true);
		}else{
			$('.all-select').prop('checked',false);
		}
		totalcalculate();
	});

	//6.购物车页修改数量操作
	//6.1 点击+改变商品数量
	$('.number-plus').on('click',function(){
		var $input=$(this).parents('.goodsInfo').find('.number-input').val();
		$input++;
		if($input>99){
			$input=99;
		}
		$(this).parents('.goodsInfo').find('.number-input').val($input);
		$(this).parents('.goodsInfo').find('.li04 span').html(changeprice($(this)));
		totalcalculate();
		setcookie($(this));
	});
	//6.2 点击-改变商品数量
	$('.number-minus').on('click',function(){
		var $input=$(this).parents('.goodsInfo').find('.number-input').val();
		$input--;
		if($input<1){
			$input=1;
		}
		$(this).parents('.goodsInfo').find('.number-input').val($input);
		$(this).parents('.goodsInfo').find('.li04 span').html(changeprice($(this)));
		totalcalculate();
		setcookie($(this));
	});
	//6.3 直接输入改变商品数量
	$('.number-input').on('input',function(){
		var reg=/^[\d]+$/; //只允许输入数字
		var $value=$(this).val();
		if(reg.test($value)){
			if($value>99){
				$(this).val(99);
			}else if($value<1){
				$(this).val(0);
			}
		}else{ //非法输入重置为1
			$(this).val(1);
		}
		$(this).parents('.goodsInfo').find('.li04 span').html(changeprice($(this)));
		totalcalculate();
		setcookie($(this));
	});
	//7.计算数量改变后单个商品总价
	function changeprice($ele){ //$ele:触发商品数量改变的那个元素
		var $unitprice=parseFloat($ele.parents('.goodsInfo').find('.li02 span').html().slice(1));
		var $newnum=parseInt($ele.parents('.goodsInfo').find('.number-input').val());
		return ($unitprice*$newnum).toFixed(2);
	}
	//8.将商品数量改变的值存放到cookie
	function setcookie($obj){
		cookieToArray();
		var $sid=$obj.parents('.goodsInfo').find('img').attr('sid');
		numarr[$.inArray($sid,sidarr)]=$obj.parents('.goodsInfo').find('.number-input').val();
		$.cookie('cartnum',numarr.toString(),{expires: 7});
	}
	//9.删除商品
	//删除cookie的函数
	function deletegoods(sid,sidarr){//sid:当前商品sid，sidarr:cookie中sid的值
		var sidindex=-1;
		$.each(sidarr,function(index,value){
			if(sid == value){
				sidindex=index;
			}
		});
		sidarr.splice(sidindex,1);
		numarr.splice(sidindex,1);
		$.cookie('cartsid',sidarr.toString(),{expires: 7});
		$.cookie('cartnum',numarr.toString(),{expires: 7});
	}
	//删除单个商品的函数(委托)
	$('.goodsInfo').on('click','.li06 .delete',function(ev){
		cookieToArray();
		if(confirm('你确定要删除吗？')){
			$(this).parents('.goodsInfo').remove();
		}
		deletegoods($(this).parents('.goodsInfo').find('img').attr('sid'),sidarr);
		totalcalculate();
		checkempty();
	});
	//删除全部选中商品的函数
	$('.total-content .deleteall').on('click',function(){
		if(confirm('你确定要删除全部选中商品吗？')){
			$('.goodsInfo:visible').each(function(){
				if($(this).find('input:checkbox').is(':checked')){
					$(this).remove();
					deletegoods($(this).find('img').attr('sid'),sidarr);
				}
			});
		}
		totalcalculate();
		checkempty();
	});
})(jQuery);