import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Animated,FlatList,ScrollView,Text,TouchableWithoutFeedback, View } from 'react-native'
import { InMenuCatText, InMenuCatView, MenuListWrapper, MenuViewListView } from '../../styles/main/menuListStyle';
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

    // 선택 카테고리
    const {mainCategories, selectedMainCategory, subCategories, selectedSubCategory, allCategories} = useSelector((state)=>state.categories);
    const CAT_LAN = [
        {idx:0, code:"Meat", title_kor:"고기\n식사",title_en:"Meat",title_jp:"肉",title_cn:"肉" },
        {idx:1, code:"Meal", title_kor:"식사",title_en:"Meal",title_jp:"食事",title_cn:"餐" },
        {idx:2, code:"Sirloin", title_kor:"등심 드신 후",title_en:"After Sirloin",title_jp:"食べた後",title_cn:"吃完后" },
        {idx:3, code:"Lunch", title_kor:"점심\n식사",title_en:"Lunch",title_jp:"昼食",title_cn:"午餐" },
        {idx:4, code:"menu", title_kor:"추가메뉴",title_en:"Additional menu" ,title_jp:"追加",title_cn:"追加菜单"   },
        {idx:5, code:"Alcohol", title_kor:"주류",title_en:"Alcohol" ,title_jp:"酒類",title_cn:"酒类"   },
        {idx:5, code:"Beverages", title_kor:"음료",title_en:"Drinks" ,title_jp:"飲み物",title_cn:"饮料"   },
        {idx:6, code:"LunchTime", title_kor:"오전 10시 ~ 오후4시",title_en:"am 10시 ~ pm4시",title_jp:"am 10시 ~ pm4시",title_cn:"am 10시 ~ pm4시" },

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
        console.log('allCategories: ',allCategories);
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

    useEffect(()=>{
        //console.log("selectedSubCategory: ",selectedSubCategory)
    },[selectedSubCategory])
    function onPressSubCat(catId) {
        const targetY = itemLayouts.current[`${catId}_0`];
        if (targetY !== undefined && scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: targetY, animated: false });
        }
    }

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
    const findCateCodeByYOffset = (yOffset) => {
        const layouts = itemLayouts.current;
    
        let closestKey = null;
        let closestDistance = Infinity;
    
        Object.entries(layouts).forEach(([key, y]) => {
            const distance = Math.abs(y - yOffset);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestKey = key;
            }
        });
    
        return closestKey;
    };
    
    if(selectedMainCategory == "") {
        return(
            <>
                <MenuSelectView>
                    <MenuSelectBg source={require("../../assets/icons/daedo_bg.png")} resizeMethod={"contain"} />
                    <MenuSelectCategoryView style={{paddingTop:10}} >
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
                    <SubMenu onPressSubCat={(subId)=>{onPressSubCat(subId)}}/>
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
                            <ScrollView 
                                onScroll={(event) => {
                                    const yOffset = event.nativeEvent.contentOffset.y;
                                    const scrolledKey = findCateCodeByYOffset(yOffset);
                                    const prefix = scrolledKey.split("_")[0]; // "k2"
                                    dispatch(setSelectedSubCategory(prefix));
                                }} 
                               
                                ref={scrollViewRef} style={{width:'100%'}}>
                                <View  >
                                    {subCategories &&
                                    subCategories.map((el)=>{
                                        const ItemTitle = () => {
                                            if(language=="japanese") {
                                                return (
                                                    
                                                    <InMenuCatText>{el.cate_name2_jp}</InMenuCatText>
                                                )
                                            }
                                            else if(language=="chinese") {
                                                return (
                                                    <InMenuCatText>{el.cate_name2_cn}</InMenuCatText>
                                                )
                                            }
                                            else if(language=="english") {
                                                return (
                                                    <InMenuCatText>{el.cate_name2_en}</InMenuCatText>
                                                )
                                            } else {
                                                return (
                                                    <InMenuCatText>{el.cate_name2}</InMenuCatText>
                                                )
                                            }
                                        }
                                        
                                         
                                        const itemsFiltered = displayMenu.filter(item=>item.cate_code == el.cate_code2);
                                        const ItemList =()=> itemsFiltered.map((el)=>{
                                            index++;
                                            return(
                                                <>
                                                    <MenuItem 
                                                    key={index}
                                                    onLayout={(event)=>{
                                                        /*
                                                        const layout = event.nativeEvent.layout;
                                                        if(groupCode!=el.cate_code) {
                                                            groupCode = el.cate_code;
                                                            tmpValue = `${el.cate_code}_0`
                                                            itemLayouts.current[`${el.cate_code}_0`] = layout.y;
                                                        }else {
                                                            tmpValue = `${el.cate_code}_${index}`
                                                            itemLayouts.current[`${el.cate_code}_${index}`] = layout.y;
                                                        }
                                                        */
                                                    }}
                                                    onPress={(isDetail)=>{props.setDetailOpen(isDetail); } } 
                                                    viewType={viewType} isDetailShow={isDetailShow} 
                                                    setDetailShow={setDetailShow} 
                                                    item={el} 
                                                    index={index} />
                                                </>
                                            )
    
                                        })
                                        return(
                                        <>
                                        <MenuViewListView>
                                            <InMenuCatView 
                                                onLayout={(event)=>{
                                                    const layout = event.nativeEvent.layout;
                                                    console.log("layout: ",layout);
                                                    tmpValue = `${el.cate_code}`
                                                    itemLayouts.current[`${el.cate_code}`] = layout.y;
                                                }}
                                            >
                                                <ItemTitle/>
                                            </InMenuCatView>
                                            <View style={{ width:'100%', flexDirection:'row', flexWrap:'wrap',justifyContent:"flex-start", gap:gap}}>
                                                <ItemList/>
                                            </View>
                                        </MenuViewListView>
                                        
                                        </>
                                        )
                                        
                                        
                                    })


                                    }
                                    {/*
                                    displayMenu.map((el)=>{

                                        index++;
                                        return(
                                            <>
                                                <MenuItem 
                                                key={index}
                                                onLayout={(event)=>{
                                                    console.log("on layout==================");
                                                    const layout = event.nativeEvent.layout;
                                                    if(groupCode!=el.cate_code) {
                                                        groupCode = el.cate_code;
                                                        tmpValue = `${el.cate_code}_0`
                                                        itemLayouts.current[`${el.cate_code}_0`] = layout.y;
                                                    }else {
                                                        tmpValue = `${el.cate_code}_${index}`
                                                        itemLayouts.current[`${el.cate_code}_${index}`] = layout.y;
                                                    }
                                                }}
                                                onPress={(isDetail)=>{props.setDetailOpen(isDetail); } } 
                                                viewType={viewType} isDetailShow={isDetailShow} 
                                                setDetailShow={setDetailShow} 
                                                item={el} 
                                                index={index} />
                                            </>
                                        )

                                        })
                                    */}
                                </View>
                            </ScrollView>
                        }
                        {/* <TransparentPopupBottomWrapper style={{paddingTop:10,}} >
                            <TransparentPopupBottomInnerWrapper>
                                <TouchableWithoutFeedback onPress={()=>{dispatch(setSelectedMainCategory("")); dispatch(setCartView(false));  }}>
                                    <TransparentPopupBottomButtonWraper bgColor={colorLightBrown} >
                                        <TransparentPopupBottomButtonIcon source={require("../../assets/icons/folk_nife.png")} />
                                        <TransparentPopupBottomButtonText>{"   "+LANGUAGE[language]?.detailView.toMenu}</TransparentPopupBottomButtonText>
                                    </TransparentPopupBottomButtonWraper>
                                </TouchableWithoutFeedback> 
                                {// <TouchableWithoutFeedback onPress={()=>{openFullSizePopup(dispatch, {innerView:"", isFullPopupVisible:false});}}>
                                 //   <TransparentPopupBottomButtonWraper bgColor={colorLightBrown} >
                                 //       <TransparentPopupBottomButtonText>{"   "+LANGUAGE[language]?.detailView.toMenu}</TransparentPopupBottomButtonText>
                                 //       <TransparentPopupBottomButtonIcon source={require("../../assets/icons/folk_nife.png")} />
                                 //   </TransparentPopupBottomButtonWraper>
                                //</TouchableWithoutFeedback>
                                }
                            </TransparentPopupBottomInnerWrapper>
                        </TransparentPopupBottomWrapper>    */}
                    </MenuListWrapper>
                    </>
                );
    }

    
}

export default MenuListView;
