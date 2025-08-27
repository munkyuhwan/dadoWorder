import React, { useState, useEffect, useCallback } from 'react'
import { Animated, TouchableWithoutFeedback } from 'react-native';
import { CategoryDefault, CategorySelected, SubCategoryDefault, SubCategorySelected, TopMenuText } from '../../styles/main/subMenuStyle';
import { colorBlack, colorBrown, colorRed, colorWhite, tabBaseColor } from '../../assets/colors/color';
import { RADIUS_DOUBLE } from '../../styles/values';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedSubCategory } from '../../store/categories';
import { useFocusEffect } from '@react-navigation/native';
import { DEFAULT_CATEGORY_ALL_CODE } from '../../resources/defaults';


const SubMenuList = (props) => {
    const dispatch = useDispatch();
    const { selectedSubCategory, subCategories} = useSelector((state)=>state.categories);
    const {language} =  useSelector(state=>state.languages);
    const [selectedSubList, setSelectedSubList] = useState();

    const ItemTitle = (cateCode) => {
        const selectedData = selectedSubList.filter(el=>el.cate_code2 == cateCode);
        if(language=="korean") {
            return selectedData[0].cate_name2;
        }else if(language=="japanese") {
            return selectedData[0]?.cate_name2_jp||selectedData[0].cate_name2;
        }
        else if(language=="chinese") {
            return selectedData[0]?.cate_name2_cn||selectedData[0].cate_name2;
        }
        else if(language=="english") {
            return selectedData[0]?.cate_name2_en||selectedData[0].cate_name2;
        }
        return "";

    } 

    useEffect(()=>{
        setSelectedSubList(subCategories);
    },[subCategories])

    const onPressAction = (itemCD) =>{
        //dispatch(setSelectedSubCategory(itemCD)); 
        props.onSelectItem(itemCD);
    }

    return (
        <>
        {selectedSubList &&
        selectedSubList.map((el, index)=>{
            return(
                <>            
                        {
                        (el?.cate_code2==props.selectedSubCat) &&
                            <TouchableWithoutFeedback 
                                key={"subcat_"+el?.cate_code2} 
                                onPress={()=>{ onPressAction(el?.cate_code2); }}
                                onLayout={(e) => {
                                    //itemLayouts.current[el?.cate_code2] = e.nativeEvent.layout.x;
                                    props.subcatLayouts.current[el?.cate_code2] = e.nativeEvent.layout.x;
                                }}
        
                            >
                                <SubCategorySelected>
                                    <TopMenuText color={colorWhite} key={"subcatText_"+el?.cate_code2} >{ItemTitle(el?.cate_code2)}</TopMenuText>
                                </SubCategorySelected>
                            </TouchableWithoutFeedback>
                        }
                        {
                        (el?.cate_code2!=props.selectedSubCat) &&
                            <TouchableWithoutFeedback 
                                key={"subcat_"+el?.cate_code2} 
                                onPress={()=>{ onPressAction(el?.cate_code2); }}
                                onLayout={(e) => {
                                    //itemLayouts.current[el?.cate_code2] = e.nativeEvent.layout.x;
                                    props.subcatLayouts.current[el?.cate_code2] = e.nativeEvent.layout.x;

                                }}
                            >
                                <SubCategoryDefault>
                                    <TopMenuText color={colorBlack} key={"subcatText_"+el?.cate_code2} >{ItemTitle(el?.cate_code2)}</TopMenuText>
                                </SubCategoryDefault>
                            </TouchableWithoutFeedback>
                        }
                        
                </>
            )

        })}
        </>
    )


    return (
        <>
        {selectedSubList &&
        selectedSubList.map((el, index)=>{
            return(
                <>            
                        {
                        (el?.cate_code2==selectedSubCategory) &&
                            <TouchableWithoutFeedback key={"subcat_"+el?.cate_code2} onPress={()=>{ onPressAction(el?.cate_code2); }}>
                                <SubCategorySelected>
                                    <TopMenuText color={colorWhite} key={"subcatText_"+el?.cate_code2} >{ItemTitle(el?.cate_code2)}</TopMenuText>
                                </SubCategorySelected>
                            </TouchableWithoutFeedback>
                        }
                        {
                        (el?.cate_code2!=selectedSubCategory) &&
                            <TouchableWithoutFeedback key={"subcat_"+el?.cate_code2} onPress={()=>{ onPressAction(el?.cate_code2); }}>
                                <SubCategoryDefault>
                                    <TopMenuText color={colorBlack} key={"subcatText_"+el?.cate_code2} >{ItemTitle(el?.cate_code2)}</TopMenuText>
                                </SubCategoryDefault>
                            </TouchableWithoutFeedback>
                        }
                        
                </>
            )

        })}
        </>
    )

}

export default SubMenuList