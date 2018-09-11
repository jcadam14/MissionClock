import React,{Component} from 'react';

const formatValues = (secondsRemaining) =>
{
    var d = secondsRemaining;
    var r = {}; 
    var s = {                                                                  // structure
        years: 31536000,
        //month: 2592000,
        //week: 604800, // uncomment row to ignore
        days: 86400,   // feel free to add your own row
        hours: 3600,
        minutes: 60,
        seconds: 1
    };
    
    Object.keys(s).forEach(function(key){
        r[key] = Math.floor(d / s[key]);
        d -= r[key] * s[key];
    });

    const hourString = ('0' + r.hours).slice(-2);
    const minString = ('0'+ r.minutes).slice(-2);
    const secString = ('0' + r.seconds).slice(-2);
    const daysString = ('00' + r.days).slice(-3);
    const yearsString = (r.years > 0 ? ('0' + r.years).slice(-2) + ':':'');
    return (yearsString + daysString + ':' + hourString + ':' + minString + ':' + secString);
}

class ElapsedCountdown extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            secondsRemaining:0
        }
        this.tick = this.tick.bind(this);
    }

    componentDidUpdate(prevProps, prevState)
    {
        if(this.props.secondsRemaining !== prevProps.secondsRemaining)
        {
            clearInterval(this.interval);
            this.setState({secondsRemaining: this.props.secondsRemaining});
            this.interval = setInterval(this.tick, 1000);
        }
    }

    componentDidMount() {
        //this.setState({ secondsRemaining: this.props.secondsRemaining });
        this.secondsRemaining = this.props.secondsRemaining;
        this.interval = setInterval(this.tick, 1000);
      }

      componentWillUnmount(){
        clearInterval(this.interval);
      }

    tick() {
        this.secondsRemaining = (this.secondsRemaining - 1);
        this.forceUpdate();
    }
      
    render()
    {
        return(<span>{formatValues(Math.abs(this.state.secondsRemaining))}</span>);
    }
}

export default ElapsedCountdown

