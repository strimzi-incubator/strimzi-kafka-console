import React from 'react';

class AgeSelectInput extends React.Component {
  constructor(props) {
    super(props);
    this.options = [
      { value: 'days', disabled: false },
      { value: 'weeks', disabled: false },
      { value: 'months', disabled: false },
      { value: 'years', disabled: false }
    ];
    this.default = 'days';

    this.state = {
      isExpanded: false,
    };
  }

  onSelect = (event) => {
    this.setState({
      isExpanded: false
    });
    this.props.onSelect(event.target.value);
  };

  render() {
    const titleId = 'ageSelect';
    return (
      <div>
        <span id={titleId} hidden>
          Select age period
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
            <option
              disabled={option.disabled}
              label=''
              value={option.value}
              key={index}
            >{option.value}</option>
          ))}
        </select>
      </div>
    );
  }
}

export default AgeSelectInput;