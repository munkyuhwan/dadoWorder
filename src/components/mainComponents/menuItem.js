import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Animated,Dimensions,FlatList,Image,Text,TouchableWithoutFeedback } from 'react-native'
import { BigMenuItemBottomWrapper, BigMenuItemName, BigMenuItemPrice, MenuImageDefault, MenuImageDefaultWrapper, MenuItemBottomWRapper, MenuItemButton, MenuItemButtonInnerWrapper, MenuItemButtonInnerWrapperLeft, MenuItemButtonInnerWrapperRight, MenuItemButtonWrapper, MenuItemHotness, MenuItemHotnessWrapper, MenuItemImage, MenuItemImageWrapper, MenuItemInfoWRapper, MenuItemName, MenuItemPrice, MenuItemSpiciness, MenuItemTopWrapper, MenuItemWrapper, SoldOutDimLayer, SoldOutDimLayerAbs, SoldOutLayer, SoldOutText } from '../../styles/main/menuListStyle';
import FastImage from 'react-native-fast-image';
import { RADIUS, RADIUS_DOUBLE } from '../../styles/values';
import { setItemDetail } from '../../store/menuDetail';
import { addToOrderList } from '../../store/order';
import { MENU_DATA } from '../../resources/menuData';
import { colorWhite } from '../../assets/colors/color';
import {isEmpty} from 'lodash'
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import { isAvailable, numberWithCommas } from '../../utils/common';
import { styled } from 'styled-components';
import { ADMIN_API_BASE_URL } from '../../resources/newApiResource';
import moment from 'moment';
import { current } from '@reduxjs/toolkit';
import { useFocusEffect } from '@react-navigation/native';
import { DEFAULT_TABLE_STATUS_UPDATE_TIME } from '../../resources/defaults';
import AutoScroll from "@homielab/react-native-auto-scroll";
import { LANGUAGE } from '../../resources/strings';

const height = Dimensions.get('window').height;
let timeoutSet = null;

/* 메인메뉴 메뉴 아이템 */
const MenuItem = ({item,index,setDetailShow,viewType,onPress,setItemDetailCD,onLayout,tmpSubCat}) => {
    //<MenuItemImage />    
    // 포스 api ITEM_ID 는 관리자 api에서 pos_code임
    const dispatch = useDispatch();
    const {language} =  useSelector(state=>state.languages);
    const {images} = useSelector(state=>state.imageStorage);
    const filteredImg = images.filter(el=>el.name==item.prod_cd);
    if(isEmpty(item)) {
        return <></>
    }
  
    const itemID = item.prod_cd;
    //console.log("item extra: ",itemExtra[0]);
    const imgUrl = item?.gimg_chg;
    //const itemTitle=>{} item.ITEM_NAME;
    const itemTitle = () => {
        let selTitleLanguage = "";
            if(language=="korean") {
                selTitleLanguage = item?.gname_kr;
            }
            else if(language=="japanese") {
                selTitleLanguage = item?.gname_jp;
            }
            else if(language=="chinese") {
                selTitleLanguage = item?.gname_cn;
            }
            else if(language=="english") {
                selTitleLanguage = item?.gname_en;
            }
        
        return selTitleLanguage;
    }
    const itemPrice= Number(item.sal_tot_amt);

    const [reload, setReload] = useState("0");
    useEffect(()=>{
        timeoutSet = setInterval(() => {
            setReload(reload=="1"?"0":"1");
        }, DEFAULT_TABLE_STATUS_UPDATE_TIME);

        //FastImage.preload([{uri:item?.gimg_chg}]);
    },[])

    const MyImageItem = React.memo(({ uri }) => (
        <FastImage 
            style={{ width:'100%',height: 390, borderTopLeftRadius:RADIUS_DOUBLE,borderTopRightRadius:RADIUS_DOUBLE,}} 
            source={{
                uri:uri,priority: FastImage.priority.normal,
                cache: FastImage.cacheControl.immutable,
            }} 
            resizeMode={FastImage.resizeMode.cover} 
        />
    ));

    return(
        <>
        {
        <TouchableWithoutFeedback onPress={()=>{ if(item?.prod_gb=="09"||item?.prod_gb=="02"){onPress(false); setDetailShow(true);  dispatch(setItemDetail({itemID}));} else { dispatch(addToOrderList({isAdd:true, isDelete: false, item:item,menuOptionSelected:[]}));} /* setDetailShow(true); dispatch(setItemDetail({itemID})); */ }} >
            <MenuItemWrapper viewType={viewType} >
                <MenuItemTopWrapper>
                        {language == "korean" &&
                            <TouchableWithoutFeedback onPress={()=>{
                                //onPress(true); setDetailShow(true); 
                                setItemDetailCD(itemID);
                                //dispatch(setItemDetail({itemID}));
                                }} >
                                <FastImage source={require("../../assets/icons/toDetail.png")} resizeMode='contain' style={{width:70, height:70, position:'absolute', zIndex:999999, right:10, top:10 }} />                        
                            </TouchableWithoutFeedback>
                        }
                        {language == "japanese" &&
                            <TouchableWithoutFeedback onPress={()=>{
                                //onPress(true); setDetailShow(true); 
                                setItemDetailCD(itemID);
                                //dispatch(setItemDetail({itemID}));
                                }} >
                                <FastImage source={require("../../assets/icons/toDetail_jp.png")} resizeMode='contain' style={{width:70, height:70, position:'absolute', zIndex:999999, right:10, top:10 }} />                        
                            </TouchableWithoutFeedback>
                        }
                        {language == "chinese" &&
                            <TouchableWithoutFeedback onPress={()=>{
                                //onPress(true); setDetailShow(true); 
                                setItemDetailCD(itemID);
                                //dispatch(setItemDetail({itemID}));
                                }} >
                                <FastImage source={require("../../assets/icons/toDetail_cn.png")} resizeMode='contain' style={{width:70, height:70, position:'absolute', zIndex:999999, right:10, top:10 }} />                        
                            </TouchableWithoutFeedback>
                        }
                        {language == "english" &&
                            <TouchableWithoutFeedback onPress={()=>{
                                //onPress(true); setDetailShow(true); 
                                setItemDetailCD(itemID);
                                //dispatch(setItemDetail({itemID})); 
                                }} >
                                <FastImage source={require("../../assets/icons/toDetail_en.png")} resizeMode='contain' style={{width:70, height:70, position:'absolute', zIndex:999999, right:10, top:10 }} />                        
                            </TouchableWithoutFeedback>
                        }
                    
                    {imgUrl &&
                        <>
                            <MyImageItem 
                                uri = {item?.gimg_chg}
                            />
                        </>
                    }
                    {!imgUrl &&
                            <FastImage style={{ width:'100%',height:viewType==2?500:(viewType==3?230:280), borderRadius:RADIUS_DOUBLE}} source={require("../../assets/icons/logo.png")} resizeMode={FastImage.resizeMode.cover} />
                    }
                    {
                    <MenuItemBottomWRapper>
                        <MenuItemName>{itemTitle()||item?.gname_kr}</MenuItemName>
                        <MenuItemPrice>{numberWithCommas(itemPrice)}{LANGUAGE[language]?.cartView.totalAmtUnit}</MenuItemPrice>
                    </MenuItemBottomWRapper>
                    }
                    <MenuItemImageWrapper>
                        <MenuItemHotnessWrapper>
                        
                        </MenuItemHotnessWrapper>
                        <MenuItemButtonWrapper>
                            {
                                item.spicy == "1" &&
                                <MenuItemButtonInnerWrapperRight>
                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_1.png')}/>
                                </MenuItemButtonInnerWrapperRight>
                            }
                            {
                                item.spicy == "1.5" &&
                                <MenuItemButtonInnerWrapperRight>
                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_2.png')}/>
                                </MenuItemButtonInnerWrapperRight>
                            }
                            {
                                item.spicy == "2" &&
                                <MenuItemButtonInnerWrapperRight>
                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_3.png')}/>
                                </MenuItemButtonInnerWrapperRight>
                            }
                            {
                                item.spicy == "2.5" &&
                                <MenuItemButtonInnerWrapperRight>
                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_4.png')}/>
                                </MenuItemButtonInnerWrapperRight>
                            }
                            {
                                item.spicy == "3" &&
                                <MenuItemButtonInnerWrapperRight>
                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_5.png')}/>
                                </MenuItemButtonInnerWrapperRight>
                            }
                            {
                                item.temp == "HOT" &&
                                <MenuItemButtonInnerWrapperRight>
                                    <MenuItemSpiciness source={require('../../assets/icons/hot_icon.png')}/>
                                </MenuItemButtonInnerWrapperRight>
                            }
                            {
                                item.temp == "COLD" &&
                                <MenuItemButtonInnerWrapperRight>
                                    <MenuItemSpiciness source={require('../../assets/icons/cold_icon.png')}/>
                                </MenuItemButtonInnerWrapperRight>
                            }
                            {item?.is_new=='Y'&&
                                <MenuItemHotness source={require('../../assets/icons/new_menu.png')} />
                            }
                            {item?.is_best=='Y'&&
                                <MenuItemHotness source={require('../../assets/icons/best_menu.png')} />
                            }
                            {item?.is_on=='Y'&&
                                <MenuItemHotness source={require('../../assets/icons/hot_menu.png')} />
                            } 
                        </MenuItemButtonWrapper>
                    </MenuItemImageWrapper>
                    {item?.sale_status=='3'&&// 1:대기, 2: 판매, 3: 매진
                        <SoldOutLayer style={{ width:'100%',height:height*0.28, borderRadius:RADIUS_DOUBLE}}>
                            <SoldOutText>SOLD OUT</SoldOutText>    
                            <SoldOutDimLayer style={{ width:'100%',height:height*0.28, borderRadius:RADIUS_DOUBLE}}/>
                        </SoldOutLayer>
                    }
                    {(item?.sale_status!='3'&&!isAvailable(item)) &&
                        <SoldOutLayer style={{ width:'100%',height:height*0.28, borderRadius:RADIUS_DOUBLE}}>
                            <SoldOutText>준비중</SoldOutText>    
                            <SoldOutDimLayer style={{ width:'100%',height:height*0.28, borderRadius:RADIUS_DOUBLE}}/>
                        </SoldOutLayer>
                    }
 
                </MenuItemTopWrapper>
            </MenuItemWrapper>
        </TouchableWithoutFeedback>
        }
        </>
    );
}


export default MenuItem;
