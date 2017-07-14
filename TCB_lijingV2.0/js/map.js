// 创建地图对象
var map = new AMap.Map('map_show', {
	// resizeEnable: true,
	zoom: 10,
	center: [116.397428, 39.90923],
	lang: 'zh_cn'
});

// 设置地图语言 'en', 'zh_en', 'zh_cn'
// map.setLang('zh_en')

// 创建控件对象
var scale = new AMap.Scale(),
	overView = new AMap.OverView(),
	toolBar = new AMap.ToolBar();
// 添加控件到地图
map.addControl(scale);
map.addControl(overView);
map.addControl(toolBar);
// 比例尺的显示隐藏
// scale.hide();
// scale.show();

// 地图中心城市
// map.setCity("保定");

// 设置中心点
// map.setCenter([116.397428, 39.90923]);

// map.setZoomAndCenter(14, [116.205467, 39.907761]);

//为地图注册click事件获取鼠标点击出的经纬度坐标
// var clickEventListener = map.on('click', function(e) {
// 	map.setZoomAndCenter(15, [e.lnglat.getLng(), e.lnglat.getLat()])
// });

// 创建自动完成提示对象
var auto = new AMap.Autocomplete({
	input: "inp_search"
});
// 绑定选中事件
// AMap.event.addListener(auto,"select",function(e){
// 	console.log(e);
// 	map.setZoomAndCenter(15,e.poi.location);
// });


// 自定义icon
var icon = new AMap.Icon({
        image : 'imgs/shop.png' ,//24px*24px
});
// 创建信息窗体
var infoWindow = new AMap.InfoWindow({
	offset:new AMap.Pixel(10,-25),
	// 是否取出默认样式
	// isCustom: true
});
// 存储marker的数组供以后删除使用
var markerBox = [];
// 首页地图模式点击事件--发送请求添加标记
$("#mapbtn").on("click", function() {
	// 删除旧标记
	map.remove(markerBox);
	// 设置中心点
	map.setCity($("#change_cityCode").text());
	// 
	var citycode = $("#change_cityCode").attr("citycode");
	var areacode = $("#change_area").attr("areacode");
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
		},
		success: function(data) {
			console.log(data);
			var d = data.shop_data;
			for (var i = 0; i < d.length; i++) {
				var marker = new AMap.Marker({
					// 位置
					position: [parseFloat(d[i].map_longitude), parseFloat(d[i].map_latitude)],
					// 鼠标指向显示文字
					title: d[i].shop_name,
					// 创建的地图
					map: map,
					// 创建动画
					animation: "AMAP_ANIMATION_DROP",
					// 是否可点击
					clickable: true,
					// bubble: true
					// 图标
					icon: icon
				});
				// 保存点标记
				markerBox.push(marker);
				// content

				marker.content = '<div style="margin:5px; border-bottom:1px solid red; padding-bottom:5px; font-size:18px; font-weight: bold; color:#656464;">'+d[i].shop_name+'</div><p style="line-height:20px; padding:5px; color:#f44336;font-size:14px;"><strong>经营项目：</strong>'+ d[i].main +'<br><strong>地址：</strong>'+ d[i].addr +'</p>';
				// 为标记添加点击事件
				AMap.event.addListener(marker, 'click', function(e) {
					// console.log(e.target.Ii.position);
					var pos = e.target.Ii.position;
					map.setZoomAndCenter(15, [pos.getLng(), pos.getLat()]);
					// 添加内容框体
					infoWindow.setContent(e.target.content);
    				infoWindow.open(map, e.target.getPosition());
    				// infoWindow.setPosition([pos.getLng(), pos.getLat()]);
				});
			}
			// 获取最大页
			var maxpage = Math.ceil(data.page_count/5);
			// 调用pageUtil写入页码
			var nowindex = $(".index_focus").first().text()-0;
			pageUtil("map_bottom",maxpage,nowindex,addMarkers);
		}
	});
})


// 地图页码点击事件
function addMarkers(pagenum){
	// 关闭信息窗体
	infoWindow.close();
	// 刷新中心点和zoom
	map.setCity($("#change_cityCode").text());
	map.setZoom(10);
	var citycode = $("#change_cityCode").attr("citycode");
	var areacode = $("#change_area").attr("areacode");
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
			// 
			pn: pagenum
		},
		success: function(data) {
			// 移除原有标记
			map.remove(markerBox);
			markerBox = [];
			// 重写标记
			var d = data.shop_data;
			for (var i = 0; i < d.length; i++) {
				var marker = new AMap.Marker({
					position: [parseFloat(d[i].map_longitude), parseFloat(d[i].map_latitude)],
					title: d[i].shop_name,
					map: map,
					animation: "AMAP_ANIMATION_DROP",
					clickable: true,
					// bubble: true
					icon: icon
				});
				// 保存点标记
				markerBox.push(marker);

				// 

				marker.content = '<div style="margin:5px; border-bottom:1px solid red; padding-bottom:5px; font-size:18px; font-weight: bold; color:#656464;">'+d[i].shop_name+'</div><p style="line-height:20px; padding:5px; color:#f44336; font-size:14px;"><strong>经营项目：</strong>'+ d[i].main +'<br><strong>地址：</strong>'+ d[i].addr +'</p>';
				// 为标记添加点击事件
				AMap.event.addListener(marker, 'click', function(e) {
					console.log(e.target.Ii.position);
					var pos = e.target.Ii.position;
					map.setZoomAndCenter(15, [pos.getLng(), pos.getLat()]);

					// 
					// 添加内容框体
					infoWindow.setContent(e.target.content);
    				infoWindow.open(map, e.target.getPosition());
				});
			}
		}
	});
}	
