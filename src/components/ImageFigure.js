/**
 * Created by devSC on 2017/9/16.
 */
import React, { Component } from 'react';

export default class ImageFigure extends Component {
	
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
