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

class SelectTypeAhead extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDropped: false
    };
  }

  render() {
    const { isDropped } = this.state;

    return (
      <div className="pf-c-select pf-m-expanded">
        <span id="select-single-typeahead-expanded-label" hidden>
          {' '}
          New
        </span>
        <div
          className="pf-c-select__toggle pf-m-typeahead"
          id="select-single-typeahead-expanded-toggle"
          aria-haspopup="true"
          aria-expanded="true"
          aria-labelledby="select-single-typeahead-expanded-label select-single-typeahead-expanded-toggle"
        >
          <div className="pf-c-select__toggle-wrapper">
            <input
              className="pf-c-form-control pf-c-select__toggle-typeahead"
              type="text"
              id="select-single-typeahead-expanded-typeahead"
              aria-label="Type to filter"
              value="New"
            />
          </div>
          <button className="pf-c-button pf-m-plain pf-c-select__toggle-clear" aria-label="Clear all">
            <i className="fas fa-times-circle" aria-hidden="true" />
          </button>
          <i className="fas fa-caret-down pf-c-select__toggle-arrow" aria-hidden="true" />
        </div>
        <ul hidden={isDropped} className="pf-c-select__menu" aria-labelledby="select-single-typeahead-expanded-label">
          <li>
            <button className="pf-c-select__menu-item" aria-pressed="false">
              <mark className="pf-c-select__menu-item--match">New</mark> Jersey
            </button>
          </li>
          <li>
            <button className="pf-c-select__menu-item" aria-pressed="false">
              <mark className="pf-c-select__menu-item--match">New</mark> Mexico
            </button>
          </li>
          <li>
            <button className="pf-c-select__menu-item" aria-pressed="false">
              <mark className="pf-c-select__menu-item--match">New</mark> York
            </button>
          </li>
        </ul>
      </div>
    );
  }
}

export default SelectTypeAhead;
