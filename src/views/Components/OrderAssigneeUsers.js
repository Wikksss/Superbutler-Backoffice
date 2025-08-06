import React, { Component } from 'react';
import * as Utilities from '../../helpers/Utilities'
import Config from '../../helpers/Config';
import Constants from '../../helpers/Constants';

class OrderAssigneeUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
    };

    if(!Utilities.stringIsEmpty(sessionStorage.getItem(Constants.CONFIG_SETTINGS))){
      this.state.settings = JSON.parse(sessionStorage.getItem(Constants.CONFIG_SETTINGS));
    }

  }

  componentDidMount() {
    
  }

  render() {
   
    return (

        <div>
        {
            this.state.loadingUser ? 
                 <div className="loader-menu-inner">
                 <Loader type="Oval" color="#ed0000" height={50} width={50} />
                 <div className="loading-label">Loading.....</div>
               </div> : 
            <>
            
            {this.state.parentUsers.length > 0 && <span>Hotel Users</span>}
             {this.state.parentUsers.length > 0 &&
           
             this.state.parentUsers.map((user)=>{
                 return(
                   <div className='order-assign-inner cursor-pointer' onClick={() => {this.UpdateAssigneeApi(user)}}>
                 { Utilities.stringIsEmpty(user.PhotoName) ?
                 <Avatar className="header-avatar" name={Utilities.stringIsEmpty(user.FirstName) ? user.DisplayName :`${user.FirstName} ${user.SurName}` } round={true} size="35" textSizeRatio={2} />
                 :
                 <img className='assign-o-image' src={Utilities.generatePhotoLargeURL(user.PhotoName, true, false)}/>
                 }
                 <div className='order-assign-email-user'>
                   <div className='d-flex flex-column'>
                   <span className={this.state.selectedOrder.AssingTo == user.Id ? "bold" : ""}>{Utilities.stringIsEmpty(user.FirstName) ? user.DisplayName :`${user.FirstName} ${user.SurName}` } <span className='ml-1'>{user.Id == this.state.userObj.Id ? "(You)" : ""}</span></span>
                   
                   <span class={`alert alert-secondary enterprise-txt mb-0 p-1 px-2 font-12 ${user.RoleLevel == Constants.Role.ENTERPRISE_ADMIN_ID ? "admin-color" :  user.RoleLevel == Constants.Role.ENTERPRISE_MANAGER_ID ? "manager-color" : "staff-color" }`}>
                   {user.RoleLevel == Constants.Role.ENTERPRISE_ADMIN_ID ? <RiAdminFill/>  :  user.RoleLevel == Constants.Role.ENTERPRISE_MANAGER_ID ? <FaUserTie/> : <i class="fa fa-user"></i> }
                   {user.RoleLevel == Constants.Role.ENTERPRISE_ADMIN_ID ? Constants.Role.ENTERPRISE_ADMIN  :  user.RoleLevel == Constants.Role.ENTERPRISE_MANAGER_ID ? Constants.Role.ENTERPRISE_MANAGER : Constants.Role.ENTERPRISE_USER }
                     </span>
                   </div>
                   { this.state.selectedOrder.AssignTo == user.Id &&
                   <div className='ml-auto'>
                     <span className='staff-check'><FaCheck /></span>
                   </div>
                   }
                 </div>
                 </div>)
               })
             }
   
         
         {this.state.users.length > 0 && <span>Service Users {this.state.selectedOrder.AssingTo}</span>}
         {this.state.users.length > 0 &&
           
           this.state.users.map((user)=> {
             return(
               <div className='order-assign-inner cursor-pointer' onClick={() => {this.UpdateAssigneeApi(user)}}>
           { Utilities.stringIsEmpty(user.PhotoName) ?
                 <Avatar className="header-avatar" name={Utilities.stringIsEmpty(user.FirstName) ? user.DisplayName :`${user.FirstName} ${user.SurName}` } round={true} size="35" textSizeRatio={2} />
                 :
                 <img className='assign-o-image' src={Utilities.generatePhotoLargeURL(user.PhotoName, true, false)} />
             }
         <div className='order-assign-email-user'>
           <div className='d-flex flex-column'>
           <span className={this.state.selectedOrder.AssingTo == user.Id ? "bold" : ""}>{Utilities.stringIsEmpty(user.FirstName) ? user.DisplayName :`${user.FirstName} ${user.SurName}` }</span>
           <span class={`alert alert-secondary enterprise-txt mb-0 p-1 px-2 font-12 ${user.RoleLevel == Constants.Role.ENTERPRISE_ADMIN_ID ? "admin-color" :  user.RoleLevel == Constants.Role.ENTERPRISE_MANAGER_ID ? "manager-color" : "staff-color" }`}>
           {user.RoleLevel == Constants.Role.ENTERPRISE_ADMIN_ID ? <RiAdminFill/>  :  user.RoleLevel == Constants.Role.ENTERPRISE_MANAGER_ID ? <FaUserTie/> : <i class="fa fa-user"></i> }
           {user.RoleLevel == Constants.Role.ENTERPRISE_ADMIN_ID ? Constants.Role.ENTERPRISE_ADMIN  :  user.RoleLevel == Constants.Role.ENTERPRISE_MANAGER_ID ? Constants.Role.ENTERPRISE_MANAGER : Constants.Role.ENTERPRISE_USER }
             </span>
           </div>
           { this.state.selectedOrder.AssignTo == user.Id &&
                   <div className='ml-auto'>
                     <span className='staff-check'><FaCheck /></span>
                   </div>
                   }
         </div>
         </div>)
           })
         }
   
           </>
         }
         </div>
       
    );
  }
}

export default OrderAssigneeUsers;