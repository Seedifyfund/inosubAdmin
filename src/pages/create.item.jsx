import React, { useState } from 'react';
import Gs from '../theme/globalStyles';
import styled from 'styled-components';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import PleaseWait from '../modals/please-wait';
import ShareCommunity from '../modals/share-community';
import { FaPlusCircle } from 'react-icons/fa';
import Media from '../theme/media-breackpoint';

import ProfileIMG from '../assets/images/dummy1.jpg';
import ProfileIMG2 from '../assets/images/dummy2.jpg';
import UBorder from '../assets/images/dotted-border.png';
import UploadIcon from '../assets/images/upload.png';
import ArrowDown from '../assets/images/arrow-down.png';
import ipfs from '../config/ipfs';
import { actions } from '../actions';
import { compressImage } from '../helper/functions';
import { connect } from 'react-redux';

const CreateItem = (props) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [description, setDescription] = useState('');
  const [supply, setSupply] = useState('');
  const [attributes, setAttributes] = useState([]);
  const [currentAttribute, setCurrentAttribute] = useState({ trait_type: "", value: '' })
  const [unLockableContent, setUnclockableContent] = useState();
  const [isUnLockableContent, setIsUnclockableContent] = useState();
  const [network, setNetwork] = useState();
  const [currTab, setCurrTab] = useState('properties');
  const [uploadRatio, setUploadRatio] = useState();
  // console.log(name, image, externalLink, description, supply, attributes, unLockableContent, isUnLockableContent)

  const [openFirst, setOpenFirst] = useState(false);
  const [openSecond, setOpenSecond] = useState(false);
  const closeIcon = (
    <svg fill="currentColor" viewBox="2 2 16 16" width={20} height={20}>
      <line x1="5" y1="5" x2="15" y2="15" stroke="#7BF5FB" strokeWidth="2.6" strokeLinecap="square" strokeMiterlimitit="16"></line>
      <line x1="15" y1="5" x2="5" y2="15" stroke="#7BF5FB" strokeWidth="2.6" strokeLinecap="square" strokeMiterlimitit="16"></line>
    </svg>
  )

  const validate = () => {
    const _error = { status: false, msg: '' }
    if (!name || !image || !description || !supply || !attributes || !network) {
      _error.status = true; _error.msg = "Please enter all the required fields.";
    }
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(externalLink)) {
      _error.status = true; _error.msg = "Please enter valid external link";
    }
  }

  const submitNFTDetails = async () => {
    let fileType = image.type
    let compressionRequired = false;
    let compressedNFTFile = image;
    if (
      image.size > 1572864 &&
      !fileType.search("image") &&
      !fileType.includes("gif")
    ) {
      compressionRequired = true;
      compressedNFTFile = await compressImage(image);
    }
    //
    let originalIpfsHash = await ipfs.add(image, {
      pin: true,
      progress: (bytes) => {
        setUploadRatio(bytes);
      },
    });
    let original_size = image.size
    //
    let compressedImageIpfsHash = '';
    if (compressionRequired) {
      compressedImageIpfsHash = await ipfs.add(image, {
        pin: true,
        progress: (bytes) => {
          setUploadRatio(Math.floor((bytes * 100) / original_size));
        },
      })
    }
    //
    const metaData = { name: name, image: originalIpfsHash, externalLink: externalLink }
    const buffer = ipfs.Buffer;
    let objectString = JSON.stringify(metaData);
    let bufferedString = await buffer.from(objectString);
    let metaDataURI = await ipfs.add(bufferedString);
    //

    let nftObj = {
      ipfs: metaDataURI,
      isUnlockableContent: isUnLockableContent,
      unclockableContent: unLockableContent,
      copies: supply,
      network: network,
      compressedImg: compressedImageIpfsHash
    }

    props.createNFT(nftObj)
  }

  const addAttributes = () => {

  }
  console.log(currentAttribute)
  return (
    <>
      <Gs.Container>
        <CIOuter>
          <CILeft>
            <CITitle onClick={() => setOpenSecond(true)}>Preview Item</CITitle>
            <LeftBox>
              <div className='img-outer'>
                <img src={image ? URL.createObjectURL(image) : ProfileIMG} alt='' />
              </div>
              <CILHeader>
                <CILTitle>Game Asset Name</CILTitle>
                <GreyBadge>10X</GreyBadge>
              </CILHeader>
              <OtherDetail>
                <ODLeft>
                  <div className='img-outer'>
                    <img src={ProfileIMG2} alt='' />
                  </div>
                  <div>
                    <PName>PROJECT NAME</PName>
                    <PDetail>SIDUS</PDetail>
                  </div>
                </ODLeft>
                <ODRight>
                  <PName>PRICE</PName>
                  <SValue>0.001 SFUND</SValue>
                </ODRight>
              </OtherDetail>
            </LeftBox>
          </CILeft>
          <CIRight>
            <label>Upload File <span>(File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF. Max size: 100 MB)</span></label>
            <UploadBorder>
              <div className="upload-btn-wrapper">
                <CWBtn2><img src={UploadIcon} alt='' /> Add File(s)</CWBtn2>
                <input type="file" name="myfile" onChange={(e) => setImage(e.target.files[0])} />
              </div>
              <p>or drop it right here</p>
            </UploadBorder>
            <label className='mb-5'>Item Name</label>
            <InputOuter>
              <input type='text' placeholder='Enter the name of your NFT item here.' onChange={(e) => setName(e.target.value)} />
            </InputOuter>
            <label className='mb-5'>External Link</label>
            <InputOuter>
              <input type='text' placeholder='Add the link about the item to provide detailed information about the item and direct the user to link.' onChange={(e) => setExternalLink(e.target.value)} />
            </InputOuter>
            <label className='mb-5'>DESCRIPTION</label>
            <InputOuter>
              <textarea placeholder='Give detailed information and the story behind your NFTs and create a context for the potential owner!' onChange={(e) => setDescription(e.target.value)}></textarea>
            </InputOuter>
            <label className='mb-5'>Supply <span className='ver2'>(No gas fees to you!)</span></label>
            <InputOuter>
              <input type='text' placeholder='The number of copies that can be minted.' onChange={(e) => setSupply(e.target.value)} />
            </InputOuter>
            <hr />
            <CustomHTabs>
              <Tabs>
                <TabList>
                  <Tab onClick={() => { setCurrTab('properties') }}>PROPERTIES</Tab>
                  <Tab onClick={() => { setCurrTab('levels') }}>LEVELS</Tab>
                  <Tab onClick={() => { setCurrTab('stats') }}>STATS</Tab>
                </TabList>
                <TabPanel>
                  <label className='mb-5'>Type</label>
                  <InputOuter>
                    <input type='text' placeholder='Enter a character' onChange={(e) => setCurrentAttribute(prevState => ({
                      ...prevState,
                      trait_type: e.target.value
                    }))} />
                  </InputOuter>
                  <label className='mb-5'>Name</label>
                  <InputOuter>
                    <input type='text' placeholder='A complex form might...|' onChange={(e) => setCurrentAttribute(prevState => ({
                      ...prevState,
                      value: e.target.value
                    }))} />
                  </InputOuter>
                  <Badges>
                    <BadgeList>
                      <BadgeBox>
                        <Value1>Birds</Value1>
                        <Value2>Chirp</Value2>
                      </BadgeBox>
                      <BadgeBox>
                        <Value1>Colors</Value1>
                        <Value2>Rainbow</Value2>
                      </BadgeBox>
                    </BadgeList>
                    <CWBtn2 className='add-more'><FaPlusCircle /> Add More</CWBtn2>
                  </Badges>
                </TabPanel>
                <TabPanel>
                  <label className='mb-5'>Type</label>
                  <InputOuter>
                    <input type='text' placeholder='Enter a character' />
                  </InputOuter>
                  <label className='mb-5'>Value</label>
                  <InputOuter>
                    <input type='text' placeholder='A complex form might...|' />
                  </InputOuter>
                  <Badges>
                    <BadgeList>
                      <BadgeBox>
                        <Value1>Birds</Value1>
                        <Value2>Chirp</Value2>
                      </BadgeBox>
                      <BadgeBox>
                        <Value1>Colors</Value1>
                        <Value2>Rainbow</Value2>
                      </BadgeBox>
                    </BadgeList>
                    <CWBtn2 className='add-more'><FaPlusCircle /> Add More</CWBtn2>
                  </Badges>
                </TabPanel>
                <TabPanel>
                  <label className='mb-5'>Type</label>
                  <InputOuter>
                    <input type='text' placeholder='Enter a character' />
                  </InputOuter>
                  <ValueOuter>
                    <div className='value-box'>
                      <label className='mb-5'>Value</label>
                      <InputOuter>
                        <div className='input-box'>A complex form might...A complex form might...A complex form might...A complex form might...A complex form might...'</div>
                      </InputOuter>
                    </div>
                    <div className="number-row">
                      <div className='number-box'>
                        <label className='mb-5'>Number</label>
                        <InputOuter>
                          <input type='text' />
                        </InputOuter>
                      </div>
                      <p>of</p>
                      <div className='number-box'>
                        <label className='mb-5'>Number</label>
                        <InputOuter>
                          <input type='text' />
                        </InputOuter>
                      </div>
                    </div>
                  </ValueOuter>
                  <Badges>
                    <BadgeList>
                      <BadgeBox>
                        <Value1>Birds</Value1>
                        <Value2>Chirp</Value2>
                      </BadgeBox>
                      <BadgeBox>
                        <Value1>Colors</Value1>
                        <Value2>Rainbow</Value2>
                      </BadgeBox>
                    </BadgeList>
                    <CWBtn2 className='add-more'><FaPlusCircle /> Add More</CWBtn2>
                  </Badges>
                </TabPanel>
              </Tabs>
              <div className='tab-main'>
                <div className='tab-list'>
                  <button className='active' onClick={() => { setCurrTab('properties') }}>PROPERTIES</button>
                  <button onClick={() => { setCurrTab('levels') }}>LEVELS</button>
                  <button onClick={() => { setCurrTab('stats') }}>STATS</button>
                </div>
                <div className='tab-panel'>
                  <label className='mb-5'>Type</label>
                  <InputOuter>
                    <input type='text' placeholder='Enter a character' onChange={(e) => setCurrentAttribute(prevState => ({
                      ...prevState,
                      trait_type: e.target.value
                    }))} />
                  </InputOuter>
                  <label className='mb-5'>Name</label>
                  <InputOuter>
                    <input type='text' placeholder='A complex form might...|' onChange={(e) => setCurrentAttribute(prevState => ({
                      ...prevState,
                      value: e.target.value
                    }))} />
                  </InputOuter>
                  <Badges>
                    <BadgeList>
                      <BadgeBox>
                        <Value1>Birds</Value1>
                        <Value2>Chirp</Value2>
                      </BadgeBox>
                      <BadgeBox>
                        <Value1>Colors</Value1>
                        <Value2>Rainbow</Value2>
                      </BadgeBox>
                    </BadgeList>
                    <CWBtn2 className='add-more'><FaPlusCircle /> Add More</CWBtn2>
                  </Badges>
                </div>
                <div className='tab-panel'>
                  <label className='mb-5'>Type</label>
                  <InputOuter>
                    <input type='text' placeholder='Enter a character' />
                  </InputOuter>
                  <label className='mb-5'>Value</label>
                  <InputOuter>
                    <input type='text' placeholder='A complex form might...|' />
                  </InputOuter>
                  <Badges>
                    <BadgeList>
                      <BadgeBox>
                        <Value1>Birds</Value1>
                        <Value2>Chirp</Value2>
                      </BadgeBox>
                      <BadgeBox>
                        <Value1>Colors</Value1>
                        <Value2>Rainbow</Value2>
                      </BadgeBox>
                    </BadgeList>
                    <CWBtn2 className='add-more'><FaPlusCircle /> Add More</CWBtn2>
                  </Badges>
                </div>
                <div className='tab-panel'>
                  <label className='mb-5'>Type</label>
                  <InputOuter>
                    <input type='text' placeholder='Enter a character' />
                  </InputOuter>
                  <ValueOuter>
                    <div className='value-box'>
                      <label className='mb-5'>Value</label>
                      <InputOuter>
                        <div className='input-box'>A complex form might...A complex form might...A complex form might...A complex form might...A complex form might...'</div>
                      </InputOuter>
                    </div>
                    <div className="number-row">
                      <div className='number-box'>
                        <label className='mb-5'>Number</label>
                        <InputOuter>
                          <input type='text' />
                        </InputOuter>
                      </div>
                      <p>of</p>
                      <div className='number-box'>
                        <label className='mb-5'>Number</label>
                        <InputOuter>
                          <input type='text' />
                        </InputOuter>
                      </div>
                    </div>
                  </ValueOuter>
                  <Badges>
                    <BadgeList>
                      <BadgeBox>
                        <Value1>Birds</Value1>
                        <Value2>Chirp</Value2>
                      </BadgeBox>
                      <BadgeBox>
                        <Value1>Colors</Value1>
                        <Value2>Rainbow</Value2>
                      </BadgeBox>
                    </BadgeList>
                    <CWBtn2 className='add-more'><FaPlusCircle /> Add More</CWBtn2>
                  </Badges>
                </div>
              </div>
            </CustomHTabs>
            <label className='mb-5'>Blockchain</label>
            <InputOuter>
              <div className='select-outer'>
                <select onClick={(e) => setNetwork(e.target.value)}>
                  <option value='ethereum' >Ethereum</option>
                  <option value='polygon'>Polygon</option>
                  <option value='binance'>Binance Smart Chain</option>
                </select>
                <DArrow>
                  <img src={ArrowDown} alt='' />
                </DArrow>
              </div>
            </InputOuter>
            <BigInputOuter>
              <div className='big-input-box'>
                <CustomSwitch>
                  <label className="switch">
                    <input type="checkbox" onChange={(e) => setIsUnclockableContent(e.target.checked)} />
                    <span className="slider round"></span>
                  </label>
                </CustomSwitch>
                Include unlockable content that can only be revealed by the owner of the item.
              </div>
            </BigInputOuter>
            <BigInputOuter className='mb-50'>
              <input type='text' placeholder='Enter access key, code to redeem etc. that can only be revealed by the owner of the item.' onChange={(e) => setUnclockableContent(e.target.value)} />
            </BigInputOuter>
            <div className='s-row'>
              <CWBtn onClick={() => setOpenFirst(true)}>Submit</CWBtn>
            </div>
          </CIRight>
        </CIOuter>
      </Gs.Container>
      <Modal open={openFirst} closeIcon={closeIcon} onClose={() => setOpenFirst(false)} center classNames={{
        overlay: 'customOverlay',
        modal: 'customModal',
      }}>
        <PleaseWait />
      </Modal>
      <Modal open={openSecond} closeIcon={closeIcon} onClose={() => setOpenSecond(false)} center classNames={{
        overlay: 'customOverlay',
        modal: 'customModal2',
      }}>
        <ShareCommunity />
      </Modal>
    </>
  );
};
const mapDipatchToProps = (dispatch) => {
  return {
    // createNFT :()=>dispatch(actions .createNFT()),
    enableMetamask: () => dispatch(actions.enableMetamask()),
    enabledWalletConnect: () => dispatch(actions.enabledWalletConnect()),
    generateNonce: (address) => dispatch(actions.generateNonce(address)),
    authLogin: (nonce, signature) => dispatch(actions.authLogin(nonce, signature)),
    web3Logout: () => dispatch({ type: 'LOGGED_OUT', data: { isLoggedIn: false, accounts: [] } }),
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.isAuthenticated,
    nonce: state.fetchNonce,
  }
}



const FlexDiv = styled.div`
  display: flex; align-items: center; justify-content: center; flex-wrap: wrap;
`;

const CIOuter = styled(FlexDiv)`
  align-items:flex-start; justify-content:flex-start; margin:32px 0px 100px;
`;

const CILeft = styled.div`
  width:278px;
  ${Media.md} {
    width:100%; margin-bottom:50px;
  }
`;

const CIRight = styled.div`
  width:calc(100% - 323px); margin-left:45px;
  label{font-style: normal; font-weight: 700; font-size: 16px; line-height: 20px; color: #FFFFFF; margin-bottom:25px; display:block;
    span{margin-left:8px; opacity: 0.7; font-weight: 500; font-size: 15px; line-height: 19px;}
    &.mb-5{margin-bottom:5px;}
    &.ver2{opacity:0.5; font-weight: 300; font-size: 14px; line-height: 18px;}
  }
  hr{margin:0px 0px 40px; background: rgba(54, 57, 79, 0.5); border: 1px solid rgba(255, 255, 255, 0.15); border-top:0px;}
  .s-row{text-align:right;}
  ${Media.md} {
    width:100%; margin-left:0px;
  }
`;

const CITitle = styled.div`
  font-style: normal; font-weight: 700; font-size: 20px; line-height: 26px; color: #FFFFFF; margin-bottom:24px;
`;

const LeftBox = styled.div`
  border: 1px solid #7BF5FB; backdrop-filter: blur(60px); border-radius: 4px; padding:16px;
  .img-outer{ border-radius: 2px; margin-bottom:21px;
    width:100%; height:246px; overflow:hidden; border: 1px solid #7BF5FB; backdrop-filter: blur(60px);
    img{width:100%; height:100%; object-fit:cover;}
  }
`;

const CILHeader = styled(FlexDiv)`
  justify-content:space-between; margin-bottom:24px;
`;

const CILTitle = styled.div`
  font-style: normal; font-weight: 700; font-size: 21px; line-height: 25px; color: #FFFFFF;
`;

const GreyBadge = styled(FlexDiv)`
  font-style: normal; font-weight: 400; font-size: 17px; line-height: 26px; color: #D7E1E9; background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(60px); border-radius: 69px; padding: 0px 8px;
`;

const OtherDetail = styled(FlexDiv)`
  justify-content:space-between; 
`;

const ODLeft = styled(FlexDiv)`
  .img-outer{ border-radius: 2px; width:40px; height:40px; overflow:hidden; border:none; margin-right:8px; margin-bottom:0px;
    img{width:100%; height:100%; object-fit:cover; }
  }
`;

const PName = styled.div`
  font-style: normal; font-weight: 500; font-size: 14px; line-height: 18px; color: #FFFFFF; opacity: 0.8; margin:0px 0px 3px;
`;

const PDetail = styled.div`
  font-style: normal; font-weight: 700; font-size: 16px; line-height: 19px; color: #FFFFFF;
`;

const ODRight = styled.div`
  text-align:right;
`;

const SValue = styled.div`
  font-style: normal; font-weight: 600; font-size: 18px; line-height: 23px; color: #FFFFFF;
`;

const UploadBorder = styled(FlexDiv)`
  flex-direction: column; background: url(${UBorder}) no-repeat; background-size:100% 100%; padding:50px 0px 40px; margin-bottom:40px;
  p{font-style: normal; font-weight: 500; font-size: 16px; line-height: 20px; color: #FFFFFF; opacity: 0.7; margin:0px; text-align:center; margin-top:15px; }
  .upload-btn-wrapper{ position: relative; overflow: hidden; display: inline-block;
    input[type=file]{ font-size: 100px; position: absolute; left: 0; top: 0; opacity: 0; right:0; bottom:0; 
      ::-webkit-file-upload-button {
        -webkit-appearance: button; cursor: pointer;
      }
    }
  }
`;

const CWBtn = styled.button`
  font-family: 'Adrianna Bd'; font-style: normal; font-weight: 700; font-size: 18px; line-height: 19px; color: #7BF5FB; background: linear-gradient(263.59deg, #343FA1 0%, #6350BB 100%);
  border-radius: 4px; padding:21px 68px 20px 69px; border:none; transition: all .4s ease-in-out;
  :hover{opacity:0.9;}
`;

const CWBtn2 = styled.button`
  font-family: 'Rajdhani', sans-serif; font-style: normal; font-weight: 600; font-size: 16px; line-height: 19px; color: #7BF5FB; background: linear-gradient(263.59deg, #343FA1 0%, #6350BB 100%);
  border-radius: 4px; padding:14px 50px 14px 51px; border:none; transition: all .4s ease-in-out; 
  :hover{opacity:0.9;}
  img{margin-right:7px;}
  &.add-more{display:flex; align-items:center;
    svg{margin-right:10px; font-size:16px;}
  }
`;

const InputOuter = styled.div`
  margin-bottom:40px; 
  input,textarea,select{width:100%; background: rgba(54, 57, 79, 0.5); border: 1px solid rgba(255, 255, 255, 0.15); box-sizing: border-box; padding:13px 16px; min-height:50px;
    font-style: normal; font-family: 'Adrianna Rg'; font-weight: 400; font-size: 16px; line-height: 22px; color: #FFFFFF;
    ::placeholder{color: #FFFFFF; opacity: 0.7;}
  }
  textarea{min-height:116px; resize:none;}
  select{-webkit-appearance: none; -moz-appearance: none; appearance: none; background:none; cursor:pointer;
    option{background: rgba(54, 57, 79, 1);}
  }
  &.mb-0{margin-bottom:0px;}
  .select-outer{position:relative; z-index:0; background: rgba(54, 57, 79, 0.5);}
`;

const CustomHTabs = styled.div`
  margin-bottom:32px;
  .react-tabs__tab-list{ display:flex; align-items:center; justify-content:center; margin-bottom:0px; border-bottom:0px;
    .react-tabs__tab{width:33.33%; text-align:center; opacity:0.5; font-style: normal; font-weight: 700; font-size: 16px; line-height: 19px; color: #6BFCFC; min-height:67px;
      display:flex; align-items:center; justify-content:center; border: 1px solid #7BF5FB; box-sizing: border-box;
      &.react-tabs__tab--selected{background: linear-gradient(360deg, rgba(123, 245, 251, 0.44) -52.99%, rgba(123, 245, 251, 0) 100%); border-radius:0px; opacity:1;}
      :after{display:none;}
    }
  }
  .react-tabs__tab-panel{padding:32px 32px 40px; border: 1px solid #7BF5FB; box-sizing: border-box; border-radius: 2px; border-top-left-radius:0px; border-top-right-radius:0px; border-top:0px;
    ${Media.xs} {
      padding:32px 15px 40px;
    }
  }
  .tab-main{
    .tab-list{
      display:flex; align-items:center; justify-content:center; margin-bottom:0px; border-bottom:0px;
      button{
        width:33.33%; text-align:center; opacity:0.5; font-family: 'Rajdhani', sans-serif;  font-style: normal; font-weight: 700; font-size: 16px; line-height: 19px; color: #6BFCFC; min-height:67px;
        display:flex; align-items:center; justify-content:center; border: 1px solid #7BF5FB; box-sizing: border-box; background-color:transparent;
        &.active{background: linear-gradient(360deg, rgba(123, 245, 251, 0.44) -52.99%, rgba(123, 245, 251, 0) 100%); border-radius:0px; opacity:1;}
        :after{display:none;}
      }
    }
    .tab-panel{padding:32px 32px 40px; border: 1px solid #7BF5FB; box-sizing: border-box; border-radius: 2px; border-top-left-radius:0px; border-top-right-radius:0px; border-top:0px;
      ${Media.xs} {
        padding:32px 15px 40px;
      }
    }
  }
`;

const DArrow = styled.div`
  position:absolute; right:21px; top:15px; z-index:-1;
`;

const ValueOuter = styled(FlexDiv)`
  justify-content:flex-start; align-items:flex-start;
  .value-box{width:calc(70% - 24px); margin-right:24px;
    .input-box{
      width:100%; background: rgba(54, 57, 79, 0.5); border: 1px solid rgba(255, 255, 255, 0.15); box-sizing: border-box; padding:13px 16px; min-height:76px;
      font-style: normal; font-family: 'Adrianna Rg'; font-weight: 400; font-size: 16px; line-height: 24px; color: #FFFFFF;
    }
    ${Media.sm} {
      width:100%; margin-right:0px;
    }
  }
  .number-row{display:flex; align-items:center; width:30%;
    .number-box{
      input{min-height:76px; text-align:center;}
      ${Media.sm} {
        width:50%;
      }
    }
    ${Media.sm} {
      width:100%;
    }
  }
  p{margin:0px 18px; font-style: normal; font-weight: 500; font-size: 16px; line-height: 20px; color: #FFFFFF;}
  &.mb-0{margin-bottom:0px;}
  ${Media.sm} {
    display:block;
  }
`;

const BigInputOuter = styled.div`
  margin-bottom:25px;
  input{width:100%; background: rgba(54, 57, 79, 0.5); border: 1px solid rgba(255, 255, 255, 0.15); box-sizing: border-box; padding:24px; min-height:76px;
    font-style: normal; font-family: 'Adrianna Rg'; font-weight: 400; font-size: 17px; line-height: 24px; color: #FFFFFF;
    ::placeholder{color: #FFFFFF; opacity: 0.7;}
  }
  &.mb-50{margin-bottom:50px;}
  .big-input-box{
    width:100%; background: rgba(54, 57, 79, 0.5); border: 1px solid rgba(255, 255, 255, 0.15); box-sizing: border-box; padding:24px; min-height:76px;
    font-style: normal; font-family: 'Adrianna Rg'; font-weight: 400; font-size: 17px; line-height: 24px; color: #FFFFFF; display:flex; align-items:center;}
    .react-switch-bg{margin-right:12px !important;}
`;

const CustomSwitch = styled.div`
  .switch{ position: relative; width: 46px; height: 29px; margin-bottom:0px; margin-right:12px;
    span{opacity:1; margin-left:0px;}
  }
  .switch input{opacity: 0; width: 0; height: 0;}
  .slider{position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #585A7A; -webkit-transition: .4s; transition: .4s;}
  .slider:before{position: absolute; content: ""; height: 17px; width: 17px; left: 6px; bottom: 6px; background-color: #8485A7; -webkit-transition: .4s; transition: .4s;}
  input:checked + .slider { background: linear-gradient(263.59deg, #343FA1 0%, #6350BB 100%);}
  input:checked + .slider:before{ background-color:#7BF5FB;}
  input:focus + .slider { box-shadow:none;}
  input:checked + .slider:before{ -webkit-transform: translateX(17px); -ms-transform: translateX(17px); transform: translateX(17px);}
  .slider.round {border-radius: 56px;}
  .slider.round:before{ border-radius: 50%;}
`;

const Badges = styled(FlexDiv)`
  justify-content:space-between;
  ${Media.sm} {
    display:block;
  }
`;

const BadgeBox = styled.div`
  background: rgba(54,57,79,0.5); border: 1px solid rgba(255,255,255,0.15); padding: 10px 20px; text-align: center; margin-right:10px; min-width:100px;
  ${Media.sm} {
    min-width:initial;
  }
`;

const BadgeList = styled(FlexDiv)`
  justify-content:flex-start;
  ${Media.sm} {
    margin-bottom:40px;
  }
`;

const Value1 = styled.div`
  font-style: normal; font-family: 'Adrianna Rg'; font-weight: 400; font-size: 13px; text-transform:uppercase; line-height: 23px; color: rgba(255,255,255,0.9); letter-spacing:0.8px;
`;

const Value2 = styled.div`
  font-style: normal; font-family: 'Adrianna Rg'; font-weight: 400; font-size: 16px; line-height: 24px; color: rgba(255,255,255,0.5);
`;

export default connect(mapStateToProps, mapDipatchToProps)(CreateItem)