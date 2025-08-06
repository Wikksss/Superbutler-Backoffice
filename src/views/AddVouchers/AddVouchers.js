import React, { Component, Fragment } from 'react';
import { Button, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { AvForm, AvField, AvInput, AvGroup } from 'availity-reactstrap-validation';
import Cropper from 'react-easy-crop';
import Slider from '@material-ui/core/Slider'
import * as CityServ from '../../service/City';
import * as CategoryService from '../../service/Category';
import * as EnterpriseService from '../../service/Enterprise';
import * as VoucherService from '../../service/voucher';
import * as Utilities from '../../helpers/Utilities';
import Constants from '../../helpers/Constants';
import Config from '../../helpers/Config';
import Loader from 'react-loader-spinner'
import Autocomplete from 'react-autocomplete';
import DatePicker from "react-datepicker";
import moment from 'moment';
import 'rc-time-picker/assets/index.css';
import TimePicker from 'rc-time-picker';
import "react-datepicker/dist/react-datepicker.css";
import getCroppedImg from '../../helpers/CropImage'
import Labels from '../../containers/language/labels';

const format = 'h:mm a';
const passwordTextValidation = (value, ctx) => {

    if (value.toUpperCase() === "PASSWORD") {
        return "Your password can not be 'password'";
    }
    return true;
}

const NumberValidation = (value, ctx) => {

    if (!Utilities.IsNumber(value) && Number(value) !== -1) {
      return "Invalid value";
    }
    return true;
  }

function readFile(file) {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.addEventListener(
        'load',
        () => resolve(reader.result),
        false
      )
      reader.readAsDataURL(file)
    })
  }


class AddNewVoucher extends Component {

    loading = () => <div className="loader-menu-inner">
        <Loader type="Oval" color="#ed0000" height={50} width={50} />
        <div className="loading-label">Loading.....</div>
    </div>


    constructor(props) {
        super(props);
        this.state = {
            show: false,
            showAlert: false,
            ShowLoader: true,
            ShowError: false,
            Categories: [],
            CategoriesCsvArray: [],
            Cities: [],
            Days: [
                { Id: 7, Day: 'Sunday', OpeningTime: "00:00", ClosingTime: "00:00", IsSelected: false },
                { Id: 1, Day: 'Monday', OpeningTime: "00:00", ClosingTime: "00:00", IsSelected: false },
                { Id: 2, Day: 'Tuesday', OpeningTime: "00:00", ClosingTime: "00:00", IsSelected: false },
                { Id: 3, Day: 'Wednesday', OpeningTime: "00:00", ClosingTime: "00:00", IsSelected: false },
                { Id: 4, Day: 'Thursday', OpeningTime: "00:00", ClosingTime: "00:00", IsSelected: false },
                { Id: 5, Day: 'Friday', OpeningTime: "00:00", ClosingTime: "00:00", IsSelected: false },
                { Id: 6, Day: 'Saturday', OpeningTime: "00:00", ClosingTime: "00:00", IsSelected: false },

            ],
            VoucherDetail: {},
            VoucherId : 0,
            CategoryArray: [],
            CheckAll: false,
            IsNewVoucher: true,
            VoucherType: -1,
            StartDate: "",
            EndDate: "",
            PhotoName: null,
            CroppedAreaPixels: null,
            CroppedImage: null,
            modalPhoto: false,
            Image: null,
            Crop: { x: 0, y: 0 },
            Zoom: 1,
            Aspect: 200 / 150,
            OldImage: null,

            ValidVouchrType: true,
            ValidVoucherOrderType: true,
            ValidVoucherPhoto:true,
            ValidVoucherHour:true,
            ValidVoucherStartDate: true,
            ValidVoucherEndDate:true,
            ValidDate:true,
            FromInvalid: false,


        };

        this.SaveVoucher = this.SaveVoucher.bind(this);
        this.CreateHourCsv = this.CreateHourCsv.bind(this);
        this.toggleModal = this.toggleModal.bind(this);

    }


    HandleDateChange = (date,isExpiry) => {


        let isDateValid = true;

        if(isExpiry) {

            isDateValid = date > this.state.StartDate
            this.setState({ EndDate: date, ValidDate: isDateValid });
        }
        else {

            if(this.state.EndDate !== ""){
            isDateValid = date < this.state.EndDate
            }
            this.setState({ StartDate: date, ValidDate: isDateValid });
        }
    };

    handleInvalidSubmit = () => {
        this.setState({FromInvalid: true})
    }

    // #region api calling

    // UserAlreadyRegistered = async (userName, ) => {

    //     if (userName === "") {
    //         this.setState({ validateUserName: true })
    //         return true;
    //     }

    //     let message = await EnterpriseUserService.IsUserAlreadyRegistered(userName);

    //     if (message === '1') {
    //         this.setState({ validateUserName: true })
    //         return true;
    //     }
    //     this.setState({ validateUserName: false })
    //     return false;

    // }

    SetVoucherHours(hourCsv) {

        let hours = hourCsv.length > 0 ?  hourCsv.split('^^^') : [];
        let checkAll = true;
        let weekDays = this.state.Days;

        weekDays.forEach(day => {
            var rowId = -1;
            let voucherDay;

            for (var i = 0, j = hours.length; i < j; i++) {

                voucherDay =  hours[i] != undefined? hours[i].split('|') : '';

                    if (Number(voucherDay[0]) === day.Id) {
                    rowId = i;
                    break;
                }
            }

            if (rowId !== -1) {

                if(voucherDay != '') {
                day.IsSelected = true;
                day.OpeningTime = voucherDay[1].split('~')[0]
                day.ClosingTime = voucherDay[1].split('~')[1]
                }

            } else {
                checkAll = false;
            }

        });

        this.setState({Days: weekDays, CheckAll: checkAll });

    }

    GetVoucherDetail = async (voucherId) => {

        this.setState({ShowLoader: true, VoucherId: voucherId});
        let data = await VoucherService.GetBy(voucherId);

        if(Object.keys(data).length > 0) {

             var startdate = moment(data.StartDate,Config.Setting.dateFormat + " hh:mm");
             var enddate = moment(data.ExpiryDate,Config.Setting.dateFormat + " hh:mm");
             this.state.StartDate = startdate.toDate();
             this.state.EndDate = enddate.toDate();

             this.state.VoucherType = data.VoucherType;
             this.state.IsNewVoucher = false;
             var excludedCatIdsCsv = data.ExcludedCatIdsCsv.split(Config.Setting.csvSeperator);
             this.SetVoucherHours(data.HourCsv)
             this.setState({CategoriesCsvArray: excludedCatIdsCsv,  CategoryArray: excludedCatIdsCsv});

        }
        this.GetCategories();
        this.setState({ VoucherDetail: data});

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


    GetCategories = async () => {

        let categoryArray = this.state.CategoryArray;
        var data = await CategoryService.GetAll(Utilities.GetEnterpriseIDFromSessionObject());
        data.sort((x, y) => ((x.SortOrder === y.SortOrder) ? 0 : ((x.SortOrder > y.SortOrder) ? 1 : -1)))

        data.forEach(cat => {
            cat.IsSelected = categoryArray.includes(cat.Id.toString());
        })

        this.setState({ Categories: data, ShowLoader : false});

      }


    SaveVoucherApi = async (voucher) => {

        let result = await VoucherService.Save(voucher);
        this.setState({IsSave:false});
         if (!result.HasError && result !== undefined && result !== "0") {

            if (result.Dictionary.IsSaved === true) {

                // Utilities.notify("Voucher saved successfully.", "s");
                this.props.history.push("/vouchers");
            }
         } else if(result.HasError && result.ErrorCodeCsv !=='' && result !== "0") {

            Utilities.notify("save failed. " + result.ErrorCodeCsv, "e");
         }
            else {
                Utilities.notify("Update failed.", "e");
            }
    }


    UpdateVoucherApi = async (voucher) => {

        let result = await VoucherService.Update(voucher);

        this.setState({IsSave:false,FromInvalid: false});

        if (!result.HasError && result !== undefined && result !== "0") {

            if (result.Dictionary.IsUpdated === true) {

                Utilities.notify("Voucher updated successfully.", "s");
            }
         } else if(result.HasError && result.ErrorCodeCsv !=='' && result !== "0") {

            Utilities.notify("update failed. " + result.ErrorCodeCsv, "e");
         }
            else {
                Utilities.notify("Update failed.", "e");
            }
    }


    SaveVoucher(event, values) {

        // let cityIdCsv = this.GetCityIdCsv();

        if(this.state.IsSave) return;
        this.setState({IsSave: true,
            ValidVouchrType: true,
            ValidVoucherOrderType: true,
            ValidVoucherPhoto:true,
            ValidVoucherHour:true,
            ValidVoucherStartDate: true,
            ValidVoucherEndDate:true,
			FromInvalid : false
        });

        let voucher = VoucherService.Voucher;
        voucher.HourCsv = this.CreateHourCsv();

        var isValid = this.CheckValidation(values,voucher.HourCsv);

        if(!isValid){
            this.setState({IsSave: false,FromInvalid : true})
            return;
        }


        voucher.Id = this.state.VoucherId;
        voucher.Title = values.txtTitle;
        voucher.VoucherDescription = values.txtDescription;
        voucher.TermAndCondition = Utilities.SpecialCharacterEncode(values.txtTermAndCondition);
        voucher.VoucherType = this.state.VoucherType;
        voucher.VoucherValue =   parseFloat(values.txtVoucherValue).toFixed(2);
        voucher.Code = values.txtCode;
        voucher.FixedCharges = values.txtFixedCharges;
        voucher.CommisssionPer = values.txtCommissionPercentage;
        voucher.Quantity = values.txtQuantity;
        voucher.Label = values.txtLabel;
        voucher.MinimumOrderAmount = values.txtMinOrderAmount;
        voucher.OverrideMinimumOrderAmount = values.txtOverrideMinOrderAmount;
        voucher.OverrideDeliveryCharges = values.txtOverrideDeliveryCharges;
        voucher.PhotoName = this.state.PhotoName;
        voucher.SalesTaxNumber = values.txtSTN;
        voucher.StartDate = moment(this.state.StartDate.toString()).format("DD/MM/YYYY HH:mm");
        voucher.ExpiryDate = moment(this.state.EndDate.toString()).format("DD/MM/YYYY HH:mm");
        voucher.IsActive = values.isActive;
        voucher.IsVisible = values.isVisible;
        voucher.AllowMultipleUse = values.isMultiple;
        voucher.IsUserRestricted = values.isRestricted;
        voucher.IsExternal = values.isExternal;
        voucher.IsDeliveryOffered = values.isDelOffered;
        voucher.IsCollectionOffered = values.isColOffered;
        voucher.IsDineInOffered = values.isDinOffered;
        voucher.Base64Image = this.state.CroppedImage !== null ? this.state.CroppedImage: "";
        voucher.ExcludedCatIdsCsv = this.GetCategoryIdCsv();
        voucher.HourCsv = this.CreateHourCsv();
        // voucher.EnterpriseId = Utilities.GetEnterpriseIDFromSession();
        if (!this.state.IsNewVoucher) {

            //updating
            this.UpdateVoucherApi(voucher);
        } else {

            //save
            this.SaveVoucherApi(voucher);
        }

    }

    //#endregion


    // #region Upload voucher photo

    toggleModal() {
        this.setState({
          modalPhoto: !this.state.modalPhoto,
        });
      }

      onCropChange = crop => {
        this.setState({ Crop: crop })
      }


      onZoomChange(zoom) {

        this.setState({ Zoom: zoom })

      }

      onCropComplete = (croppedArea, croppedAreaPixels) => {
        this.setState({ CroppedAreaPixels: croppedAreaPixels })
      }

      onFileChange = async (e) => {

        if (e.target.files && e.target.files.length > 0) {
          this.setState({ PhotoName: e.target.files[0].name });
          const imageDataUrl = await readFile(e.target.files[0])

          this.setState({
            Image: imageDataUrl,
            Crop: { x: 0, y: 0 },
            Zoom: 1,
          })

        }
      }

      SaveCroppedImage = async () => {

        let croppedImage = await getCroppedImg(
            this.state.Image,
            this.state.CroppedAreaPixels
        )

        this.setState({CroppedImage : croppedImage,ValidVoucherPhoto : true});
        this.toggleModal();
        // this.SavePhotoApi(this.state.OldLogoImage, croppedImage, this.state.PhotoName, "Restaurant")

      }


    // #endregion


    ClearAllFields() {


        let voucher = VoucherService.Voucher;

        voucher.Id = 0;
        voucher.Title = "";
        voucher.VoucherDescription = "";
        voucher.TermAndCondition = "";
        voucher.VoucherType = -1;
        voucher.VoucherValue = "";
        voucher.Code = "";
        voucher.FixedCharges = "-1";
        voucher.CommisssionPer = "-1";
        voucher.Quantity = "";
        voucher.Label = "";
        voucher.MinimumOrderAmount = "";
        voucher.OverrideMinimumOrderAmount = "-1";
        voucher.OverrideDeliveryCharges = "-1";
        voucher.PhotoName = "";
        voucher.StartDate = "";
        voucher.ExpiryDate = "";
        voucher.IsActive = false;
        voucher.IsVisible = false;
        voucher.AllowMultipleUse = false;
        voucher.IsUserRestricted = false;
        voucher.IsExternal = false;
        voucher.IsDeliveryOffered = false;
        voucher.IsCollectionOffered = false;
        voucher.IsDineInOffered = false;
        voucher.Base64Image = "";
        voucher.ExcludedCatIdsCsv = "";
        voucher.HourCsv = "";

    }


    CheckValidation(values,hourCsv)
    {

        var isValid = true;

        if(this.state.VoucherType === -1){
            this.setState({ValidVouchrType: false});
            isValid = false;
         }

         if(!values.isDelOffered && !values.isColOffered && !values.isDinOffered){
            this.setState({ValidVoucherOrderType: false});
            isValid = false;
         }

        //  if((this.state.CroppedImage === "" || this.state.CroppedImage === null ) && this.state.IsNewVoucher) {
        //     this.setState({ValidVoucherPhoto: false});
        //     isValid = false;
        //  }


         if(this.state.StartDate === ""){
            this.setState({ValidVoucherStartDate: false});
            isValid = false;
         }

         if(this.state.EndDate === ""){
            this.setState({ValidVoucherEndDate: false});
            isValid = false;
         }

         if(!this.state.ValidDate){
            isValid = false;
         }

         if(hourCsv=== ""){
            this.setState({ValidVoucherHour: false});
            isValid = false;
         }



         return isValid;


    }

    CreateHourCsv() {

        let hourCsv = "";

        let weekDays = this.state.Days
        weekDays.forEach(day => {

            if (day.IsSelected) {

                hourCsv += day.Id + "|" + day.OpeningTime + "~" + day.ClosingTime + Config.Setting.csvSeperator
            }

        });

        hourCsv = Utilities.FormatCsv(hourCsv, Config.Setting.csvSeperator);
        return hourCsv;
    }


    RemoveSpecialChars(e) {

        Utilities.RemoveSpecialChars(e);
        Utilities.RemoveDefinedSpecialChars(e);
    }

    handlerCheckBox(e, control) {

        let value = e.target.value;

        switch (control.toUpperCase()) {

            case 'IA':
                this.state.IsActive = value === "false" ? true : false;
                break;

            case 'IV':
                this.state.IsVisible = value === "false" ? true : false;
                break;

            case 'IU':
                this.state.IsUserRestricted = value === "false" ? true : false;
                break;

            case 'IE':
                this.state.IsExternal = value === "false" ? true : false;
                break;

            case 'AM':
                this.state.AllowMultipleUse = value === "false" ? true : false;
                break;

            default:
                break;

        }

        // this.setState({ Enterprise: enterprise });

    }

    GetCategoryIdCsv(){

        let categoryArray = this.state.CategoriesCsvArray;
        var Csv = "";

        for(var i = 0; i < categoryArray.length; i++) {

            Csv += categoryArray[i] + Config.Setting.csvSeperator;
         }

         Csv = Utilities.FormatCsv(Csv, Config.Setting.csvSeperator);
         return Csv;

    }


    handlerCategoryCheckBox(e) {
        
        let categoryArray = this.state.CategoriesCsvArray;

        if (!e.target.checked) {

            categoryArray = categoryArray.filter((item) => item != e.target.id);

            
        } else {
            categoryArray.push(Number(e.target.id));
        }

        this.setState({ CategoriesCsvArray: categoryArray });

    }


    RenderCategory(category) {

        return (
            <div className="col-xs-12 col-sm-3 m-b-10 form-group checkSpanDV">
                <AvInput type="checkbox" name={Utilities.SpecialCharacterDecode(category.Name)} id={category.Id} checked={category.IsSelected} value={category.IsSelected} onClick={(e) => this.handlerCategoryCheckBox(e)}  className="form-checkbox" />
                <Label check htmlFor={category.Id}> {Utilities.SpecialCharacterDecode(category.Name)}</Label>
            </div>
        )
    }

    LoadCategories(categories) {

        var htmlcategory = [];

        if (this.state.ShowLoader) {
            return this.loading();
        }

        for (var i = 0; i < categories.length; i++) {

            htmlcategory.push(this.RenderCategory(categories[i]));
        }

        return (

            <div className="formPadding row col-xs-12 setting-cus-field m-t-20 m-b-20">
                {htmlcategory.map((categoryHtml) => categoryHtml)}
            </div>
        )

    }

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
            default:
                break;
        }

        this.setState({ Days: weekDays});


    }

    CheckAllDays = (e,isCheckedAllDay) => {

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

        this.setState({ Days: weekDays, CheckAll: isChecked })

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
                hideDisabledOptions
                addon={() => (
                    <Button size="small" className="btn btn-success" onClick={(event) => this.handleClose()}>
                        Ok
        </Button>
                )}
            />

        )
    }


    RenderDays(index, day) {

        if(index == 0){
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

        } else {


        return (

            <div className="daysDV">
                {/* <div className={"checkBoxDV"}> */}
                <div className={day.WorkingOpeningTime === "" ? "checkBoxDV disabledDiv" : "checkBoxDV"}>
                    <div className="dayLabel">
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
    }

    RenderVoucherHours(weekDay) {

        if (this.state.ShowLoader === true) {
            return this.loading()
        }

        let htmlTime = [];
        for (var i = 0; i < weekDay.length; i++) {

            htmlTime.push(this.RenderDays(i, weekDay[i]));

        }

        return (<div>{htmlTime.map((timeHtml) => timeHtml)} </div>)
    }


    handleVoucherType(e) {

        var voucherDetail = this.state.VoucherDetail;
        var value = Number(e.target.value);
        voucherDetail.VoucherType = value;
        this.setState({VoucherType:value, VoucherDetail: voucherDetail});
    }

    GoBack(){

        this.props.history.goBack();

      }

    componentDidMount() {

        // this.GetEnterpriseDetail();
        // this.GetCategories();

    var id = this.props.match.params.id;
    if(id !== undefined){
      this.GetVoucherDetail(id);
    } else {
        this.GetCategories();
        this.setState({ ShowLoader: false, IsNewVoucher: true });
    }


    }


    render() {

        if (this.state.ShowLoader) {

            return this.loading();
        }


        let voucher = this.state.VoucherDetail;
        let photoName = Utilities.generatePhotoLargeURL(voucher.PhotoName, true, false)

        return (
            <div className="card">
                          <h3 className="card-title card-new-title">Add Voucher</h3>
                <div className="card-body">

                    <AvForm onValidSubmit={this.SaveVoucher}  onInvalidSubmit={this.handleInvalidSubmit} id="generalSettingsForm" >

                        <div className="form-body m-b-10 formPadding">
                            <div className="row p-t-20 m-b-20">



                 <div className="col-md-6 media-wraper">

                  <div className="res-logo-wrap col-md-12 margin-r-0" style={{padding:'0'}}  onClick={this.toggleModal}>

                    <label className="control-label">Photo</label>
                    {voucher.PhotoName !== "" && voucher.PhotoName !== undefined ?
                      <div className="box-wrap">

                        {/* <img className="d-block w-100" src={this.state.CroppedImage === "" || this.state.CroppedImage === null ? photoName : this.state.CroppedImage} alt={photoName} /> */}
                        <div className="media-image" style={{ backgroundImage: "url(" + photoName + ")"}}></div>

                        <div class="el-overlay">
                          <div className="image-edit" >
                            <i className="fa fa-edit"></i>
                            <span>Edit</span>
                          </div>
                        </div>
                      </div>
                      :
                      <div className="box-wrap" id="dvAddLogoImage" >
                      {/* <div className="media-image" style={{ backgroundImage: `url(${this.state.CroppedImage})`}}></div> */}
                      <img className="d-block w-100" src={this.state.CroppedImage} />
                        <i className="fa fa-plus"></i>
                        <p>Add Voucher Photo</p>

                      </div>
                    }

                  {this.state.ValidVoucherPhoto ? "" :  <div class="invalid-feedback" style={{"display" : "block"}}>Choose a voucher photo</div>}

                  </div>

                                </div>
                                <div className="col-md-6">
                                    <label className="control-label">Title</label>
                                    <div className="input-group m-b-10 form-group">
                                        <AvField name="txtTitle" type="text" value={voucher.Title} className="form-control"
                                         validate={{
                                            required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                                            }}
                                        />
                                        <div className="help-block with-errors"></div>
                                    </div>
                                </div>

                            </div>
                            <div className="row  m-b-20">
                                <div className="col-md-6">
                                    <label className="control-label">Description</label>
                                    <div className="input-group m-b-10 form-group">
                                        <AvField type="textarea" name="txtDescription" rows={2} maxLength={256} cols={50} className="form-control" value={voucher.VoucherDescription}
                                         validate={{
                                            required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                                            }}
                                        />
                                        <div className="help-block with-errors"></div>
                                    </div>
                                </div>            <div className="col-md-6">
                                    <label className="control-label">Terms and conditions</label>
                                    <div className="input-group m-b-10 form-group">
                                        <AvField type="textarea" name="txtTermAndCondition" rows={2} maxLength={256} cols={50} className="form-control" value={Utilities.SpecialCharacterDecode(voucher.TermAndCondition)}
                                         validate={{
                                            required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                                            }}
                                        />
                                        <div className="help-block with-errors"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="row m-b-20">
                                <div className="col-md-6">
                                    <label className="control-label">Voucher Type</label>
                                    <div className= "input-group mb-3 form-group" >
                                        <select className={this.state.ValidVouchrType ? "form-control" : "is-touched is-pristine av-invalid is-invalid form-control"} onChange={(e) => this.handleVoucherType(e)} value={voucher.VoucherType}>
                                            <option value={-1}>Select Voucher Type</option>
                                            <option value={0}>Points</option>
                                            <option value={1}>Money</option>
                                            <option value={2}>Percentage</option>
                                        </select>

                                     {this.state.ValidVouchrType ? "" : <div class="invalid-feedback" style={this.state.isBNumValid ? {"display" : "none"} : {"display" : "block"}}>Please select voucher type</div>}

                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="control-label">Voucher Value</label>
                                    <div className="input-group mb-3 form-group">
                                        <AvField errorMessage="This is a required fied" name="txtVoucherValue" type="text" className="form-control" value={voucher.VoucherValue === 0 ? "0" : voucher.VoucherValue}
                                          validate={{
                                            required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                                            myValidation: NumberValidation,
                                            }}
                                         />
                                    </div>
                                </div>
                            </div>
                            <div className="row m-b-20">
                                <div className="col-md-6">
                                    <label className="control-label">Code</label>
                                    <div className="input-group mb-3  form-group">
                                        <AvField errorMessage="This is a required fied" name="txtCode" type="text" className="form-control" value={voucher.Code} required />
                                        <div className="help-block with-errors"></div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="control-label">Fixed Charges</label>
                                    <div className="input-group mb-3 form-group">
                                        <AvField name="txtFixedCharges" type="text" className="form-control" value={this.state.IsNewVoucher? "-1" : voucher.FixedCharges == 0 ? "0" : voucher.FixedCharges}
                                        validate={{
                                            required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                                            myValidation: NumberValidation,
                                            }}
                                        />
                                        <div className="help-block with-errors"></div>
                                    </div>
                                </div>

                            </div>

                            <div className="row m-b-20">
                                <div className=" col-sx-12 col-sm-6">
                                    <div className="form-group m-b-0 form-group">
                                        <label className="control-label">Comission Percentage </label>
                                        <AvField name="txtCommissionPercentage" type="text" className="form-control" value={this.state.IsNewVoucher? "-1" : voucher.CommisssionPer}
                                         validate={{
                                            required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                                            }}
                                        />

                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="control-label font-weight-500">Quantity</label>
                                    <div className="input-group mb-3  form-group">
                                        <AvField name="txtQuantity" type="text" className="form-control" value={voucher.Quantity === 0 ? "0" : voucher.Quantity}
                                         validate={{
                                            required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                                            myValidation: NumberValidation,
                                            }}
                                        />
                                        <div className="help-block with-errors"></div>
                                    </div>
                                </div>

                            </div>

                            <div className="row m-b-20">

                                <div className="col-md-6">
                                    <label className="control-label font-weight-500">Label</label>
                                    <div className="input-group mb-3 form-group">
                                        <AvField errorMessage="This is a required fied" name="txtLabel" type="text" className="form-control" value={voucher.Label}
                                         validate={{
                                            required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                                            }}
                                        />
                                        <div className="help-block with-errors"></div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="control-label font-weight-500">Minimum order amount</label>
                                    <div className="input-group mb-3  form-group">
                                        <AvField errorMessage="This is a required fied" name="txtMinOrderAmount" type="text" className="form-control" value={voucher.MinimumOrderAmount === 0 ? "0" : voucher.MinimumOrderAmount}
                                         validate={{
                                            required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                                            myValidation: NumberValidation,
                                            }}
                                        />
                                        <div className="help-block with-errors"></div>
                                    </div>
                                </div>

                            </div>

                            <div className="row m-b-20">


                                <div className="col-md-6">
                                    <label className="control-label font-weight-500">Override Minimum Order Amount</label>
                                    <div className="input-group mb-3 form-group">
                                        <AvField errorMessage="This is a required fied" name="txtOverrideMinOrderAmount" type="text" className="form-control" value={this.state.IsNewVoucher? "-1" :  voucher.OverrideMinimumOrderAmount === 0 ? "0" : voucher.OverrideMinimumOrderAmount}
                                         validate={{
                                            required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                                            myValidation: NumberValidation,
                                            }}
                                        />
                                        <div className="help-block with-errors"></div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="control-label font-weight-500">Override Delivery Charges</label>
                                    <div className="input-group mb-3  form-group">
                                        <AvField errorMessage="This is a required fied" name="txtOverrideDeliveryCharges" type="text" value={this.state.IsNewVoucher? "-1" : voucher.OverrideDeliveryCharges === 0 ? "0" : voucher.OverrideDeliveryCharges} className="form-control"
                                         validate={{
                                            required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                                            myValidation: NumberValidation,
                                            }}
                                        />
                                        <div className="help-block with-errors"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="row">

                                <div className="col-md-6">
                                    <label className="control-label font-weight-500">Start Date</label>
                                    <div className="input-group mb-3 form-group">

                                        <DatePicker
                                            selected={this.state.StartDate}
                                            onChange={(date) =>this.HandleDateChange(date,false)}
                                            showTimeSelect
                                            timeFormat="HH:mm"
                                            timeIntervals={15}
                                            timeCaption="time"
                                            dateFormat="dd/MM/yyyy hh:mm aa"
                                            className="form-control"
                                        />
                                    </div>
                                    {this.state.ValidVoucherStartDate ? "" :  <div class="invalid-feedback" style={{"display" : "block"}}>Please provide voucher's starting date.</div>}
                                </div>

                                <div className="col-md-6">
                                    <label className="control-label font-weight-500">Expiry Date</label>

                                    <DatePicker
                                        selected={this.state.EndDate}
                                        onChange={(date) =>this.HandleDateChange(date,true)}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        timeCaption="time"
                                        dateFormat="dd/MM/yyyy hh:mm aa"
                                        className="form-control"
                                    />
                                </div>
                                    {this.state.ValidVoucherEndDate ? "" :  <div class="invalid-feedback" style={{"display" : "block"}}>Please provide voucher's expiry date.</div>}
                                    {this.state.ValidDate ? "" :  <div class="invalid-feedback" style={{"display" : "block"}}>Expiry date cannot be less than Start date.</div>}
                                </div>

                            <div className="time-picker-main-wraper">
                                <AvGroup name="chkVoucher" required className="row col-xs-12 setting-cus-field m-t-20 m-b-20">
                                    <div className="col-xs-12 col-sm-3 m-b-10 form-group checkSpanDV">
                                        <AvInput type="checkbox" id="isActive" name="isActive" className="form-checkbox" checked={voucher.IsActive} value={voucher.IsActive}/>
                                        <Label check htmlFor="isActive">  IsActive </Label>
                                    </div>
                                    <div className="col-xs-12 col-sm-3 m-b-10 form-group checkSpanDV">
                                        <AvInput type="checkbox" id="isVisible" name="isVisible" className="form-checkbox" checked={voucher.IsVisible} value={voucher.IsVisible} />
                                        <Label check htmlFor="isVisible">  IsVisible </Label>
                                    </div>
                                    <div className="col-xs-12 col-sm-3 m-b-10 form-group checkSpanDV">
                                        <AvInput type="checkbox" id="isMultiple" name="isMultiple" className="form-checkbox" checked={voucher.AllowMultipleUse} value={voucher.AllowMultipleUse} />
                                        <Label check htmlFor="isMultiple">  Allow Multiple Use </Label>
                                    </div>

                                    <div className="col-xs-12 col-sm-3 m-b-10 form-group checkSpanDV">
                                        <AvInput type="checkbox" id="isRestricted" name="isRestricted" className="form-checkbox" checked={voucher.IsUserRestricted} value={voucher.IsUserRestricted} />
                                        <Label check htmlFor="isRestricted">  Is User Restricted </Label>
                                    </div>
                                    <div className="col-xs-12 col-sm-3 m-b-10 form-group checkSpanDV">
                                        <AvInput type="checkbox" id="isExternal" name="isExternal" className="form-checkbox" checked={voucher.IsExternal} value={voucher.IsExternal} />
                                        <Label check htmlFor="isExternal">  Is External </Label>
                                    </div>
                                </AvGroup>


                            <h4 className="title-sperator">Select Voucher Order Type</h4>
                                <AvGroup name="chkVoucherType" required className="row col-xs-12 setting-cus-field m-t-20 m-b-20">
                                    <div className="col-xs-12 col-sm-3 m-b-10 form-group checkSpanDV">
                                        <AvInput type="checkbox" id="isDelOffered" name="isDelOffered" className="form-checkbox" checked={voucher.IsDeliveryOffered} value={voucher.IsDeliveryOffered} />
                                        <Label check htmlFor="isDelOffered">  Delivery Offered </Label>
                                    </div>
                                    <div className="col-xs-12 col-sm-3 m-b-10 form-group checkSpanDV">
                                        <AvInput type="checkbox" id="isColOffered" name="isColOffered" className="form-checkbox" checked={voucher.IsCollectionOffered} value={voucher.IsCollectionOffered} />
                                        <Label check htmlFor="isColOffered">  Takeaway Offered </Label>
                                    </div>
                                    <div className="col-xs-12 col-sm-3 m-b-10 form-group checkSpanDV">
                                        <AvInput type="checkbox" id="isDinOffered" name="isDinOffered" className="form-checkbox" checked={voucher.IsDineInOffered} value={voucher.IsDineInOffered} />
                                        <Label check htmlFor="isDinOffered">  Dine-In Offered  </Label>
                                    </div>

                                    {this.state.ValidVoucherOrderType ? "" : <div class="invalid-feedback" style={ {"display" : "block"}}>Please select voucher order type</div>}


                                </AvGroup>

                                <h4 className="title-sperator">Select categories which are not included for this voucher</h4>

                                {this.LoadCategories(this.state.Categories)}

                                <h4 className="title-sperator">Voucher Hours</h4>

                                        <div className="col-xs-12 col-sm-3  checkDiv" style={{    padding: '0px',marginTop: '15px'}}>
                                                     <input type="checkbox"  onChange={(e) => this.CheckAllDays(e,true)}  name="All Days" className="form-checkbox" value={this.state.CheckAll}  checked={this.state.CheckAll}/>
                                                      <Label htmlFor="All Days" className="modal-label-head">All Days</Label>
                                                      </div>

                                    {this.RenderVoucherHours(this.state.Days)}
                                    {this.state.ValidVoucherHour ? "" : <div class="invalid-feedback" style={ {"display" : "block"}}>Please select at-least one voucher day for voucher hours.</div>}

                            </div>

                        </div>
                        <div className="bottomBtnsDiv" style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', marginRight: '10px' }}>

                            <Button color="secondary" style={{ marginRight: 10 }} onClick={() => this.GoBack()}>Cancel</Button>
                            {/* <Button color="success" >Save</Button> */}
                            <Button style={{width:'61px'}} color="primary" className="btn waves-effect waves-light btn-primary pull-right">
                {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                : <span className="comment-text">Save</span>}
                </Button>
                {this.state.FromInvalid ? <div className="gnerror error media-imgerror">One or more fields has errors.</div>: ""}
                        </div>
                    </AvForm>

          <Modal isOpen={this.state.modalPhoto} toggle={this.toggleModal} className={this.props.className}>
            <ModalHeader toggle={this.toggleLogoModal}>Voucher Photo</ModalHeader>
            <ModalBody>
              <div className="popup-web-body-wrap-new">
                <div className="file-upload-btn-wrap position-relative">
                  <div className="fileUpload">
                    <span>Choose a file</span>
                    <input type="file" accept="image/*" id="logoUpload" className="upload"
                      onChange={(e) => this.onFileChange(e)} />
                  </div>
                </div>

                <div id="logo-upload-image" className="upload-image-wrap-new">
                  <div className="upload-dragdrop-wrap" id="logoDragImage">
                    <div>
                      <div className="dragdrop-icon-text-wrap">PREVIEW ONLY</div>
                      <div className="dragdrop-icon-wrap">
                        <i className="fa fa-file-image-o" aria-hidden="true"></i>
                      </div>
                    </div>
                  </div>
                  <div className="crop-image-main-wrap ">

                    {this.state.Image && <Fragment>
                      <div className="crop-container">
                        <Cropper
                          image={this.state.Image}
                          crop={this.state.Crop}
                          zoom={this.state.Zoom}
                          aspect={this.state.Aspect}
                          onCropChange={this.onCropChange}
                          onCropComplete={this.onCropComplete}
                          onZoomChange={(e) => this.onZoomChange(e)}
                        />
                      </div>
                      <div className="controls">
                        <Slider
                          value={this.state.Zoom}
                          min={1}
                          max={3}
                          step={0.1}
                          aria-labelledby="Zoom"
                          onChange={(e, zoom) => this.onZoomChange(zoom)}
                        />
                      </div>
                    </Fragment>
                    }
                  </div>

                </div>
              </div>
            </ModalBody>
            <ModalFooter>

              <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
              {this.state.Image !== null && <Button color="primary" style={{ marginRight: 10 }} onClick={(e) => this.SaveCroppedImage()}>
              <span className="comment-text">Ok</span>
              </Button>}
            </ModalFooter>
          </Modal>

                </div>
            </div>
        );
    }
}

export default AddNewVoucher;
