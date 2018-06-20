import expect from 'expect.js';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils, { Simulate } from 'react-dom/test-utils';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount } from 'enzyme';
import FloatNavWrapper from '../src';
import FloatNavDemo from '../demo/FloatNavDemo';

Enzyme.configure({ adapter: new Adapter() });

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
      done();
    });
  });

  describe('More Tests', () => {
    let component;
    let container;
    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);
      ReactDOM.render(<FloatNavDemo ref={d => (component = d)} />, container);
    });

    afterEach(() => {
      ReactDOM.unmountComponentAtNode(container);
    });

    it('should scroll correctly when click the control btn', (done) => {
      const nextBtn = TestUtils.findRenderedDOMComponentWithClass(component, 'uxcore-float-nav-control-next');
      Simulate.click(nextBtn);
      console.log(component.nav.state.scrollTop);
      done();
    });

    it('should call scroll up / down while clicking the related node', (done) => {
      window.scrollTo(0, document.body.clientHeight);
      console.log(document.body.clientHeight);
      window.setTimeout(() => {
        const navItems = document.querySelectorAll('.uxcore-float-nav-item');
        expect(navItems.length).to.be(16);
        const expectedResults = [false, false];
        component.nav.setState = () => {
          expectedResults[1] = true;
        }
        done();
      }, 500);
    });
  });
});
