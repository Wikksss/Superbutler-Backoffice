import React, { Component } from 'react';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import * as EnterpriseService from '../../service/Enterprise';
import * as EnterpriseSettingService from '../../service/EnterpriseSetting';
import Config from '../../helpers/Config';
import * as Utilities from '../../helpers/Utilities';
import Loader from 'react-loader-spinner';


 class BankDetails extends Component {

    constructor(props) {
        // let bankDetailArray  = Config.Setting.bankkDetails.split(';');
        super(props);
        this.state = {
            show: false,
            modalVisible: false,
            DataFetched: false,
              Enterprise: {},
              IsSave:false,
              ShowLoader: true,
              IsUpdate: false,
              BankDetailArray : Config.Setting.bankkDetails.split(';'),
            
      };
    }



    loading = () =>   <div className="page-laoder page-laoder-menu">
    <div className="loader-menu-inner"> 
      <Loader type="Oval" color="#ed0000" height={50} width={50}/>  
      <div className="loading-label">Loading.....</div>
      </div>
    </div> 


SetBackDetails(bankDetails){
    
    
    let bankDetilArray = Config.Setting.bankkDetails.split(';');
    let bankNotesArray = bankDetails.split(';');
    
    for(var i=0; i<bankNotesArray.length; i++) {
        
        var field = bankDetilArray[i] ? bankDetilArray[i].split(':')[0] : '';
        var savedDataField = bankNotesArray[i] ?  bankNotesArray[i].split(':')[0] : '';
        
        if(field === savedDataField)
            bankDetilArray[i] = bankNotesArray[i];
    }

    this.setState({BankDetailArray: bankDetilArray});

}



//#region api calling

GetEnterpriseDetail = async () => {
   
    

    let data = await EnterpriseService.Get();
   
    if(data.length !== 0) {

      if(!Utilities.stringIsEmpty(data.BankNotes))  
     
        this.SetBackDetails(data.BankNotes);
    }
    
    this.setState({ShowLoader: false});
   
}

UpdateEnterpriseBankDetailApi = async(bankDetail) => {

        let message = await EnterpriseSettingService.UpdateBankDetails(bankDetail)  
        this.setState({IsSave:false})
        if(message === '1')
                Utilities.notify("Updated successfully.","s");
            else if(message === '0')
              Utilities.notify("Update failed.","e");
            else 
                Utilities.notify("Update failed." + message,"e");

                
}


CreateBankDetailCsv(){
    let bankDetailArray  = this.state.BankDetailArray;
    let bankDetails = "";
    for(var i=0; i < bankDetailArray.length; i++){

        if(bankDetailArray[i] !== "")
            bankDetails += bankDetailArray[i] + ";";
    }
    
    return bankDetails;

}

UpdateEnterpriseBankDetail(){
    if(this.state.IsSave) return;
    this.setState({IsSave:true});
    let bankDetails = this.CreateBankDetailCsv();

    //updating
     this.UpdateEnterpriseBankDetailApi(bankDetails);
     
}

//#endregion

handleChangeText(e,i) {
   
    let bankDetailArray  = this.state.BankDetailArray;

    bankDetailArray[i] =  `${bankDetailArray[i].split(':')[0]}:${e.target.value}`;

    this.setState({BankDetailArray: bankDetailArray });

}

RenderBankDetailFields(bankDetail, index) {

    
    var field1 = bankDetail[index]  ? bankDetail[index].split(':')[0] : '';
    var field2 = bankDetail[index+1] ?  bankDetail[index+1].split(':')[0] : '';
   
    return (
        
        <div className="row p-t-20 m-b-20" key={index}>
        {field1 !== '' ?
        <div className="col-md-6">
            <label className="control-label">{field1}</label>                            
            <div className="input-group m-b-10 form-group">                          
            <input type="text" className="form-control" value={bankDetail[index].split(':')[1]} onChange={(e) => this.handleChangeText(e,index)}/>
                <div className="help-block with-errors"></div>
            </div>                      
        </div> : ''}
       { field2 !== '' ? <div className="col-md-6">
            <label className="control-label">{field2}</label>                            
            <div className="input-group m-b-10 form-group">                               
            <input type="text" className="form-control"  value={bankDetail[index+1].split(':')[1]} onChange={(e) => this.handleChangeText(e,index+1)} />
                <div className="help-block with-errors"></div>
            </div>
        </div>
          : ''  }
        </div>
    )
  }

  LoadBankDetailFields() {

    if(this.state.ShowLoader){
        return this.loading();
    }

    let bankDetailArray  = this.state.BankDetailArray;

    var htmlBankDetail = [];

    for (var i = 0; i < bankDetailArray.length;) {
        
        if(bankDetailArray[i] !== "")
            htmlBankDetail.push(this.RenderBankDetailFields(bankDetailArray,i));
        
            i = i+2;
    }

    return (htmlBankDetail.map((bankDetailHtml) => bankDetailHtml))

  }

  GoBack(){
    
    this.props.history.goBack();

  }

  componentDidMount() {
  
    this.GetEnterpriseDetail();
    
   } 

    render() {
        return (
            <div className="addNewEntrpsDV">
            <div className="card " id="generalSettingsDv"> 
            <h3 className="card-title card-new-title">Bank Details</h3>
                <div className="card-body">

                    <AvForm>
                        <div className="form-body m-b-10">

                        {this.LoadBankDetailFields()}
                           
                        </div>                 
                        <div className="bottomBtnsDiv">
                            {/* <Button color="success" style={{marginRight:10}} onClick={() => this.UpdateEnterpriseBankDetail()} >Add</Button> */}

                              <Button color="secondary" onClick={() => this.GoBack()} style={{ marginRight: 10 }}>Cancel</Button>				
                            <Button color="primary" style={{width:'78px'}}>
                            {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                            : <span className="comment-text" onClick={() => this.UpdateEnterpriseBankDetail()}>Save</span>}
                              </Button>
                        </div>
                    </AvForm>
                </div>
            </div>
        </div>
        );
    }
}

export default BankDetails;
