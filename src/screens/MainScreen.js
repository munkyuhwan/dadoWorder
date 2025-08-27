import React, { useCallback, useEffect, useRef, useState } from 'react'
import {View, NativeModules, DeviceEventEmitter, KeyboardAvoidingView, TouchableWithoutFeedback} from 'react-native'
import SideMenu from '../components/main/sideMenu'
import TopMenu from '../components/main/topMenu'
import { MainWrapper, WholeWrapper } from '../styles/main/mainStyle'
import CartView from '../components/main/cartView'
import { QUICK_MENU_TIMEOUT, SCREEN_TIMEOUT } from '../resources/numberValues'
import MenuListView from '../components/main/menuListView'
import ItemDetail from '../components/detailComponents/itemDetail'
import PopUp from '../components/common/popup'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import LogWriter from '../utils/logWriter'
import { openFullSizePopup, openPopup } from '../utils/common'
import { setLanguage } from '../store/languages'
import { DEFAULT_TABLE_STATUS_UPDATE_TIME } from '../resources/defaults'
import {isEmpty} from 'lodash';
import { getAD, setAdScreen } from '../store/ad'
import { regularUpdate } from '../store/menu'
import { QuickOrderPopup } from '../components/popups/quickOrderPopup'
import FloatingBtn from '../components/popups/floatingButtonPopup'
import { initOrderList, setQuickShow } from '../store/order'
import SubMenu from '../components/main/subMenu'
import LanguageSelectView from '../components/main/languageSelectView'
import CallHelp from '../components/main/callHelp'
import ItemDetailBig from '../components/detailComponents/itemDetailBig'
import { TableName, TableNameBig, TableNameSmall } from '../styles/main/topMenuStyle'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { setCartView } from '../store/cart'
import { setCommon } from '../store/common'
import { setSelectedMainCategory } from '../store/categories'
import { initMenuDetail, setItemDetail } from '../store/menuDetail'
let timeoutSet = null;
let quickOrderTimeoutSet = null;

const MainScreen = () =>{   
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const {language} = useSelector(state=>state.languages);
    const {menuDetailID} = useSelector((state)=>state.menuDetail);
    const {isShow, adList} = useSelector((state)=>state.ads);
    const {quickOrderList, isQuickShow} = useSelector(state=>state.order);
    const {selectedMainCategory, allCategories} = useSelector((state)=>state.categories);
    const {allItems} = useSelector((state)=>state.menu);
    //const {tab} = useSelector(state=>state.common);
    const {tableInfo,cctv,tableStatus} = useSelector(state => state.tableInfo);
    const {isOn} = useSelector((state)=>state.cartView);

    const [vieweType, setViewType] = useState(3);
    const [menuDetail, setMenuDetail] = useState(null);

    const [tableNoText, setTableNoText] = useState("");
    const [tableInfoText, setTableInfoText] = useState("");
    const [isDetailOpen, setDetailOpen] = useState(true);
    const [itemDetailCD, setItemDetailCD] = useState(null);
    const [tab, setTab] = useState("menu");

    /* useEffect(()=>{
        const catData = allCategories.filter(el=>el.cate_code1 == selectedMainCategory);
        if(catData.length>0) {
            setViewType(Number(catData[0].view_type));
        }
    },[selectedMainCategory]) */
    useEffect(()=>{
        if(tableInfo) {
            //setTableNoText(tableInfo.tableNo)
            AsyncStorage.getItem("TABLE_INFO")
            .then((TABLE_INFO)=>{
                if(TABLE_INFO) {
                    setTableInfoText(TABLE_INFO)
                }
            })

            AsyncStorage.getItem("TABLE_NM")
            .then((TABLE_NM)=>{
                if(TABLE_NM) {
                    setTableNoText(TABLE_NM)
                }else {
                }
            })
        }
    },[tableInfo])

    useEffect(()=>{
        dispatch(setLanguage("korean"));  
    },[])

    function screenTimeOut(){
        clearInterval(timeoutSet);
        timeoutSet=null;
        timeoutSet = setInterval(()=>{
            dispatch(setCartView(false));
            dispatch(setSelectedMainCategory("")); 
            //dispatch(setCommon({"tab":"menu"})); 
            setTab("menu");
            dispatch(initMenuDetail());
            dispatch(initOrderList());
            dispatch(regularUpdate());
            dispatch(setAdScreen({isShow:true,isMain:true}))
            

        },SCREEN_TIMEOUT)
    } 
    function quickOrderTimeOut(){
        clearInterval(quickOrderTimeoutSet);
        quickOrderTimeoutSet=null;
        quickOrderTimeoutSet = setInterval(()=>{
            dispatch(setQuickShow(true));
        },QUICK_MENU_TIMEOUT)
    } 

    useEffect(()=>{
          
        if(isShow) {
            clearInterval(timeoutSet);
            timeoutSet=null;
        }else {
            screenTimeOut();
            quickOrderTimeOut()
        } 
          
    },[isShow])
    useEffect(()=>{
          
        if(isQuickShow) {
            clearInterval(quickOrderTimeoutSet);
            quickOrderTimeoutSet=null;
        }else {
            quickOrderTimeOut()
        } 
          
    },[isQuickShow])
    useEffect(()=>{
        const filteredItem = allItems.filter(data => data.prod_cd == menuDetailID);
        if(filteredItem.length > 0) {
            //setMenuDetail(filteredItem[0]);
        }
    },[menuDetailID])

  
    // 세팅 터치
    const [settingTouch, setSettingTouch] = useState(0);
    const [isStartCounting, setIsStartCounting] = useState(true);
    let settingCount=null;
    let countTime = 5;
    const countDown = () =>{
        if(isStartCounting) {
            setIsStartCounting(false);
            settingCount = setInterval(() => {
                if(countTime>0) {
                    countTime = countTime-1;
                }else {
                    countTime = 5
                    clearInterval(settingCount);
                    settingCount=null;
                    setIsStartCounting(true);
                }
            }, 1000);
        }
    }
    const onSettingPress = () => {
        console.log("touch touch");
        if(settingTouch<5) {
            setSettingTouch(settingTouch+1);
            if(countTime>0) {
                if(settingTouch>=4) {
                    clearInterval(settingCount);
                    settingCount=null;
                    setIsStartCounting(true);
                    setSettingTouch(0);
                    openFullSizePopup(dispatch,{innerFullView:"Setting", isFullPopupVisible:true});
                }
            }
        }else {
            setSettingTouch(0);
        }
    }
    async function openItemDetail(itemCD) {
        //await new Promise(resolve => setTimeout(resolve, 200));
        console.log("open detail");
        await new Promise(resolve => setTimeout(resolve, 200));
        setItemDetailCD(itemCD)
        
    }
    return(
        <>
                <WholeWrapper onTouchStart={()=>{ screenTimeOut();  quickOrderTimeOut(); }} >
                    {/* <SideMenu/> */}
                    <MainWrapper>
                        <TopMenu setTab={setTab} tab={tab}/>
                        {tab == "menu" &&
                            <>
                                <MenuListView setItemDetailCD={(itemCD)=>{openItemDetail(itemCD); }/* setItemDetailCD */} setDetailOpen={setDetailOpen} />
                            </>
                        }
                        {tab == "lang" &&
                            <LanguageSelectView setTab={setTab}/>
                        }
                        {tab == "help" &&
                            <CallHelp setTab={setTab} />
                        }
                        <CartView/>
                    </MainWrapper>
                </WholeWrapper> 
                {!isOn &&
                    <TouchableWithoutFeedback onPress={()=>{countDown(); onSettingPress();} } style={{position:'absolute',  top:0,left:0, zIndex:999999999}}>
                        <TableName>
                            <TableNameSmall>{tableInfoText}</TableNameSmall>
                            <TableNameBig>{tableNoText}</TableNameBig>
                        </TableName>
                    </TouchableWithoutFeedback>
                }
            {/*(vieweType!=2 && menuDetailID!=null) &&
                <ItemDetail onDetailTouchStart={screenTimeOut} isDetailShow={menuDetailID!=null} language={language}/>
            */}
            {(isDetailOpen==false && menuDetailID!=null) &&
                <ItemDetail onDetailTouchStart={screenTimeOut} isDetailShow={menuDetailID!=null} language={language}/>
            }
            {/*(isDetailOpen==true && menuDetailID!=null) &&
                <ItemDetailBig onDetailTouchStart={screenTimeOut} isDetailShow={menuDetailID!=null} language={language}/>
            */}
            {//itemDetailCD!=null &&
                <ItemDetailBig onDetailTouchStart={screenTimeOut} setItemDetailCD={setItemDetailCD} itemDetailCD={itemDetailCD} isDetailShow={itemDetailCD!=null} language={language}/>
            }
            <FloatingBtn/>
        </>
    )
}

export default MainScreen