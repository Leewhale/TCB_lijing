// 地图的隐藏显示
$(".map").on("click", function() {
	$("#mapbox").show();
});
$("#close").on("click", function() {
	$("#mapbox").hide();
});

// 返回顶部
$(".returntop").on("click", function() {
	$("body").animate({
		"scrollTop": 0
	}, 600);
});

$(window).scroll(function() {
	($("body").scrollTop() < 400) ? $(".returntop").hide(): $(".returntop").show();
});

// 顶部城市列表点击显示点×隐藏
$("#topbar_change").on("click", function() {
	$("#citylist").css({
		"top": "26px",
		"left": "40px"
	});
	$("#citylist").show(200);
});
$("#citylist>h3>span").on("click", function() {
	$("#citylist").hide(200);
});


// 城市列表2
// 页面加载为城市选项添加citycode
$(".topbar_city").attr("citycode", "bei_jing")
$("#change_cityCode").attr("citycode", "bei_jing")
$("#change_area").attr("areacode", "")
	// 点击城市按钮改变菜单位置
$("#search_city").on("click", function() {
	$("#citylist").css({
		"top": "1487px",
		"left": "0px"
	});
	$("#citylist").show(200);
	$(".areaBox").hide(200);
});
// 点击区县按钮关闭城市菜单显示区县菜单
$("#search_area").on("click", function() {
	$("#citylist").hide(200);
	$(".areaBox").show(200);
});
// 关闭按钮
$(".areaBox>h3>span").on("click", function() {
	$(".areaBox").hide(200);
});


// 区县按钮点击获取数据jsonp
$("#search_area").on("click", function() {
	var citycode = $("#change_cityCode").attr("citycode") || "bei_jing";
	$.ajax("http://bang.360.cn/aj/get_area/", {
		dataType: "jsonp",
		data: {
			citycode: citycode
		},
		success: function(data) {
			showList(data);
		}
	});

});

// 回调函数
function showList(data) {
	var str = "<a href='javascript:void(0)' areacode=''>全部区县</a>";
	for (var i in data.result) {
		str += "<a href='javascript:void(0)' areacode=" + i + ">" + data.result[i] + "</a>"
	}
	$(".areaContent").html(str);
	// 选择区县给区县按钮加areacode，关闭窗口，加载信息，
	$(".areaContent a").on("click", function() {
		var res = $(this).html();
		res = (res != "全部区县") ? res : "选择区县";
		$("#change_area").html(res).attr("areacode", $(this).attr("areacode"));
		$(".areaBox").hide(200);
		// 加载数据
		changeShopList();
	})
}


// 城市区县点击事件列表信息获取更新封装函数
function changeShopList(pagenum) {
	var citycode = $("#change_cityCode").attr("citycode");
	var areacode = $("#change_area").attr("areacode");
	$(".rankinfo>ul").load("tems/shopInfo.html", function() {
		$.ajax({
			url: "/shop",
			dataType: "json",
			data: {
				// 城市
				city_id: citycode || "bei_jing",
				// 区县
				area_id: areacode || "",
				// 数量=5
				pagesize: 5,
				// 页码
				pn: pagenum || 0
			},
			success: function(data) {
				// 使用百度模板
				var htmlStr = baidu.template("shopInfo", data);
				$(".rankinfo>ul").html(htmlStr);
				// 
				pageUtil("pages", Math.ceil(data.page_count / 5), 1,changeShopList2);
			}
		});
	});
}

// 换页按钮的点击事件
function changeShopList2(pagenum) {
	var citycode = $("#change_cityCode").attr("citycode");
	var areacode = $("#change_area").attr("areacode");
	$(".rankinfo>ul").load("tems/shopInfo.html", function() {
		$.ajax({
			url: "/shop",
			dataType: "json",
			data: {
				// 城市
				city_id: citycode || "bei_jing",
				// 区县
				area_id: areacode || "",
				// 数量=5
				pagesize: 5,
				// 页码
				pn: pagenum || 0
			},
			success: function(data) {
				// 使用百度模板
				var htmlStr = baidu.template("shopInfo", data);
				$(".rankinfo>ul").html(htmlStr);
			}
		});
	});
}

// bannerInfo
$(".banner_nav").on("mouseover", "li", function() {
	$(".banner_info").show().children().eq($(this).index()).show().siblings().hide();
	// li鼠标滑过对应三角显示
	$(".sanjiao").hide();
	$(this).find(".sanjiao").show();
});
$(".banner_nav").on("mouseout", "li", function(e) {
	$(".banner_info").hide();
	// 移出li判断 并显示/隐藏对应三角  移入有效元素
	var thistarget = $(e.relatedTarget);
	if (thistarget.attr("class") != "banner_info" &&
		thistarget.attr("class") != "sanjiao" &&
		thistarget.parent(".banner_info").attr("class") != "banner_info" &&
		thistarget.parents(".banner_nav").attr("class") != "banner_nav") {
		$(".sanjiao").hide();
	}
});

// 信息框显示隐藏
$(".banner_info").on("mouseover", function() {
	$(this).show();
});
$(".banner_info").on("mouseout", function(e) {
	$(this).hide();
});
// 小三角消失
$(".banner_info").on("mouseleave", function() {
	$(".sanjiao").hide();
});



// 轮播图
(function() {
	var dots = $(".circle li");
	var picBox = $("#lunbopic");
	var imgWidth = 1200,
		count = 0,
		timer = null,

		timer = setInterval(lun, 3000);

	// 计时器执行的函数
	function lun() {
		count++;
		changePic(count);
	}
	// 更改图片函数
	function changePic(num) {
		// 切换圆点
		dots.removeClass("dotActive").eq(num).addClass("dotActive");
		// 动画--div向左移动
		if (num == 4) {
			count %= 4;
			dots.first().addClass("dotActive");
			picBox.animate({
				"left": "0px"
			}, 1000);
		} else {
			dots.eq(num).addClass("dotActive");
			picBox.animate({
				"left": (-num * imgWidth) + "px"
			}, 1000);
		}
	}

	// 鼠标移入停止定时器
	picBox.hover(function() {
		clearInterval(timer);
	}, function() {
		timer = setInterval(lun, 3000);
	})

	// 小圆点点击切换图片
	dots.on("click", function() {
		count = $(this).index();
		changePic(count);
	});

})();


// 登录框显示隐藏
$(".denglubtn").on("click", function() {
	$(".maskbox").show();
	$(".loginbox").show();
});
$(".loginbox>.tittle>span").on("click", function() {
	$(".maskbox").hide();
	$(".loginbox").hide();
})



//分页函数
function pageUtil(pageId, pageCount, curPage,callback) {
	$("#" + pageId).attr("curPage", curPage);
	$("#" + pageId).attr("pageCount", pageCount);

	// 处理分页栏按钮点击事件
	$("#" + pageId).off("click", "a");
	$("#" + pageId).on("click", "a", function(e) {
		var btnValue = $(this).text();
		switch (btnValue) {
			case "首页":
				pageUtil(pageId, pageCount, 1,callback);
				break;
			case "尾页":
				pageUtil(pageId, pageCount, $("#" + pageId).attr("pageCount"),callback);
				break;
			case "«上一页":
				if ($("#" + pageId).attr("curPage") == 1) {
					pageUtil(pageId, pageCount, 1,callback);
				} else {
					pageUtil(pageId, pageCount, $("#" + pageId).attr("curPage") - 1,callback);
				}
				break;
			case "下一页»":
				if ($("#" + pageId).attr("curPage") == $("#" + pageId).attr("pageCount")) {
					pageUtil(pageId, pageCount, $("#" + pageId).attr("pageCount"),callback);
				} else {
					pageUtil(pageId, pageCount, $("#" + pageId).attr("curPage") - 0 + 1,callback);
				}
				break;
			default:
				pageUtil(pageId, pageCount, parseInt($(this).text()),callback);
				break;
		}
		callback && callback($("#" + pageId).attr("curPage") - 1);
		// 回滚
		$("body").animate({
			"scrollTop": 1366
		}, 400);
	});

	var frame = '<a href="javascript:void(0)" class="firstpage">首页</a>' + '<a href="javascript:void(0)" class="prepage">«上一页</a>' + '<a href="javascript:void(0)" class="nextpage">下一页»</a>' + '<a href="javascript:void(0)" class="lastpage">尾页</a>';
	// 将分页栏外层结构插入页面
	$("#" + pageId).html(frame);
	// 页码起始值
	var startIndex = curPage > 5 ? curPage - 4 : 1;
	//页码 
	var numList = "";
	// 循环生成页码
	for (var n = 0; startIndex <= pageCount && n < 10; n++) {
		if (startIndex == curPage) {
			numList += '<a href = "javascript:void(0)" class="nump index_focus">' + startIndex + '</a>';
		} else {
			numList += '<a href = "javascript:void(0)" class="nump">' + startIndex + '</a>';
		}
		startIndex++;
	}
	// 将页码插入页面
	$("#" + pageId + " a:eq(1)").after(numList);
	
}