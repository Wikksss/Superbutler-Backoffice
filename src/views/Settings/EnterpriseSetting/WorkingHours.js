import React, { Component, Fragment } from 'react';
import { FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader, Table, Alert } from 'reactstrap';
import * as EnterpriseSettingService from '../../../service/EnterpriseSetting';
import * as Utilities from '../../../helpers/Utilities';
import Constants from '../../../helpers/Constants';
import Config from '../../../helpers/Config';
import { AvForm, AvField, AvInput } from 'availity-reactstrap-validation';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import 'rc-time-picker/assets/index.css';
import TimePicker from 'rc-time-picker';
import Loader from 'react-loader-spinner';
import moment from 'moment';
import Labels from '../../../containers/language/labels';
import {SetMenuStatus} from '../../../containers/DefaultLayout/DefaultHeader'
const format = 'h:mm a';

class WorkingHours extends Component {
    constructor(props) {
        super(props);

        this.state = {
            WorkingHoursInfo: false,
            workingHoursData: this.props != undefined && this.props.enterpriseInfo != undefined ?  this.props.enterpriseInfo : {},
            Days: [
              { DayId: 7, Day: 'Sunday', OpeningTime: "00:00", ClosingTime: "00:00", Breakfast: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Brunch: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Lunch: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, HiTea: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Dinner: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, IsSelected: false, IsAdvSelected: false },
              { DayId: 1, Day: 'Monday', OpeningTime: "00:00", ClosingTime: "00:00", Breakfast: { OpeningTime: "00:30", ClosingTime: "04:00", IsChecked: false }, Brunch: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Lunch: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, HiTea: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Dinner: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, IsSelected: false, IsAdvSelected: false },
              { DayId: 2, Day: 'Tuesday', OpeningTime: "00:00", ClosingTime: "00:00", Breakfast: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Brunch: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Lunch: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, HiTea: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Dinner: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, IsSelected: false, IsAdvSelected: false },
              { DayId: 3, Day: 'Wednesday', OpeningTime: "00:00", ClosingTime: "00:00", Breakfast: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Brunch: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Lunch: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, HiTea: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Dinner: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, IsSelected: false, IsAdvSelected: false },
              { DayId: 4, Day: 'Thursday', OpeningTime: "00:00", ClosingTime: "00:00", Breakfast: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Brunch: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Lunch: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, HiTea: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Dinner: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, IsSelected: false, IsAdvSelected: false },
              { DayId: 5, Day: 'Friday', OpeningTime: "00:00", ClosingTime: "00:00", Breakfast: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Brunch: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Lunch: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, HiTea: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Dinner: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, IsSelected: false, IsAdvSelected: false },
              { DayId: 6, Day: 'Saturday', OpeningTime: "00:00", ClosingTime: "00:00", Breakfast: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Brunch: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Lunch: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, HiTea: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Dinner: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, IsSelected: false, IsAdvSelected: false },
          ],
          WorkingHoursCsv: "",
          CheckAll: false,
          UpdateItemTiming: true,
          IsValidCsv: true,
          isSaving: false,
          isError: false,
          errorMessage:'',
          date: moment().format('YYYY-MM-DD')
          };
    }
    componentDidMount() {
      this.SetNormalWorkingHours()
    }



    SetNormalWorkingHours() {

      let workingHours = this.state.workingHoursData.WorkingHours.split(Config.Setting.csvSeperator);
      // let deliveryHours = deliveryHoursCsv.split('^^^')
      let weekDays = this.state.Days;
      let checkAll = true;
      weekDays.forEach(day => {

          var rowId = "-1";
          let workingDay;
          let deliveryDay;

          for (var i = 0, j = workingHours.length; i < j; i++) {

              workingDay = workingHours[i].split('|')
              // deliveryDay = deliveryHours[i] != undefined? deliveryHours[i].split('|') : '';
              
              if (Number(workingDay[0]) === day.DayId) {
                  rowId = i;
                  break;
              }
          }


          if (rowId !== "-1") {

              day.IsSelected = true;
              day.OpeningTime = workingDay[1].split('~')[0]
              day.ClosingTime = workingDay[1].split('~')[1]

          } else 
              checkAll = day.IsSelected = false;
              
      })

      this.setState({ Days: weekDays, CheckAll: checkAll });

  }

    GenerateWorkingHourCSV(){
            
      let weekDays = this.state.Days;
      let enterpriseSetting = EnterpriseSettingService.EnterpriseSettings;
      enterpriseSetting.WorkingHoursCsv = "";

          weekDays.forEach(day => {

              if (day.IsSelected) {
                  enterpriseSetting.WorkingHoursCsv += day.DayId + "|" + day.OpeningTime + "~" + day.ClosingTime + Config.Setting.csvSeperator
              }

          })


      enterpriseSetting.WorkingHoursCsv = Utilities.FormatCsv(enterpriseSetting.WorkingHoursCsv, Config.Setting.csvSeperator);

}

    WorkingHoursModal() {
        this.setState({
            WorkingHoursInfo: !this.state.WorkingHoursInfo,
        })
    }


    AssignValues(index, timetype, value) {
      this.setState({ isError: false })
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
          
                  if(!day.IsSelected) {
                      checkAll = false
                  }
              })
          
              this.setState({CheckAll : checkAll});
              break;
              default:
              break;
      }


      this.setState({ Days: weekDays });

  }

  ApplyToAll = (e,isCheckedAllDay) => {

    let weekDays = this.state.Days;
    this.setState({ Path: this.state.Path + "1", isError: false });
    let firstDay =  weekDays[0];
    let isChecked = isCheckedAllDay ? (e.target.value === "false"? true : false) : firstDay.IsSelected
    weekDays.forEach(day => {
       
        if(!isCheckedAllDay) {
        day.OpeningTime = firstDay.OpeningTime;
        day.ClosingTime = firstDay.ClosingTime;
        }
        day.IsSelected = isChecked;
    })

    this.setState({ Days: weekDays, CheckAll: isChecked })
}

// UpdateItemTiming(value) {

// this.setState({UpdateItemTiming: value === "false" ? true : false});

// }

  handleClose() {

    let weekDay = this.state.Days;

    setTimeout(
        function () {

            this.setState({ Days: [] });
            this.setState({ Days: weekDay });
        }
            .bind(this),
        0
    );

}

    TimePickerRender(index, time, type) {

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
        <div className="daysDV applyAllDv" key={'dv'+index}>
          <AvForm>
            <div className="checkBoxDV mb-3 d-flex align-items-center flex-wrap flex-md-nowrap">
                <div className="dayLabel d-flex align-items-center mb-3">

                    <AvInput type="checkbox" name={"chkArea_" + index} value={day.IsSelected} checked={day.IsSelected} onChange={(e) => this.AssignValues(index, "CHK", e.target.value)} className="form-checkbox mt-0" />
                    <span className="control-label ">{day.Day}</span>

                </div>
                <div className='m-res-0 dv-mar' style={{ display: 'flex',}}>
                    <div className="input-field-time">
                        <label className="pickerLabel">Opening Time</label>
                        {this.TimePickerRender(index, day.OpeningTime, "OPT")}
                    </div>

                    <div className="input-field-time">
                        <label className="pickerLabel">Closing Time</label>
                        {this.TimePickerRender(index, day.ClosingTime, "CLT")}
                    </div>
                    <div className="dayLabel applyAllLabel " onClick={(e) => this.ApplyToAll(e,false)}>
                        <div className="btn btn-primary"><i className="fa fa-arrow-down" aria-hidden="true"></i>Apply to all</div>

                      </div>
                </div>
            </div>
           
            </AvForm>
        </div>

    )

}

renderOtherDays(index, day) {

  // let weekDay = this.state.Days;

  return (

      <div className="daysDV"  key={'dv'+index}>
        <AvForm>
          <div className="checkBoxDV mb-3 d-flex align-items-center flex-wrap">
              <div className="dayLabel d-flex align-items-center mb-3" style={{flexBasis:"21%"}}>
                  {/* <input className="form-checkbox" type="checkbox" /> */}
                  <AvInput type="checkbox" name={"chkArea_" + index} value={day.IsSelected} checked={day.IsSelected} onChange={(e) => this.AssignValues(index, "CHK", e.target.value)} className="form-checkbox mt-0" />
                  <span className="control-label ">{day.Day}</span>
              </div>
              <div style={{ display: 'flex', }}>
                  <div className="input-field-time">
                      <label className="pickerLabel">Opening Time</label>
                      {this.TimePickerRender(index, day.OpeningTime, "OPT")}
                  </div>
                  <div className="input-field-time">
                      <label className="pickerLabel">Closing Time</label>
                      {this.TimePickerRender(index, day.ClosingTime, "CLT")}
                  </div>
              </div>
          </div>
          </AvForm>
      </div>
  )
}

  renderData(weekDay) {


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



IsWorkingHoursValid() {

  let enterpriseSetting = EnterpriseSettingService.EnterpriseSettings;
  const weekDays = this.state.Days;
  let isTimeValid = true;
  
  weekDays.forEach(day => {

      if( (day.IsAdvSelected || day.IsSelected) && day.DeliveryOpeningTime !== undefined){

          let openingTime = parseInt(day.OpeningTime.replace(':',''));
          let closingTime =parseInt(day.ClosingTime.replace(':',''));
          let deliveryOpeningTime = parseInt(day.DeliveryOpeningTime.replace(':',''));
          let deliveryClosingTime = parseInt(day.DeliveryClosingTime.replace(':',''));
          let isFollowingDay = openingTime > closingTime;

          if((openingTime >= deliveryOpeningTime) || (closingTime <= deliveryClosingTime) && ((isFollowingDay && deliveryOpeningTime >= deliveryClosingTime) || !isFollowingDay)  ){
              
                  isTimeValid = false;
          }

      }  else if( !day.IsAdvSelected && !day.IsSelected && day.DeliveryOpeningTime !== undefined) {
                  isTimeValid = false;
      }

  });

  return isTimeValid;
}


SaveHoursWithValidDeliveryHours(){
  this.setState({IsValidCsv:true, isSaving: true});
  this.GenerateWorkingHourCSV();
  let enterpriseSetting = EnterpriseSettingService.EnterpriseSettings;
  if (enterpriseSetting.WorkingHoursCsv === "") {
      this.setState({IsValidCsv:false, isSaving: false, isError: true, errorMessage:'Please select working days'});
      return;
  }


  let isTimeValid = this.IsWorkingHoursValid();

  if(isTimeValid)
  {
      this.SaveWorkingHour(false);
  } else {
      this.setState({ValidTimeModal: true, isError: true, errorMessage:'Working hours not valid',  isSaving: false})
      
  }

}

SaveWorkingHour(isDeliveryHourSaved) {
  if(this.state.IsSave) return;
  this.setState({IsSave:true})

  let weekDays = this.state.Days;

  let enterpriseSetting = EnterpriseSettingService.EnterpriseSettings;

  enterpriseSetting.WorkingHoursCsv = "";
  enterpriseSetting.DeliveryHoursCsv = "";
  enterpriseSetting.UpdateItemTiming = this.state.UpdateItemTiming;

  this.GenerateWorkingHourCSV();

  if (enterpriseSetting.WorkingHoursCsv !== "") {
      this.SaveWorkingHourApi(enterpriseSetting);
  } else {
      this.setState({IsSave:false, isSaving: false, isError: true, errorMessage:'Working hours not valid', IsValidCsv:false});
      // this.setState({IsValidCsv:false});

  }

}

SaveWorkingHourApi = async (enterpriseSetting) => {
  let message = await EnterpriseSettingService.SaveDeliveryOrWoringHours(enterpriseSetting);
  this.setState({IsSave:false, ValidTimeModal: false})
  if (message === '1'){
      this.setState({ WorkingHoursInfo: false, isSaving: false })
      this.props.GetEnterpriseSetting()
      this.props.GetEnterpriseHealth()
      Utilities.notify("Updated successfully.","s"); // Change message on conditon.
      SetMenuStatus(true);
  }
  else{
      this.setState({ WorkingHoursInfo: false, isSaving: false })
      Utilities.notify("Update failed.","e");}
}



    render() {
        const enterpriseDataLength = Object.keys(this.state.workingHoursData).length > 0
        return (
            <div className='card-body mx-0'>
                <div class="row">
                <div className="w-100 m-3 mb-5 p-4" style={{ boxShadow: "0 0 5px #00000030" }}>
                    <div class="col-md-12 text-sizes px-0">
                        <div className="d-flex justify-content-baseline align-items-center" style={{ marginBottom: "25px" }}>
                            <h5>Working Hours</h5>
                            {
                              (Object.keys(this.state.workingHoursData).length > 0 && this.state.workingHoursData.WorkingHours !="") ?
                              <a class="ml-5 cursor-pointer text-primary" onClick={() => this.WorkingHoursModal()}><i class="fa fa-edit mr-1"></i>{Labels.Edit}</a>
                              :
                              <span onClick={() => this.WorkingHoursModal()} class="ml-auto add-cat-btn  flex-shrink-0 d-flex align-items-center justify-content-between">
                              <i class="fa fa-plus mr-2" aria-hidden="true"></i>
                              <span class="hide-in-responsive">Add New</span>
                            </span>
                            }
                        </div>
                        <div className='row'>
                        <div className="mb-1 col-md-12" style={{ maxWidth: "800px" }}>
                          {
                            Object.keys(this.state.workingHoursData).length > 0 && this.state.workingHoursData.WorkingHours !="" && this.state.Days.map((v,i)=>(
                                !!v.IsSelected &&
                              <div className="row mb-3">
                                  <label className="col-lg-3 fw-semibold text-muted mb-0" >{v.Day}</label>
                                  <div className="col-lg-8">
                                      <span className="fw-bold fs-6 text-gray-800">{moment(this.state.date + ' ' + v.OpeningTime).format('hh:mm A') + " - " + moment(this.state.date + ' ' + v.ClosingTime).format('hh:mm A')}</span>
                                  </div>
                              </div>
                            ))
                          }

                        </div>
                        </div>
                    </div>
                </div>
                </div>

                <Modal style={{maxWidth:"660px"}} isOpen={this.state.WorkingHoursInfo} toggle={() => this.WorkingHoursModal()} className={"modal-hidden-scroll-mobile"}>
                <ModalHeader toggle={() => this.WorkingHoursModal()} >Working Hours</ModalHeader>
                <ModalBody className='Wrkg-hrs-modal' style={{  overflowY: 'auto', overflowX: "hidden" }}>
                  <div className="daysDV Working-hr-section">
                    <div className="dayLabel d-flex align-items-center mr-2 mb-3 justify-content-between">
                      <div className='d-flex align-items-center' >
                      <input type="checkbox" onChange={(e) => this.ApplyToAll(e,true)}  name="All Days" className="form-checkbox" value={this.state.CheckAll}  checked={this.state.CheckAll} />
                      <span className="control-label">All Days</span>
                      </div>
                      {/* <div className="dayLabel applyAllLabel " onClick={(e) => this.ApplyToAll(e,false)}>
                        <div className="btn btn-primary"><i className="fa fa-arrow-down" aria-hidden="true"></i> Apply to all</div>

                      </div> */}
                    </div>
                    <div className="checkBoxDV d-flex align-items-center mb-3">
                      {this.renderData(this.state.Days)}
                    </div>
                  </div>
                </ModalBody>
                <FormGroup className="modal-footer" >
                  <div className='mr-auto'> 
                  {/* <label id="name" class="control-label mt-2 text-danger">{this.state.errorMessage}</label> */}
                  {
                    this.state.isError &&
                    <span className='text-danger'>{this.state.errorMessage}</span>
                  }
                  </div>
                  <div>
                    <Button className='mr-2 text-dark' color="secondary" onClick={() => this.WorkingHoursModal()}>{Labels.Cancel}</Button>
                    <Button color="primary" >
                    {this.state.isSaving ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span> :  
                      <span onClick={()=>this.SaveHoursWithValidDeliveryHours()} className="comment-text">{Labels.Save}</span>}
                    </Button>
                  </div>
                </FormGroup>
              </Modal>
            </div>
        );
    }
}

export default WorkingHours;
