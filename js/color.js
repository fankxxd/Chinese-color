var list = document.querySelector('.list');
var toTop = document.querySelector('.toTop');
var content = document.querySelector('.content');
var nav = document.querySelector('.nav-top');
var timer;
var flag = true;
onload = function() {
	var xhr;
	if(window.XMLHttpRequest) {
		xhr = new XMLHttpRequest
	} else if(window.ActiveXObject) {
		xhr = new window.ActiveXObject()
	} else {
		alert('sorry...')
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
				for(let i = 0; i < obj.length; i++) {
					var li = document.createElement('li');
					var color = '#' + obj[i].color;
					li.innerHTML = obj[i].name + '<br/>' + color + '<div class="dot"></div>';
					li.className += 'items';
					li.style.background = color;
					list.appendChild(li);
				}
				var items = document.getElementsByTagName('li');
				var dots = document.getElementsByClassName('dot');
				for(let i = 0; i < items.length; i++) {
					items[i].onmouseover = function() {
						var bgcolor = this.style.background;
						content.style.background = bgcolor;
						toTop.style.background = bgcolor;
						for(let i = 0; i < dots.length; i++){
							dots[i].style.background = bgcolor;
						}
					}
				}
			}
		}
	}
};
//波纹 插件封装
function Ripple(el){
		console.log(this)
	this.element = el;
	el.addEventListener('click', this.run.bind(this), false);
}

Ripple.prototype = {
	run:function(ev){
		var ripplerContainer = this.element.querySelector('.ripple-container');
		var offsetInfo = this.element.getBoundingClientRect();
		if(ripplerContainer){
			ripplerContainer.remove();
		}
		var rippleCont = document.createElement('div');
		var rContStyle = rippleCont.style;
		rContStyle.position = 'fixed';
		rContStyle.zIndex = 50;
		rContStyle.width = offsetInfo.width +'px';
		rContStyle.height = offsetInfo.height + 'px';
		rContStyle.left = offsetInfo.left + 'px';
        rContStyle.top = offsetInfo.top + 'px';
        rippleCont.className = 'ripple-container';
        rContStyle.overflow = 'hidden';
        this.element.appendChild(rippleCont);
        
        //最大波纹半径
        var rippleR = 1.1*Math.max(offsetInfo.width,offsetInfo.height) ;
        
        var ripple = document.createElement('div');
        var rStyle = ripple.style;
        rStyle.position = 'absolute';
        ripple.style.width = 2*rippleR + 'px';
        ripple.style.height = 2*rippleR + 'px';
        ripple.style.borderRadius = '50%';
        ripple.style.left = (ev.pageX - offsetInfo.left - rippleR) + 'px';
        //document.body.scrollTop 控制定位
        ripple.style.top = (ev.pageY - document.body.scrollTop - offsetInfo.top - rippleR) + 'px';
        if(flag){
        	ripple.className = 'rippleB';
        }else{
        	ripple.className = 'rippleA';
        }
        rippleCont.appendChild(ripple);
        ripple.addEventListener('animationend', function(){
            rippleCont.remove();
        }.bind(this), false);
	}
}

Array.prototype.forEach.call(document.querySelectorAll('[data-ripple]'), function(element) {
				// 找到所有绑定元素
				new Ripple(element); //添加效果
			});
//变色
function myEvent(obj,ev,fn){
	if(obj.attachEvent){
		obj.attachEvent('on'+ev,fn);
	}else{
		obj.addEventListener(ev,fn,false);
	}
}
myEvent(nav,'click',function(){
	let tip = document.querySelector('.tip')
	if(flag){
		nav.style.background = '#212121';
		document.body.style.background = '#424242';
		nav.style.color = '#FFFFFF';
		tip.style.opacity = 0;
		flag = !flag;
	}else{
		nav.style.background = '';
		document.body.style.background = '';
		nav.style.color = '';
		flag = !flag;
	}
});

//返回btn的显示/隐藏
onscroll = function() {
	var y = document.body.scrollTop;
	if(y>=30){
		nav.style.boxShadow = "0px 1px 4px 1px rgba(0, 0, 0, 0.5)";
		toTop.style.bottom = "2%";
	}else{
		nav.style.boxShadow = "";
		toTop.style.bottom = "";
		
	}
}
//返回顶部
toTop.onclick = function() {
	clearInterval(timer);
	timer = setInterval(function() {
		var now = document.documentElement.scrollTop || document.body.scrollTop;
		var speed = (0 - now) / 10;
		if(now == 0) {
			clearInterval(timer);
		}
		document.documentElement.scrollTop = now + speed
		document.body.scrollTop = now + speed
	}, 10)
}