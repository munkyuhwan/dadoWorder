import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { BottomButton, BottomButtonIcon, BottomButtonText, BottomButtonWrapper, ButtonWrapper, CloseBtnText, CloseBtnView, CloseBtnWrapper, DetailInfoWrapper, DetailInfoWrapperBig, DetailItemInfoFastImage, DetailItemInfoFastImageBig, DetailItemInfoImage, DetailItemInfoImageWrapper, DetailItemInfoImageWrapperBig, DetailItemInfoMore, DetailItemInfoMoreBig, DetailItemInfoPrice, DetailItemInfoPriceWrapper, DetailItemInfoSource, DetailItemInfoTitle, DetailItemInfoTitleBig, DetailItemInfoTitleEtc, DetailItemInfoTitleWrapper, DetailItemInfoTitleWrapperBig, DetailItemInfoWrapper, DetailPriceMoreWrapper, DetailWhiteWrapper, DetailWhiteWrapperBig, DetailWrapper, DetailWrapperBig, MenuImageDefaultBig, OptList, OptListWrapper, OptRecommendWrapper, OptTitleText } from '../../styles/main/detailStyle';
import { ActivityIndicator, Animated, Dimensions, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { colorBlack, colorLightRed, colorRed } from '../../assets/colors/color';
import { LANGUAGE } from '../../resources/strings';
import OptItem from './optItem';
import CommonIndicator from '../common/waitIndicator';
import WaitIndicator from '../common/waitIndicator';
import RecommendItem from './recommendItem';
import { initMenuDetail } from '../../store/menuDetail';
import { isAvailable, numberWithCommas, openPopup } from '../../utils/common';
import { MENU_DATA } from '../../resources/menuData';
import { addToOrderList } from '../../store/order';
import { MenuImageDefault, MenuItemButtonInnerWrapperRight, MenuItemDetailSpicenessWrapper, MenuItemSpiciness, SoldOutDimLayer, SoldOutDimLayerBig, SoldOutLayer, SoldOutLayerBig, SoldOutText } from '../../styles/main/menuListStyle';
import { useFocusEffect } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { RADIUS, RADIUS_DOUBLE, RADIUS_SMALL_DOUBLE } from '../../styles/values';
import {isEmpty} from "lodash";
import { posErrorHandler } from '../../utils/errorHandler/ErrorHandler';
const height = Dimensions.get('window').height;

/* 메뉴 상세 */
const ItemDetailBig = (props) => {
    const language = props.language;
    const isDetailShow = props.isDetailShow;
    const dispatch = useDispatch();
    const {allItems} = useSelector((state)=>state.menu);
    const {menuDetailID} = useSelector((state)=>state.menuDetail);
    const [detailZIndex, setDetailZIndex] = useState(0);
    const [menuDetail, setMenuDetail] = useState(null);

    const [optSelected, setOptSelected] = useState([]);

    // animation set
    const [widthAnimation, setWidthAnimation] = useState(new Animated.Value(0));
    // width interpolation
    const animatedWidthScale = widthAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0,1],
    });
    const animatedWidthTranslate = widthAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0,30],
    });
    
    // height interpolation 
    const animatedHeightScale = widthAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0,1],
    });
    const animatedHeightTranslate = widthAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0,1],
    })

    const boxWidthStyle = {
        transform: [
            {scaleX:animatedWidthScale},
            {translateX:animatedWidthTranslate},
            {scaleY:animatedHeightScale}, 
            {translateY:animatedHeightTranslate}], 
        
    };
    const onSelectHandleAnimation = async (popOpen) => {
        Animated.timing(widthAnimation, {
            toValue:popOpen,
            duration: 150,
            useNativeDriver:true,
        }).start(()=>{             
            if(!isDetailShow) {
                setDetailZIndex(0)
            }
        }) 
    }
    
    useEffect(()=>{
        const filteredItem = allItems.filter(data => data.prod_cd == menuDetailID);
        if(filteredItem.length > 0) {
            setMenuDetail(filteredItem[0]);
        }
    },[menuDetailID])

    
    const onOptionSelect = ( isAdd, optGroup, optItem) =>{     
        // 선택한 옵션
        var selectedOpt = {optGroup:optGroup?.idx, optItem:optItem.prod_cd, qty:1};
        // 추가 전 옵션 리스트
        var currentOpt = Object.assign([],optSelected);

        // 기존 옵션이 있는지 체크
        const filterOpt = currentOpt.filter(el=>el.optGroup == optGroup?.idx&&el.optItem == optItem.prod_cd);
        // 선택된 옵션이랑 다른 옵션만 담기
        const expendedOpt = currentOpt.filter(el=>el.optGroup != optGroup?.idx||el.optItem != optItem.prod_cd);

        // 옵션 그룹의 선택 한도 수량 체크
        const groupOptCheck = currentOpt.filter(el=>el.optGroup == optGroup?.idx);
        // * 옵션 선택 가능 수량 체크
        const groupLimitCnt = optGroup?.limit_count;
        if(groupLimitCnt > 0) {
            // if count equals to 0 it's unlimited select count
            // check the current quantity
            var groupOptCnt = 0;
            for(var i=0;i<groupOptCheck.length;i++) {
                //console.log("groupOptCheck:",groupOptCheck[i]);
                groupOptCnt = groupOptCnt+groupOptCheck[i].qty
            }  
            if(isAdd) {
                //추가할 때만 수량 넘어가면 얼럿
                if(groupOptCnt >= groupLimitCnt) {
                    posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:`옵션 필수 수량을 확인 해 주세요.`,MSG2:""})        
                    return
                }
            }
        }
        if(filterOpt.length > 0) {
            // 추가된 옵션에 수량만 올리기
            if(isAdd) {
                // 추가 
                selectedOpt['qty'] = Number(filterOpt[0]['qty'])+1;
            }else {
                // 빼기
                selectedOpt['qty'] = Number(filterOpt[0]['qty'])-1;
            }
            if(selectedOpt['qty']>0) {
                expendedOpt.push(selectedOpt);
            }
            currentOpt = expendedOpt;

        }else {
            // 새로 추가 
            currentOpt.push(selectedOpt)
        }
        currentOpt = currentOpt.slice().sort((a, b) => b.optItem - a.optItem);

        setOptSelected(currentOpt);
    }
    const addToCart = () => {
        const optGroups = menuDetail?.option;
        // 옵션 수량 체크
        var isPass = true;
        for(var i=0;i<optGroups.length;i++) {
            const optFil = optSelected.filter(el=>el.optGroup == optGroups[i].idx);
            var groupQty = 0;
            if(optFil.length>0) {
                for(var j=0;j<optFil.length;j++) {
                    // 옵션 선택 수량 총 합
                    groupQty = groupQty + Number(optFil[j].qty);
                }
                // 수량 계산 합한게 리미트랑 비교
                var limitCnt = Number(optGroups[i].limit_count);
                if(limitCnt > 0) {
                    // 0은 무제한이라 체크 안함
                    if(limitCnt > groupQty) {
                        // 최소 수량보다 작으면 안지나감.
                        isPass = false;
                    }
                }
            }else {
                // 선택한 옵션이 없을 떄
                // 그룹 리미트 카운트
                var limitCnt = Number(optGroups[i].limit_count);
                if(limitCnt > 0) {
                    // 무한 선택이 아니다
                    // 무한선택이 아닌데 옵션에 안담기면 엄기지 않는다.
                    //if(optSelected.length<=0) {
                        // 1. 선택한 옵션이 하나도 없으면 통과 안시킴
                        isPass = false;
                    //}
                }else {                    


                }

                
            }
        }         
        if(!isPass) {
            posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:`옵션 필수 수량을 확인 해 주세요.`,MSG2:""})
        }else {
            // 주문 하기
            dispatch(addToOrderList({isAdd:true, isDelete: false, item:menuDetail,menuOptionSelected:optSelected}));
            closeDetail();
        }
        
    }

    const closeDetail = () =>{
        //props.setDetailShow(false); 
        //dispatch(setMenuDetail(null)); 
        init();
    }

    const init = () => {
        setMenuDetail(null)
        dispatch(initMenuDetail());
    }

    useEffect(()=>{
        if(isDetailShow) {
            setDetailZIndex(999)
            onSelectHandleAnimation(1);
        }
    },[isDetailShow])
//console.log("menu: ",menu[0].ITEM_LIST);
    const ItemTitle = () =>{
        let selTitleLanguage = "";
            if(language=="korean") {
                selTitleLanguage = menuDetail?.gname_kr;
            }
            else if(language=="japanese") {
                selTitleLanguage = menuDetail?.gname_jp;
            }
            else if(language=="chinese") {
                selTitleLanguage = menuDetail?.gname_cn;
            }
            else if(language=="english") {
                selTitleLanguage = menuDetail?.gname_en;
            }else {
                selTitleLanguage = menuDetail?.gname_kr
            }
       
        return selTitleLanguage;
    }
    const ItemInfo = () =>{
        let selInfoLanguage = "";
            if(language=="korean") {
                selInfoLanguage = menuDetail?.gmemo;
            }
            else if(language=="japanese") {
                selInfoLanguage = menuDetail?.gmemo_jp||menuDetail?.gmemo;
            }
            else if(language=="chinese") {
                selInfoLanguage = menuDetail?.gmemo_cn||menuDetail?.gmemo;
            }
            else if(language=="english") {
                selInfoLanguage = menuDetail?.gmemo_en||menuDetail?.gmemo;
            }
       
        return selInfoLanguage;
    }
    const ItemWonsanji = () => {
        let selWonsanjiLanguage = "";
        
            if(language=="korean") {
                selWonsanjiLanguage = menuDetail?.wonsanji;
            }
            else if(language=="japanese") {
                selWonsanjiLanguage = menuDetail?.wonsanji_jp||menuDetail?.wonsanji;
            }
            else if(language=="chinese") {
                selWonsanjiLanguage = menuDetail?.wonsanji_cn||menuDetail?.wonsanji;
            }
            else if(language=="english") {
                selWonsanjiLanguage = menuDetail?.wonsanji_en||menuDetail?.wonsanji;
            }
       
        return selWonsanjiLanguage;
    }

    if(menuDetailID==null) {
        return(<></>)
    }

    if(isEmpty(menuDetail)) {
        return(<></>)
    }

    return(
        <>
            <Animated.View  style={[{...PopStyle.animatedPop, ...boxWidthStyle,...{zIndex:detailZIndex} } ]} >
                    <DetailWrapperBig onTouchStart={()=>{closeDetail(); props?.onDetailTouchStart(); }}>
                        <TouchableWithoutFeedback onPress={()=>{closeDetail();}}>
                            <View style={{backgroundColor:'rgba(0,0,0,0.7)', position:'absolute',width:'100%',height:'100%' }} >

                            </View>
                        </TouchableWithoutFeedback>
                        <DetailWhiteWrapperBig>
                            {menuDetailID==null &&
                                <WaitIndicator/>
                            }
                            {menuDetailID!=null &&
                            <>
                            {menuDetailID!=null &&
                                <DetailInfoWrapperBig>
                                    <DetailItemInfoImageWrapperBig>
                                        {menuDetail&& 
                                            menuDetail?.gimg_chg &&
                                            <DetailItemInfoFastImageBig  source={ {uri:(`${menuDetail?.gimg_chg}`),priority: FastImage.priority.high } } resizeMethod="contain" />
                                        }
                                        {menuDetail&&
                                            !menuDetail?.gimg_chg &&
                                            <MenuImageDefaultBig source={require("../../assets/icons/logo.png")} />
                                        }   
                                        {menuDetail?.sale_status=='3'&&// 1:대기, 2: 판매, 3: 매진
                                            <SoldOutLayerBig style={{ borderRadius:RADIUS_DOUBLE}}>
                                                <SoldOutText>SOLD OUT</SoldOutText>    
                                                <SoldOutDimLayerBig style={{ borderTopRightRadius:RADIUS_DOUBLE,borderTopLeftRadius:RADIUS_DOUBLE}}/>
                                            </SoldOutLayerBig>
                                        }
                                        {(menuDetail?.sale_status!='3'&&!isAvailable(menuDetail)) &&
                                            <SoldOutLayerBig style={{ borderTopRightRadius:RADIUS_DOUBLE,borderTopLeftRadius:RADIUS_DOUBLE}}>
                                                <SoldOutText>준비중</SoldOutText>    
                                                <SoldOutDimLayerBig style={{ borderRadius:RADIUS_DOUBLE}}/>
                                            </SoldOutLayerBig>
                                        }
                                        <View style={{width:'100%', position:'absolute', flexDirection:'row',top:20,left:10}}>
                                        {menuDetail&&
                                                menuDetail?.is_new=='Y'&&
                                                 <DetailItemInfoTitleEtc source={require("../../assets/icons/new_menu.png")}/>
                                            }
                                            {menuDetail&&
                                                menuDetail?.is_best=='Y'&&
                                                <DetailItemInfoTitleEtc source={require("../../assets/icons/best_menu.png")}/>
                                            }
                                            {menuDetail&&
                                                menuDetail?.is_on=='Y'&&
                                                <DetailItemInfoTitleEtc source={require("../../assets/icons/hot_menu.png")}/>
                                            }
                                            {
                                                menuDetail?.spicy == "1" &&
                                                <MenuItemButtonInnerWrapperRight>
                                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_1.png')}/>
                                                </MenuItemButtonInnerWrapperRight>
                                            }
                                            {
                                                menuDetail?.spicy == "1.5" &&
                                                <MenuItemDetailSpicenessWrapper>
                                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_2.png')}/>
                                                </MenuItemDetailSpicenessWrapper>
                                            }
                                            {
                                                menuDetail?.spicy == "2" &&
                                                <MenuItemDetailSpicenessWrapper>
                                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_3.png')}/>
                                                </MenuItemDetailSpicenessWrapper>
                                            }
                                            {
                                                menuDetail?.spicy == "2.5" &&
                                                <MenuItemDetailSpicenessWrapper>
                                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_4.png')}/>
                                                </MenuItemDetailSpicenessWrapper>
                                            }
                                            {
                                                menuDetail?.spicy == "3" &&
                                                <MenuItemDetailSpicenessWrapper>
                                                    <MenuItemSpiciness source={require('../../assets/icons/spicy_5.png')}/>
                                                </MenuItemDetailSpicenessWrapper>
                                            }
                                            {
                                                menuDetail?.temp == "COLD"  &&
                                                <MenuItemDetailSpicenessWrapper>
                                                    <MenuItemSpiciness source={require('../../assets/icons/cold_icon.png')}/>
                                                </MenuItemDetailSpicenessWrapper>
                                            }
                                            {
                                                menuDetail?.temp == "HOT"  &&
                                                <MenuItemDetailSpicenessWrapper>
                                                    <MenuItemSpiciness source={require('../../assets/icons/hot_icon.png')}/>
                                                </MenuItemDetailSpicenessWrapper>
                                            }
                                        </View>

                                    </DetailItemInfoImageWrapperBig>
                                    <DetailItemInfoWrapper paddingTop={"80"} >
                                        <DetailItemInfoTitleWrapperBig>
                                            <DetailItemInfoTitleBig>{ItemTitle()||menuDetail?.gname_kr}</DetailItemInfoTitleBig>
                                            <DetailItemInfoMoreBig>{ItemInfo()}</DetailItemInfoMoreBig>
                                            <CloseBtnWrapper>
                                                <TouchableWithoutFeedback onPress={()=>{closeDetail();}} >
                                                    <CloseBtnView>
                                                        <CloseBtnText>클릭하면 창이 사라집니다.</CloseBtnText>
                                                    </CloseBtnView>
                                                </TouchableWithoutFeedback>
                                            </CloseBtnWrapper>
                                            
                                        </DetailItemInfoTitleWrapperBig>
                                        
                                    </DetailItemInfoWrapper>
                                </DetailInfoWrapperBig>
                            }
                            
                            
                          
                            </>
                            }
                        </DetailWhiteWrapperBig>
                    </DetailWrapperBig>
            </Animated.View>
        </>
    )  
}

const PopStyle = StyleSheet.create({
    animatedPop:{
        position:'absolute', 
        width:'100%',
        height:'100%',
        paddingTop:0,
        paddingLeft:0,
        left:-30,
        zIndex:99999,
     }

})

export default ItemDetailBig;