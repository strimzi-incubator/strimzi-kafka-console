import React from 'react';
import { Bullseye, Button, TextContent, Text, TextVariants } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import { CheckCircleIcon } from '@patternfly/react-icons';

class TopicCreating extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired
  };

  handleKeyUp = event => {
    console.log('handled key up');
    console.log(event);
    if (event.keyCode === 13) {
      this.props.onClose();
    }
  };

  render() {
    return (
      <Bullseye className={this.props.isOpen ? 'topic-component-shown' : 'topic-component-hidden'}>
        <div className="topic-creating-wrapper">
          <CheckCircleIcon color="green" id="topicCreatedIcon" />
          <TextContent>
            <Text component={TextVariants.h3}>Topic was successfully created</Text>
          </TextContent>
          <TextContent id="topicCreatedText">
            <Text component={TextVariants.p}>The topic was created. Close this dialog to view the topic list.</Text>
          </TextContent>
          <form>
            <Button
              autoFocus
              tabIndex="0"
              name="close"
              variant="primary"
              onClick={this.props.onClose}
              onKeyUp={this.handleKeyUp}
            >
              View topics
            </Button>
          </form>
        </div>
      </Bullseye>
    );
  }
}

export default TopicCreating;
