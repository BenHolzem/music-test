import React from 'react';
import _ from 'lodash';

const getParamValues = (url) => {
    return url
      .slice(1)
      .split('&')
      .reduce((prev, curr) => {
        const [title, value] = curr.split('=');
        prev[title] = value;
        return prev;
      }, {});
  };
  

export default class Redirect extends React.Component {
  componentDidMount() {
    const { setExpiryTime, history, location } = this.props;
    try {
      if (_.isEmpty(location.hash)) {
        return history.push('/play');
      }
      const access_token = getParamValues(location.hash);
      const expiryTime = new Date().getTime() + access_token.expires_in * 1000;
      localStorage.setItem('params', JSON.stringify(access_token));
      localStorage.setItem('expiry_time', expiryTime);
      setExpiryTime(expiryTime);
      history.push('/play');
    } catch (error) {
      history.push('/play');
    }
  }
  render() {
    return null;
  }
}
