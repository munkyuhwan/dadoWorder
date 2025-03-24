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
import { MenuSelectBg, MenuSelectCategory, MenuSelectCategoryDim, MenuSelectCategoryIcon, MenuSelectCategorySubText, MenuSelectCategoryText, MenuSelectCategoryView, MenuSelectView } from '../../styles/main/mainStyle';
import SubMenu from './subMenu';
import { TransparentPopupBottomButtonIcon, TransparentPopupBottomButtonText, TransparentPopupBottomButtonWraper, TransparentPopupBottomInnerWrapper, TransparentPopupBottomWrapper } from '../../styles/common/popup';
import { LANGUAGE } from '../../resources/strings';
import { colorDarkGrey, colorLightBrown, colorRed } from '../../assets/colors/color';
import { setCartView } from '../../store/cart';

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
    const [viewType, setViewType] = useState(3);
    const [isDetailShow, setDetailShow] = useState(false);
    const [listWidth,setListWidth] = useState("100%");
    const [gap,setGap] = useState(20);

    // 선택 카테고리
    const {mainCategories, selectedMainCategory, subCategories, selectedSubCategory, allCategories} = useSelector((state)=>state.categories);
   
    useEffect(()=>{
        if(isOn) {
            setNumColumns(viewType-1);
            if(viewType == 2) {
                setListWidth("82%");
            }if(viewType == 3) {
                setListWidth("60%");
            }if(viewType == 4) {
                setListWidth("50%");
            }
            //setNumColumns(vieweType);
        }else {
            if(viewType == 2) {
                setListWidth("82%");
                setGap(40);
            }if(viewType == 3) {
                setListWidth("60%");
                setGap(30);
            }if(viewType == 4) {
                setListWidth("50%");
                setGap(20);
            }
            setListWidth("100%");
            setNumColumns(viewType);
        } 
    },[isOn])
    
    useEffect(()=>{
        const catData = allCategories.filter(el=>el.cate_code1 == selectedMainCategory);
        if(catData.length>0) {
            setNumColumns(Number(catData[0].view_type));
            setViewType(Number(catData[0].view_type));
            if(catData[0].view_type == 2) {
                setGap(40);
            }if(catData[0].view_type == 3) {
                setGap(30);
            }if(catData[0].view_type == 4) {
                setGap(20);
            }
            //setViewType(3);
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
                        <TouchableWithoutFeedback onPress={()=>{console.log("meat");dispatch(setCartView(false)); dispatch(setSelectedMainCategory("meat"));}}>
                            <MenuSelectCategory>
                                <MenuSelectCategoryDim/>
                                <MenuSelectCategoryText>고기</MenuSelectCategoryText>
                            </MenuSelectCategory>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>{console.log("meal");dispatch(setCartView(false));dispatch(setSelectedMainCategory("meal"));}}>
                            <MenuSelectCategory>
                                <MenuSelectCategoryDim/>
                                <MenuSelectCategoryText>식사</MenuSelectCategoryText>
                                <MenuSelectCategorySubText>(등심 드신 후)</MenuSelectCategorySubText>
                            </MenuSelectCategory>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>{console.log("lunch");dispatch(setCartView(false));dispatch(setSelectedMainCategory("lunch"));}}>
                            <MenuSelectCategory>
                                <MenuSelectCategoryDim/>
                                <MenuSelectCategoryText>점심 식사</MenuSelectCategoryText>
                            </MenuSelectCategory>
                        </TouchableWithoutFeedback>
                    </MenuSelectCategoryView>
                    <MenuSelectCategoryView style={{paddingBottom:50}} >
                        <TouchableWithoutFeedback onPress={()=>{console.log("extra");dispatch(setCartView(false));dispatch(setSelectedMainCategory("extra"));}}>
                            <MenuSelectCategory>
                                <MenuSelectCategoryDim/>
                                <MenuSelectCategoryText>추가메뉴</MenuSelectCategoryText>
                            </MenuSelectCategory>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>{console.log("liquor");dispatch(setCartView(false));dispatch(setSelectedMainCategory("liquor"));}}>
                            <MenuSelectCategory>
                                <MenuSelectCategoryDim/>
                                <MenuSelectCategoryText>주류</MenuSelectCategoryText>
                            </MenuSelectCategory>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>{console.log("drink");dispatch(setCartView(false));dispatch(setSelectedMainCategory("drink"));}}>
                            <MenuSelectCategory>
                                <MenuSelectCategoryDim/>
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
                    <MenuListWrapper viewType={viewType} isSub={subCategories?.length>0} >
                        {/*(displayMenu?.length > 0 && !isOn )&&
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
                        */}
                        {//(displayMenu?.length > 0 && isOn ) &&
                            <ScrollView style={{width:'100%'}}>
                                <View style={{ width:listWidth, flexDirection:'row', flexWrap:'wrap',justifyContent:"flex-start", gap:gap}} >
                                    {
                                    displayMenu.map((el)=>{
                                        index++;
                                        return(
                                            <>
                                                <MenuItem viewType={viewType} isDetailShow={isDetailShow} setDetailShow={setDetailShow} item={el} index={index} />
                                            </>
                                        )
                                    })
                                    }
                                </View>
                            </ScrollView>
                        }
                        <TransparentPopupBottomWrapper style={{paddingTop:10,}} >
                            <TransparentPopupBottomInnerWrapper>
                                <TouchableWithoutFeedback onPress={()=>{dispatch(setSelectedMainCategory("")); dispatch(setCartView(false));  }}>
                                    <TransparentPopupBottomButtonWraper bgColor={colorLightBrown} >
                                        <TransparentPopupBottomButtonIcon source={require("../../assets/icons/folk_nife.png")} />
                                        <TransparentPopupBottomButtonText>{"   "+LANGUAGE[language]?.detailView.toMenu}</TransparentPopupBottomButtonText>
                                    </TransparentPopupBottomButtonWraper>
                                </TouchableWithoutFeedback>
                                {/* <TouchableWithoutFeedback onPress={()=>{openFullSizePopup(dispatch, {innerView:"", isFullPopupVisible:false});}}>
                                    <TransparentPopupBottomButtonWraper bgColor={colorLightBrown} >
                                        <TransparentPopupBottomButtonText>{"   "+LANGUAGE[language]?.detailView.toMenu}</TransparentPopupBottomButtonText>
                                        <TransparentPopupBottomButtonIcon source={require("../../assets/icons/folk_nife.png")} />
                                    </TransparentPopupBottomButtonWraper>
                                </TouchableWithoutFeedback> */}
                            </TransparentPopupBottomInnerWrapper>
                        </TransparentPopupBottomWrapper>   
                    </MenuListWrapper>
                    </>
                );
    }

    
}

export default MenuListView;
