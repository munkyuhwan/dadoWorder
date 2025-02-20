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
import { openPopup } from '../utils/common'
import { setLanguage } from '../store/languages'
import { DEFAULT_TABLE_STATUS_UPDATE_TIME } from '../resources/defaults'
import {isEmpty} from 'lodash';
import { getAD, setAdScreen } from '../store/ad'
import { regularUpdate } from '../store/menu'
import { QuickOrderPopup } from '../components/popups/quickOrderPopup'
import FloatingBtn from '../components/popups/floatingButtonPopup'
import { setQuickShow } from '../store/order'
import SubMenu from '../components/main/subMenu'
import LanguageSelectView from '../components/main/languageSelectView'
import CallHelp from '../components/main/callHelp'
import ItemDetailBig from '../components/detailComponents/itemDetailBig'
import { TableName, TableNameBig, TableNameSmall } from '../styles/main/topMenuStyle'
import AsyncStorage from '@react-native-async-storage/async-storage'
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
    const {tab} = useSelector(state=>state.common);
    const {tableInfo,cctv,tableStatus} = useSelector(state => state.tableInfo);

    const [vieweType, setViewType] = useState(3);
    const [menuDetail, setMenuDetail] = useState(null);

    const [tableNoText, setTableNoText] = useState("");
    const [tableInfoText, setTableInfoText] = useState("");

    useEffect(()=>{
        const catData = allCategories.filter(el=>el.cate_code1 == selectedMainCategory);
        if(catData.length>0) {
            setViewType(Number(catData[0].view_type));
        }
    },[selectedMainCategory])
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
        console.log("menuDetailID: ",menuDetailID);
        const filteredItem = allItems.filter(data => data.prod_cd == menuDetailID);
        if(filteredItem.length > 0) {
            setMenuDetail(filteredItem[0]);
        }
    },[menuDetailID])

    console.log("menu detail: ",( (menuDetail?.prod_gb=="09"||menuDetail?.prod_gb=="02"))  )

    return(
        <>
            <KeyboardAvoidingView behavior="padding" enabled style={{width:'100%', height:'100%'}} >
                <WholeWrapper onTouchStart={()=>{     screenTimeOut();  quickOrderTimeOut();   }} >
                    {/* <SideMenu/> */}
                    <MainWrapper>
                        <TopMenu/>
                        {tab == "menu" &&
                            <MenuListView/>
                        }
                        {tab == "lang" &&
                            <LanguageSelectView/>
                        }
                        {tab == "help" &&
                            <CallHelp/>
                        }
                        <CartView/>
                    </MainWrapper>
                </WholeWrapper> 
                <TouchableWithoutFeedback onPress={()=>{ /* countDown(); onSettingPress(); */ } } style={{position:'absolute',  top:0,left:0, zIndex:999999999}}>
                    <TableName>
                        <TableNameSmall>{tableInfoText}</TableNameSmall>
                        <TableNameBig>{tableNoText}</TableNameBig>
                    </TableName>
                </TouchableWithoutFeedback>
                
            </KeyboardAvoidingView>
            {(vieweType!=2 && menuDetailID!=null) &&
                <ItemDetail onDetailTouchStart={screenTimeOut} isDetailShow={menuDetailID!=null} language={language}/>
            }
            {(vieweType==2 && menuDetailID!=null && (menuDetail?.prod_gb=="09"||menuDetail?.prod_gb=="02")) &&
                <ItemDetail onDetailTouchStart={screenTimeOut} isDetailShow={menuDetailID!=null} language={language}/>
            }
            {(vieweType==2 && menuDetailID!=null && (menuDetail?.prod_gb!="09"&&menuDetail?.prod_gb!="02")) &&
                <ItemDetailBig onDetailTouchStart={screenTimeOut} isDetailShow={menuDetailID!=null} language={language}/>
            }
            <FloatingBtn/>
        </>
    )
}

export default MainScreen