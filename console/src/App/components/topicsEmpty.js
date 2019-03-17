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
import { Title, EmptyState, EmptyStateIcon, EmptyStateBody, Bullseye } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import { CogsIcon } from '@patternfly/react-icons';
import OpenAddTopic from './openAddTopic';

class TopicsEmpty extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static propTypes = {
    onAction: PropTypes.func.isRequired,
    service: PropTypes.object.isRequired,
    handleNewNotification: PropTypes.func.isRequired
  };

  render() {
    return (
      <Bullseye>
        <EmptyState>
          <EmptyStateIcon icon={CogsIcon} />
          <Title size="lg">No topics</Title>
          <EmptyStateBody>There are no topics defined.</EmptyStateBody>
          <OpenAddTopic
            handleNewNotification={this.props.handleNewNotification}
            onAction={this.props.onAction}
            service={this.props.service}
          />
        </EmptyState>
      </Bullseye>
    );
  }
}

export default TopicsEmpty;
