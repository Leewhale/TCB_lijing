$(function() {

	// 切换城市
	// 热门城市
	$(".remencity p").load("tems/changeCityInfo.html", function() {
		$.ajax({
			url: "data/getCityCode.json",
			success: function(data) {
				var htmlStr = baidu.template("hotcity", data);
				$(".remencity p").html(htmlStr);
				// 点击事件切换城市
				$(".remencity").on("click", ".haveCityCode", function() {
					changeCityRefresh($(this));
				});
			}
		});
	});


	// 拼音筛选
	$(".pinyin .filter_bar").load("tems/changeCityInfo.html", function() {
		$.ajax({
			url: "data/getCityCode.json",
			success: function(data) {
				var htmlStr = baidu.template("filter_pinyin", data);
				$(".pinyin .filter_bar").html(htmlStr);

				// 默认第一个加样式
				$(".filter_bar a").first().addClass("choosecity");

				// 点击切换拼音字母
				$(".filter_bar").on("click", "a", function() {
					// 点击按钮获得焦点样式
					$(this).addClass("choosecity").siblings().removeClass("choosecity");
					// 显示对应数据
					$(".fliter_result").children().hide();
					$(".fliter_result").children().eq($(this).index()).show();
				});
			}
		});
	});


	// 筛选结果
	$(".pinyin .fliter_result").load("tems/changeCityInfo.html", function() {
		$.ajax({
			url: "data/getCityCode.json",
			success: function(data) {
				var htmlStr = baidu.template("filter_result", data);
				$(".pinyin .fliter_result").html(htmlStr);
				// 页面加载显示拼音A对应的城市列表
				$(".city_warp").first().show();
				// 点击事件切换城市更新商铺列表
				$(".fliter_result").on("click", ".haveCityCode", function() {
					changeCityRefresh($(this));
				});
			}
		});
	});

	// 切换城市刷新商铺列表封装成函数 需要传入$(this)作为参数
	function changeCityRefresh(newthis) {
		var nowtop = $("#citylist").offset().top;
		if (nowtop == 1487) {
			// 按钮改变城市文本，添加citycode
			$("#change_cityCode").html(newthis.html()).attr("citycode", newthis.attr("citycode"));
			// 商铺列表更新
			changeShopList();
			// 区县按钮还原
			$("#change_area").html("选择区县").attr("areacode", "");
			// 换页按钮还原


		} else if (nowtop == 26) {
			$(".topbar_city").html(newthis.html());
			$(".topbar_city").attr("citycode", newthis.attr("citycode"));
		}
		$("#citylist").hide(200);
	}

	// banner部分数据
	//修手机
	$(".banner_info_one").load("tems/bannerInfo.html", function() {
		// 请求数据
		$.ajax({
			url: "data/doGetSjDefault.json",
			success: function(data) {
				// 使用百度模板
				var htmlStr = baidu.template("xsj", data);
				$(".banner_info_one").html(htmlStr);
			}
		});
	});


	//修电脑
	$(".banner_info_two").load("tems/bannerInfo.html", function() {
		// 请求数据
		$.ajax({
			url: "data/doGetPcFaultList.json",
			success: function(data) {
				// 使用百度模板
				var htmlStr = baidu.template("xdn", data);
				$(".banner_info_two").html(htmlStr);
			}
		});
	});


	// 卖手机
	$(".banner_info_three").load("tems/bannerInfo.html", function() {
		// 请求数据
		$.ajax({
			url: "data/dogetpinpailist.json",
			success: function(data) {
				// 使用百度模板
				var htmlStr = baidu.template("msj", data);
				$(".banner_info_three").html(htmlStr);
			}
		});
	});

	// 买二手机
	$(".banner_info_four").load("tems/bannerInfo.html", function() {
		// 请求数据
		$.ajax({
			url: "data/maiershouji.json",
			success: function(data) {
				// 使用百度模板
				var htmlStr = baidu.template("mesj", data);
				$(".banner_info_four").html(htmlStr);
			}
		});
	});

	// main  热门手机回收
	$("#rmsjhs").load("tems/mainInfo.html", function() {
		// 请求数据
		$.ajax({
			url: "/doGetHotHsList",
			dataType: "json",
			data: {
				num: 5
			},
			success: function(data) {
				// 使用百度模板
				var htmlStr = baidu.template("shoujihuishou", data);
				$("#rmsjhs").html(htmlStr);
			}
		});
	});


	// main2 二手良品精选
	$("#eslpjx").load("tems/mainInfo.html", function() {
		$.ajax({
			url: "/dogethotlist",
			dataType: "json",
			data: {
				num: 5
			},
			success: function(data) {
				// 使用百度模板
				var htmlStr = baidu.template("ershouliangpin", data);
				$("#eslpjx").html(htmlStr);
			}
		});
	});


	
	// 页面加载添加商铺信息
	changeShopList();

});