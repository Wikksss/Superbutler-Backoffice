import React, { Component } from 'react';
import { Button, Label, Table,  Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { AvForm, AvField ,AvInput,AvGroup } from 'availity-reactstrap-validation';
import {  Link } from 'react-router-dom';
import * as EnterpriseService from '../../service/Enterprise';
import * as EnterpriseMenuService from '../../service/EnterpriseMenu';
import * as Utilities from '../../helpers/Utilities';
import Constants from '../../helpers/Constants';
import Config from '../../helpers/Config';
import Loader from 'react-loader-spinner'
import Autocomplete from 'react-autocomplete';
import GlobalData from '../../helpers/GlobalData'
import Labels from '../../containers/language/labels';
import Messages from '../../containers/language/Messages';


class ParentChild extends Component {

    loading = () =>   <div className="loader-menu-inner"> 
    <Loader type="Oval" color="#ed0000" height="50" width="50"/>  
    <div className="loading-label">Loading.....</div>
    </div>

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      showAlert: false,
      ShowLoader: true,
      ShowError: false,
    
      IsNewEnterprise: false,
      ShowPostcodeLoader: false,
      IsSave:false,
      IsChild: false,
      FilterEnterprises: [],
      Enterprises:[],
      ParentName: '',
      ChildName: '',
      ChildId: 0,
      ParentID: 0,
      ChildID: 0,
      IsParent: false,
      IsSearchingEnterprise: false,
      ChildModal: false,
	    SearchEnterpriseText: "",
      SelectedEnterpriseArray: [],
      ParentEnterpriseArray: [],
      FilterParentEnterprise: [],
      ChildEnterprise: [],
      FilterChildEnterprise: [],
      SelectionError: false,
      
    }
    
    this.GetEnterprises = this.GetEnterprises.bind(this);
    this.EnterpriseListModal = this.EnterpriseListModal.bind(this);
    this.UpdateChildEnterprise = this.UpdateChildEnterprise.bind(this);

  }
    
// #region api calling


GetEnterprises = async (pageNumber,pageSize,searchKeyword) => {

    this.setState({ShowLoader: true});
    let data = await EnterpriseService.GetAll(pageNumber,pageSize,searchKeyword,true,true);
    if(data.length !== 0) {
    

      data.forEach(service => {
        if(service.ParentId > 0)
        {
          var parent = data.find(e => e.Id == service.ParentId);
          if(parent != undefined)
          {
            service.ParentName = Utilities.SpecialCharacterDecode(parent.Name);
          }
        }
    });



    // console.log(data);
    var filterParents = [];
    filterParents = data.filter((service) => {

      return (service.ParentId > 0 || service.EnterpriseTypeId == 6) && !service.IsChurned;

    });

        this.setState({ParentEnterpriseArray: filterParents, ChildEnterprise: filterParents});
    }
    this.setState({Enterprises: data, ShowLoader: false});

}


UpdateChildEnterpriseApi = async(parentId, childCsv) => {
  
    let message = await EnterpriseMenuService.UpdateChildMenu(parentId,childCsv)
      
    this.setState({IsSave:false})
        if(message === '1'){
          this.setState({ChildModal: false});
            Utilities.notify("Updated successfully.", "s");
        }
        else if(message === '0')
            Utilities.notify("Update failed.", "e");
        else 
            Utilities.notify("Update failed. Error: " +  message ,"e");
}



UpdateChildEnterprise(event, values) {
    
    if(this.state.IsSave) return;
    this.setState({IsSave:true})
    let ParentId1 = this.state.ParentID;
    let childCsv = this.CreateChildIdCsv()

    if(Utilities.stringIsEmpty(childCsv) || this.state.ParentID == 0)
    {
        this.setState({SelectionError:true, IsSave:true})
        return 
    }

    let ParentId = this.state.ParentID;
    this.UpdateChildEnterpriseApi(ParentId,childCsv);
    
} 

  //#endregion

  
CreateChildIdCsv() {
    let selectedChild  = this.state.SelectedEnterpriseArray;
    let childCsv = "";
    for(var i=0; i < selectedChild.length; i++){
      
        childCsv += selectedChild[i].Id +  Config.Setting.csvSeperator;;
    }

    childCsv = Utilities.FormatCsv(childCsv, Config.Setting.csvSeperator);
    return childCsv;
}



  OnItemSelect(value) {

    // console.log("selected Value", value )
    let enterprises = this.state.FilterParentEnterprise.filter((enterprise) => {
        return enterprise.FullName == value
    });

   

    this.setState({ParentID : enterprises[0].Id, ParentName : `${enterprises[0].FullName}`}, () => {
      // console.log("ID: ", this.state.ParentID)
    })

}


OnChildItemSelect(value) {

  var selectedChild = []
  // console.log("selected Value", value )
  let enterprises = this.state.FilterChildEnterprise.filter((enterprise) => {
      return enterprise.FullName == value
  });

  if(enterprises.length > 0 ){
    selectedChild.push(enterprises[0])
  }

  this.setState({ChildID : enterprises[0].Id, ChildName : `${enterprises[0].FullName}`, SelectedEnterpriseArray: selectedChild}, () => {
    // console.log("ID: ", this.state.ParentID)
  })

}

	SearchChildEnterprise(e, value){
    
    let searchText = value;
    this.setState({ChildName: searchText, FilterChildEnterprise: []});
    if(value.length < 2) return;
  
    let filteredData = []
    if (searchText.toString().trim() === '') {
      this.setState({FilterChildEnterprise: []});
      return;
    }
  
    filteredData = this.state.ParentEnterpriseArray.filter((enterprise) => {
    let arr = searchText.toUpperCase().split(' ');
    let isExists = false;
  
      for (var t = 0; t <= arr.length; t++) {
  
        if (enterprise.Name.toUpperCase().indexOf(arr[t]) !== -1) {
              isExists = true
              break;
        }
      }
  
      return isExists
    })
  
    filteredData.forEach((enterprise) => {
      enterprise.FullName = Utilities.SpecialCharacterDecode(`${enterprise.Name}${enterprise.ParentName != '' ? `(${enterprise.ParentName})` : ''}`)
    })
	
		this.setState({FilterChildEnterprise: filteredData});
	}

    SearchEnterprise(e,value) {
  
        let searchText = value;
        this.setState({ParentName: searchText,FilterParentEnterprise: []});
        if(value.length < 2) return;
      
        let filteredData = []
        if (searchText.toString().trim() === '') {
          this.setState({FilterParentEnterprise: []});
          return;
        }
      
        filteredData = this.state.ParentEnterpriseArray.filter((enterprise) => {
        let arr = searchText.toUpperCase().split(' ');
        let isExists = false;
      
          for (var t = 0; t <= arr.length; t++) {
      
            if (enterprise.Name.toUpperCase().indexOf(arr[t]) !== -1) {
                  isExists = true
                  break;
            }
          }
      
          return isExists
        })
      
        filteredData.forEach((enterprise) => {
          enterprise.FullName = Utilities.SpecialCharacterDecode(`${enterprise.Name}${enterprise.ParentName != '' ? `(${enterprise.ParentName})` : ''}`)
        })

        this.setState({ FilterParentEnterprise: filteredData});
      }

      handleCheckbox(e,id){

        let checked = e.target.checked;
        let selectedEnterprises = this.state.SelectedEnterpriseArray;
        let filterEnterprises = this.state.ChildEnterprise;
        let index = Utilities.GetObjectArrId(id,filterEnterprises)
        let itemFound = Utilities.GetObjectArrId(id,selectedEnterprises) !== -1;
        if(checked){
            if(itemFound) selectedEnterprises.push(filterEnterprises[index]);
        } else {
            index = Utilities.GetObjectArrId(id,selectedEnterprises)
            selectedEnterprises.splice(index, 1);
        }
    
        this.setState({SelectedEnterpriseArray: selectedEnterprises});
    
    }


      RenderEnterpriseList(enterprise,itemFound){

        return(
            <tr key={enterprise.Id}>
                                    <td>
                                        <AvField type="checkbox" className="form-checkbox" name={String(enterprise.Id)} value={itemFound} checked={itemFound} onChange={(e) => this.handleCheckbox(e,enterprise.Id)} />
                                    </td>
                                        
                                        <td><img  style={{width: "20%"}}  src={Utilities.generatePhotoLargeURL(enterprise.PhotoName, true, false)}/> {Utilities.SpecialCharacterDecode(enterprise.Name)}</td>
                                        
                                    </tr>
        )
        
        }

      LoadEnterpriseList(selectedEnterprises) {

        var htmlActive = [];
        var allEnterprise = this.state.FilterChildEnterprise;
        if(selectedEnterprises === 0) {
          return <div></div>
        }
    
      for (var i=0; i < allEnterprise.length; i++){
       
        var id = parseInt(allEnterprise[i].Id);
       
        var itemFound = Utilities.GetObjectArrId(id,selectedEnterprises) !== "-1";
       
        htmlActive.push(this.RenderEnterpriseList(allEnterprise[i],itemFound));
     }
    
      return(
    
        <tbody>{htmlActive.map((item) => item)}</tbody>
    
       )
    
    }

    EnterpriseListModal() {
        
      if(this.state.SelectedEnterpriseArray.length > 0 && this.state.ParentID > 0) {
        
        this.setState({
            ChildModal: !this.state.ChildModal,
			SearchEnterpriseText: "",
			IsSearchingEnterprise: false,
        });
    } else {

        this.setState({
           SelectionError: true
        });
    } 

}

    CancelEnterpriseSearch() {
    
		this.setState({ 
			FilterCildEnterprise: this.state.ChildEnterprise, 
			SearchEnterpriseText: "",
			IsSearchingEnterprise: false
		});
	  }
  componentDidMount() {
    
    this.GetEnterprises(1,5000);
}


LoadEnterpriseHtml(enterprise,itemFound) {

    if(enterprise.EnterpriseId === 0 || enterprise.EnterpriseId === undefined)
      return;
      let  userObj = {}
      if(!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
        userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
       
      }

    let enterpriseName = Utilities.SpecialCharacterDecode(enterprise.Name);
    let dvActiveSuspend = enterprise.IsActive ? <span className="link-t-c m-b-0 statusChangeLink m-r-20" onClick={() => this.SuspendConfirmation(enterprise.Id, enterpriseName, enterprise.EnterpriseTypeId)}><i className="fa fa-ban" aria-hidden="true"></i><span>{Labels.Suspend}</span></span> : <span className="m-b-0 statusChangeLink  m-r-20" onClick={() => this.ActivateConfirmation(enterprise.Id, enterpriseName, enterprise.EnterpriseTypeId)}><i className="fa fa-check" aria-hidden="true"></i><span>{Labels.Active}</span></span>;
  
   return (
   
   <div className="admin-restaurant-wrap parent-child-wrap" key={enterprise.Id}>
    <div className="admin-restaurant-row">
    <label><input type="checkbox" className="form-checkbox" name={String(enterprise.Id)} value={itemFound} checked={itemFound} onChange={(e) => this.handleCheckbox(e,enterprise.Id)} /></label>
         <div className="image-wrap">
        <img src={Utilities.generatePhotoLargeURL(enterprise.PhotoName, true, false)}/>
        </div>    
        <div className="rest-main-inner-row">
        <div className="rest-name-heading">{enterpriseName}</div>
  </div>

    </div>
    </div>
   )

  }


  RenderEnterprise(selectedEnterprises){

    var allEnterprise = this.state.FilterChildEnterprise;
    
    if(this.state.ShowLoader){
      return this.loading()
      // return;
    }

    var htmlEnterprise = [];

    for (var i = 0; i < allEnterprise.length; i++) {

        var id = parseInt(allEnterprise[i].Id);
       
        var itemFound = Utilities.GetObjectArrId(id,selectedEnterprises) !== "-1";

      htmlEnterprise.push(this.LoadEnterpriseHtml(allEnterprise[i],itemFound));
            
	}

    return(

        <div>{htmlEnterprise.map((enterpriseHtml) => enterpriseHtml)}</div>

    )
}

LoadSelectedEnterpriseHtml(enterprise){

  return (
    <h3>
         {Utilities.SpecialCharacterDecode(enterprise.Name)}
          </h3>
  )

}


CopyToRestaurant(){

  let selectedChild  = this.state.SelectedEnterpriseArray;

  var htmlEnterprise = [];

  for(var i=0; i < selectedChild.length; i++) {
      
    htmlEnterprise.push(this.LoadSelectedEnterpriseHtml(selectedChild[i]));
}

  return(

      <div className="copy-res-name-wrap">{htmlEnterprise.map((enterpriseHtml) => enterpriseHtml)}</div>

  )
}



GenerateEnterpeiseModel(){
	 
	if(!this.state.ChildModal){
		return('')
	}
	
	return(
			<Modal isOpen={this.state.ChildModal} toggle={() => this.EnterpriseListModal()} className="modal-md">
			<ModalHeader toggle={() => this.EnterpriseListModal()}>{Labels.Confirmation}</ModalHeader>
      <AvForm onValidSubmit={this.UpdateChildEnterprise}>
      <ModalBody className="parent-child-modal-wrapper">
<div className="m-b-20 font-16">
{Labels.Confirm_Action}
</div>
					<p>
          {Labels.Copy_Menu_From}
          </p>
          <h3 className="m-b-20">
          {Utilities.SpecialCharacterDecode(this.state.ParentName)}
          </h3>
          <p>
          {Labels.Copy_To}
          </p>
  {this.CopyToRestaurant()}


                  		{/* <div className={this.state.ToppingModalMessageClass}>{this.state.ToppingModalMessageText}</div> */}
				
		
			</ModalBody>
      <div className="modal-footer">

<Button color="secondary" onClick={() => this.EnterpriseListModal()}>Cancel</Button>
<Button color="primary" style={{width:'76px'}} >
              {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
              : <span className="comment-text">{Labels.Copy}</span>}
          </Button> 
</div>
      </AvForm>
		</Modal>
	 )
 }


render() {
  
        let enterprise = this.state.Enterprise;

        if(this.state.ShowLoader ){

            return this.loading();
        }

        return (
            <div className="card">
                  <div className="m-b-20 card-new-title">
                    <h3 className="card-title">{Labels.Duplicate_Menu}</h3>
                 </div>
                <div className="card-body pl-1">

                    <AvForm  onValidSubmit={this.UpdateChildEnterprise} id="" > 
                        <div className="form-body m-b-10 formPadding">

                            <div className="row m-b-40 parent-child-wrap">

                               <div className="col-md-6">
                                    <label className="color-7 ">{Messages.Type_Business_Name} </label>
                                    <div className="input-group h-set-new">
                                    <Autocomplete 
                                     className="form-control"
                                     getItemValue={(item) => item.FullName}
                                    items={this.state.FilterParentEnterprise}
                                    renderItem={(item, isHighlighted) =>
                                    <div style={{ background: isHighlighted ? 'lightgray' : 'white'}}>
                                     {Utilities.SpecialCharacterDecode(`${item.FullName}`)}
                                        </div>
                                    }
                                value={ Utilities.SpecialCharacterDecode(this.state.ParentName)}
                                onChange={(event, value) => this.SearchEnterprise(event,value)}
                                onSelect={(value) => this.OnItemSelect(value)}
                                selectOnBlur={true}
                                />
                                    </div> 
                            </div> 


                            <div className="col-md-6">
                                    <label className="color-7 ">{Messages.Type_Business_Name_To} </label>
                                    <div className="input-group h-set-new">
                                    <Autocomplete 
                                     className="form-control"
                                     getItemValue={(item) => item.FullName}
                                    items={this.state.FilterChildEnterprise}
                                    renderItem={(item, isHighlighted) =>
                                    <div style={{ background: isHighlighted ? 'lightgray' : 'white'}}>
                                     {Utilities.SpecialCharacterDecode(`${item.FullName}`)}
                                        </div>
                                    }
                                value={Utilities.SpecialCharacterDecode(this.state.ChildName)}
                                onChange={(event, value) => this.SearchChildEnterprise(event,value)}
                                onSelect={(value) => this.OnChildItemSelect(value)}
                                selectOnBlur={true}
                                />
                                    </div> 
                              
                            </div> 

                            </div>

                         {/* {this.state.ParentID > 0 ? 
                            
                            <div className="row m-b-20">
                            <div className="col-md-6">
                            
                          
                            <div className="dataTables_filter"><label><input type="text" id="txtSearchEnterprise" className="form-control common-serch-field" placeholder="Search"  value={this.state.SearchEnterpriseText} onChange={(e) => this.SearchChildEnterprise(e)} /></label>
                            {this.state.IsSearchingEnterprise ? <span onClick={() => this.EnterpriseListModal()}><i className="fa fa-times" style={{ position: 'absolute', top: '11px', color: '#777', right: '15px' }}></i></span> : ""}
                            </div>
                            
                             {this.RenderEnterprise(this.state.SelectedEnterpriseArray)}
                             </div> 
                             </div> 
                         : "" } */}


                        </div>
                        <div className="bottomBtnsDiv" style={{ marginTop: 20, display:'flex', justifyContent:'flex-start', marginLeft:'10px' }}>
                             <Link><Button color="secondary" style={{ marginRight: 10 }}>{Labels.Cancel}</Button></Link>
                            
                             
                             <Button color="primary" onClick={() => this.EnterpriseListModal()} >
                          <span className="comment-text">{Labels.Proceed}</span>
                          </Button> 

                        </div>
                        {this.state.SelectionError ? <div className="gnerror error media-imgerror">Please select enterprses copy from/to.</div> : ""}
                    </AvForm>



                </div>
                          {this.GenerateEnterpeiseModel()}
            </div>
        );
    }
}

export default ParentChild;
