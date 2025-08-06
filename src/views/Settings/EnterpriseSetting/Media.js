import React, { Component, Fragment, useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Cropper from 'react-easy-crop';
import Slider from '@material-ui/core/Slider'
import * as EnterpriseSettingService from '../../../service/EnterpriseSetting';
import * as Utilities from '../../../helpers/Utilities';
import Constants from '../../../helpers/Constants';
//import Config from '../../../helpers/Config';
//import { Switch } from 'react-router-dom';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import getCroppedImg from '../../../helpers/CropImage'
import Loader from 'react-loader-spinner';
import { MdArrowBack, } from "react-icons/md";
import { useDropzone } from 'react-dropzone'
import Labels from '../../../containers/language/labels';
import { reloadLogo } from '../../../containers/DefaultLayout/DefaultLayout';
const PhotoGroupName = ["Restaurant", "EnterpriseCoverPhoto", "Cover-Photo", "EnterpriseFooterLogo", "Favicon", "OGImage"];

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

// const LogoHeaderImage = ({ onDrop }) => {
//     const { getRootProps, getInputProps, isDragActive } = useDropzone({
//       onDrop,
//     });

//     return (
//       <div {...getRootProps()} >
//         <input {...getInputProps()} />
//         {!isDragActive ? (
//                      <div className='logo-header-n'>
//                      <img src='https://cloud-supershoply.s3.eu-west-2.amazonaws.com/enterprise/10/images/TEM-logo-online-638107626633985856.png'/>
//                      </div>
//         ) : (
//          <div className='box-wrap'>
//           <div className='media-image-wrap-header'>
//             <div className='box-wrap text-center'> 
//             <i className="fa fa-plus"></i>
//             <p>Add Logo Header</p>
//             </div>
//           </div>
//           </div>

//         )}
//       </div>
//     );
//   };


export function LogoFooterImage(props) {
    const [LogoFooterFile, setNewLogoFooterFile] = useState({});
    const [LogoFooterPath, setLogoFooterPath] = useState("");
    const [LogoFooterBase64, setLogoFooterBase64] = useState('');
    const [LogoFooterSize, setLogoFooterSize] = useState('');
    const [footerError, setFooterError] = useState(false);
    const [footerErrorMessage, setFooterErrorMessage] = useState('');


    const { getRootProps, getInputProps, isDragActive } = useDropzone({

        accept: 'image/jpeg, image/png, image/jpg',
        // multiple:true,

        onDrop: acceptedFiles => {
            acceptedFiles.map(async file => {
                props.footerImageValidationfalse()
                setFooterError(false)
                props.setImageLoading(3)
                setNewLogoFooterFile(file)
                setLogoFooterPath(URL.createObjectURL(file))
                if ((file.size / 1048576) > 1) {
                    setFooterError(true)
                    setFooterErrorMessage(`${file.name} (${formatBytes(file.size)}) exceeds the file size limit of 1 MB `)
                    props.footerImageValidation()
                    props.setImageLoading(null)
                    return;
                }

                const imageBase64Url = await readFile(file)
                setLogoFooterBase64(imageBase64Url)
                setLogoFooterSize(imageBase64Url)
            });
        }
    })
    function onImgLoads({ target: img }) {
        const { offsetHeight, offsetWidth, naturalHeight, naturalWidth } = img;
        if ((naturalHeight != naturalWidth)) {
            setLogoFooterSize('')
            setFooterError(true)
            setFooterErrorMessage(`The image you have provided is not a 1:1 ratio. Please upload a 200x200 or 400x400 pixel image.`)
            props.footerImageValidation()
            props.setImageLoading(null)
            return
        }
        setLogoFooterSize('')
        props.setFooterImage(LogoFooterBase64, LogoFooterFile.name, PhotoGroupName[3])
        // props.disableButton()
    };
    return (
        <div class="box-wrap" {...getRootProps()}>
            <input {...getInputProps()} />
            <div >
                {
                    (LogoFooterPath != "" || (props.oldFooterImage != null && props.oldFooterImage != "")) ?
                        <div class="position-relative d-inline-flex justify-content-center align-items-center cursor-pointer">

                            <div className='w-100 w-min-100'>
                                {
                                    footerError ?
                                        <div className='box-wrap'>
                                            <div className='media-image-wrap-footer'>
                                                <div className='box-wrap text-center'>
                                                    <i className="fa fa-plus"></i>
                                                    <p>{Labels.AddLogoFooter}</p>
                                                </div>
                                            </div>
                                        </div> :
                                        <div className='logo-footer-n'>
                                            <img src={props.oldFooterImage != "" && Utilities.generatePhotoLargeURL(props.oldFooterImage, true, false)} alt="" style={{ height: "100px", width: "100px" }} />
                                        </div>
                                }
                                {
                                    footerError &&
                                    <label id="name" class="control-label mt-2 text-danger">{footerErrorMessage}</label>
                                }
                                {
                                    LogoFooterSize != '' &&
                                    <img onLoad={onImgLoads} src={LogoFooterSize} alt="" style={{ opacity: 0, }} />
                                }
                                {props?.isImageLoading == 3 && <div style={{position:'absolute',top:'30%',left:0,right:0,bottom:0}}>{props.loading()}</div>}
                            </div>

                        </div>
                        :
                        <div className='box-wrap'>
                            <div className='media-image-wrap-footer'>
                                <div className='box-wrap text-center d-flex'>
                                    <i className="fa fa-plus"></i>
                                    <p>{Labels.AddLogoFooter}</p>
                                </div>
                            </div>
                        </div>

                }
            </div>


        </div>
    )
}
export function Favicon(props) {
    const [LogoFaviconFile, setNewLogoFaviconFile] = useState({});
    const [LogoFaviconPath, setLogoFaviconPath] = useState("");
    const [LogoFaviconBase64, setLogoFaviconBase64] = useState('');
    const [LogoFaviconSize, setLogoFaviconSize] = useState('');
    const [faviconError, setFaviconError] = useState(false);
    const [faviconErrorMessage, setFaviconErrorMessage] = useState('');


    const { getRootProps, getInputProps, isDragActive } = useDropzone({

        accept: 'image/jpeg, image/png, image/jpg',
        // multiple:true,

        onDrop: acceptedFiles => {
            acceptedFiles.map(async file => {
                props.faviconImageValidationfalse()
                setFaviconError(false)
                props.setImageLoading(4)
                setNewLogoFaviconFile(file)
                setLogoFaviconPath(URL.createObjectURL(file))
                if ((file.size / 1048576) > 0.2) {
                    setFaviconError(true)
                    setFaviconErrorMessage(`${file.name} (${formatBytes(file.size)}) exceeds the file size limit of 200 KB `)
                    props.faviconImageValidation()
                    props.setImageLoading(null)
                    return;
                }

                const imageBase64Url = await readFile(file)
                setLogoFaviconBase64(imageBase64Url)
                setLogoFaviconSize(imageBase64Url)
            });
        }
    })
    function onImgLoads({ target: img }) {
        const { offsetHeight, offsetWidth, naturalHeight, naturalWidth } = img;
        if ((naturalHeight != naturalWidth)) {
            setLogoFaviconSize('')
            setFaviconError(true)
            setFaviconErrorMessage(`The image you have provided is not a 1:1 ratio. Please upload a 200x200 or 400x400 pixel image.`)
            props.faviconImageValidation()
            props.setImageLoading(null);
            return
        }
        setLogoFaviconSize('')
        props.setFaviconImage(LogoFaviconBase64, LogoFaviconFile.name, PhotoGroupName[4])
        // props.disableButton()
    };
    return (
        <div class="box-wrap" {...getRootProps()}>
            <input {...getInputProps()} />
            <div>
                {
                    (LogoFaviconPath != "" || (props.OldFaviconImage != null && props.OldFaviconImage != "")) ?
                        <div class="position-relative d-inline-flex justify-content-center align-items-center cursor-pointer">

                            <div className='w-100 w-min-100'>
                                {
                                    faviconError ?
                                        <div className="box-wrap">
                                            <div className="media-image-wrap-favicon" >
                                                <div className="box-wrap text-center" style={{display:"flex"}}>
                                                    <i className="fa fa-plus"></i>
                                                    <p>{Labels.AddLogoFooter}</p>
                                                </div>
                                            </div>
                                        </div> :
                                        <div className="logo-favicon-n" >
                                            <img src={props.OldFaviconImage != "" && Utilities.generatePhotoLargeURL(props.OldFaviconImage, true, false)} alt="" />
                                        </div>
                                }
                                {
                                    faviconError &&
                                    <label id="name" class="control-label mt-2 text-danger">{faviconErrorMessage}</label>
                                }
                                {
                                    LogoFaviconSize != '' &&
                                    <img onLoad={onImgLoads} src={LogoFaviconSize} alt="" style={{ opacity: 0, }} />
                                }
                                {props?.isImageLoading == 4 && <div style={{position:'absolute',top:'20%',left:0,right:0,bottom:0}}>{props.loading(20,20)}</div>}
                            </div>

                        </div>
                        :

                        <div className="box-wrap">
                            <div className="media-image-wrap-favicon" >
                                <div className="box-wrap text-center d-flex" >
                                    <i className="fa fa-plus"></i>
                                    <p>{Labels.AddLogoFooter}</p>
                                </div>
                            </div>
                        </div>
                }

            </div>


        </div>
    )
}
export function LogoWebsite(props) {
    const [LogoWebsiteFile, setNewLogoWebsiteFile] = useState({});
    const [LogoWebsitePath, setLogoWebsitePath] = useState("");
    const [LogoWebsiteBase64, setLogoWebsiteBase64] = useState('');
    const [LogoWebsiteSize, setLogoWebsiteSize] = useState('');
    const [websiteLogoError, setLogoWebsiteError] = useState(false);
    const [websiteLogoErrorMessage, setLogoWebsiteErrorMessage] = useState('');

    const { getRootProps, getInputProps, isDragActive } = useDropzone({

        accept: 'image/jpeg, image/png, image/jpg',
        // multiple:true,

        onDrop: acceptedFiles => {
            acceptedFiles.map(async file => {
                props.websiteLogoImageValidationfalse()
                setLogoWebsiteError(false)
                props.setImageLoading(2)
                setNewLogoWebsiteFile(file)
                setLogoWebsitePath(URL.createObjectURL(file))
                if ((file.size / 1048576) > 0.2) {
                    setLogoWebsiteError(true)
                    setLogoWebsiteErrorMessage(`${file.name} (${formatBytes(file.size)}) exceeds the file size limit of 200 KB `)
                    props.websiteLogoImageValidation()
                    props.setImageLoading(null)
                    return;
                }

                const imageBase64Url = await readFile(file)
                setLogoWebsiteBase64(imageBase64Url)
                setLogoWebsiteSize(imageBase64Url)
            });
        }
    })
    function onImgLoads({ target: img }) {
        const { offsetHeight, offsetWidth, naturalHeight, naturalWidth } = img;
        if ((naturalHeight != naturalWidth)) {
            setLogoWebsiteSize('')
            setLogoWebsiteError(true)
            setLogoWebsiteErrorMessage(`The image you have provided is not a 1:1 ratio. Please upload a 200x200 or 400x400 pixel image.`)
            props.websiteLogoImageValidation()
            props.setImageLoading(null)
            return
        }
        setLogoWebsiteSize('')
        props.setWebsiteLogoImage(LogoWebsiteBase64, LogoWebsiteFile.name, PhotoGroupName[5])
        // props.disableButton()
    };
    return (
        <div class="box-wrap" {...getRootProps()}>
            <input {...getInputProps()} />
            <div >
                {
                    (LogoWebsitePath != "" || (props.OldwebsiteLogoImage != null && props.OldwebsiteLogoImage != "")) ?
                        <div class="position-relative d-inline-flex justify-content-center align-items-center cursor-pointer">

                            <div className='w-100 w-min-100'>
                                {
                                    websiteLogoError ?
                                        <div className='box-wrap'>
                                            <div className='media-image-wrap-website'>
                                                <div className='box-wrap text-center'>
                                                    <i className="fa fa-plus"></i>
                                                    <p>Add OG graph</p>
                                                </div>
                                            </div>
                                        </div> :
                                        <div className="logo-website-n" >
                                            <img src={props.OldwebsiteLogoImage != "" && Utilities.generatePhotoLargeURL(props.OldwebsiteLogoImage, true, false)} alt="" style={{minHeight: '100px', minWidth: '100px'}} />
                                        </div>
                                }
                                {
                                    websiteLogoError &&
                                    <label id="name" class="control-label mt-2 text-danger">{websiteLogoErrorMessage}</label>
                                }
                                {
                                    LogoWebsiteSize != '' &&
                                    <img onLoad={onImgLoads} src={LogoWebsiteSize} alt="" style={{ opacity: 0, }} />
                                }
                                 {props?.isImageLoading == 2 && <div style={{position:'absolute',top:'35%',left:0,right:0,bottom:0}}>{props.loading()}</div>}
                            </div>

                        </div>
                        :

                        <div className='box-wrap'>
                            <div className='media-image-wrap-website'>
                                <div className='box-wrap text-center'>
                                    <i className="fa fa-plus"></i>
                                    <p>Add OG graph</p>
                                </div>
                            </div>
                        </div>
                }

            </div>


        </div>
    )
}
export function LogoHeader(props) {
    const [LogoFile, setNewLogoFile] = useState({});
    const [LogoPath, setLogoPath] = useState("");
    const [LogoBase64, setLogoBase64] = useState('');
    const [LogoSize, setLogoSize] = useState('');
    const [LogoError, setLogoError] = useState(false);
    const [LogoErrorMessage, setLogoErrorMessage] = useState('');


    const { getRootProps, getInputProps, isDragActive } = useDropzone({

        accept: 'image/jpeg, image/png, image/jpg',
        // multiple:true,

        onDrop: acceptedFiles => {
            acceptedFiles.map(async file => {
                props.logoImageValidationfalse()
                setLogoError(false)
                props.setImageLoading(1)
                setNewLogoFile(file)
                setLogoPath(URL.createObjectURL(file))
                if ((file.size / 1048576) > 1) {
                    setLogoError(true)
                    setLogoErrorMessage(`${file.name} (${formatBytes(file.size)}) exceeds the file size limit of 1 MB`)
                    props.logoImageValidation()
                    props.setImageLoading(null)
                    return;
                }

                const imageBase64Url = await readFile(file)
                setLogoBase64(imageBase64Url)
                setLogoSize(imageBase64Url)
            });
        }
    })
    function onImgLoads({ target: img }) {
        const { offsetHeight, offsetWidth, naturalHeight, naturalWidth } = img;
        // if (naturalHeight > 100) {
        //     setLogoSize('')
        //     setLogoError(true)
        //     props.logoImageValidation()
        //     return
        // }
        setLogoSize('')
        props.setLogoImage(LogoBase64, LogoFile.name, PhotoGroupName[0])
        // props.disableButton()
    };
    return (
        <div class="box-wrap w-100" {...getRootProps()}>
            <input {...getInputProps()} />
            <div>
                {
                    (LogoPath != "" || (props.OldLogoImage != null && props.OldLogoImage != "")) ?
                        <div class="position-relative d-inline-flex justify-content-center align-items-center cursor-pointer">

                            <div className='w-100 w-min-100'>
                                {
                                    LogoError ?
                                        <div className='box-wrap'>
                                            <div className='media-image-wrap-header'>
                                                <div className='box-wrap text-center'>
                                                    <i className="fa fa-plus"></i>
                                                    <p>{Labels.AddLogoHeader}</p>
                                                </div>
                                            </div>
                                        </div> :
                                        <div className='logo-header-n'>
                                            <img src={props.OldLogoImage != "" && Utilities.generatePhotoLargeURL(props.OldLogoImage, true, false)} alt="" style={{ height: "100px" }} />
                                        </div>
                                }
                                {
                                    LogoError &&
                                    <label id="name" class="control-label mt-2 text-danger">{LogoErrorMessage}</label>
                                }
                                {
                                    LogoSize != '' &&
                                    <img onLoad={onImgLoads} src={LogoSize} alt="" style={{ opacity: 0, }} />
                                }
                                {props?.isImageLoading == 1 && <div style={{position:'absolute',top:'30%',left:0,right:0,bottom:0}}>{props.loading()}</div>}
                            </div>

                        </div>
                        :
                        <div className='box-wrap w-100'>
                            <div className='media-image-wrap-header'>
                                <div className='box-wrap text-center d-flex'>
                                    <i className="fa fa-plus"></i>
                                    <p>{Labels.AddLogoHeader}</p>
                                </div>
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}


export function CoverPhoto(props) {
    const [CoverFile, setNewCoverFile] = useState({});
    const [CoverPath, setCoverPath] = useState("");
    const [CoverBase64, setCoverBase64] = useState('');
    const [CoverSize, setCoverSize] = useState('');
    const [CoverError, setCoverError] = useState(false);
    const [CoverErrorMessage, setCoverErrorMessage] = useState('');
    


  const { getRootProps, getInputProps, isDragActive } = useDropzone({

        accept: 'image/jpeg, image/png, image/jpg',
        // multiple:true,

        onDrop: acceptedFiles => {
            acceptedFiles.map(async file => {
                props.coverImageValidationfalse()
                setCoverError(false)
                props?.setImageLoading(5)
                setNewCoverFile(file)
                setCoverPath(URL.createObjectURL(file))
                if ((file.size / 1048576) > 2) {
                    setCoverError(true)
                    props?.setImageLoading(null)
                    setCoverErrorMessage(`${file.name} (${formatBytes(file.size)}) exceeds the file size limit of 2 MB`)
                    props.coverImageValidation()
                    return;
                }

                const imageBase64Url = await readFile(file)
                setCoverBase64(imageBase64Url)
                setCoverSize(imageBase64Url)
            });
        }
    })
    function onImgLoads({ target: img }) {
        const { offsetHeight, offsetWidth, naturalHeight, naturalWidth } = img;
        // if (naturalHeight > 100) {
        //     setCoverSize('')
        //     setCoverError(true)
        //     props.coverImageValidation()
        //     return
        // }
        setCoverSize('')
        props.setCoverImage(CoverBase64, CoverFile.name, PhotoGroupName[2])
        // props.disableButton()
    };
    return (
        <div class="box-wrap w-100" {...getRootProps()}>
            <input {...getInputProps()} />
            <div>
                {
                    (CoverPath != "" || (props.OldCoverImage != null && props.OldCoverImage != "")) ?
                        <div class="position-relative d-inline-flex justify-content-center align-items-center cursor-pointer">

                            <div className='w-100 w-min-100'>
                                {
                                    CoverError ?
                                        <div className='box-wrap'>
                                            <div className='media-image-wrap-header'>
                                                <div className='box-wrap text-center'>
                                                    <i className="fa fa-plus"></i>
                                                    {/* <p>{Labels.AddLogoHeader}</p> */}
                                                </div>
                                            </div>
                                        </div> :
                                        <div className='logo-header-n'>
                                            <img src={props.OldCoverImage != "" && Utilities.generatePhotoLargeURL(props.OldCoverImage, true, false)} alt="" style={{ height: "100px" }} />
                                        </div>
                                }
                                {
                                    CoverError &&
                                    <label id="name" class="control-label mt-2 text-danger">{CoverErrorMessage}</label>
                                }
                                {
                                    CoverSize != '' &&
                                    <img onLoad={onImgLoads} src={CoverSize} alt="" style={{ opacity: 0, }} />
                                }
                                {props?.isImageLoading == 5 && <div style={{position:'absolute',top:'35%',left:0,right:0,bottom:0}}>{props.loading()}</div>}
                            </div>

                        </div>
                        :
                        <div className='box-wrap w-100'>
                            <div className='media-image-wrap-header'>
                                <div className='box-wrap text-center d-flex'>
                                    <i className="fa fa-plus"></i>
                                    {/* <p>{Labels.AddLogoHeader}</p> */}
                                </div>
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}


// const LogoHeader = ({ onDrop }) => {
//     const { getRootProps, getInputProps, isDragActive } = useDropzone({
//       onDrop,
//     });

//     return (
//       <div {...getRootProps()} >
//         <input {...getInputProps()} />
//         {!isDragActive ? (
//                      <div className='logo-header-n'>
//                      <img src='https://cloud-supershoply.s3.eu-west-2.amazonaws.com/enterprise/10/images/TEM-logo-online-638107626633985856.png'/>
//                      </div>
//         ) : (
//          <div className='box-wrap'>
//           <div className='media-image-wrap-header'>
//             <div className='box-wrap text-center'> 
//             <i className="fa fa-plus"></i>
//             <p>Add Logo Header</p>
//             </div>
//           </div>
//           </div>

//         )}
//       </div>
//     );
//   };
//   const LogoFooter = ({ onDrop }) => {
//     const { getRootProps, getInputProps, isDragActive } = useDropzone({
//       onDrop,
//     });

//     return (
//       <div {...getRootProps()} >
//         <input {...getInputProps()} />
//         {!isDragActive ? (
//                      <div className='logo-footer-n'>
//                      <img src='https://cloud-supershoply.s3.eu-west-2.amazonaws.com/enterprise/10/images/10154205-10152407398329511-2268122556600735905-n-638079085940871204.png'/>
//                      </div>
//         ) : (
//          <div className='box-wrap'>
//           <div className='media-image-wrap-footer'>
//             <div className='box-wrap text-center'> 
//             <i className="fa fa-plus"></i>
//             <p>Add Logo Header</p>
//             </div>
//           </div>
//           </div>

//         )}
//       </div>
//     );
//   };
//   const Favicon = ({ onDrop }) => {
//     const { getRootProps, getInputProps, isDragActive } = useDropzone({
//       onDrop,
//     });

//     return (
//       <div {...getRootProps()} >
//         <input {...getInputProps()} />
//         {!isDragActive ? (
//                      <div className='logo-favicon-n'>
//                      <img src='https://cloud-supershoply.s3.eu-west-2.amazonaws.com/enterprise/10/images/10154205-10152407398329511-2268122556600735905-n-638079085940871204.png'/>
//                      </div>
//         ) : (
//          <div className='box-wrap'>
//           <div className='media-image-wrap-favicon'>
//             <div className='box-wrap text-center'> 
//             <i className="fa fa-plus"></i>

//             </div>
//           </div>
//           </div>

//         )}
//       </div>
//     );
//   };
//   const LogoWebsite = ({ onDrop }) => {
//     const { getRootProps, getInputProps, isDragActive } = useDropzone({
//       onDrop,
//     });

//     return (
//       <div {...getRootProps()} >
//         <input {...getInputProps()} />
//         {!isDragActive ? (
//                      <div className='logo-website-n'>
//                      <img src='https://cloud-supershoply.s3.eu-west-2.amazonaws.com/enterprise/10/images/ogimage-638079914773213399.png'/>
//                      </div>
//         ) : (
//          <div className='box-wrap'>
//           <div className='media-image-wrap-website'>
//             <div className='box-wrap text-center'> 
//             <i className="fa fa-plus"></i>
//             <p>Add OG graph</p>
//             </div>
//           </div>
//           </div>

//         )}
//       </div>
//     );
//   };

class Media extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalLogo: false,
            modalSearchCover: false,
            modalMenuCover: false,
            modalFooter: false,
            EnterpriseSetting: this.props != undefined && this.props.enterpriseInfo != undefined ? this.props.enterpriseInfo : {},

            PhotoName: null,
            CroppedAreaPixels: null,
            CroppedImage: null,

            LogoImage: this.props != undefined && this.props.enterpriseInfo.HeaderLogo != undefined ? this.props.enterpriseInfo.HeaderLogo : "",
            LogoCrop: { x: 0, y: 0 },
            LogoZoom: 1,
            LogoAspect: 200 / 200,
            OldLogoImage: this.props != undefined && this.props.enterpriseInfo.HeaderLogo != undefined ? this.props.enterpriseInfo.HeaderLogo : "",

            MenuCoverImage: null,
            MenuCoverCrop: { x: 0, y: 0 },
            MenuCoverZoom: 1,
            MenuCoverAspect: 1325 / 200,
            OldMenuCoverImage: null,

            SearchCoverImage: null,
            SearchCoverCrop: { x: 0, y: 0 },
            SearchCoverZoom: 1,
            SearchCoverAspect: 400 / 225,
            OldSearchCoverImage: null,

            footerImage: this.props != undefined && this.props.enterpriseInfo.FooterLogo != undefined ? this.props.enterpriseInfo.FooterLogo : "",
            footerCrop: { x: 0, y: 0 },
            footerZoom: 1,
            oldFooterImage: this.props != undefined && this.props.enterpriseInfo.FooterLogo != undefined ? this.props.enterpriseInfo.FooterLogo : "",

            faviconImage: this.props != undefined && this.props.enterpriseInfo.Favicon != undefined ? this.props.enterpriseInfo.Favicon : "",
            faviconCrop: { x: 0, y: 0 },
            faviconZoom: 1,
            OldFaviconImage: this.props != undefined && this.props.enterpriseInfo.Favicon != undefined ? this.props.enterpriseInfo.Favicon : "",

            websiteLogoImage: this.props != undefined && this.props.enterpriseInfo.OGImage != undefined ? this.props.enterpriseInfo.OGImage : "",
            websiteLogoCrop: { x: 0, y: 0 },
            websiteLogoZoom: 1,
            OldwebsiteLogoImage: this.props != undefined && this.props.enterpriseInfo.OGImage != undefined ? this.props.enterpriseInfo.OGImage : "",

            CoverImage: this.props != undefined && this.props.enterpriseInfo.CoverPhotoName != undefined ? this.props.enterpriseInfo.CoverPhotoName : "",
            CoverCrop: { x: 0, y: 0 },
            CoverZoom: 1,
            CoverAspect: 400 / 225,
            OldCoverImage: this.props != undefined && this.props.enterpriseInfo.CoverPhotoName != undefined ? this.props.enterpriseInfo.CoverPhotoName : "",
            


            HasEnterpriseUpdatePermission: false,
            IsSave: false,
            PhotoError: false,
            scrolled: false,
            footerImageError: false,
            logoImageError: false,
            faviconImageError: false,
            websiteLogoError: false,
            coverImageError : false,
            isImageLoading: null
        };

        this.SaveMediaSetting = this.SaveMediaSetting.bind(this);
    }

    setLogo = (photoName) => {

        var userObject = localStorage.getItem(Constants.Session.USER_OBJECT);
        if(!Utilities.stringIsEmpty(userObject) ) {
          let userObj = JSON.parse(userObject);
          userObj.Enterprise.PhotoName = photoName
          localStorage.setItem(Constants.Session.USER_OBJECT, JSON.stringify(userObj));
          reloadLogo(photoName);
          }
    }

    SavePhotoApi = async (oldPhotoName, bitStream, photoName, groupName) => {

        let setting = EnterpriseSettingService.EnterpriseSettings;

        setting.OldPhotoName = oldPhotoName;
        setting.PhotoNameBitStream = bitStream;
        setting.PhotoGroupName = groupName;
        setting.PhotoName = photoName;
        let result = await EnterpriseSettingService.SavePhoto(setting);
        this.setState({ IsSave: false })
        if (result !== undefined && !result.HasError && result.Dictionary.IsChangesSuccessful === true) {

            //  let setting = this.state.EnterpriseSetting;
            // let photoName = result.Dictionary.PhotoName 
            this.setState({
                // modalLogo: false,
                // modalSearchCover: false,
                // modalMenuCover: false,
                // modalFooter: false,
                oldFooterImage: groupName == "EnterpriseFooterLogo" ? result.Dictionary.PhotoName : this.state.footerImage,
                OldLogoImage: groupName == "Restaurant" ? result.Dictionary.PhotoName : this.state.LogoImage,
                OldFaviconImage: groupName == "Favicon" ? result.Dictionary.PhotoName : this.state.faviconImage,
                OldwebsiteLogoImage: groupName == "OGImage" ? result.Dictionary.PhotoName : this.state.websiteLogoImage,
                OldCoverImage: groupName == "Cover-Photo" ? result.Dictionary.PhotoName : this.state.CoverImage,
                footerImage: groupName == "EnterpriseFooterLogo" ? result.Dictionary.PhotoName : this.state.footerImage,
                LogoImage: groupName == "Restaurant" ? result.Dictionary.PhotoName : this.state.LogoImage,
                faviconImage: groupName == "Favicon" ? result.Dictionary.PhotoName : this.state.faviconImage,
                websiteLogoImage: groupName == "OGImage" ? result.Dictionary.PhotoName : this.state.websiteLogoImage,
                CoverImage: groupName == "Cover-Photo" ? result.Dictionary.PhotoName : this.state.CoverImage,
                isImageLoading: null

                
            });
            if(groupName == "Restaurant") 
                {
                    this.setLogo(result.Dictionary.PhotoName)
                };

            this.props.GetEnterpriseHealth()
            Utilities.notify("Updated successfully.", "s");
            return
        } 
            Utilities.notify(result.ErrorCodeCsv, "e");
            this.setState({ PhotoError: true,isImageLoading: null });
    }


    SaveMediaSettingApi = async (enterpriseSetting) => {

        let message = await EnterpriseSettingService.SaveMediaSeting(enterpriseSetting)
        this.setState({ IsSave: false })
        if (message === '1')
            Utilities.notify("Updated successfully.", "s");

        else
            Utilities.notify("Update failed.", "e");


    }

    SaveMediaSetting(event, values) {
        if (this.state.IsSave) return;
        this.setState({ IsSave: true })
        let setting = EnterpriseSettingService.EnterpriseSettings;
        setting.FlickerGalleryID = values.txtFlickerGalleryId;
        setting.VideoUrl = values.txtVideoUrl;

        this.SaveMediaSettingApi(setting);

    }

    componentDidMount() {
        window.addEventListener('scroll', () => {
            const istop = window.scrollY < 95;

            if (istop !== true && !this.state.scrolled) {
                this.setState({ scrolled: true })
            }
            else if (istop == true && this.state.scrolled) {
                this.setState({ scrolled: false })
            }

        });

        if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
            let userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
            let UserRole = userObj.RoleLevel;

            let hasEnterpriseUpdatePermission = Utilities.HasPermission(userObj.RoleLevel, Constants.Permission.ENTERPRISE_ENTERPRISE_UPDATE);


            this.setState({ HasEnterpriseUpdatePermission: hasEnterpriseUpdatePermission, }, () => {

            });

        }

    }

    getBase64(file, cb) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(reader.result)
        };
        reader.onerror = function (error) {

        };
    }
    footerImageValidation = () => {
        this.setState({ footerImageError: true })
    }
    footerImageValidationfalse = () => {
        this.setState({ footerImageError: false })
    }
    setFooterImage = (bitStream, photoName, groupName) => {
        this.SavePhotoApi(this.state.oldFooterImage, bitStream, photoName, groupName)
    }
    logoImageValidation = () => {
        this.setState({ logoImageError: true })
    }
    logoImageValidationfalse = () => {
        this.setState({ logoImageError: false })
    }
    setLogoImage = (bitStream, photoName, groupName) => {
        this.SavePhotoApi(this.state.OldLogoImage, bitStream, photoName, groupName)
    }
    faviconImageValidation = () => {
        this.setState({ faviconImageError: true })
    }
    faviconImageValidationfalse = () => {
        this.setState({ faviconImageError: false })
    }
    setFaviconImage = (bitStream, photoName, groupName) => {
        this.SavePhotoApi(this.state.OldFaviconImage, bitStream, photoName, groupName)
    }
    websiteLogoImageValidation = () => {
        this.setState({ websiteLogoError: true })
    }
    websiteLogoImageValidationfalse = () => {
        this.setState({ websiteLogoError: false })
    }
    setWebsiteLogoImage = (bitStream, photoName, groupName) => {
        this.SavePhotoApi(this.state.OldwebsiteLogoImage, bitStream, photoName, groupName)
    }
    coverImageValidation = () => {
        this.setState({ coverImageError: true })
    }
    coverImageValidationfalse = () => {
        this.setState({ coverImageError: false })
    }
    setCoverImage = (bitStream, photoName, groupName) => {
        this.SavePhotoApi(this.state.OldCoverImage, bitStream, photoName, groupName)
    }
    loading = (height,width) => <div className="loader-menu-inner"> 
      <Loader type="Oval" color="#ed0000" height={height || 30} width={width || 30}/>  
      </div>

    render() {
        let setting = this.state.EnterpriseSetting;

        let photoName = Utilities.generatePhotoLargeURL(setting.PhotoName, true, false)
        let coverPhoto = Utilities.generatePhotoLargeURL(setting.CoverPhoto, true, true)
        let SearchCoverPhoto = Utilities.generatePhotoLargeURL(setting.CoverPhotoName, true, false)

        return (

            <div className="card-body m-3 mb-5 p-4" style={{ boxShadow: "0 0 5px #00000030" }}>

                <div class="dropzone-main-wrap">
                    <div className='dropzone-main-inner'>
                    <div class="dropzone-left">
                        <div className='mb-1' style={{ maxWidth: "350px" }}>
                            <h5>Logo Header</h5>
                            <p>Upload a PNG/JPG file not more than 1 MB in size.</p>
                            <LogoHeader
                                setLogoImage={(bitStream, photoName, groupName) => this.setLogoImage(bitStream, photoName, groupName)}
                                OldLogoImage={this.state.OldLogoImage}
                                logoImageValidation={() => this.logoImageValidation()}
                                logoImageValidationfalse={() => this.logoImageValidationfalse()}
                                loading={this.loading}
                                isImageLoading={this.state.isImageLoading}
                                setImageLoading={(val) => this.setState({isImageLoading : val})}
                            />
                        </div>
                    </div>

                    <div class="dropzone-middle">
                        <div className='mb-1' style={{ maxWidth: "350px" }}>
                            <h5>Logo Footer</h5>
                            <p>Upload a 1:1 PNG/JPG file which is not larger than 1 MB in size.</p>

                            <LogoFooterImage
                                setFooterImage={(bitStream, photoName, groupName) => this.setFooterImage(bitStream, photoName, groupName)}
                                oldFooterImage={this.state.oldFooterImage}
                                footerImageValidation={() => this.footerImageValidation()}
                                footerImageValidationfalse={() => this.footerImageValidationfalse()}
                                loading={this.loading}
                                isImageLoading={this.state.isImageLoading}
                                setImageLoading={(val) => this.setState({isImageLoading : val})}
                            />
                        </div>
                    </div>
                    <div className='dropzone-right'>
                        <div className='mb-1' style={{ maxWidth: "350px" }}>
                            <h5>Favicon</h5>
                            <p>Upload a 1:1 PNG file which is not larger than 200 KB in size.</p>

                            <Favicon
                                setFaviconImage={(bitStream, photoName, groupName) => this.setFaviconImage(bitStream, photoName, groupName)}
                                OldFaviconImage={this.state.OldFaviconImage}
                                faviconImageValidation={() => this.faviconImageValidation()}
                                faviconImageValidationfalse={() => this.faviconImageValidationfalse()}
                                loading={this.loading}
                                isImageLoading={this.state.isImageLoading}
                                setImageLoading={(val) => this.setState({isImageLoading : val})}
                            />
                        </div>
                    </div>
                    </div>

                    <div class="dropzone-main-wrap website-wrap">
                    <div class="dropzone-web">
                        <div className='mb-1' >
                            <h5>Website image</h5>
                            <p>Upload a 1:1 PNG/JPG file which is not larger than 2 MB in size.</p>

                            <LogoWebsite
                                setWebsiteLogoImage={(bitStream, photoName, groupName) => this.setWebsiteLogoImage(bitStream, photoName, groupName)}
                                OldwebsiteLogoImage={this.state.OldwebsiteLogoImage}
                                websiteLogoImageValidation={() => this.websiteLogoImageValidation()}
                                websiteLogoImageValidationfalse={() => this.websiteLogoImageValidationfalse()}
                                loading={this.loading}
                                isImageLoading={this.state.isImageLoading}
                                setImageLoading={(val) => this.setState({isImageLoading : val})}
                            />
                        </div>
                    </div>
                     <div className='dropzone-right'>
                        <div className='mb-1' style={{ maxWidth: "350px" }}>
                            <h5>Search cover photo</h5>
                            <p>Upload a 400×225 PNG/JPG file which is not larger than 2 MB in size.</p>

                            <CoverPhoto
                                setCoverImage={(bitStream, photoName, groupName) => this.setCoverImage(bitStream, photoName, groupName)}
                                OldCoverImage={this.state.OldCoverImage}
                                coverImageValidation={() => this.coverImageValidation()}
                                coverImageValidationfalse={() => this.coverImageValidationfalse()}
                                loading={this.loading}
                                isImageLoading={this.state.isImageLoading}
                                setImageLoading={(val) => this.setState({isImageLoading : val})}
                            />
                        </div>
                    </div>
                </div>

                </div>

               

            </div>
        );
    }
}

export default Media;
