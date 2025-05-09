import React, { useEffect, useRef, useState } from 'react'
import { 
    Animated,
    Dimensions,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback
} from 'react-native'
import { HeaderLogo, HeaderWrapper } from '../../styles/header/header'
import { LogoTop, LogoWrapper, SideMenuItem, SideMenuItemWrapper, SideMenuWrapper } from '../../styles/main/sideMenuStyle'
import { SideMenuItemTouchable } from '../common/sideMenuItem'
import { TopMenuItemTouchable, TopMenuItemTouchableOff } from '../menuComponents/topMenuItem'
import { BulletinText, BulletinWrapper, CategoryScrollView, CategoryWrapper, IconWrapper, TableName, TableNameBig, TableNameSmall, TopMenuWrapper, TouchIcon } from '../../styles/main/topMenuStyle'
 import TopButton from '../menuComponents/topButton'
import { useDispatch, useSelector } from 'react-redux'
import ItemDetail from '../detailComponents/itemDetail'
import { getSubCategories, setCategories, setSelectedMainCategory, setSelectedSubCategory } from '../../store/categories'
import { getTableInfo, openFullSizePopup, openPopup, openTransperentPopup } from '../../utils/common'
import { colorWhite } from '../../assets/colors/color'
import TopMenuList from '../menuComponents/topMenuList'
import VersionCheck from 'react-native-version-check';
import { uploadFile } from '../../store/etcFunctions'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AutoScroll from "@homielab/react-native-auto-scroll";
import { setTableInfo } from '../../store/tableInfo'
import FastImage from 'react-native-fast-image'
import { setAdScreen } from '../../store/ad'
import { regularUpdate } from '../../store/menu'
import { setCommon } from '../../store/common'
import { initMenuDetail } from '../../store/menuDetail'
import { initOrderList } from '../../store/order'
import { setCartView } from '../../store/cart'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const MAINIMG = windowWidth;

const TopMenu = () =>{
    const dispatch = useDispatch();
    const scrollViewRef = useRef();
    const {selectedMainCategory,subCategories, allCategories} = useSelector(state => state.categories);
    
    const {bulletin} = useSelector(state=>state.menuExtra);

    const [currentVersion, setCurrentVersion ] = useState("version");
    const [bulletinText, setBulletinText] = useState("");
    const [bulletinCode, setBulletinCode] = useState("");
    const [isBulletinShow, setBulletinShow] = useState();
    useEffect(()=>{
        if(subCategories) {
            if(subCategories?.length > 0) {
                setBulletinShow(false)
            }else {
                setBulletinShow(true)
            }
        }else {
            setBulletinShow(true)
        }
    },[subCategories])

    useEffect(()=>{
        /*
        const changedSelectedMainCat = allCategories.filter(el=>el.cate_code1==selectedMainCategory);
         
        if(changedSelectedMainCat) {
            if(changedSelectedMainCat?.length > 0) {
                if(subCategories) {
                    if(subCategories?.length > 0) {
                        setBulletinShow(false)
                    }else {
                        setBulletinShow(true)
                    }
                }else {
                    setBulletinShow(true)
                }
            }
        }
        */
        scrollViewRef.current.scrollTo({x:0,animated: false});
        const bulletinToShow = bulletin?.filter(el=>el.cate_code == selectedMainCategory);
        if(bulletinToShow){
            setBulletinCode(bulletinToShow[0]?.cate_code);
            setBulletinText(bulletinToShow[0]?.subject);
        }
    },[selectedMainCategory])

   
    useEffect(()=>{ 
        
        setCurrentVersion(VersionCheck.getCurrentVersion());
        AsyncStorage.getItem("TABLE_NM")
        .then((TABLE_NM)=>{
            if(TABLE_NM) {
                setTableNoText(TABLE_NM)
            }else {
            }
        })
    },[])

    const onPressItem = (index) => {
        
        //dispatch(setSelectedSubCategory(index)); 
    }

    function toAd() {
        dispatch(regularUpdate());
        dispatch(setAdScreen({isShow:true,isMain:true}))
        dispatch(setCartView(false));
        dispatch(setSelectedMainCategory("")); 
        dispatch(setCommon({"tab":"menu"})); 
        dispatch(initMenuDetail());
        dispatch(initOrderList());
    }
    
    return(
        <>
            <TopMenuWrapper>
               
                <TouchableWithoutFeedback>
                    <FastImage source={require("../../assets/icons/daedo_logo.png")} style={{ marginLeft:40,marginRight:20, flex:0.5}} resizeMode='contain' />
                </TouchableWithoutFeedback>
                <SafeAreaView>
                    <CategoryScrollView ref={scrollViewRef} horizontal showsHorizontalScrollIndicator={false} >
                        <CategoryWrapper>
                            <TopMenuList
                                onSelectItem={(data)=>{  /* onPressItem(index); */ }}
                                initSelect={0}
                            />
                       </CategoryWrapper>
                    </CategoryScrollView>
                    {/*((bulletinCode == selectedMainCategory)&&(isBulletinShow)) &&
                        <AutoScroll duration={10000}  style={{width:600}}>
                            <BulletinText>{bulletinText}</BulletinText>
                        </AutoScroll>
                    */}
                </SafeAreaView>
                
               
            </TopMenuWrapper>
        </>
    )
}/* 
const styles = StyleSheet.create({
    safeView: {
     flex: 1,
     backgroundColor: '#1C1C1E',
    },
    container: {
     flex: 1,
     width: '600px',
     backgroundColor: '#1C1C1E',
     // paddingTop: '15%',
     paddingBottom: '15%',
    },
    img: scrollA => ({
        width: windowWidth * 2,
        height: MAINIMG,
        resizeMode: 'center',
        transform: [
          {
            translateX: scrollA.interpolate({
                inputRange: [-MAINIMG, 0, MAINIMG, MAINIMG + 1],
                outputRange: [-MAINIMG / 2, 0, MAINIMG * 0.75, MAINIMG * 0.75],
            }) ,
          },
          {
            scale:0.5,
          },
        ],
       })
});
 */
export default TopMenu