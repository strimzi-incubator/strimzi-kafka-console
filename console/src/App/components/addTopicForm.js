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
  ActionGroup,
  Form,
  FormGroup,
  TextInput,
  Checkbox,
  Button,
  Grid,
  GridItem,
  TextContent,
  Text,
  TextVariants,
  Title,
  Split,
  SplitItem
} from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import AgeSelectInput from './ageSelectInput';
import SizeSelectInput from './sizeSelectInput';
import CustomKeyInput from './customKeyInput';
import TopicModalTitle from './topicModalTitle';
import CustomTopicConfigs from '../data/customTopicConfigs.json';

class AddTopicForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      partitions: 1,
      replicas: 1,
      ageBased: false,
      ageUnit: 'day',
      ageValue: '2',
      plural: true,
      storageBased: false,
      storageUnit: 'MB',
      storageValue: '512',
      compacted: false,
      customized: [],
      isNameValid: false,
      isCustomValid: true
    };

    this.customTopicConfigs = [];
  }

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    service: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired
  };

  componentDidMount() {
    // get the custom topics keys once and pass them to each select control
    const separate = ['retention.ms', 'retention.bytes', 'cleanup.policy'];
    this.customTopicConfigs = CustomTopicConfigs.customTopicConfigs.filter(c => !separate.includes(c.name));
  }

  isFormValid = () => {
    const { isNameValid, isCustomValid } = this.state;
    return isNameValid && isCustomValid;
  };

  handleTopicNameChange = name => {
    name = name.replace(' ', '-');
    this.setState({ name });
    const isNameValid = this.props.service.isUniqueValidName(name);
    this.setState({ isNameValid });
  };

  handleTopicNameKeyUp = key => {
    if (key.keyCode === 13 && this.isFormValid()) {
      this.handleFormSubmit();
    }
  };

  handlePartitionsChange = partitions => {
    this.setState({ partitions });
  };

  handleReplicasChange = replicas => {
    this.setState({ replicas });
  };

  handleAgeChange = ageValue => {
    const plural = ageValue !== '1';
    this.setState({ ageValue, plural });
  };

  handleSizeChange = storageValue => {
    this.setState({ storageValue });
  };

  handlePolicyChange = (checked, event) => {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    this.setState({ [name]: value });
  };

  // custom list is not valid if there are any empty values
  getCustomValidity = customized => customized.every(c => c.value !== '');

  // add a new custom configuration to the list
  handleAddCustomConfiguration = () => {
    const { customized } = this.state;
    customized.push({
      name: 'compression.type',
      value: '',
      option: { value: 'compression.type', label: 'compression.type' }
    });
    const isCustomValid = this.getCustomValidity(customized);
    this.setState({ customized, isCustomValid });
  };

  // user has chosen a different custom key
  handleCustomKeyChange = index => value => {
    const { customized } = this.state;
    customized[index].name = value.value;
    customized[index].option = value;
    console.log(`customKeyInput setting value of ${value}`);
    console.log(value);
    this.setState({ customized });
  };

  // user has changed the value for a custom key
  handleCustomValueChange = custom => value => {
    const { customized } = this.state;
    customized.forEach(c => {
      if (c.name === custom.name) {
        c.value = value;
      }
    });
    const isCustomValid = this.getCustomValidity(customized);
    this.setState({ customized, isCustomValid });
  };

  // user had deleted a custom configuration
  handleCustomDelete = custom => () => {
    const { customized } = this.state;
    const i = customized.findIndex(c => c.name === custom.name);
    if (i >= 0) {
      customized.splice(i, 1);
    }
    const isCustomValid = this.getCustomValidity(customized);
    this.setState({ customized, isCustomValid });
  };

  handleStorageUnitChange = size => {
    let { storageUnit } = this.state.storageUnit;
    storageUnit = size;
    this.setState({ storageUnit });
  };

  handleAgeUnitChange = unit => {
    let { ageUnit } = this.state.ageUnit;
    ageUnit = unit;
    this.setState({ ageUnit });
  };

  handleFormSubmit = () => {
    const body = {
      name: this.state.name,
      partitions: this.state.partitions,
      replicas: this.state.replicas,
      config: {}
    };
    // add the customized key/values to the POST body
    if (this.state.customized.length > 0) {
      this.state.customized.forEach(c => {
        body.config[c.name] = c.value;
      });
    }
    // add any age based policy data to the body
    if (this.state.ageBased) {
      const ms = AgeSelectInput.convertToMS(this.state.ageUnit, this.state.ageValue);
      body.config['retention.ms'] = ms;
    }
    // add any storage policy data to the body
    if (this.state.storageBased) {
      body.config['retention.bytes'] = SizeSelectInput.convertToBytes(this.state.storageUnit, this.state.storageValue);
    }
    if (this.state.compacted) {
      body.config['cleanup.policy'] = 'compact';
    }

    this.props.onSubmit(body);
  };

  renderCustomizedListHeader() {
    if (this.state.customized.length > 0) {
      return (
        <React.Fragment>
          <div className="custom-wrapper custom-key">
            <span>Key</span>
          </div>
          <div className="custom-wrapper custom-value">
            <span>Value</span>
          </div>
        </React.Fragment>
      );
    }
    return <React.Fragment />;
  }

  renderCustomizedList() {
    return this.state.customized.map((custom, index) => (
      <div className="custom-list-item" key={`fragment-${index}`}>
        <div className="custom-wrapper custom-key">
          <CustomKeyInput
            onSelect={this.handleCustomKeyChange(index)}
            initialName={custom.option}
            customTopicConfigs={this.customTopicConfigs}
          />
        </div>
        <div className="custom-wrapper custom-value">
          <TextInput
            type="text"
            id={`custom-value-${index}`}
            name="simple-form-name"
            aria-describedby="simple-form-name-helper"
            value={custom.value}
            onChange={this.handleCustomValueChange(custom)}
          />
        </div>
        <div className="custom-wrapper custom-delete">
          <Button variant="plain" aria-label="Action" onClick={this.handleCustomDelete(custom)}>
            <TimesIcon />
          </Button>
        </div>
      </div>
    ));
  }

  render() {
    const { name, partitions, replicas } = this.state;
    return (
      <React.Fragment>
        <TopicModalTitle title="Create a topic" onClose={this.props.onClose} />
        <Form
          className={
            this.props.isOpen ? 'topic-component-shown add-topic-form' : 'topic-component-hidden add-topic-form'
          }
        >
          <Split gutter="md">
            <SplitItem isMain className="basic-configuration">
              <TextContent>
                <Text component={TextVariants.h2}>Basic configuration</Text>
              </TextContent>
              <FormGroup label="Name" isRequired fieldId="simple-form-name">
                <TextInput
                  isRequired
                  type="text"
                  id="simple-form-name"
                  name="simple-form-name"
                  aria-describedby="simple-form-name-helper"
                  value={name}
                  onChange={this.handleTopicNameChange}
                  onKeyUp={this.handleTopicNameKeyUp}
                  autoFocus
                  isValid={this.state.isNameValid}
                />
              </FormGroup>
              <Grid gutter="md" className="topic-group">
                <GridItem span={3}>
                  <FormGroup label="Partitions" fieldId="partitions">
                    <TextInput
                      isRequired
                      type="number"
                      id="create-partitions"
                      name="partitions"
                      aria-describedby="create-partitions-helper"
                      value={partitions}
                      min="1"
                      max="99"
                      onChange={this.handlePartitionsChange}
                    />
                  </FormGroup>
                </GridItem>
                <GridItem span={1} />
                <GridItem span={3}>
                  <FormGroup label="Replicas" fieldId="replicas">
                    <TextInput
                      isRequired
                      type="number"
                      id="create-replicas"
                      name="replicas"
                      aria-describedby="create-replica-helper"
                      value={replicas}
                      min="1"
                      max="99"
                      onChange={this.handleReplicasChange}
                    />
                  </FormGroup>
                </GridItem>
                <GridItem span={5} />
              </Grid>
              <TextContent className="form-section">
                <Text component={TextVariants.h2}>Customized configuration</Text>
              </TextContent>
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
            </SplitItem>

            <SplitItem className="data-retention-policy">
              <TextContent>
                <Text component={TextVariants.h2}>Data retention policy</Text>
              </TextContent>
              <Title className="topics-policy-title" size="md">
                Messages are deleted after one week by default if no policies are set.
              </Title>
              <FormGroup fieldId="agePolicy" className="topic-group">
                <Checkbox
                  label="Based on age"
                  onChange={this.handlePolicyChange}
                  aria-label="Retain based on age"
                  name="ageBased"
                  id="ageBased"
                  value={this.state.ageBased}
                />
              </FormGroup>
              <div className={this.state.ageBased ? 'group-displayed' : 'group-none'}>
                <div className="group-wrapper">
                  <span className="form-lable">Messages are deleted after</span>
                </div>
                <div className="group-wrapper">
                  <FormGroup label="" fieldId="deletedAfter">
                    <TextInput
                      type="number"
                      id="deleted-after"
                      name="deletedAfter"
                      aria-describedby="deleted-after"
                      value={this.state.ageValue}
                      min="1"
                      max="99"
                      onChange={this.handleAgeChange}
                    />
                  </FormGroup>
                </div>
                <div className="group-wrapper">
                  <AgeSelectInput
                    plural={this.state.plural}
                    default={this.state.ageUnit}
                    onSelect={this.handleAgeUnitChange}
                  />
                </div>
              </div>
              <FormGroup fieldId="storagePolicy" className="topic-group">
                <Checkbox
                  label="Based on storage"
                  value={this.state.storageBased}
                  onChange={this.handlePolicyChange}
                  aria-label="Retain based on storage"
                  id="storageBased"
                  name="storageBased"
                />
              </FormGroup>
              <div className={this.state.storageBased ? 'group-displayed' : 'group-none'}>
                <div className="group-wrapper">
                  <div>Messages are deleted when the message log size exceeds</div>
                </div>
                <div className="group-together">
                  <div className="group-wrapper">
                    <FormGroup label="" fieldId="deletedAfter">
                      <TextInput
                        type="number"
                        id="deletedIfOver"
                        name="storageSize"
                        aria-describedby="storage-size"
                        value={this.state.storageValue}
                        min="1"
                        max="99"
                        onChange={this.handleSizeChange}
                      />
                    </FormGroup>
                  </div>
                  <div className="group-wrapper">
                    <SizeSelectInput onSelect={this.handleStorageUnitChange} className="size-select" />
                  </div>
                </div>
              </div>
              <FormGroup fieldId="compactedPolicy" className="topic-group">
                <Checkbox
                  label="Compacted topic policy"
                  value={this.state.compacted}
                  onChange={this.handlePolicyChange}
                  aria-label="Create compacted topic policy"
                  id="compacted"
                  name="compacted"
                />
              </FormGroup>
            </SplitItem>
          </Split>
          <ActionGroup className="topic-form-buttons">
            <Button
              key="confirm"
              variant="primary"
              onClick={this.handleFormSubmit}
              className="create-primary"
              isDisabled={!this.isFormValid()}
            >
              Create
            </Button>
            <Button key="cancel" variant="plain" onClick={this.props.onClose} className="create-secondary">
              Cancel
            </Button>
          </ActionGroup>
        </Form>
      </React.Fragment>
    );
  }
}

export default AddTopicForm;
