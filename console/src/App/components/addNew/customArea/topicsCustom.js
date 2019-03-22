/*
 * Copyright 2019 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';
import {
  Button,
  FormSelect,
  FormSelectOption,
  Switch,
  Text,
  TextContent,
  TextInput,
  TextVariants
} from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import CustomKeyInput from './customKeyInput';
import TopicsPopover from './topicsPopover';
import CustomTopicConfigs from '../../../data/customTopicConfigs.json';

class TopicsCustom extends React.Component {
  static propTypes = {
    setCustomized: PropTypes.func.isRequired,
    customized: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      customHeader: '',
      customText: ''
    };
    this.customTopicConfigs = [];
  }

  componentDidMount() {
    // get the custom topics keys once and pass them to each select control
    const separate = ['retention.ms', 'retention.bytes', 'cleanup.policy'];
    this.customTopicConfigs = CustomTopicConfigs.customTopicConfigs.filter(c => !separate.includes(c.name));
  }

  // custom list is not valid if there are any empty values
  getCustomValidity = customized => customized.every(c => c.value !== '');

  getFirstUnusedConfig = () => {
    let found = null;
    this.customTopicConfigs.some(custom => {
      if (!this.props.customized.some(existing => existing.name === custom.name)) {
        found = custom;
        return true;
      }
      return false;
    });
    if (!found) {
      [found] = this.customTopicConfigs;
    }
    return found;
  };

  // add a new custom configuration to the list
  handleAddCustomConfiguration = () => {
    const { customized } = this.props;
    const custom = this.getFirstUnusedConfig();
    const customHeader = custom.name;
    const customState = {};
    this.initCustomized(customState, custom.name);
    customized.push(customState);
    const customText = this.getCustom(customHeader).description;
    const isCustomValid = this.getCustomValidity(customized);

    this.setState({ customHeader, customText });
    this.props.setCustomized(customized, isCustomValid);
  };

  getCustom = value => this.customTopicConfigs.find(custom => custom.name === value);

  getInputType = key => {
    const numbers = ['long', 'int', 'double'];
    const { type } = this.getCustom(key);
    if (numbers.indexOf(type) > -1) {
      return 'number';
    } else if (type === 'boolean') {
      return 'boolean';
    }
    return 'text';
  };

  initCustomized = (customState, value) => {
    customState.name = value;
    customState.type = this.getInputType(value);
    const custom = this.getCustom(value);
    customState.description = custom.description;
    customState.value = custom.default;
    customState.option = { value, label: value };
    customState.validValues = custom.validValues;
    customState.min = null;
    customState.max = null;
    customState.step = null;
    if (customState.type === 'number') {
      [customState.min] = custom.validValues;
      if (custom.validValues.length > 1) {
        customState.max = custom.validValues[custom.validValues.length - 1];
      }
      if (custom.type === 'double') {
        customState.step = '0.1';
      }
    }
  };

  // user has chosen a different custom key
  handleCustomKeyChange = index => value => {
    const { customized } = this.props;
    this.initCustomized(customized[index], value.value);
    this.props.setCustomized(customized);
  };

  handleCustomHelpClick = event => {
    const index = Number(event.target.value);
    const customHeader = this.props.customized[index].name;
    const customText = this.getCustom(customHeader).description;
    this.setState({ customHeader, customText });
  };

  // user has changed the value for a custom key
  handleCustomValueChange = custom => value => {
    const { customized } = this.props;
    customized.forEach(c => {
      if (c.name === custom.name) {
        c.value = value;
      }
    });
    const isCustomValid = this.getCustomValidity(customized);
    this.props.setCustomized(customized, isCustomValid);
  };

  // user has deleted a custom configuration
  handleCustomDelete = custom => () => {
    const { customized } = this.props;
    const i = customized.findIndex(c => c.name === custom.name);
    if (i >= 0) {
      customized.splice(i, 1);
    }
    const isCustomValid = this.getCustomValidity(customized);
    this.props.setCustomized(customized, isCustomValid);
  };

  renderCustomizedListHeader() {
    if (this.props.customized.length > 0) {
      return (
        <React.Fragment>
          <div className="custom-wrapper custom-key">
            <span>Key</span>
          </div>
          <div className="custom-wrapper custom-help">
            <span>&nbsp;</span>
          </div>
          <div className="custom-wrapper custom-value">
            <span>Value</span>
          </div>
        </React.Fragment>
      );
    }
    return <React.Fragment />;
  }

  renderCustomInput = (custom, index) => {
    if (custom.type === 'text' && Array.isArray(custom.validValues)) {
      return (
        <FormSelect value={custom.value} onChange={this.handleCustomValueChange(custom)} aria-label="FormSelect Input">
          {custom.validValues.map((option, i) => (
            <FormSelectOption key={i} value={option} label={option} />
          ))}
        </FormSelect>
      );
    } else if (custom.type === 'boolean') {
      return (
        <Switch
          className="topics-custom-boolean"
          label={custom.value ? ' True' : ' False'}
          isChecked={custom.value}
          onChange={this.handleCustomValueChange(custom)}
          aria-label="True or False choice"
        />
      );
    }
    return (
      <TextInput
        type={custom.type}
        value={custom.value}
        min={custom.min}
        max={custom.max}
        step={custom.step}
        id={`custom-value-${index}`}
        index={index}
        name={custom.value}
        aria-describedby="Custom value"
        onChange={this.handleCustomValueChange(custom)}
      />
    );
  };

  renderCustomizedList() {
    return this.props.customized.map((custom, index) => (
      <div className="custom-list-item" key={`fragment-${index}`}>
        <div className="custom-wrapper custom-key">
          <CustomKeyInput
            onSelect={this.handleCustomKeyChange(index)}
            initialName={custom.option}
            customTopicConfigs={this.customTopicConfigs}
            index={index}
          />
        </div>
        <div className="custom-wrapper custom-help">
          <TopicsPopover
            className="customized-help"
            index={index}
            customHeader={this.state.customHeader}
            customText={this.state.customText}
            handleCustomHelpClick={this.handleCustomHelpClick}
          />
        </div>
        <div className="custom-wrapper custom-value">{this.renderCustomInput(custom, index)}</div>
        <div className="custom-wrapper custom-delete">
          <Button variant="plain" aria-label="Action" onClick={this.handleCustomDelete(custom)}>
            <TimesIcon />
          </Button>
        </div>
      </div>
    ));
  }

  render() {
    return (
      <div id="advancedOptions">
        <div className="customized-config">
          {this.renderCustomizedListHeader()}
          {this.renderCustomizedList()}
          <TextContent className="advanced-group-text">
            <Text component={TextVariants.a} onClick={this.handleAddCustomConfiguration}>
              Add a new configuration
            </Text>
          </TextContent>
        </div>
      </div>
    );
  }
}

export default TopicsCustom;
