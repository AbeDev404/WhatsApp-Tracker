import { Dimensions } from 'react-native'
const {width, height} = Dimensions.get('window');

export default {
    underline: {
        textDecorationLine: 'underline'
    },   

    SCREEN_WIDTH: width,
    SCREEN_HEIGHT: height,
    Manjari: {
        fontFamily: 'Manjari',
    },
    ManjariBold: {
        fontFamily: 'ManjariBold'
    },
    BoxShadow: {
        //iOS
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,

        //Android
        elevation: 24,
    },
    container: {
        width: '100%',
        height: '100%',
    },
    flex: (direction, xOption, yOption) => {
        if(direction.indexOf('row') >= 0) {
            return {
                flexDirection: 'row',
                justifyContent: xOption,
                alignItems: yOption
            }
        } else if(direction.indexOf('column') >= 0) {
            return {
                flexDirection: 'column',
                justifyContent: yOption,
                alignItems: xOption
            }
        }
    },
    round: {
        borderRadius: 30,
    },

    inputStyle: {
        fontSize: width / 25,
        width: '100%'
    },
    inputContainerStyle: {
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 20, 
        marginBottom: 10,
        width: '100%',
        borderColor: '#23DB77'
    },
    buttonStyle: {
        borderRadius: 25,
        padding: 10,
        backgroundColor: '#23DB77',
        width: '100%',
        marginTop: 30
    },
    buttonTextStyle: {
        fontSize: width / 25
    },
    title: {
        fontSize: width / 8,
        fontWeight: 'bold',
        marginBottom: 40,
        color: '#23DB77'
    }
}