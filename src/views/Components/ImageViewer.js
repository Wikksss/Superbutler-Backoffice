import React, { Component } from 'react'
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import * as Utilities from '../../helpers/Utilities';
import Constants from '../../helpers/Constants';
import arrayMove from 'array-move';
import { FiMove } from "react-icons/fi";

// const SortableItem = sortableElement(({ value }) => <li className="sortableHelper">{value}</li>);
const SortableItem = sortableElement(({ item, onDelete }) =>
                               
<div className='large-div' >
<div className="overlay-cross-img-wrap">

  <div className='overlay-cross-img'>

  </div>
  <div className='cross-img-x'>
  <span onClick={() => onDelete(item)} className='btn btn-danger mb-2 cursor-pointer enlarge-btn font-10 py-1 px-1' style={{zIndex:2, width:65}} >Remove</span>
  
  </div>

    <img  src={Utilities.generatePhotoURL(item.AbsoluteUrl)} alt={item.AltText} />

   </div>
   <span className='btn btn-primary primary-first-btn py-1 px-1'><span className='fa fa-star'></span> Primary</span>
   </div>

);


const SortableContainer = sortableContainer(({ items, onDelete, onTabChange }) => {
    if (items === undefined) { return; }
    return (
      <div className='mt-4'>
    {items.length > 1 && (
        <p className='font-16'>
          Drag Images using <span className='drag-icon'><FiMove/></span> to reposition.
        </p>
      )}
      {items.length == 0 && (
        <div className='d-flex align-items-center justify-content-center flex-column pt-5' style={{gap:20}}>
      <span className='add images font-20  bold'>Add images from media library</span>
      <button className='btn btn-primary' onClick={() => onTabChange(1)}>Choose from media library</button>
        </div>
      )}

    
        <div className='multiple-image-wrap-preview'>
            
            {items.map((value, index) => {
                return (
                    <SortableItem key={`item-${index}`} item={value}  onDelete={onDelete} index={index} />
                )
            })}
              
        </div>
        </div>
    );
});


export class ImageViewer extends Component {

  constructor(props) {

    super(props);

    this.state = {
      images: props.imageList
    }
    // console.log("List1", this.state.images);

  }

  onSortEnd = ({ oldIndex, newIndex }) => {

    this.setState(({ images }) => ({
      images: arrayMove(images, oldIndex, newIndex),
    }));
    
    setTimeout(() => {
      // console.log("List2", this.state.images);
    this.props.UpdateImageSorting(this.state.images);
    }, 100);
};

deleteImage = (item) => {
  var images = this.state.images;
  images = images.filter(i => i.AbsoluteUrl !== item.AbsoluteUrl);
  this.setState({images: images});
  this.props.UpdateImageSorting(images);
}
  render() {
    
    return (
      <div>     
        
        <SortableContainer
         items={this.state.images}
         onSortEnd={this.onSortEnd}
         hideSortableGhost={true}
         onDelete={this.deleteImage}
         distance={1}
         onTabChange={this.props.onTabChange}
         axis={'xy'}
         helperClass="sortable-list-tab"
         >
         </SortableContainer>
     
      </div>
    )
  }
}

export default ImageViewer