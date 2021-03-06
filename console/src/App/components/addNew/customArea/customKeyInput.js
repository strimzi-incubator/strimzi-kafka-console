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
import Select from 'react-select';

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
    customTopicConfigs: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired
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
        index={this.props.index}
        onChange={this.handleChange}
        options={this.state.options}
        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
        menuPortalTarget={document.body}
        menuPosition="absolute"
        menuPlacement="bottom"
      />
    );
  }
}

export default CustomKeyInput;
