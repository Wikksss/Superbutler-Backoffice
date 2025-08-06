import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import * as Utilities from '../../helpers/Utilities';
import Config from '../../helpers/Config';

const type = "image/jpeg, image/png"; // Need to pass which type element can be draggable



const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #d2d2d2',
  padding: 4,
  boxSizing: 'border-box',
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden',
  alignItems:'center',
  justifyContent:'center',
  position: 'relative',
  width:'100%'
};

const thumbInnerExisting = {
  display: 'flex',
  minWidth: 150,
  overflow: 'hidden',
  alignItems:'center',
  justifyContent:'center',
  position: 'relative',
  width:'100%'
};

const img = {
  display: 'block',
  width: 'auto',
  display: 'block',
  maxHeight: '100%',
  maxWidth: '100%',
  position: 'absolute',
  zIndex: '1',
 
};

const Image = ({ image, index, moveImage, removeExtingFile, props}) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    
    accept: type,
    hover(item) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Move the content
      moveImage(dragIndex, hoverIndex);
      
      // Update the index for dragged item directly to avoid flickering when half dragged
      item.index = hoverIndex;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    item: { id: image.id, index },
    type: type,
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  // initialize drag and drop into the element
  drag(drop(ref));

  return (

    <div ref={ref} className='large-div' >
<div className="overlay-cross-img-wrap">

  <div className='overlay-cross-img'>

  </div>
  <div className='cross-img-x'>
  <span onClick={() => removeExtingFile(image)} className='btn btn-danger mb-2 cursor-pointer enlarge-btn font-10 py-1 px-1' style={{zIndex:2, width:65}} >Remove</span>
  
  </div>

    <img  src={Utilities.generatePhotoURL(`${decodeURIComponent(image.AbsoluteUrl)}`)} alt={image.AltText} />

   </div>
   <span className='btn btn-primary primary-first-btn py-1 px-1'><span className='fa fa-star'></span> Primary</span>
   </div>





  );
};

const ImageList = ({ images, moveImage, removeExtingFile, props }) => {
  const renderImage = (image, index) => {
   
    return (
      

      <Image
        image={image}
        index={index}
        key={`${image.AbsoluteUrl}-image`}
        moveImage={moveImage}
        removeExtingFile ={removeExtingFile}
        props={props}
      />
     
    );
  };

  return images.map(renderImage) ;
  


};

export default ImageList;