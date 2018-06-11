<?php 
	header('content-type:text/html;charset=utf-8');

	define('HOST','localhost');
	define('USERNAME','root');
	define('PASSWORD','');

	$conn=@mysql_connect(HOST,USERNAME,PASSWORD);
	if(!$conn){
		die('数据库连接失败！');
	}
	
	mysql_select_db('carrefour');
	mysql_query('SET NAMES UTF8');

 ?>