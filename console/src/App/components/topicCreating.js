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
import { Bullseye, TextContent, Text, TextVariants } from '@patternfly/react-core';
import PropTypes from 'prop-types';

import { CogIcon } from '@patternfly/react-icons';

class TopicCreating extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static propTypes = {
    isOpen: PropTypes.bool.isRequired
  };

  render() {
    return (
      <Bullseye className={this.props.isOpen ? 'topic-component-shown' : 'topic-component-hidden'}>
        <div className="topic-creating-wrapper">
          <div id="topicCogWrapper">
            <CogIcon id="topicCogMain" className="spinning-clockwise" color="#AAAAAA" />
            <CogIcon id="topicCogUpper" className="spinning-cclockwise" color="#AAAAAA" />
            <CogIcon id="topicCogLower" className="spinning-cclockwise" color="#AAAAAA" />
          </div>
          <TextContent>
            <Text component={TextVariants.h3}>Creation in progress</Text>
          </TextContent>
          <TextContent>
            <Text className="topic-creating-message" component={TextVariants.p}>
              The topic is being created. One moment please...
            </Text>
          </TextContent>
        </div>
      </Bullseye>
    );
  }
}

export default TopicCreating;
