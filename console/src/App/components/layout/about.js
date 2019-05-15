import React from 'react';
import { AboutModal, Button, ButtonVariant, TextContent, TextList, TextListItem } from '@patternfly/react-core';
import { CogIcon } from '@patternfly/react-icons';

let brandImg = require('../../assets/images/strimzi_logo_reverse.svg');

class StreamsAboutModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false
    };
    brandImg = brandImg.substr(1, brandImg.length - 2);
  }

  handleModalToggle = () => {
    this.setState(({ isModalOpen }) => ({
      isModalOpen: !isModalOpen
    }));
  };

  render() {
    const { isModalOpen } = this.state;

    return (
      <React.Fragment>
        <Button
          id="default-example-uid-02"
          aria-label="Settings actions"
          variant={ButtonVariant.plain}
          onClick={this.handleModalToggle}
        >
          <CogIcon />
        </Button>
        <AboutModal
          isOpen={isModalOpen}
          onClose={this.handleModalToggle}
          productName=""
          trademark=""
          brandImageSrc={brandImg}
          brandImageAlt="Strimzi Logo"
        >
          <TextContent>
            <TextList component="dl">
              <TextListItem component="dt">Version</TextListItem>
              <TextListItem component="dd">0.1.0</TextListItem>
              <TextListItem component="dt">User Name</TextListItem>
              <TextListItem component="dd">Burr Sutter</TextListItem>
              <TextListItem component="dt">User Role</TextListItem>
              <TextListItem component="dd">Super genius</TextListItem>
            </TextList>
          </TextContent>
        </AboutModal>
      </React.Fragment>
    );
  }
}

export default StreamsAboutModal;
