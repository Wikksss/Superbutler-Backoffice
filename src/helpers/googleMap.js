import React, { useRef, useState, useCallback } from "react";
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker
} from "react-google-maps";
import Autocomplete from 'react-google-autocomplete';
import Geocode from "react-geocode";
import * as EnterpriseAddressService from '../service/EnterpriseAddress';
import {  Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Config from '../helpers/Config';



function Map(props) {
  
  let enterpriseAddress = EnterpriseAddressService.EnterpriseAddress;
  const [center, setCenter] = useState({ lat: props.centerLocation.lat, lng: props.centerLocation.lng });
  const [mapCenter, setmapCenter] = useState({ lat: props.centerLocation.lat, lng: props.centerLocation.lng });
  const [address,setAddress] =  useState(props.centerLocation.address);
  const [isNew,setState] =  useState(props.centerLocation.isNew);
  
  const refMap = useRef(null);

  const handleBoundsChanged = () => {
    const mapCenter = refMap.current.getCenter(); //get map center
    setCenter(mapCenter);
    
  };


const SetAddress2 = (adrressComponents) => {

  var TownName = '';

  for (var i = 0; i < adrressComponents.length; i++) {

    if (adrressComponents[i].types[0] === 'postal_code') {
        TownName = adrressComponents[i].long_name;
    }
    else if ((adrressComponents[i].types[0] ==="locality" || adrressComponents[i].types.indexOf("sublocality_level_1") > -1 || (adrressComponents[i].types.indexOf("neighborhood") > -1) && adrressComponents.length <= 5) ) {
        TownName = TownName === '' ? adrressComponents[i].long_name : TownName;
    }

  }

  return TownName;

}


const SetFormattedAddress = (adrressComponents) => {
 
    var formatedAddress = '';
    var route = '';
    var postcode = '';
    var town = '';
    

    for (var i = 0; i < adrressComponents.length; i++) {

        if (adrressComponents[i].types[0] === 'route' || adrressComponents[i].types[0] === 'establishment' || adrressComponents[i].types.indexOf("sublocality_level_2") > -1) { //route  postal_town   //postal_code
            route = adrressComponents[i].long_name.indexOf('Unnamed') !== -1 ? '' : adrressComponents[i].long_name;
        }
        else if (adrressComponents[i].types[0] === 'postal_town' || adrressComponents[i].types.indexOf("sublocality") > -1 || adrressComponents[i].types.indexOf("neighborhood") > -1) {
            town = adrressComponents[i].long_name;
        }
        else if (adrressComponents[i].types[0] === "locality" || adrressComponents[i].types.indexOf("sublocality_level_1") > -1 || (adrressComponents[i].types.indexOf("neighborhood") > -1) && adrressComponents.length <= 5) {
            town = town === '' ? adrressComponents[i].long_name : town;
        }
        else if (adrressComponents[i].types[0] === 'postal_code' ) {
            postcode = adrressComponents[i].long_name;
        }

    }

    if (Config.Setting.countryCode.toLowerCase() == '+44') {
        formatedAddress = route === '' ? town + ' ' + postcode : route + ', ' + town + ' ' + postcode;
    }
    else {
        formatedAddress = route === '' ? town : route + ', ' + town;
    }

    return formatedAddress.trim();

}

  const handleDragEnd = () => {
    props.onLocationChange(true)
    
    Geocode.fromLatLng( center.lat() , center.lng()).then(
      response => {

       var formattedAddress = SetFormattedAddress(response.results[0].address_components)
       var address2 = SetAddress2(response.results[0].address_components)
       const address = response.results[0].formatted_address ;
       enterpriseAddress.GoogleLocation = address; //formattedAddress;
        enterpriseAddress.CityName = GetCountryAndCity(response.results[0].address_components)
       enterpriseAddress.Latitude = center.lat();
       enterpriseAddress.Longitude =  center.lng();
       enterpriseAddress.Address2 = address2;

       setAddress(address);
       props.onLocationChange(false)
      },
      error => {
       console.error(error);
      }
     );
  };

  const GetCountryAndCity = (addressComponents) => {
    var city = ''
    for (var r = 0, rl = addressComponents.length; r < rl; r += 1) {
      var type = addressComponents[r].types[0]
      if (type === 'locality' || type === 'administrative_area_level_1' || type === 'postal_town') {
        city = addressComponents[r].long_name
        break
      }
    }
    return city
  }

  const onPlaceSelected = ( place ) => {
    if (place.geometry !== undefined) {
    props.onLocationChange(true)

    // console.log("Places: ", place);
     const address = place.formatted_address,
     latValue = place.geometry.location.lat(),
     lngValue = place.geometry.location.lng();


     var formattedAddress = SetFormattedAddress(place.address_components)
     var address2 = SetAddress2(place.address_components)

     enterpriseAddress.GoogleLocation = address;  //formattedAddress;
     enterpriseAddress.CityName = GetCountryAndCity(place.address_components)
     enterpriseAddress.Latitude = latValue;
     enterpriseAddress.Longitude = lngValue;
     enterpriseAddress.Address2 = address2;

     setAddress(address);
     setmapCenter(place.geometry.location)
     setCenter(place.geometry.location);
    }
     props.onLocationChange(false)};

  return (
    <GoogleMap
      ref={refMap}
      defaultZoom={15}
      defaultCenter={center}
      center={mapCenter}
      options={{streetViewControl: false, mapTypeControl: false, fullscreenControl: false}}
      onBoundsChanged={handleBoundsChanged}
      // onClick = {() => }
      onDragEnd={handleDragEnd}

    >
    <Autocomplete
    value = {address}
    className='input-for-map'
    onChange={(e) => setAddress(e.target.value)}
    // onClick={handleOnFocus}
    placeholder = 'Find Business Location'
    onPlaceSelected={onPlaceSelected}
    types={[]}
    
    
/>
      <Marker position={center} />
    </GoogleMap>
  );
}

export default withScriptjs(withGoogleMap(Map));
