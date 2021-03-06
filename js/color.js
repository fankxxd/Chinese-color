var list = document.querySelector('.list');
var toTop = document.querySelector('.toTop');
var content = document.querySelector('.box');
var nav = document.querySelector('.nav-top');
var timer;
var flag = true;
onload = function() {
	var xhr;
	if(window.XMLHttpRequest) {
		xhr = new XMLHttpRequest;
	} else if(window.ActiveXObject) {
		xhr = new window.ActiveXObject();
	} else {
		alert('sorry...');
	}
	if(xhr != null) {
		xhr.open('get', 'color.json', true);
		xhr.send(null);
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4 && xhr.status == 200) {
				var obj = JSON.parse(xhr.responseText);
				obj.sort(function(a, b) {
					return parseInt(a.color, 16) - parseInt(b.color, 16)
				});
				obj.reverse();
				for(var i = 0; i < obj.length; i++) {
					var li = document.createElement('li');
					var color = '#' + obj[i].color;
					li.innerHTML = obj[i].name + '<br/><span class="colorText">' + color + '</span><div class="dot"></div>';
					li.className += 'items';
					li.style.background = color;
					list.appendChild(li);
				}
				var dots = document.getElementsByClassName('dot');
				//事件委托
				list.onmouseover = function(ev) {
					var ev = ev || window.event;
					var target = ev.target || ev.srcElement;
					if(target.nodeName == 'LI') {
						console.log(target);
						var bgcolor = target.style.background;
						content.style.background = bgcolor;
						toTop.style.background = bgcolor;
						for(var i = 0; i < dots.length; i++) {
							dots[i].style.background = bgcolor;
						}
					}
				}
//性能弱			
// 				var items = document.getElementsByTagName('li');
// 				var dots = document.getElementsByClassName('dot');
// 				for(var i = 0; i < items.length; i++) {
// 					items[i].onmouseover = function() {
// 						var bgcolor = this.style.background;
// 						content.style.background = bgcolor;
// 						toTop.style.background = bgcolor;
// 						for(var i = 0; i < dots.length; i++) {
// 							dots[i].style.background = bgcolor;
// 						}
// 					}
// 				}
			}
		}
	}
};
//波纹 插件形式封装
function Ripple(el) {
	this.element = el;
	el.addEventListener('click', this.run.bind(this), false);
}
Ripple.prototype = {
	run: function(ev) {
		var ripplerContainer = this.element.querySelector('.ripple-container');
		var offsetInfo = this.element.getBoundingClientRect();
		if(ripplerContainer) {
			ripplerContainer.remove();
		}
		//波纹容器
		var rippleCont = document.createElement('div');
		var rContStyle = rippleCont.style;
		rContStyle.position = 'fixed';
		rContStyle.zIndex = 50;
		rContStyle.width = offsetInfo.width + 'px';
		rContStyle.height = offsetInfo.height + 'px';
		rContStyle.left = offsetInfo.left + 'px';
		rContStyle.top = offsetInfo.top + 'px';
		rippleCont.className = 'ripple-container';
		rContStyle.overflow = 'hidden';
		this.element.appendChild(rippleCont);

		//最大波纹半径
		var rippleR = 1.1 * Math.max(offsetInfo.width, offsetInfo.height);
		//波纹
		var ripple = document.createElement('div');
		var rStyle = ripple.style;
		rStyle.position = 'absolute';
		ripple.style.width = 2 * rippleR + 'px';
		ripple.style.height = 2 * rippleR + 'px';
		ripple.style.borderRadius = '50%';
		ripple.style.left = (ev.pageX - offsetInfo.left - rippleR) + 'px';
//		document.body.scrollTop 控制定位
		ripple.style.top = (ev.pageY - document.body.scrollTop - offsetInfo.top - rippleR) + 'px';
		if(flag) {
			ripple.className = 'rippleB';
		} else {
			ripple.className = 'rippleA';
		}
		rippleCont.appendChild(ripple);
		ripple.addEventListener('animationend', function() {
			rippleCont.remove();
		}.bind(this), false);
	}
}

Array.prototype.forEach.call(document.querySelectorAll('[data-ripple]'), function(element) {
	// 找到所有绑定元素
	new Ripple(element); //添加效果
});
//变色
function myEvent(obj, ev, fn) {
	if(obj.attachEvent) {
		obj.attachEvent('on' + ev, fn);
	} else {
		obj.addEventListener(ev, fn, false);
	}
}
myEvent(nav, 'click', function() {
	var tip = document.querySelector('.tip')
	if(flag) {
		nav.style.background = '#212121';
		document.body.style.background = '#424242';
		nav.style.color = '#FFFFFF';
		tip.style.opacity = 0;
		flag = !flag;
	} else {
		nav.style.background = '';
		document.body.style.background = '';
		nav.style.color = '';
		flag = !flag;
	}
});

//返回btn的显示/隐藏
onscroll = function() {
	var y = document.documentElement.scrollTop || document.body.scrollTop;;
	if(y >= 30) {
		nav.style.boxShadow = "0px 0px 4px 1px rgba(0, 0, 0, 0.5)";
		toTop.style.bottom = "22px";
	} else {
		nav.style.boxShadow = "";
		toTop.style.bottom = "";

	}
}
//返回顶部
toTop.onclick = function() {
	toTop.style.animation = 'shake .4s 1';
	clearInterval(timer);
	timer = setInterval(function() {
		var now = document.documentElement.scrollTop || document.body.scrollTop;
		var speed = (0 - now) / 10;
		if(now == 0) {
			clearInterval(timer);
			toTop.style.animation = '';

		}
		document.documentElement.scrollTop = now + speed;
		document.body.scrollTop = now + speed;
	}, 10)
}

//跳转回Git
function toGithub() {
	window.location = 'https://github.com/fankxxd';
}

//canvas动画
var cav = document.querySelector('.cav');
var ctx = cav.getContext('2d');
cav.height = cav.parentNode.offsetHeight;
cav.width = cav.parentNode.offsetWidth;
onresize =function(){
	cav.width = cav.parentNode.offsetWidth;
}
window.requestAnimationFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame() || function(callback) {
		window.setTimeout(callback, 1000 / 24);
	}
})();
var n = 0;
		var lines = ['rgba(242,85,0,.3)', 'rgba(65,105,225,.3)', 'rgba(0,255,127,.3)']
		function loop() {
			//清空canvas
			ctx.clearRect(0, 0, cav.width, cav.height);
			//			ctx.fillStyle = 'rgba(0,22,255,0.1)';
			for(var i=0;i<lines.length;i++){
				ctx.strokeStyle = lines[i];
				var angle = (++n + 90 * i) * Math.PI / 180
			
			ctx.lineWidth = 2;
			//角度
//			var angle = (++n) * Math.PI / 180
			//			console.log(angle);
			var lHeight = Math.sin(angle) * 5;
			var rHeight = Math.cos(angle) * 5;

			var y = cav.height;
			var x = cav.width;
			//开始绘制
			ctx.beginPath();
			ctx.moveTo(0, y); //左上
			//ctx.lineTo(x, y/2+rHeight);//右上
			//曲线
			ctx.bezierCurveTo(x *(i+1)/ 8,lHeight -60 , x*(1-(1+i)/8), y*.7 + rHeight +90 , x, 0);
			//			ctx.lineTo(x, y);//右下
			//			ctx.lineTo(0, y);//左下
			//ctx.lineTo(0, y/2+lHeight);
			//			ctx.closePath();
			//填充颜色
			//			ctx.fill();
			ctx.stroke();
			}
			//让cav动起来
			requestAnimationFrame(loop);
		};
		loop();
