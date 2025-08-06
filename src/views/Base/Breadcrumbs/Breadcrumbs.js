import React, { Component } from 'react';
//import { Breadcrumb, BreadcrumbItem, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';

class Breadcrumbs extends Component {
  render() {
   /* return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i><strong>Breadcrumbs</strong>
                <div className="card-header-actions">
                  <a href="https://reactstrap.github.io/components/breadcrumbs/" rel="noreferrer noopener" target="_blank" className="card-header-action">
                    <small className="text-muted">docs</small>
                  </a>
                </div>
              </CardHeader>
              <CardBody>
                <Breadcrumb>
                  <BreadcrumbItem active>Home</BreadcrumbItem>
                </Breadcrumb>
                <Breadcrumb>
                  {/*eslint-disable-next-line}
                  <BreadcrumbItem><a href="#">Home</a></BreadcrumbItem>
                  <BreadcrumbItem active>Library</BreadcrumbItem>
                </Breadcrumb>
                <Breadcrumb>
                  {}
                  <BreadcrumbItem><a href="#">Home</a></BreadcrumbItem>
                  {}
                  <BreadcrumbItem><a href="#">Library</a></BreadcrumbItem>
                  <BreadcrumbItem active>Data</BreadcrumbItem>
                </Breadcrumb>
                <Breadcrumb tag="nav">
                  <BreadcrumbItem tag="a" href="#">Home</BreadcrumbItem>
                  <BreadcrumbItem tag="a" href="#">Library</BreadcrumbItem>
                  <BreadcrumbItem tag="a" href="#">Data</BreadcrumbItem>
                  <BreadcrumbItem active tag="span">Bootstrap</BreadcrumbItem>
                </Breadcrumb>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );*/

    return(
      <div className="menu-page-wrap">
			<div className="menu-left-penal " data-spy="affix" data-offset-top="133" >
				<div className="cat-heading-wrap">
					<span className="common-heading">Categories</span>
					<span className="add-cat-btn" data-toggle="modal" data-target="#categoryModal">
					 <i className="fa fa-plus" aria-hidden="true"></i> <span className="hide-in-responsive">Add new</span>
					</span>
				
				</div>
			<div className="select-cat-btn-res" data-toggle="modal" data-target="#leftcategory">
				<span>
					Pizzas
				</span>
				<span className="change-cat-modal"  >
                    Change
				</span>
			</div>
				    	<div id="leftcategory" className="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
		<div className="modal-dialog modal-lg">
			<div className="modal-content">
				<div className="modal-header">
					<h4 className="modal-title">Select Category</h4>
					<button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
				</div>
				<div className="modal-body">
					<div className="categorie-check-box-wrap">
						
										<div> <input type="checkbox" className="check" id="active" checked/>
						   <label for="active">Active</label></div>
										<div> <input type="checkbox" className="check" id="disabled" checked/>
						   <label for="disabled">Disabled</label></div>
					</div> 
				 <div className="m-b-20 m-t-20" style={{position: 'relative'}}>
					  <input type="text" className="form-control common-serch-field" placeholder="Search Categories" />
					 <i className="fa fa-search" aria-hidden="true" style={{position:'absolute', top: '11px', left: '12px', color: '#777', }}></i>
                  </div>
				<div className="menu-left-cat-list">
					<div className="menu-cat-active-heading">Active</div>
					<ul>
						<li >
							<span className="menu-left-list-label">Drinks</span>
							<span className="menu-left-list-buttons">
								<span data-toggle="modal" data-target="#categoryModalEdit">
							        <i className="fa fa-pencil-square-o" aria-hidden="true" data-toggle="tooltip" title="Edit" data-placement="top"></i>
								</span>
								<span  className="sa-warning">
								    <i className="fa fa-trash" aria-hidden="true" data-toggle="tooltip" title="Remove" data-placement="top"></i>
								</span>
								<span className="sa-suspended">
								    <i className="fa fa-ban" aria-hidden="true" data-toggle="tooltip" title="Disable" data-placement="top"></i>
								</span>
							</span>
						</li>
						
						<li>
							<span className="menu-left-list-label">Smoothies and Shakes</span>
								<span className="menu-left-list-buttons">
							<span data-toggle="modal" data-target="#categoryModalEdit">
							        <i className="fa fa-pencil-square-o" aria-hidden="true" data-toggle="tooltip" title="Edit" data-placement="top"></i>
								</span>
							<span  className="sa-warning">
								    <i className="fa fa-trash" aria-hidden="true" data-toggle="tooltip" title="Delete" data-placement="top"></i>
								</span>
								<span className="sa-suspended">
								    <i className="fa fa-ban" aria-hidden="true" data-toggle="tooltip" title="Suspend" data-placement="top"></i>
								</span>
							</span>
						</li>
							<li className="active">
							<span className="menu-left-list-label">Pizzas</span>
							<span className="menu-left-list-buttons">
							<span data-toggle="modal" data-target="#categoryModalEdit">
							        <i className="fa fa-pencil-square-o" aria-hidden="true" data-toggle="tooltip" title="Edit" data-placement="top"></i>
								</span>
								<span  className="sa-warning">
								    <i className="fa fa-trash" aria-hidden="true" data-toggle="tooltip" title="Delete" data-placement="top"></i>
								</span>
								<span className="sa-suspended">
								    <i className="fa fa-ban" aria-hidden="true" data-toggle="tooltip" title="Suspend" data-placement="top"></i>
								</span>
							</span>
						</li>
							<li>
							<span className="menu-left-list-label">Burgers</span>
							<span className="menu-left-list-buttons">
								<span data-toggle="modal" data-target="#categoryModalEdit">
							        <i className="fa fa-pencil-square-o" aria-hidden="true" data-toggle="tooltip" title="Edit" data-placement="top"></i>
								</span>
							<span  className="sa-warning">
								    <i className="fa fa-trash" aria-hidden="true" data-toggle="tooltip" title="Delete" data-placement="top"></i>
								</span>
								<span className="sa-suspended">
								    <i className="fa fa-ban" aria-hidden="true" data-toggle="tooltip" title="Suspend" data-placement="top"></i>
								</span>
							</span>
						</li>
							<li>
							<span className="menu-left-list-label">Desserts</span>
							<span className="menu-left-list-buttons">
							<span data-toggle="modal" data-target="#categoryModalEdit">
							        <i className="fa fa-pencil-square-o" aria-hidden="true" data-toggle="tooltip" title="Edit" data-placement="top"></i>
								</span>
						<span  className="sa-warning">
								    <i className="fa fa-trash" aria-hidden="true" data-toggle="tooltip" title="Delete" data-placement="top"></i>
								</span>
								<span className="sa-suspended">
								    <i className="fa fa-ban" aria-hidden="true" data-toggle="tooltip" title="Suspend" data-placement="top"></i>
								</span>
							</span>
						</li>
							<li>
							<span className="menu-left-list-label">Crepes</span>
								<span className="menu-left-list-buttons">
							<span data-toggle="modal" data-target="#categoryModalEdit">
							        <i className="fa fa-pencil-square-o" aria-hidden="true" data-toggle="tooltip" title="Edit" data-placement="top"></i>
								</span>
							<span  className="sa-warning">
								    <i className="fa fa-trash" aria-hidden="true" data-toggle="tooltip" title="Delete" data-placement="top"></i>
								</span>
								<span className="sa-suspended">
								    <i className="fa fa-ban" aria-hidden="true" data-toggle="tooltip" title="Suspend" data-placement="top"></i>
								</span>
							</span>
						</li>
					</ul>
					<div className="menu-cat-not-active-heading">Disabled</div>
						<ul>
								<li>
							<span className="menu-left-list-label">Vegeterian Special</span>
								<span className="menu-left-list-buttons">
							<span data-toggle="modal" data-target="#categoryModalEdit">
							        <i className="fa fa-pencil-square-o" aria-hidden="true" data-toggle="tooltip" title="Edit" data-placement="top"></i>
								</span>
							<span  className="sa-warning">
								    <i className="fa fa-trash" aria-hidden="true" data-toggle="tooltip" title="Delete" data-placement="top"></i>
								</span>
								<span className="sa-suspended">
								    <i className="fa fa-ban" aria-hidden="true" data-toggle="tooltip" title="Suspend" data-placement="top"></i>
								</span>
							</span>
						</li>
							<li>
							<span className="menu-left-list-label">Rice</span>
								<span className="menu-left-list-buttons">
							<span data-toggle="modal" data-target="#categoryModalEdit">
							        <i className="fa fa-pencil-square-o" aria-hidden="true" data-toggle="tooltip" title="Edit" data-placement="top"></i>
								</span>
								<span  className="sa-warning">
								    <i className="fa fa-trash" aria-hidden="true" data-toggle="tooltip" title="Delete" data-placement="top"></i>
								</span>
								<span className="sa-suspended">
								    <i className="fa fa-ban" aria-hidden="true" data-toggle="tooltip" title="Suspend" data-placement="top"></i>
								</span>
							</span>
						</li>
							<li>
							<span className="menu-left-list-label">Extras</span>
							<span className="menu-left-list-buttons">
								<span data-toggle="modal" data-target="#categoryModalEdit">
							        <i className="fa fa-pencil-square-o" aria-hidden="true" data-toggle="tooltip" title="Edit" data-placement="top"></i>
								</span>
								<span  className="sa-warning">	
								    <i className="fa fa-trash" aria-hidden="true" data-toggle="tooltip" title="Delete" data-placement="top"></i>
								</span>
								<span className="sa-suspended">
								    <i className="fa fa-ban" aria-hidden="true" data-toggle="tooltip" title="Suspend" data-placement="top"></i>
								</span>
							</span>
						</li>

						</ul>
				</div>
								</div>
					<div className="modal-footer">
					<button type="button" className="btn btn-default waves-effect" data-dismiss="modal">Cancel</button>
							<button type="button" className="btn btn-success waves-effect" >Save</button>
				</div>
			</div>
		</div>
	</div>
				
			</div>

			<div className="menu-right-penal">
			  <div className="menu-category-image-wraper">
				 <div className="bg-image" >
				 </div>
				  <div className="menu-heading-desc-wrapper">
					 Pizzas
				  </div>
<div className="res-ponsive-cate"><span className="menu-left-list-buttons">
					  <span data-toggle="modal" data-target="#MenuCoverPopup">
						   <i className="fa fa-picture-o" aria-hidden="true"></i>
    <span className="common-cat-icon-span">Change Photo</span>
					  </span>
							<span data-toggle="modal" data-target="#categoryModalEdit">
							        <i className="fa fa-pencil-square-o" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Edit"></i>  <span className="common-cat-icon-span">Edit</span>
								</span>
								<span className="sa-warning">
								    <i className="fa fa-trash" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Remove"></i>
  <span className="common-cat-icon-span">Delete</span>
								</span>
								<span className="sa-suspended">
								    <i className="fa fa-ban" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Disable"></i>
  <span className="common-cat-icon-span">Disable</span>
								</span>
							</span>

				  </div>
		
			  </div>

				<div className="add-item-btn-wrap">
					<div className="items-check-boxes-wrap">
						<div className="items-heading">
							<span className="hide-in-responsive">Category</span> Items
						</div>
						<div className="items-check-boxes">
							<div className="categorie-check-box-wrap">
							
												<div> <input type="checkbox" className="check" id="active1" checked/>
								   <label for="active1">Active</label></div>
												<div> <input type="checkbox" className="check" id="disabled1" checked/>
								   <label for="disabled1">Disabled</label></div>
							</div>
						</div>
					</div>

			<div className="search-item-wrap" >
					  <input type="text" className="form-control common-serch-field" placeholder="Search items" />
					 <i className="fa fa-search" aria-hidden="true" ></i>
          </div>
					<span className="add-cat-btn" data-toggle="modal" data-target="#addItemModal">
					  <i className="fa fa-plus" aria-hidden="true"></i>
						<span className="hide-in-responsive">Add item</span>
					</span>
				</div>
				<p className="separator">
					<span></span>
				</p>
		<div className="item-main-row">
				<div className="item-row-wrap" >
					<span className="item-icon cursor-pointer" data-toggle="modal" data-target="#itemPhotoModal"><i className="fa fa-picture-o" aria-hidden="true"></i></span>
					<span className="item-name">Margherita Pizza</span>
					<span className="menu-right-list-buttons">
						<span data-toggle="modal" data-target="#addItemEditModal">
							        <i className="fa fa-pencil-square-o" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Edit"></i>
								</span>
							<span className="sa-warning">
								    <i className="fa fa-trash" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Remove"></i>
								</span>
								<span className="sa-suspended">
								    <i className="fa fa-ban" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Disable"></i>
								</span>
					</span>
					
				</div>
				<p className="item-row-wrap">
					Tomato base with mozzarella and cheddar cheese
				</p>
	
			<div className="item-option-detail-wrap">
				<div className="item-option-detail-inner-wrap">
					<div className="item-option-name-price">
						<span>8 inch Regular</span>
						<span className="bold">£3.49</span>
					</div>
					<div className="item-option-topping-extras no-extras-top no-extras-top">
						<span>No Extras</span>
						<span>No Topping</span>
						
					</div>
				</div><div className="item-option-edit">
						<span className="font-16 show-add-option cursor-pointer">
							<i className="fa fa-pencil-square-o" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Edit"></i>
						</span>
					<span className="sa-warning">
								    <i className="fa fa-trash" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Remove"></i>
								</span>
					</div>
					                          
			</div>
	<div className="item-option-detail-wrap">
				<div className="item-option-detail-inner-wrap">
					<div className="item-option-name-price">
						<span>12 inch Large</span>
						<span className="bold">£8.49</span>
					</div>
					<div className="item-option-topping-extras no-extras-top">
						<span>No Extras</span>
						<span>No Topping</span>
						
					</div>
				</div><div className="item-option-edit">
						<span className="font-16 show-add-option cursor-pointer">
							<i className="fa fa-pencil-square-o" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Edit"></i>
						</span>
					<span className="sa-warning">
								    <i className="fa fa-trash" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Remove"></i>
								</span>
					</div>
					                          
				</div><div className="item-option-detail-wrap">
				<div className="item-option-detail-inner-wrap">
					<div className="item-option-name-price">
						<span>16 inch X-Large </span>
						<span className="bold">£10.49</span>
					</div>
					<div className="item-option-topping-extras">
						<span>Extras: Meal For Two</span>
						<span>Topping: Pizza Topping </span>
						
					</div>
				</div><div className="item-option-edit">
						<span className="font-16 show-add-option cursor-pointer">
							<i className="fa fa-pencil-square-o" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Edit"></i>
						</span>
					<span className="sa-warning">
								    <i className="fa fa-trash" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Remove"></i>
								</span>
					</div>
					                          
				</div>
				
					<div className="edit-option-show no-display" >
						<div className="add-option-field-wrap ">
						<div className="verity-filed">
							<input type="text" value="16 inch X-Large" />
							<span>Name</span>
						</div>
						<div className="verity-price">
							<input type="text" value="£10.49"/>
							<span>Price</span>
						</div>
						<div className="verity-topping">
						<select>
						  <option value="Pizza Topping">Pizza Topping</option>
						  <option value="Milkshakes Topping">Milkshakes Topping</option>
						  <option value="Sub Topping">Sub Topping</option>
						</select>
							<span>Select toppings</span>
							
						</div>
						<div className="verity-extras">
					   <select>
						  <option value="21 inch Jumbo Pizza">21 inch Jumbo Pizza</option>
						  <option value="Meal for Two">Meal for Two</option>
						  <option value="Family Platter">Family Platter</option>
						  <option value="Meal Deal Four">Meal Deal Four</option>
						</select>
							<span>Select Extras</span>
						</div>
											<button className="add-option-save-btn btn btn-success">Save</button>
					     <button  className="add-option-save-btn btn waves-effect waves-light btn-outline-secondary">Cancel</button>
					</div>
						</div>
					<a className="add-option-btn" data-toggle="modal" data-target="#addOptionModal">
						<i className="fa fa-plus" aria-hidden="true"></i>
						add option
					</a>
				</div>
				<p className="separator">
					<span></span>
				</p>
				<div className="item-main-row">
				<div className="item-row-wrap" >
					<span className="item-icon cursor-pointer" data-toggle="modal" data-target="#itemPhotoModal" ><i className="fa fa-picture-o" aria-hidden="true"></i></span>
					<span className="item-name">Chicken Fajita</span>
					<span className="menu-right-list-buttons">
						<span data-toggle="modal" data-target="#addItemEditModal">
							        <i className="fa fa-pencil-square-o" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Edit"></i>
								</span>
							<span className="sa-warning">
								    <i className="fa fa-trash" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Remove"></i>
								</span>
								<span className="sa-suspended">
								    <i className="fa fa-ban" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Disable"></i>
								</span>
					</span>
					
				</div>
				<p className="item-row-wrap">
					Tomato base with mozzarella and cheddar cheese
				</p>
	
			<div className="item-option-detail-wrap">
				<div className="item-option-detail-inner-wrap">
					<div className="item-option-name-price">
						<span>8 inch Regular</span>
						<span className="bold">£4.49</span>
					</div>
					<div className="item-option-topping-extras no-extras-top no-extras-top">
						<span>No Extras</span>
						<span>No Topping</span>
						
					</div>
				</div><div className="item-option-edit">
						<span className="font-16 show-add-option cursor-pointer">
							<i className="fa fa-pencil-square-o" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Edit"></i>
						</span>
					<span className="sa-warning">
								    <i className="fa fa-trash" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Remove"></i>
								</span>
					</div>
					                          
			</div>
	<div className="item-option-detail-wrap">
				<div className="item-option-detail-inner-wrap">
					<div className="item-option-name-price">
						<span>12 inch Large</span>
						<span className="bold">£6.49</span>
					</div>
					<div className="item-option-topping-extras no-extras-top">
						<span>No Extras</span>
						<span>No Topping</span>
						
					</div>
				</div><div className="item-option-edit">
						<span className="font-16 show-add-option cursor-pointer">
							<i className="fa fa-pencil-square-o" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Edit"></i>
						</span>
					<span className="sa-warning">
								    <i className="fa fa-trash" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Remove"></i>
								</span>
					</div>
					                          
				</div><div className="item-option-detail-wrap">
				<div className="item-option-detail-inner-wrap">
					<div className="item-option-name-price">
						<span>16 inch X-Large </span>
						<span className="bold">£11.49</span>
					</div>
					<div className="item-option-topping-extras">
						<span>Extras: Meal For Two</span>
						<span>Topping: Pizza Topping </span>
						
					</div>
				</div><div className="item-option-edit">
						<span className="font-16 show-add-option cursor-pointer">
							<i className="fa fa-pencil-square-o" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Edit"></i>
						</span>
					<span className="sa-warning">
								    <i className="fa fa-trash" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Remove"></i>
								</span>
					</div>
					                          
				</div>
				
					<div className="edit-option-show no-display" >
						<div className="add-option-field-wrap ">
						<div className="verity-filed">
							<input type="text" value="16 inch X-Large"/>
							<span>Name</span>
						</div>
						<div className="verity-price">
							<input type="text" value="£10.49"/>
							<span>Price</span>
						</div>
						<div className="verity-topping">
						<select>
						  <option value="Pizza Topping">Pizza Topping</option>
						  <option value="Milkshakes Topping">Milkshakes Topping</option>
						  <option value="Sub Topping">Sub Topping</option>
						</select>
							<span>Select toppings</span>
							
						</div>
						<div className="verity-extras">
					   <select>
						  <option value="21 inch Jumbo Pizza">21 inch Jumbo Pizza</option>
						  <option value="Meal for Two">Meal for Two</option>
						  <option value="Family Platter">Family Platter</option>
						  <option value="Meal Deal Four">Meal Deal Four</option>
						</select>
							<span>Select Extras</span>
						</div>
						 <button className="add-option-save-btn btn btn-success">Save</button>
					     <button  className="add-option-save-btn btn waves-effect waves-light btn-outline-secondary">Cancel</button>
					</div>
						</div>
					<a className="add-option-btn" data-toggle="modal" data-target="#addOptionModal">
						<i className="fa fa-plus" aria-hidden="true"></i>
						add option
					</a>
				</div>
				<p className="separator">
					<span></span>
				</p>
				<div className="item-main-row">
				<div className="item-row-wrap" >
					<span className="item-icon cursor-pointer" data-toggle="modal" data-target="#itemPhotoModal"><i className="fa fa-picture-o" aria-hidden="true"></i></span>
					<span className="item-name">Cheese Lover</span>
					<span className="menu-right-list-buttons">
						<span data-toggle="modal" data-target="#addItemEditModal">
							        <i className="fa fa-pencil-square-o" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Edit"></i>
								</span>
							<span className="sa-warning">
								    <i className="fa fa-trash" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Remove"></i>
								</span>
								<span className="sa-suspended">
								    <i className="fa fa-ban" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Disable"></i>
								</span>
					</span>
					
				</div>
				<p className="item-row-wrap">
					Tomato base with mozzarella and cheddar cheese
				</p>
	
			<div className="item-option-detail-wrap">
				<div className="item-option-detail-inner-wrap">
					<div className="item-option-name-price">
						<span>8 inch Regular</span>
						<span className="bold">£5.49</span>
					</div>
					<div className="item-option-topping-extras no-extras-top no-extras-top">
						<span>No Extras</span>
						<span>No Topping</span>
						
					</div>
				</div><div className="item-option-edit">
						<span className="font-16 show-add-option cursor-pointer">
							<i className="fa fa-pencil-square-o" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Edit"></i>
						</span>
					<span className="sa-warning">
								    <i className="fa fa-trash" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Remove"></i>
								</span>
					</div>
					                          
			</div>
	<div className="item-option-detail-wrap">
				<div className="item-option-detail-inner-wrap">
					<div className="item-option-name-price">
						<span>12 inch Large</span>
						<span className="bold">£7.49</span>
					</div>
					<div className="item-option-topping-extras no-extras-top">
						<span>No Extras</span>
						<span>No Topping</span>
						
					</div>
				</div><div className="item-option-edit">
						<span className="font-16 show-add-option cursor-pointer">
							<i className="fa fa-pencil-square-o" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Edit"></i>
						</span>
					<span className="sa-warning">
								    <i className="fa fa-trash" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Remove"></i>
								</span>
					</div>
					                          
				</div><div className="item-option-detail-wrap">
				<div className="item-option-detail-inner-wrap">
					<div className="item-option-name-price">
						<span>16 inch X-Large </span>
						<span className="bold">£9.49</span>
					</div>
					<div className="item-option-topping-extras">
						<span>Extras: Meal For Two</span>
						<span>Topping: Pizza Topping </span>
						
					</div>
				</div><div className="item-option-edit">
						<span className="font-16 show-add-option cursor-pointer">
							<i className="fa fa-pencil-square-o" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Edit"></i>
						</span>
					<span className="sa-warning">
								    <i className="fa fa-trash" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Remove"></i>
								</span>
					</div>
					                          
				</div>
				
					<div className="edit-option-show no-display" >
						<div className="add-option-field-wrap ">
						<div className="verity-filed">
							<input type="text" value="16 inch X-Large"/>
							<span>Name</span>
						</div>
						<div className="verity-price">
							<input type="text" value="£10.49" />
							<span>Price</span>
						</div>
						<div className="verity-topping">
						<select>
						  <option value="Pizza Topping">Pizza Topping</option>
						  <option value="Milkshakes Topping">Milkshakes Topping</option>
						  <option value="Sub Topping">Sub Topping</option>
						</select>
							<span>Select toppings</span>
							
						</div>
						<div className="verity-extras">
					   <select>
						  <option value="21 inch Jumbo Pizza">21 inch Jumbo Pizza</option>
						  <option value="Meal for Two">Meal for Two</option>
						  <option value="Family Platter">Family Platter</option>
						  <option value="Meal Deal Four">Meal Deal Four</option>
						</select>
							<span>Select Extras</span>
						</div>
						<button className="add-option-save-btn btn btn-success">Save</button>
					     <button  className="add-option-save-btn btn waves-effect waves-light btn-outline-secondary">Cancel</button>
					</div>
						</div>
					<a className="add-option-btn" data-toggle="modal" data-target="#addOptionModal">
						<i className="fa fa-plus" aria-hidden="true"></i>
						add option
					</a>
				</div>
				</div>
			</div>
    )
  }
}

export default Breadcrumbs;
