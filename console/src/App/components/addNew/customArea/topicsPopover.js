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
import { Popover, PopoverPosition, Button } from '@patternfly/react-core';
import { InfoAltIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';

class TopicsPopover extends React.Component {
  static propTypes = {
    customText: PropTypes.string.isRequired,
    customHeader: PropTypes.string.isRequired,
    handleCustomHelpClick: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    this.index = this.props.index;
  }

  render() {
    return (
      <Popover
        position={PopoverPosition.right}
        headerContent={<div className="customized-help-title">{this.props.customHeader}</div>}
        bodyContent={this.props.customText}
        enableFlip={false}
        hideOnOutsideClick
        aria-label="Help for custom config"
      >
        <Button
          onClick={this.props.handleCustomHelpClick}
          variant="plain"
          value={this.index}
          aria-label="Show help for custom config"
        >
          <InfoAltIcon />
        </Button>
      </Popover>
    );
  }
}

export default TopicsPopover;
