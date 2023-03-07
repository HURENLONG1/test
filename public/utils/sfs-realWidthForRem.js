/***
 * have a good time!(≖ᴗ≖)✧
 * author: kevin浩
 * Date: 2021/04/25 17:55:11
***/

/**
 * @param sreen  屏幕x轴 默认1920px
 * @param renTo__px 默认 1rem = 100px 可以传入数值
*/
(function realWidthForRem(screenX,remTo__Px){
    var _defaultScreenX = screenX||1920;
    var _defaultRemTo__Px = remTo__Px||100; 
    var _addHandler =  function (element, type, handler) {
        if(element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if(element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    }
    
     //校正浏览器缩放比例
	var _correct = function () {
		//页面devicePixelRatio（设备像素比例）变化后，计算页面body标签zoom修改其大小，来抵消devicePixelRatio带来的变化。
		document.documentElement.style.zoom = 1 / window.devicePixelRatio;
	}
    var _setRootFontSize = function(){
        _correct();
        var _docWidth = document.documentElement.clientWidth;
        var _docDeviceWidth = _docWidth*window.devicePixelRatio;
        console.log(window.devicePixelRatio)
        var _deviceFontSize = (_docDeviceWidth/_defaultScreenX*_defaultRemTo__Px).toFixed(2);
        document.documentElement.style.fontSize = _deviceFontSize+'px';
    }
    
    _setRootFontSize();
    _addHandler(window,'resize',function(){
        _setRootFontSize()
    })
})()