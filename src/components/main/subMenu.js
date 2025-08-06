import React, { useEffect, useRef, useState } from 'react'
import { 
    Animated,
    Dimensions,
    Image,
    InteractionManager,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native'
import { BulletinText, BulletinWrapper, CategoryScrollView, CategoryWrapper, IconWrapper, TableName, TableNameBig, TableNameSmall, TopMenuWrapper, TouchIcon } from '../../styles/main/subMenuStyle'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedSubCategory } from '../../store/categories'
import { openFullSizePopup, openPopup, openTransperentPopup } from '../../utils/common'
import TopMenuList from '../menuComponents/topMenuList'
import VersionCheck from 'react-native-version-check';
import AsyncStorage from '@react-native-async-storage/async-storage'
import AutoScroll from "@homielab/react-native-auto-scroll";
import SubMenuList from '../menuComponents/subMenuList';
import isEmpty from 'lodash';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const MAINIMG = windowWidth;

const SubMenu = (props) =>{
    const dispatch = useDispatch();
    const scrollViewRef = useRef();
    const itemLayouts = useRef({});
    const subcatLayouts = useRef({});

    const {selectedMainCategory,subCategories,selectedSubCategory, allCategories} = useSelector(state => state.categories);
    const [tableNoText, setTableNoText] = useState("");
    const [tableInfoText, setTableInfoText] = useState("");
    const {tableInfo,cctv,tableStatus} = useSelector(state => state.tableInfo);
    
    const {bulletin} = useSelector(state=>state.menuExtra);

    const [currentVersion, setCurrentVersion ] = useState("version");
    const [bulletinText, setBulletinText] = useState("");
    const [bulletinCode, setBulletinCode] = useState("");
    const [isBulletinShow, setBulletinShow] = useState();

    const [selectedSubCat, setSelectedSubCat] = useState("");

    useEffect(()=>{
        console.log("props.tmpSubCat: ",props.tmpSubCat);
        setSelectedSubCat(props.tmpSubCat);
    },[props.tmpSubCat])
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
       
        scrollViewRef.current.scrollTo({x:0,animated: false});
        const bulletinToShow = bulletin?.filter(el=>el.cate_code == selectedMainCategory);
        if(bulletinToShow){
            setBulletinCode(bulletinToShow[0]?.cate_code);
            setBulletinText(bulletinToShow[0]?.subject);
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
        console.log("index: ",index);
        setSelectedSubCat(index);
        props.onPressSubCat(index);
        //dispatch(setSelectedSubCategory(index)); 
    }    
    const findCateCodeByYOffset = (xOffset) => {
        const layouts = subcatLayouts.current;
        //console.log("layouts: ",layouts);
        //console.log("xOffset: ",xOffset);
        /* 
        const keys = Object.keys(layouts).filter(k => !k.endsWith('_btm'));
        for (let key of keys) {
          const top = layouts[key];
          const bottom = layouts[`${key}_btm`] ?? Infinity;
          if (xOffset >= top && xOffset < bottom) {
            console.log("subcatLayouts :",layouts)
            scrollViewRef.current.scrollTo({ x:layouts })
            return key;
          }
        } */
        return null; // 어느 범위에도 해당 안될 경우
    };

    useEffect(()=>{
        console.log("selectedSubCat: ",selectedSubCat)
        const layouts = subcatLayouts.current;
        console.log("layouts: ",layouts);
        const xPosition = layouts[selectedSubCat];
        console.log("xPosition: ",xPosition);
        if(xPosition) {
            if(xPosition<=0) {
                scrollViewRef.current.scrollTo({ x:xPosition-100 })
            }else {
                scrollViewRef.current.scrollTo({ x:xPosition })
            }
        }else {
            scrollViewRef.current.scrollTo({ x:0 })

        }

    },[selectedSubCat])

    return(
        <>
            <TopMenuWrapper isShow={subCategories?.length>0} >
                <SafeAreaView>
                    <CategoryScrollView 
                        ref={scrollViewRef} 
                        horizontal={true} 
                        showsHorizontalScrollIndicator={false} 
                        onScroll={(event)=>{
                            const x = event.nativeEvent.contentOffset.x;
                            const scrolledCat = findCateCodeByYOffset(x);
                            console.log("scrolledCat: ",scrolledCat)
                           

                        }}
                    >
                        <CategoryWrapper 
                            
                        >
                            {subCategories &&
                                
                                <SubMenuList
                                    data={subCategories}
                                    onSelectItem={(index)=>{ onPressItem(index); }}
                                    initSelect={0}
                                    selectedSubCat={selectedSubCat}
                                    subcatLayouts={subcatLayouts}
                                />
                            }
                       </CategoryWrapper>
                    </CategoryScrollView>
                    {((bulletinCode == selectedMainCategory)&&(isBulletinShow)) &&
                        <AutoScroll duration={10000}  style={{width:600}}>
                            <BulletinText>{bulletinText}</BulletinText>
                        </AutoScroll>
                    }
                </SafeAreaView>
    

            
            </TopMenuWrapper>
        </>
    )
} 
export default SubMenu