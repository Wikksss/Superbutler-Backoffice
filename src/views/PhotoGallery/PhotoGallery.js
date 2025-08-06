import React, { Fragment, Component } from 'react';
import { FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader,Dropdown, DropdownToggle, DropdownMenu, DropdownItem  } from 'reactstrap';
import Constants from '../../helpers/Constants';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Loader from 'react-loader-spinner';
import ReactDOM from 'react-dom';
import Lazyload from 'react-lazyload';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import Slider from '@material-ui/core/Slider'
//import { Object } from 'core-js';
import Config from '../../helpers/Config';
import * as Utilities from '../../helpers/Utilities';
import * as PhotoDictionaryService from '../../service/PhotoDictionary';
import "react-tabs/style/react-tabs.css";
import 'sweetalert/dist/sweetalert.css';
import Labels from '../../containers/language/labels';
import ImageUploader from '../Components/ImageUploader';
import AWS from 'aws-sdk';

import {
    ChonkyActions,
    ChonkyFileActionData,
    FileArray,
    FileBrowser,
    FileData,
    FileList,
    FileNavbar,
    FileToolbar,
    setChonkyDefaults,
    FileHelper, FullFileBrowser
} from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import path from 'path';
import { useStoryLinks } from '../../helpers/util';

setChonkyDefaults({ iconComponent: ChonkyIconFA });

var chonkyFiles = [];
var allowFileTypes =  [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp", "mov", "mp4"]
var BUCKET_NAME =  Config.Setting.envConfiguration.AWS_S3Bucket;
var BUCKET_REGION = Config.Setting.envConfiguration.AWS_Region;
var ACCESS_KEY_ID = Config.Setting.envConfiguration.AWS_AccessKey;
var SECRET_ACCESS_KEY = Config.Setting.envConfiguration.AWS_SecretKey;
var CONTENT_PATH = Config.Setting.envConfiguration.ContentPath;

AWS.config.update({
    region: Config.Setting.envConfiguration.AWS_Region,
    accessKeyId: Config.Setting.envConfiguration.AWS_AccessKey,
    secretAccessKey: Config.Setting.envConfiguration.AWS_SecretKey,
});
var s3 = new AWS.S3();


function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed())} ${sizes[i]}`
}
function readFile(file) {
    return new Promise(resolve => {
        const reader = new FileReader()
        reader.addEventListener(
            'load',
            () => resolve(reader.result),
            false
        )
        reader.readAsDataURL(file)
    })
}

const fetchS3BucketContents = (bucket, currentFolderId, parentFolderId) => {
    
  return s3
        .listObjectsV2({
            Bucket: bucket,
            Delimiter: '/',
            Prefix: currentFolderId !== '/' ? currentFolderId : '',
        })
        .promise()
        .then((response) => {
          
           //console.log("response", response);
           
            var s3Objects = response.Contents;
            var s3Prefixes = response.CommonPrefixes;
            // console.log("s3Objects", s3Objects);

            if (s3Objects) {
                
                if(s3Objects.length > 0 && s3Objects[0].Key == currentFolderId){

                    s3Objects = s3Objects.slice(1);
                }

                

                
                chonkyFiles.push(
                    ...s3Objects.filter(object => {
                        const extension = path.extname(object.Key).toLowerCase();
                        return allowFileTypes.includes(extension);
                    }).map(
                        (object) => ({
                            id: object.Key,
                            name: path.basename(object.Key),
                            modDate: object.LastModified,
                            size: object.Size,
                            parentId: object.Size > 0 ? currentFolderId : undefined,
                            thumbnailUrl: path.basename(object.Key)
                        })
                    )
                );
            }

            if (s3Prefixes) {
                chonkyFiles.push(
                    ...s3Prefixes.map(
                        (prefix) => ({
                            id: prefix.Prefix,
                            name: path.basename(prefix.Prefix),
                            isDir: true,
                            parentId: prefix.Prefix == currentFolderId ? parentFolderId : currentFolderId,
                        })
                    )
                );
            }

            var currentFolder = {id: response.Prefix,
                name: path.basename(response.Prefix),
                childrenCount: response.CommonPrefixes.length,
                childrenIds: chonkyFiles.map(obj => obj.id),
                isDir: true,
                parentId: parentFolderId == "" ? undefined: parentFolderId
                }


            chonkyFiles.push(currentFolder);

            const sortedObjects = Object.values(chonkyFiles).sort((a, b) => {
                      if (a.isDir && !b.isDir) {
            return -1; // a should come before b
        } else if (!a.isDir && b.isDir) {
            return 1; // b should come before a
        } else {
            return 0; // leave them unchanged relative to each other
        }
    });

            const dictionary = Object.fromEntries(sortedObjects.map(obj => [obj.id, obj]));

            //console.log("All Files", dictionary);

            return dictionary;
        });
};

const storyName = 'S3 Photo Gallery';

class S3Browser extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      ShowLoader: false,
      error: null,
      folderPrefix: '',
      files: [],
      fileMap: {},
      currentFolderId: '',
      parentFolderId: '',
      CreateFolderM:false,
      selectedFiles: [],
      enterpriseID: 0,
      loading: false,
      ignoredFilesBySize: [],
      refresh: true,
      totalUploadingFiles: 1,
      uploadingFileIndex: 1,
      searchText: '',
      viewMode: 'list',
      btnShow: false,
      currentFolder: "",
      viewS3ImageModal: false,
     
    }
    var enterpriseID = localStorage.getItem(Constants.Session.ENTERPRISE_ID)

    if (!Utilities.stringIsEmpty(enterpriseID)) {
        this.state.enterpriseID = enterpriseID;
        this.state.currentFolderId = `${CONTENT_PATH}enterprise/${enterpriseID}/`
        this.state.folderPrefix = `${CONTENT_PATH}enterprise/${enterpriseID}/`
    }

  }
  CreateFolderMModal() {
    this.setState({
        CreateFolderM: !this.state.CreateFolderM,
    })
}

fetchFiles = (load) => {

    if(load) this.showFilesLoader("none");
    this.changeRootFolderName();
    const { currentFolderId, parentFolderId } = this.state;
   fetchS3BucketContents(BUCKET_NAME, currentFolderId, parentFolderId)
      .then((fileMap) =>
        this.setState({ fileMap }, () => {
            setTimeout(() => {
                
                const actionsButton = document.querySelector('.chonky-toolbarRight button[title="Actions"]');

                // Add event listener for click event
                actionsButton.addEventListener('click', () => {
                    setTimeout(() => {
                            
                    this.ChangeOptionText();
                    },100)
                })
                                
                this.SetSelectedItemCSS();
                this.changeRootFolderName();
                


            }, 10);
            setTimeout(() => {
                if(load) this.showFilesLoader("block");
                
            }, 2000);

        }))
      .catch((error) => this.setState({ error: error.message }));

  
};

deleteFiles = async (files) => {

    const {currentFolderId} = this.state;
    this.showFilesLoader("none");
    for(var i =0; i<files.length; i++){
    try {

        if(files[i].isDir){

    // List all objects in the folder
    const data = await s3.listObjectsV2({ Bucket: BUCKET_NAME, Prefix: files[i].id }).promise();

    // Delete all objects in the folder
    if (data.Contents.length > 0) {
        const objects = data.Contents.map(({ Key }) => ({ Key }));
        await s3.deleteObjects({ Bucket: BUCKET_NAME, Delete: { Objects: objects } }).promise();
    }

    // Delete the folder itself (by deleting an empty object with the folder path)
        await s3.deleteObject({ Bucket: BUCKET_NAME, Key: files[i].id  }).promise();


        } else {

        await s3.deleteObject({
            Bucket: BUCKET_NAME,
            Key: files[i].id,
        }).promise();

        }
        
        this.setState((prevState) => {
            const newFileMap = { ...prevState.fileMap };
            files.forEach((file) => {
                delete newFileMap[file.id];
                chonkyFiles = chonkyFiles.filter(item => item.id !== file.id);
    
                if (file.parentId) {
                    const parent = newFileMap[file.parentId];
                    const newChildrenIds = parent.childrenIds.filter((id) => id !== file.id);
                    newFileMap[file.parentId] = {
                        ...parent,
                        childrenIds: newChildrenIds,
                        childrenCount: newChildrenIds.length,
                    };
                }
            });
            return { fileMap: newFileMap };
        });
        // Refresh the view to show the new folder
    } catch (error) {
        console.error('Failed to create folder:', error);
    }
    
}

this.showFilesLoader("flex");

};

toggleViewS3ImageModal = (image) => {
    this.setState({
      viewS3ImageModal: !this.state.viewS3ImageModal,
      btnShow: false,
      imageToOpen: image,
      currentFolder: image ? image.parentId : ""
    })
  }

  showClosebtn = () => {
    this.setState({btnShow: true});
  }


changeRootFolderName = () => {

    const button = document.querySelector('[class^="buttonContainer"]');
    if (button) {
        // Traverse the DOM to find the span element
        const span = button.querySelector('span');
        if (span && span.textContent == this.state.enterpriseID) {
          // Update the text of the span
          span.textContent = 'Home';
        }
      }

}

SetSelectedItemCSS = () => {

    document.querySelectorAll('[class*="fileIcon-0"]').forEach(element => {
        element.style.opacity = '0';
    });

     document.querySelectorAll('[class*="previewFile-d"]').forEach(element => {
                   element.classList.forEach(className => {
            if (className.startsWith('previewFile-d')) {
                element.classList.remove(className);
            }
    });

})

document.querySelectorAll('[class*="gridFileEntryName-d"]').forEach(element => {
    element.classList.forEach(className => {
        element.classList.add('p-gallery-t-ellipse');

});

})

    // document.querySelectorAll('[class*="folderFrontSide-d"]').forEach(element => {
    //     element.classList.forEach(className => {
    // if (className.startsWith('folderFrontSide-d')) {
    // element.classList.remove(className);
    // }
    // });

// })

}


changeInHtml = () => {

    const mainDiv = document.querySelector('.chonky-gridContainer');
    if (mainDiv) {
        // Find the SVG element
const svgElement = mainDiv.querySelector('svg');

const parentElement = svgElement ? svgElement.parentElement : null;
// Remove the SVG element if it exists
if (svgElement) {
    svgElement.remove();
}
       
      }

}

ChangeOptionText = () => {

            var spans = document.querySelectorAll('.MuiListItemText-root span');
            spans.forEach(function (span) {
                if (span.innerText === 'Open selection') {
                    span.innerText = 'Edit Photo';
                } else if (span.innerText === 'Delete files') {
                    span.innerText = 'Delete';
                }
            });
}
                
SetInterval = () => {

    this.interval = setInterval(() => {
        
        var allDiv = document.querySelectorAll('[class*="fileIcon-0"]')

        if(allDiv && allDiv.length > 0)
        {
            this.SetSelectedItemCSS();
        }
        else 
        {
            clearInterval(this.interval);

        }

    }, 100); // Refresh every second (1000 milliseconds)
}

componentDidMount() {


    var settings = [];
    if(!Utilities.stringIsEmpty(sessionStorage.getItem(Constants.CONFIG_SETTINGS))){
        settings = JSON.parse(sessionStorage.getItem(Constants.CONFIG_SETTINGS));
      }
  
    if(settings.length > 0){

        ACCESS_KEY_ID = settings[0];
        SECRET_ACCESS_KEY = settings[1];
        BUCKET_NAME = settings[2];
        BUCKET_REGION = settings[3];
        CONTENT_PATH = settings[4];
    
        AWS.config.update({
            region: settings[3],
            accessKeyId: settings[0],
            secretAccessKey: settings[1],
    });

    s3 = new AWS.S3();
}

     this.fetchFiles(true);
}

  loading = () => <div className="allorders-loader">
    <div className="loader-menu-inner">
      <Loader type="Oval" color="#ed0000" height={50} width={50} />
      <div className="loading-label">Loading.....</div>
    </div>
  </div>


createFolder = async (e, values) => {

    const {currentFolderId} = this.state;
    var folderName = values.txtNewFolderName;
    try {
        await s3.putObject({
            Bucket: BUCKET_NAME,
            Key: `${currentFolderId}${folderName}/`,
            Body: '',
        }).promise();

        // Refresh the view to show the new folder
        // ChonkyActions.RefreshFiles();
        this.fetchFiles(true);
    } catch (error) {
        console.error('Failed to create folder:', error);
    }
    this.CreateFolderMModal();
    this.setState((prevState) => {
        
        const newFileMap = { ...prevState.fileMap };
        const newFolderId = `new-folder-${prevState.idCounter++}`;
        newFileMap[newFolderId] = {
            id: newFolderId,
            name: folderName,
            isDir: true,
            modDate: new Date(),
            parentId: prevState.currentFolderId,
            childrenIds: [],
            childrenCount: 0,
        };
        const parent = newFileMap[prevState.currentFolderId];
        newFileMap[prevState.currentFolderId] = {
            ...parent,
            childrenIds: [...parent.childrenIds, newFolderId],
        };
        return { fileMap: newFileMap };
    });
};

setCurrentFolderId = (folderId, parentFolderId) => {
    this.setState({ currentFolderId: folderId, parentFolderId: parentFolderId }, );
};

showFilesLoader = (display) => 
{
    
    const mainDiv = document.querySelector('.chonky-fileListWrapper');
    if (mainDiv) {
        mainDiv.style.display = display;
    }

     const loaderDiv = document.querySelector('.show-loader');
    if (loaderDiv) {
        loaderDiv.style.display = display == "none" ? "flex" : "none";
    }

        const fileBrowserDiv = document.querySelector('.file-browser');

        if (!fileBrowserDiv || display == "none") {
            const fileBrowserwrapper = document.querySelector('.file-browser-wrapper');
            if (fileBrowserwrapper) {
                fileBrowserwrapper.style.height = "450px";
            }

        } else  {
            const fileBrowserwrapper = document.querySelector('.file-browser-wrapper');
            if (fileBrowserwrapper) {
                fileBrowserwrapper.style.height = '';
            }
        
                fileBrowserDiv.style.display = display == "none" ? display : "block";
        
        }
        
    }

handleCustomAction = () => {
    const { selectedFiles, setFileSelection, showFileContainer } = this.props.chonky;

    // Perform custom action here
    console.log('Custom action performed on files:', selectedFiles);

    // Reset file selection after custom action
    setFileSelection([]);

    // Show file container after custom action
    showFileContainer();
};

RefreshS3Files = (shouldRefresh) => {

    if(!shouldRefresh) this.state.currentFolder = "";
   
    if(this.state.viewS3ImageModal)
      this.setState({viewS3ImageModal: false})

  
      this.setState({shouldRefresh: shouldRefresh})


  }

uploadFilesOnS3 = async (files) => {

    this.showFilesLoader("none");
    this.setState({loading: true})
    this.setState({totalUploadingFiles: files.length});
    var ignoredFilesBySize =[];
   for (let index = 0; index < files.length; index++) {
    this.setState({uploadingFileIndex: index + 1});
    var file = files[index];
    const fileSizeInBytes = file.size;
    const fileSizeInKB = fileSizeInBytes / 1024;
    const fileSizeInMB = fileSizeInKB / 1024;    
    const fileType = file.type;

    if (!["image/jpg", "image/jpeg", "image/png", "image/gif", "image/svg", "image/webp"].includes(fileType)) {
        continue;
    }
    
   
    if(fileSizeInMB <= 1){

    var fileName = Utilities.RemoveSpecialCharsFromString(file.name);

    try {
           
                await s3.upload({
                    Bucket: BUCKET_NAME,
                    Key: `${this.state.currentFolderId}${fileName.replace(/ /g, '_')}`,
                    Body: file,
                }).promise();
    
        } catch (error) {
            console.error('Failed to upload files:', error);
        }
    } else 
    {
        ignoredFilesBySize.push(file.name);
    }
    }
    await this.fetchFiles(true);
    // if(ignoredFilesBySize.length > 0)
    this.props.ignoredFilesBySize(ignoredFilesBySize);
    this.setState({loading: false})
    setTimeout(() => {
        this.showFilesLoader("block");
    }, 1000);
}

setUploadInput = async () => 
{

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = "image/*";
    input.multiple = true; 
    input.onchange = (e) => {
       
        this.uploadFilesOnS3(e.target.files);
    };
    input.click();
}

moveFiles = (data) => {
    
    const { files, destination } = data.payload;
    if (!destination || !destination.isDir || !files || files.length === 0) return;


    for(var i =0; i<files.length; i++){
        
        var destinationKey = `/${BUCKET_NAME}/${files[i].id}`;
        var sourceKey = `${destination.id}${path.basename(files[i].id)}`

        const params = {
            Bucket: BUCKET_NAME,
            CopySource: destinationKey,
            Key: sourceKey,
        };
        s3.copyObject(params, (err, data) => {
            if (err) {
                console.log('Error copying object: ', err);
                return;
            }
            console.log('Copied object successfully');
        });

        this.deleteFiles(files);
    }
    
}

handleFileAction = (data) => {

    clearInterval(this.interval);
    this.SetSelectedItemCSS();
    this.ChangeOptionText();

    
    if (data.id === ChonkyActions.EnableListView.id || data.id === ChonkyActions.EnableGridView.id) {
        localStorage.setItem(Constants.Session.S3FILEVIEWMODE, data.id)
    }
    else if(data.id === ChonkyActions.SortFilesByName.id || data.id == ChonkyActions.SortFilesBySize.id || data.id == ChonkyActions.SortFilesByDate.id) {
        localStorage.setItem(Constants.Session.S3FILESSORTBY, data.id)
    }

    else if(data.id === ChonkyActions.ToggleHiddenFiles.id) {

        var hiddenfile = localStorage.getItem(Constants.Session.S3SHOWHIDDENFILE)
        if (!Utilities.stringIsEmpty(hiddenfile)) {
            
            localStorage.setItem(Constants.Session.S3SHOWHIDDENFILE, hiddenfile == "true" ? "false" : "true")
        } else 
        {
            localStorage.setItem(Constants.Session.S3SHOWHIDDENFILE, "false")
        }

        
    }

    else if (data.id === ChonkyActions.OpenFiles.id) {
        const { targetFile, files } = data.payload;
        const fileToOpen = targetFile || files[0];
        if (fileToOpen && FileHelper.isDirectory(fileToOpen)) {
            this.setState({ShowLoader: true},() => this.setState({ShowLoader: false}));
            this.setCurrentFolderId(fileToOpen.id, fileToOpen.parentId );
            const newPrefix = `${data.payload.files[0].id.replace(/\/*$/, '')}/`;
    //   console.log(`Key prefix: ${newPrefix}`);
        this.setState({searchText: ''},() => this.setState({ folderPrefix: newPrefix }, this.fetchFiles(true)))
      
        } else 
        {
            // var selectedFiles = data.state.selectedFilesForAction
             this.toggleViewS3ImageModal(data.payload.files[0]);
             //this.fetchFiles();
        }
    } else if (data.id === ChonkyActions.DeleteFiles.id) {
        this.deleteFiles(data.state.selectedFilesForAction);
    } else if (data.id === ChonkyActions.MoveFiles.id) {

        this.moveFiles(data);
        // this.moveFiles(data.payload.files, data.payload.source, data.payload.destination);
    } else if (data.id === ChonkyActions.CreateFolder.id) {
         this.CreateFolderMModal();
    }  else if (data.id === ChonkyActions.UploadFiles.id) {
        
        this.setUploadInput();

    }else if (data.id === ChonkyActions.OpenSelection.id) {
        
    } 

    else if(data.id === ChonkyActions.ChangeSelection.id)
    {
        const files = Object.values(this.state.fileMap).filter(obj => obj.parentId == this.state.currentFolderId && obj.parentId != "");

        var selectedList = [...data.payload.selection];

        var filteredList = files.filter(item => selectedList.find(s => s == item.id) != undefined && !item.isDir);
        if(filteredList.length > 0) 
        {
            this.props.setSelectedMedia(filteredList);
        }
        else 
        {
            this.props.setSelectedMedia(filteredList);
        }
    }

};

useFiles = (fileMap, currentFolderId) => {
    const files = Object.values(fileMap).filter(obj => obj.parentId == currentFolderId && obj.parentId != "");
    return files;
};

useFolderChain = (fileMap, currentFolderId) => {
    
    const currentFolder = fileMap[currentFolderId];

    const folderChain = [currentFolder];

    let parentId = currentFolder.parentId;
   
    while (parentId) {
        const parentFile = fileMap[parentId];
        if (parentFile) {
            folderChain.unshift(parentFile);
            parentId = parentFile.parentId;
        } else {
            break;
        }
    }

    // console.log("folderChain", folderChain)
    return folderChain;
}

sortFiles = () => {
    const { files } = this.state;
    let sortedFiles = [...files];

    var sortBy = localStorage.getItem(Constants.Session.S3FILESSORTBY)
    if (Utilities.stringIsEmpty(sortBy)) {
        sortBy = "name";
    }
            

    switch (sortBy) {
        case 'name':
            sortedFiles.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'size':
            sortedFiles.sort((a, b) => a.size - b.size);
            break;
        case 'date':
            sortedFiles.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        default:
            // Default sort order
            break;
    }
    this.setState({ files: sortedFiles });
}

fileModifier = (file) => {
    const { uploadingFiles } = this.state;
    if (uploadingFiles.includes(file.id)) {
        return {
            ...file,
            icon: 'loading', // or any other indicator for uploading status
        };
    }
    return file;
};

handleFolderOpen = () => {
    this.setState({searchText: ''});
};


handleSearchText = (text) => {
    this.setState({searchText: text});
};


componentWillReceiveProps = () => 
{
        this.state.currentFolderId = this.props.currentFolder != "" ? this.props.currentFolder : this.state.currentFolderId;
        this.fetchFiles(false);
}


createThumbnail = (imageSrc, maxWidth, maxHeight) => {

    let img = new Image();
    img.onload = () => {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        let width = img.width;
        let height = img.height;

        if (width > height) {
            if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
            }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        this.setState({
            thumbnail: canvas.toDataURL('image/jpeg')
        });
    };
    img.src = imageSrc;
}


  render() {

    const { fileMap, currentFolderId, error, folderPrefix, ShowLoader, viewMode } = this.state;
    
    this.SetInterval();

    if(Object.keys(fileMap).length == 0) return;

        const files = this.useFiles(fileMap, folderPrefix);
        const folderChain = this.useFolderChain(fileMap, folderPrefix);
        const fileActions = [ChonkyActions.CreateFolder, ChonkyActions.UploadFiles, ChonkyActions.DeleteFiles];

        const thumbnailGenerator = (file) => {
            
            return file.thumbnailUrl ? Utilities.generatePhotoURL((`/${encodeURIComponent(folderPrefix.replace(Config.Setting.envConfiguration.ContentPath, ""))}${file.thumbnailUrl}?width=50&height=50`)) : null;
        }

        
    return (
      <div className="card mb-0" id="orderWrapper">
        <div className="story-wrapper">
                <div className="story-description">
                    {/* <h1 className="story-title">{storyName}</h1> */}
                    {error && (
                        <div className="story-error">
                            An error has occurred while loading bucket:{' '}
                            <strong>{error}</strong>
                        </div>
                    )}
                </div>

               

                <div className='position-relative file-browser-wrapper' style={{height: 450}}  >
                    <div className='show-loader' style={{position: "absolute", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                        <div className="loader-menu-inner">
                            <Loader type="Oval" color="#ed0000" height={50} width={50} />
                            {this.state.loading &&
                            <div className="loading-label text-black">{`Uploading ${this.state.uploadingFileIndex} of ${this.state.totalUploadingFiles}`}</div>
                            }
                        </div>
                    </div>

                    <div className="file-browser" style={{display: "none"}}> 
                    {!ShowLoader &&
                    <FullFileBrowser
                        instanceId={storyName}
                        files={files}
                        folderChain={folderChain}
                        onFileAction={this.handleFileAction}
                        fileActions={fileActions}
                        viewMode={'list'}
                        thumbnailGenerator={thumbnailGenerator}
                        defaultFileViewActionId={!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.S3FILEVIEWMODE)) ? localStorage.getItem(Constants.Session.S3FILEVIEWMODE) : ChonkyActions.EnableGridView.id}
                        defaultSortActionId={!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.S3FILESSORTBY)) ? localStorage.getItem(Constants.Session.S3FILESSORTBY) : ChonkyActions.SortFilesByName.id}
                        {...this.props}
                    >
                    </FullFileBrowser>
                    }
                    </div>

                </div>
            </div>
            <Modal isOpen={this.state.CreateFolderM} toggle={() => this.CreateFolderMModal()} className={this.props.className}>
          <ModalHeader toggle={() => this.CreateFolderMModal()} >Create New Folder</ModalHeader>
          <ModalBody>
          <AvForm onValidSubmit={this.createFolder}>
          <AvField label="Folder Name" name="txtNewFolderName" type="text"></AvField>
          <FormGroup className="modal-footer" >
            <div className='mr-auto'> <label id="name" class="control-label mt-2 text-danger"></label>
            </div>
            <div>
              <Button className='mr-2 text-dark' color="secondary" onClick={() => this.CreateFolderMModal()}>Cancel</Button>
              <Button color="primary">
              {/* <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>   */}
                 <span className="comment-text">Ok</span> 
              </Button>
            </div>
          </FormGroup>
          </AvForm>
          </ModalBody>
        </Modal>

        <Modal size="lg" isOpen={this.state.viewS3ImageModal }  toggle={(e)=>this.toggleViewS3ImageModal()}  style={{maxWidth: '80%'}}  className="edit-image-uploader-parent">
 <ModalBody className='edit-image-uploader-wrap'>
          <div className='position-relative'>
          <ImageUploader Image={this.state.imageToOpen} ShowCloseButton={this.showClosebtn} Refresh={this.RefreshS3Files}/>
          </div>
          {this.state.btnShow &&
          <div className='cstm-text-abs'>
          <Button className='cstm-cls-btn' color="secondary" onClick={(e) => this.toggleViewS3ImageModal()}>{Labels.Close}</Button>         
            <span className='abs-txt'>Compare</span>
            <span className='abs-txt' style={{left:"50%"}}>Zoom out</span>
            <span className='abs-txt' style={{left:"54.5%"}}>Zoom in</span>
            <span className='abs-txt' style={{left:"auto", right:"115px", position:"absolute", top:"55px"}}>Reset</span>
            <span className='abs-txt' style={{left:"auto", right:"77px", position:"absolute", top:"55px"}}>Undo</span>
            <span className='abs-txt' style={{left:"auto", right:"40px", position:"absolute", top:"55px"}}>Redo</span>
          </div>
          }
        </ModalBody>
       
 </Modal>

      </div>
        
    );
  }
}

S3Browser.defaultProps = {
  BUCKET_NAME: 'cdn-superme-test',
};

export default S3Browser;