/**
 * FloatNav Component for uxcore
 * @author vincent.bian
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FloatNav from './FloatNav';

export default class FloatNavWrapper extends Component {
  static displayName = 'FloatNavWrapper';
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

  constructor(props) {
    super(props);
    this.state = {
      scrollTop: 0,
    };
  }

  renderContent() {
    return this.props.content;
  }

  render() {
    const { prefixCls, offset } = this.props;
    const { scrollTop } = this.state;
    return (
      <div>
        <div
          className={`${prefixCls}-wrapper`}
          ref={node => (this.wrapper = node)}
        >
          {this.renderContent()}
        </div>
        <FloatNav 
          {...this.props} 
          wrapper={this.wrapper}
          onScrollChange={(scrollTop) => { this.setState({ scrollTop }) }}
        />
      </div>
    );
  }
}
