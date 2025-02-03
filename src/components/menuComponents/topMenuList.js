import React, { useState, useEffect, useCallback } from 'react'
import { Animated, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { CategoryDefault, CategorySelected, TopMenuText } from '../../styles/main/topMenuStyle';
import { colorBrown, tabBaseColor } from '../../assets/colors/color';
import { RADIUS_DOUBLE } from '../../styles/values';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedSubCategory } from '../../store/categories';
import { useFocusEffect } from '@react-navigation/native';
import { DEFAULT_CATEGORY_ALL_CODE } from '../../resources/defaults';
import { setCommon } from '../../store/common';



const TopMenuList = (props) => {
    const dispatch = useDispatch();
    const TOP_MENU = [
        {idx:0, code:"lang", title_kor:"언어선택",},
        {idx:1, code:"menu", title_kor:"메뉴선택",},
        {idx:2, code:"help", title_kor:"직원도움",},
        {idx:3, code:"orderList", title_kor:"주문내역",},
        {idx:4, code:"cart", title_kor:"장바구니",},
    ];
    const {tab} = useSelector(state=>state.common);
    return (
            TOP_MENU.map((el) => {
                return(
                    <>
                        {tab==el.code &&
                            <TouchableWithoutFeedback key={"subcat_"+el?.idx} onPress={()=>{dispatch(setCommon({"tab":el.code})); }}>
                                <CategorySelected>
                                    <TopMenuText key={"subcatText_"+el?.idx} >{el?.title_kor}</TopMenuText>
                                </CategorySelected>
                            </TouchableWithoutFeedback>
                        }
                        {tab!=el.code &&
                            <TouchableWithoutFeedback key={"subcat_"+el?.idx} onPress={()=>{dispatch(setCommon({"tab":el.code}));}}>
                                <CategoryDefault>
                                    <TopMenuText key={"subcatText_"+el?.idx} >{el?.title_kor}</TopMenuText>
                                </CategoryDefault>
                            </TouchableWithoutFeedback>
                        }
                    </>
                        
                )
            })
    )

}

export default TopMenuList