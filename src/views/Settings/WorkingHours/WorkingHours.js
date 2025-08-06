import React, { Component } from 'react';
import moment from 'moment';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import 'rc-time-picker/assets/index.css';
import TimePicker from 'rc-time-picker';
import { AvForm, AvInput, } from 'availity-reactstrap-validation';
import { FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import * as EnterpriseSettingService from '../../../service/EnterpriseSetting';
import Config from '../../../helpers/Config';
import * as Utilities from '../../../helpers/Utilities';
import Loader from 'react-loader-spinner';
import {SetMenuStatus} from '../../../containers/DefaultLayout/DefaultHeader'

const format = 'h:mm a';
//const now = moment().hour(0).minute(0);
const arrMeal = ["BREAKFAST", "BRUNCH", "LUNCH", "HITEA", "DINNER"];

class WorkingHours extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Days: [
                { DayId: 7, Day: 'Sunday', OpeningTime: "00:00", ClosingTime: "00:00", Breakfast: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Brunch: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Lunch: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, HiTea: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Dinner: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, IsSelected: false, IsAdvSelected: false },
                { DayId: 1, Day: 'Monday', OpeningTime: "00:00", ClosingTime: "00:00", Breakfast: { OpeningTime: "00:30", ClosingTime: "04:00", IsChecked: false }, Brunch: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Lunch: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, HiTea: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Dinner: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, IsSelected: false, IsAdvSelected: false },
                { DayId: 2, Day: 'Tuesday', OpeningTime: "00:00", ClosingTime: "00:00", Breakfast: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Brunch: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Lunch: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, HiTea: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Dinner: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, IsSelected: false, IsAdvSelected: false },
                { DayId: 3, Day: 'Wednesday', OpeningTime: "00:00", ClosingTime: "00:00", Breakfast: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Brunch: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Lunch: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, HiTea: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Dinner: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, IsSelected: false, IsAdvSelected: false },
                { DayId: 4, Day: 'Thursday', OpeningTime: "00:00", ClosingTime: "00:00", Breakfast: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Brunch: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Lunch: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, HiTea: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Dinner: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, IsSelected: false, IsAdvSelected: false },
                { DayId: 5, Day: 'Friday', OpeningTime: "00:00", ClosingTime: "00:00", Breakfast: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Brunch: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Lunch: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, HiTea: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Dinner: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, IsSelected: false, IsAdvSelected: false },
                { DayId: 6, Day: 'Saturday', OpeningTime: "00:00", ClosingTime: "00:00", Breakfast: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Brunch: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Lunch: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, HiTea: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, Dinner: { OpeningTime: "00:00", ClosingTime: "01:00", IsChecked: false }, IsSelected: false, IsAdvSelected: false },
            ],

            IsDataFetched: false,
            IsAdvanceHours: false,
            ActiveTab: -1,
            UpdateItemTiming: true,
            CheckAll: false,
            CheckAllAdv: false,
            IsSave:false,
            ModelHeaderTitle: 'Action Required',
            ValidTimeModal: false,
            WorkingHoursCsv: "",
            DeliveryHoursCsv: "",
            IsValidCsv: true,
        };

        this.SaveWorkingHour = this.SaveWorkingHour.bind(this);
        this.SetActiveTab = this.SetActiveTab.bind(this);
        this.SaveHoursWithValidDeliveryHours = this.SaveHoursWithValidDeliveryHours.bind(this);

    }

    // #region api calling

    SaveHoursWithValidDeliveryHours(){
        this.setState({IsValidCsv:true});
        this.GenerateWorkingHourCSV();
        let enterpriseSetting = EnterpriseSettingService.EnterpriseSettings;
        if (enterpriseSetting.WorkingHoursCsv === "") {
            this.setState({IsValidCsv:false});
            return;
        }


        let isTimeValid = this.IsWorkingHoursValid();

        if(isTimeValid)
        {
            this.SaveWorkingHour(false);
        } else {
            this.setState({ValidTimeModal: true})
            
        }

    }

   
    UpdateValidDeliveryHour () {

        if(this.state.IsSave) return;
        this.setState({IsSave:true})

        let weekDays = this.state.Days;
      
        let enterpriseSetting = EnterpriseSettingService.EnterpriseSettings;

        enterpriseSetting.DeliveryHoursCsv = "";
        enterpriseSetting.WorkingHoursCsv = "";
        enterpriseSetting.UpdateItemTiming = false;
        
        weekDays.forEach(day => {

            if ((day.IsSelected || day.IsAdvSelected) && day.DeliveryOpeningTime !== undefined) {
               
                if(((parseInt(day.OpeningTime.replace(':',''))) >= parseInt(day.DeliveryOpeningTime.replace(':','')))){
                    day.DeliveryOpeningTime = (moment(day.OpeningTime, 'HH:mm').add(15, 'minutes')).format("HH:mm").toString();
                }

                if((parseInt(day.ClosingTime.replace(':','')) <= parseInt(day.DeliveryClosingTime.replace(':','')))){
                    day.DeliveryClosingTime  = (moment(day.ClosingTime, 'HH:mm').add(-15, 'minutes')).format("HH:mm").toString();
                }

                    enterpriseSetting.DeliveryHoursCsv += day.DayId + "|" + day.DeliveryOpeningTime + "~" + day.DeliveryClosingTime + Config.Setting.csvSeperator

            }

        });
        enterpriseSetting.DeliveryHoursCsv = Utilities.FormatCsv(enterpriseSetting.DeliveryHoursCsv, Config.Setting.csvSeperator);

        //Saving

        if (enterpriseSetting.DeliveryHoursCsv !== "") {
            this.SaveDeliveryHourApi(enterpriseSetting);
        }

    }

    SaveDeliveryHourApi = async (enterpriseSetting) => {

        let message = await EnterpriseSettingService.SaveDeliveryOrWoringHours(enterpriseSetting);
        this.setState({IsSave:false})
        if (message === '1')
            this.SaveWorkingHour(true);
        else
            this.SaveWorkingHour(false);
    }

    SaveWorkingHourApi = async (enterpriseSetting,isDeliveryHourSaved) => {

        let message = await EnterpriseSettingService.SaveDeliveryOrWoringHours(enterpriseSetting);
        this.setState({IsSave:false, ValidTimeModal: false})
        if (message === '1'){
            if(this.state.UpdateItemTiming){
                SetMenuStatus(true);
            }

            Utilities.notify(isDeliveryHourSaved ? "Updated successfully." : "Updated successfully.","s"); // Change message on conditon.
        }
        else{
            Utilities.notify("Update failed.","e");}
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

        // if (Number(this.state.ActiveTab) === 0) {

        //     weekDays.forEach(day => {

        //         if (day.IsSelected) {
        //             enterpriseSetting.WorkingHoursCsv += day.DayId + "|" + day.OpeningTime + "~" + day.ClosingTime + Config.Setting.csvSeperator
        //         }

        //     })

        // } else {

        //     weekDays.forEach(day => {

        //         if (day.IsAdvSelected) {

        //             enterpriseSetting.WorkingHoursCsv += day.DayId + "|["
        //                 + (day.Breakfast.IsChecked ? (arrMeal[0] + '|' + day.Breakfast.OpeningTime + "~" + day.Breakfast.ClosingTime + ",") : "")
        //                 + (day.Brunch.IsChecked ? (arrMeal[1] + '|' + day.Brunch.OpeningTime + "~" + day.Brunch.ClosingTime + ",") : "")
        //                 + (day.Lunch.IsChecked ? (arrMeal[2] + '|' + day.Lunch.OpeningTime + "~" + day.Lunch.ClosingTime + ",") : "")
        //                 + (day.HiTea.IsChecked ? (arrMeal[3] + '|' + day.HiTea.OpeningTime + "~" + day.HiTea.ClosingTime + ",") : "")
        //                 + (day.Dinner.IsChecked ? (arrMeal[4] + '|' + day.Dinner.OpeningTime + "~" + day.Dinner.ClosingTime) : "");

        //             let lastChar = enterpriseSetting.WorkingHoursCsv.substr(-1);
        //             enterpriseSetting.WorkingHoursCsv = lastChar === ',' ? enterpriseSetting.WorkingHoursCsv.slice(0, -1) + "]" : enterpriseSetting.WorkingHoursCsv + "]";
        //             enterpriseSetting.WorkingHoursCsv += Config.Setting.csvSeperator
        //         }

        //     })

        // }


        // enterpriseSetting.WorkingHoursCsv = Utilities.FormatCsv(enterpriseSetting.WorkingHoursCsv, Config.Setting.csvSeperator);

        //Saving

        if (enterpriseSetting.WorkingHoursCsv !== "") {
            this.SaveWorkingHourApi(enterpriseSetting,isDeliveryHourSaved);
        } else {
            this.setState({IsSave:false});
            this.setState({IsValidCsv:false});

        }

    }


    GetEnterpriseDeliveryHour = async () => {

        let data = await EnterpriseSettingService.GetDeliveryHour();
        let workingHours = data.split('^^^');
        this.GetEnterpriseWorkingHour(data);

    }


    GetEnterpriseWorkingHour = async (deliveryHoursCsv) => {

        let data = await EnterpriseSettingService.GetWorkingHour();
        this.setState({WorkingHoursCsv: data, DeliveryHoursCsv: deliveryHoursCsv})
        if (data.length !== 0) {

            if (this.CheckIfAllMealExists(data, arrMeal) === true) {

                this.setState({ ActiveTab: 1 });
                this.setState({ IsAdvanceHours: true });
                this.SetAdvanceWorkingHours(data,deliveryHoursCsv);
            }
            else {
                //Working Hours Call
                this.setState({ ActiveTab: 0 });
                this.SetNormalWorkingHours(data,deliveryHoursCsv);
            }


        } else {
            this.setState({ ActiveTab: 0 });
        }

        this.setState({ IsDataFetched: true })

    }

    //#endregion

    ValidTimeModalHide(){
        this.setState({ValidTimeModal: false});
    }


    GenerateWorkingHourCSV(){
            
            let weekDays = this.state.Days;
            let enterpriseSetting = EnterpriseSettingService.EnterpriseSettings;
            enterpriseSetting.WorkingHoursCsv = "";
            enterpriseSetting.DeliveryHoursCsv = "";

            if (Number(this.state.ActiveTab) === 0) {

                weekDays.forEach(day => {
    
                    if (day.IsSelected) {
                        enterpriseSetting.WorkingHoursCsv += day.DayId + "|" + day.OpeningTime + "~" + day.ClosingTime + Config.Setting.csvSeperator
                    }
    
                })
    
            } else {
    
                weekDays.forEach(day => {
    
                    if (day.IsAdvSelected) {
    
                        enterpriseSetting.WorkingHoursCsv += day.DayId + "|["
                            + (day.Breakfast.IsChecked ? (arrMeal[0] + '|' + day.Breakfast.OpeningTime + "~" + day.Breakfast.ClosingTime + ",") : "")
                            + (day.Brunch.IsChecked ? (arrMeal[1] + '|' + day.Brunch.OpeningTime + "~" + day.Brunch.ClosingTime + ",") : "")
                            + (day.Lunch.IsChecked ? (arrMeal[2] + '|' + day.Lunch.OpeningTime + "~" + day.Lunch.ClosingTime + ",") : "")
                            + (day.HiTea.IsChecked ? (arrMeal[3] + '|' + day.HiTea.OpeningTime + "~" + day.HiTea.ClosingTime + ",") : "")
                            + (day.Dinner.IsChecked ? (arrMeal[4] + '|' + day.Dinner.OpeningTime + "~" + day.Dinner.ClosingTime) : "");
    
                        let lastChar = enterpriseSetting.WorkingHoursCsv.substr(-1);
                        enterpriseSetting.WorkingHoursCsv = lastChar === ',' ? enterpriseSetting.WorkingHoursCsv.slice(0, -1) + "]" : enterpriseSetting.WorkingHoursCsv + "]";
                        enterpriseSetting.WorkingHoursCsv += Config.Setting.csvSeperator
                    }
    
                })
    
            }
    
    
            enterpriseSetting.WorkingHoursCsv = Utilities.FormatCsv(enterpriseSetting.WorkingHoursCsv, Config.Setting.csvSeperator);
    



    }



    GenerateValidTimeModalModel() {

        return (
          <Modal isOpen={this.state.ValidTimeModal} className={this.props.className}>
            <ModalHeader>{this.state.ModelHeaderTitle}</ModalHeader>
            <ModalBody className="padding-0 ">
              <AvForm>
              <div className="padding-20 scroll-model-web">
                  <FormGroup className="modal-form-group">
                    <Label className="control-label">
                    The changes you made to Working Hours will update the Delivery Hours with a 15mins difference for both opening hours and closing hours.
                    </Label>
                  </FormGroup>
                </div>
                <FormGroup className="modal-footer" >
                <Button color="secondary" onClick={() => this.ValidTimeModalHide()}>Cancel</Button>
                  <Button color="primary" onClick={() => this.UpdateValidDeliveryHour() }>
                  {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                    : <span className="comment-text">Update</span>}
                
                </Button>

                </FormGroup>
              </AvForm>
            </ModalBody>
          </Modal>
    
        )
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



    loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

    SetNormalWorkingHours(workingHoursCsv,deliveryHoursCsv) {

        let workingHours = workingHoursCsv.split('^^^');
        let deliveryHours = deliveryHoursCsv.split('^^^')
        let weekDays = this.state.Days;
        let checkAll = true;
        weekDays.forEach(day => {

            var rowId = "-1";
            let workingDay;
            let deliveryDay;

            for (var i = 0, j = workingHours.length; i < j; i++) {

                workingDay = workingHours[i].split('|')
                deliveryDay = deliveryHours[i] != undefined? deliveryHours[i].split('|') : '';
                
                if (Number(workingDay[0]) === day.DayId) {
                    rowId = i;
                    break;
                }
            }


            if (rowId !== "-1") {

                day.IsSelected = true;
                day.OpeningTime = workingDay[1].split('~')[0]
                day.ClosingTime = workingDay[1].split('~')[1]

                if(deliveryDay != '') {
            
                    day.DeliveryOpeningTime = deliveryDay[1].split('~')[0]
                    day.DeliveryClosingTime = deliveryDay[1].split('~')[1]
                }


            } else 
                checkAll = day.IsSelected = false;
                
        })

        this.setState({ Days: weekDays, CheckAll: checkAll });

    }

    SetAdvanceWorkingHours(workingHoursCsv,deliveryHoursCsv) {

        let workingHours = workingHoursCsv.split('^^^');
        let deliveryHours = deliveryHoursCsv.split('^^^');

        let weekDays = this.state.Days;
        let checkAllAdv = true;
        weekDays.forEach(day => {

            var rowId = "-1";
            let workingDay;
            let deliveryDay;
            
            for (var k = 0, j = workingHours.length; k < j; k++) {
            
                workingDay = workingHours[k].split('|[')
                deliveryDay = deliveryHours[k] != undefined? deliveryHours[k].split('|') : '';
                if (Number(workingDay[0]) === day.DayId) {
                    rowId = k;
                    break;
                }
            }


            if (rowId !== "-1") {


                if(deliveryDay != '') {
            
                    day.DeliveryOpeningTime = deliveryDay[1].split('~')[0];
                    day.DeliveryClosingTime = deliveryDay[1].split('~')[1];
               
                }


                day.IsAdvSelected = true;
                let arrdayAndHours = workingDay[1].replace(']', '')
                let hoursCsv = arrdayAndHours.split(',');
                
                day.OpeningTime = hoursCsv[0].split('|')[1].split('~')[0];
                day.ClosingTime = hoursCsv[hoursCsv.length - 1].split('|')[1].split('~')[1];
                
                for (var i = 0, l = hoursCsv.length; i < l; i++) {

                    let arr = hoursCsv[i].split('|');
                    let arrmeal = arr[0];
                    let arrTime = arr[1];

                    switch (arrmeal) {
                        case arrMeal[0]:
                            day.Breakfast.OpeningTime = arrTime.split('~')[0]
                            day.Breakfast.ClosingTime = arrTime.split('~')[1]
                            day.Breakfast.IsChecked = true;
                            break;
                        case arrMeal[1]:
                            day.Brunch.OpeningTime = arrTime.split('~')[0]
                            day.Brunch.ClosingTime = arrTime.split('~')[1]
                            day.Brunch.IsChecked = true;
                            break;
                        case arrMeal[2]:
                            day.Lunch.OpeningTime = arrTime.split('~')[0]
                            day.Lunch.ClosingTime = arrTime.split('~')[1]
                            day.Lunch.IsChecked = true;
                            break;
                        case arrMeal[3]:
                            day.HiTea.OpeningTime = arrTime.split('~')[0]
                            day.HiTea.ClosingTime = arrTime.split('~')[1]
                            day.HiTea.IsChecked = true;
                            break;
                        case arrMeal[4]:
                            day.Dinner.OpeningTime = arrTime.split('~')[0]
                            day.Dinner.ClosingTime = arrTime.split('~')[1]
                            day.Dinner.IsChecked = true;
                            break;
                        default:
                            break;

                    }

                }

            } else {
                checkAllAdv = false;
            }
        })

        this.setState({ Days: weekDays, CheckAllAdv: checkAllAdv });

    }

    CheckIfAllMealExists(workingHoursCsv, arrMeal) {
        var flag = true;
        for (var i = 0; i < arrMeal.length; i++) {
            if (workingHoursCsv.indexOf(arrMeal[i]) !== -1) {
                flag = true;
                return flag;
            } else {
                flag = false;
            }
        }
        return flag;
    }


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


    handleOpenChange(index) {

        this.state.Days[0].Status.OpeningTime = true;
    }


    ApplyToAllAdv = (e,isCheckedAllDay) => {

        let weekDays = this.state.Days;
        this.setState({ Path: this.state.Path + "1" })
        let isChecked = isCheckedAllDay ? (e.target.value === "false"? true : false) : weekDays[0].IsAdvSelected;
        let firstDay = weekDays[0];
        weekDays.forEach(day => {

            day.IsAdvSelected = isChecked;

            if(!isCheckedAllDay) {

            day.Breakfast.OpeningTime = firstDay.Breakfast.OpeningTime;
            day.Breakfast.ClosingTime = firstDay.Breakfast.ClosingTime;
            day.Breakfast.IsChecked = firstDay.Breakfast.IsChecked;

            day.Brunch.OpeningTime = firstDay.Brunch.OpeningTime;
            day.Brunch.ClosingTime = firstDay.Brunch.ClosingTime;
            day.Brunch.IsChecked = firstDay.Brunch.IsChecked;

            day.Lunch.OpeningTime = firstDay.Lunch.OpeningTime;
            day.Lunch.ClosingTime = firstDay.Lunch.ClosingTime;
            day.Lunch.IsChecked = firstDay.Lunch.IsChecked;

            day.HiTea.OpeningTime = firstDay.HiTea.OpeningTime;
            day.HiTea.ClosingTime = firstDay.HiTea.ClosingTime;
            day.HiTea.IsChecked = firstDay.HiTea.IsChecked;

            day.Dinner.OpeningTime = firstDay.Dinner.OpeningTime;
            day.Dinner.ClosingTime = firstDay.Dinner.ClosingTime;
            day.Dinner.IsChecked = firstDay.Dinner.IsChecked;
            }
        })

        this.setState({ Days: weekDays, CheckAllAdv: isChecked })

        // setTimeout(
        //     function () {
        //         this.setState({ Days: [] })
        //         this.setState({ Days: weekDays, CheckAllAdv: isChecked })
        //     }
        //         .bind(this),
        //     100
        // );

    }


    ApplyToAll = (e,isCheckedAllDay) => {

        let weekDays = this.state.Days;
        this.setState({ Path: this.state.Path + "1" });
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

        // setTimeout(
        //     function () {
        //         this.setState({ Days: [] })
        //         this.setState({ Days: weekDays, CheckAll: isChecked })
        //     }
        //         .bind(this),
        //     100
        // );

    }

    UpdateItemTiming(value) {

    this.setState({UpdateItemTiming: value === "false" ? true : false});

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
            
                    if(!day.IsSelected) {
                        checkAll = false
                    }
                })
            
                this.setState({CheckAll : checkAll});
                break;
           
            // Assigning value For Advance working hours.

            //BREAKFAST 

            case 'ADV_CHK':
            let isAdvCheked = value === "false"? true : false;
            let checkAllAdv = true;
            weekDays[index].IsAdvSelected = isAdvCheked;
            weekDays.forEach(day => {
        
                if(!day.IsAdvSelected) {
                    checkAllAdv = false
                }
            })
        
                this.setState({CheckAllAdv : checkAllAdv});
                break;

            case 'BRF_CHK':
                weekDays[index].Breakfast.IsChecked = value === "false" ? true : false;
                break;

            case 'BRF_OPT':
                value = moment(value).format('HH:mm');
                weekDays[index].Breakfast.OpeningTime = value;
                break;

            case 'BRF_CLT':
                value = moment(value).format('HH:mm');
                weekDays[index].Breakfast.ClosingTime = value;
                break;


            //BRUNCH
            case 'BRU_CHK':
                weekDays[index].Brunch.IsChecked = value === "false" ? true : false;
                break;


            case 'BRU_OPT':
                value = moment(value).format('HH:mm');
                weekDays[index].Brunch.OpeningTime = value;
                break;

            case 'BRU_CLT':
                value = moment(value).format('HH:mm');
                weekDays[index].Brunch.ClosingTime = value;
                break;



            //LUNCH
            case 'LUNCH_CHK':
                weekDays[index].Lunch.IsChecked = value === "false" ? true : false;
                break;

            case 'LUNCH_OPT':
                value = moment(value).format('HH:mm');
                weekDays[index].Lunch.OpeningTime = value;
                break;

            case 'LUNCH_CLT':
                value = moment(value).format('HH:mm');
                weekDays[index].Lunch.ClosingTime = value;
                break;


            // HI_TEA
            case 'HT_CHK':
                weekDays[index].HiTea.IsChecked = value === "false" ? true : false;
                break;

            case 'HT_OPT':
                value = moment(value).format('HH:mm');
                weekDays[index].HiTea.OpeningTime = value;
                break;

            case 'HT_CLT':
                value = moment(value).format('HH:mm');
                weekDays[index].HiTea.ClosingTime = value;
                break;


            //DINNER
            case 'DNR_CHK':
                weekDays[index].Dinner.IsChecked = value === "false" ? true : false;
                break;


            case 'DNR_OPT':
                value = moment(value).format('HH:mm');
                weekDays[index].Dinner.OpeningTime = value;
                break;

            case 'DNR_CLT':
                value = moment(value).format('HH:mm');
                weekDays[index].Dinner.ClosingTime = value;
                break;

                default:
                break;
        }

        if(weekDays[index].IsAdvSelected)
        {
            this.SetAdvHour(index);
        }

        this.setState({ Days: weekDays });

    }

    SetAdvHour(index){

        let weekDays = this.state.Days;
            
            if(weekDays[index].Breakfast.IsChecked) {
                weekDays[index].OpeningTime = weekDays[index].Breakfast.OpeningTime;
            } else if(weekDays[index].Brunch.IsChecked) {
                weekDays[index].OpeningTime = weekDays[index].Brunch.OpeningTime;
            } else if(weekDays[index].Lunch.IsChecked) {
                weekDays[index].OpeningTime = weekDays[index].Lunch.OpeningTime;
            } else if(weekDays[index].HiTea.IsChecked) {
                weekDays[index].OpeningTime = weekDays[index].HiTea.OpeningTime;
            } else if(weekDays[index].Dinner.IsChecked) {
                weekDays[index].OpeningTime = weekDays[index].Dinner.OpeningTime;
            } 
        
            if(weekDays[index].Dinner.IsChecked) {
                weekDays[index].ClosingTime = weekDays[index].Dinner.ClosingTime;
            } else if(weekDays[index].HiTea.IsChecked) {
                weekDays[index].ClosingTime = weekDays[index].HiTea.ClosingTime;
            } else if(weekDays[index].Lunch.IsChecked) {
                weekDays[index].ClosingTime = weekDays[index].Lunch.ClosingTime;
            } else if(weekDays[index].Brunch.IsChecked) {
                weekDays[index].ClosingTime = weekDays[index].Brunch.ClosingTime;
            } else if(weekDays[index].Breakfast.IsChecked) {
                weekDays[index].ClosingTime = weekDays[index].Breakfast.ClosingTime;
            }

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
                <div className="checkBoxDV">
                    <div className="dayLabel">

                        <AvInput type="checkbox" name={"chkArea_" + index} value={day.IsSelected} checked={day.IsSelected} onChange={(e) => this.AssignValues(index, "CHK", e.target.value)} className="form-checkbox" />
                        <span className="control-label">{day.Day}</span>

                    </div>
                    <div style={{ display: 'flex' }}>
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
                <div className="dayLabel applyAllLabel" onClick={(e) => this.ApplyToAll(e,false)}>
                    <div className="btn btn-primary"><i className="fa fa-arrow-down" aria-hidden="true"></i> Apply to all</div>

                </div>
            </div>

        )

    }

    renderOtherDays(index, day) {

        // let weekDay = this.state.Days;

        return (

            <div className="daysDV"  key={'dv'+index}>
                <div className="checkBoxDV">
                    <div className="dayLabel">
                        {/* <input className="form-checkbox" type="checkbox" /> */}
                        <AvInput type="checkbox" name={"chkArea_" + index} value={day.IsSelected} checked={day.IsSelected} onChange={(e) => this.AssignValues(index, "CHK", e.target.value)} className="form-checkbox" />
                        <span className="control-label">{day.Day}</span>
                    </div>
                    <div style={{ display: 'flex' }}>
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

            </div>
        )
    }

    renderData(weekDay) {

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


    renderAdvance(index, day) {

        // let weekDay = this.state.Days;

        return (

            <li className="marginBottomiCheck"  key={'li'+index}>
                <div className="display-flex-imp justify-content-between align-items-center m-b-20">
                    <div style={{ alignItems: 'center', display: 'flex' }}>
                        {/* <input type="checkbox" class="form-checkbox" id="advancCheckbox-2" required /> */}
                        <AvInput type="checkbox" name={"chk_" + day.Day} value={day.IsAdvSelected} checked={day.IsAdvSelected} onChange={(e) => this.AssignValues(index, "ADV_CHK", e.target.value)} className="form-checkbox" />
                        <label htmlFor="minimal-checkbox-2" className="control-label" style={{ marginBottom: 0 }}>{day.Day}</label>
                    </div>
                    {index === 0 ? <div className="dayLabel applyAllLabel" onClick={(e) => this.ApplyToAllAdv(e,false)}> <div className="btn btn-primary"><i className="fa fa-arrow-down" aria-hidden="true"></i> Apply to all</div></div> : ""}
                </div>
                <div className="row">
                    <div className="col-md-6 display-flex-imp marginAdvDV">
                        <div className="checkBoxAdvDV">
                            {/* <input type="checkbox" className="form-checkbox" id="breakfastSun" required /> */}
                            <AvInput type="checkbox" name={"brf_chk_" + index} value={day.Breakfast.IsChecked} checked={day.Breakfast.IsChecked} onChange={(e) => this.AssignValues(index, "BRF_CHK", e.target.value)} className="form-checkbox" />
                            <label htmlFor="breakfastSun" className="iCheckLabel">Breakfast</label>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <div className="input-field-time">
                                <label className="pickerLabel">Opening Time</label>
                                {this.TimePickerRender(index, day.Breakfast.OpeningTime, "BRF_OPT")}
                            </div>
                            <div className="input-field-time">
                                <label className="pickerLabel">Closing Time</label>
                                {this.TimePickerRender(index, day.Breakfast.ClosingTime, "BRF_CLT")}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 display-flex-imp marginAdvDV">
                        <div className="checkBoxAdvDV">
                            {/* <input type="checkbox" className="form-checkbox" id="brunchSun" required /> */}
                            <AvInput type="checkbox" name={"bru_chk_" + index} value={day.Brunch.IsChecked} checked={day.Brunch.IsChecked} onChange={(e) => this.AssignValues(index, "BRU_CHK", e.target.value)} className="form-checkbox" />
                            <label htmlFor="brunchSun" className="iCheckLabel">Brunch</label>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <div className="input-field-time">
                                <label className="pickerLabel">Opening Time</label>
                                {this.TimePickerRender(index, day.Brunch.OpeningTime, "BRU_OPT")}
                            </div>
                            <div className="input-field-time">
                                <label className="pickerLabel">Closing Time</label>
                                {this.TimePickerRender(index, day.Brunch.ClosingTime, "BRU_CLT")}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 display-flex-imp marginAdvDV">
                        <div className="checkBoxAdvDV"  >
                            {/* <input type="checkbox" className="form-checkbox" id="lunchSun" required /> */}
                            <AvInput type="checkbox" name={"lunch_chk_" + index} value={day.Lunch.IsChecked} checked={day.Lunch.IsChecked} onChange={(e) => this.AssignValues(index, "LUNCH_CHK", e.target.value)} className="form-checkbox" />
                            <label htmlFor="lunchSun" className="iCheckLabel">Lunch</label>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <div className="input-field-time">
                                <label className="pickerLabel">Opening Time</label>
                                {this.TimePickerRender(index, day.Lunch.OpeningTime, "LUNCH_OPT")}
                            </div>
                            <div className="input-field-time">
                                <label className="pickerLabel">Closing Time</label>
                                {this.TimePickerRender(index, day.Lunch.ClosingTime, "LUNCH_CLT")}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 display-flex-imp marginAdvDV">
                        <div className="checkBoxAdvDV"  >
                            {/* <input type="checkbox" className="form-checkbox" id="teaSun" required /> */}
                            <AvInput type="checkbox" name={"ht_chk_" + index} value={day.HiTea.IsChecked} checked={day.HiTea.IsChecked} onChange={(e) => this.AssignValues(index, "HT_CHK", e.target.value)} className="form-checkbox" />
                            <label htmlFor="teaSun" className="iCheckLabel">Hi-Tea</label>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <div className="input-field-time">
                                <label className="pickerLabel">Opening Time</label>
                                {this.TimePickerRender(index, day.HiTea.OpeningTime, "HT_OPT")}
                            </div>
                            <div className="input-field-time">
                                <label className="pickerLabel">Closing Time</label>
                                {this.TimePickerRender(index, day.HiTea.ClosingTime, "HT_CLT")}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 display-flex-imp marginAdvDV">
                        <div className="checkBoxAdvDV"  >
                            <AvInput type="checkbox" name={"dnr_chk_" + index} value={day.Dinner.IsChecked} checked={day.Dinner.IsChecked} onChange={(e) => this.AssignValues(index, "DNR_CHK", e.target.value)} className="form-checkbox" />
                            <label htmlFor="dinnerSun" className="iCheckLabel">Dinner</label>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <div className="input-field-time">
                                <label className="pickerLabel">Opening Time</label>
                                {this.TimePickerRender(index, day.Dinner.OpeningTime, "DNR_OPT")}
                            </div>
                            <div className="input-field-time">
                                <label className="pickerLabel">Closing Time</label>
                                {this.TimePickerRender(index, day.Dinner.ClosingTime, "DNR_CLT")}
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        )
    }

    LoadAdvanceWorkingHours(weekDay) {

        let IsDataFetched = this.state.IsDataFetched;

        if (!IsDataFetched) {
            return;
        }

        let htmlTime = [];
        for (var i = 0; i < weekDay.length; i++) {

            htmlTime.push(this.renderAdvance(i, weekDay[i]));
        }

        return (<div>{htmlTime.map((timeHtml) => timeHtml)} </div>)
    }

    SetActiveTab(activeTab) {

        this.setState({ ActiveTab: activeTab });
    }


    componentDidMount() {

        // this.GetEnterpriseWorkingHour();
        this.GetEnterpriseDeliveryHour();

    }


    render() {


        let tab = Number(this.state.ActiveTab)

        if (tab === -1) {
            return <div></div>;
        }


        return (
            <div className="row time-picker-main-wraper"  >
                <div className="col-xs-12 col-md-12">
                    <div className="card">
                    <h3 className="card-title card-new-title">Working Hours</h3>
                        <div className="card-body p-b-0">

                            <AvForm onValidSubmit={this.SaveHoursWithValidDeliveryHours}>
                                <Tabs forceRenderTabPanel defaultIndex={Number(this.state.ActiveTab)}>
                                    <TabList >
                                        <Tab key={0} onClick={(e) => this.SetActiveTab(0)}>Normal</Tab>
                                        <Tab key={1} onClick={(e) => this.SetActiveTab(1)}>Advance</Tab>
                                    </TabList>
                                    <TabPanel>

                                        <div className="deliveryFirstDV">
                                            <div className="card">
                                            <div className="col-xs-12 col-sm-3  checkDiv" style={{    padding: '0px',marginTop: '5px'}}>
                                                     <input type="checkbox"  onChange={(e) => this.ApplyToAll(e,true)}  name="All Days" className="form-checkbox" value={this.state.CheckAll}  checked={this.state.CheckAll}/>
                                                      <Label htmlFor="All Days" className="modal-label-head">All Days</Label>
                                                      </div>

                                                <div className="tab-content">
                                                    <div className="tab-pane active" id="home2" role="tabpanel">




                                                        {this.renderData(this.state.Days)}

                                                        <div className="form-horizontal" style={{ marginBottom: 20, marginRight: 20 }}>
                                                            <div className="bottomBtnsDiv">

                                                            </div>
                                                        </div>

                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                    </TabPanel>
                                    <TabPanel>
                                        <div className=" deliveryFirstDV">
                                            <div className="card">
                                                <div className="tab-content">
                                                    <div className="alert alert-warning"><strong>Note:</strong> Your Normal Hours will be changed when you will add advance delivery hours</div>
                                                    <h4 className="text-warning">
                                                    </h4>

                                                    <div className="col-xs-12 col-sm-3  checkDiv" style={{    padding: '0px',marginTop: '5px'}}>
                                                     <input type="checkbox"  onChange={(e) => this.ApplyToAllAdv(e,true)}  name="All Days" className="form-checkbox" value={this.state.CheckAllAdv}  checked={this.state.CheckAllAdv}/>
                                                      <Label htmlFor="All Days" className="modal-label-head">All Days</Label>
                                                      </div>

                                                    <div style={{ padding: '1rem 0px' }}>
                                                        <ul className="dayList">
                                                            {this.LoadAdvanceWorkingHours(this.state.Days)}

                                                        </ul>

                        
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        </div>

                                    </TabPanel>
                                    <AvInput type="checkbox" name="chkUpdateItem" value={this.state.UpdateItemTiming} onChange={(e) => this.UpdateItemTiming(e.target.value)} className="form-checkbox" />
                                        <span className="control-label"> Update timing for items as well.</span>
                                            <div className="form-horizontal m-t-15">
                                                        <div className="bottomBtnsDiv">
                                                            
                                                            <Button color="primary" style={{ marginBottom: 10, width: '61px' }} >
                                                            {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                                                            : <span className="comment-text">Save</span>}

                                                            </Button>

                                                            {!this.state.IsValidCsv ? <div className="error " style={{margin: 10}} >Please select at-least one working day for working hours.</div> : ''}
                                                        </div>
                                            </div>

                                </Tabs>
                            </AvForm>
                        </div>
                    </div>
                </div>
                {this.GenerateValidTimeModalModel()}
            </div>
        );
    }

}
export default WorkingHours;
