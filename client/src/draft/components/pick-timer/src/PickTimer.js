import React, { Component } from 'react';
import moment from 'moment';

class PickTimer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastPickTime: 0,
      timeDelta: 0,
    };

    this.startTimer = this.startTimer.bind(this);
  }

  startTimer() {
    const srcTime = this.state.lastPickTime;
    const timeStamp = new Date().getTime();
    //console.log('|  timer');
    this.setState({
      timeDelta: timeStamp - srcTime,
    }, () => {
      setTimeout(() => {
        this.startTimer();
      }, 1000)
    });
  }

  componentWillMount() {
    this.setState({
      lastPickTime: this.props.lastPickTime ? this.props.lastPickTime : 0,
    }, () => {
      this.startTimer();
    });
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.lastPickTime || this.props.lastPickTime === 0) {
      // console.log('| original time', this.props.lastPickTime);
      // console.log('| new time', nextProps.lastPickTime);
      if (nextProps.lastPickTime && (nextProps.lastPickTime !== this.state.lastPickTime)) {
        console.log('| TIME ', this.props.lastPickTime);
        this.setState({
          lastPickTime: nextProps.lastPickTime,
        }, () => {
          this.startTimer();
        });
      }

    }
  }
  render() {
   // let theTime = props.lastPickTime;


    return (
      <div>
        {moment(this.state.timeDelta).format('mm:ss')}
      </div>
    );

  }
}

export default PickTimer;
