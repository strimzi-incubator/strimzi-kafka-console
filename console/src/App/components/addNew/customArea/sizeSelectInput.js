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
import PropTypes from 'prop-types';

// The Select component doesn't appear to be in pf4
// import { Select, SelectOption, SelectVariant } from '@patternfly/react-core';

class SizeSelectInput extends React.Component {
  constructor(props) {
    super(props);
    this.default = 'MB';
  }
  static options = [
    { value: 'Bytes', mult: 1 },
    { value: 'KB', mult: 1024 },
    { value: 'MB', mult: 1024 * 1024 },
    { value: 'GB', mult: 1024 * 1024 * 1024 }
  ];
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    className: PropTypes.string
  };
  static defaultProps = {
    className: ''
  };
  static convertToBytes = (units, value) => {
    const opt = SizeSelectInput.options.filter(o => o.value === units)[0];
    return opt.mult * value;
  };

  onSelect = event => {
    this.props.onSelect(event.target.value);
  };

  render() {
    const titleId = 'sizeSelect';
    return (
      <div className={this.props.className}>
        <span id={titleId} hidden>
          Select size units
        </span>
        <select
          aria-label="Select Input"
          className="pf-c-form-control"
          aria-labelledby={titleId}
          aria-invalid={false}
          defaultValue={this.default}
          onChange={this.onSelect}
        >
          {SizeSelectInput.options.map((option, index) => (
            <option disabled={option.disabled} label="" value={option.value} key={index}>
              {option.value}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export default SizeSelectInput;
