import React from "react"
import { StyleSheet, Image, SafeAreaView, View } from "react-native"

const Header = () => {
    return(
        <SafeAreaView style={styles.header}>
            <Image
                source={require("../assets/BannerLogo.png")}
                resizeMode="contain"
                style={{ marginTop:10, height:30 }}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    header: {
        width: "100%",
        backgroundColor:"#1D0054",
        flexDirection: 'row',
        alignContent: "center",
        justifyContent: "center",
        paddingTop: 20,
    }
})

export default Header;