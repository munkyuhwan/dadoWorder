import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Animated,FlatList,ScrollView,Text,TouchableWithoutFeedback, View } from 'react-native'
import { MenuListWrapper } from '../../styles/main/menuListStyle';
import MenuItem from '../mainComponents/menuItem';
import ItemDetail from '../detailComponents/itemDetail';
import { getMenu, updateMenu } from '../../store/menu';
import { widthAnimationStyle } from '../../utils/animation';
import { setSelectedMainCategory, setSelectedSubCategory } from '../../store/categories';
import { useSharedValue } from 'react-native-reanimated';
import { numberPad, openFullSizePopup, openPopup } from '../../utils/common';
import { DEFAULT_CATEGORY_ALL_CODE } from '../../resources/defaults';
import FloatingBtn from '../popups/floatingButtonPopup';
import { QuickOrderPopup } from '../popups/quickOrderPopup';
import { MenuSelectBg, MenuSelectCategory, MenuSelectCategoryIcon, MenuSelectCategorySubText, MenuSelectCategoryText, MenuSelectCategoryView, MenuSelectView } from '../../styles/main/mainStyle';
import SubMenu from './subMenu';

// 스크롤링 관련
var touchStartOffset = 0;
var touchEndOffset = 0;
var currentOffset = 0;
var scrollDownReached = false;
var scrollDownCnt = 0;
var scrollUpReached = false;
var scrollUpCnt = 0;
var isScrolling = false;
let direction = "";

const MenuListView = () => {

    const dispatch = useDispatch();
    const listRef = useRef();

    const {displayMenu} = useSelector((state)=>state.menu);
    const {isOn} = useSelector((state)=>state.cartView);
    const {language} = useSelector(state=>state.languages);

    const [numColumns, setNumColumns] = useState(3);
    const [vieweType, setViewType] = useState(3);
    const [isDetailShow, setDetailShow] = useState(false);

    // 선택 카테고리
    const {mainCategories, selectedMainCategory, selectedSubCategory, allCategories} = useSelector((state)=>state.categories);
   
    useEffect(()=>{
        if(isOn) {
            setNumColumns(vieweType-1);
            //setNumColumns(vieweType);
        }else {
            setNumColumns(vieweType);
        } 
    },[isOn])
    useEffect(()=>{
        const catData = allCategories.filter(el=>el.cate_code1 == selectedMainCategory);
        if(catData.length>0) {
            setNumColumns(Number(catData[0].view_type));
            setViewType(Number(catData[0].view_type));
        }
    },[selectedMainCategory])

    useEffect(()=>{
        if(displayMenu.length>0) {
            //listRef?.current?.scrollTo({x:0,animated: false});
            //if(listRef)listRef?.current?.scrollTo({y:0,animated: false});
            if(listRef.current != undefined){
                listRef.current.scrollToOffset({ animated: false, offset: 0 });
            }
        }
    },[displayMenu])

    var index=0;

    //console.log("mainCategories: ",mainCategories[0].ITEM_GR`OUP_CODE)
    if(selectedMainCategory == "") {
        return(
            <>
                <MenuSelectView>
                    <MenuSelectBg source={require("../../assets/icons/daedo_bg.png")} resizeMethod={"contain"} />
                    <MenuSelectCategoryView style={{paddingTop:50}} >
                        <TouchableWithoutFeedback onPress={()=>{console.log("meat"); dispatch(setSelectedMainCategory("meat"));}}>
                            <MenuSelectCategory>
                                <MenuSelectCategoryIcon source={require('../../assets/icons/meat.png')} resizeMode={"contain"} />
                                <MenuSelectCategoryText>고기</MenuSelectCategoryText>
                            </MenuSelectCategory>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>{console.log("meal");dispatch(setSelectedMainCategory("meal"));}}>
                            <MenuSelectCategory>
                                <MenuSelectCategoryIcon source={require('../../assets/icons/meal.png')} resizeMode={"contain"} />
                                <MenuSelectCategoryText>식사</MenuSelectCategoryText>
                                <MenuSelectCategorySubText>(등심 드신 후)</MenuSelectCategorySubText>
                            </MenuSelectCategory>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>{console.log("lunch");dispatch(setSelectedMainCategory("lunch"));}}>
                            <MenuSelectCategory>
                                <MenuSelectCategoryIcon source={require('../../assets/icons/lunch.png')} resizeMode={"contain"} />
                                <MenuSelectCategoryText>점심 식사</MenuSelectCategoryText>
                            </MenuSelectCategory>
                        </TouchableWithoutFeedback>
                    </MenuSelectCategoryView>
                    <MenuSelectCategoryView style={{paddingBottom:50}} >
                        <TouchableWithoutFeedback onPress={()=>{console.log("extra");dispatch(setSelectedMainCategory("extra"));}}>
                            <MenuSelectCategory>
                                <MenuSelectCategoryIcon source={require('../../assets/icons/extra.png')} resizeMode={"contain"} />
                                <MenuSelectCategoryText>추가메뉴</MenuSelectCategoryText>
                            </MenuSelectCategory>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>{console.log("liquor");dispatch(setSelectedMainCategory("liquor"));}}>
                            <MenuSelectCategory>
                                <MenuSelectCategoryIcon source={require('../../assets/icons/liquor.png')} resizeMode={"contain"} />
                                <MenuSelectCategoryText>주류</MenuSelectCategoryText>
                            </MenuSelectCategory>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>{console.log("drink");dispatch(setSelectedMainCategory("drink"));}}>
                            <MenuSelectCategory>
                                <MenuSelectCategoryIcon source={require('../../assets/icons/drinks.png')} resizeMode={"contain"} />
                                <MenuSelectCategoryText>음료</MenuSelectCategoryText>
                            </MenuSelectCategory>
                        </TouchableWithoutFeedback>
                    </MenuSelectCategoryView>
                </MenuSelectView>
            </>
        )
    }  
    if(selectedMainCategory!= "") {
        //if(selectedMainCategory == "liquor") {
            return(
                <>
                    <SubMenu/>
                    <MenuListWrapper viewType={vieweType} >
                        {(displayMenu?.length > 0 && !isOn && numColumns>=2)&&
                            <FlatList
                                ref={listRef}
                                columnWrapperStyle={{gap:24}}
                                style={{height:'100%', width:'100%', zIndex: 99,  }}
                                data={displayMenu}
                                renderItem={({item, index})=>{ return(<MenuItem viewType={vieweType} isDetailShow={isDetailShow} setDetailShow={setDetailShow} item={item} index={index} /> );}}
                                numColumns={numColumns==4?2:numColumns}
                                key={numColumns}
                                keyExtractor={(item,index)=>index}
                                onTouchStart={(event)=>{
                                    touchStartOffset = event.nativeEvent.pageY;
                                }}
                            />
                        }
                        {(displayMenu?.length > 0 && isOn && numColumns<2 ) &&
                            <ScrollView style={{width:'100%'}}>
                                <View>
                                    {
                                    displayMenu.map((el)=>{
                                        console.log("el: ",el);
                                        index++;
                                        return(
                                            <>
                                                <MenuItem viewType={vieweType} isDetailShow={isDetailShow} setDetailShow={setDetailShow} item={el} index={index} />
                                            
                                            </>
                                        )
                                    })
                                    }
                                </View>
                            </ScrollView>
                            
                        }
                    </MenuListWrapper>
                    </>
                );
    }

    
}

export default MenuListView;
