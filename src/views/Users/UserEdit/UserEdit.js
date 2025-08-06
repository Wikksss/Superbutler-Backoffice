import React, { Component } from 'react';
import Nestable from 'react-nestable';

  class GeneralSettings extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const items = [
      { id: 0, text: '1. Drinks', icon:'home' },
      { id: 1, text: '2. Pizza'},
      { id: 2, text: '3. Kabab' },
      { id: 3, text: '4. Pizza' }
  ];
  
  const renderItem = ({ item }) => {
      return item.text;
  };
    return (
      <div className="card" id="generalSettingsDv">
             <h3 className="card-title card-new-title">General Settings</h3>
        <div className="card-body">
         
            <form id="generalSettingsForm">
                <div className="form-body m-b-10">
                    <div className="row p-t-20 m-b-20">
                        <div className="col-md-6">
                            <label className="control-label font-weight-500">Minimum order amount for delivery</label>
                            <div className="input-group m-b-10 form-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text form-control" id="basic-addon1">£</span>
                                </div>
                                <input type="tel" className="form-control form-control-left validatedField flexBasisValidation borderRightRadius" />
                                <div className="help-block with-errors"></div>
                            </div>
                            <div className="form-control-feedback font-12">
                                <input type="checkbox" className="check m-r-10" id="freeif" />
                                <span className="m-r-10">Free Delivery if the Order is above</span>
                                <span className="input-group d-inline-flex free-charges-input form-group">
                                    <span className="input-group-prepend">
                                        <span className="input-group-text form-control" id="">£</span>
                                    </span>
                                    <input type="tel" className="form-control form-control-left validatedField flexBasisValidation" id="txtFreeDelivery" />                                   
                                </span>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label className="control-label">Delivery Charges</label>
                            <div className="input-group m-b-10 form-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text form-control">£</span>
                                </div>
                                <input type="tel" className="form-control form-control-left validatedField flexBasisValidation borderRightRadius" id="txtDeliveryCharges" />
                                <div className="help-block with-errors"></div>
                            </div>
                        </div>
                    </div>
                    <div className="row m-b-20">
                        <div className="col-md-6 form-group">
                            <label className="control-label">Free delivery within</label>
                            <div className="input-group mb-3 form-group">
                                <input type="tel" className="form-control form-control-right validatedField flexBasisValidation" id="txtFreeDeliveryWithIn" />
                                <div className="input-group-append">
                                    <span className="input-group-text form-control borderRightRadius">miles</span>
                                </div>
                                <div className="help-block with-errors"></div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label className="control-label">Delivery radius</label>
                            <div className="input-group mb-3 form-group">
                                <input type="tel" className="form-control form-control-right validatedField flexBasisValidation" id="txtDeliveryRadius" />
                                <div className="input-group-append">
                                    <span className="input-group-text form-control borderRightRadius">miles</span>
                                </div>
                                <div className="help-block with-errors"></div>
                            </div>
                        </div>
                    </div>
                    <div className="row m-b-20">
                        <div className="col-md-6">
                            <label className="control-label">Delivery Time</label>
                            <div className="input-group mb-3 form-group">
                                <input type="tel" className="form-control form-control-right validatedField flexBasisValidation" id="txtDeliveryTime" />
                                <div className="input-group-append">
                                    <span className="input-group-text form-control borderRightRadius">mins</span>
                                </div>
                                <div className="help-block with-errors"></div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label className="control-label">Pick-up Time</label>
                            <div className="input-group mb-3 form-group">
                                <input type="tel" className="form-control form-control-right validatedField flexBasisValidation" id="txtCollectionTime" />
                                <div className="input-group-append">
                                    <span className="input-group-text form-control borderRightRadius">mins</span>
                                </div>
                                <div className="help-block with-errors"></div>
                            </div>
                        </div>
                    </div>
                    <div className="row m-b-20">
                        <div className=" col-sx-12 col-sm-12">
                            <div className="form-group m-b-0 form-group">
                                <label><span className="control-label">Promotion Message </span></label>
                                <textarea name="description" rows="4" cols="50" id="description" ondrop="return false;" className="form-control">

                            </textarea>
                                Limit : <span className="remaining"></span>/256
                            </div>
                        </div>
                    </div>
                </div>

<div className="card-body generalSettingsChecks">
    <div className="row m-t-30">
        <div className=" p-b-0">
            <div className="control-label m-b-0">Payment Types</div>
        </div>
    </div>

    <div className="row col-xs-12 setting-cus-field m-t-20 m-b-20">
        <div className="col-xs-12 col-sm-3 m-b-10 checkDiv">
            <input type="checkbox" className="form-checkbox" id="Acceptcash" />
            <label className="settingsLabel" for="Acceptcash">Accept cash</label>
        </div>
        <div className="col-xs-12 col-sm-3 m-b-10 checkDiv">
            <input type="checkbox" className="form-checkbox" id="Acceptcreditcard" />
            <label className="settingsLabel" for="Acceptcreditcard">Accept credit card</label>
        </div>
        <div className="col-xs-12 col-sm-3 m-b-10 checkDiv">
            <input type="checkbox" className="form-checkbox" id="AcceptECash" />
            <label className="settingsLabel" for="AcceptECash">Accept ECash</label>
        </div>
                    </div>
                    <div className="row m-t-30">
                        <div className=" p-b-0">
                            <div className="control-label  m-b-0">Dietary Types</div>
                        </div>
                    </div>
                    <div className="row col-xs-12 setting-cus-field m-t-20" id="dvDietryTypes">
                        <div className="col-xs-12 col-sm-3 m-b-10 checkDiv">
						<input type="checkbox" className="form-checkbox" id="Gluten" />
						<label className="settingsLabel" for="Gluten"    >Gluten Free</label>
					</div>
					<div className="col-xs-12 col-sm-3 m-b-10 checkDiv">
						<input type="checkbox" className="form-checkbox" id="Halal" />
						<label className="settingsLabel" for="Halal"    >Halal</label>
					</div>
					<div className="col-xs-12 col-sm-3 m-b-10 checkDiv">
						<input type="checkbox" className="form-checkbox" id="Kosher" />
						<label className="settingsLabel" for="Kosher"    >Kosher</label>
					</div>
					<div className="col-xs-12 col-sm-3 m-b-10 checkDiv">
						<input type="checkbox" className="form-checkbox" id="Vagan" />
						<label className="settingsLabel" for="Vagan"    >Vagan</label>
					</div>
					<div className="col-xs-12 col-sm-3 m-b-10 checkDiv">
						<input type="checkbox" className="form-checkbox" id="Vegetarian" />
						<label className="settingsLabel" for="Vegetarian"    >Vegetarian</label>
					</div>
                    </div>
                    <div className="row m-t-30">
                        <div className=" p-b-0">
                            <div className="control-label  m-b-0">Facilities</div>
                        </div>
                    </div>
                    <div className="row col-xs-12 setting-cus-field m-t-20 m-b-20">
                        <div className="col-xs-12 col-sm-3 m-b-10 checkDiv">
                            <input type="checkbox" className="form-checkbox" id="Deliveryoffered" />
                            <label className="settingsLabel" for="Deliveryoffered">Delivery offered</label>
                        </div>
                        <div className="col-xs-12 col-sm-3 m-b-10 checkDiv">
                            <input type="checkbox" className="form-checkbox" id="Takeawayoffered" />
                            <label for="Takeawayoffered"    >Pick-up offered</label>
                        </div>
                        <div className="col-xs-12 col-sm-3 m-b-10 checkDiv">
                            <input type="checkbox" className="form-checkbox" id="Dine-InOffered" />
                            <label for="Dine-InOffered"    >Dine-In Offered</label>
                        </div>
                        <div className="col-xs-12 col-sm-3 m-b-10 checkDiv">
                            <input type="checkbox" className="form-checkbox" id="BuffetOffered" />
                            <label className="settingsLabel" for="BuffetOffered"    >Buffet Offered</label>
                        </div>
                        <div className="col-xs-12 col-sm-3 m-b-10 checkDiv">
                            <input type="checkbox" className="form-checkbox" id="ExecutiveDineoffered" />
                            <label className="settingsLabel" for="ExecutiveDineoffered"    >Executive Dine offered</label>
                        </div>
                    </div> 
                    <div className=" p-b-0">
                        <div className="control-label">Food Types</div>
                        <Nestable
                            items={items}
                            renderItem={renderItem}
                        />
                        {/* <div className="myadmin-dd dd" id="nestable">
                            <ol className="dd-list" id="sortFoodNamesList">
                                <li className="dd-item" data-id="1">
									<div className="dd-handle"><span className="dragSpan m-r-10"><i className="fas fa-grip-vertical "></i></span>1. Drinks </div>
								</li>
								<li className="dd-item" data-id="9">
									<div className="dd-handle"><i className="fas fa-grip-vertical m-r-10"></i>2. Pizza </div>
								</li>
								<li className="dd-item" data-id="10">
									<div className="dd-handle"><i className="fas fa-grip-vertical m-r-10"></i>3. Kabab </div>
								</li>
								<li className="dd-item" data-id="10">
									<div className="dd-handle"><i className="fas fa-grip-vertical m-r-10"></i>4. Pizza </div>
								</li>
                            </ol>
                        </div> */}
                    </div>
                    <div className="row col-xs-12 setting-cus-field m-t-20" id="dvFoodItems">
                        <div className="col-xs-12 col-sm-3 m-b-10 checkDiv">
						<input type="checkbox" className="form-checkbox" id="American" />
						<label className="settingsLabel" for="American"    >American</label>
					</div>
					<div className="col-xs-12 col-sm-3 m-b-10 checkDiv">
						<input type="checkbox" className="form-checkbox" id="Appetizers" />
						<label className="settingsLabel" for="Appetizers"    >Appetizers</label>
					</div>
					<div className="col-xs-12 col-sm-3 m-b-10 checkDiv">
						<input type="checkbox" className="form-checkbox" id="Arabic" />
						<label className="settingsLabel" for="Arabic"    >Arabic</label>
					</div>
					<div className="col-xs-12 col-sm-3 m-b-10 checkDiv">
						<input type="checkbox" className="form-checkbox" id="Bakery" />
						<label className="settingsLabel" for="Bakery"    >Bakery</label>
					</div>
					<div className="col-xs-12 col-sm-3 m-b-10 checkDiv">
						<input type="checkbox" className="form-checkbox" id="Drinks" />
						<label className="settingsLabel" for="Drinks"    >Drinks</label>
					</div>
					<div className="col-xs-12 col-sm-3 m-b-10 checkDiv">
						<input type="checkbox" className="form-checkbox" id="Kabab" />
						<label className="settingsLabel" for="Kabab"    >Kabab</label>
					</div>
					<div className="col-xs-12 col-sm-3 m-b-10 checkDiv">
						<input type="checkbox" className="form-checkbox" id="Pizza" />
						<label className="settingsLabel" for="Pizza">Pizza</label>
					</div>
					<div className="col-xs-12 col-sm-3 m-b-10 checkDiv">
						<input type="checkbox" className="form-checkbox" id="Sea Food" />
						<label className="settingsLabel" for="Sea Food">Sea Food</label>
					</div>
                    </div>
                    <div className="row m-t-20">
                        <div className=" col-sx-12 col-sm-12">
                            <div className="form-group m-b-0">
                                <label><span className="control-label">Other Tags CSV</span></label>
                                <textarea name="metaDesc" rows="3" id="metaDesc" ondrop="return false;" className="form-control">
                            </textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xs-12 setting-cus-field m-b-20 ">
                    <button type="button" className="btn waves-effect waves-light pull-right ">Cancel</button>
                    <button type="button" id="saveButton" className="btn waves-effect waves-light btn-success pull-right m-r-10">Submit</button>
                </div>
            </form>
        </div>
    </div>
    );
  }
}

export default GeneralSettings;
