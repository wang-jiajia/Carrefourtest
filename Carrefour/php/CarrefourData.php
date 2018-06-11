<?php
    require 'conn.php';

    //banner数据
    $result1=mysql_query('select * from bannerlist');
    $bnarr=array();
    for($i=0;$i<mysql_num_rows($result1);$i++){
        $bnarr[$i]=mysql_fetch_array($result1,MYSQLI_ASSOC);
    }

    //小banner数据
    $random=rand(0,26);
    $result2=mysql_query('select * from commoditydata where sid>'.$random);
    $sbnarr=array();
    for($i=0;$i<4;$i++){
        $sbnarr[$i]=mysql_fetch_array($result2,MYSQLI_ASSOC);
    }

    //首页商品数据
    $result3=mysql_query('select * from commoditydata');
    $picarr=array();
    for($i=0;$i<mysql_num_rows($result3);$i++){
        array_push($picarr,mysql_fetch_array($result3,MYSQLI_ASSOC));
    }
    $totalarr=array();
    for($j=0;$j<15;$j++){
    	for($k=0;$k<count($picarr);$k++){
    		array_push($totalarr,$picarr[$k]);
    	}
    }

    class allData{
    	public function fn(){
    		global $bnarr,$sbnarr,$totalarr;
    		$this->bannerData=$bnarr;
    		$this->sbannerData=$sbnarr;
    		$this->commodityData=$totalarr;
    		echo json_encode($this);
    	}
    }
    $carrefourData=new allData;
    $carrefourData->fn();
?>