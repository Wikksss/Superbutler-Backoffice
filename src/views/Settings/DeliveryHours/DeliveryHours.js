import React, { Component } from 'react';
import moment from 'moment';
import 'rc-time-picker/assets/index.css';
import TimePicker from 'rc-time-picker';
import { AvForm, AvInput } from 'availity-reactstrap-validation';
import { FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import * as EnterpriseSettingService from '../../../service/EnterpriseSetting';
import Config from '../../../helpers/Config';
import * as Utilities from '../../../helpers/Utilities';
import Loader from 'react-loader-spinner';
import Labels from '../../../containers/language/labels';

const format = 'h:mm a';
class DeliveryHours extends Component {

    constructor(props) {
        super(props);

        this.state = {
            Days: [
                { Id: 7, Day: 'Sunday', OpeningTime: "", ClosingTime: "", WorkingOpeningTime: "", WorkingClosingTime: "", DisabledHours: [], IsSelected: false },
                { Id: 1, Day: 'Monday', OpeningTime: "", ClosingTime: "", WorkingOpeningTime: "", WorkingClosingTime: "", DisabledHours: [], IsSelected: false },
                { Id: 2, Day: 'Tuesday', OpeningTime: "", ClosingTime: "", WorkingOpeningTime: "", WorkingClosingTime: "", DisabledHours: [], IsSelected: false },
                { Id: 3, Day: 'Wednesday', OpeningTime: "", ClosingTime: "", WorkingOpeningTime: "", WorkingClosingTime: "", DisabledHours: [], IsSelected: false },
                { Id: 4, Day: 'Thursday', OpeningTime: "", ClosingTime: "", WorkingOpeningTime: "", WorkingClosingTime: "", DisabledHours: [], IsSelected: false },
                { Id: 5, Day: 'Friday', OpeningTime: "", ClosingTime: "", WorkingOpeningTime: "", WorkingClosingTime: "", DisabledHours: [], IsSelected: false },
                { Id: 6, Day: 'Saturday', OpeningTime: "", ClosingTime: "", WorkingOpeningTime: "", WorkingClosingTime: "", DisabledHours: [], IsSelected: false },

            ],
            IsDataFetched: false,
            ShowLoader: true,
            CheckAll: false,
            WrongTimeError: false,
            IsSave:false,
            ModelHeaderTitle: 'Action Required',
            ValidTimeModal: false,
            IsValidCsv: true,

        };


        this.ApplyToAll = this.ApplyToAll.bind(this);
        this.GetEnterpriseDeliveryHour = this.GetEnterpriseDeliveryHour.bind(this);
        this.SaveDeliveryHour = this.SaveDeliveryHour.bind(this);

    }

    // #region api calling

    UpdateValidDeliveryHour () {

        if(this.state.IsSave) return;
        this.setState({IsSave:true})

        let weekDays = this.state.Days;
      
        let enterpriseSetting = EnterpriseSettingService.EnterpriseSettings;

        enterpriseSetting.DeliveryHoursCsv = "";
        enterpriseSetting.WorkingHoursCsv = "";
        enterpriseSetting.UpdateItemTiming = false;
        
        weekDays.forEach(day => {

            if (day.IsSelected && day.WorkingOpeningTime !=="") {
               
                if(((parseInt(day.OpeningTime.replace(':',''))) <= parseInt(day.WorkingOpeningTime.replace(':','')))){
                    day.OpeningTime = (moment(day.WorkingOpeningTime, 'HH:mm').add(15, 'minutes')).format("HH:mm").toString();
                }

                if((parseInt(day.ClosingTime.replace(':','')) >= parseInt(day.WorkingClosingTime.replace(':','')))){
                    day.ClosingTime = (moment(day.WorkingClosingTime, 'HH:mm').add(-15, 'minutes')).format("HH:mm").toString();
                }

                    enterpriseSetting.DeliveryHoursCsv += day.Id + "|" + day.OpeningTime + "~" + day.ClosingTime + Config.Setting.csvSeperator

            }

        });
        enterpriseSetting.DeliveryHoursCsv = Utilities.FormatCsv(enterpriseSetting.DeliveryHoursCsv, Config.Setting.csvSeperator);

        //Saving

        if (enterpriseSetting.DeliveryHoursCsv !== "") {
            this.SaveDeliveryHourApi(enterpriseSetting);
        } else{
            this.setState({IsSave:false});
        }

    }

    SaveDeliveryHourApi = async (enterpriseSetting) => {

        let message = await EnterpriseSettingService.SaveDeliveryOrWoringHours(enterpriseSetting);
        this.setState({IsSave:false, ValidTimeModal: false})
        if (message === "1")
            Utilities.notify("Updated successfully.","s");
        else
            Utilities.notify("Update failed.","e");
    }

    SaveDeliveryHour() {
        if(this.state.IsSave) return;
        this.setState({IsSave:true, IsValidCsv:true})
        let weekDays = this.state.Days;
      
        let enterpriseSetting = EnterpriseSettingService.EnterpriseSettings;

        enterpriseSetting.DeliveryHoursCsv = "";
        enterpriseSetting.WorkingHoursCsv = "";
        enterpriseSetting.UpdateItemTiming = false;
        let isTimeValid = this.IsDeliveryHoursValid();

        if(!isTimeValid){
            this.setState({WrongTimeError: true})
            this.setState({IsSave:false})
            return;
        }
        enterpriseSetting.DeliveryHoursCsv = Utilities.FormatCsv(enterpriseSetting.DeliveryHoursCsv, Config.Setting.csvSeperator);

        //Saving

        if (enterpriseSetting.DeliveryHoursCsv !== "") {
            this.SaveDeliveryHourApi(enterpriseSetting);
        } else {
            this.setState({IsSave:false});
            this.setState({IsValidCsv:false});

        }

    }


    GetEnterpriseWorkingHour = async () => {

        let data = await EnterpriseSettingService.GetWorkingHour();
        //let workingHours = data.split('^^^');
        this.GetEnterpriseDeliveryHour(data);

    }


    GetEnterpriseDeliveryHour = async (workingHoursCsv) => {

        let data = await EnterpriseSettingService.GetDeliveryHour();
        this.setState({ ShowLoader: false });

        // if (data.length !== 0) {
            let deliveryHours = data.length > 0 ?  data.split('^^^') : [];
            let workingHours = workingHoursCsv.split('^^^');
            let checkAll = true;
            let weekDays = this.state.Days;
            let disabledHours = [];
            // let disabledMin = [];
            weekDays.forEach(day => {

                var rowId = "-1";
                let deliveryDay;
                let workingDay;
                let isAdvWorkingHours = false;
                for (var i = 0, j = deliveryHours.length; i < j; i++) {

                    deliveryDay =  deliveryHours[i] != undefined? deliveryHours[i].split('|') : '';

                        if (Number(deliveryDay[0]) === day.Id) {
                        rowId = i;
                        break;
                    }
                }

                if (rowId !== "-1") {

                    if(deliveryDay != '') {
                    day.IsSelected = true;
                    day.OpeningTime = deliveryDay[1].split('~')[0]
                    day.ClosingTime = deliveryDay[1].split('~')[1]
                    }
                    
                } else {
                    checkAll = false;
                }

                for (var i = 0, j = workingHours.length; i < j; i++) {

                    if (workingHours[i] != undefined && workingHours[i].toUpperCase().indexOf('|[') !== -1) {
                        let advHours =  workingHours[i].split('|[');
                        let advHourObj = advHours[1].replace(']', '').split(',')
                        let WorkingOpeningHours = advHourObj[0].split('|')[1].split('~')[0]
                        let WorkingClosingHours = advHourObj[advHourObj.length - 1].split('|')[1].split('~')[1]
                        let hours = `${advHours[0]}|${WorkingOpeningHours}~${WorkingClosingHours}`;
                        workingDay = hours.split('|');
                    }
                    else{
                        workingDay = workingHours[i] != undefined? workingHours[i].split('|') : '';
                    }
                        if (Number(workingDay[0]) === day.Id) {
                        rowId = i;
                        break;
                    }
                }

                if (rowId !== "-1") {

                    if(workingDay != '') {
            
                        day.WorkingOpeningTime = workingDay[1].split('~')[0]
                        day.WorkingClosingTime = workingDay[1].split('~')[1]
                        
                        day.IsFollowingDay = (parseInt(day.WorkingOpeningTime.replace(':','')) >  parseInt(day.WorkingClosingTime.replace(':','')))
                        
                        if(day.OpeningTime === "") {
                            day.OpeningTime = (moment(day.WorkingOpeningTime, 'HH:mm').add(15, 'minutes')).format("HH:mm").toString();
                            day.ClosingTime = (moment(day.WorkingClosingTime, 'HH:mm').add(-15, 'minutes')).format("HH:mm").toString();
                        }
                        var workingOpeningTime = day.WorkingOpeningTime.split(':');
                        var workingClosingTime = day.WorkingClosingTime.split(':');

                        for (var h = 0; h < 24; h++) {
                        
                            if(!(h >= parseInt(workingOpeningTime[0])) || !(h <= parseInt(workingClosingTime[0])) ){
                                disabledHours.push(h);
                            }
                        }

                        day.DisabledHours = disabledHours

                    }

                } else if(day.OpeningTime === "") {
                    day.OpeningTime = "00:00";
                    day.ClosingTime = "23:45";
                }


            })

            this.setState({ Days: weekDays, CheckAll: checkAll });


        // }
        let isTimeValid = this.IsDeliveryHoursValid();
        this.setState({ IsDataFetched: true, ValidTimeModal: !isTimeValid})
        
    }

    //#endregion

    GenerateValidTimeModalModel() {

        return (
          <Modal isOpen={this.state.ValidTimeModal} className={this.props.className}>
            <ModalHeader>{this.state.ModelHeaderTitle}</ModalHeader>
            <ModalBody className="padding-0 ">
              <AvForm>
              <div className="padding-20 scroll-model-web">
                  <FormGroup className="modal-form-group">
                    <Label className="control-label">We have noticed that your delivery hours are set to start before or after your working hours for one or more days.
                                You need to update your delivery hours now.
                    </Label>
                  </FormGroup>
                </div>
                <FormGroup className="modal-footer" >
                  <Button color="primary" onClick={() => this.UpdateValidDeliveryHour() }>
                  {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                    : <span className="comment-text">{Labels.Update}</span>}
                
                </Button> 
                </FormGroup>
              </AvForm>
            </ModalBody>
          </Modal>
    
        )
      }


    IsDeliveryHoursValid(){

        let enterpriseSetting = EnterpriseSettingService.EnterpriseSettings;
        const weekDays = this.state.Days;
        let isTimeValid = true;
        
        weekDays.forEach(day => {

            if (day.IsSelected && day.WorkingOpeningTime !== "" ) {
               
                let openingTime = parseInt(day.OpeningTime.replace(':',''));
                let closingTime =parseInt(day.ClosingTime.replace(':',''));
                let workingOpeningTime = parseInt(day.WorkingOpeningTime.replace(':',''));
                let WorkingClosingTime = parseInt(day.WorkingClosingTime.replace(':',''));

                if((openingTime <= workingOpeningTime || closingTime >= WorkingClosingTime) && ((day.IsFollowingDay && openingTime >= closingTime) || !day.IsFollowingDay) ) {
                        isTimeValid = false;
                }

                enterpriseSetting.DeliveryHoursCsv += day.Id + "|" + day.OpeningTime + "~" + day.ClosingTime + Config.Setting.csvSeperator
            }
            else if (day.IsSelected && day.WorkingOpeningTime === "") {
                     isTimeValid = false;
            }
                
        });

        return isTimeValid;
    }

    loading = () => <div className="page-laoder page-laoder-menu">
        <div className="loader-menu-inner">
            <Loader type="Oval" color="#ed0000" height={50} width={50} />
            <div className="loading-label">Loading.....</div>
        </div>
    </div>

    handleClose() {

        let weekDay = this.state.Days;

        setTimeout(
            function () {
                this.setState({ Days: [] })
                this.setState({ Days: weekDay })
            }
                .bind(this),
            100
        );

    }


    ApplyToAll = (e,isCheckedAllDay) => {

        let weekDays = this.state.Days;
        this.setState({ Path: this.state.Path + "1" })
        let  isChecked = isCheckedAllDay ? (e.target.value === "false"? true : false) : weekDays[0].IsSelected;
        let monday = weekDays[0];

        weekDays.forEach(day => {
            if(!isCheckedAllDay && day.WorkingOpeningTime !== "") {
            day.OpeningTime = monday.OpeningTime;
            day.ClosingTime = monday.ClosingTime;
            }

            day.IsSelected = day.WorkingOpeningTime !== "" && isChecked;
        })

        this.setState({ Days: weekDays, CheckAll: isChecked  })

    }

    AssignValues(index, timetype, value) {

        let weekDays = this.state.Days;

        switch (timetype.toUpperCase()) {

            case 'OPT':
                value = moment(value).format('HH:mm');
                weekDays[index].OpeningTime = value;
                break;

            case 'CLT':
                value = moment(value).format('HH:mm');
                weekDays[index].ClosingTime = value;
                break;

            case 'CHK':
            let isCheked = value === "false"? true : false;
            let checkAll = true;
            weekDays[index].IsSelected = isCheked;
            weekDays.forEach(day => {
        
                if(!day.IsSelected && day.WorkingOpeningTime !== "") {
                    checkAll = false
                }
            })
        
            this.setState({CheckAll : checkAll});
                break;
            default:
                break;
        }

        this.setState({ Days: weekDays, WrongTimeError:false });
        

    }


    TimePickerRender(index, time, disabledHours, type) {

        return (

            <TimePicker
                use12Hours onChange={(e) => this.AssignValues(index, type, e)} defaultValue={moment(time, 'HH:mm')} value={moment(time, 'HH:mm')}
                showSecond={false}
                className="select-time-picker"
                placeholder="Select Time"
                popupClassName="time-wraper"
                showHour={true}
                showMinute={true}
                minuteStep={15}
                format={format}
                inputReadOnly
                // disabledHours={() => disabledHours}
                hideDisabledOptions
                addon={() => (
                    <Button size="small" className="btn btn-primary" onClick={(event) => this.handleClose()}>
                        Ok
        </Button>
                )}
            />

        )
    }


    renderFirstDay(index, day) {


        return (
            <div key={index} className="daysDV applyAllDv">
                {/* <div className={"checkBoxDV"}> */}
                <div className={day.WorkingOpeningTime === "" ? "checkBoxDV disabledDiv" : "checkBoxDV"}>
                    <div className="dayLabel " >

                        <AvInput type="checkbox"  name={"chkArea_" + index} value={day.IsSelected} checked={day.IsSelected} onChange={(e) => this.AssignValues(index, "CHK", e.target.value)} className="form-checkbox" />
                        <span className="control-label">{day.Day}</span>

                    </div>
                    <div style={{ display: 'flex' }}>
                        <div className="input-field-time">
                            <label className="pickerLabel">{Labels.Opening_Time}</label>
                            {this.TimePickerRender(index, day.OpeningTime,day.DisabledHours, "OPT")}
                        </div>

                        <div className="input-field-time">
                            <label className="pickerLabel">{Labels.Closing_Time}</label>
                            {this.TimePickerRender(index, day.ClosingTime, day.DisabledHours, "CLT")}
                        </div>
                    </div>
                </div>
                <div className="dayLabel applyAllLabel" onClick={(e) => this.ApplyToAll(e)}>
                    <div className="btn btn-primary"><i className="fa fa-arrow-down" aria-hidden="true"></i> {Labels.Apply_To_All}</div>

                </div>
            </div>

        )

    }

    renderOtherDays(index, day) {

        //let weekDay = this.state.Days;

        return (

            <div className="daysDV">
                {/* <div className={"checkBoxDV"}> */}
                <div className={day.WorkingOpeningTime === "" ? "checkBoxDV disabledDiv" : "checkBoxDV"}>
                    <div className="dayLabel">
                        {/* <input className="form-checkbox" type="checkbox" /> */}
                        <AvInput type="checkbox" name={"chkArea_" + index} value={day.IsSelected} checked={day.IsSelected} onChange={(e) => this.AssignValues(index, "CHK", e.target.value)} className="form-checkbox" />
                        <span className="control-label">{day.Day}</span>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <div className="input-field-time">
                            <label className="pickerLabel">{Labels.Opening_Time}</label>
                            {this.TimePickerRender(index, day.OpeningTime, day.DisabledHours, "OPT")}
                        </div>
                        <div className="input-field-time">
                            <label className="pickerLabel">{Labels.Closing_Time}</label>
                            {this.TimePickerRender(index, day.ClosingTime,day.DisabledHours, "CLT")}
                        </div>
                    </div>
                </div>

            </div>
        )
    }

    renderData(weekDay) {

        if (this.state.ShowLoader === true) {
            return this.loading()
        }
        let IsDataFetched = this.state.IsDataFetched;

        if (!IsDataFetched) {
            return;
        }

        let htmlTime = [];
        for (var i = 0; i < weekDay.length; i++) {

            if (i === 0) {
                htmlTime.push(this.renderFirstDay(i, weekDay[i]));
            } else {
                htmlTime.push(this.renderOtherDays(i, weekDay[i]));
            }

        }

        return (<div>{htmlTime.map((timeHtml) => timeHtml)} </div>)
    }


    componentDidUpdate(prevProps, prevState) {
        if (prevState.Path !== this.state.Path) {

            let weekDays = this.state.Days;
            this.setState({ Days: weekDays });

        }
    }

    componentDidMount() {
        this.GetEnterpriseWorkingHour()
        

    }


    render() {
        return (

            <div className="row time-picker-main-wraper" >
                <div className="col-xs-12 col-md-12 deliveryFirstDV">
                    <div className="card">
                    <div className=" card-new-title">   <h3 className="card-title">{Labels.Delivery_Hours}</h3>
                                </div>
                        <div className="card-body">

                            <AvForm onValidSubmit={this.SaveDeliveryHour}>


                            
                                <div className="col-xs-12 col-sm-3  checkDiv" style={{    padding: '0px',marginTop: '5px'}}>
                                                     <input type="checkbox"  onChange={(e) => this.ApplyToAll(e,true)}  name="All Days" className="form-checkbox" value={this.state.CheckAll}  checked={this.state.CheckAll}/>
                                                      <Label htmlFor="All Days" className="modal-label-head">{Labels.All_Days}</Label>
                                                      </div>
                                {this.renderData(this.state.Days)}

                                <div className="form-horizontal" style={{ marginBottom: 20 }}>
                                    <div className="bottomBtnsDiv" style={{marginTop:30,alignItems: 'center', justifyContent: 'flex-start'}}>
                                        {/* <Button color="secondary" style={{marginRight:10}}>Cancel</Button>	 */}
                                        <Button color="primary"  style={{width:'61px', marginRight:10}}>
  
                                                {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                                                : <span className="comment-text">{Labels.Save}</span>}

                                        </Button>
                                        {this.state.WrongTimeError ? <div className="error " style={{margin: 0}} >Delivery hours cannot start earlier or after than Working Hours. Please check your Working Hours before and after setting hours for delivery.</div> : ''}
                                        {!this.state.IsValidCsv ? <div className="error " style={{margin: 0}} >Please select at-least one delivery day for delivery hours.</div> : ''}
                               

                                    </div>
                                    
                                </div>

                            </AvForm>
                        </div>

                    </div>
                </div>
                {this.GenerateValidTimeModalModel()}
            </div>
        );
    }

}


export default DeliveryHours;
