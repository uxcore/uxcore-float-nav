import expect from 'expect.js';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils, { Simulate } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import FloatNav from '../src';
import FloatNavDemo from '../demo/FloatNavDemo';


describe('FloatNav', () => {
  describe('Basic Tests', () => {
    const wrapper = mount(<FloatNavDemo />);

    it('should render into dom correctly', (done) => {
      expect(wrapper.find('.uxcore-float-nav').length).to.be(1);
      expect(wrapper.find('.uxcore-float-nav-wrapper').length).to.be(1);
      done();
    });

    it('should navigation correctly as click the nav item', (done) => {
      wrapper.find('.uxcore-float-nav-item-title').at(1).simulate('click');
      expect(wrapper.node.nav.state.activeAnchor).to.be('p1-1');
      done();
    });
  });

  describe('More Tests', () => {
    let component;
    beforeEach(() => {
      const container = document.createElement('div');
      document.body.appendChild(container);
      ReactDOM.render(<FloatNavDemo ref={d => (component = d)} />, container);
    });

    it('should scroll correctly when click the control btn', (done) => {
      const nextBtn = TestUtils.findRenderedDOMComponentWithClass(component, 'uxcore-float-nav-control-next');
      Simulate.click(nextBtn);
      console.log(component.nav.state.scrollTop);
      done();
    });
  });
});
