require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

// 获取图片相关数据
var imageDatas = require('../data/imageData.json');

//写法1:
/*
function genImageURL(imageDataArr) {
  for (var i = 0, j = imageDataArr.length; i < j; i ++) {
    var signleImageData = imageDataArr[i];
    signleImageData.imageURL = require('../images/' + signleImageData.fileName);
    imageDataArr[i] = signleImageData;
  }
  return imageDataArr;
}

 //转化图片路径
 imageDatas = genImageURL(imageDatas);
*/

//写法2: ->自值型函数

// 利用自值型函数, 将图片名信息转成图片URL路径信息
imageDatas = (function genImageURL(imageDataArr) {
  for (var i = 0, j = imageDataArr.length; i < j; i ++) {
    var signleImageData = imageDataArr[i];
    signleImageData.imageURL = require('../images/' + signleImageData.fileName);
    imageDataArr[i] = signleImageData;
  }
  return imageDataArr;
})(imageDatas);



class AppComponent extends React.Component {
  render() {
    return (
        <section className="stage">
          <section className="img-sec">
          </section>
          <nav className="controller-nav"></nav>
        </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
