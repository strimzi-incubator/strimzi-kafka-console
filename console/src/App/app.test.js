import React from 'react';
import { mount, shallow } from 'enzyme';
import { Button } from '@patternfly/react-core';
import App from './';

describe('App tests', () => {
  test('should render default App component', () => {
    const view = shallow(<App />);
    expect(view).toMatchSnapshot();
  });

  it('should render a notification button', () => {
    const wrapper = mount(<App />);
    const button = wrapper.find(Button);
    expect(button.exists()).toBe(true);
    expect(button.first().prop('id')).toEqual('notificationButton');
  });
});
