import React, { Component } from 'react';
import { Row } from 'react-bootstrap'
import API from '../../../Utils/API'
import APIKEYS from '../../../Utils/APIkeys'
import { TopRow, Forecast } from './Rows'


class CurrentWeather extends Component {
    state = {
        timerRunning: false,
        timerInterval: null,
        timerIntervalMS: null,
        weather: {
            current: {},
            forecast: []
        }
    }

    componentDidMount(){
        this.setState({timerInterval: APIKEYS.timerIntervalMinutes}, ()=>{
            console.log("component mounted, state updated: ",this.state.timerInterval)
            this.startTimer();
        })
        
    }

    startTimer = () => {
        let timer = this.state.timerInterval*60000         //convert minutes to milliseconds
        console.log(`timer: ${timer}`)
        if (typeof timer === "number") {   //makes sure timer is a number
            console.log("is number")
            this.setState({timerRunning: true, timerIntervalMS: timer}, function(){
                this.timerHandler()
                console.log("timer is running")
            })
        }
        
    }

    timerHandler = () => {
        setInterval(this.runAPIs(),this.state.timerIntervalMS)  //starts the API pulls
    }

   //this fires off the API get routines and loads the data into state
    runAPIs = () => {
        API.getCurrentOpenWeather().then( results => {
            console.log("currentOpen",results.data)
            let newWeather = {...this.state.weather}
            newWeather.current=results.data
            this.setState({weather: newWeather}, ()=>{console.log("state updated with current weather", this.state.weather.current)})
        }).catch(err=>{
            if (err) throw err;
        })

        API.getForecastedOpenWeather().then( results => {
            console.log("forecastOpen",results.data)
            let newWeather = { ...this.state.weather }
            newWeather.forecast = results.data.list;
            this.setState({ weather: newWeather }, () => { console.log("state updated with forecasted weather", this.state.weather.forecast) })
        }).catch(err=>{
            if (err) throw err;
        })
    }

    render() {
        return (
            <Row>

                { this.state.weather.current.main ? 
                    ( <TopRow 
                     weather={this.state.weather.current} /> ) : null }
                { this.state.weather.forecast ? 
                    ( <Forecast 
                    weather={this.state.weather.forecast} /> ) : null }
            </Row>
        );
    }
}

export default CurrentWeather;