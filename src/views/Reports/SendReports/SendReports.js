import React, { Component, Fragment } from 'react';
import * as Utilities from '../../../helpers/Utilities';
import Config from '../../../helpers/Config';
import Constants from '../../../helpers/Constants';
import * as EnterpriseOrderService from '../../../service/Orders';
import Loader from 'react-loader-spinner';
import sound from '../../../assets/sound/sound_clip.mp3'
import { Button, Badge, Modal, ModalBody, ModalFooter, ModalHeader, } from 'reactstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import Iframe from 'react-iframe'
import ProgressBar from 'react-bootstrap/ProgressBar'
import { PlayOrStop } from '../../../containers/DefaultLayout/DefaultLayout';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MUIDataTable from "mui-datatables";
import { withScriptjs, withGoogleMap, GoogleMap, Polygon, Marker, Circle } from "react-google-maps";
const $ = require("jquery");
const moment = require('moment-timezone');


var audio = new Audio(sound)
var interval;

$.DataTable = require("datatables.net");
class SendReports extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userObj: [],
            ShowLoader: true,
            SelectedDuration: 30,
            IsSave: false,
            StartDate: '',
            EndDate: '',
            ShowButtonLoader: false,
            type:'',
            value: '',
            ValidDate: false,
            isError: true, 
            errorMessage: '' 

        }


        this.state.StartDate = new Date(moment.tz(Config.Setting.timeZone).subtract(7, 'days').calendar());
        this.state.EndDate = new Date(moment.tz(Config.Setting.timeZone).format("YYYY-MM-DD"));

        if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
            let userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
            this.state.EnterpriseTypeId = userObj.Enterprise.EnterpriseTypeId;
        }
        if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.SELECTED_REPORT_ORDER_STATUS))) {
            // this.GetSelectedStatus();
        }

        if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
            this.state.userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
        }
        else {
            this.props.history.push('/login')
        }
    }

    HandleDateChange = (date, isEndDate) => {

        let isDateValid = true;
        this.setState({ isError: false })
        if (isEndDate) {

            isDateValid = moment(date).format("YYYY-MM-DD") > moment(this.state.StartDate).format("YYYY-MM-DD")
            this.setState({ EndDate: date, ValidDate: isDateValid });
        }
        else {

            if (this.state.EndDate !== "") {
                isDateValid = moment(date).format("YYYY-MM-DD") < moment(this.state.EndDate).format("YYYY-MM-DD")
            }
            this.setState({ StartDate: date, ValidDate: isDateValid });
        }


    };

    componentDidMount() {
        // This method is called when the component is first added to the document


    }

    componentWillUnmount() {
    }


    SetDateFormat(orderDate, status) {

        //var date = orderDate

        if (Number(status) == 0 || Number(status) == 1 || Number(status) == 2) {

            var date = moment(orderDate).format('YYYY-MM-DD');
            // var today = moment(new Date()).format('YYYY-MM-DD');
            var today = new Date(moment.tz(Config.Setting.timeZone).format("YYYY-MM-DD"));

            if (moment(date).isSame(today, 'day')) {
                return moment(orderDate).format('h:mm a')
            }
        }

        return moment(orderDate).format('DD MMM YYYY  h:mm a')

    }


    setWaitingSince = (orderDate) => {


        orderDate = new Date(orderDate);
        var date2 = new Date(moment.tz(Config.Setting.timeZone).format("YYYY-MM-DDTHH:mm:ss"));

        var sec = date2.getTime() - orderDate.getTime();
        if (isNaN(sec)) {
            //alert("Input data is incorrect!");
            return '';
        }

        if (sec < 0) {
            //alert("The second date ocurred earlier than the first one!");
            return '0  sec ago';
        }

        var second = 1000, minute = 60 * second, hour = 60 * minute, day = 24 * hour;
        var days = 0, hours = 0, minutes = 0, seconds = 0;
        // days = Math.floor(sec / day);
        // sec -= days * day;
        hours = Math.floor(sec / hour);
        sec -= hours * hour;
        minutes = Math.floor(sec / minute);
        sec -= minutes * minute;
        seconds = Math.floor(sec / second);

        return hours + "h " + minutes + "m";
    }

    
    handleRadio = (e) =>{
        this.setState({ value:  e.target.value })
    }

    SendReports = async (type) =>{
        if(!this.state.ValidDate && type == "ORDER-SUMMARY"){
            this.setState({ isError: true, errorMessage: 'Please select a valid date' })
            return;
        }
        this.setState({ ShowButtonLoader: true, type: type })
        var sendReports = {}
        sendReports.StartDate = moment(this.state.StartDate).format('YYYY-MM-DD 00:00:00') 
        sendReports.EndDate =  moment(this.state.EndDate).format('YYYY-MM-DD  23:59:59')
        sendReports.Type = type
        var result = await EnterpriseOrderService.SendReports(sendReports)
        if(result == '1'){
            Utilities.notify("Report send successfully to your registered email.", "s");
            this.setState({ ShowButtonLoader: false, type: '' })
            return
        }
        Utilities.notify(result !='0' ? result : 'Report not sent', "e");
        this.setState({ ShowButtonLoader: false, type: '' })
    }

    loading = () => <div className="allorders-loader">
        <div className="loader-menu-inner">
            <Loader type="Oval" color="#ed0000" height={50} width={50} />
            <div className="loading-label">Loading.....</div>
        </div>
    </div>

    render() {
        return (
            <Fragment>

                <div className="card" id="orderWrapper">

                    <div className="all-order-drop-down  card-new-title p-l-r-0">
                        <h5 className="font-16 order-drop-dwon-set d-flex w-100 align-items-end flex-wrap align-items-md-center">
                            <span className="mr-5 mb-res-3">Order Summary Report</span>


                            <div className="d-flex res-date-wrap">
                                <div className="  flex-md-row d-flex align-items-center  mr-3  ">

                                    <DatePicker
                                        selected={this.state.StartDate}
                                        onChange={(date) => this.HandleDateChange(date, false)}
                                        timeIntervals={15}
                                        timeCaption="time"
                                        dateFormat="dd/MM/yyyy"
                                        className="form-control"
                                    />

                                </div>

                                <div className="flex-md-row d-flex align-items-center  mr-2">
                                    <label className=" font-14  mr-3 mb-0">To</label>

                                    <DatePicker
                                        selected={this.state.EndDate}
                                        onChange={(date) => this.HandleDateChange(date, true)}
                                        // showTimeSelect
                                        // timeFormat="HH:mm"
                                        timeIntervals={15}
                                        timeCaption="time"
                                        dateFormat="dd/MM/yyyy"
                                        className="form-control"
                                    />

                                </div>
                                <div className='d-flex align-items-center'>
                                <a className="btn btn-primary font-14 align-self-end  mr-2" style={{ color: "#fff" }} onClick={() => this.SendReports("ORDER-SUMMARY")}>{this.state.ShowButtonLoader && this.state.type =="ORDER-SUMMARY" ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span> : "Generate"}</a>
                                {
                                    this.state.isError &&
                                    <span className="text-danger font-14">{this.state.errorMessage}</span>
                                }
                                </div>
                            </div>
                        </h5>
                    </div>
                    <div className="all-order-drop-down  card-new-title p-l-r-0">
                        <h5 className="font-16 order-drop-dwon-set d-flex w-100 align-items-end flex-wrap align-items-md-center">
                            <span className="mr-5 mb-res-3 w-100" style={{maxWidth:185}}>Consumer Report</span>
                            <a className="btn btn-primary font-14 align-self-end  " style={{ color: "#fff" }} onClick={() => this.SendReports("CONSUMER")}>{this.state.ShowButtonLoader && this.state.type =="CONSUMER"? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span> : "Generate"}</a>
                        </h5>
                    </div>
                    <div className="all-order-drop-down  card-new-title p-l-r-0">
                        <h5 className="font-16 order-drop-dwon-set d-flex w-100 align-items-end flex-wrap align-items-md-center">
                            <span className="mr-5 mb-res-3 w-100" style={{maxWidth:185}}>Business Report</span>
                            <a className="btn btn-primary font-14 align-self-end  " style={{ color: "#fff" }} onClick={() => this.SendReports("RESTAURANT")}>{this.state.ShowButtonLoader && this.state.type =="RESTAURANT" ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span> : "Generate"}</a>
                        </h5>
                    </div>
                </div>
                
                {/* <div>
                    <input type="radio" id="radius" name="areaType" value="CONSUMER" checked={this.state.value == "CONSUMER" ? true : false} onChange={(e)=>this.handleRadio(e)} />
                    <span className='ml-3'>CONSUMER</span>
                </div> */}
                {/* <div>
                    <input type="radio" id="radius" name="areaType" value="ORDER-SUMMARY" checked={this.state.value == "ORDER-SUMMARY" ? true : false} onChange={(e)=>this.handleRadio(e)} />
                    <span className='ml-3'>ORDER-SUMMARY</span>
                </div>
                <div>
                    <input type="radio" id="radius" name="areaType" value="RESTAURANT" checked={this.state.value == "RESTAURANT" ? true : false} onChange={(e)=>this.handleRadio(e)} />
                    <span className='ml-3'>RESTAURANT</span>
                </div> */}
                
            </Fragment>

        );
    }
}

export default SendReports; 
