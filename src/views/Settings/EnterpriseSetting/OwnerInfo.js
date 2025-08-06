import React, { Component, Fragment } from 'react';
import { FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader, Table, Alert } from 'reactstrap';
import * as EnterpriseSettingService from '../../../service/EnterpriseSetting';
import * as Utilities from '../../../helpers/Utilities';
import Constants from '../../../helpers/Constants';
import { AvForm, AvField, AvInput } from 'availity-reactstrap-validation';
import Loader from 'react-loader-spinner';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import 'rc-time-picker/assets/index.css';
import Labels from '../../../containers/language/labels';


class OwnerInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      OwnerInfo: false,
      ownerInfoData: this.props != undefined && this.props.enterpriseInfo != undefined ? this.props.enterpriseInfo : {},
      InfoData: this.props != undefined && this.props.enterpriseInfo != undefined ? JSON.stringify(this.props.enterpriseInfo) : {},
      isSaving: false,
    };
  }


  OwnerInfoModal() {
    this.setState({
      OwnerInfo: !this.state.OwnerInfo,
    }, () => {
      if (this.state.OwnerInfo == false) {
        this.state.ownerInfoData = JSON.parse(this.state.InfoData)
        this.setState({ ownerInfoData: this.state.ownerInfoData })
      }
    })
  }

  saveOwnerInfo = async () => {
    try {
      this.setState({ isSaving: true })
      const { FirstName, SurName, PrimaryEmail, Mobile1, Mobile2, LandLine1, LandLine2 } = this.state.ownerInfoData.OwnerInfo;
      var message = '';
      var ownerInfo = {}
      ownerInfo.FirstName = Utilities.removeExtraSpaces(FirstName)
      ownerInfo.SurName = Utilities.removeExtraSpaces(SurName)
      ownerInfo.PrimaryEmail = Utilities.removeExtraSpaces(PrimaryEmail)
      ownerInfo.Mobile1 = Utilities.removeExtraSpaces(Mobile1)
      ownerInfo.Mobile2 = Utilities.removeExtraSpaces(Mobile2)
      ownerInfo.LandLine1 = Utilities.removeExtraSpaces(LandLine1)
      ownerInfo.LandLine2 = Utilities.removeExtraSpaces(LandLine2)
      let response = await EnterpriseSettingService.OwnerInfo(ownerInfo)
      if (response != undefined && response.Message == undefined) {
        message = `Owner info updated successfully.`
        Utilities.notify(message, 's');
        this.props.GetEnterpriseHealth()
        this.setState({ isSaving: false, OwnerInfo: false, InfoData: JSON.stringify(this.state.ownerInfoData) })
        return
      }
      message = `${response.Message}.`
      Utilities.notify(message, 'e');
      this.setState({ isSaving: false, OwnerInfo: false, ownerInfoData: this.state.ownerInfoData })

    } catch (e) {
      this.setState({ isSaving: false, OwnerInfo: false })
      console.log('Error in saving OwnerInfo', e)
    }
  }

  render() {
    const enterpriseDataLength = Object.keys(this.state.ownerInfoData).length > 0
    const { FirstName, SurName, PrimaryEmail, Mobile1, Mobile2, LandLine1, LandLine2 } = this.state.ownerInfoData.OwnerInfo;
    return (
      <div className='card-body mx-0'>
        <div class="row">
          <div className="m-3 mb-4 p-4 w-100" style={{ boxShadow: "0 0 5px #00000030" }}>
            <div className='calc-width'>
              <div class="d-flex align-items-baseline mb-4" >
                <h5>Owner Info</h5>
                <a onClick={() => this.OwnerInfoModal()} class="ml-5 cursor-pointer text-primary"><i class="fa fa-edit mr-1"></i>Edit</a>
              </div>
              <div className='reseller-info-main-wrap'>
                <div className='mb-3 reseller-info-wrap'>
                  <div className='info-label'>
                    <label className="">First Name</label>
                  </div>
                  <div className='info-value'>
                    <span className="">{enterpriseDataLength && FirstName != "" ? Utilities.SpecialCharacterDecode(FirstName) : '-'}</span>
                  </div>
                </div>
                <div className='mb-3 reseller-info-wrap'>
                  <div className='info-label'>
                    <label className="">Surname</label>
                  </div>
                  <div className='info-value'>
                    <span className="">{enterpriseDataLength && SurName != "" ? Utilities.SpecialCharacterDecode(SurName) : '-'}</span>
                  </div>
                </div>
                <div className='mb-3 reseller-info-wrap'>
                  <div className='info-label'>
                    <label className="">Primary Email</label>
                  </div>
                  <div className='info-value'>
                    <span className="">{enterpriseDataLength && PrimaryEmail != "" ? Utilities.maskString(Utilities.SpecialCharacterDecode(PrimaryEmail)) : '-'}</span>
                  </div>
                </div>
                <div className='mb-3 reseller-info-wrap'>
                  <div className='info-label'>
                    <label className="">Mobile1</label>
                  </div>
                  <div className='info-value'>
                    <span className="">{enterpriseDataLength && Mobile1 != "" ? Utilities.maskString(Mobile1) : '-'}</span>
                  </div>
                </div>
                <div className='mb-3 reseller-info-wrap'>
                  <div className='info-label'>
                    <label className="">Mobile2</label>
                  </div>
                  <div className='info-value'>
                    <span className="">{enterpriseDataLength && Mobile2 != "" ? Utilities.maskString(Mobile2) : '-'}</span>
                  </div>
                </div>
                <div className='mb-3 reseller-info-wrap'>
                  <div className='info-label'>
                    <label className="">Landline1</label>
                  </div>
                  <div className='info-value'>
                    <span className="">{enterpriseDataLength && LandLine1 != "" ? Utilities.maskString(LandLine1) : '-'}</span>
                  </div>
                </div>
                <div className='mb-3 reseller-info-wrap'>
                  <div className='info-label'>
                    <label className="">Landline2</label>
                  </div>
                  <div className='info-value'>
                    <span className="">{enterpriseDataLength && LandLine2 != "" ? Utilities.maskString(LandLine2) : '-'}</span>
                  </div>
                </div>
                {/* <div className='mb-3 reseller-info-wrap'>
              <div className='info-label'>
                <label className="">Landline2</label>
              </div>
              <div className='info-value'>
                <span className="">-</span>
              </div>
            </div> */}


              </div>
            </div>

          </div>
          {/* <div class="col-md-12 text-sizes">
            <div className="d-flex align-items-baseline" style={{ marginBottom: "25px" }}>
              <h5>{Labels.OwnerInfo}</h5>
              <a class="ml-5 text-primary cursor-pointer" onClick={() => this.OwnerInfoModal()}><i class="fa fa-edit mr-1"></i>{Labels.Edit}</a>
            </div>

            <div className="mb-1" style={{ maxWidth: "800px" }}>
              <div className="row mb-3">
                <label className="col-lg-3 fw-semibold text-muted mb-0">{Labels.FirstName}</label>
                <div className="col-lg-8">
                  <span className="fw-bold fs-6 text-gray-800">
                    {enterpriseDataLength && FirstName != "" ? Utilities.SpecialCharacterDecode(FirstName) : '-'}
                    </span>
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-lg-3 fw-semibold text-muted mb-0">{Labels.Surname}</label>
                <div className="col-lg-8">
                  <span className="fw-bold fs-6 text-gray-800">{enterpriseDataLength && SurName != "" ? Utilities.SpecialCharacterDecode(SurName) : '-'}</span>
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-lg-3 fw-semibold text-muted mb-0">{Labels.PrimaryEmail}</label>
                <div className="col-lg-8">
                  <span className="fw-bold fs-6 text-gray-800">{enterpriseDataLength && PrimaryEmail != "" ? Utilities.SpecialCharacterDecode(PrimaryEmail) : '-'}</span>
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-lg-3 fw-semibold text-muted mb-0">{Labels.Mobile1}</label>
                <div className="col-lg-8">
                  <span className="fw-bold fs-6 text-gray-800">{enterpriseDataLength && Mobile1 != "" ? Mobile1 : '-'}</span>
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-lg-3 fw-semibold text-muted mb-0">{Labels.Mobile2}</label>
                <div className="col-lg-8">
                  <span className="fw-bold fs-6 text-gray-800">{enterpriseDataLength && Mobile2 != "" ? Mobile2 : '-'}</span>
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-lg-3 fw-semibold text-muted mb-0">{Labels.Landline1}</label>
                <div className="col-lg-8">
                  <span className="fw-bold fs-6 text-gray-800">{enterpriseDataLength && LandLine1 != "" ? LandLine1 : '-'}</span>
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-lg-3 fw-semibold text-muted mb-0">{Labels.Landline2}</label>
                <div className="col-lg-8">
                  <span className="fw-bold fs-6 text-gray-800">{enterpriseDataLength && LandLine2 != "" ? LandLine2 : '-'}</span>
                </div>
              </div>
            </div>
          </div> */}
        </div>


        <Modal isOpen={this.state.OwnerInfo} toggle={() => this.OwnerInfoModal()} className={this.props.className}>
          <ModalHeader toggle={() => this.OwnerInfoModal()} >Owner Info</ModalHeader>
          <AvForm>
            <ModalBody className='reseller-info-modal'>
              <div className='row'>
                <div className="form-group mb-3 col-md-6">
                  <label id="firstName" className="control-label">First Name
                  </label>
                  <AvField className="form-control" name="firstName" type="text" value={Utilities.SpecialCharacterDecode(FirstName)}
                    onChange={(e) => {
                      if (e.target != undefined && e.target.value != undefined) {
                        this.state.ownerInfoData.OwnerInfo.FirstName = Utilities.SpecialCharacterEncode(e.target.value)
                        this.setState({ ownerInfoData: this.state.ownerInfoData })
                      }
                    }}
                  />
                </div>
                <div className="form-group mb-3 col-md-6">
                  <label id="surName" className="control-label">Surname
                  </label>
                  <AvField className="form-control" name="surName" type="text" value={Utilities.SpecialCharacterDecode(SurName)}
                    onChange={(e) => {
                      if (e.target != undefined && e.target.value != undefined) {
                        this.state.ownerInfoData.OwnerInfo.SurName = Utilities.SpecialCharacterEncode(e.target.value)
                        this.setState({ ownerInfoData: this.state.ownerInfoData })
                      }
                    }}
                  />
                </div>
              </div>

              <div className="form-group mb-3">
                <label id="Primaryemail" className="control-label">Primary Email
                </label>
                <AvField className="form-control" name="Primaryemail" type="email" value={Utilities.SpecialCharacterDecode(PrimaryEmail)}
                  onChange={(e) => {
                    if (e.target != undefined && e.target.value != undefined) {
                      this.state.ownerInfoData.OwnerInfo.PrimaryEmail = Utilities.SpecialCharacterEncode(e.target.value)
                      this.setState({ ownerInfoData: this.state.ownerInfoData })
                    }
                  }}
                  validate={{ email: { value: true, errorMessage: 'Enter a valid email' } }}
                />
              </div>
              <div className="form-group mb-3">
                <label id="mobile1" className="control-label">Mobile1
                </label>
                <AvField className="form-control" name="mobile1" type="text" value={Utilities.SpecialCharacterDecode(Mobile1)} onKeyUp={(e) => Utilities.PhoneFormat(e)}
                  onChange={(e) => {
                    Utilities.PhoneFormat(e)
                    if (e.target != undefined && e.target.value != undefined) {
                      this.state.ownerInfoData.OwnerInfo.Mobile1 = Utilities.SpecialCharacterEncode(e.target.value)
                      this.setState({ ownerInfoData: this.state.ownerInfoData })
                    }
                  }}
                />
              </div>
              <div className="form-group mb-3">
                <label id="mobile2" className="control-label">Mobile2
                </label>
                <AvField className="form-control" name="mobile2" type="text" value={Utilities.SpecialCharacterDecode(Mobile2)} onKeyUp={(e) => Utilities.PhoneFormat(e)}
                  onChange={(e) => {
                    Utilities.PhoneFormat(e)
                    if (e.target != undefined && e.target.value != undefined) {
                      this.state.ownerInfoData.OwnerInfo.Mobile2 = Utilities.SpecialCharacterEncode(e.target.value)
                      this.setState({ ownerInfoData: this.state.ownerInfoData })
                    }
                  }}
                />
              </div>
              <div className="form-group mb-3">
                <label id="landline1" className="control-label">Landline1
                </label>
                <AvField className="form-control" name="landline1" type="text" value={Utilities.SpecialCharacterDecode(LandLine1)} onKeyUp={(e) => Utilities.PhoneFormat(e)}
                  onChange={(e) => {
                    Utilities.PhoneFormat(e)
                    if (e.target != undefined && e.target.value != undefined) {
                      this.state.ownerInfoData.OwnerInfo.LandLine1 = Utilities.SpecialCharacterEncode(e.target.value)
                      this.setState({ ownerInfoData: this.state.ownerInfoData })
                    }
                  }}
                />
              </div>
              <div className="form-group mb-3">
                <label id="landline1" className="control-label">Landline2
                </label>
                <AvField className="form-control" name="LandLine2" type="text" value={Utilities.SpecialCharacterDecode(LandLine2)} onKeyUp={(e) => Utilities.PhoneFormat(e)}
                  onChange={(e) => {
                    Utilities.PhoneFormat(e)
                    if (e.target != undefined && e.target.value != undefined) {
                      this.state.ownerInfoData.OwnerInfo.LandLine2 = Utilities.SpecialCharacterEncode(e.target.value)
                      this.setState({ ownerInfoData: this.state.ownerInfoData })
                    }
                  }}
                />
              </div>
              {/* <div className="form-group mb-3">
                    <label id="landline2" className="control-label">Landline2
                    </label>
                    <AvField  name="landline2" type="text" className="form-control"
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                      }}
                    />
                  </div> */}

            </ModalBody>
            <FormGroup className="modal-footer" >
              <div className='mr-auto'> <label id="name" class="control-label mt-2 text-danger"></label>
              </div>
              <div>
                <Button className='mr-2 text-dark' color="secondary" onClick={() => this.OwnerInfoModal()}>Cancel</Button>
                <Button color="primary" onClick={() => this.saveOwnerInfo()} >
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

export default OwnerInfo;
