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
import {
  BackgroundImage,
  BackgroundImageSrc,
  Brand,
  Button,
  ButtonVariant,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  Page,
  PageHeader,
  PageSection,
  PageSectionVariants,
  TextContent,
  Text,
  Title,
  Toolbar,
  ToolbarGroup,
  ToolbarItem
} from '@patternfly/react-core';
import accessibleStyles from '@patternfly/patternfly/utilities/Accessibility/accessibility.css';
import { css } from '@patternfly/react-styles';
import { BellIcon, CogIcon, UserSecIcon } from '@patternfly/react-icons';
import xsImage from '@patternfly/patternfly/assets/images/pfbg_576.jpg';
import xs2xImage from '@patternfly/patternfly/assets/images/pfbg_576@2x.jpg';
import smImage from '@patternfly/patternfly/assets/images/pfbg_768.jpg';
import sm2xImage from '@patternfly/patternfly/assets/images/pfbg_768@2x.jpg';
import lgImage from '@patternfly/patternfly/assets/images/pfbg_1200.jpg';
import filter from '@patternfly/patternfly/assets/images/background-filter.svg';
import brandImg from './amqstreamslogo.png';
import TopicsTable from './topicTable';

class PageLayoutManualNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDropdownOpen: false,
      isKebabDropdownOpen: false
    };
  }

  onDropdownToggle = isDropdownOpen => {
    this.setState({
      isDropdownOpen
    });
  };

  onDropdownSelect = event => {
    this.setState({
      isDropdownOpen: !this.state.isDropdownOpen
    });
  };

  onKebabDropdownToggle = isKebabDropdownOpen => {
    this.setState({
      isKebabDropdownOpen
    });
  };

  onKebabDropdownSelect = event => {
    this.setState({
      isKebabDropdownOpen: !this.state.isKebabDropdownOpen
    });
  };

  render() {
    const { isDropdownOpen } = this.state;

    const userDropdownItems = [
      <DropdownItem>Logout</DropdownItem>,
      <DropdownItem component="button">Donate</DropdownItem>,
      <DropdownItem isDisabled>Party down</DropdownItem>
    ];
    const PageToolbar = (
      <Toolbar>
        <ToolbarGroup className={css(accessibleStyles.screenReader, accessibleStyles.visibleOnLg)}>
          <ToolbarItem>
            <Button id="notificationButton" aria-label="Notifications actions" variant={ButtonVariant.plain}>
              <BellIcon />
            </Button>
          </ToolbarItem>
          <ToolbarItem>
            <Button id="default-example-uid-02" aria-label="Settings actions" variant={ButtonVariant.plain}>
              <CogIcon />
            </Button>
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarItem className={css(accessibleStyles.screenReader, accessibleStyles.visibleOnMd)}>
            <Dropdown
              isPlain
              position="right"
              onSelect={this.onDropdownSelect}
              isOpen={isDropdownOpen}
              toggle={<DropdownToggle onToggle={this.onDropdownToggle}>Burr Sutter</DropdownToggle>}
              dropdownItems={userDropdownItems}
            />
          </ToolbarItem>
        </ToolbarGroup>
      </Toolbar>
    );

    const bgImages = {
      [BackgroundImageSrc.xs]: xsImage,
      [BackgroundImageSrc.xs2x]: xs2xImage,
      [BackgroundImageSrc.sm]: smImage,
      [BackgroundImageSrc.sm2x]: sm2xImage,
      [BackgroundImageSrc.lg]: lgImage,
      [BackgroundImageSrc.filter]: `${filter}#image_overlay`
    };

    const Header = (
      <PageHeader
        logo={<Brand src={brandImg} alt="Patternfly Logo" />}
        toolbar={PageToolbar}
        avatar={
          <span className="avatar-dot">
            <UserSecIcon color="#BBB" size="lg" />
          </span>
        }
      />
    );

    return (
      <React.Fragment>
        <BackgroundImage src={bgImages} />
        <Page header={Header}>
          <PageSection variant={PageSectionVariants.light}>
            <TextContent>
              <Title size="3xl">Topics</Title>
              <Text component="p" className="topic-title-description">
                This screen shows all the topics in your Kafka cluster. Topics are split into partitions and each
                partition can have one or more replicas. Replicas are evenly distributed across the brokers.
              </Text>
            </TextContent>
          </PageSection>
          <PageSection className="topics-table">
            <TopicsTable />
          </PageSection>
        </Page>
      </React.Fragment >
    );
  }
}

export default PageLayoutManualNav;
