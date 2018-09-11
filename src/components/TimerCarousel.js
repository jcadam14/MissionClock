import React, {Component} from 'react';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';

class TimerCarousel extends Component
{
    constructor(props)
    {
        super(props);
        this.buildSlideList = this.buildSlideList.bind(this);
        this.buildSlides = this.buildSlides.bind(this);
        this.state = {
            items:props.items
        }
    }

    buildSlideList()
    {
        const slides = [];
        for(let i = 0 ; i < this.state.items ; i++)
        {
            slides.push(<li data-targe="#myCarousel" data-slide-to="{i}"/>);
        }
        return slides;
    }

    buildSlides()
    {
        const slides = [];
        for(let i of this.state.items)
        {
            slides.push(<div className="item">{i}</div>);
        }
        return slides;
    }

    render()
    {
       return (<div id="myCarousel" className="carousel slide" data-ride="carousel">
  <ol className="carousel-indicators">
  {this.buildSlideList()}
  </ol>
  <div className="carousel-inner">
  {this.buildSlideList()}
  </div>
  <a className="left carousel-control" href="#myCarousel" data-slide="prev">
    <span className="glyphicon glyphicon-chevron-left"></span>
    <span className="sr-only">Previous</span>
  </a>
  <a className="right carousel-control" href="#myCarousel" data-slide="next">
    <span className="glyphicon glyphicon-chevron-right"></span>
    <span className="sr-only">Next</span>
  </a>
</div>);
    }
}

export default TimerCarousel;