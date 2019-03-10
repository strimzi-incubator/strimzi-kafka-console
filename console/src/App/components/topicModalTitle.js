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
import { Button } from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';

class TopicModalTitle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  static propTypes = {
    title: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className="topics-modal-title">
        <Button variant="plain" className="topics-title-close" onClick={this.props.onClose}>
          <TimesIcon color="white" size="md" />
        </Button>
        {this.props.title}
      </div>
    );
  }
}

export default TopicModalTitle;
