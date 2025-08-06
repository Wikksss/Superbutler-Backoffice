import React, { Component, Fragment } from 'react';
import { FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader, Table, Alert } from 'reactstrap';
import * as EnterpriseSettingService from '../../../service/EnterpriseSetting';
import * as Utilities from '../../../helpers/Utilities';
import Constants from '../../../helpers/Constants';
import { AvForm, AvField, AvInput } from 'availity-reactstrap-validation';
import WrappedMap from "../../../helpers/googleMap";
import SweetAlert from 'sweetalert-react';
import Geocode from "react-geocode";
import Config from '../../../helpers/Config';
import Loader from 'react-loader-spinner';
import * as EnterpriseAddressService from '../../../service/EnterpriseAddress';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import 'rc-time-picker/assets/index.css';
import Labels from '../../../containers/language/labels';
Geocode.setApiKey(Config.Setting.googleApi);
Geocode.enableDebug();

class Address extends Component {
    constructor(props) {
        super(props);

        this.state = {
            AddressesInfo: false,
            AddressData: this.props != undefined && this.props.enterpriseInfo != undefined ? this.props.enterpriseInfo : {},
            showMap: true,
            mapPosition: {},
            address:'',
            FormattedAddress: this.props != undefined && this.props.enterpriseInfo != undefined ? this.props.enterpriseInfo.FormattedAddress : '',
            SelectedAddressID: 0,
            SelectedAddressName:'',
            AddressToBeRemovedID: '',
            BuildingNum: "",
            deleteConfirmationModelText : '',
            deleteComfirmationModelType : '',
            // Latitude: "",
            // Longitude: "",
            TagAddress: this.props.enterpriseInfo.Name,
            IsNew: false,
            IsUpdate: false,
            IsSave: false,
            isBNumValid: true,
            IsAddressValid: true,
            isValid: true,
            showDeleteConfirmation: false
        }
        let defaultLocation = Config.Setting.DefaultLocation;

        this.state.mapPosition = {lat: defaultLocation[0],  lng: defaultLocation[1]}

        console.log("this.props.enterpriseInfo", this.props.enterpriseInfo);

    }
    componentDidMount() {
    }



    AddNewEnterpriseAddress(){
        let defaultLocation = Config.Setting.DefaultLocation;
        this.setState({TagAddress: this.props.enterpriseInfo.Name
        ,SelectedCityId: 0
        ,SelectedAddressID: 0
        ,BuildingNum: ""
        ,Latitude: ""
        ,Longitude: ""
        ,AddressesInfo: !this.state.AddressesInfo
        ,IsUpdate: false
        ,isValid: true,
        isBNumValid: true,
        IsNew: true,
        mapPosition: {
            lat: defaultLocation[0],
            lng: defaultLocation[1]
        },

    });

    }

    AddressesInfoModal() {
        this.setState({
            AddressesInfo: !this.state.AddressesInfo,
        })
    }

    OnChanges= (IsNew) => {

        let enterpriseAddress = EnterpriseAddressService.EnterpriseAddress;

        this.setState({IsNew});
        this.setState({FormattedAddress:  enterpriseAddress.GoogleLocation, address:  enterpriseAddress.GoogleLocation });
    }

    SaveEnterpriseAddressApi = async(enterpriseAddress) =>{

        let message = await EnterpriseAddressService.Save(enterpriseAddress);
        this.setState({IsSave:false})
        if(message === '1'){
            this.props.GetEnterpriseSetting()
            this.props.GetEnterpriseHealth()
            // this.GetEnterpriseAddress();
            this.setState({ AddressesInfo: !this.state.AddressesInfo, });
        }
    }

    UpdateEnterpriseAddressApi = async(enterpriseAddress) =>{

        let message = await EnterpriseAddressService.Update(enterpriseAddress);
        this.setState({IsSave:false})
        if(message === '1') {
            this.props.GetEnterpriseSetting()
            this.props.GetEnterpriseHealth()
            // this.GetEnterpriseAddress();
            this.setState({ AddressesInfo: !this.state.AddressesInfo});
        }
    }


    SaveEnterpriseAddress = () =>{
        if(this.state.IsSave || this.state.IsNew) return;
        this.setState({ IsSave: true })

        var tagAddress = Utilities.removeExtraSpaces(this.state.TagAddress);
        var buildingNum = Utilities.removeExtraSpaces(this.state.BuildingNum);
        var area = Utilities.removeExtraSpaces(this.state.FormattedAddress);
        var valid = true;

        if(tagAddress === ''){
            this.state.TagAddress = this.props.enterpriseInfo.Name;
        }

        if(buildingNum === ''){
            this.setState({ isBNumValid: true })
            valid = false;
        }

        if (!valid){
            this.setState({ IsSave: false })
            return;
        }


        let isUpdate = this.state.IsUpdate;
        let enterpriseAddress = EnterpriseAddressService.EnterpriseAddress;
        enterpriseAddress.AreaId = 0;
        enterpriseAddress.ID = this.state.SelectedAddressID
        enterpriseAddress.Label = Utilities.removeExtraSpaces(this.state.TagAddress) ;//values.txtTagAddrs
        enterpriseAddress.Address = Utilities.removeExtraSpaces(this.state.BuildingNum) //values.txtAddress
        enterpriseAddress.FormattedAddress = `${Utilities.removeExtraSpaces(enterpriseAddress.Address)} ${enterpriseAddress.GoogleLocation}` //values.txtAddress
        //Saving
        if(!isUpdate){
          this.SaveEnterpriseAddressApi(enterpriseAddress);
          return;
        }

        // updating
            this.UpdateEnterpriseAddressApi(enterpriseAddress);

    }

    handleTagAddressChange(e){
        var text = e.target.value;
        this.state.TagAddress = text;
        if(!this.state.isValid){
            this.setState({isValid: true});
        }

       }

       handleBulidingNumChange(e){
         var text = e.target.value;
         this.state.BuildingNum = text;
         if(!this.state.isBNumValid){
             this.setState({isBNumValid: true});
         }

        }

        SetMapLocation(lat,long){
            let enterpriseAddress = EnterpriseAddressService.EnterpriseAddress;
            let defaultLocation = Config.Setting.DefaultLocation;
            Geocode.fromLatLng( lat , long ).then(
                response => {
                 const address = response.results[0].formatted_address ;
                 enterpriseAddress.GoogleLocation = address;
                 enterpriseAddress.Latitude = lat;
                 enterpriseAddress.Longitude =  long;
               this.setState({
                    address: address,
                    mapPosition: {lat: lat, lng: long},
                    showMap: true,
                    AddressesInfo: !this.state.AddressesInfo
                 })

                },
                error => {
                 console.error(error);
                }
               );
        }

        onAddressEdit = async (props) => {
            let defaultLocation = Config.Setting.DefaultLocation;

            this.setState({TagAddress: props.Label
                ,BuildingNum: props.Address1
                ,AreaText: props.SelectedAreaText
                ,Latitude: props.Latitude
                ,Longitude: props.Longitude
                ,SelectedAddressID: props.Id
                ,seletedLocationName: props.Address1
                ,IsUpdate: true
                ,isBNumValid: true
                ,IsAddressValid: true
                ,FormattedAddress: props.FormattedAddress.replace(props.Address1,'')
                ,mapPosition: {
                    lat: props.Latitude,
                    lng: props.Longitude
                }
            });

            this.SetMapLocation(props.Latitude, props.Longitude);
            // this.toggleNewAddressModal();

        }

        DeleteEnterpriseAddress = async() => {
            let message = ''
            let DeletedMessage = await EnterpriseAddressService.Delete(this.state.AddressToBeRemovedID)
            this.setState({showDeleteConfirmation: false});
            let name = this.state.SelectedAddressName;

            if(DeletedMessage === '1'){
                this.props.GetEnterpriseSetting()
                this.setState({})
                // this.GetEnterpriseAddress();
                // this.setState({showAlert: true, alertModelTitle:'Deleted!', alertModelText:"'"+ name+'" deleted successfully' });
                message = "'"+ name+'" deleted successfully'
                Utilities.notify(message, 's');
                return;
            }

            message = DeletedMessage === '0' ? name +'" not deleted successfully' :  DeletedMessage;
            Utilities.notify(message, 'e')
            // this.setState({showAlert: true, alertModelTitle:'Error!', alertModelText: message});

        }

        GenerateSweetConfirmationWithCancel(){
            return(
               <SweetAlert
                 show={this.state.showDeleteConfirmation}
                 title="Are you sure?"
                 text={this.state.deleteConfirmationModelText}
                 showCancelButton
                 onConfirm={() => {this.DeleteEnterpriseAddress()}}
                 onCancel={() => { this.setState({ showDeleteConfirmation: false });
                 }}
                 onEscapeKey={() => this.setState({ showDeleteConfirmation: false })}
                //  onOutsideClick={() => this.setState({ showDeleteConfirmation: false })}
               />
             )
        }

        DeleteAddressConfirmation(name,id){

            this.setState({AddressToBeRemovedID: id, SelectedAddressName: name,  showDeleteConfirmation:true, deleteConfirmationModelText: 'You want to delete "'+name+'".'})

          }



    render() {
        const enterpriseDataLength = Object.keys(this.state.AddressData).length > 0 && this.state.AddressData.EnterprisesAddresses.length > 0
        const { EnterprisesAddresses } = this.state.AddressData;
        return (
            <div className='card-body mx-0'>
                <div class="row">
                <div  className=" m-3 mb-4 p-4 w-100" style={{ boxShadow: "0 0 5px #00000030" }}>
                    <div class="col-md-12 text-sizes px-0">
                        <div className="d-flex justify-content-between align-items-center" style={{ marginBottom: "18px" }}>
                            <h5 className='mr-2'>{Labels.Addresses}</h5>
                            <span class="add-cat-btn  flex-shrink-0 d-flex align-items-center justify-content-center" onClick={() => this.AddNewEnterpriseAddress()}>
                                <i class="fa fa-plus mr-2" aria-hidden="true"></i>
                                <span class="hide-in-responsive"> Add New </span>
                            </span>
                        </div>

                        {
                            enterpriseDataLength && EnterprisesAddresses.length > 0 && EnterprisesAddresses.map((v,i)=>(
                                <div key={i}>
                                    <div className='d-flex mb-2'>
                                        <p className='bold mb-0'>{v.Label}</p>
                                    </div>
                                    <div className='row '>
                                        <div className="mb-1 col-md-12">
                                            <div className=" mb-7 align-items-start d-flex mb-3">
                                                <label className="fw-semibold p-0">{Utilities.SpecialCharacterDecode(v.FormattedAddress)}</label>
                                                <div class=" ml-3 qty-dropdown d-flex align-items-center">
                                                    <span onClick={()=> this.onAddressEdit(v)} class="btn btn-outline-primary  mr-3  d-flex flex-column align-items-center cursor-pointer">
                                                        <i class="fa fa-edit font-16"></i>
                                                    </span>
                                                    {
                                                        !v.IsPrimary &&
                                                        <span onClick={(e) => this.DeleteAddressConfirmation(v.Label, v.Id)} class="btn btn-outline-danger font-16 d-flex flex-column align-items-center cursor-pointer">
                                                            <i class="fa fa-trash font-16" aria-hidden="true"></i>
                                                        </span>
                                                    }
                                                </div>

                                            </div>

                                        </div>
                                        {/* <div className="mb-1 col-md-2">
                                    <div className=" checkDiv d-flex flex-column text-center" >
                                        <input type="radio" className="radio-setting option-input radio form-radiobox mb-2" name="rdobyLocation" id="default" value="" />
                                        <label htmlFor="default" className="settingsLabel font-13 text-center" >Dafault</label>

                                    </div>
                                </div> */}
                                    </div>
                                </div>
                            ))
                        }


                    </div>
                </div>
                </div>
                <Modal isOpen={this.state.AddressesInfo} toggle={() => this.AddressesInfoModal()} className={this.props.className}>
                <AvForm onValidSubmit={this.SaveEnterpriseAddress}>
                    <ModalHeader toggle={() => this.AddressesInfoModal()} >New address</ModalHeader>
                    <ModalBody className='mt-4 vp-height-add'>
                        <div className="card-body address-modal " style={{ padding: 0, paddingTop:73 }}>

                            <div className="form-body m-b-10">
                                <div className="row">
                                    <div className="col-md-12" style={{height:"100px"}}>

                                    <div className="m-b-20 form-group height-input" >
                                            <label className="control-label position-absolute" style={{bottom:"168px", zIndex:"3"}}>Enter Location</label>
                                            <label id="name" class="control-label  ">Shop Number / Building Name</label>
                                            <AvField name="BuildingNum" type="text"
                                            className={this.state.isBNumValid ? "form-control" : "is-touched is-pristine av-invalid is-invalid form-control"} value={Utilities.SpecialCharacterDecode(this.state.BuildingNum)}
                                            onChange={(e) => this.handleBulidingNumChange(e)}
                                            errorMessage="This is a required field"
                                            placeholder=""
                                            required />

                                            <div class="invalid-feedback"
                                            style={this.state.isBNumValid ? { "display": "none" } : { "display": "block" }}
                                            >This is a required field</div>

                                            <div className="help-block with-errors"></div>
                                        </div>
                                    </div>
                                    <div className="col-md-12  ">

                                    <div className="m-b-10 height-input mt-1" >
                                            <label className="control-label">Tag this address as</label>
                                            <AvField name="txtTagAddrs" type="text"
                                            className={"form-control"} value={Utilities.SpecialCharacterDecode(this.state.TagAddress)}
                                            onChange={(e) => this.handleTagAddressChange(e)}
                                            placeholder=""
                                            />

                                            <div class="invalid-feedback"
                                            style={this.state.isValid ? { "display": "none" } : { "display": "block" }}
                                            >This is a required field</div>

                                            <div className="help-block with-errors"></div>
                                        </div>
                                    </div>


                                </div>
                                <div className="m-t-10 input-map" >
                                    {this.state.showMap ?
                                        // this.GenerateAddressMap()
                                        <WrappedMap

                                            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${Config.Setting.googleApi}&libraries=places&callback=myCallbackFunc`}
                                            loadingElement={<div style={{ height: `100%` }} />}
                                            containerElement={<div style={{ height: `40vh` }} />}
                                            centerLocation={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng, address: this.state.address, isNew: this.state.IsNew }}
                                            mapElement={<div style={{ height: `100%` }} />}
                                            onLocationChange={this.OnChanges}

                                        />
                                        : <div className="loader-menu-inner">
                                            <Loader type="Oval" color="#ed0000" height={50} width={50} />
                                            <div className="loading-label">Loading.....</div>
                                        </div>}
                                </div>
                            </div>

                        </div>
                    </ModalBody>
                    <FormGroup className="modal-footer" >
                        <div className='mr-auto'> <label id="name" class="control-label mt-2 text-danger">{this.state.errorMessage}</label>
                        </div>
                        <div>
                            <Button className='mr-2 text-dark' color="secondary" onClick={() => this.AddressesInfoModal()}>{Labels.Cancel}</Button>
                            <Button disabled={this.state.address == ""} color="primary" >
                                {
                                    this.state.IsSave ?
                                    <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                                    :
                                    <span className="comment-text">{Labels.Save}</span>
                                }
                            </Button>
                        </div>
                    </FormGroup>
                    </AvForm>
                </Modal>
                {this.GenerateSweetConfirmationWithCancel()}
            </div>
        );
    }
}

export default Address;
