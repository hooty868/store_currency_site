# profile_page
#### 個人資料頁面，主要引入Materialize-css框架，以及animated.js動畫設計
![首頁](https://media.giphy.com/media/WarWHH9ZnE9jN7uAgK/giphy.gif)
## 引入套件
[![npm version](https://img.shields.io/badge/npm-6.14.10-blue)](https://www.npmjs.org/)


## 主要功能
- 首頁可提供央行現實匯率資訊
- 首頁可新增購買外幣匯率與總值
- 並且實時計算總盈虧
- 可餐廚任一新增資訊

## 專案開啟方式


## 首頁
利用`Jquery`去計算滾輪數值，去改變css opacity的數值.
```html

```

#### 撰寫js檔去抓取匯率資訊
```js
$(window).scroll(function () {
  let currentscrollTop = $(window).scrollTop();
  if (currentscrollTop > 0) {
    $('.navbar').css('opacity', (currentscrollTop / 250))//250是調整結果，數值越大顯現得越慢
  } else {
    $('.navbar').css('opacity', 0)
  }
})
```

## Restful API 設計

## mongoose設定

## 心得

