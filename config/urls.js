let timeStamp = function () {
    return new Date().getTime();
};
let secret = 'eb7f104bd5c44f5fb6862b3b9a4b31af';
exports.getKuai3 = function (type, date) {
    // type: k3js
    // date: d=1为50期   d=2为100期  d=0为今天  d=-1为昨天  d=-2为前天
    return 'http://chart.ydniu.com/GetAppCheckUpdate.aspx?n='+ type +'&t=fbzs&d='+ date +'&s=74B34E0A5F5A0C69E25CBC09EE33F6AC'
};
// 资讯
 exports.getNews = function (page) {
    return 'https://m.qmcai.com/support/cmsv2/information/queryContent?parameter=%7B%22command%22:%22queryContent%22,%22categoryId%22:%22csxw%22,%22offset%22:'+page+',%22size%22:15,%22platform%22:%22html%22,%22version%22:%225.2.16%22%7D&callback=jsonp5';
};
// 专家预测
exports.getYuce = function (type) {
  return 'https://m.ydniu.com/info/'+ type +'/cpyc/';
};

// 攻略详情
exports.getGonglueDetail = function (id) {
    return 'https://m.qmcai.com/hd/caipiaoclass/detail.html?_id='+id+'&fromType=cpkt_k3&clientLogin=true&from=&hideTab=false&isTouzhu=false'
};

// 资讯详情
exports.getNewsDetail = function (id) {
    return 'https://m.qmcai.com/zixun/detail.html?_id=' + id +'&time=' + timeStamp();
};

exports.getHistory = function (type, page, date) {
    return 'http://www.dandan28kai.com/api.php?s=/index/history&date='+date+'&page_no='+page+'&page_size=20&type='+type+'&sign=79b76ffb49853a07a3f90823412f73f5'
};
// 彩票显示所有彩票最新一期开奖号码
exports.getNewestLotteryCode = function (id) {
    return 'https://route.showapi.com/44-1?code='+ id +'&showapi_appid=46754&showapi_test_draft=false&showapi_timestamp='+ timeStamp() +'&showapi_sign='+secret;
};
// 显示近20期开奖号码
exports.getHistoryLotteryCode = function (id) {
    return 'https://route.showapi.com/44-2?code='+ id +'&count=20&endTime='+ new Date().Format('yyyy-MM-dd hh:mm:ss') +'&showapi_appid=46754&showapi_test_draft=false&showapi_timestamp='+ timeStamp() +'&showapi_sign='+secret;
};
// 彩票玩法介绍
exports.getJieshao = function (type) {
    return 'http://pimg1.126.net/swdp/game_rule/'+ type +'.html?time='+timeStamp();
};

// 幸运28介绍
exports.getXingyunJieshao = function (type) {
    return 'https://www.dandan29.com/mobile.php?s=/index/introduce/type/'+type;
};