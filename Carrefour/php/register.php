<?php 
	require 'conn.php';

	//不允许直接打开php页面，判断是否存在提交
	if(isset($_POST['submit'])||isset($_POST['checkname'])){
		//检测用户名是否重复
		if(isset($_POST['checkname'])){
			$checkname=$_POST['checkname'];
			$result=mysql_query("select * from userinfo where username='$checkname'");
			if(mysql_fetch_array($result)){
				echo true;
			}else{
				echo false;
			}
		}
		//向数据库插入用户注册信息
		if(isset($_POST['submit'])){
			$username=($_POST['username']);
			$password=sha1($_POST['password']);
			$email=($_POST['email']);
			mysql_query("insert into userinfo value(default,'$username','$password','$email')");
			header('location:../src/html/login.html');//注册成功后跳转登录页
		}
	}else{
		exit('非法操作！');
	}
 ?>