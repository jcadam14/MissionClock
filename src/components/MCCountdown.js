import React,{Component} from 'react';

const formatValues = ({days,hours,minutes,seconds}) =>
{
    const hourString = ('0' + hours).slice(-2);
    const minString = ('0'+ minutes).slice(-2);
    const secString = ('0' + seconds).slice(-2);
    return (days + ':' + hourString + ':' + minString + ':' + secString);
}

class MCCountdown extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            endDate:this.props.endDate,
            countdown:'0:00:00:00',
            secondRemaining:0,
            id:0
        }
        this.initializeCountdown = this.initializeCountdown.bind(this);
        this.tick = this.tick.bind(this);
    }

    componentDidUpdate(prevProps, prevState)
    {
        if(this.props.endDate !== prevProps.endDate)
        {
            clearInterval(prevState.id);
            this.setState({endDate:this.props.endDate});
            this.initializeCountdown();
        }
    }

    componentDidMount()
    {
        this.initializeCountdown();
    }

    tick() {
        const values = this.getTimeRemaining(this.state.endDate);
        this.setState({countdown:formatValues(values),secondRemaining:values.secondsLeft});
        if(values.secondsLeft <= 0)
        {
            clearInterval(this.state.id);
            if(this.props.onComplete)
            {
                this.props.onComplete();
            }
            return;
        }
        else
        {
            if(this.props.onTick)
            {
                this.props.onTick(this.state.secondRemaining);
            }
        }
      }
      
      getTimeRemaining(endtime){
        const total = Date.parse(endtime) - Date.parse(new Date());
        const seconds = Math.floor( (total/1000) % 60 );
        const minutes = Math.floor( (total/1000/60) % 60 );
        const hours = Math.floor( (total/(1000*60*60)) % 24 );
        const days = Math.floor( total/(1000*60*60*24) );
        return {
          secondsLeft: total,
          days,
          hours,
          minutes,
          seconds
        };
    }

    initializeCountdown(){
        const values = this.getTimeRemaining(this.state.endDate);
        const id = setInterval(() => this.tick(),1000);
        this.setState({id:id,countdown:formatValues(values),secondRemaining:values.secondsLeft});
      }

    render()
    {
        const {countdown} = this.state;
        return(<span>{countdown}</span>);
    }
}

export default MCCountdown

