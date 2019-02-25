/**
 * FloatNav Component for uxcore
 * @author vincent.bian
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import assign from 'object-assign';
import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';
import { polyfill } from 'react-lifecycles-compat';

function getAnchors(props) {
  const { children } = props;
  let anchors = [];
  if (children) {
    if (!children.length) {
      anchors.push(children.props.anchor);
      anchors = anchors.concat(getAnchors(children.props));
    } else {
      React.Children.forEach(children, (child) => {
        const childAnchor = child.props.anchor;
        if (childAnchor) {
          anchors.push(childAnchor);
        }
        anchors = anchors.concat(getAnchors(child.props));
      });
    }
  }
  return anchors;
}

class FloatNav extends Component {

  static displayName = 'FloatNav';
  static defaultProps = {
    prefixCls: 'uxcore-float-nav',
    className: '',
    showOrderNumber: true,
    width: 260,
    height: 370,
    offset: {
      right: 20,
      bottom: 20,
    },
    content: null,
    stepLength: 50,
    hoverable: false,
  };
  static propTypes = {
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    showOrderNumber: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
    offset: PropTypes.shape({
      right: PropTypes.number,
      bottom: PropTypes.number,
    }),
    content: PropTypes.element,
    stepLength: PropTypes.number,
    children: PropTypes.any,
    hoverable: PropTypes.bool,
  };

  static getDerivedStateFromProps(nextProps) {
    return {
      anchors: getAnchors(nextProps),
    };
  }

  constructor(props) {
    super(props);
    const anchors = getAnchors(props);
    this.state = {
      activeAnchor: '',
      scrollTop: 0,
      anchors,
      trigger: '',
      spotActive: false,
      spotHeight: 0,
    };
    this.handleScrollUp = this.handleScrollUp.bind(this);
    this.handleScrollDown = this.handleScrollDown.bind(this);
    this.handlePageScroll = throttle(this.handlePageScroll.bind(this), 50);
    this.updateScroll = debounce(this.updateScroll, 50, {
      trailing: true,
    });
  }

  componentDidMount() {
    this.updateComponentHeight();
    window.addEventListener('scroll', this.handlePageScroll, false);
    this.handlePageScroll();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.height !== this.props.height) {
      this.updateComponentHeight();
    }
    if (this.activeItem) {
      this.updateScroll();
    }
    if (this.spotWrap && this.state.spotHeight !== this.spotWrap.offsetHeight) {
      this.updateComponentHeight();
      this.setState({
        spotHeight: this.spotWrap.offsetHeight,
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handlePageScroll, false);
  }

  updateComponentHeight() {
    this.contentHeight = this.contentEle.offsetHeight;
    this.viewHeight = this.containerEle.offsetHeight;
    this.maxScrollHeight = this.contentHeight - this.viewHeight;
  }

  updateScroll() {
    const { trigger } = this.state;
    if (trigger !== 'scroll') return;
    const containerRect = this.containerEle.getBoundingClientRect();
    const activeRect = this.activeItem.getBoundingClientRect();
    const delta = activeRect.top - containerRect.top;
    if (delta < 0) {
      this.handleScrollUp();
    } else if (delta > this.viewHeight) {
      this.handleScrollDown();
    }
  }

  centerActive() {
    const containerRect = this.containerEle.getBoundingClientRect();
    const activeRect = this.activeItem.getBoundingClientRect();
    const delta = activeRect.top - containerRect.top;
    if (delta / this.viewHeight < 1 / 3) {
      this.handleScrollUp();
    } else if (delta / this.viewHeight > 2 / 3) {
      this.handleScrollDown();
    }
  }

  handleScrollUp(e) {
    if (e) {
      e.preventDefault();
    }
    const state = {};
    if (e) {
      e.preventDefault();
      assign(state, {
        trigger: 'control',
      });
    }
    const { stepLength, onScrollChange } = this.props;
    let { scrollTop } = this.state;
    scrollTop -= stepLength;
    if (scrollTop <= 0) {
      scrollTop = 0;
    }
    assign(state, {
      scrollTop,
    });
    this.setState(state);
    if (onScrollChange) {
      onScrollChange(state.scrollTop);
    }
  }

  handleScrollDown(e) {
    if (e) {
      e.preventDefault();
    }
    const state = {};
    if (e) {
      e.preventDefault();
      assign(state, {
        trigger: 'control',
      });
    }
    const { stepLength, onScrollChange } = this.props;
    let { scrollTop } = this.state;
    scrollTop += stepLength;
    if (scrollTop >= this.maxScrollHeight) {
      scrollTop = this.maxScrollHeight;
    }
    assign(state, {
      scrollTop,
    });
    this.setState(state);
    if (onScrollChange) {
      onScrollChange(state.scrollTop);
    }
  }

  handlePageScroll() {
    const { anchors } = this.state;
    let rect;
    let anchorNode;
    let activeAnchor;
    anchors.some((anchor) => {
      if (this.props.wrapper) {
        anchorNode = this.props.wrapper.querySelector(`#${anchor}`);
      }
      if (anchorNode) {
        rect = anchorNode.getBoundingClientRect();
        if (this.props.wrapper) {
          rect = this.props.wrapper.querySelector(`#${anchor}`).getBoundingClientRect();
        }
        activeAnchor = anchor;
        return rect.top > 0;
      }
      return false;
    });
    if (activeAnchor) {
      this.setState({
        activeAnchor,
        trigger: 'scroll',
      });
    }
  }

  renderNavItems() {
    const { prefixCls, children, showOrderNumber } = this.props;
    const { activeAnchor } = this.state;
    const cloneProps = {
      prefixCls,
    };
    let itemProps;
    return React.Children.map(children, (item, index) => {
      itemProps = assign({
        onActive: (anchor, activeItem, triggerType) => {
          this.activeItem = activeItem;
          this.setState({
            activeAnchor: anchor,
            trigger: 'click',
          }, () => {
            if (triggerType === 'click') {
              this.centerActive();
            }
          });
        },
        active: item.props.anchor && activeAnchor === item.props.anchor,
        subActiveAnchor: activeAnchor,
        level: 0,
      }, cloneProps);
      if (showOrderNumber) {
        assign(itemProps, {
          orderNumber: `${index + 1}`,
        });
      }
      return React.cloneElement(item, itemProps);
    });
  }

  renderScrollBar() {
    const { prefixCls } = this.props;
    return (
      <div className={classnames(`${prefixCls}-scroll-bar`)}>
        <svg width="20" height="20" className="line-circle line-circle-top">
          <circle cx="10" cy="10" r="4" />
        </svg>
        <div className={classnames(`${prefixCls}-scroll-line`)} />
        <svg width="20" height="20" className="line-circle line-circle-bottom">
          <circle cx="10" cy="10" r="4" />
        </svg>
      </div>
    );
  }

  renderControl() {
    const { prefixCls } = this.props;
    return (
      <div className={classnames(`${prefixCls}-control`)}>
        <a className={classnames(`${prefixCls}-control-prev kuma-button-secondary kuma-button`)} onClick={this.handleScrollUp} />
        <a className={classnames(`${prefixCls}-control-next kuma-button-secondary kuma-button`)} onClick={this.handleScrollDown} />
      </div>
    );
  }

  renderSpot() {
    const { prefixCls, children, showOrderNumber } = this.props;
    const { activeAnchor } = this.state;
    const cloneProps = {
      prefixCls,
      spotOnly: true,
    };
    let itemProps;
    return React.Children.map(children, (item, index) => {
      itemProps = assign({
        onActive: (anchor, activeItem, triggerType) => {
          this.activeItem = activeItem;
          this.setState({
            activeAnchor: anchor,
            trigger: 'click',
          }, () => {
            if (triggerType === 'click') {
              this.centerActive();
            }
          });
        },
        active: item.props.anchor && activeAnchor === item.props.anchor,
        subActiveAnchor: activeAnchor,
        level: 0,
      }, cloneProps);
      if (showOrderNumber) {
        assign(itemProps, {
          orderNumber: `${index + 1}`,
        });
      }
      return React.cloneElement(item, itemProps);
    });
  }

  renderSpotControl() {
    const { prefixCls } = this.props;
    return (
      <div className={classnames(`${prefixCls}-control`)}>
        <a className={classnames(`${prefixCls}-control-prev kuma-button-secondary kuma-button`)} onClick={this.handleScrollUp} />
        <a className={classnames(`${prefixCls}-control-next kuma-button-secondary kuma-button`)} onClick={this.handleScrollDown} />
      </div>
    );
  }

  render() {
    const { prefixCls, className, width, height, offset, hoverable } = this.props;
    const { scrollTop, spotActive } = this.state;
    let renderProps = {
      className: classnames(prefixCls, className),
      style: assign({
        width,
        height,
      }, { top: 200, right: 20, ...offset }),
    };
    const contentStyle = {
      transform: `translateY(-${scrollTop}px)`,
    };

    const innerStyle = {
      height: height - 40,
      width: width - 10,
      position: 'relative',
      marginTop: 20,
      marginRight: 10,
    };
    if (hoverable) {
      renderProps.className = classnames(renderProps.className, 'hoverable');
      renderProps.style.right = 0;
      renderProps.style.top = '50%';
      renderProps.style.marginTop = -(renderProps.style.height / 2);
      renderProps.onMouseLeave = () => {
        this.setState({ spotActive: false });
      };
    }

    let result = (
      <div {...renderProps}>
        <div style={innerStyle}>
          {this.renderScrollBar()}
          <div
            className={classnames(`${prefixCls}-container`)}
            ref={node => (this.containerEle = node)}
          >
            <div
              className={classnames(`${prefixCls}-content`)}
              ref={node => (this.contentEle = node)}
              style={contentStyle}
            >
              {this.renderNavItems()}
            </div>
          </div>
          {this.renderControl()}
        </div>
      </div>
    );

    if (hoverable) {
      return (
        <div
          className={
            classnames({
              [`${prefixCls}-spot-active`]: spotActive
            })
          }
        >
          <div
            className={`${prefixCls}-spot-wrap`}
            ref={c => this.spotWrap = c }
            style={{
              marginTop: -(this.state.spotHeight / 2),
            }}
            onMouseEnter={() => {
              this.setState({ spotActive: true });
            }}
          >
            {this.renderSpot()}
            {this.renderSpotControl()}
          </div>
          {result}
        </div>
      );
    }

    return result;
  }
}

export default polyfill(FloatNav);
