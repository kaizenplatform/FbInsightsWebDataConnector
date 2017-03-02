import React, { Component } from 'react';
import FbObjectSelect from './FbObjectSelect';

class FbObjectSelectField extends Component {
  render() {
    const { input: { value, name, onBlur, onChange }, meta: { touched, error }, ...rest } = this.props;
    let className;
    if (touched && error) {
      className = "has-error"
    }

    return (
      <div className={className}>
        <label htmlFor="adaccountId" className="col-md-2 control-label">AdAccount</label>
        <div className="col-md-10">
          <div>
            <FbObjectSelect
              value={value}
              name={name}
              onBlur={() => onBlur(value)}
              onChange={(x) => onChange(x.id)}
              {...rest}
            />
          </div>
          <div className="help-block">{touched && error}</div>
        </div>
      </div>
    );
  }
}

export default FbObjectSelectField;
