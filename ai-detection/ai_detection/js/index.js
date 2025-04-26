$(function(){
	map();
    leidatu();
    wuran();
    huaxing();
	zhexian();
    newsScroll();
    
    // 用户头像交互
    $('.avatar').click(function(e) {
        e.stopPropagation();
        $('.dropdown-menu').fadeToggle(200);
    });
    
    // 点击其他地方关闭下拉菜单
    $(document).click(function() {
        $('.dropdown-menu').fadeOut(200);
    });
    
    // 防止点击下拉菜单时关闭
    $('.dropdown-menu').click(function(e) {
        e.stopPropagation();
    });
});

// 地图函数
function map() {
  const myChart = echarts.init(document.getElementById('map'));

  // 📍重点口腔医院坐标数据
  const hospitalData = [
    { name: '北京大学口腔医院', value: [116.417, 39.921], city: '北京', rank: '三级甲等', specialty: '综合牙科', patients: '年门诊量超300万' },
    { name: '中山大学光华口腔医院', value: [113.264, 23.129], city: '广州', rank: '三级甲等', specialty: '牙体牙髓、种植修复', patients: '年门诊量超250万' },
    { name: '四川大学华西口腔医院', value: [104.065, 30.659], city: '成都', rank: '三级甲等', specialty: '正畸、种植', patients: '年门诊量超300万' },
    { name: '武汉大学口腔医院', value: [114.316, 30.581], city: '武汉', rank: '三级甲等', specialty: '牙周病、口腔颌面外科', patients: '年门诊量超200万' },
    { name: '山东大学口腔医院', value: [117.000, 36.675], city: '济南', rank: '三级甲等', specialty: '牙体牙髓、口腔修复', patients: '年门诊量超180万' },
    { name: '南京医科大学口腔医院', value: [118.796, 32.059], city: '南京', rank: '三级甲等', specialty: '牙周病、口腔种植', patients: '年门诊量超160万' },
    { name: '浙江大学口腔医院', value: [120.155, 30.274], city: '杭州', rank: '三级甲等', specialty: '牙齿矫正、儿童口腔', patients: '年门诊量超200万' },
    { name: '重庆医科大学口腔医院', value: [106.551, 29.563], city: '重庆', rank: '三级甲等', specialty: '正畸、口腔外科', patients: '年门诊量超160万' },
    { name: '吉林大学口腔医院', value: [125.324, 43.886], city: '长春', rank: '三级甲等', specialty: '综合口腔', patients: '年门诊量超120万' }
  ];

	  // 🧩 省份医疗资源数据（以牙科为主）
  const provinceData = {
    '北京':     { total: 500, hospitals: ['北京大学口腔医院', '首都医科大学附属北京口腔医院'], level: 5 },
    '天津':     { total: 200, hospitals: ['天津市口腔医院', '天津医科大学口腔医院'], level: 3 },
    '河北':     { total: 800, hospitals: ['河北医科大学口腔医院'], level: 4 },
    '山西':     { total: 600, hospitals: ['山西医科大学口腔医院'], level: 3 },
    '内蒙古':   { total: 400, hospitals: ['内蒙古医科大学附属口腔医院'], level: 2 },
    '辽宁':     { total: 700, hospitals: ['中国医科大学附属口腔医院'], level: 3 },
    '吉林':     { total: 500, hospitals: ['吉林大学口腔医院'], level: 2 },
    '黑龙江':   { total: 600, hospitals: ['哈尔滨医科大学口腔医院'], level: 3 },
    '上海':     { total: 1000, hospitals: ['第九人民医院'], level: 5 },
    '江苏':     { total: 1200, hospitals: ['南京医科大学口腔医院'], level: 5 },
    '浙江':     { total: 1500, hospitals: ['浙江大学口腔医院'], level: 5 },
    '安徽':     { total: 900, hospitals: ['安徽医科大学口腔医院'], level: 3 },
    '福建':     { total: 800, hospitals: ['福建医科大学口腔医院'], level: 3 },
    '江西':     { total: 700, hospitals: ['南昌大学口腔医院'], level: 3 },
    '山东':     { total: 1300, hospitals: ['山东大学口腔医院'], level: 4 },
    '河南':     { total: 1800, hospitals: ['郑州大学口腔医院'], level: 5 },
    '湖北':     { total: 1000, hospitals: ['武汉大学口腔医院'], level: 4 },
    '湖南':     { total: 1100, hospitals: ['中南大学湘雅口腔医院'], level: 4 },
    '广东':     { total: 2000, hospitals: ['中山大学光华口腔医院'], level: 5 },
    '广西':     { total: 800, hospitals: ['广西医科大学口腔医院'], level: 3 },
    '海南':     { total: 300, hospitals: ['海南医学院口腔医院'], level: 2 },
    '重庆':     { total: 900, hospitals: ['重庆医科大学口腔医院'], level: 4 },
    '四川':     { total: 1500, hospitals: ['华西口腔医院'], level: 5 },
    '贵州':     { total: 600, hospitals: ['贵州医科大学口腔医院'], level: 2 },
    '云南':     { total: 700, hospitals: ['昆明医科大学口腔医院'], level: 3 },
    '西藏':     { total: 50, hospitals: ['西藏自治区人民医院口腔科'], level: 1 },
    '陕西':     { total: 900, hospitals: ['西安交通大学口腔医院'], level: 4 },
    '甘肃':     { total: 500, hospitals: ['兰州大学口腔医院'], level: 2 },
    '青海':     { total: 200, hospitals: ['青海大学口腔医院'], level: 1 },
    '宁夏':     { total: 300, hospitals: ['宁夏医科大学口腔医院'], level: 1 },
    '新疆':     { total: 600, hospitals: ['新疆医科大学口腔医院'], level: 2 },
    '台湾':     { total: 850, hospitals: ['台大医院牙科部'], level: 4 }
  };

	var option = {
		backgroundColor: 'transparent',
		title: {
			text: '全国牙科医疗资源分布',
			left: 'center',
			textStyle: {
				color: '#fff'
			}
		},
		tooltip: {
			trigger: 'item',
			showDelay: 0,
			hideDelay: 0,
			enterable: true,
			confine: true,
			show: true,  // 确保tooltip显示
			alwaysShowContent: false,
			triggerOn: 'mousemove',
			position: function (point, params, dom, rect, size) {
				// 处理提示框位置
				let [x, y] = point;
				const viewWidth = size.viewSize[0];
				const viewHeight = size.viewSize[1];
				const contentWidth = size.contentSize[0];
				const contentHeight = size.contentSize[1];
				
				// 右边界处理
				if (x + contentWidth + 20 > viewWidth) {
					x = x - contentWidth - 20;
				} else {
					x = x + 20;
				}
				
				// 底部边界处理
				if (y + contentHeight + 20 > viewHeight) {
					y = y - contentHeight - 10;
				} else {
					y = y + 10;
				}
				
				return [x, y];
			},
			formatter: function(params) {
				if (params.seriesType === 'map') {
					const data = provinceData[params.name];
					if (data) {
						return `
							<div style="padding: 10px">
								<div style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #fff">
									${params.name}
								</div>
								<div style="color: #bad0e2; font-size: 14px; line-height: 1.5">
									<div>口腔医院总数：${data.total}家</div>
									<div>代表性医院：${data.hospitals.join('、')}</div>
									<div>医疗资源等级：${data.level}级</div>
								</div>
							</div>
						`;
					}
				} else if (params.seriesType === 'scatter') {
					const hospital = params.data;
					return `
						<div style="padding: 10px">
							<div style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #fff">
								${hospital.name}
							</div>
							<div style="color: #bad0e2; font-size: 14px; line-height: 1.5">
								<div>所在城市：${hospital.city}</div>
								<div>医院等级：${hospital.rank}</div>
								<div>特色专科：${hospital.specialty}</div>
								<div>就诊情况：${hospital.patients}</div>
							</div>
						</div>
					`;
				}
			},
			backgroundColor: 'rgba(12,26,63,0.9)',
			borderColor: 'rgba(77,208,225,0.3)',
			borderWidth: 1,
			padding: 0,
			textStyle: {
				color: '#fff',
				fontSize: 14
			},
			extraCssText: 'box-shadow: 0 4px 20px rgba(0,194,255,0.2); border-radius: 4px;'
		},
		visualMap: {
  min: 0,
  max: 2000, // ✅ 把 max 设置为你数据里的最大值，比如广东 2000
  left: 'left',
  top: 'bottom',
  text: ['医疗资源丰富', '医疗资源较少'],
  calculable: true,
  inRange: {
    color: ['#50a3ba', '#eac736', '#d94e5d'] // 渐变色：蓝 → 黄 → 红
  },
  textStyle: {
    color: '#fff'
  },
  selectedMode: 'multiple',
  showLabel: true,
  itemWidth: 20,
  itemHeight: 140,
  borderWidth: 1,
  borderColor: '#153269',
  backgroundColor: 'rgba(20, 28, 66, 0.6)',
  padding: 10,
  pieces: [
    { min: 1500, label: '极其丰富', color: '#d94e5d' },     // 红色：广东
    { min: 1000, max: 1499, label: '非常丰富', color: '#eac736' },  // 黄色：河南、江苏等
    { min: 600, max: 999, label: '较为丰富', color: '#91cc75' },     // 绿色：浙江、湖北
    { min: 300, max: 599, label: '资源一般', color: '#73c0de' },     // 浅蓝：山西、辽宁
    { max: 299, label: '资源较少', color: '#50a3ba' }              // 蓝色：青海、西藏、宁夏等
  ]
},
		series: [{
			name: '医疗资源',
			type: 'map',
			map: 'china',
			zoom: 1.2,
			center: [104.5, 36.5],
			roam: false,
			selectedMode: 'single',
		            label: {
		                    show: true,
		                        color: '#fff',
				fontSize: 10
			},
			itemStyle: {
				normal: {
					areaColor: '#0c1a3f',
					borderColor: '#1d3d5e',
					borderWidth: 1
				},
				emphasis: {
					areaColor: null,  // 保持原有颜色
					borderColor: '#fff',  // 白色边框
					borderWidth: 2,       // 加粗边框
					shadowBlur: 10,       // 轻微阴影
					shadowColor: 'rgba(255, 255, 255, 0.5)'
				}
			},
			data: Object.keys(provinceData).map(province => ({
				name: province,
				value: provinceData[province].total,
		            itemStyle: {
		                normal: {
						areaColor: provinceData[province].level === 5 ? '#d94e5d' :
								 provinceData[province].level === 4 ? '#eac736' :
								 provinceData[province].level === 3 ? '#91cc75' :
								 provinceData[province].level === 2 ? '#73c0de' : '#50a3ba'
					}
				}
			}))
		},
		{
			name: '重点医院',
			type: 'scatter',
			coordinateSystem: 'geo',
		            symbol: 'circle',
			symbolSize: 8,
		            label: {
		                show: true,
				position: 'right',
				formatter: '{b}',
				fontSize: 10,
		                color: '#fff',
				distance: 5,
				backgroundColor: 'rgba(0,0,0,0.3)',
				padding: [2, 4]
			},
			itemStyle: {
				color: '#00ffff',
				borderColor: '#fff',
		                borderWidth: 1,
				shadowBlur: 5,
				shadowColor: 'rgba(0, 255, 255, 0.3)'
			},
			emphasis: {
				scale: 1.5,
				label: {
					show: true,
					fontSize: 12,
					fontWeight: 'bold'
				},
				itemStyle: {
					color: '#00ffff',
					borderColor: '#fff',
					borderWidth: 2,
					shadowBlur: 10,
					shadowColor: 'rgba(0, 255, 255, 0.5)'
				}
			},
			zlevel: 2,
			z: 10,
			data: hospitalData,
			tooltip: {
				formatter: function(params) {
					return `
						<div style="padding: 8px">
							<h4 style="margin: 0 0 8px">${params.data.name}</h4>
							<p>所在城市：${params.data.city}</p>
							<p>医院等级：${params.data.rank}</p>
							<p>特色专科：${params.data.specialty}</p>
							<p>就诊情况：${params.data.patients}</p>
						</div>
					`;
				}
			}
		}]
	};

	// 添加点击事件
	myChart.on('click', 'series.scatter', function(params) {
		// 可以在这里添加点击医院后的交互，比如跳转到详情页
		console.log('点击了医院：', params.data.name);
	});

	myChart.setOption(option);
	
	// 添加visualMap的hover事件
	myChart.on('mousemove', 'visualMap', function(params) {
		const value = params.value;
		const provinces = Object.keys(provinceData).filter(province => {
			const total = provinceData[province].total;
			return total >= value && total <= value + 30;
		});
		
		myChart.dispatchAction({
			type: 'highlight',
			seriesIndex: 0,
			dataIndex: provinces.map(province => 
				Object.keys(provinceData).indexOf(province)
			)
		});
	});

	myChart.on('globalout', function() {
		myChart.dispatchAction({
			type: 'downplay',
			seriesIndex: 0
		});
	});

	window.addEventListener("resize", function() {
		myChart.resize();
	});
}

// 雷达图函数
function leidatu() {
	var myChart = echarts.init(document.getElementById('leida'));
    
    const diseaseData = [
        { name: '龋齿', value: 670, displayValue: '6.7亿' },
        { name: '牙周炎', value: 270, displayValue: '2.7亿', population: '老年人（60岁以上）', trend: '稳定增长' },
        { name: '牙龈炎', value: 200, displayValue: '2亿', population: '办公人群（20-45岁）', trend: '快速增长' },
        { name: '牙髓炎', value: 100, displayValue: '1亿', population: '中老年人（40岁以上）', trend: '稳定' },
        { name: '口腔溃疡', value: 280, displayValue: '2.8亿', population: '中老年人（45岁以上）', trend: '缓慢增长' },
        { name: '智齿冲突', value: 100, displayValue: '1亿', population: '全年龄段', trend: '波动增长' },
        ];
    option = {
        radar: {
            indicator: diseaseData.map(d => ({
                text: `${d.name}\n(${d.displayValue})`,
                max: 700
            })),
            center: ['50%', '52%'],
            radius: '58%',
	        startAngle: 90,
            splitNumber: 7,
            shape: 'circle',
	        name: {
                formatter: function(value) {
                    return value.replace(/\n/, '\n');
                },
	            textStyle: {
                    fontSize: 12,
                    color: '#5b81cb',
                    padding: [3, 5]
                }
            },
            axisLine: {
	            lineStyle: {
                    color: '#153269',
                    width: 1
	            }
	        },
	        splitLine: {
	            lineStyle: {
                    color: '#113865',
                    width: 1
	            }
            },
            splitArea: {
                show: true,
	            areaStyle: {
                    color: ['rgba(20,28,66,0.3)', 'rgba(20,28,66,0.2)']
	        }
            }
        },
	    series: [{
	        type: 'radar',
            data: [{
                value: diseaseData.map(d => d.value),
                name: '患病人数',
                symbolSize: 8,
                symbol: 'circle',
	        itemStyle: {
	                normal: {
                        color: '#00c2ff',
                        borderColor: '#fff',
                        borderWidth: 2,
	                lineStyle: {
                            color: '#00c2ff',
                            width: 2
	        },
	            areaStyle: {
                            color: 'rgba(0, 194, 255, 0.3)'
                        }
                    },
                    emphasis: {
                        color: '#fff',
                        borderColor: '#00c2ff',
                        borderWidth: 2,
                        scale: true
                    }
                }
            }]
        }]
    };

	myChart.setOption(option);
    window.addEventListener("resize", function() {
        myChart.resize();
    });
}

function wuran() {
	var myChart = echarts.init(document.getElementById('wuran'));
    
    // 定义简洁的年龄段数据
    const detailData = {
  '<18岁': {
    '龋齿': { value: 63, detail: '3-5岁儿童龋齿患病率为63%，12岁儿童患病率为62%，需注重早期预防。' },
    '牙周炎': { value: 42, detail: '12岁儿童牙周炎检出率约42%，以牙龈出血为主，需强化刷牙习惯。' },
    '牙龈炎': { value: 60, detail: '牙龈出血率高达57.7%-62%，需关注牙龈健康。' },
    '牙髓炎': { value: 50, detail: '儿童易因龋齿进展而患牙髓炎，应早干预。' },
    '智齿': { value: 0, detail: '智齿尚未萌出，暂无问题。' }
  },
  '18-40岁': {
    '龋齿': { value: 89, detail: '35-44岁龋齿患病率高达89%，是成人主要口腔问题。' },
    '牙周炎': { value: 41, detail: '牙周袋检出率约41%，牙周健康率低，应关注牙周护理。' },
    '牙龈炎': { value: 60, detail: '青年人普遍有不同程度的牙龈炎，需定期洁牙。' },
    '牙髓炎': { value: 60, detail: '多因龋齿未处理，青年阶段牙髓炎高发。' },
    '智齿': { value: 60, detail: '18-25岁为智齿萌出高峰期，常见冠周炎问题。' }
  },
  '40-60岁': {
    '龋齿': { value: 96, detail: '55-64岁龋齿率近96%，多为残根残冠，应及时修复。' },
    '牙周炎': { value: 52, detail: '牙周袋检出率52%，牙槽骨吸收明显。' },
    '牙龈炎': { value: 50, detail: '牙龈退缩普遍，炎症进一步加重。' },
    '牙髓炎': { value: 45, detail: '未及时治疗龋齿常发展为牙髓炎。' },
    '智齿': { value: 10, detail: '大多智齿已处理，仅少数仍存问题。' }
  },
  '60-80岁': {
    '龋齿': { value: 98, detail: '龋齿患病率近98%，影响咀嚼与健康。' },
    '牙周炎': { value: 52, detail: '牙周病是老年牙齿脱落主要原因。' },
    '牙龈炎': { value: 45, detail: '老年人牙龈问题普遍，需维护口腔清洁。' },
    '牙髓炎': { value: 30, detail: '残根感染仍可致牙髓炎，应加强牙科随访。' },
    '智齿': { value: 5, detail: '智齿多已脱落或拔除，问题较少。' }
  },
  '>80岁': {
    '龋齿': { value: 95, detail: '牙体缺失率高，残留牙易龋坏。' },
    '牙周炎': { value: 50, detail: '牙槽骨严重吸收，牙周病影响广泛。' },
    '牙龈炎': { value: 40, detail: '牙龈退缩明显，需适应老年口腔护理。' },
    '牙髓炎': { value: 15, detail: '多数为既往龋病发展，牙髓炎比例下降。' },
    '智齿': { value: 0, detail: '基本无智齿问题。' }
  }
}

    option = {
        title: {
			  text: '不同年龄段口腔疾病患病率统计',
			  textStyle: {
				color: '#fff',
				fontSize: 14
			  },
			  left: 'center'
			},
        tooltip: {
            trigger: 'item',
            axisPointer: {
                type: 'shadow'
            },
            position: function (point, params, dom, rect, size) {
                // 获取提示框的宽度和高度
                const tooltipWidth = size.contentSize[0];
                const tooltipHeight = size.contentSize[1];
                // 获取视图的宽度和高度
                const viewWidth = size.viewSize[0];
                const viewHeight = size.viewSize[1];

                // 默认位置（鼠标位置）
                let x = point[0];
                let y = point[1];

                // 检查是否会超出左边界
                if (x < tooltipWidth) {
                    // 如果会超出左边界，显示在右侧
                    x = point[0] + 20;
                }

                // 检查是否会超出右边界
                if (x + tooltipWidth > viewWidth) {
                    // 如果会超出右边界，显示在左侧
                    x = point[0] - tooltipWidth - 20;
                }

                // 检查是否会超出底部
                if (y + tooltipHeight > viewHeight) {
                    // 如果会超出底部，向上偏移
                    y = point[1] - tooltipHeight - 20;
                }

                // 确保不会超出顶部
                if (y < 0) {
                    y = 20;
                }

                return [x, y];
            },
            formatter: function(param) {
                const age = param.name;
                const disease = param.seriesName;
                const detail = detailData[age][disease];
                
                return `
                    <div style="padding: 3px;">
                        <b>${age} - ${disease}</b><br/>
                        <div style="margin: 5px 0;">
                            <div style="margin-left: 10px;">
                                患病率：${detail.value}%<br/>
                                特点：${detail.detail}
                            </div>
                        </div>
                    </div>
                `;
            },
            backgroundColor: 'rgba(12,26,63,0.8)',
            borderColor: 'rgba(0, 194, 255, 0.2)',
            borderWidth: 1,
            padding: [10, 15],
            textStyle: {
	                            color: '#fff',
	                            fontSize: 12
	                        }
	                    },
		legend: {
		  data: ['龋齿', '牙周炎', '牙龈炎', '牙髓炎', '智齿'],
		  textStyle: { color: '#fff' },
		  top: 25
		},
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '80px',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['<18岁', '18-40岁', '40-60岁', '60-80岁', '>80岁'],
            axisLabel: {
	                        color: '#fff'
	        },
	        axisLine: {
                lineStyle: {
                    color: '#153269'
                }
            }
        },
        yAxis: {
            type: 'value',
            name: '患病率 (%)',
            max: 80,
	        axisLabel: {
	                            color: '#fff',
                formatter: '{value}%'
            },
            axisLine: {
                lineStyle: {
                    color: '#153269'
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#113865'
                }
            }
        },
        series: [
  {
    name: '龋齿',
    type: 'bar',
    data: [63, 89, 96, 98, 95],
    itemStyle: { color: '#00c2ff' }
  },
  {
    name: '牙周炎',
    type: 'bar',
    data: [42, 41, 52, 52, 50],
    itemStyle: { color: '#ffcf00' }
  },
  {
    name: '牙龈炎',
    type: 'bar',
    data: [60, 60, 50, 45, 40],
    itemStyle: { color: '#ff6e76' }
  },
  {
    name: '牙髓炎',
    type: 'bar',
    data: [50, 60, 45, 30, 15],
    itemStyle: { color: '#4cd384' }
  },
  {
    name: '智齿',
    type: 'bar',
    data: [0, 60, 10, 5, 0],
    itemStyle: { color: '#9d96f5' }
  }
]
	};

	myChart.setOption(option);
    window.addEventListener("resize", function() {
        myChart.resize();
    });
}

function zhexian() {
	var myChart = echarts.init(document.getElementById('zhexian'));
	option = {
		// 折线图配置
	};
	myChart.setOption(option);
	window.addEventListener("resize", function() {
		myChart.resize();
	});
}

// 添加新闻轮播函数
function newsScroll() {
    const newsData = [
        {
            title: "AI 深度学习模型在龋齿早期诊断中的应用研究",
            journal: "Nature Medicine",
            date: "2024-03-18",
            url: "https://www.nature.com/articles/s41591-024-02737-w",
            detail: "研究发现新的AI模型可提前识别早期龋齿的发展"
        },
        {
            title: "新型生物材料在牙髓再生中的突破性进展",
            journal: "Science",
            date: "2024-03-15",
            url: "https://www.science.org/doi/10.1126/science.adg9130",
            detail: "新型生物材料在牙髓再生中展现出良好效果"
        },
        {
            title: "基于干细胞技术的牙周组织再生研究新进展",
            journal: "Cell",
            date: "2024-03-14",
            url: "https://www.cell.com/cell/fulltext/S0092-8674(24)00133-4",
            detail: "干细胞治疗有望治愈牙周组织疾病"
        },
        {
            title: "新发现：口腔微生物组与牙周病发病机制的关联",
            journal: "Science Advances",
            date: "2024-03-12",
            url: "https://www.science.org/doi/10.1126/sciadv.adm9996",
            detail: "口腔微生物组在牙周病发病中的关键作用"
        },
        {
            title: "新型生物材料在牙齿修复中的临床试验结果",
            journal: "NEJM",
            date: "2024-03-07",
            url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2400374",
            detail: "新型修复材料显著改善治疗效果"
        },
        {
            title: "人工智能辅助口腔手术精准度研究",
            journal: "Journal of Dental Research",
            date: "2024-03-05",
            url: "https://journals.sagepub.com/doi/full/10.1177/00220345241234567",
            detail: "AI辅助系统提高手术精确度达30%"
        },
        {
            title: "饮食习惯与儿童龋齿发病率相关性研究",
            journal: "JADA",
            date: "2024-03-02",
            url: "https://jada.ada.org/article/S0002-8177(24)00123-4/fulltext",
            detail: "不良饮食习惯增加儿童龋齿风险"
        },
        {
            title: "基因治疗在牙周病治疗中的应用进展",
            journal: "Nature Genetics",
            date: "2024-02-28",
            url: "https://www.nature.com/articles/s41588-024-01589-x",
            detail: "新型基因编辑技术在牙周病治疗中取得突破"
        },
        {
            title: "口腔健康与全身疾病的关联研究",
            journal: "Lancet",
            date: "2024-02-25",
            url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(24)00048-X/fulltext",
            detail: "研究发现口腔健康与多种全身疾病密切相关"
        },
        {
            title: "新型牙齿修复材料临床试验结果",
            journal: "Nature Materials",
            date: "2024-02-22",
            url: "https://www.nature.com/articles/s41563-024-01972-3",
            detail: "生物相容性修复材料为患者带来新希望"
        },
        {
            title: "口腔微生物组与免疫系统相互作用研究",
            journal: "Immunity",
            date: "2024-02-20",
            url: "https://www.cell.com/immunity/fulltext/S1074-7613(24)00052-8",
            detail: "揭示口腔微生物组在免疫防御中的作用"
        }
    ];

    let currentNewsIndex = 0;
    const newsContainer = document.querySelector('.news-container');
    
    function updateNewsDisplay() {
        let html = '';
        // 显示当前可见的4条新闻
        for(let i = 0; i < 4; i++) {
            const index = (currentNewsIndex + i) % newsData.length;
            const news = newsData[index];
            html += `
                <div class="news-item" onclick="window.open('${news.url}', '_blank')">
                    <div class="news-title">${news.title}</div>
                    <div class="news-info">
                        <span class="news-journal">${news.journal}</span>
                        <span class="news-date">${news.date}</span>
                    </div>
                </div>
            `;
        }
        newsContainer.innerHTML = html;
    }

    // 自动轮播函数
    function autoScroll() {
        currentNewsIndex = (currentNewsIndex + 1) % newsData.length;
        updateNewsDisplay();
    }

    // 初始显示
    updateNewsDisplay();
    
    // 设置定时器，每5秒滚动一次
    let scrollTimer = setInterval(autoScroll, 5000);

    // 鼠标悬停时暂停轮播
    newsContainer.addEventListener('mouseenter', () => {
        clearInterval(scrollTimer);
    });

    // 鼠标离开时恢复轮播
    newsContainer.addEventListener('mouseleave', () => {
        scrollTimer = setInterval(autoScroll, 5000);
	});
}

// 添加用户相关功能
function showMedicalRecords() {
    // 从 sessionStorage 获取病例数据
    const records = JSON.parse(sessionStorage.getItem('medicalRecords') || '[]');
    
    const modalHtml = `
        <div class="modal" id="recordsModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">我的病例记录</h2>
                    <span class="close-btn" onclick="closeModal('recordsModal')">&times;</span>
                </div>
                <div class="records-list">
                    ${records.map(record => `
                        <div class="record-item">
                            <div class="record-header">
                                <span class="record-date">${record.date}</span>
                                <span class="record-type">${record.type}</span>
                            </div>
                            <div class="record-content">
                                <p>诊断结果：${record.diagnosis}</p>
                                <p>建议：${record.recommendation}</p>
                            </div>
                            <div class="record-footer">
                                <button onclick="downloadRecord('${record.id}')">
                                    <i class="fas fa-download"></i> 下载报告
                                </button>
                                <button onclick="deleteRecord('${record.id}')">
                                    <i class="fas fa-trash"></i> 删除记录
                                </button>
                            </div>
                        </div>
                    `).join('') || '<p class="no-records">暂无病例记录</p>'}
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('recordsModal').style.display = 'block';
}

function showCheckHistory() {
    // 从 sessionStorage 获取检查记录
    const history = JSON.parse(sessionStorage.getItem('checkHistory') || '[]');
    
    const modalHtml = `
        <div class="modal" id="historyModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">检查记录</h2>
                    <span class="close-btn" onclick="closeModal('historyModal')">&times;</span>
                </div>
                <div class="history-list">
                    ${history.map(item => `
                        <div class="history-item">
                            <div class="history-info">
                                <span class="check-date">${item.date}</span>
                                <span class="check-type">${item.type}</span>
                            </div>
                            <div class="check-result">
                                <img src="${item.image}" alt="检查图片">
                                <div class="result-text">
                                    <p>检查结果：${item.result}</p>
                                    <p>AI置信度：${item.confidence}%</p>
                                </div>
                            </div>
                        </div>
                    `).join('') || '<p class="no-history">暂无检查记录</p>'}
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('historyModal').style.display = 'block';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
    modal.remove();
}

// 在登录成功后添加模拟数据
function addDemoData() {
    // 添加病例记录
    const medicalRecords = [
        {
            id: '1',
            date: '2024-03-20',
            type: '眼科检查',
            diagnosis: '轻度近视',
            recommendation: '建议适当调整用眼习惯，每天户外活动2小时'
        },
        {
            id: '2',
            date: '2024-03-15',
            type: 'AI辅助诊断',
            diagnosis: '疑似早期青光眼',
            recommendation: '建议到医院进行详细检查'
        }
    ];
    
    // 添加检查记录
    const checkHistory = [
        {
            date: '2024-03-20',
            type: '视力检查',
            image: 'path/to/image1.jpg',
            result: '左眼5.0，右眼5.1',
            confidence: 98
        },
        {
            date: '2024-03-15',
            type: '眼底检查',
            image: 'path/to/image2.jpg',
            result: '视网膜状态正常',
            confidence: 95
        }
    ];
    
    sessionStorage.setItem('medicalRecords', JSON.stringify(medicalRecords));
    sessionStorage.setItem('checkHistory', JSON.stringify(checkHistory));
}
