/**
 * FloatNav Component for uxcore
 * @author vincent.bian
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */
import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import assign from 'object-assign';
import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';

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
  };

  constructor(props) {
    super(props);
    const anchors = this.getAnchors(props);
    this.state = {
      activeAnchor: '',
      scrollTop: 0,
      anchors,
      trigger: '',
    };
    this.handleScrollUp = this.handleScrollUp.bind(this);
    this.handleScrollDown = this.handleScrollDown.bind(this);
    this.handlePageScroll = throttle(this.handlePageScroll.bind(this), 50);
    this.updateScroll = debounce(this.updateScroll, 50, {
      trailing: true,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      anchors: this.getAnchors(nextProps),
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
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handlePageScroll, false);
  }

  updateComponentHeight() {
    this.contentHeight = this.contentEle.offsetHeight;
    this.viewHeight = this.containerEle.offsetHeight;
    this.maxScrollHeight = this.contentHeight - this.viewHeight;
  }

  getAnchors(props) {
    const { children } = props;
    const anchors = children.reduce((prev, cur) => {
      if (cur.props.anchor) {
        prev.push(cur.props.anchor);
      }
      if (Array.isArray(cur.props.children)) {
        prev = prev.concat(cur.props.children.filter(d => d.props.anchor).map(d => d.props.anchor));
      }
      return prev;
    }, []);
    return anchors;
  }

  updateScroll() {
    const { trigger } = this.state;
    if (trigger !== 'scroll') return;
    const containerRect = this.containerEle.getBoundingClientRect();
    const activeRect = this.activeItem.getBoundingClientRect();
    const delta = activeRect.top - containerRect.top;
    // console.log(delta, this.viewHeight)
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
    let { scrollTop } = this.state;
    if (delta / this.viewHeight < 1 / 3) {
      this.handleScrollUp();
    } else if (delta / this.viewHeight > 2 / 3) {
      this.handleScrollDown();
    }
  }

  handleScrollUp(e) {
    const state = {};
    if (e) {
      e.preventDefault();
      assign(state, {
        trigger: 'control',
      });
    }
    const { stepLength } = this.props;
    let { scrollTop } = this.state;
    scrollTop -= stepLength;
    if (scrollTop <= 0) {
      scrollTop = 0;
    }
    assign(state, {
      scrollTop,
    });
    this.setState(state);
  }

  handleScrollDown(e) {
    const state = {};
    if (e) {
      e.preventDefault();
      assign(state, {
        trigger: 'control',
      });
    }
    const { stepLength } = this.props;
    let { scrollTop } = this.state;
    scrollTop += stepLength;
    if (scrollTop >= this.maxScrollHeight) {
      scrollTop = this.maxScrollHeight;
    }
    assign(state, {
      scrollTop,
    });
    this.setState(state);
  }

  handlePageScroll(e) {
    const { anchors } = this.state;
    let rect, activeAnchor;
    anchors.some(anchor => {
      rect = this.wrapper.querySelector(`#${anchor}`).getBoundingClientRect();
      activeAnchor = anchor;
      return rect.top > 0;
    });
    this.setState({
      activeAnchor,
      trigger: 'scroll',
    });
  }

  renderNavItems() {
    const { prefixCls, children, showOrderNumber } = this.props;
    const { activeAnchor } = this.state;
    const cloneProps = {
      prefixCls,
    };
    let itemProps, newIndex;
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
        <div className={classnames(`${prefixCls}-scroll-line`)}></div>
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
        <a className={classnames(`${prefixCls}-control-prev`)} href="#" onClick={this.handleScrollUp}></a>
        <a className={classnames(`${prefixCls}-control-next`)} href="#" onClick={this.handleScrollDown}></a>
      </div>
    );
  }

  renderContent() {
    const { content } = this.props;
    return React.Children.map(content, (item) => {
      return React.cloneElement(item);
    });
  }

  render() {
    const { prefixCls, className, width, height, offset } = this.props;
    const { scrollTop } = this.state;
    const renderProps = {
      className: classnames(prefixCls, className),
      style: assign({
        width,
        height,
      }, offset),
    };
    const contentStyle = {
      transform: `translateY(-${scrollTop}px)`,
    };
    return (
      <div>
        <div
          className={`${prefixCls}-wrapper`}
          ref={node => (this.wrapper = node)}
        >
          { this.renderContent() }
        </div>
        <div {...renderProps}>
          { this.renderScrollBar() }
          <div
            className={classnames(`${prefixCls}-container`)}
            ref={node => (this.containerEle = node)}
          >
            <div
              className={classnames(`${prefixCls}-content`)}
              ref={node => (this.contentEle = node)}
              style={contentStyle}
            >
              {
                this.renderNavItems()
              }
            </div>
          </div>
          { this.renderControl() }
        </div>
      </div>
    );
  }
}

export default FloatNav;
