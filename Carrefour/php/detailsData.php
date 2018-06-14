<?php 
	require 'conn.php';

	if(isset($_GET['sid'])){
		$sid=$_GET['sid'];
		$result=mysql_query("select * from commoditydata where sid=".$sid);
		$data=json_encode(mysql_fetch_array($result,MYSQLI_ASSOC));
		echo $data;
	}else{
		exit('非法操作！');
	}
 ?>