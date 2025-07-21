import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Animated,FlatList,ScrollView,Text,TouchableWithoutFeedback, View, InteractionManager, Image } from 'react-native'
import { InMenuCatSubText, InMenuCatText, InMenuCatView, MenuListWrapper, MenuViewListView, MoreBtnImg } from '../../styles/main/menuListStyle';
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
import { colorDarkGrey, colorLightBrown, colorRed, colorWhite } from '../../assets/colors/color';
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
const scrollHeight = 650;
const MenuListView = (props) => {

    const dispatch = useDispatch();
    const listRef = useRef();
    const scrollViewRef = useRef(null);
    const itemLayouts = useRef({}); 

    const {displayMenu} = useSelector((state)=>state.menu);
    const {isOn} = useSelector((state)=>state.cartView);
    const {language} = useSelector(state=>state.languages);

    const [numColumns, setNumColumns] = useState(3);
    const [viewType, setViewType] = useState(3);
    const [isDetailShow, setDetailShow] = useState(false);
    const [listWidth,setListWidth] = useState("100%");
    const [gap,setGap] = useState(20);
    const [currentY, setCurrentY] = useState(0); // 현재 스크롤 위치 저장
    const [isAtTop, setIsAtTop] = useState(true);
    const [isAtBottom, setIsAtBottom] = useState(false);

    const getCategoryName = (el) => {
        switch (language) {
        case 'japanese': return el.cate_name2_jp;
        case 'chinese': return el.cate_name2_cn;
        case 'english': return el.cate_name2_en;
        default: return el.cate_name2;
        }
    };

    // 선택 카테고리
    const {mainCategories, selectedMainCategory, subCategories, selectedSubCategory, allCategories} = useSelector((state)=>state.categories);
    const CAT_LAN = [
        {idx:0, code:"Meat", title_kor:"저녁\n식사",title_en:"Dinner",title_jp:"夕食",title_cn:"下单" },
        {idx:1, code:"Meal", title_kor:"식사",title_en:"Meal",title_jp:"食事",title_cn:"餐" },
        {idx:2, code:"Sirloin", title_kor:"등심 드신 후",title_en:"After Sirloin",title_jp:"食べた後",title_cn:"吃完后" },
        {idx:3, code:"Lunch", title_kor:"점심\n식사",title_en:"Lunch",title_jp:"昼食",title_cn:"午餐" },
        {idx:4, code:"menu", title_kor:"추가메뉴",title_en:"Additional menu" ,title_jp:"追加",title_cn:"追加菜单"   },
        {idx:5, code:"Alcohol", title_kor:"주류",title_en:"Alcohol" ,title_jp:"酒類",title_cn:"酒类"   },
        {idx:5, code:"Beverages", title_kor:"음료",title_en:"Drinks" ,title_jp:"飲み物",title_cn:"饮料"   },
        {idx:6, code:"LunchTime", title_kor:"오전 10시 ~ 오후4시",title_en:"am 10 ~ pm4",title_jp:"am 10 ~ pm4",title_cn:"am 10 ~ pm4" },
        {idx:7, code:"DinnerTime", title_kor:"오후 4시 ~ 오후10시",title_en:"pm 4 ~ pm10",title_jp:"pm 4 ~ pm10",title_cn:"pm 4 ~ pm10" },

    ];
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
        itemLayouts.current = {}; // 초기화

    },[selectedMainCategory])

  /*   useEffect(()=>{
        if(displayMenu.length>0) {
            //listRef?.current?.scrollTo({x:0,animated: false});
            //if(listRef)listRef?.current?.scrollTo({y:0,animated: false});
            if(listRef.current != undefined){
                listRef.current.scrollToOffset({ animated: false, offset: 0 });
            }
        }
    },[displayMenu]) */

    var index=0;
    var groupCode="";

    //console.log("mainCategories: ",mainCategories[0].ITEM_GR`OUP_CODE)
    const catLang = (kor) => {
        if(CAT_LAN.filter(el=>el.title_kor==kor).length<=0) {
            return kor;
        }else {
            if(language == "korean") {
                return CAT_LAN.filter(el=>el.title_kor==kor)[0].title_kor
            }else if(language == "japanese") {
                return CAT_LAN.filter(el=>el.title_kor==kor)[0].title_jp
            }else if(language == "english") {
                return CAT_LAN.filter(el=>el.title_kor==kor)[0].title_en
            }else if(language == "chinese") {
                return CAT_LAN.filter(el=>el.title_kor==kor)[0].title_cn
            }
        }
    }
    const findYOffsetCodeByCate = (catId) => {
        const targetY = itemLayouts.current[`${catId}`];
        if (targetY !== undefined && scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: targetY, animated: false });
        }
    }
    const findCateCodeByYOffset = (yOffset) => {
        const layouts = itemLayouts.current;
        const keys = Object.keys(layouts).filter(k => !k.endsWith('_btm'));
        for (let key of keys) {
          const top = layouts[key];
          const bottom = layouts[`${key}_btm`] ?? Infinity;
          if (yOffset >= top && yOffset < bottom) {
            return key;
          }
        }
        return null; // 어느 범위에도 해당 안될 경우
    };

    const scrollUp = () => {

        const newY = Math.max(currentY - scrollHeight, 0); // 0보다 아래로 못 내려가게
        scrollViewRef.current?.scrollTo({ y: newY, animated: true });
        setCurrentY(newY);
    };
    const scrollDown = () => {
        const newY = currentY + scrollHeight;
        scrollViewRef.current?.scrollTo({ y: newY, animated: true });
        setCurrentY(newY);
    };
    const subTitle = (data) => {
        if(language == "korean") {
            return data.cate_name2_m;
        }else if(language == "japanese") {
            return data?.cate_name2_jp_m||data.cate_name2_m
        }else if(language == "english") {
            return data?.cate_name2_en_m||data.cate_name2_m
        }else if(language == "chinese") {
            return data?.cate_name2_cn_m||data.cate_name2_m
        }
        return data.cate_name2_m
    }
    
    if(selectedMainCategory == "") {
        return(
            <>
                <MenuSelectView>
                    <MenuSelectBg resizeMethod={"contain"} />
                    <MenuSelectCategoryView style={{paddingTop:10}} >
                        <TouchableWithoutFeedback onPress={()=>{console.log("lunch");dispatch(setCartView(false));dispatch(setSelectedMainCategory("lunch"));}}>
                            <MenuSelectCategory>
                                <MenuSelectCategoryDim/>
                                <MenuSelectCategoryText>{catLang("점심\n식사")}</MenuSelectCategoryText>
                                <MenuSelectCategorySubText>({catLang("오전 10시 ~ 오후4시")})</MenuSelectCategorySubText>
                                </MenuSelectCategory>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={()=>{dispatch(setCartView(false)); dispatch(setSelectedMainCategory("meat"));}}>
                            <MenuSelectCategory>
                                <MenuSelectCategoryDim/>
                                <MenuSelectCategoryText>{catLang("저녁\n식사")}</MenuSelectCategoryText>
                                <MenuSelectCategorySubText>({catLang("오전 10시 ~ 오후4시")})</MenuSelectCategorySubText>
                                </MenuSelectCategory>
                        </TouchableWithoutFeedback>
                        {/* 
                        <TouchableWithoutFeedback onPress={()=>{dispatch(setCartView(false)); dispatch(setSelectedMainCategory("meat"));}}>
                            <MenuSelectCategory>
                                <MenuSelectCategoryDim/>
                                <MenuSelectCategoryText>{catLang("고기\n식사")}</MenuSelectCategoryText>
                            </MenuSelectCategory>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>{console.log("lunch");dispatch(setCartView(false));dispatch(setSelectedMainCategory("lunch"));}}>
                            <MenuSelectCategory>
                                <MenuSelectCategoryDim/>
                                <MenuSelectCategoryText>{catLang("점심\n식사")}</MenuSelectCategoryText>
                                <MenuSelectCategorySubText>({catLang("오전 10시 ~ 오후4시")})</MenuSelectCategorySubText>
                                </MenuSelectCategory>
                        </TouchableWithoutFeedback>
                         */}
                        {/* <TouchableWithoutFeedback onPress={()=>{dispatch(setCartView(false));dispatch(setSelectedMainCategory("meal"));}}>
                            <MenuSelectCategory>
                                <MenuSelectCategoryDim/>
                                <MenuSelectCategoryText>{catLang("식사")}</MenuSelectCategoryText>
                                <MenuSelectCategorySubText>({catLang("등심 드신 후")})</MenuSelectCategorySubText>
                            </MenuSelectCategory>
                        </TouchableWithoutFeedback> */}
                        
                    </MenuSelectCategoryView>
                    
                    {/* <MenuSelectCategoryView style={{paddingBottom:50}} >
                        <TouchableWithoutFeedback onPress={()=>{console.log("extra");dispatch(setCartView(false));dispatch(setSelectedMainCategory("extra"));}}>
                            <MenuSelectCategory>
                                <MenuSelectCategoryDim/>
                                <MenuSelectCategoryText>{catLang("추가메뉴")}</MenuSelectCategoryText>
                            </MenuSelectCategory>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>{console.log("liquor");dispatch(setCartView(false));dispatch(setSelectedMainCategory("liquor"));}}>
                            <MenuSelectCategory>
                                <MenuSelectCategoryDim/>
                                <MenuSelectCategoryText>{catLang("주류")}</MenuSelectCategoryText>
                            </MenuSelectCategory>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>{console.log("drink");dispatch(setCartView(false));dispatch(setSelectedMainCategory("drink"));}}>
                            <MenuSelectCategory>
                                <MenuSelectCategoryDim/>
                                <MenuSelectCategoryText>{catLang("음료")}</MenuSelectCategoryText>
                            </MenuSelectCategory>
                        </TouchableWithoutFeedback>
                    </MenuSelectCategoryView> */}
                </MenuSelectView>
            </>
        )
    }  
    if(selectedMainCategory!= "") {
        //if(selectedMainCategory == "liquor") {
            return(
                <>
                    <SubMenu onPressSubCat={(subId)=>{findYOffsetCodeByCate(subId)}}/>
                    <MenuListWrapper viewType={viewType} isSub={subCategories?.length>0} >
                        {!isAtTop &&
                            <TouchableWithoutFeedback onPress={()=>{scrollUp()}} >
                                <MoreBtnImg position={"top"} source={require("../../assets/icons/arrow.png")} resizeMode='contain'  />
                            </TouchableWithoutFeedback>
                        }
                        {!isAtBottom &&
                            <TouchableWithoutFeedback onPress={()=>{scrollDown()}} >
                                <MoreBtnImg position={"bottom"}  source={require("../../assets/icons/arrow.png")} resizeMode='contain'  />
                            </TouchableWithoutFeedback>
                        }

                        <ScrollView 
                            ref={scrollViewRef}
                            onScroll={(event)=>{
                                const y = event.nativeEvent.contentOffset.y;
                                dispatch(setSelectedSubCategory(findCateCodeByYOffset(y)));
                                setCurrentY(y);

                                const yOffset = event.nativeEvent.contentOffset.y;
                                setIsAtTop(yOffset <= 0);  

                                const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
                                const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
                                setIsAtBottom(isBottom);


                            }}
                        >
                            {subCategories.map((el, sectionIndex) => {
                                const filteredItems = displayMenu.filter(item => item.cate_code === el.cate_code2);
                                return (
                                    <View
                                        key={el.cate_code2}
                                        onLayout={(event) => {
                                            const layout = event.nativeEvent.layout;
                                            // 렌더 완료 후 layout.y 기록
                                            InteractionManager.runAfterInteractions(() => {
                                                itemLayouts.current[el.cate_code2] = layout.y;
                                                itemLayouts.current[`${el.cate_code2}_btm`] = layout.y+layout.height-10;
                                            });
                                        }}
                                    >
                                        {/* 카테고리 제목 */}
                                        <InMenuCatView>
                                            <InMenuCatText>{getCategoryName(el)}</InMenuCatText>
                                            <InMenuCatSubText>{subTitle(el)}</InMenuCatSubText>
                                        </InMenuCatView>

                                        {/* 아이템 리스트 */}
                                        <View style={{ width: listWidth, flexDirection: 'row', flexWrap: 'wrap', justifyContent: "flex-start", gap }}>
                                        {filteredItems.map((item, itemIndex) => (
                                            <MenuItem
                                            key={`${el.cate_code2}_${itemIndex}`}
                                            onLayout={()=>{}}
                                            onPress={(isDetail) => props.setDetailOpen(isDetail)}
                                            viewType={viewType}
                                            isDetailShow={isDetailShow}
                                            setDetailShow={setDetailShow}
                                            item={item}
                                            index={itemIndex}
                                            />
                                        ))}
                                        </View> 
                                    </View>
                                );
                            })}
                            </ScrollView>
                    </MenuListWrapper>
                    </>
                );
    }

    
}

export default MenuListView;
