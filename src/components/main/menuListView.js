import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Animated,FlatList,ScrollView,Text,TouchableWithoutFeedback, View, InteractionManager, Image, SafeAreaView, SectionList } from 'react-native'
import { InMenuCatSubText, InMenuCatText, InMenuCatView, MenuListWrapper, MenuViewListView, MoreBtnImg } from '../../styles/main/menuListStyle';
import MenuItem from '../mainComponents/menuItem';
import { setSelectedMainCategory, setSelectedSubCategory, setSubCategories } from '../../store/categories';
import { MenuSelectBg, MenuSelectCategory, MenuSelectCategoryDim, MenuSelectCategoryIcon, MenuSelectCategorySubText, MenuSelectCategoryText, MenuSelectCategoryView, MenuSelectView } from '../../styles/main/mainStyle';
import SubMenu from './subMenu';
import { setCartView } from '../../store/cart';
import { setSelectedItems } from '../../store/menu';
import { EventRegister } from 'react-native-event-listeners';

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

var sections = "";
const MenuListView = (props) => {

    const dispatch = useDispatch();
    const listRef = useRef();
    const scrollViewRef = useRef(null);
    const subScrollViewRef = useRef(null);
    const itemLayouts = useRef({}); 

    // 섹션뷰
    const sectionListRef = useRef(null);


    const {displayMenu} = useSelector((state)=>state.menu);
    const {isOn} = useSelector((state)=>state.cartView);
    const {language} = useSelector(state=>state.languages);
    // 선택 카테고리
    const {mainCategories, selectedMainCategory, subCategories, selectedSubCategory, allCategories} = useSelector((state)=>state.categories);

    const [numColumns, setNumColumns] = useState(2);
    //const [viewType, setViewType] = useState(3);
    const [isDetailShow, setDetailShow] = useState(false);
    const [listWidth,setListWidth] = useState("100%");
    const [gap,setGap] = useState(40);
    const [currentY, setCurrentY] = useState(0); // 현재 스크롤 위치 저장
    const [isAtTop, setIsAtTop] = useState(true);
    const [isAtBottom, setIsAtBottom] = useState(false);
    const [tmpSubCat, setTmpSubCat] = useState("");
    const [subCatShow, setSubCatShow] = useState([]);

    const getCategoryName = (el) => {
        switch (language) {
        case 'japanese': return el.cate_name2_jp;
        case 'chinese': return el.cate_name2_cn;
        case 'english': return el.cate_name2_en;
        default: return el.cate_name2;
        }
    };

    const CAT_LAN = [
        {idx:0, code:"Meat", title_kor:"저녁\n식사",title_en:"Dinner",title_jp:"夕食",title_cn:"下单" },
        {idx:1, code:"Meal", title_kor:"식사",title_en:"Meal",title_jp:"食事",title_cn:"餐" },
        {idx:2, code:"Sirloin", title_kor:"등심 드신 후",title_en:"After Sirloin",title_jp:"食べた後",title_cn:"吃完后" },
        {idx:3, code:"Lunch", title_kor:"점심\n식사",title_en:"Lunch",title_jp:"昼食",title_cn:"午餐" },
        {idx:4, code:"menu", title_kor:"추가메뉴",title_en:"Additional menu" ,title_jp:"追加",title_cn:"追加菜单"   },
        {idx:5, code:"Alcohol", title_kor:"주류",title_en:"Alcohol" ,title_jp:"酒類",title_cn:"酒类"   },
        {idx:5, code:"Beverages", title_kor:"음료",title_en:"Drinks" ,title_jp:"飲み物",title_cn:"饮料"   },
        {idx:6, code:"LunchTime", title_kor:"오전 11시 ~ 오후 4시",title_en:"am 11 ~ pm 4",title_jp:"am 11 ~ pm 4",title_cn:"am 11 ~ pm 4" },
        {idx:7, code:"DinnerTime", title_kor:"오후 4시 ~ 오후 10시",title_en:"pm 4 ~ pm 10",title_jp:"pm 4 ~ pm 10",title_cn:"pm 4 ~ pm 10" },

    ];
    useEffect(()=>{
        /* if(isOn) {
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
        }  */
    },[isOn])
    
   /*  useEffect(()=>{
        const catData = allCategories.filter(el=>el.cate_code1 == selectedMainCategory);
        console.log("catData: ",catData);

        if(catData.length>0) {
            
            //setViewType(3);
            //dispatch(setSelectedSubCategory(catData[0]?.level2[0]?.cate_code2));
            if(catData[0]?.level2) {
                async function startDisplay() {
                    //await dispatch(setSubCategories(catData[0]?.level2[0]?.cate_code2));
                    //await dispatch(setSelectedItems());
                    
                }
                startDisplay();
                
            }
        }
        itemLayouts.current = {}; // 초기화

    },[selectedMainCategory]) */

    useEffect(()=>{
        if(subCategories) {
            const catData = allCategories.filter(el=>el.cate_code1 == selectedMainCategory);
            const filteredSub = subCategories.filter(item => item.cate_code2 == catData[0]?.level2[0]?.cate_code2);
            setSubCatShow(filteredSub);
        }
    },[subCategories])


    /* useEffect(()=>{
        console.log("subCategories: ",subCategories[0])
        dispatch(setSelectedSubCategory(subCategories[0].cate_code2));
    },[]) */

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
        const filteredSub = subCategories.filter(item => item.cate_code2 == catId);
        setSubCatShow(filteredSub);
        scrollViewRef.current.scrollTo({ y: 0, animated: false });
        /*
        const filteredItems = displayMenu.filter(item => item.cate_code === catId);
        //dispatch(setSelectedItems());
        const targetY = itemLayouts.current[`${catId}`];
        if (targetY !== undefined && scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: targetY, animated: false });
        }
        */

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
    /* if(selectedMainCategory == "") {
        return(
            <>
                <MenuSelectView>
                    <MenuSelectBg resizeMethod={"contain"} />
                    <MenuSelectCategoryView style={{paddingTop:10}} >
                        <TouchableWithoutFeedback onPress={()=>{dispatch(setCartView(false));dispatch(setSelectedMainCategory("lunch"));}}>
                            <MenuSelectCategory>
                                <MenuSelectCategoryDim/>
                                <MenuSelectCategoryText>{catLang("점심\n식사")}</MenuSelectCategoryText>
                                <MenuSelectCategorySubText>({catLang("오전 11시 ~ 오후 4시")})</MenuSelectCategorySubText>
                                </MenuSelectCategory>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={()=>{dispatch(setCartView(false)); dispatch(setSelectedMainCategory("meat"));}}>
                            <MenuSelectCategory>
                                <MenuSelectCategoryDim/>
                                <MenuSelectCategoryText>{catLang("저녁\n식사")}</MenuSelectCategoryText>
                                <MenuSelectCategorySubText>({catLang("오후 4시 ~ 오후 10시")})</MenuSelectCategorySubText>
                                </MenuSelectCategory>
                        </TouchableWithoutFeedback> 
                        
                    </MenuSelectCategoryView>
                    
                    
                </MenuSelectView>
            </>
        )
    }    */

    async function openItemDetail() {
        //await new Promise(resolve => setTimeout(resolve, 200));
        console.log("open detail");
        props.setDetailOpen(isDetail);

    }
    const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 2;
        return layoutMeasurement.height + contentOffset.y >=
          contentSize.height - paddingToBottom;
    };

    const isCloseToTop = ({contentOffset}) => {
        return contentOffset.y == 0;
    };
    const toNextCaterogy = () =>{
        if(subCatShow[0]) {
            const currentSubCatCode = subCatShow[0]?.cate_code2;
            const index = subCategories.findIndex(item => item.cate_code2 === currentSubCatCode);
            if(index<subCategories.length-1) {
                const nextSubCat = subCategories[index+1]?.cate_code2;
                setTmpSubCat(nextSubCat);
                findYOffsetCodeByCate(nextSubCat);
            }
        }
    }
    const toPrevCaterogy = () =>{
        console.log("prev======");
        if(subCatShow[0]) {
            const currentSubCatCode = subCatShow[0]?.cate_code2;
            const index = subCategories.findIndex(item => item.cate_code2 === currentSubCatCode);
            if(index>0) {
                const prevSubCat = subCategories[index-1]?.cate_code2;
                setTmpSubCat(prevSubCat);
                findYOffsetCodeByCate(prevSubCat);
            }
        }
    }
    //console.log("ViewType: ",viewType);
    //if(selectedMainCategory!= "") {
            return(
                <>
                
                {
                    <>
                        <SubMenu tmpSubCat={tmpSubCat} onPressSubCat={(subId)=>{ findYOffsetCodeByCate(subId) }}/>
                        <MenuListWrapper viewType={2} isSub={subCategories?.length>0} >
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
                            {subCategories &&
                                <ScrollView 
                                    style={isOn?{width:'54%'}:{width:'100%'}}
                                    ref={scrollViewRef}
                                    removeClippedSubviews={true}
                                    onScroll={(event)=>{
                                        const y = event.nativeEvent.contentOffset.y;
                                        //const scrolledCat = findCateCodeByYOffset(y);
                                        //if(scrolledCat != null) {
                                            //dispatch(setSelectedSubCategory(scrolledCat));
                                            //setTmpSubCat(scrolledCat);
                                        //}
                                        setCurrentY(y);

                                        const yOffset = event.nativeEvent.contentOffset.y;
                                        setIsAtTop(yOffset <= 0);  

                                        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
                                        const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
                                        setIsAtBottom(isBottom);    




                                        direction = event.nativeEvent.contentOffset.y > currentOffset ? 'down' : 'up';
                                        currentOffset = event.nativeEvent.contentOffset.y;
                                        
                                        scrollDownReached = false;
                                        scrollUpReached = false;
                                        scrollDownCnt = 0;
                                        scrollUpCnt = 0;

                                        if (isCloseToBottom(event.nativeEvent)) {
                                            scrollDownCnt = scrollDownCnt+1;
                                            if(direction == "down") {scrollDownReached = true; scrollUpReached = false;}
                                        }
                                        if (isCloseToTop(event.nativeEvent)) {
                                            scrollUpCnt = scrollUpCnt+1;
                                            if(direction == 'up') {scrollUpReached = true; scrollDownReached = false;}
                                        }

                                        
                                    }}
                                    onTouchStart={(event)=>{
                                        touchStartOffset = event.nativeEvent.pageY;

                                    }}
                                    onTouchEnd={(event)=>{   
                                        touchEndOffset = event.nativeEvent.pageY;
                                        const touchSize = touchStartOffset - touchEndOffset;
                                        
                                        if(touchSize < 0) {
                                            // swipe down
                                            if( (touchSize*-1) > 130 ) {
                                                // action
                                                if(scrollDownCnt>=1) {
                                                    toPrevCaterogy();
                                                }else {
                                                    scrollDownCnt = scrollDownCnt+1;
                                                }
                                            }
                                        }else {
                                            // swipe up
                                            if(touchSize>150) {
                                                //action
                                                if(scrollUpCnt>=1) {
                                                    toNextCaterogy();
                                                }else {
                                                    scrollUpCnt = scrollUpCnt+1;
                                                }
                                            } 
                                        }
                                        
                                    }}
                                    onScrollBeginDrag={(ev)=>{
                                        // 스크롤 있을떄 호출됨
                                        isScrolling=true;
                                    }}
                                    onScrollEndDrag={(ev)=>{
                                        if(scrollDownReached ) {
                                            if(scrollDownCnt>1) {
                                                toNextCaterogy();
                                            }else {
                                                scrollDownCnt = scrollDownCnt+1;
                                            }
            
                                        }
                                        if(scrollUpReached) {
                                            if(scrollUpCnt>1) {
                                                toPrevCaterogy();
                                            }else {
                                                scrollUpCnt = scrollUpCnt+1;
                                            }
                                        }
                                    }}


                                >
                                    {subCatShow?.map((el, sectionIndex) => {
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
                                                <InMenuCatView>
                                                    <InMenuCatText>{getCategoryName(el)}</InMenuCatText>
                                                    <InMenuCatSubText>{subTitle(el)}</InMenuCatSubText>
                                                </InMenuCatView>
                                                

                                                <View style={{ width: listWidth, flexDirection: 'row', flexWrap: 'wrap', justifyContent: "flex-start", gap }}>
                                                {filteredItems.map((item, itemIndex) => {
                                                    return(
                                                        <MenuItem
                                                            key={`${el.cate_code2}_${itemIndex}`}
                                                            onLayout={()=>{}}
                                                            onPress={(isDetail) => props.setDetailOpen(isDetail)}
                                                            viewType={2}
                                                            isDetailShow={isDetailShow}
                                                            setDetailShow={setDetailShow}
                                                            setItemDetailCD={props.setItemDetailCD}
                                                            item={item}
                                                            index={itemIndex}
                                                        />
                                                    )
                                                })}
                                                </View> 
                                            </View>
                                        );
                                    })}
                                </ScrollView>
                            }
                        </MenuListWrapper>
                    </>
                }
                {selectedMainCategory == "" &&
                    <View style={{position:'absolute',width:'100%',height:'90%',top:80, zIndex:999999, backgroundColor:'#252525'}}>
                        <MenuSelectView>
                            <MenuSelectBg resizeMethod={"contain"} />
                            <MenuSelectCategoryView style={{paddingTop:10}} >
                                <TouchableWithoutFeedback onPress={()=>{dispatch(setCartView(false));dispatch(setSelectedMainCategory("lunch")); }}>
                                    <MenuSelectCategory>
                                        <MenuSelectCategoryDim/>
                                        <MenuSelectCategoryText>{catLang("점심\n식사")}</MenuSelectCategoryText>
                                        <MenuSelectCategorySubText>({catLang("오전 11시 ~ 오후 4시")})</MenuSelectCategorySubText>
                                        </MenuSelectCategory>
                                </TouchableWithoutFeedback>

                                <TouchableWithoutFeedback onPress={()=>{dispatch(setCartView(false)); dispatch(setSelectedMainCategory("meat"));}}>
                                    <MenuSelectCategory>
                                        <MenuSelectCategoryDim/>
                                        <MenuSelectCategoryText>{catLang("저녁\n식사")}</MenuSelectCategoryText>
                                        <MenuSelectCategorySubText>({catLang("오후 4시 ~ 오후 10시")})</MenuSelectCategorySubText>
                                        </MenuSelectCategory>
                                </TouchableWithoutFeedback> 
                            </MenuSelectCategoryView>
                        </MenuSelectView>
                    </View>
                }
                </>
            );
    //}

    
}

export default MenuListView;
