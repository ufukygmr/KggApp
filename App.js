import React, {Fragment} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  // View,
  Text,
  StatusBar,
  TouchableOpacity,
  Picker,
  Alert,
  // Fragment,
  // StatusBar,
  Linking,
  View,
  Dimensions

} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import axios from 'axios';

// import RNPickerSelect from 'react-native-picker-select';
const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;
class App extends React.Component{
  constructor(props){
    super(props);
    // this.eventHandler();
    this.state = {
        datas : [
        ],
        dataId : null,
        qrid : [],
        scan: false,
        ScanResult: false,
        result: null
    }
  }

  eventHandler = () => {
    // Alert.alert("basladi")
    axios.get("http://pypy38.pythonanywhere.com/api/ev/", {headers :{'Content-Type': 'application/json'}})
    .then(res=> {
      Alert.alert("Oturumlar Geldi")
      this.setState({datas : res.data})
      
    })
    .catch(err => Alert.alert(err.data))
  }

  // barcodeRecognized = ({ barcodes }) => {
  //   Alert.alert("Okundu ")
  //  this.setState({qrid : [...qrid,
  //                         ...barcodes]})
  // //  Alert.alert(barcodes)
  //   // barcodes.forEach(barcode => console.warn(barcode.data))
  // //  Alert.alert(this.state.qrid[0].data)
  // };

  eventhandler2 = () => {
    code = {
      pcode : this.state.result.data,
      evid : this.state.dataId
    }
    axios.post("http://pypy38.pythonanywhere.com/api/pe/", code, {headers :{'Content-Type': 'application/json'}})
    // .then(res => this.setState({datas : res.data}))
    // .catch(err => this.setState({data : res.data}))
    .then(res=> Alert.alert("Basarili"))
    .catch(err => Alert.alert(err.data))
  }

  onSuccess = (e) => {
    const check = e.data.substring(0, 4);
    console.log('scanned data' + check);
    this.setState({
        result: e,
        scan: false,
        ScanResult: true
    })
    if (check === 'http') {
        Linking
            .openURL(e.data)
            .catch(err => console.error('An error occured', err));


    } else {
        this.setState({
            result: e,
            scan: false,
            ScanResult: true
        })
    }

}

activeQR = () => {
    this.eventHandler()
    this.setState({
        scan: true
    })
}
scanAgain = () => {
    this.setState({
        scan: true,
        ScanResult: false
    })
}

  render() {
    const Datas = this.state.datas.map(data => {
          return (
            <Picker.Item label= {data.name} value={data.id} />
          )
    })
    const { scan, ScanResult, result } = this.state
    const desccription = 'QR code (abbreviated from Quick Response Code) is the trademark for a type of matrix barcode (or two-dimensional barcode) first designed in 1994 for the automotive industry in Japan. A barcode is a machine-readable optical label that contains information about the item to which it is attached. In practice, QR codes often contain data for a locator, identifier, or tracker that points to a website or application. A QR code uses four standardized encoding modes (numeric, alphanumeric, byte/binary, and kanji) to store data efficiently; extensions may also be used.'

    return (
    // <>

      
    
    
    // <RNCamera
    //   ref={ref => {
    //     this.camera = ref;
    //   }}
    //   style={{
    //     height: 200,
    //     width: '70%',
    //   }}
    //   onGoogleVisionBarcodesDetected={this.barcodeRecognized}
    // >
    // </RNCamera>
    // </>
      // <QRCodeScanner
      //   style = {styles.qr}
      //   onRead={this.onSuccess}
      //   // flashMode={QRCodeScanner.Constants.FlashMode.torch}      
      //   topContent={
      //     
      //   }
      //   bottomContent={
      //     
      //   }
      // />
      <View style={styles.scrollViewStyle} >
                <Fragment>
                    <StatusBar barStyle="dark-content" />
                    <Text style={styles.textTitle}>Welcome To React-Native QR Code Tutorial !</Text>
                    {!scan && !ScanResult &&
                        <View style={styles.cardView} >
                            <Text numberOfLines={8} style={styles.descText}>{desccription}</Text>

                            <TouchableOpacity onPress={this.activeQR} style={styles.buttonTouchable}>
                                <Text style={styles.buttonTextStyle}>Click to Scan !</Text>
                            </TouchableOpacity>

                        </View>
                    }

                    {ScanResult &&
                        <Fragment>
                            <Text style={styles.textTitle1}>Result !</Text>
                            <View style={ScanResult ? styles.scanCardView : styles.cardView}>
                            
                                <Text>Result : {result.data}</Text>
                                {/* <Text numberOfLines={1}>RawData: {result.rawData}</Text> */}
                                <Picker
                                    selectedValue={this.state.dataId}
                                    style={{height: 70, width: 200}}
                                    onValueChange={(itemValue) =>
                                      this.setState({dataId: itemValue})
                                    }>
                                    {/* <Picker.Item label="JavaScript" value="js" /> */}
                                    {Datas}
                                </Picker>
                                <TouchableOpacity style={styles.buttonTouchable} onPress = {() => this.eventhandler2()}>
                                  
                                    <Text style={styles.buttonText}>Send Request</Text>
                                    <Text style={styles.buttonText}>{this.state.qrid}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.scanAgain} style={styles.buttonTouchable}>
                                    <Text style={styles.buttonTextStyle}>Click to Scan again!</Text>
                                </TouchableOpacity>

                            </View>
                        </Fragment>
                    }


                    {scan &&
                        <QRCodeScanner
                            reactivate={true}
                            showMarker={true}
                            ref={(node) => { this.scanner = node }}
                            onRead={this.onSuccess}
                            topContent={
                                <Text style={styles.centerText}>
                                    Go to <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on your computer and scan the QR code to test.</Text>
                            }
                            bottomContent={
                                <View>
                                    <TouchableOpacity style={styles.buttonTouchable} onPress={() => this.scanner.reactivate()}>
                                        <Text style={styles.buttonTextStyle}>OK. Got it!</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.buttonTouchable} onPress={() => this.setState({ scan: false })}>
                                        <Text style={styles.buttonTextStyle}>Stop Scan</Text>
                                    </TouchableOpacity>
                                </View>

                            }
                        />
                    }
                </Fragment>
            </View>
    )
  } 
};

const styles = StyleSheet.create({
    scrollViewStyle: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#99003d'
    },

    textTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        padding: 16,
        color: 'white'
    },
    textTitle1: {
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        padding: 16,
        color: 'black'
    },
    cardView: {
        width: deviceWidth - 32,
        height: deviceHeight / 2,
        alignSelf: 'center',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 4,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        backgroundColor: 'white'
    },
    scanCardView: {
        width: deviceWidth - 32,
        height: deviceHeight / 2,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 4,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        backgroundColor: 'white'
    },
    buttonScan: {
        width: 42,

    },
    descText: {
        padding: 16,
        textAlign: 'justify',
        fontSize: 16
    },


    highlight: {
        fontWeight: '700',
    },

    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777',
    },
    textBold: {
        fontWeight: '500',
        color: '#000',
    },
    buttonTouchable: {
        fontSize: 21,
        backgroundColor: '#ff0066',
        marginTop: 32,

        width: deviceWidth - 62,
        justifyContent: 'center',
        alignItems: 'center',
        height: 44
    },
    buttonTextStyle: {
        color: 'white',
        fontWeight: 'bold',
    }
})

export default App;
