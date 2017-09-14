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

/*
 * 获取区间内的一个随机值
 */
function getRangeRandom(low, high) {
	let value = Math.ceil(Math.random() * (high - low) + low);
	return isNaN(value) ? 0 : value;
}

/*
 * 获取 0~30° 之间的一个任意正负值
 */
function get30DegRandom() {
	return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}

class ImageFigure extends React.Component {
	
	handleClick = (element) => {
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		}
		else {
			this.props.center();
		}
		element.stopPropagation();
		element.preventDefault();
	}
	
	render() {
		
		let styleObj = {};
		//如果props属性中国年指定了这张图位置的信息
		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}
		
		//如果图片的旋转角度有值并且不为0, 添加旋转角度
		if (this.props.arrange.rotate) {
			(['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function (value) {
				styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			}.bind(this));
		}
		
		if (this.props.arrange.isCenter) {
			styleObj.zIndex = 11;
		}
		
		var imgFigureClassName = "img-figure";
		imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
		
		const {data} = this.props;
		return (
			<figure className={imgFigureClassName} ref ="figure" style={styleObj} onClick={this.handleClick}>
				<img src={data.imageURL}
				     alt={data.title}
				/>
				<figcaption>
					<h2 className="img-title">{data.title}</h2>
					<div className="img-back" onClick={this.handleClick}>
						<p>
							{data.desc}
						</p>
					</div>
				</figcaption>
			</figure>
		)
	}
}

class ControllerUtils extends React.Component {
	
	handleClick = (e) => {
		// 如果点击的是当前正在选中态的按钮，则翻转图片，否则将对应的图片居中
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}
		
		e.preventDefault;
		e.stopPropagation();
	}
	
	render() {
		var controlelrUnitClassName = "controller-unit";
		
		// 如果对应的是居中的图片，显示控制按钮的居中态
		if (this.props.arrange.isCenter) {
			controlelrUnitClassName += " is-center";
			
			// 如果同时对应的是翻转图片， 显示控制按钮的翻转态
			if (this.props.arrange.isInverse) {
				controlelrUnitClassName += " is-inverse";
			}
		}
		
		return (
			<span className={controlelrUnitClassName} onClick={this.handleClick}>
			</span>
		);
	}
}

class AppComponent extends React.Component {
	
	constructor(props) {
		super(props)
		this.state = ({
			imgsArrangeArr: [
				/*{
				    pos: {
				        left: '0',
				        top: '0'
				    },
				    rotate: 0,
				    isInversee: false, //图片正反面
				    isCenter: false, //图片是否居中
				 }
				 */
			]
		});
		
		//常量key
		this.Constant = {
			centerPos: {
				left: 0,
				right: 0
			},
			
			//水平方向的取值范围
			hPosRange: {
				leftSecX: [0, 0],
				rightSecX: [0, 0],
				y: [0, 0]
			},
			
			vPosRange: {
				x: [0, 0],
				topY: [0, 0]
			}
		};
	}
	
	//组件加载后为每张图片计算其位置的范围
	componentDidMount() {
		//首先拿到舞台大小
		var stageDOM = this.refs.stage,
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2);
		
		console.log(stageW, stageH);
		
		//拿到imageFigure的大小
		var imgFigureDOM = this.refs.imgFigure0.refs.figure,
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = imgW / 2,
			halfImgH = imgH / 2;
		
		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		}
		
		// 计算左侧，右侧区域图片排布位置的取值范围
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;
		
		// 计算上侧区域图片排布位置的取值范围
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
		this.Constant.vPosRange.x[0] = halfImgW - imgW;
		this.Constant.vPosRange.x[1] = halfImgW;
		
		console.log("***this.Constant: ", this.Constant);
		this.rearrange(0)
	}
	
	/*
	* 翻转图片
	* @params index, 输入当前被执行inverse操作的图片对应图片信息数组的index值
	* */
	
	inverse(index) {
		return function () {
			var imgsArrangeArr = this.state.imgsArrangeArr;
			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
			this.setState({
				imgsArrangeArr: imgsArrangeArr
			});
		}.bind(this)
	}
	
	/*
	* 重新布局所有图片
	* @param centerIndex 指定居中排布哪个图片
	* */
	rearrange(centerIndex) {
		var imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,
			
			imgsArrangeTopArr = [],
			topImgNum = Math.floor(Math.random() * 2),    // 取一个或者不取
			topImgSpliceIndex = 0,
			
			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
		
		// 首先居中 centerIndex 的图片, 居中的 centerIndex 的图片不需要旋转
		imgsArrangeCenterArr[0] = {
			pos: centerPos,
			rotate: 0,
			isCenter: true
		};
		
		// 取出要布局上侧的图片的状态信息
		topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
		
		// 布局位于上侧的图片
		imgsArrangeTopArr.forEach(function (value, index) {
			imgsArrangeTopArr[index] = {
				pos: {
					top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
					left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
			};
		});
		
		// 布局左右两侧的图片
		for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
			var hPosRangeLORX = null;
			
			// 前半部分布局左边， 右半部分布局右边
			if (i < k) {
				hPosRangeLORX = hPosRangeLeftSecX;
			} else {
				hPosRangeLORX = hPosRangeRightSecX;
			}
			
			imgsArrangeArr[i] = {
				pos: {
					top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
					left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
			};
			
		}
		
		//当进入检查模式后 停止执行, 在当前点开始调试
		debugger;
		
		if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
			imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
		}
		
		imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
		
		this.setState({
			imgsArrangeArr: imgsArrangeArr
		});
		
		console.log("imgsArrangeArr: ", imgsArrangeArr);
	}
	
	/*
	 * 利用arrange函数， 居中对应index的图片
	 * @param index, 需要被居中的图片对应的图片信息数组的index值
	 * @returns {Function}
	 */
	center(index) {
		return function () {
			this.rearrange(index);
		}.bind(this);
	}
	
	render() {
		var controllerUnits = [],
			imageFigures = [];
		
		imageDatas.forEach(function(value, index) {
			if (!this.state.imgsArrangeArr[index]) {
				this.state.imgsArrangeArr[index] = {
					pos: {
						left: 0,
						top: 0,
					},
					rotate: 0,
					isInverse: false,
					isCenter: false,
				}
			}
			let imgFigure = (
				<ImageFigure
					key={"img-figure" + index}
					data = {value}
					ref={'imgFigure' + index}
					arrange={this.state.imgsArrangeArr[index]}
					center={this.center(index)}
				    inverse={this.inverse(index)}
				/>
			);
			
			let controllerUtil = (
				<ControllerUtils
					key={"utils-figure" + index}
				    arrange={this.state.imgsArrangeArr[index]}
					center={this.center(index)}
					inverse={this.inverse(index)}
				/>
			);
			
			imageFigures.push(imgFigure);
			controllerUnits.push(controllerUtil);
		}.bind(this));
		
		return (
			<section className="stage" ref="stage">
				<section className="img-sec">
					{imageFigures}
				</section>
				<nav className="controller-nav">
					{controllerUnits}
				</nav>
			</section>
		);
	}
}

AppComponent.defaultProps = {
};

export default AppComponent;
