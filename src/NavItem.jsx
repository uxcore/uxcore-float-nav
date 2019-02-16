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
import { polyfill } from 'react-lifecycles-compat';

class NavItem extends Component {
  static displayName = 'NavItem';
  static defaultProps = {
    title: '',
    prefixCls: '',
    orderNumber: '',
    anchor: '',
    onClick: () => { },
    onActive: () => { },
    rootNode: true,
    active: false,
    subActiveAnchor: '',
    spotOnly: false,
  };
  static propTypes = {
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),
    prefixCls: PropTypes.string,
    orderNumber: PropTypes.string,
    anchor: PropTypes.string,
    onClick: PropTypes.func,
    onActive: PropTypes.func,
    rootNode: PropTypes.bool,
    active: PropTypes.bool,
    subActiveAnchor: PropTypes.string,
    children: PropTypes.any,
    level: PropTypes.number,
    spotOnly: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.handleClick = this.handleClick.bind(this);
  }

  getSnapshotBeforeUpdate(prevProps) {
    if (!prevProps.active && this.props.active) {
      this.props.onActive(this.props.anchor, this.root);
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // hold for getSnapshotBeforeUpdate method
  }

  handleClick(e) {
    const { anchor, onClick, orderNumber, onActive } = this.props;
    if (!anchor) {
      e.preventDefault();
    }
    onActive(anchor, this.root, 'click');
    onClick(anchor, orderNumber);
  }

  renderSubNav() {
    const { prefixCls, children, orderNumber, onActive, subActiveAnchor, level, spotOnly } = this.props;
    if (!children || children.length === 0) {
      return null;
    }
    const cloneProps = {
      prefixCls,
      rootNode: false,
      spotOnly,
    };
    let itemProps;

    return (
      <div className={classnames(`${prefixCls}-subs`)}>
        {
          React.Children.map(children, (item, index) => {
            itemProps = assign({
              onActive,
              active: item.props.anchor && subActiveAnchor === item.props.anchor,
              subActiveAnchor,
              level: level + 1,
            }, cloneProps);
            if (orderNumber) {
              assign(itemProps, {
                orderNumber: `${orderNumber}.${index + 1}`,
              });
            }
            return React.cloneElement(item, itemProps);
          })
        }
      </div>
    );
  }

  renderCircleIcon() {
    const { rootNode, active } = this.props;
    if (rootNode && !active) {
      return (
        <svg width="20" height="20">
          <circle cx="10" cy="10" r="3" className="item-circle-icon" />
        </svg>
      );
    }
    return null;
  }

  renderArrowIcon() {
    /* const { active } = this.props;
    if (active) {
      return (
        <svg width="21" height="20" viewBox="0 0 90 60">
          <polygon points="0,0 60,0 90,30 60,60 0,60" className="item-arrow-icon" />
        </svg>
      );
    }*/
    return null;
  }

  render() {
    const { prefixCls, title, orderNumber, anchor, active, level, spotOnly } = this.props;
    if (spotOnly) {
      return (
        <div
          className={classnames(`${prefixCls}-item`, {
            [`${prefixCls}-item-active`]: active,
          })} ref={node => (this.root = node)}
        >
          <div className={
            classnames(`${prefixCls}-spot-circle`, {
              [`${prefixCls}-spot-circle-active`]: active
            })
          }></div>
          {this.renderSubNav()}
        </div>
      );
    }
    return (
      <div
        className={classnames(`${prefixCls}-item`, {
          [`${prefixCls}-item-active`]: active,
        })} ref={node => (this.root = node)}
      >
        {this.renderCircleIcon()}
        {this.renderArrowIcon()}
        <a
          className={classnames(`${prefixCls}-item-title`, {
            [`${prefixCls}-item-title-active`]: active,
          })}
          style={{
            textIndent: `${(level + 1)}em`,
          }}
          href={`#${anchor}`}
          onClick={this.handleClick}
        >
          <span className={`${prefixCls}-item-title-inner`}>
            {orderNumber} {title}
          </span>
        </a>
        {this.renderSubNav()}
      </div>
    );
  }
}

export default polyfill(NavItem);
