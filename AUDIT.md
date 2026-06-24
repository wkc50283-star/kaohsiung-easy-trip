# 一路玩高雄 MVP 檢查報告

## 已完成項目

- 主要靜態頁面已存在：`index.html`、`local.html`、`weather.html`、`stay.html`、`rainy-day.html`、`hot-season.html`、`about.html`。
- SEO 基礎檔已存在：`robots.txt`、`sitemap.xml`。
- 前端資源已存在：`css/style.css`、`js/app.js`。
- 資料檔已存在且可解析：`data/origins.json`、`data/trip-templates.json`、`data/spot-groups.json`、`data/stay-zones.json`、`data/weather-rules.json`、`data/rainy-backups.json`。
- 4 個行程頁已存在：`trips/kaohsiung-2-days.html`、`trips/kaohsiung-3-days.html`、`trips/kaohsiung-4-days.html`、`trips/kaohsiung-5-days.html`。
- 8 個景點頁已存在：`spots/pier2.html`、`spots/cijin.html`、`spots/sizihwan.html`、`spots/ruifeng-night-market.html`、`spots/kaohsiung-arena.html`、`spots/weiwuying.html`、`spots/dream-mall.html`、`spots/lotus-pond.html`。
- 每個 HTML 頁面已檢查具備單一 H1、title、meta description、canonical、robots index/follow 與回首頁連結。
- `sitemap.xml` 已包含目前實際存在的主要頁面。
- `robots.txt` 已指向正式站 sitemap。
- `weather.html` 使用 Open-Meteo 免金鑰 API，並有 API 失敗 fallback。

## 發現缺漏項目

- 首頁快速入口過於分散，與「外地旅客 / 高雄本地人 / 看天氣 / 雨天備案」的決策入口不夠直接。
- 首頁有重複的工具入口區塊，讓主要行動路徑變長。
- `weather.html` 的天氣資訊已有讀取，但每日卡片未明確標示最高溫、最低溫與降雨機率欄位名稱。
- `weather.html` 的建議區塊標題不夠工具化，缺少明確的「今日行程建議」、「雨天建議」、「熱季建議」、「戶外景點風險提醒」語意。
- `local.html`、`weather.html`、`about.html` 與部分主題頁底部連結不足，尚未統一提供首頁、天氣、3 日遊、雨天與住宿入口。
- CSS 已有手機壓縮樣式，但缺少 `.section-title` class。

## 本次修正項目

- 調整 `index.html` Header 文案為：首頁、行程、本地玩法、天氣、住宿、雨天。
- 整理首頁順序為：Header、Hero、快速入口、行程產生區、功能入口、2～5 日行程入口、熱門景點、建議住宿區、Footer。
- 將首頁快速入口壓縮成 4 個核心入口：外地旅客照著玩、高雄本地人玩法、看今天高雄天氣、下雨怎麼玩。
- 將首頁功能入口補成 4 個明確入口：我有想去的地方、我懶得選，幫我決定、今天很熱怎麼玩、先看住哪區。
- 移除首頁重複的工具預覽區，讓首頁更短、更集中。
- 將住宿區首頁卡片改為 compact card，降低卡片高度。
- 補強 `weather.html` 的工具化標題與每日天氣欄位標示。
- 補強 `js/app.js` 每日天氣輸出欄位：最高溫、最低溫、降雨機率。
- 補齊 `local.html`、`weather.html`、`stay.html`、`rainy-day.html`、`hot-season.html`、`about.html` 的底部內部連結。
- 補上 `.section-title` 樣式。

## 未來才做、不在本次做的項目

- 多語系。
- 後端服務。
- Google Maps API。
- 會員、登入、付款、收藏功能。
- 訂房、票券代售、廣告系統。
- 資料庫。
- 需要 API key 的服務。
- 更多城市、更多主題行程、旅人回饋。

## 本次沒有動到的檔案與原因

- `data/*.json`：資料可解析且符合 MVP 靜態規則，本次不需要改資料結構。
- `robots.txt`：已指向正確 sitemap，本次僅檢查不修改。
- `sitemap.xml`：已包含目前實際存在頁面，本次僅檢查不修改。
- `trips/*.html`：行程頁已有底部切換入口與 SEO 基礎，本次僅檢查不修改。
- `spots/*.html`：景點頁已有底部連結與 SEO 基礎，本次僅檢查不修改。
- `.github/workflows/static.yml`、`.nojekyll`、`README.md`：與本次 MVP 頁面補齊無直接關係。
