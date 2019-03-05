import React from 'react';
import PropTypes from 'prop-types';

// The Select component doesn't appear to be in pf4
// import { Select, SelectOption, SelectVariant } from '@patternfly/react-core';

class SizeSelectInput extends React.Component {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    className: PropTypes.string
  };
  static defaultProps = {
    className: ''
  };
  options = [
    { value: 'KB', disabled: false },
    { value: 'MB', disabled: false },
    { value: 'GB', disabled: false },
    { value: 'TB', disabled: false },
    { value: 'PB', disabled: false },
    { value: 'ZB', disabled: false }
  ];
  default = 'MB';

  onSelect = event => {
    this.props.onSelect(event.target.value);
  };

  render() {
    const titleId = 'sizeSelect';
    return (
      <div className={this.props.className}>
        <span id={titleId} hidden>
          Select size units
        </span>
        <select
          aria-label="Select Input"
          className="pf-c-form-control"
          aria-labelledby={titleId}
          aria-invalid={false}
          defaultValue={this.default}
          onChange={this.onSelect}
        >
          {this.options.map((option, index) => (
            <option disabled={option.disabled} label="" value={option.value} key={index}>
              {option.value}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export default SizeSelectInput;
