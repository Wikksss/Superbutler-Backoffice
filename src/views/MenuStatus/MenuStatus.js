import React, { Component } from 'react';
import * as moment from 'moment'
import * as EnterpriseMenuService from '../../service/EnterpriseMenu';
import * as Utilities from '../../helpers/Utilities'
import Loader from 'react-loader-spinner';
// import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SweetAlert from 'sweetalert-react'; // eslint-disable-line import/no-extraneous-dependencies
import 'sweetalert/dist/sweetalert.css';
 class MenuStatus extends Component {
	
	constructor(props) {
		super(props);
	
		this.state = {
		  IsMenuModified: false,
		  EnterpriseJson: {},
		  PublishStatus: 0,
		  ShowLoader: true,
		  ShowPublishConfirmation: false,
		  PublishConfirmationTitle:'',
		  PublishConfirmationMessage:''
		}
	  }


	 

	  PublishedUnPublished(){
		let enterpriseJson = this.state.EnterpriseJson;	
		
		if(enterpriseJson.IsActive === true && enterpriseJson.IsMenuModified === false){
			this.PublishedUnPublishedMenu(false);
			return;
		}

		this.PublishedUnPublishedMenu(true);
	

	  }


	  //#region api call

	  GetEnterpriseMenuJson = async()=>{
    
		this.setState({ShowLoader: true});


		let json = await EnterpriseMenuService.GetEnterpriseJson()
		
		if(json !== null && json !== undefined){

		json.LastModifiedMenuJson = Number((json.LastModifiedMenuJson).replace('/Date(','').replace(')/',''));
	
		if(this.state.IsMenuModified !== json.IsMenuModified){   
		  this.setState({ IsMenuModified: json.IsMenuModified,EnterpriseJson: json})
		}
		this.setState({EnterpriseJson: json})
	}

		this.setState({ShowLoader: false});


	  }
SweetAlertPublish(){
	return(		
	<SweetAlert
		show={this.state.ShowPublishConfirmation}
		title={this.state.PublishConfirmationTitle}
		text={this.state.PublishConfirmationMessage}
		showCancelButton
		onConfirm={() => {this.PublishedUnPublishedMenu()}} 
		onCancel={() => { this.setState({ ShowPublishConfirmation: false });
		}}
		onEscapeKey={() => this.setState({ ShowPublishConfirmation: false })}
		onOutsideClick={() => this.setState({ ShowPublishConfirmation: false })}
	/>)
}     


	  PublishedUnPublishedMenuConfirmation(){

		let isPublished = (this.state.IsMenuModified || !this.state.EnterpriseJson.IsActive);
		let title ="Confirmation"
		let message = "Are you sure you want to " + (isPublished ?'Publish':'UnPublish')
		
		this.setState({ShowPublishConfirmation:true, PublishConfirmationTitle:title,PublishConfirmationMessage:message})
	  }			

	  PublishedUnPublishedMenu = async() =>{
        this.setState({ShowPublishConfirmation:false})
		let isPublished = (this.state.IsMenuModified || !this.state.EnterpriseJson.IsActive);
		let message = await EnterpriseMenuService.PublishedUnPublishedMenu(isPublished);

		if(message==='1'){
			this.GetStatus(); 
			this.GetEnterpriseMenuJson();
			Utilities.notify( (isPublished ? 'Menu changes are queued for publishing.' : 'Menu has been successfully UnPublished.'), "s");
			return;

		}
		Utilities.notify(" Menu not successfully "+ (isPublished ?'Published.':'UnPublished.'),"e");

	  }

	  GetStatus = async()=>{
		this.setState({ShowLoader: true});
		let status = await EnterpriseMenuService.GetMenuStatus();
		this.setState({PublishStatus: status});
		this.GetEnterpriseMenuJson();
		// this.setState({ShowLoader: false});
		// console.log(status);
	  }
	 
	  //#endregion

	  //#region Html Rendering

	  RenderMenuPublishedDetailHtml(){


		
		if(this.state.ShowLoader){
			return( this.loading());
		}


		let enterpriseJson = this.state.EnterpriseJson;
		let status ="Published";

		if(this.state.PublishStatus === 1 || this.state.PublishStatus === 2){
			status="Queued (est. time 20 mins)";
			//let intervalId  = setInterval(this.GetStatus, 10000);
    		//this.setState({intervalStatus: intervalId});
		}
		else if(enterpriseJson.EnterpriseRestaurantId === 0){
			status= "Not published";
		}
		else if(!enterpriseJson.IsActive){
			status = "Not published"
		}
		else if(enterpriseJson.IsMenuModified){
			status ="Modified";
		}
		


		return(

			<div className="card-footer card-footer  text-dark" style={{ background: '#fff' }}>
						<div className="menu-status-footer">
							<div className="menu-status-row">
								<span className="bold">Menu Status:</span>
								<span>
								<span>{enterpriseJson.IsMenuModified?<i className="fa fa-exclamation-triangle"></i>:''}</span>
								{status} 

								</span>
							</div>
							<div className="menu-status-row">
								<span className="bold">Last Publish Date:</span>
								<span>{Object.keys(enterpriseJson).length === 0 ||  enterpriseJson.EnterpriseRestaurantId === 0 ? '-' : moment(new Date(enterpriseJson.LastModifiedMenuJson)).format('DD-MM-YYYY hh:mm:ss')}</span>
							</div>
							<div className="menu-status-row">
								<span className="bold">Publish By:</span>
								<span>{enterpriseJson.UserName}</span>
							</div>
						</div>

			</div>

		  )
	  }

	  RenderMenuPublishHtml(){

		let enterpriseJson = this.state.EnterpriseJson;
		
		if(this.state.ShowLoader){
			return('');
		}

		
		let message = "Your Business menu has not been published yet."
		//classText = "text-danger";
		let classAlert = "alert alert-danger text-left";
		let title = "UNPUBLISHED:";
		let buttonText = "Publish Menu";
		let iconClass = "fa fa-exclamation-triangle font-24";

		if(enterpriseJson.IsMenuModified) {
			message = "Your Business menu is modified after last publish. New changes will not appear until you republish the menu.";
			//classText = "text-warning";
			classAlert = "alert alert-warning text-left";
			title = "Modified:";
			buttonText = "Republish Menu";
			iconClass = "fa fa-exclamation-triangle font-24";
		}
		else if(enterpriseJson.EnterpriseRestaurantId > 0 && enterpriseJson.IsActive){
			
		 message=  "Menu has been successfully published";
		 title = "Published:";	
		 classAlert = "alert  alert-success text-left";
		 buttonText= "UnPublished Menu";
		 iconClass = "fa fa-check font-24"; 
		
		} 

		return(

				<div className="card-body col-md-12 col-xs-12 p-t-0 menu-alert" style={{ margin: '0px auto' }}>

				{ buttonText === 'UnPublished Menu' ? "" : 
				
					(this.state.PublishStatus === 1 || this.state.PublishStatus === 2) || (this.state.PublishStatus === 3 && !enterpriseJson.IsMenuModified ) ? ("") : (<button onClick={()=>this.PublishedUnPublishedMenuConfirmation()} className="btn btn-primary">{buttonText}</button>) 
				}
				</div>
	
		) 
		
	  }
	  
	  loading = () =>   <div className="page-laoder">
	  						<div className="loader-menu-inner"> 
								<Loader type="Oval" color="#ed0000" height={50} width={50}/>  
								<div className="loading-label">Loading.....</div>
							</div>
						</div> 

	  //#endregion

   
	
	componentDidMount(){
		this.GetStatus();
		
	}


    render() {


		if(this.state.ShowLoader){
			return this.loading();
		}


		let enterpriseJson = this.state.EnterpriseJson;
		let iconColor = "#00c292"
		let MenustatusText = "PUBLISHED";
		if(Object.keys(enterpriseJson).length > 0){
		
		if(enterpriseJson.IsMenuModified){
			iconColor = "#ff5722";
			MenustatusText = "MODIFIED";
		}
		
		else if(enterpriseJson.EnterpriseRestaurantId === 0 || enterpriseJson.IsActive === false) {
			iconColor = "#333";
			MenustatusText = "UNPUBLISHED";
		}
		

		if(this.state.PublishStatus === 1 || this.state.PublishStatus === 2){
			iconColor = "#ff5722";
			MenustatusText = "Sent to Republish";
		}
		} else 	{iconColor = "#333";}
	   
		return (
			<div className="menu-status-wrap">
				<div className="card text-center">
				<div style={{textAlign:'left'}} >
						<h3 className="card-title card-new-title">Menu Status</h3>
					</div> 
					<div className="card-body p-b-0">
					
						<div className="icon-memu-status" style={{color: iconColor}}>
							<i className="fa fa-globe" aria-hidden="true"></i>
						</div>

						<h5>
							<span>{MenustatusText}</span>
						</h5>

					</div>
					{this.RenderMenuPublishHtml()}
					{this.RenderMenuPublishedDetailHtml()}
					{this.SweetAlertPublish()}
				</div>
			</div>
        );
    }
}

export default MenuStatus;
