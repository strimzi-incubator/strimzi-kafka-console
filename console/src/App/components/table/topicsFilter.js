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
import { TextInput } from '@patternfly/react-core';
import PropTypes from 'prop-types';

class TopicsFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchValue: ''
    };
  }

  static propTypes = {
    handleSetFilter: PropTypes.func.isRequired
  };

  handleTextInputChange = searchValue => {
    console.log(`setting searchValue to ${searchValue}`);
    this.setState({ searchValue });
  };

  handleTextInputKeyUp = key => {
    if (key.keyCode === 13) {
      this.props.handleSetFilter(this.state.searchValue);
    }
  };

  render() {
    return (
      <React.Fragment>
        <TextInput
          value={this.state.searchValue}
          type="search"
          placeholder="Filter by name..."
          onChange={this.handleTextInputChange}
          onKeyUp={this.handleTextInputKeyUp}
          autoFocus
          aria-label="search text input"
        />
        <span className="fa fa-search input-search" />
      </React.Fragment>
    );
  }
}

export default TopicsFilter;
