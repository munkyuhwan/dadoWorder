import { TouchableWithoutFeedback } from "react-native"
import { LanguageInnerWrapper, LanguageSelectIcon, LanguageSelectTitle, NewLanguageDimWrapper, NewLanguageSelectWrapper, NewLanguageWrapper } from "../../styles/main/languageStyle"
import { MenuSelectBg } from "../../styles/main/mainStyle"
import { MenuListWrapper } from "../../styles/main/menuListStyle"
import { LanguageSelectWrapper, LanguageSelectedText, LanguageWrapper } from "../../styles/popup/languageSelectPopupStyle"
import { setLanguage } from "../../store/languages"
import { useDispatch } from "react-redux"


const LanguageSelectView = () => {
    const dispatch = useDispatch();
    return(
        <>
            <MenuListWrapper>
                <MenuSelectBg source={require("../../assets/icons/daedo_bg.png")} resizeMode={"cover"} />
                <NewLanguageSelectWrapper>
                    <TouchableWithoutFeedback onPress={()=>{dispatch(setLanguage("korean")); }} >
                        <NewLanguageWrapper>
                            <NewLanguageDimWrapper/>
                            <LanguageInnerWrapper style={{flex:1, paddingTop:50}} >
                                <LanguageSelectIcon source={require("../../assets/icons/korean.png")} resizeMode={"contain"} />
                            </LanguageInnerWrapper>
                            <LanguageInnerWrapper  style={{flex:1, paddingBottom:60}}>
                                <LanguageSelectTitle>한국어</LanguageSelectTitle>
                            </LanguageInnerWrapper>
                        </NewLanguageWrapper>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=>{dispatch(setLanguage("english")); }} >
                        <NewLanguageWrapper>
                            <NewLanguageDimWrapper/>
                            <LanguageInnerWrapper style={{flex:1, paddingTop:72}} >
                                <LanguageSelectIcon source={require("../../assets/icons/english.png")}  resizeMode={"contain"} />
                            </LanguageInnerWrapper>
                            <LanguageInnerWrapper  style={{flex:1, paddingBottom:47}}>
                                <LanguageSelectTitle>ENGLISH</LanguageSelectTitle>
                            </LanguageInnerWrapper>
                        </NewLanguageWrapper>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=>{dispatch(setLanguage("japanese")); }} >
                        <NewLanguageWrapper>
                            <NewLanguageDimWrapper/>        
                            <LanguageInnerWrapper style={{flex:1, paddingTop:72}} >
                                <LanguageSelectIcon source={require("../../assets/icons/japanese.png")} resizeMode={"contain"} />
                            </LanguageInnerWrapper>
                            <LanguageInnerWrapper  style={{flex:1, paddingBottom:47}}>
                                <LanguageSelectTitle>日本語</LanguageSelectTitle>
                            </LanguageInnerWrapper>
                        </NewLanguageWrapper>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=>{ dispatch(setLanguage("chinese")); }} >
                        <NewLanguageWrapper>
                            <NewLanguageDimWrapper/>
                            <LanguageInnerWrapper style={{flex:1, paddingTop:72}} >
                                <LanguageSelectIcon source={require("../../assets/icons/chinese.png")} resizeMode={"contain"} />
                                </LanguageInnerWrapper>
                            <LanguageInnerWrapper  style={{flex:1, paddingBottom:47}}>
                                <LanguageSelectTitle>中國語</LanguageSelectTitle>
                            </LanguageInnerWrapper>
                        </NewLanguageWrapper>
                    </TouchableWithoutFeedback>
                </NewLanguageSelectWrapper>
            </MenuListWrapper>

        </>
    )
}
export default LanguageSelectView