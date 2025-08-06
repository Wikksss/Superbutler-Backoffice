import React, { Component } from 'react';
import * as CountryService from '../../service/Country';
import { FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader, Table, Alert, Input } from 'reactstrap';
import Loader from 'react-loader-spinner';
import * as Utilities from '../../helpers/Utilities';
import { AvForm, AvField, AvRadioGroup, AvRadio } from 'availity-reactstrap-validation';
import SweetAlert from 'sweetalert-react';
import GlobalData from '../../helpers/GlobalData';
import { parentCountryCode } from '../../helpers/GlobalData';
import 'sweetalert/dist/sweetalert.css';
import Labels from '../../containers/language/labels';

class CountryConfig extends Component {
    constructor(props) {
        super(props)
        this.state = {
            countryList: [],
            activeCountries: [],
            step: 0,
            ShowLoader: true,
            inactiveCountryCheck: false,
            selectedCountry: '',
            countryId: 0,
            sweetAlertCheck: false,
            sweetAlertTitle: '',
            sweetAlertMessage: '',

            //configuration variables
            applicationId: "",
            baseImageUrl: "",
            baseUrl: "",
            bundleId: "",
            country: "",
            creditCardPay: "",
            currency: "",
            decimalPlace: 0,
            distanceUnit: "",
            hasLocaldb: false,
            homeRotatingImages: "",
            iosAppId: 0,
            recommendIncentive: 0,
            recommendPage: "",
            referralTermsAndConditionLink: "",
            reportProblem: "",
            restaurantName: "",
            salesTax: "",
            supportEmail: "",
            termsAndConditionLink: "",
            timezone: "",
            useAutocomplete: false,
            webUrl: "",
            google_APIKey: '',
            faq: '',
            orderTimeThreshold: 30,
            liveChat: '',
            liveChatHelper: '',
            liveChatHelperKey: '',
            language: '',

        }
        this.getAllCountries()
    }

    getAllCountries = async () => {
        try {
            let response = await CountryService.getAllCountries()
            if (response.length > 0) {
                this.setState({
                    countryList: response.sort((a, b) => a.SortOrder - b.SortOrder),
                    ShowLoader: false
                })
            } else {
                console.log('something went wrong')
            }
        } catch (error) {
            console.log('something went wrong'.error.message)
        }
    }

    getActiveCountries = async () => {
        try {
            let response = await CountryService.getActiveCountries()
            if (response.length > 0) {
                this.setState({
                    activeCountries: response.sort((a, b) => a.SortOrder - b.SortOrder),
                    ShowLoader: false
                })
            } else {
                console.log('something went wrong')
            }
        } catch (error) {
            console.log('something went wrong'.error.message)
        }
    }

    loading = () => <div className="page-laoder-users">
        <div className="loader-menu-inner">
            <Loader type="Oval" color="#ed0000" height={50} width={50} />
            <div className="loading-label">Loading.....</div>
        </div>
    </div>

    LoadCountryList(activeCountries) {
        var htmlActiveCountries = [];
        var htmlInactiveCountries = [];
        let data = [];
        var activeCountry = activeCountries
        var callingCode = GlobalData.restaurants_data.Supermeal_dev.countryCode;
        var primaryCountryCode = parentCountryCode;
        data = activeCountries.filter(a => a.CallingCode == callingCode)
        if (data.length > 0 && data[0].CallingCode != primaryCountryCode) {
            this.loadCountryConfig(data[0])
        }

        if (this.state.ShowLoader === true) {
            return this.loading()
        }
        {
            activeCountries.map((res, ind) => {
                var activeCountry = res.InProduction == 1
                if (res.InProduction == 1) {
                    htmlActiveCountries.push(
                        <div key={ind} style={{ justifyContent: 'space-between', marginBottom: 15, marginTop: 15, display: 'flex', alignItems: 'center', maxWidth: 350 }}>
                            <div style={{ cursor: 'pointer', alignItems: 'center', display: 'flex' }} onClick={() => {
                                this.loadCountryConfig(res)
                            }}>
                                <img style={{ marginBottom: 0, height: 30, width: 30, marginRight: 10 }} src={Utilities.generatePhotoLargeURL(res.Flag)} />
                                {res.Name}
                            </div>

                            {/* <span onClick={() => { this.inactiveFunction(res) }} className="c-inactive">
                                Inactive
                            </span> */}

                        </div>

                    )
                }
            }
            )
        }
        {
            activeCountries.map((res, ind) => {
                if (res.InProduction == 0) {
                    htmlInactiveCountries.push(
                        <div key={ind} style={{ justifyContent: 'space-between', marginBottom: 15, marginTop: 15, display: 'flex', alignItems: 'center', maxWidth: 350 }}>
                            <div style={{ cursor: 'pointer', alignItems: 'center', display: 'flex' }} onClick={() => {
                                this.loadCountryConfig(res)
                            }}>
                                {
                                    res.Flag != '' ?
                                        <img style={{ marginBottom: 0, height: 30, width: 30, marginRight: 10 }} src={Utilities.generatePhotoLargeURL(res.Flag)} />
                                        :
                                        <img style={{ marginBottom: 0, height: 30, width: 30, marginRight: 10 }} src={require('../../assets/globe.png')} />
                                }
                                {res.Name}
                            </div>

                            {/* <span onClick={() => { this.activeFunction(res) }} className="c-active">
                                Activate
                            </span> */}

                        </div>

                    )
                }
            }
            )
        }

        return (
            <div style={{ marginTop: 20 }}>
                <div className="country-list">
                    <h5 style={{ fontWeight: 'bold' }} >{Labels.Active_Countries}</h5>
                    <span>{htmlActiveCountries}</span>
                </div>
                <div className="country-list">
                    <h5 style={{ fontWeight: 'bold', marginTop: 30 }}>{Labels.Inactive_Countries}</h5>
                    <span>{htmlInactiveCountries}</span>
                </div>

            </div>
        )

    }

    inactiveFunction = (res) => {
        this.setState({ inactiveCountryCheck: true, selectedCountry: res.Name, countryId: res.Id })
    }

    activeFunction = (res) => {
        this.setState({
            applicationId: "",
            baseImageUrl: "",
            baseUrl: "",
            bundleId: "",
            country: "",
            creditCardPay: "",
            currency: "",
            decimalPlace: 0,
            distanceUnit: "",
            hasLocaldb: false,
            homeRotatingImages: "",
            iosAppId: 0,
            recommendIncentive: 0,
            recommendPage: "",
            referralTermsAndConditionLink: "",
            reportProblem: "",
            restaurantName: "",
            salesTax: "",
            supportEmail: "",
            termsAndConditionLink: "",
            timezone: "",
            useAutocomplete: false,
            webUrl: "",
            google_APIKey: '',
            step: 1,
            faq: '',
            orderTimeThreshold: '',
            liveChat: '',
            liveChatHelper: '',
            liveChatHelperKey: '',
            language: '',
            countryId: res.Id
        })
    }

    loadCountryConfig = (country) => {
        var configuration = JSON.parse(country.Configuration)
        this.setState({
            step: 1,
            applicationId: configuration.applicationId,
            baseImageUrl: configuration.baseImageUrl,
            baseUrl: configuration.baseUrl,
            bundleId: configuration.bundleId,
            country: configuration.country,
            creditCardPay: configuration.creditCardPay,
            currency: configuration.currency,
            decimalPlace: configuration.decimalPlace,
            distanceUnit: configuration.distanceUnit,
            hasLocaldb: configuration.hasLocaldb,
            homeRotatingImages: configuration.homeRotatingImages,
            iosAppId: configuration.iosAppId,
            recommendIncentive: configuration.recommendIncentive,
            recommendPage: configuration.recommendPage,
            referralTermsAndConditionLink: configuration.referralTermsAndConditionLink,
            reportProblem: configuration.reportProblem,
            restaurantName: configuration.restaurantName,
            salesTax: configuration.salesTax,
            supportEmail: configuration.supportEmail,
            termsAndConditionLink: configuration.termsAndConditionLink,
            timezone: configuration.timezone,
            useAutocomplete: configuration.useAutocomplete,
            webUrl: configuration.webUrl,
            google_APIKey: configuration.google_APIKey == undefined ? '' : configuration.google_APIKey,
            selectedCountry: country.Name,
            countryId: country.Id,
            faq: configuration.faq == undefined ? '' : configuration.faq,
            orderTimeThreshold: configuration.orderTimeThreshold == undefined || configuration.orderTimeThreshold == "" ? 30 : configuration.orderTimeThreshold,
            liveChat: configuration.liveChat == undefined ? '' : configuration.liveChat,
            liveChatHelper: configuration.liveChatHelper == undefined ? '' : configuration.liveChatHelper,
            liveChatHelperKey: configuration.liveChatHelperKey == undefined ? '' : configuration.liveChatHelperKey,
            language: configuration.language == undefined ? '' : configuration.language,
        })
    }

    submitConfig = async () => {
        try {
            // console.log(this.state)
            if (this.state.baseUrl == undefined || this.state.baseUrl == "") {
                this.setState({
                    sweetAlertMessage: 'Base url cannot be empty!',
                    sweetAlertTitle: 'Alert',
                    sweetAlertCheck: true,
                })
                return
            }
            if (this.state.baseImageUrl == undefined || this.state.baseImageUrl == "") {
                this.setState({
                    sweetAlertMessage: 'Base image url cannot be empty!',
                    sweetAlertTitle: 'Alert',
                    sweetAlertCheck: true,
                })
                return
            }
            this.validateUrls()
            var config = {
                applicationId: this.state.applicationId,
                baseImageUrl: this.state.baseImageUrl,
                baseUrl: this.state.baseUrl,
                bundleId: this.state.bundleId,
                country: this.state.country,
                creditCardPay: this.state.creditCardPay,
                currency: this.state.currency,
                decimalPlace: this.state.decimalPlace == '' ? '' : parseInt(this.state.decimalPlace),
                distanceUnit: this.state.distanceUnit,
                hasLocaldb: this.state.hasLocaldb,
                homeRotatingImages: this.state.homeRotatingImages,
                iosAppId: this.state.iosAppId == '' ? '' : parseInt(this.state.iosAppId),
                recommendIncentive: this.state.recommendIncentive == '' ? '' : parseInt(this.state.recommendIncentive),
                recommendPage: this.state.recommendPage,
                referralTermsAndConditionLink: this.state.referralTermsAndConditionLink,
                reportProblem: this.state.reportProblem,
                restaurantName: this.state.restaurantName,
                salesTax: this.state.salesTax,
                supportEmail: this.state.supportEmail,
                termsAndConditionLink: this.state.termsAndConditionLink,
                timezone: this.state.timezone,
                useAutocomplete: this.state.useAutocomplete,
                webUrl: this.state.webUrl,
                google_APIKey: this.state.google_APIKey,
                faq: this.state.faq,
                orderTimeThreshold: this.state.orderTimeThreshold == '' ? '' : parseInt(this.state.orderTimeThreshold),
                liveChat: this.state.liveChat,
                liveChatHelper: this.state.liveChatHelper,
                liveChatHelperKey: this.state.liveChatHelperKey,
                language: this.state.language,
            }
            var jsonConfig = JSON.stringify(config)
            let response = await CountryService.updateCountryConfig(this.state.countryId, jsonConfig)
            if (response != undefined) {
                this.setState({ step: 0 })
                this.getAllCountries()
            } else {
                this.setState({ step: 0 })
            }
        } catch (error) {
            console.log('Error', error.message)
        }

    }

    validateUrls = () => {
        if (this.state.creditCardPay != '') {
            var check = Utilities.urlValidation(this.state.creditCardPay)
            if (!check) {
                this.setState({
                    sweetAlertMessage: 'Credit card pay url is invalid',
                    sweetAlertTitle: 'Invalid Url',
                    sweetAlertCheck: true,
                })
                return
            }
        }
        if (this.state.recommendPage != '') {
            var check = Utilities.urlValidation(this.state.recommendPage)
            if (!check) {
                this.setState({
                    sweetAlertMessage: 'Recommend Page url is invalid',
                    sweetAlertTitle: 'Invalid Url',
                    sweetAlertCheck: true,
                })
                return
            }
        }
        if (this.state.referralTermsAndConditionLink != '') {
            var check = Utilities.urlValidation(this.state.referralTermsAndConditionLink)
            if (!check) {
                this.setState({
                    sweetAlertMessage: 'Referral Terms and Condition Link is invalid',
                    sweetAlertTitle: 'Invalid Url',
                    sweetAlertCheck: true,
                })
                return
            }
        }
        if (this.state.reportProblem != '') {
            var check = Utilities.urlValidation(this.state.reportProblem)
            if (!check) {
                this.setState({
                    sweetAlertMessage: 'Report problem url is invalid',
                    sweetAlertTitle: 'Invalid Url',
                    sweetAlertCheck: true,
                })
                return
            }
        }
        if (this.state.termsAndConditionLink != '') {
            var check = Utilities.urlValidation(this.state.termsAndConditionLink)
            if (!check) {
                this.setState({
                    sweetAlertMessage: 'Terms and Condition Link is invalid',
                    sweetAlertTitle: 'Invalid Url',
                    sweetAlertCheck: true,
                })
                return
            }
        }
        if (this.state.webUrl != '') {
            var check = Utilities.urlValidation(this.state.webUrl)
            if (!check) {
                this.setState({
                    sweetAlertMessage: 'Web Url is invalid',
                    sweetAlertTitle: 'Invalid Url',
                    sweetAlertCheck: true,
                })
                return
            }
        }
        if (this.state.faq != '') {
            var check = Utilities.urlValidation(this.state.faq)
            if (!check) {
                this.setState({
                    sweetAlertMessage: 'faq url is invalid',
                    sweetAlertTitle: 'Invalid Url',
                    sweetAlertCheck: true,
                })
                return
            }
        }
        if (this.state.liveChat != '') {
            var check = Utilities.urlValidation(this.state.liveChat)
            if (!check) {
                this.setState({
                    sweetAlertMessage: 'Live Chat url is invalid',
                    sweetAlertTitle: 'Invalid Url',
                    sweetAlertCheck: true,
                })
                return
            }
        }
        if (this.state.liveChatHelper != '') {
            var check = Utilities.urlValidation(this.state.liveChatHelper)
            if (!check) {
                this.setState({
                    sweetAlertMessage: 'Live Chat Helper url is invalid',
                    sweetAlertTitle: 'Invalid Url',
                    sweetAlertCheck: true,
                })
                return
            }
        }
        if (this.state.baseImageUrl != '') {
            var check = Utilities.urlValidation(this.state.baseImageUrl)
            if (!check) {
                this.setState({
                    sweetAlertMessage: 'Base image url is invalid',
                    sweetAlertTitle: 'Invalid Url',
                    sweetAlertCheck: true,
                })
                return
            }
        }
        if (this.state.baseUrl != '') {
            var check = Utilities.urlValidation(this.state.baseUrl)
            if (!check) {
                this.setState({
                    sweetAlertMessage: 'Base url is invalid',
                    sweetAlertTitle: 'Invalid Url',
                    sweetAlertCheck: true,
                })
                return
            }
        }
    }

    generateSweetAlert = () => {
        return (
            <SweetAlert
                show={this.state.inactiveCountryCheck}
                //title={this.state.alertModelTitle}
                title={'Are you sure!'}
                text={'Are you sure you want to inactivate ' + this.state.selectedCountry}
                onConfirm={() => this.setState({ inactiveCountryCheck: false })}
                onEscapeKey={() => this.setState({ inactiveCountryCheck: false })}
                showCancelButton
                confirmButtonText="Yes"
                onCancel={() => {
                    this.setState({ inactiveCountryCheck: false });
                }}
            // onOutsideClick={() => this.setState({ showAlert: false })}
            />
        )
    }
    popSweetAlert = () => {
        return (
            <SweetAlert
                show={this.state.sweetAlertCheck}
                //title={this.state.alertModelTitle}
                title={this.state.sweetAlertTitle}
                text={this.state.sweetAlertMessage}
                onConfirm={() => this.setState({ sweetAlertCheck: false })}
                onEscapeKey={() => this.setState({ sweetAlertCheck: false })}
                // showCancelButton
                confirmButtonText="Okay"
            // onCancel={() => {
            //     this.setState({ sweetAlertCheck: false });
            // }}
            // onOutsideClick={() => this.setState({ showAlert: false })}
            />
        )
    }


    render() {

        const { activeCountries, countryList } = this.state
        if (this.state.step == 0) {
            return (
                <div>

                    <div className="card">
                    <div className="m-b-20 card-new-title">
                                <h3 className="card-title">Country List</h3>

                                {this.LoadCountryList(countryList)}

                            </div>
                        <div className="card-body">
                     
                        </div>

                    </div>
                    {this.generateSweetAlert()}



                </div>
            )
        } else {
            return (
                <div className="card">
                     <h3 className="card-title">{Labels.Country_Config}</h3>
                    <div className="card-body">
                        <div className="m-b-20">
                           
                            <div style={{ marginTop: 20 }} className="row">
                                <div className="col-md-6 ">
                                    <div className="form-group mb-3">
                                        <AvForm>
                                            <div className="form-body">
                                                <div className="formPadding">
                                                    <label id="name" className="control-label">{Labels.Country}</label>
                                                    <AvField onChange={(e) => {
                                                        if (e.target != undefined && e.target.value != undefined) {
                                                            var value = e.target.value
                                                            this.state.country = value
                                                        }
                                                    }} name="txtName" value={this.state.country} type="text" className="form-control"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <AvForm>
                                            <div className="form-body">
                                                <div className="formPadding">
                                                    <label id="name" className="control-label">{Labels.Application_Id}</label>
                                                    <AvField onChange={(e) => {
                                                        if (e.target != undefined && e.target.value != undefined) {
                                                            var value = e.target.value
                                                            this.state.applicationId = value
                                                        }
                                                    }} name="txtName" value={this.state.applicationId} type="text" className="form-control"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>


                            </div>
                            <div className="row">
                                <div className="col-md-6 ">
                                    <div className="form-group mb-3">
                                        <AvForm>
                                            <div className="form-body">
                                                <div className="formPadding">
                                                    <label id="name" className="control-label">{Labels.Base_Image_Url}</label>
                                                    <AvField
                                                        onBlur={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                if (e.target.value != '') {
                                                                    var check = Utilities.urlValidation(e.target.value)
                                                                    if (!check) {
                                                                        this.setState({
                                                                            sweetAlertMessage: 'Invalid base image url!',
                                                                            sweetAlertTitle: 'Alert',
                                                                            sweetAlertCheck: true,
                                                                        })
                                                                    }
                                                                }
                                                            }
                                                        }}

                                                        onChange={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                var value = e.target.value
                                                                this.state.baseImageUrl = value
                                                            }
                                                        }} name="txtName" value={this.state.baseImageUrl} type="text" className="form-control"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <AvForm>
                                            <div className="form-body">
                                                <div className="formPadding">
                                                    <label id="name" className="control-label">{Labels.Base_Url}</label>
                                                    <AvField
                                                        onBlur={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                if (e.target.value != '') {
                                                                    var check = Utilities.urlValidation(e.target.value)
                                                                    if (!check) {
                                                                        this.setState({
                                                                            sweetAlertMessage: 'Invalid base url!',
                                                                            sweetAlertTitle: 'Alert',
                                                                            sweetAlertCheck: true,
                                                                        })
                                                                    }
                                                                }
                                                            }
                                                        }}

                                                        onChange={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                var value = e.target.value
                                                                this.state.baseUrl = value
                                                            }
                                                        }} name="txtName" value={this.state.baseUrl} type="text" className="form-control"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 ">
                                    <div className="form-group mb-3">
                                        <AvForm>
                                            <div className="form-body">
                                                <div className="formPadding">
                                                    <label id="name" className="control-label">{Labels.Bundle_Id}</label>
                                                    <AvField onChange={(e) => {
                                                        if (e.target != undefined && e.target.value != undefined) {
                                                            var value = e.target.value
                                                            this.state.bundleId = value
                                                        }
                                                    }} name="txtName" value={this.state.bundleId} type="text" className="form-control"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <AvForm>
                                            <div className="form-body">
                                                <div className="formPadding">
                                                    <label id="name" className="control-label">{Labels.Credit_Card_Pay}</label>
                                                    <AvField
                                                        onBlur={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                if (e.target.value != '') {
                                                                    var check = Utilities.urlValidation(e.target.value)
                                                                    if (!check) {
                                                                        this.setState({
                                                                            sweetAlertMessage: 'Invalid url!',
                                                                            sweetAlertTitle: 'Alert',
                                                                            sweetAlertCheck: true,
                                                                        })
                                                                    }
                                                                }
                                                            }
                                                        }}
                                                        onChange={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                var value = e.target.value
                                                                this.state.creditCardPay = value
                                                            }
                                                        }} name="txtName" value={this.state.creditCardPay} type="text" className="form-control"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>
                            </div>
                            <div className="row">

                                <div className="col-md-6 ">
                                    <div className="form-group mb-3">
                                        <AvForm>
                                            <div className="form-body">
                                                <div className="formPadding">
                                                    <label id="name" className="control-label">{Labels.Distance_Unit}</label>
                                                    <AvField onChange={(e) => {
                                                        if (e.target != undefined && e.target.value != undefined) {
                                                            var value = e.target.value
                                                            this.state.distanceUnit = value
                                                        }
                                                    }} name="txtName" value={this.state.distanceUnit} type="text" className="form-control"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <AvForm>
                                            <div className="form-body">
                                                <div className="formPadding">
                                                    <label id="name" className="control-label">{Labels.Local_db}</label>
                                                    {/* <AvField name="txtName" value={this.state.baseUrl} type="text" className="form-control"
                                                        required
                                                    /> */}
                                                    <AvRadioGroup onChange={(e) => {
                                                        if (e.target != undefined && e.target.value != undefined) {
                                                            var value = e.target.value == 'false' ? false : true
                                                            this.state.hasLocaldb = value
                                                        }
                                                    }} inline name="hasLocaldb" value={this.state.hasLocaldb}>
                                                        <AvRadio label="True" value={true} />
                                                        <AvRadio label="False" value={false} />

                                                    </AvRadioGroup>
                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 ">
                                    <div className="form-group mb-3">
                                        <AvForm>
                                            <div className="form-body">
                                                <div className="formPadding">
                                                    <label id="name" className="control-label">{Labels.Home_Rotating_Images}</label>
                                                    <AvField onChange={(e) => {
                                                        if (e.target != undefined && e.target.value != undefined) {
                                                            var value = e.target.value
                                                            this.state.homeRotatingImages = value
                                                        }
                                                    }} name="txtName" value={this.state.homeRotatingImages} type="text" className="form-control"
                                                        required
                                                    />
                                                    <div className="field-images">
                                                        <div className="field-inner-wrap">
                                                            <img src="https://cdn.superme.al/s/ae/images/pizza-home.png" />
                                                        </div>
                                                        <a className="image-plus-btn">+</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <AvForm>
                                            <div className="form-body">
                                                <div className="formPadding">
                                                    <label id="name" className="control-label">{Labels.Ios_App_Id}</label>
                                                    <AvField onChange={(e) => {
                                                        if (e.target != undefined && e.target.value != undefined) {
                                                            var value = e.target.value
                                                            this.state.iosAppId = value
                                                        }
                                                    }} name="txtName" value={this.state.iosAppId} type="number" className="form-control"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 ">
                                    <div className="form-group mb-3">
                                        <AvForm>
                                            <div className="form-body">
                                                <div className="formPadding">
                                                    <label id="name" className="control-label">{Labels.Recommend_Incentive}</label>
                                                    <AvField onChange={(e) => {
                                                        if (e.target != undefined && e.target.value != undefined) {
                                                            var value = e.target.value
                                                            this.state.recommendIncentive = value
                                                        }
                                                    }} name="txtName" value={this.state.recommendIncentive} type="number" className="form-control"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <AvForm>
                                            <div className="form-body">
                                                <div className="formPadding">
                                                    <label id="name" className="control-label">{Labels.Recommend_Page}</label>
                                                    <AvField
                                                        onBlur={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                if (e.target.value != '') {
                                                                    var check = Utilities.urlValidation(e.target.value)
                                                                    if (!check) {
                                                                        this.setState({
                                                                            sweetAlertMessage: 'Invalid url!',
                                                                            sweetAlertTitle: 'Alert',
                                                                            sweetAlertCheck: true,
                                                                        })
                                                                    }
                                                                }
                                                            }
                                                        }}
                                                        onChange={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                var value = e.target.value
                                                                this.state.recommendPage = value
                                                            }
                                                        }} name="txtName" value={this.state.recommendPage} type="text" className="form-control"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 ">
                                    <div className="form-group mb-3">
                                        <AvForm>
                                            <div className="form-body">
                                                <div className="formPadding">
                                                    <label id="name" className="control-label">{Labels.Terms_And_Condition_Link}</label>
                                                    <AvField
                                                        onBlur={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                if (e.target.value != '') {
                                                                    var check = Utilities.urlValidation(e.target.value)
                                                                    if (!check) {
                                                                        this.setState({
                                                                            sweetAlertMessage: 'Invalid url!',
                                                                            sweetAlertTitle: 'Alert',
                                                                            sweetAlertCheck: true,
                                                                        })
                                                                    }
                                                                }
                                                            }
                                                        }}
                                                        onChange={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                var value = e.target.value
                                                                this.state.referralTermsAndConditionLink = value
                                                            }
                                                        }} name="txtName" value={this.state.referralTermsAndConditionLink} type="text" className="form-control"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <AvForm>
                                            <div className="form-body">
                                                <div className="formPadding">
                                                    <label id="name" className="control-label">{Labels.Report_Problem}</label>
                                                    <AvField
                                                        onBlur={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                if (e.target.value != '') {
                                                                    var check = Utilities.urlValidation(e.target.value)
                                                                    if (!check) {
                                                                        this.setState({
                                                                            sweetAlertMessage: 'Invalid url!',
                                                                            sweetAlertTitle: 'Alert',
                                                                            sweetAlertCheck: true,
                                                                        })
                                                                    }
                                                                }
                                                            }
                                                        }}
                                                        onChange={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                var value = e.target.value
                                                                this.state.reportProblem = value
                                                            }
                                                        }} name="txtName" value={this.state.reportProblem} type="text" className="form-control"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 ">
                                    <div className="form-group mb-3">
                                        <AvForm>
                                            <div className="form-body">
                                                <div className="formPadding">
                                                    <label id="name" className="control-label">{Labels.Business_Name}</label>
                                                    <AvField onChange={(e) => {
                                                        if (e.target != undefined && e.target.value != undefined) {
                                                            var value = e.target.value
                                                            this.state.restaurantName = value
                                                        }
                                                    }} name="txtName" value={this.state.restaurantName} type="text" className="form-control"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <AvForm>
                                            <div className="form-body">
                                                <div className="formPadding">
                                                    <label id="name" className="control-label">{Labels.Sales_Tax}</label>
                                                    <AvField onChange={(e) => {
                                                        if (e.target != undefined && e.target.value != undefined) {
                                                            var value = e.target.value
                                                            this.state.salesTax = value
                                                        }
                                                    }} name="txtName" value={this.state.salesTax} type="text" className="form-control"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 ">
                                    <div className="form-group mb-3">
                                        <AvForm>
                                            <div className="form-body">
                                                <div className="formPadding">
                                                    <label id="name" className="control-label">{Labels.Support_Email}</label>
                                                    <AvField onChange={(e) => {
                                                        if (e.target != undefined && e.target.value != undefined) {
                                                            var value = e.target.value
                                                            this.state.supportEmail = value
                                                        }
                                                    }} name="txtName" value={this.state.supportEmail} type="text" className="form-control"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <AvForm>
                                            <div className="form-body">
                                                <div className="formPadding">
                                                    <label id="name" className="control-label">{Labels.Terms_And_Condition_Link}</label>
                                                    <AvField
                                                        onBlur={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                if (e.target.value != '') {
                                                                    var check = Utilities.urlValidation(e.target.value)
                                                                    if (!check) {
                                                                        this.setState({
                                                                            sweetAlertMessage: 'Invalid url!',
                                                                            sweetAlertTitle: 'Alert',
                                                                            sweetAlertCheck: true,
                                                                        })
                                                                    }
                                                                }
                                                            }
                                                        }}
                                                        onChange={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                var value = e.target.value
                                                                this.state.termsAndConditionLink = value
                                                            }
                                                        }} name="txtName" value={this.state.termsAndConditionLink} type="text" className="form-control"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 ">
                                    <div className="form-group mb-3">
                                        <AvForm>
                                            <div className="form-body">
                                                <div className="formPadding">
                                                    <label id="name" className="control-label">{Labels.Time_zone}</label>
                                                    <AvField onChange={(e) => {
                                                        if (e.target != undefined && e.target.value != undefined) {
                                                            var value = e.target.value
                                                            this.state.timezone = value
                                                        }
                                                    }} name="txtName" value={this.state.timezone} type="text" className="form-control"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <AvForm>
                                            <div className="form-body">
                                                <div className="formPadding">
                                                    <label id="name" className="control-label">{Labels.Use_Autocomplete}</label>
                                                    <AvRadioGroup onChange={(e) => {
                                                        if (e.target != undefined && e.target.value != undefined) {
                                                            var value = e.target.value == 'false' ? false : true
                                                            this.state.useAutocomplete = value
                                                        }
                                                    }} inline name="hasLocaldb" value={this.state.useAutocomplete}>
                                                        <AvRadio label="True" value={true} />
                                                        <AvRadio label="False" value={false} />

                                                    </AvRadioGroup>
                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 ">
                                    <div className="form-group mb-3">
                                        <AvForm>
                                            <div className="form-body">
                                                <div className="formPadding">
                                                    <label id="name" className="control-label">{Labels.Web_Url}</label>
                                                    <AvField
                                                        onBlur={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                if (e.target.value != '') {
                                                                    var check = Utilities.urlValidation(e.target.value)
                                                                    if (!check) {
                                                                        this.setState({
                                                                            sweetAlertMessage: 'Invalid url!',
                                                                            sweetAlertTitle: 'Alert',
                                                                            sweetAlertCheck: true,
                                                                        })
                                                                    }
                                                                }
                                                            }
                                                        }}
                                                        onChange={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                var value = e.target.value
                                                                this.state.webUrl = value
                                                            }
                                                        }} name="txtName" value={this.state.webUrl} type="text" className="form-control"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <AvForm>
                                            <div className="form-body">
                                                <div className="formPadding">
                                                    <label id="name" className="control-label">{Labels.Google_API_Key}</label>
                                                    <AvField onChange={(e) => {
                                                        if (e.target != undefined && e.target.value != undefined) {
                                                            var value = e.target.value
                                                            this.state.google_APIKey = value
                                                        }
                                                    }} name="txtName" value={this.state.google_APIKey} type="text" className="form-control"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 ">
                                    <div className="form-group mb-3">
                                        <AvForm>
                                            <div className="form-body">
                                                <div className="formPadding">
                                                    <label id="name" className="control-label">{Labels.Currency}</label>
                                                    <AvField onChange={(e) => {
                                                        if (e.target != undefined && e.target.value != undefined) {
                                                            var value = e.target.value
                                                            this.state.currency = value
                                                        }
                                                    }} name="txtName" value={this.state.currency} type="text" className="form-control"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <AvForm>
                                            <div className="form-body">
                                                <div className="formPadding">
                                                    <label id="name" className="control-label">{Labels.Decimal_Place}</label>
                                                    <AvField onChange={(e) => {
                                                        if (e.target != undefined && e.target.value != undefined) {
                                                            var value = e.target.value
                                                            this.state.decimalPlace = value
                                                        }
                                                    }} name="txtName" value={this.state.decimalPlace} type="number" className="form-control"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 ">
                                    <div className="form-group mb-3">
                                        <AvForm>
                                            <div className="form-body">
                                                <div className="formPadding">
                                                    <label id="name" className="control-label">{Labels.faq}</label>
                                                    <AvField
                                                        onBlur={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                if (e.target.value != '') {
                                                                    var check = Utilities.urlValidation(e.target.value)
                                                                    if (!check) {
                                                                        this.setState({
                                                                            sweetAlertMessage: 'Invalid url!',
                                                                            sweetAlertTitle: 'Alert',
                                                                            sweetAlertCheck: true,
                                                                        })
                                                                    }
                                                                }
                                                            }
                                                        }}
                                                        onChange={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                var value = e.target.value
                                                                this.state.faq = value
                                                            }
                                                        }} name="txtName" value={this.state.faq} type="text" className="form-control"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <AvForm>
                                            <div className="form-body">
                                                <div className="formPadding">
                                                    <label id="name" className="control-label">{Labels.Order_Time_Threshold}</label>
                                                    <AvField onChange={(e) => {
                                                        if (e.target != undefined && e.target.value != undefined) {
                                                            var value = e.target.value
                                                            this.state.orderTimeThreshold = value
                                                        }
                                                    }} name="txtName" value={this.state.orderTimeThreshold} type="number" className="form-control"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 ">
                                    <div className="form-group mb-3">
                                        <AvForm>
                                            <div className="form-body">
                                                <div className="formPadding">
                                                    <label id="name" className="control-label">{Labels.Live_Chat}</label>
                                                    <AvField
                                                        onBlur={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                if (e.target.value != '') {
                                                                    var check = Utilities.urlValidation(e.target.value)
                                                                    if (!check) {
                                                                        this.setState({
                                                                            sweetAlertMessage: 'Invalid url!',
                                                                            sweetAlertTitle: 'Alert',
                                                                            sweetAlertCheck: true,
                                                                        })
                                                                    }
                                                                }
                                                            }
                                                        }}
                                                        onChange={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                var value = e.target.value
                                                                this.state.liveChat = value
                                                            }
                                                        }} name="txtName" value={this.state.liveChat} type="text" className="form-control"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <AvForm>
                                            <div className="form-body">
                                                <div className="formPadding">
                                                    <label id="name" className="control-label">{Labels.Live_Chat_Helper}</label>
                                                    <AvField
                                                        onBlur={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                if (e.target.value != '') {
                                                                    var check = Utilities.urlValidation(e.target.value)
                                                                    if (!check) {
                                                                        this.setState({
                                                                            sweetAlertMessage: 'Invalid url!',
                                                                            sweetAlertTitle: 'Alert',
                                                                            sweetAlertCheck: true,
                                                                        })
                                                                    }
                                                                }
                                                            }
                                                        }}
                                                        onChange={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                var value = e.target.value
                                                                this.state.liveChatHelper = value
                                                            }
                                                        }} name="txtName" value={this.state.liveChatHelper} type="text" className="form-control"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 ">
                                    <div className="form-group mb-3">
                                        <AvForm>
                                            <div className="form-body">
                                                <div className="formPadding">
                                                    <label id="name" className="control-label">{Labels.Live_Chat_Helper_Key}</label>
                                                    <AvField onChange={(e) => {
                                                        if (e.target != undefined && e.target.value != undefined) {
                                                            var value = e.target.value
                                                            this.state.liveChatHelperKey = value
                                                        }
                                                    }} name="txtName" value={this.state.liveChatHelperKey} type="text" className="form-control"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <AvForm>
                                            <div className="form-body">
                                                <div className="formPadding">
                                                    <label id="name" className="control-label">{Labels.Language}</label>
                                                    <AvField onChange={(e) => {
                                                        if (e.target != undefined && e.target.value != undefined) {
                                                            var value = e.target.value
                                                            this.state.language = value
                                                        }
                                                    }} name="txtName" value={this.state.language} type="text" className="form-control"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: 15, }}>

                                <Button color="secondary" onClick={(e) => this.setState({ step: 0 })}>{Labels.Cancel}</Button>
                                <Button color="primary" style={{ marginLeft: 10 }} onClick={(e) => this.submitConfig()}>{Labels.Save}</Button>

                            </div>
                        </div>
                    </div>
                    {this.popSweetAlert()}
                </div>
            )
        }
    }
}

export default CountryConfig