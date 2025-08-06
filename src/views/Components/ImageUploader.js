import React, { Component } from 'react';
import AWS from 'aws-sdk';
import FilerobotImageEditor, {
  TABS,
  TOOLS,
} from 'react-filerobot-image-editor';
import GlobalData, * as GlobalDataS from '../../helpers/GlobalData'
import * as Utilities from '../../helpers/Utilities'
import Config from '../../helpers/Config';
import Constants from '../../helpers/Constants';

class ImageUploader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isImgEditorShown: false,
      imageUrl: null,
      image: this.props.Image,
      currentFolder: this.props.Image.parentId,
      settings: []
    };
    

    if(!Utilities.stringIsEmpty(sessionStorage.getItem(Constants.CONFIG_SETTINGS))){
      this.state.settings = JSON.parse(sessionStorage.getItem(Constants.CONFIG_SETTINGS));
    }


    this.bucketName = this.state.settings.length > 0 ? this.state.settings[2] : "";
    this.imageKey = this.props.Image.id;
    this.s3 = new AWS.S3({
      accessKeyId: this.state.settings.length > 0 ? this.state.settings[0] : "",
      secretAccessKey: this.state.settings.length > 0 ? this.state.settings[1] : "",
      region: this.state.settings.length > 0 ? this.state.settings[3] : "",
    });

  }

  downloadImage() {
    this.s3.getObject({ Bucket: this.bucketName, Key: this.imageKey }, (err, data) => {
      if (err) {
        console.error('Error downloading image:', err);
        return;
      }
      const imageUrl = URL.createObjectURL(new Blob([data.Body]));
      this.setState({ imageUrl }, this.props.ShowCloseButton);
    });
  }

  openImgEditor = () => {
    this.setState({ isImgEditorShown: true });
  };

  closeImgEditor = () => {
    this.setState({ isImgEditorShown: false });
  };

  componentWillMount = () => 
  {

    var btn = document.getElementById("btnOpen");
    
    if(btn)
    {
      btn.click();
    }

  }

  ConvertBase64ToBlob = (file) => {

    // Convert base64 to Blob
    const byteCharacters = atob(file.imageBase64.split(',')[1]);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: file.mimeType });

  }

  uploadEditedImageOnS3 = async (file) => {
    console.log('saved', file)
    var blob = this.ConvertBase64ToBlob(file);

    var fileName = Utilities.RemoveSpecialCharsFromString(file.fullName);

    try {
        await this.s3.upload({
            Bucket: this.bucketName,
            Key: `${this.state.currentFolder}${fileName.replace(/ /g, '_')}`,
            Body: blob,
        }).promise();

        this.props.Refresh(true);

} catch (error) {
    console.error('Failed to upload files:', error);
}
    
}

  componentDidMount() {
    this.downloadImage();
  }

  render() {
    const { isImgEditorShown, images, imageUrl} = this.state;
    return (
        <>

      <div className='left-tool-bar-css mb-5'>
        {imageUrl && 
          <FilerobotImageEditor
            source={imageUrl}
            onSave={(editedImageObject, designState) =>
             this.uploadEditedImageOnS3(editedImageObject)
              // console.log('saved', editedImageObject, designState)
            }
            theme={{
              typography: {
                fontFamily: 'Poppins, Arial'
              },
            }}
            annotationsCommon={{
              fill: '#ff0000',
            }}
            Text={{ text: 'Sample Text' }}
            Rotate={{ angle: 90, componentType: 'slider' }}
            Crop={{
              presetsItems: [
                {
                  titleKey: 'Product',
                  descriptionKey: Utilities.ratioCalculation(GlobalData.restaurants_data.Supermeal_dev.Product_Image_Width_Height).descriptionKey,
                  ratio: Utilities.ratioCalculation(GlobalData.restaurants_data.Supermeal_dev.Product_Image_Width_Height).ratio,
                  // icon: CropClassicTv, // optional, CropClassicTv is a React Function component. Possible (React Function component, string or HTML Element)
                },
                {
                  titleKey: 'Category',
                  descriptionKey: Utilities.ratioCalculation(GlobalData.restaurants_data.Supermeal_dev.Category_Image_Width_Height).descriptionKey,
                  ratio: Utilities.ratioCalculation(GlobalData.restaurants_data.Supermeal_dev.Category_Image_Width_Height).ratio,
                  // icon: CropCinemaScope, // optional, CropCinemaScope is a React Function component.  Possible (React Function component, string or HTML Element)
                },
                {
                  titleKey: 'Slider Web',
                  descriptionKey: Utilities.ratioCalculation(GlobalData.restaurants_data.Supermeal_dev.Slider_Web_Image_Width_Height).descriptionKey,
                  ratio: Utilities.ratioCalculation(GlobalData.restaurants_data.Supermeal_dev.Slider_Web_Image_Width_Height).ratio,
                  // icon: CropCinemaScope, // optional, CropCinemaScope is a React Function component.  Possible (React Function component, string or HTML Element)
                },
                {
                  titleKey: 'Slider Responsive',
                  descriptionKey: Utilities.ratioCalculation(GlobalData.restaurants_data.Supermeal_dev.Slider_Responsive_Image_Width_Height).descriptionKey,
                  ratio: Utilities.ratioCalculation(GlobalData.restaurants_data.Supermeal_dev.Slider_Responsive_Image_Width_Height).ratio,
                  // icon: CropCinemaScope, // optional, CropCinemaScope is a React Function component.  Possible (React Function component, string or HTML Element)
                },
              ],
            }}
            tabsIds={[TABS.ADJUST, TABS.ANNOTATE, TABS.RESIZE, TABS.FINETUNE, TABS.FILTERS]} 
            defaultTabId={TABS.ADJUST}
            defaultToolId={TOOLS.CROP}
          />
        }
      
      </div>
      </>
    );
  }
}

export default ImageUploader;