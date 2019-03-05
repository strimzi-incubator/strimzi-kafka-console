import React from 'react';
import {
  Button,
  Dropdown,
  DropdownPosition,
  DropdownToggle,
  DropdownItem,
  KebabToggle,
  TextInput,
  Toolbar,
  ToolbarGroup,
  ToolbarItem
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import flexStyles from '@patternfly/patternfly/utilities/Flex/flex.css';
import spacingStyles from '@patternfly/patternfly/utilities/Spacing/spacing.css';
import { SortAmountDownIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import OpenAddTopic from './openAddTopic';

class TopicsToolbar extends React.Component {
  static propTypes = {
    onAction: PropTypes.func.isRequired,
    service: PropTypes.object.isRequired
  };

  state = {
    isDropDownOpen: false,
    isKebabOpen: false,
    searchValue: ''
  };

  handleTextInputChange = value => {
    this.setState({ searchValue: value });
  };

  onDropDownToggle = isOpen => {
    this.setState({
      isDropDownOpen: isOpen
    });
  };

  onDropDownSelect = event => {
    this.setState({
      isDropDownOpen: !this.state.isDropDownOpen
    });
  };
  onKebabToggle = isOpen => {
    this.setState({
      isKebabOpen: isOpen
    });
  };

  onKebabSelect = event => {
    // notify the table that we selected an action from this toolbar
    this.props.onAction(event.target.innerText);
    this.setState({
      isKebabOpen: !this.state.isKebabOpen
    });
  };
  buildSearchBox = () => {
    const { value } = this.state.searchValue;
    return (
      <React.Fragment>
        <TextInput
          value={value || ''}
          type="search"
          placeholder="Filter by name..."
          onChange={this.handleTextInputChange}
          aria-label="search text input"
        />
        <span className="pficon pf-icon-ok input-search" />
      </React.Fragment>
    );
  };
  buildDropdown = () => {
    const { isDropDownOpen } = this.state;
    return (
      <Dropdown
        onToggle={this.onDropDownToggle}
        onSelect={this.onDropDownSelect}
        position={DropdownPosition.right}
        toggle={<DropdownToggle onToggle={this.onDropDownToggle}>All</DropdownToggle>}
        isOpen={isDropDownOpen}
        dropdownItems={[
          <DropdownItem key="item-1">Item 1</DropdownItem>,
          <DropdownItem key="item2">Item 2</DropdownItem>,
          <DropdownItem key="item-3">Item 3</DropdownItem>,
          <DropdownItem isDisabled key="all">
            All
          </DropdownItem>
        ]}
      />
    );
  };
  buildKebab = () => {
    const { isKebabOpen } = this.state;

    return (
      <Dropdown
        onToggle={this.onKebabToggle}
        onSelect={this.onKebabSelect}
        position={DropdownPosition.right}
        toggle={<KebabToggle onToggle={this.onKebabToggle} />}
        isOpen={isKebabOpen}
        isPlain
        dropdownItems={[
          <DropdownItem component="button" key="delete-topics">
            Delete selected topics
          </DropdownItem>
        ]}
      />
    );
  };
  render() {
    return (
      <Toolbar className={css(flexStyles.justifyContentSpaceBetween, spacingStyles.mxXl, spacingStyles.myMd)}>
        <ToolbarGroup>
          <ToolbarItem className={css(spacingStyles.mrXl)}>{this.buildSearchBox()}</ToolbarItem>
          <ToolbarItem>
            <Button variant="plain" aria-label="Sort A-Z">
              <SortAmountDownIcon />
            </Button>
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarItem className={css(spacingStyles.mxMd)}>
            <OpenAddTopic onAction={this.props.onAction} service={this.props.service} />
          </ToolbarItem>
          <ToolbarItem>{this.buildKebab()}</ToolbarItem>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

export default TopicsToolbar;
