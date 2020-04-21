var video = {
  videoList: [],
  videoWidth: 206,
  videoHeight: 116,
  backgroundSize: 2060,
  lineWidth: 196,
  init: function (options) {
    this.initData(options);
    this.render();
    this.handle();
  },
  initData: function (options) {
    this.el = options.el;
    this.videoList = this.addRatio(options.videoList);
  },
  addRatio: function (videoList) {
    var videoLength = videoList.length; 
    var backgroundSize = this.backgroundSize;

    for(var i = 0; i < videoLength; i ++) {
      var pvideo = videoList[i].pvideo;
      // 添加ratio（图片放大比例）
      //             backgroundSize
      //  ---------------------------------------
      //    pvideo.img_x_len * pvideo.img_x_size
      pvideo.ratio = backgroundSize / pvideo.img_x_len / pvideo.img_x_size;
    }
    return videoList;
  },
  render: function () {
    // 渲染元素 
    var oUl = document.createElement('ul');
    var template = '';
    var length = this.videoList.length;

    for(var i = 0; i < length; i ++) {
      var video = this.videoList[i];
      template += `
        <li class="video">
          <div class="poster">
            <img src="${video.poster}" alt="${video.title}" class="poster">
            <div class="video-info">
              <div class="play">${video.play > 10000 ? Math.floor(video.play / 10000) + '万' : video.play}</div>
              <div class="likes">${video.likes > 10000 ? Math.floor(video.likes / 10000) + '万' : video.likes}</div>
            </div>
            <div class="mask" index="${i}">
              <div class="line">
                <div class="bottom"></div>
                <div class="top"></div>
              </div>
            </div>
          </div>
          <div class="title">${ video.title }</div>
          <div class="up">up ${ video.up }</div>
        </li>
      `;
    };
    oUl.innerHTML = template;
    oUl.setAttribute('class', 'video-list');
    this.el.innerHTML = oUl.outerHTML;
  },
  handle: function () {
    // 监听元素鼠标移动事件
    var self = this;
    this.el.onmousemove = function (e) {
      var dom = e.target;
      var isMask = dom.classList.contains('mask');
      if(isMask) {
        self.handleMaskMove(dom, e.offsetX);
      }
    }
  },
  handleMaskMove: function (oMask, x) {
    // 设置线宽度的改变
    this.setLineWidth(oMask, x);
    // 设置mask元素背景图片的改变
    this.setMaskBG(oMask, x);
  },
  setLineWidth (oMask, x) {
    // 获取“线”元素
    var oTopLine = oMask.getElementsByClassName('top')[0];
    // 设置“线”元素的宽度
    //         x                  y                    x * this.lineWidth   
    // ----------------- = -----------------  => y = ----------------------
    //  this.videoWidth      this.lineWidth              this.videoWidth
    oTopLine.style.width = x * this.lineWidth / this.videoWidth + 'px'; 
    
  },
  setMaskBG (oMask, x) {
    var index = oMask.getAttribute('index');  // 获取到当前mask元素的索引 index 
    var pvideo = this.videoList[index].pvideo;  // 根据索引找到对应pvideo信息
    var bgLen = pvideo.index.length;  // 获取整体背景图片的个数
    var xLen = pvideo.img_x_len;  // 获取背景图片每一行小背景图片的个数
    var ratio = pvideo.ratio; // 获取到图片伸缩比例值
    var picWidth = this.videoWidth / bgLen;  // 求得每隔多少宽度更换一张背景
    var position = Math.floor(x / picWidth); // 求得当前应该显示第几张图片

    var bgIndex = Math.floor(position / 100); // 求得当前应该显示第几张图片（每张图片上有100张）
    oMask.style.backgroundImage = 'url(' + pvideo.image[bgIndex] + ')'; // 设置mask元素的背景图片

    position = position - bgIndex * 100;  // 求得当前应该显示对应图片第几个小图
    
    var row = Math.floor( position / xLen ); // 求得小图所在 行
    var col = position - row * xLen;  // 求得小图所在 列

    var positionX = -col * 160 * ratio + 'px';  // 图片背景水平位置
    var positionY = -row * 90 * ratio + 'px'; // 图片背景垂直位置

    // 设置背景位置
    oMask.style.backgroundPositionX = positionX; 
    oMask.style.backgroundPositionY = positionY;
  }
}












var banner = {
  el: null,
  bannerList: [],
  curIndex: 0,
  bannerWidth: 0,
  timer: null,
  init: function () {
    this.initData();
    this.startMove();
    this.handle();
  },
  initData: function () {
    this.el = document.getElementById('app2');  // 获取父元素
    this.oBannerList = this.el.getElementsByClassName('banner-list')[0]; // 获取轮播图列表元素
    this.bannerLength = this.oBannerList.children.length; // 获取轮播图的长度
    this.bannerWidth = this.oBannerList.children[0].offsetWidth;  // 获取每一张轮播图的宽度
    this.oIndexList = this.el.getElementsByClassName('index');  // 获取index元素
    this.oActiveIndex = this.el.getElementsByClassName('index active')[0];  // 获取点击态的active元素
  },
  startMove () {
    // 开始运动
    this.timer = setTimeout(this.autoMove.bind(this), 1500)
  },
  autoMove: function () {
    // 运动
    var oBannerList = this.oBannerList;
    var bannerWidth = this.bannerWidth;

    // 索引值 加1 滑到下一张图片
    this.curIndex ++;
    oBannerList.style.left = -bannerWidth * this.curIndex + 'px';
    this.changeIndex(); // 更改index的显示
  },
  changeIndex: function () {
    var oIndexList = this.oIndexList;
    var oActiveIndex = this.oActiveIndex;
    var bannerLength = this.bannerLength;
    var curIndex = this.curIndex % (bannerLength - 1);
    oIndexList[curIndex].classList.add('active');
    oActiveIndex.classList.remove('active');
    this.oActiveIndex = oIndexList[curIndex];
  },
  handle: function () {
    this.handleBannerTranistion(); 
    this.handleIndexClick();
  },
  handleBannerTranistion () {
    // 过渡完成时执行的函数
    var self = this;
    var oBannerList = this.oBannerList;
    var bannerLength = this.bannerLength;
    // 过渡完毕后会触发该事件
    oBannerList.addEventListener("transitionend", function () {
      if(self.curIndex === bannerLength - 1) {
        // 如果当前显示的是最后一张图片
        oBannerList.style.left = 0;  // 立刻让轮播图列表的left为0
        oBannerList.style.transition = 'none';  // 清除过渡效果
        self.curIndex = 0;  // 当前索引重置为0
      }

      // 如果当前位置为0，那么设置过渡样式
      if(oBannerList.offsetLeft === 0) {
        oBannerList.style.transition = 'left .2s';
      }
      self.startMove(); // 开始运动
    });
  },
  handleIndexClick: function () {
    // 点击小圆点时执行的事件
    var self= this;
    var oIndexList = this.oIndexList;
    var indexLength = oIndexList.length;
    var oBannerList = this.oBannerList;
    var bannerWidth = this.bannerWidth;

    for(var i = 0; i < indexLength; i ++) {
      (function (i) {
        var oIndex = oIndexList[i]

        oIndex.onclick = function () {
          var isActive = oIndex.classList.contains('active'); // 判断当前点击的原点是不是active
          if( isActive ) { return } // 如果是active，则什么都不做
          clearTimeout(self.timer); // 清除定时器
          self.curIndex = i;  // 设置当前索引值，为点击的index元素的索引
          self.changeIndex(); // 更改index元素的显示
          oBannerList.style.left = -i * bannerWidth + 'px'; // 轮播图滚动
        }
      })(i)
    }
  },

}