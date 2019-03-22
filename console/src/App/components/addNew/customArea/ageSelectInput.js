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

class AgeSelectInput extends React.Component {
  static options = {
    msec: 1,
    second: 1000,
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 7 * 24 * 60 * 60 * 1000,
    year: 52 * 7 * 24 * 60 * 60 * 60 * 1000
  };

  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    plural: PropTypes.bool.isRequired,
    default: PropTypes.string.isRequired
  };

  static convertToMS = (unit, value) => AgeSelectInput.options[unit] * value;

  onSelect = event => {
    this.props.onSelect(event.target.value);
  };

  options = () => {
    const opts = AgeSelectInput.options;
    // options sorted by age
    const keys = Object.keys(opts);
    // .map(key => `${key}${this.props.plural ? 's' : ''}`);
    const ordered = keys.sort((a, b) => {
      if (opts[a] < opts[b]) return -1;
      if (opts[b] < opts[a]) return 1;
      return 0;
    });
    return ordered.map((unit, index) => (
      <option label="" value={unit} key={`age-${index}`}>
        {`${unit}${this.props.plural ? 's' : ''}`}
      </option>
    ));
  };

  render() {
    const titleId = 'ageSelect';
    return (
      <div>
        <span id={titleId} hidden>
          Select age period
        </span>
        <select
          aria-label="Select Input"
          className="pf-c-form-control"
          aria-labelledby={titleId}
          aria-invalid={false}
          defaultValue={this.props.default}
          onChange={this.onSelect}
        >
          {this.options()}
        </select>
      </div>
    );
  }
}

export default AgeSelectInput;
