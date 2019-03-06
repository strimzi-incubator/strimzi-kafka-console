import React from 'react';
import PropTypes from 'prop-types';

class AgeSelectInput extends React.Component {
  constructor(props) {
    super(props);

    this.default = 'days';
  }
  static options = {
    msec: 1,
    second: 1000,
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 7 * 24 * 60 * 60 * 1000,
    year: 52 * 7 * 24 * 60 * 60 * 60 * 1000
  };

  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    plural: PropTypes.bool.isRequired
  };

  static convertToMS = (unit, value) => AgeSelectInput.options[unit] * value;

  onSelect = event => {
    this.props.onSelect(event.target.value);
  };

  options = () => {
    const opts = AgeSelectInput.options;
    // options sorted by age
    const keys = Object.keys(opts);
    // .map(key => `${key}${this.props.plural ? 's' : ''}`);
    const ordered = keys.sort((a, b) => {
      if (opts[a] < opts[b]) return -1;
      if (opts[b] < opts[a]) return 1;
      return 0;
    });
    return ordered.map((unit, index) => (
      <option label="" value={unit} key={`age-${index}`}>
        {`${unit}${this.props.plural ? 's' : ''}`}
      </option>
    ));
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
          {this.options()}
        </select>
      </div>
    );
  }
}

export default AgeSelectInput;
