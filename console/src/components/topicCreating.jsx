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
