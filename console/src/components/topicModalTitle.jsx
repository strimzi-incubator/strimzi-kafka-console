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
