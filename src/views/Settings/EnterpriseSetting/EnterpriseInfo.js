import React, { Component, Fragment } from 'react';
import { FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader, Table, Alert } from 'reactstrap';
import { Editor } from "react-draft-wysiwyg";
import * as EnterpriseSettingService from '../../../service/EnterpriseSetting';
import * as Utilities from '../../../helpers/Utilities';
import * as BusinessType from '../../../service/BusinessType'
import Constants from '../../../helpers/Constants';
import { AvForm, AvField, AvInput } from 'availity-reactstrap-validation';
import { MdArrowBack, } from "react-icons/md";
import draftToHtml from 'draftjs-to-html';
import Loader from 'react-loader-spinner';
import ReactFlagsSelect from "react-flags-select";
import { EditorState, convertFromRaw, convertToRaw, Modifier, ContentState, convertFromHTML } from 'draft-js';
import * as CountryService from '../../../service/Country';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import 'rc-time-picker/assets/index.css';
import Labels from '../../../containers/language/labels';


class EnterpriseInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      EnterpriseInfoModal: false,
      EnterpriseInfoData: this.props != undefined && this.props.enterpriseInfo != undefined ? this.props.enterpriseInfo : {},
      InfoData: this.props != undefined && this.props.enterpriseInfo != undefined ? JSON.stringify(this.props.enterpriseInfo) : {},
      htmlEditorState: EditorState.createEmpty(),
      isSaving: false,
      selectedCode: "GB",
      countryList: [],
      selectedId: '',
      businessType: []

    };
    // this.getBusinessType()
    this.getAllCountries()
    this.state.htmlEditorState = EditorState.createWithContent(
      ContentState.createFromBlockArray(
        convertFromHTML(this.state.EnterpriseInfoData.LongDescription)
      )
    );
  }

  getBusinessType = async () => {
    try {
      let data = await BusinessType.GetTypes()
      if (data != undefined && data.Message == undefined) {
        this.setState({ businessType: data })
      }

    } catch (e) {
      console.log('Error in Business type StoreInfo', e)
    }
  }


  getAllCountries = async () => {
    try {
      let response = await CountryService.getAllCountries()
      if (response.length > 0) {
        var sortCountries = response.sort((a, b) => a.SortOrder - b.SortOrder)
        var selectedId = sortCountries.find(obj => {
          return obj.Id == this.props.enterpriseInfo.CountryId;
        });
        this.setState({
          countryList: sortCountries,
          selectedCode: selectedId.IsoCode2,
          // selectedCountryID: sortCountries[0].Id

        })
        return
      }
      console.log('something went wrong')
    } catch (error) {
      console.log('something went wrong', error.message)
    }
  }

  EnterpriseInfoModal() {
    this.setState({
      EnterpriseInfoModal: !this.state.EnterpriseInfoModal,
    }, () => {
      if (this.state.EnterpriseInfoModal == false) {
        this.state.EnterpriseInfoData = JSON.parse(this.state.InfoData)
        this.setState({ EnterpriseInfoData: this.state.EnterpriseInfoData })
      }
    })
  }

  onEditorStateChange = (htmlEditorState) => {
    this.setState({
      htmlEditorState,
    }, () => {
      this.state.EnterpriseInfoData.LongDescription = Utilities.SpecialCharacterEncode(draftToHtml(convertToRaw(this.state.htmlEditorState.getCurrentContent())))
    });
  }

  saveEnterpriseInfo = async () => {
    try {
      this.setState({ isSaving: true })
      const { Name, BusinessType, BusinessTypeId, Email, Mobile1, Landline1, Landline2, ShortDescription, LongDescription, PromotionMessage, Country } = this.state.EnterpriseInfoData;
      var message = '';
      var enterpriseInfo = {}
      enterpriseInfo.EnterpriseId = this.state.EnterpriseInfoData.EnterpriseId
      enterpriseInfo.Name = Utilities.removeExtraSpaces(Name)
      // storeInfo.BusinessTypeId = BusinessTypeId
      // storeInfo.BusinessType = BusinessType
      enterpriseInfo.BusinessEmail = Utilities.removeExtraSpaces(Email)
      enterpriseInfo.BusinessMobile = Utilities.removeExtraSpaces(Mobile1)
      enterpriseInfo.BusinessLandline1 = Utilities.removeExtraSpaces(Landline1)
      enterpriseInfo.BusinessLandline2 = Utilities.removeExtraSpaces(Landline2)
      enterpriseInfo.ShortDescription = Utilities.SpecialCharacterEncode(Utilities.removeExtraSpaces(ShortDescription))
      enterpriseInfo.LongDescription = Utilities.convertNewLinetoHTMLTag(draftToHtml(convertToRaw((this.state.htmlEditorState.getCurrentContent()))))
      enterpriseInfo.PromotionMessage = Utilities.SpecialCharacterEncode(Utilities.removeExtraSpaces(PromotionMessage))
      enterpriseInfo.CountryId = this.state.EnterpriseInfoData.CountryId
      let response = await EnterpriseSettingService.EnterpriseInfo(enterpriseInfo)
      if (response != undefined && response.Message == undefined) {
        message = `Business info updated successfully.`
        Utilities.notify(message, 's');
        this.props.GetEnterpriseHealth()
        this.setState({ isSaving: false, EnterpriseInfoModal: false, InfoData: JSON.stringify(this.state.EnterpriseInfoData) })

        var userObject = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
        userObject.Enterprise.Name = Utilities.SpecialCharacterDecode(Name);
        localStorage.setItem(Constants.Session.USER_OBJECT, JSON.stringify(userObject));
        const storeName = document.getElementById('storeName');
        storeName.innerHTML = (userObject.Enterprise.Name);

        return
      }
      message = `${response.Message}.`
      Utilities.notify(message, 'e');
      this.state.EnterpriseInfoData = JSON.parse(this.state.InfoData)
      this.setState({ isSaving: false, EnterpriseInfoModal: false, EnterpriseInfoData: this.state.EnterpriseInfoData })
    } catch (e) {
      console.log('Error in save EnterpriseInfo', e)
      this.setState({ isSaving: false, EnterpriseInfoModal: false })
    }

  }

  setSelected = (code) => {
    var selectedId = this.state.countryList.find(obj => {
      return obj.IsoCode2 == code;
    });
    this.state.EnterpriseInfoData.CountryId = selectedId.Id
    this.state.EnterpriseInfoData.Country = selectedId.Name
    this.setState({ selectedCode: code })
  }


  selectBusinessType = (e) => {
    this.state.EnterpriseInfoData.BusinessTypeId = e.target.value
    var type = this.state.businessType.find(x => x.Id == e.target.value)
    this.state.EnterpriseInfoData.BusinessType = type.Name
    this.setState({ EnterpriseInfoData: this.state.EnterpriseInfoData })
  }


  render() {
    const enterpriseDataLength = Object.keys(this.state.EnterpriseInfoData).length > 0
    const { Name, BusinessType, BusinessTypeId, Email, Mobile1, Landline1, Landline2, ShortDescription, LongDescription, PromotionMessage, Country } = this.state.EnterpriseInfoData;
    return (
      <div>
        <div className="m-3 card-body mb-4 p-4" style={{ boxShadow: "0 0 5px #00000030" }}>
          <div className='calc-width'>
            <div class="d-flex align-items-baseline mb-4" >
              <h5>Business Info</h5>
              <a onClick={() => this.EnterpriseInfoModal()} class="ml-5 cursor-pointer text-primary"><i class="fa fa-edit mr-1"></i>Edit</a>
            </div>
            <div className='reseller-info-main-wrap'>
              <div className='mb-3 reseller-info-wrap'>
                <div className='info-label'>
                  <label className="">Business Name</label>
                </div>
                <div className='info-value'>
                  <span className="">{enterpriseDataLength && Name != "" ? Utilities.SpecialCharacterDecode(Name) : '-'}</span>
                </div>
              </div>
              {/* <div className='mb-3 reseller-info-wrap'>
              <div className='info-label'>
                <label className="">Business Type</label>
              </div>
              <div className='info-value'>
                <span className="">Dealers & Distributors</span>
              </div>
            </div> */}
              <div className='mb-3 reseller-info-wrap'>
                <div className='info-label'>
                  <label className="">Business Email</label>
                </div>
                <div className='info-value'>
                  <span className="">{enterpriseDataLength && Email != "" ? Utilities.maskString(Utilities.SpecialCharacterDecode(Email)) : '-'}</span>
                </div>
              </div>
              <div className='mb-3 reseller-info-wrap'>
                <div className='info-label'>
                  <label className="">Business Mobile</label>
                </div>
                <div className='info-value'>
                  <span className="">{enterpriseDataLength && Mobile1 != "" ? Utilities.maskString(Mobile1) : '-'}</span>
                </div>
              </div>
              <div className='mb-3 reseller-info-wrap'>
                <div className='info-label'>
                  <label className="">Business Landlines</label>
                </div>
                <div className='info-value'>
                  <span className="">{enterpriseDataLength && (Landline1 != "" || Landline2 != '') ? (Landline1 != "" ? Utilities.maskString(Landline1) : '') + (Landline2 != "" ? " , " + Utilities.maskString(Landline2) : '') : '-'} </span>
                </div>
              </div>
              {/* <div className='mb-3 reseller-info-wrap'>
                <div className='info-label'>
                  <label className="">Whatsapp numbers</label>
                </div>
                <div className='info-value'>
                  <span className="">323232323232</span>
                </div>
              </div> */}
              {/* <div className='mb-3 reseller-info-wrap'>
              <div className='info-label'>
                <label className="">Country operated in?</label>
              </div>
              <div className='info-value'>
                <span className="">Pakistan</span>
              </div>
            </div> */}
              <div className='mb-3 reseller-info-wrap'>
                <div className='info-label'>
                  <label className="">Country operated in?</label>
                </div>
                <div className='info-value'>
                  <span className="">{enterpriseDataLength && Country != "" ? Utilities.SpecialCharacterDecode(Country) : '-'}</span>
                </div>
              </div>
              <div className='mb-3 reseller-info-wrap'>
                <div className='info-label'>
                  <label className="">Short Description about your store</label>
                </div>
                <div className='info-value'>
                  <span className="">{enterpriseDataLength && ShortDescription != "" ? Utilities.SpecialCharacterDecode(ShortDescription) : '-'}</span>
                </div>
              </div>
              <div className='mb-3 reseller-info-wrap'>
                <div className='info-label'>
                  <label className="">Long Description</label>
                </div>
                <div className='info-value'>
                  <span className="" dangerouslySetInnerHTML={{ __html: enterpriseDataLength && LongDescription != "" ? Utilities.SpecialCharacterDecode(LongDescription) : '-' }} ></span>
                </div>
              </div>
              {/* <div className='mb-3 reseller-info-wrap'>
              <div className='info-label'>
                <label className="">Promotional Message</label>
              </div>
              <div className='info-value'>
                <span className="">-</span>
              </div>
            </div> */}

            </div>
          </div>

        </div>

        <Modal isOpen={this.state.EnterpriseInfoModal} toggle={() => this.EnterpriseInfoModal()} className={this.props.className}>
          <ModalHeader toggle={() => this.EnterpriseInfoModal()} >Business Info</ModalHeader>
          <AvForm>
            <ModalBody className='reseller-info-modal'>
              <div className="form-group mb-3 reseller-info-inner">
                <label id="enterpriseName" className="control-label">Business Name
                </label>
                <AvField className="form-control" name="enterpriseName" type="text" value={Utilities.SpecialCharacterDecode(Name)}
                  onChange={(e) => {
                    if (e.target != undefined && e.target.value != undefined) {
                      this.state.EnterpriseInfoData.Name = Utilities.SpecialCharacterEncode(e.target.value)
                      this.setState({ EnterpriseInfoData: this.state.EnterpriseInfoData })
                    }
                  }}
                />
              </div>
              {/* <div className="form-group mb-3 reseller-info-inner">
                    <label id="businessType" className="control-label">Business Type
                    </label>
                    <select class="select2 form-control custom-select" style={{height:"36px"}} >
                      <option value="1">Art & Craft</option>
                      <option value="2">Bed Bath</option>
                      <option value="3">Engineering</option>
                      </select>
                  </div> */}
              <div className="form-group mb-3 reseller-info-inner">
                <label id="businessEmail" className="control-label">Business Email
                </label>
                <AvField className="form-control" name="businessEmail" type="text" value={Utilities.SpecialCharacterDecode(Email)}
                  onChange={(e) => {
                    if (e.target != undefined && e.target.value != undefined) {
                      this.state.EnterpriseInfoData.Email = Utilities.SpecialCharacterEncode(e.target.value)
                      this.setState({ EnterpriseInfoData: this.state.EnterpriseInfoData })
                    }
                  }}
                  validate={{ email: { value: true, errorMessage: 'Enter a valid email' } }}
                />
              </div>
              <div className="form-group mb-3 reseller-info-inner">
                <label id="businessMobile" className="control-label">Business Mobile
                </label>
                <AvField className="form-control" name="businessMobile" type="text" value={Mobile1} onKeyUp={(e) => Utilities.PhoneFormat(e)}
                  onChange={(e) => {
                    Utilities.PhoneFormat(e)
                    if (e.target != undefined && e.target.value != undefined) {
                      this.state.EnterpriseInfoData.Mobile1 = e.target.value
                      this.setState({ EnterpriseInfoData: this.state.EnterpriseInfoData })
                    }
                  }}
                />
              </div>
              <div className="form-group mb-3 reseller-info-inner">
                <label id="businessLandline1" className="control-label">Business Landline 1
                </label>
                <AvField className="form-control" name="businessLandline1" type="text" value={Landline1} onKeyUp={(e) => Utilities.PhoneFormat(e)}
                  onChange={(e) => {
                    Utilities.PhoneFormat(e)
                    if (e.target != undefined && e.target.value != undefined) {
                      this.state.EnterpriseInfoData.Landline1 = e.target.value
                      this.setState({ EnterpriseInfoData: this.state.EnterpriseInfoData })

                    }
                  }}
                />
              </div>
              <div className="form-group mb-3 reseller-info-inner">
                <label id="businessLandline2" className="control-label">Business Landline 2
                </label>
                <AvField className="form-control" name="businessLandline2" type="text" value={Landline2} onKeyUp={(e) => Utilities.PhoneFormat(e)}
                  onChange={(e) => {
                    Utilities.PhoneFormat(e)
                    if (e.target != undefined && e.target.value != undefined) {
                      this.state.EnterpriseInfoData.Landline2 = e.target.value
                      this.setState({ EnterpriseInfoData: this.state.EnterpriseInfoData })
                    }
                  }}
                />
              </div>
              {/* <div className="form-group mb-3 reseller-info-inner">
                <label id="whatsappNumber1" className="control-label">Whatsapp number 1
                </label>
                <AvField name="whatsappNumber1" type="text" className="form-control"
                  validate={{
                    required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                  }}
                />
              </div> */}
              {/* <div className="form-group mb-3 reseller-info-inner">
                <label id="whatsappNumber2" className="control-label">Whatsapp number 2
                </label>
                <AvField name="whatsappNumber2" type="text" className="form-control"
                  validate={{
                    required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                  }}
                />
              </div> */}
              {/* <div className="form-group mb-3 reseller-info-inner">
                <label id="whatsappNumber3" className="control-label">Whatsapp number 3
                </label>
                <AvField name="whatsappNumber3" type="text" className="form-control"
                  validate={{
                    required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                  }}
                />
              </div> */}
              {/* <div className="form-group mb-3 reseller-info-inner">
                <label id="whatsappNumber4" className="control-label">Whatsapp number 4
                </label>
                <AvField name="whatsappNumber4" type="text" className="form-control"
                  validate={{
                    required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                  }}
                />
              </div> */}
              {/* <div className="form-group mb-3 reseller-info-inner">
                <label id="whatsappNumber5" className="control-label">Whatsapp number 5
                </label>
                <AvField name="whatsappNumber5" type="text" className="form-control"
                  validate={{
                    required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                  }}
                />
              </div> */}
              <div className="form-group mb-3 ">
                <label id="shortDesc" className="control-label">Tag Line
                </label>
                <textarea
                  type="text" name="shortDesc" rows="4" maxlength="50" cols="50" id="shortDesc" value={Utilities.SpecialCharacterDecode(ShortDescription)} className="form-control"
                  onChange={(e) => {
                    if (e.target != undefined && e.target.value != undefined) {
                      this.state.EnterpriseInfoData.ShortDescription = Utilities.SpecialCharacterEncode(e.target.value)
                      this.setState({ EnterpriseInfoData: this.state.EnterpriseInfoData })
                    }
                  }}
                ></textarea>
                 <div className='font-12 color-7 mb-3'>
                    <span className="remaining"> {Number(50) - Number(this.state.EnterpriseInfoData.ShortDescription.length)} characters left</span>
                  </div>
              </div>
              <div className="form-group mb-3 ">
                <label id="longDesc" className="control-label">Long Description
                </label>
                <div class="form-group" style={{ flex: "1" }}>
                  <Editor className="Border-outline "
                    editorState={this.state.htmlEditorState}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    value={LongDescription}
                    onEditorStateChange={this.onEditorStateChange}
                    id="desc"
                  />
                </div>
              </div>

              <div className='d-flex align-items-start flex-column flex-sm-row  mb-4' style={{ minHeight: 250 }}>
                <label id="name" class="control-label mr-2 modalsettings mt-2">Country operated in ?</label>
                <div class="form-group w-100" style={{ flex: "1" }}>
                  
                <ReactFlagsSelect
                  searchPlaceholder="Search countries"
                  searchable
                  selected={this.state.selectedCode}
                  onSelect={(code) => this.setSelected(code)}
                />
                </div>
              </div>


            </ModalBody>
            <FormGroup className="modal-footer" >
              <div className='mr-auto'> <label id="name" class="control-label mt-2 text-danger"></label>
              </div>
              <div>
                <Button className='mr-2 text-dark' color="secondary" onClick={() => this.EnterpriseInfoModal()}>Cancel</Button>
                <Button color="primary" onClick={() => this.saveEnterpriseInfo()}>
                  {this.state.isSaving ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                    : <span className="comment-text">{Labels.Save}</span>}
                </Button>
              </div>
            </FormGroup>
          </AvForm>
        </Modal>

      </div>
    );
  }
}

export default EnterpriseInfo;
