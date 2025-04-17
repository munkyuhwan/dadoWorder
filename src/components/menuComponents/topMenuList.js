import React, { useState, useEffect, useCallback } from 'react'
import { Animated, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { CategoryDefault, CategoryFixed, CategoryFixedText, CategorySelected, TopMenuText } from '../../styles/main/topMenuStyle';
import { colorBrown, tabBaseColor } from '../../assets/colors/color';
import { RADIUS_DOUBLE } from '../../styles/values';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedMainCategory, setSelectedSubCategory } from '../../store/categories';
import { useFocusEffect } from '@react-navigation/native';
import { DEFAULT_CATEGORY_ALL_CODE } from '../../resources/defaults';
import { setCommon } from '../../store/common';
import { openTransperentPopup } from '../../utils/common';
import { setCartView } from '../../store/cart';
import FastImage from 'react-native-fast-image';



const TopMenuList = (props) => {
    const dispatch = useDispatch();
    const TOP_MENU = [
        {idx:0, code:"menu", title_kor:"메뉴선택",title_en:"Menu",title_jp:"メニュ",title_cn:"菜单选择" },
        {idx:1, code:"help", title_kor:"직원도움",title_en:"Staff",title_jp:"スタッフ",title_cn:"员工帮助" },
        {idx:2, code:"orderList", title_kor:"주문내역",title_en:"Order List",title_jp:"注文履歴",title_cn:"订单记录" },
        {idx:3, code:"cart", title_kor:"주문메뉴",title_en:"Cart",title_jp:"カート",title_cn:"购物车" },
        {idx:4, code:"lang", title_kor:"언어선택",title_en:"Language" ,title_jp:"言語",title_cn:"语言选择"   },
        {idx:5, code:"howto", title_kor:"고기굽는법",title_en:"How to" ,title_jp:"肉の焼き方",title_cn:"烤肉的方法"   },
    ];
    const {tab} = useSelector(state=>state.common);
    const {language} = useSelector(state=>state.languages);
    const {isOn, isQuickOrder} = useSelector((state)=>state.cartView);

    const tabTitle = (el) =>{
        if(language == "korean") {
            return(el.title_kor)
        }else if(language == "japanese") {
            return(el.title_jp)
        }else if(language == "chinese") {
            return(el.title_cn)
        }else if(language == "english") {
            return(el.title_en)  
        }else {
            return(el.title_kor)
        }
    }

    function moveTab(el) {
        // 카트 닫기
        dispatch(setCartView(false)); 
        if(el.code=="howto") {
            console.log("howto");
            openTransperentPopup(dispatch, {innerView:"CameraView", isPopupVisible:true});
        }
        else if(el.code!="orderList" && el.code!="cart"){ 
            dispatch(setSelectedMainCategory("")); 
            dispatch(setCommon({"tab":el.code})); 
        }else {
            if(el.code == "orderList") {
                openTransperentPopup(dispatch, {innerView:"OrderList", isPopupVisible:true});
            }
            else if(el.code == "cart") {
                dispatch(setCartView(!isOn));
            }
        }
    }

    return (
            TOP_MENU.map((el) => {

                if(el.code == "lang" || el.code == "howto") {
                    return(
                        <>
                            {
                                <TouchableWithoutFeedback key={"subcat_"+el?.idx} onPress={()=>{moveTab(el)}}>
                                    <CategoryFixed>
                                        <FastImage source={el.code == "lang" ? require("../../assets/icons/lang_icon.png"):require("../../assets/icons/howto.png")} style={{width:23,height:23, marginLeft:'auto',marginRight:'auto',marginTop:10}} resizeMode={FastImage.resizeMode.contain} />
                                        <CategoryFixedText key={"subcatText_"+el?.idx} >{tabTitle(el)}</CategoryFixedText>
                                    </CategoryFixed>
                                </TouchableWithoutFeedback>
                            }
                        </>
                            
                    )
                }else {
                    return(
                        <>
                            {tab==el.code &&
                                <TouchableWithoutFeedback key={"subcat_"+el?.idx} onPress={()=>{moveTab(el)}}>
                                    <CategorySelected>
                                        <TopMenuText key={"subcatText_"+el?.idx} >{tabTitle(el)}</TopMenuText>
                                    </CategorySelected>
                                </TouchableWithoutFeedback>
                            }
                            {tab!=el.code &&
                                <TouchableWithoutFeedback key={"subcat_"+el?.idx} onPress={()=>{moveTab(el)}}>
                                    <CategoryDefault>
                                        <TopMenuText key={"subcatText_"+el?.idx} >{tabTitle(el)}</TopMenuText>
                                    </CategoryDefault>
                                </TouchableWithoutFeedback>
                            }
                        </>
                            
                    )
                }
            })
    )

}

export default TopMenuList