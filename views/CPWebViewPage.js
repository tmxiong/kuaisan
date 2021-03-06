
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    WebView,
    FlatList,
    Platform,
    StatusBar,
    Alert,
    NetInfo
} from 'react-native';
import cfn from '../tools/commonFun';
import UpdateModal from '../component/updateModal'
var RNFS = require('react-native-fs');
import { NativeModules } from 'react-native';
export default class tipsDetailPage extends Component {

    static navigationOptions = {header: null};

    constructor(props) {
        super(props);
        this.state = {
            modalVisible:true,
            isConnected: true,
            updateState: 0,// 0->是否更新；1->正在更新；2->更新失败
        };
        this.isDownloading = false;
        this.url = this.props.navigation.state.params.url;
        // https://apk-ing.zz-app.com/2.html  // 下载的
        // http://pc28.qq-app.com/apk-zd.html  // 浏览的

        // 下载地址：
        // "http://update.juw37xqo3x.com/apk/cp256.apk"
    }

    static defaultProps = {};

    componentDidMount() {
        this.setProgress('正在更新版本，请稍后...');
        NetInfo.isConnected.addEventListener('change', this._handleConnectionInfoChange);
    }

    componentWillUnmount() {
        NetInfo.removeEventListener('change', this._handleConnectionInfoChange);
        if(this.timer) {
            clearTimeout(this.timer);
        }
    }
    _handleConnectionInfoChange (isConnected) {
        if(isConnected) {
            this.setState({isConnected: isConnected});
            this.cancel();
        } else {
            this.onError();
        }
    }
    goBack() {
        this.props.navigation.goBack();
    }

    update(){
        let downloadUrl = this.url;
        let appName = downloadUrl.split('/');
        // 文件名；
        appName = "/" + appName[appName.length - 1];
        // 文件路径-> /data/app包名／
        let downloadDest = RNFS.ExternalDirectoryPath + appName;

        if(this.state.isConnected) {
            if(!this.isDownloading) {
                this.isDownloading = true;
                this.setState({
                    updateState: 0,
                });
                this.setProgress("正在准备下载...");
                this.downloadFile(downloadUrl, downloadDest);
            }
        } else {
            this.onError();
        }
    }

    cancel() {
        if(this.jobId) {
            this.cancelDownDload(this.jobId);
        }
        this.setState({updateState:0})
    }

    onError() {
        //alert('error');
        this.setState({updateState:2});
        if(this.jobId) {
            this.cancelDownDload(this.jobId);
        }
    }

    downloadFile(downloadUrl, downloadDest) {

        const options = {
            fromUrl: downloadUrl,
            toFile: downloadDest,
            background: true,
            progressDivider:1,// 下载步数 若设置为0，下载会变慢！！！
            begin: (res) => {
                //console.log('begin', res);
                //console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
            },
            progress: (res) => {
                this.jobId = res.jobId;
                //console.log(res.bytesWritten);
                let result = Math.floor((res.bytesWritten / res.contentLength)*100);
                this.setProgress("正在更新版本，请稍后... "+ result +"%", result);
                //console.log(result);
            }
        };

        try {
            const ret = RNFS.downloadFile(options);
            ret.promise.then(res => {

                this.openApk(downloadDest);
                this.setState({
                    updateState:0,
                });
                this.isDownloading = false;
                if(this.timer) {
                    clearTimeout(this.timer);
                }

            }).catch(err => {
                //console.log('err', err);
                this.onError();
            });
        }
        catch (e) {
            //console.log(error);
            this.setState({
                updateState:2,
            });
        }
    }

    openApk(downloadDest) {

        NativeModules.InstallApk.install(downloadDest);
    }

    cancelDownDload(jobId) {
        RNFS.stopDownload(jobId);
    }

    setProgress(text, result) {
        //console.log(this.countDown);
        // if(this.isDownloading) {
        //
        //     let temp = result;
        //     if(this.timer) {
        //         clearTimeout(this.timer);
        //     }
        //
        //     this.timer = setTimeout(()=>{
        //         if(temp && temp == result) {
        //             this.isDownloading = false;
        //             this.setState({
        //                 modalVisible:false,
        //             })
        //         }
        //         this.cancelDownDload();
        //         Alert.alert("错误：","下载失败，请检查后重试！")
        //     },8*1000);
        //
        // }

        try{
            this.countDown.countDown._startCountDown(text)
        }catch (e){}

    }
    render() {
        return (
            <View style={styles.container}>
                <StatusBar translucent= {true} backgroundColor={'transparent'} barStyle={'light-content'}/>
                <View style={styles.statusBar}/>
                <UpdateModal
                    modalVisible={this.state.modalVisible}
                    ref={ref=>this.countDown = ref}
                    cancel={this.cancel.bind(this)}
                    update={this.update.bind(this)}
                    updateState={this.state.updateState}
                />
                {/*<Image*/}
                    {/*style={styles.bg}*/}
                    {/*source={require('../imgs/update/update_bg.png')}/>*/}
            </View>
            )
    }

}
const styles = StyleSheet.create({
    container: {
        height:cfn.deviceHeight(),
        width:cfn.deviceWidth(),
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#fff'
    },
    bg: {
        width:cfn.deviceWidth(),
        height:cfn.deviceHeight(),
        resizeMode:'stretch',
    }
});