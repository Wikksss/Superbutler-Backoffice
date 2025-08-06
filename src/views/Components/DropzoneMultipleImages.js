import React, {useCallback, useEffect, useState, useRef } from 'react';
import {useDropzone} from 'react-dropzone';
import { DndProvider } from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {TouchBackend} from "react-dnd-touch-backend";
import update from "immutability-helper";

import ImageList from "./ImageList";


const isTouchDevice = () => {
  if ("ontouchstart" in window) {
    return true;
  }
  return false;
};


const backendForDND = isTouchDevice() ? TouchBackend : HTML5Backend;

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #d2d2d2',
  padding: 4,
  boxSizing: 'border-box'
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
 
function Previews(props) {

  const [existingFile, setExixtingFiles] = useState(props.existingPhotos);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    
  });
  
  const moveImage = (dragIndex, hoverIndex) => {
    const draggedImage = existingFile[dragIndex];
   
    var updatedFiles =  update(existingFile, {
        $splice: [[dragIndex, 1], [hoverIndex, 0, draggedImage]]
      },)

    setExixtingFiles(updatedFiles);
    props.UpdateImageSorting(updatedFiles);

  };

  const getClassName = (className, isActive) => {
    if (!isActive) return className;
    return `${className} ${className}-active`;
  };
  
  const removeExtingFile = (item) => {
    
    var updatedFiles = existingFile.filter(i => i.AbsoluteUrl != item.AbsoluteUrl);

    setExixtingFiles(updatedFiles);
    props.UpdateImageSorting(updatedFiles);

  }

  const onTabChange = () => {
    props.onTabChange(1);
  }
  
useEffect(() => { 
 
    setExixtingFiles(props.existingPhotos);

}, [props.existingPhotos]);


  return (
    <section>
  
        <DndProvider backend={backendForDND}>
        {existingFile.length > 0 ?
        <div className={'multiple-image-wrap-preview'}>
        <ImageList images={existingFile} moveImage={moveImage} removeExtingFile={removeExtingFile} props={props}/>
        </div>
            :
            
                <div className='d-flex align-items-center justify-content-center flex-column pt-5' style={{gap:20}}>
              <span className='add images font-20  bold'>Add images from media library</span>
              <button className='btn btn-primary' onClick={() => onTabChange(1)}>Choose from media library</button>
                </div>
    }

      </DndProvider>

      <div className={getClassName("dropzone", isDragActive)}  {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        
      </div>

    </section>
  );

}
export default Previews;