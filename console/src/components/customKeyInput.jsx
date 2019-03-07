import React from 'react';
import PropTypes from 'prop-types';

class CustomKeyInput extends React.Component {
  constructor(props) {
    super(props);

    // :)
    this.options = [
      { value: 'KB', disabled: false },
      { value: 'MB', disabled: false },
      { value: 'GB', disabled: false },
      { value: 'TB', disabled: false },
      { value: 'PB', disabled: false },
      { value: 'EB', disabled: false },
      { value: 'ZB', disabled: false },
      { value: 'YB', disabled: false },
      { value: 'XB', disabled: false },
      { value: 'SB', disabled: false },
      { value: 'DB', disabled: false }
    ];
  }

  static propTypes = {
    initialName: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
    customTopicConfigs: PropTypes.object.isRequired,
    className: PropTypes.string
  };

  static defaultProps = {
    className: ''
  };

  onSelect = event => {
    this.props.onSelect(event.target.value);
  };

  render() {
    const titleId = 'custom-topic-config';
    return (
      <div className={this.props.className}>
        <span id={titleId} hidden>
          Custom config topic
        </span>
        <select
          aria-label="Select Input"
          className="pf-c-form-control"
          aria-labelledby={titleId}
          aria-invalid={false}
          defaultValue={this.props.initialName}
          onChange={this.onSelect}
        >
          {this.props.customTopicConfigs.map((option, index) => (
            <option label="" value={option.name} key={index}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export default CustomKeyInput;
