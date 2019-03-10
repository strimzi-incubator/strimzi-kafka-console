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
import Select from 'react-select'

class CustomKeyInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: this.props.customTopicConfigs.map(opt => ({ value: opt.name, label: opt.name }))
    };
  }

  static propTypes = {
    initialName: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    customTopicConfigs: PropTypes.array.isRequired
  };

  handleChange = selectedOption => {
    this.props.onSelect(selectedOption);
  };

  render() {
    return (
      <Select
        isSearchable
        placeholder="Search..."
        className="topics-custom-select"
        classNamePrefix="stacc"
        value={this.props.initialName}
        onChange={this.handleChange}
        options={this.state.options}
      />
    );
  }
}

/*
        <div className="pf-c-select pf-m-expanded">
          <span id="select-single-typeahead-expanded-label" hidden>
            {' '}
            New
        </span>
          <div
            className="pf-c-select__toggle pf-m-typeahead"
            id="select-single-typeahead-expanded-toggle"
            aria-haspopup="true"
            aria-expanded="true"
            aria-labelledby="select-single-typeahead-expanded-label select-single-typeahead-expanded-toggle"
          >
            <div className="pf-c-select__toggle-wrapper">
              <input
                className="pf-c-form-control pf-c-select__toggle-typeahead"
                type="text"
                id="select-single-typeahead-expanded-typeahead"
                aria-label="Type to filter"
                defaultValue="New"
              />
            </div>
            <i className="fas fa-caret-down pf-c-select__toggle-arrow" aria-hidden="true" />
          </div>
          <ul
            dropped="{this.state.isDropped}"
            className="pf-c-select__menu"
            aria-labelledby="select-single-typeahead-expanded-label"
          >
            <li>
              <button className="pf-c-select__menu-item" aria-pressed="false">
                <mark className="pf-c-select__menu-item--match">New</mark> Jersey
            </button>
            </li>
            <li>
              <button className="pf-c-select__menu-item" aria-pressed="false">
                <mark className="pf-c-select__menu-item--match">New</mark> Mexico
            </button>
            </li>
            <li>
              <button className="pf-c-select__menu-item" aria-pressed="false">
                <mark className="pf-c-select__menu-item--match">New</mark> York
            </button>
            </li>
          </ul>
        </div>






        <div className={this.props.className}>
      <span id={titleId} hidden>
        Custom config topic
    </span>
      <select
        aria-label="Select Input"
        className="pf-c-form-control"
        aria-labelledby={titleId}
        aria-invalid={false}
        defaultValue={this.props.initialName}
        onChange={this.onSelect}
      >
        {this.props.customTopicConfigs.map((option, index) => (
          <option label="" value={option.name} key={index}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
*/
export default CustomKeyInput;
