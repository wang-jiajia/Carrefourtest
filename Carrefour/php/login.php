<?php 
	require 'conn.php';
	//不允许直接访问php页面
	if(isset($_POST['username'])){
		$username=$_POST['username'];
		$password=sha1($_POST['password']);
		$result=mysql_query("select * from userinfo where username='$username' and password='$password'");
		if(mysql_fetch_array($result)){
			echo true;
		}else{
			echo false;
		}
	}else{
		exit('非法操作！');
	}
 ?>