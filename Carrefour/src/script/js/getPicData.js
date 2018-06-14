;
(function($){
	var $bannerUl=$('.bannerBox .bannerList'); //轮播图结构不固定，li的数量根据取到数据的数量动态创建
    var $bannerDotUl=$('.bannerBox .orderDot');
	var $sbannerUl=$('.smallBanner .bannerList');
    var $sbannerDotUl=$('.smallBanner .orderDot');
	var $proListli=$('.proList .itemList li'); //推广和楼层结构固定的，html已添加了li元素，此处直接在li里拼接商品信息
	var $floorli=$('.floor .tabContent li');
    var $detailsUl=$('.detail-left .picSwitch ul');
    var $detailsSpic=$('.detail-left .smallPic');
    var $detailsBpic=$('.detail-left .bigPic');
    var $detailTitle=$('.detail-right h2');
    var $detailPrice=$('.detail-right .comPrice');

    $.ajax({
        url:'../../php/CarrefourData.php',
        dataType: "json"
    }).done(function(data){
        //banner拼接
    	var bannerData=data.bannerData;
        $.each(bannerData,function(index,value){
            $bannerUl.append('<li><a href="javascript:;"><img src="'+value.url+'"></a></li>');
            $bannerDotUl.append('<li>'+(index+1)+'</li>');
        });
        //小banner拼接
    	var sbannerData=data.sbannerData;
        $.each(sbannerData,function(index,value){
    		$sbannerUl.append('<li><a href="details.html?sid='+value.sid+'"><img src="'+value.url.split(',')[0]+'"><p>'+value.title+'</p><span>'+value.price+'</span></a></li>');
            $sbannerDotUl.append('<li>'+(index+1)+'</li>');
    	});
        //首页推广部分数据拼接
    	$proListli.each(function(index){
    		var commodityData=data.commodityData;
    		$(this).html('<a href="details.html?sid='+commodityData[index].sid+'"><img src="'+commodityData[index].url.split(',')[0]+'"><p>'+commodityData[index].title+'</p><span>'+commodityData[index].price+'</span></a>');
    	});
        //首页楼层商品信息拼接
    	$floorli.each(function(index){
    		var commodityData=data.commodityData;
    		$(this).html('<a href="details.html?sid='+commodityData[index].sid+'"><img src="'+commodityData[index].url.split(',')[0]+'"><p>'+commodityData[index].title+'</p><span>'+commodityData[index].price+'</span></a>');
    	});
    });

    //详情页商品信息拼接
    var sid=location.search.split('=')[1];
    $.ajax({
        url:'../../php/detailsData.php',
        dataType: 'json',
        data:{sid: sid}
    }).done(function(data){
        var urlarr=data.url.split(',');
        $detailsUl.attr('childNum',urlarr.length);
        $.each(urlarr,function(index,value){
            if(index == 0){
                $detailsUl.append('<li class="selected"><img src="'+value+'"></li>');
            }else{
                $detailsUl.append('<li><img src="'+value+'"></li>');
            }
        });
        $detailsSpic.attr('src',urlarr[0]);
        $detailsBpic.attr('src',urlarr[0]);
        $detailTitle.attr('sid',sid).html(data.title);
        pricearr=data.price.split('.');
        $detailPrice.find('i').html(pricearr[0].slice(0,1));
        $detailPrice.find('b').html(pricearr[0].slice(1)+'.');
        $detailPrice.find('em').html(pricearr[1]);
    });
})(jQuery);
