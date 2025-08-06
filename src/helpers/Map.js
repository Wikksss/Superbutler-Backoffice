/* global google */

import { withScriptjs, withGoogleMap, GoogleMap, Polygon, Marker,Circle } from "react-google-maps";
import { DrawingManager } from "react-google-maps/lib/components/drawing/DrawingManager";
import React, { Fragment, Component, useRef, useState, useCallback ,useEffect} from "react";
import Autocomplete from 'react-google-autocomplete';
import Geocode from "react-geocode";
import * as DeliveryZoneService from '../service/DeliveryZone';
import { FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Loader from 'react-loader-spinner';
import Config from '../helpers/Config';

function Map(props) {
  let deliveryZone = DeliveryZoneService.DeliveryZone;
  const [center, setCenter] = useState(props.center);
  const [zoneType, setZoneType] = useState(props.zoneType);
  const [mapCenter, setmapCenter] = useState(props.center);
  const [places, setPlaces] = useState(props.places);
  const [addNewZone, setAddNewZone] = useState(props.addNewZone);
  const [zoom] = useState(props.zoom);
  const [zonelimit, setZonelimit] = useState(props.limit);
  const [path, setPath] = useState(null);
  const [SelectedPolygon, setSelectedPolygon] = useState({});
  const [hasPolygonEdited, setEditedPolygon] = useState(false);
  const listenersRef = useRef([]);
  const circle = useRef([]);
  const polygonRef = useRef(Array.from({length: props.limit}, () => React.createRef()))
  let mapRef
  
  //set zones to map screen
  useEffect(() => {
    setTimeout(() => {
      const newBounds = new google.maps.LatLngBounds();
      if(props.fitToCoords.length > 0){
        props.fitToCoords.forEach((place) => {
          newBounds.extend(new google.maps.LatLng(
            place.lat,
            place.lng,
          ));
        });
        mapRef.fitBounds(newBounds)
      } else if(places.length > 0 && zoneType == 0 ) {
        props.places.forEach((place) => {
          var radius = place.circle.radius
          var circle = new google.maps.Circle({
            center: center,
            radius: radius
          });
          newBounds.union(circle.getBounds())
        })
        mapRef.fitBounds(newBounds);
      }

    }, 100);
  }, []);


  // Call setPath with new edited path

  const onEdit = (id,index,path) => {
    
    if(props.addNewZone) return;

    var polygonData = polygonRef.current[index].current
    
    if (polygonData) {
      
      const nextPath = polygonData
        .getPath()
        .getArray()
        .map(latLng => {
          return { lat: latLng.lat(), lng: latLng.lng()};
        });
        
        var selectedPolygon = SelectedPolygon;
        selectedPolygon.Polygon = polygonData;
        selectedPolygon.Id = id;
        selectedPolygon.Index= index;
        selectedPolygon.path= path;
        selectedPolygon.HasEdited = selectedPolygon.HasEdited ? true : false;
        selectedPolygon.EditedPolygonId = selectedPolygon.EditedPolygonId > 0 ? selectedPolygon.EditedPolygonId : 0;
        selectedPolygon.EditedPolygonIndex = selectedPolygon.EditedPolygonIndex > -1 ? selectedPolygon.EditedPolygonIndex : -1;
        selectedPolygon.EditedPolygonPath = selectedPolygon.EditedPolygonPath !== undefined ?  selectedPolygon.EditedPolygonPath.length > 0 ? selectedPolygon.EditedPolygonPath : [] : [];


        if(JSON.stringify(path) !== JSON.stringify(nextPath)) {
           props.onEdit(id,true);
           selectedPolygon.EditedPolygonId = id;
           selectedPolygon.HasEdited = true;
           selectedPolygon.EditedPolygonIndex = index;
           selectedPolygon.EditedPolygonPath = nextPath;

        } else {
          props.onEdit(0, selectedPolygon.HasEdited);
        } 
        if(SelectedPolygon.HasEdited && SelectedPolygon.EditedPolygonId !== id)
        {
          setSelectedPolygon(selectedPolygon)
          CreatePolygonLatLong(nextPath);
          setEditedPolygon(true);
          return;
        } else {
          for (var i = 0; i < places.length; i++) {
            places[i].editable = places[i].id == id;
            if(places[i].id == id)
            places[i].polygon.coords = nextPath;
          }

        setSelectedPolygon(selectedPolygon)
        CreatePolygonLatLong(nextPath);
        setPath(path);

        }
        setPlaces(places);
       
    }
  };


const CreatePolygonLatLong = (path) => { 
  
  deliveryZone.PolygonLatLongArray  = path;
};

const onPolygonComplete = polygon => {
  
  // var allPolygons = [];

  // for(var i=0; i < polygonRef.current.length; i++) {
  //   if(polygonRef.current[i].current !== null){
  //   var poly = polygonRef.current[i].current.state.__SECRET_POLYGON_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
  //   allPolygons.push(poly);
  //   }
  
  // };
   
  // props.onPolygonComplete (polygon, allPolygons);
  props.onPolygonComplete (polygon);

}

const HandleCancelSaveChanges = () => {

  var selectedPolygon = SelectedPolygon;
  var polygonId = props.polygonId;
  props.onEdit(SelectedPolygon.Id,false);
  if(props.hasPolygonEdited){
    SelectedPolygon.Id =polygonId;
 }
  setEditedPolygon(false);

      for (var i = 0; i < places.length; i++) {
      places[i].editable = places[i].id == SelectedPolygon.Id;
      places[i].polygon.coords = places[i].polygon.path;
    }

  setPlaces(places);
  deliveryZone.PolygonLatLong = "";
  var selectedPolygon = SelectedPolygon;
  selectedPolygon.HasEdited =  false;
  selectedPolygon.EditedPolygonId =  0;
  selectedPolygon.EditedPolygonIndex = -1;
  selectedPolygon.EditedPolygonPath = [];
  setSelectedPolygon(selectedPolygon);

};

const HandleSaveChanges = () => {
  
  var selectedPolygon = SelectedPolygon;
  CreatePolygonLatLong(SelectedPolygon.EditedPolygonPath)
  setEditedPolygon(false);
  props.onPolygonSwitch();

}

  const onOverlayComplete = (e) => {
      e.overlay.setMap(null);
   }

  const handleDragEnd = () => {
    var selectedPolygon = SelectedPolygon;
    if(Object.keys(selectedPolygon).length > 0) {
  }
};

if(props.polygonSelected){
  
  props.onPolygonSelect(-1,false);
  
  if(places !== props.places){
    var updatedPlaces = props.places;
     updatedPlaces.forEach( place => {
     if(place.editable && Object.keys(SelectedPolygon).length > 0) {
      place.polygon.coords = SelectedPolygon.EditedPolygonPath.length > 0 ? SelectedPolygon.EditedPolygonPath : place.polygon.coords;
     }
  });
    setPlaces(updatedPlaces);
  }
}

  return (
    <div>
    <GoogleMap
      ref={(ref) => mapRef = ref}
      defaultZoom={zoom}
      defaultCenter={center}
      onDragEnd={handleDragEnd}
      options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: false, }}
    >


    { props.zoneType === 0 ?
      
      props.places.map(place => {
          return (
            <Fragment key={place.id}>
              
              {place.circle && <Circle
                ref={circle}
                defaultCenter={center}
                radius={place.circle.radius}
                options={place.circle.options}
              />}
            </Fragment>
          );
        })
      
      :
      <Fragment>

{places.map(place => {
    


     return (
       place.polygon.areaPolygon.map(polygon => {
      //  console.log("Polygon:   ", polygon.options)
       return (

            <Polygon
             ref={polygonRef.current[polygon.index]}
             id={polygon.index}
             path={polygon.coords}
             key={polygon.id}
             options={polygon.options}
            />
      );
      })

)
      })
    
    } 


 {places.map(place => {
        return (

            place.editable ? '' :
            <Polygon
             ref={polygonRef.current[place.index]}
             id={place.index}
             draggable={place.editable}
             editable={place.editable}
             clickable= {true}
             path={place.polygon.coords}
             key={place.id}
             options={place.polygon.options}
             onMouseUp={(p) => onEdit(place.id,place.index,place.polygon.coords)}
          
            />
      );
      })} 



      {places.map(place => {
        return (

            place.editable ? 
            <Polygon
             ref={polygonRef.current[place.index]}
             id={place.index}
             draggable={place.editable}
             editable={place.editable}
             clickable= {true}
             path={place.polygon.coords}
             key={place.id}
             options={place.polygon.options}
             onMouseUp={(p) => onEdit(place.id,place.index,place.polygon.coords)}
             zIndex= {place.zIndex}
            /> :'' 
       );
      })}

     { props.addNewZone ? <DrawingManager
      defaultDrawingMode={google.maps.drawing.OverlayType.POLYGON}
      defaultOptions={{
        drawingControl: false,
       
      }}
      
       onPolygonComplete={(p) => onPolygonComplete(p)}
       onOverlayComplete={onOverlayComplete}

    /> : ""} </Fragment> }


    { Number(props.outline) > 0 ?

    
  <Fragment key={0}>
  {<Circle
    defaultCenter={center}
    radius={props.outline  *  (Config.Setting.distanceUnit === 'miles' ? 1609.34 : 1000)}
    
     options={{
      strokeOpacity: 1,
      strokeWeight: 2,
      strokeColor:'#000',
      fillOpacity: 0
    }}

   

  />}
</Fragment> : ""
}
      <Marker position={center} />
     </GoogleMap>


<Modal isOpen={hasPolygonEdited || props.hasPolygonEdited}>
<ModalHeader>{"Confirmation"}</ModalHeader>
<ModalBody className="padding-0 ">
  <div className="padding-20 scroll-model-web">
      <FormGroup className="modal-form-group">
        <Label className="control-label">
            Do you want to save changes.
        </Label>
      </FormGroup>
    </div>
    <FormGroup className="modal-footer" >
    <Button color="secondary" onClick={() => HandleCancelSaveChanges()}>Discard Changes</Button>
      <Button color="success">
     
         <span className="comment-text" onClick={() => HandleSaveChanges()}>Save Changes</span>
    </Button>
    </FormGroup>
</ModalBody>
</Modal>
</div>

  );
}

export default withScriptjs(withGoogleMap(Map));
