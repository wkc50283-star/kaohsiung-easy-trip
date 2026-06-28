# 備援模式資料建模草案 v0.1

本文件整理「一路玩高雄 / 高雄不開車自由行助手」備援模式第一版的資料模型草案。

本文件不是 JSON、不是功能施工、不是 API 設計、不是即時定位設計。它只用來把已完成的備援模式規格、資料審核表、Needs review 優先清單與 P0 官方查證結果，整理成未來可轉成 JSON 的資料結構。

## 1. 文件目的

本文件目的：

1. 定義備援模式第一版未來可用的資料模型。
2. 把旅遊圈、辨識點、交通回收點、備援規則與輸出結果分開。
3. 保留「不要害旅人越走越遠」作為資料建模最高原則。
4. 明確區分第一版可以建模的安全資料與不可進入 JSON 的高風險資料。
5. 建立 Needs review 標記規則，避免未確認交通資訊被包裝成確定建議。

核心原則：

1. 不要害旅人越走越遠。
2. 第一版只做旅遊圈、回收方向、分級建議、風險提醒、官方資訊優先。
3. 如果使用者還想繼續玩，輸出必須分級：順路可玩、可玩但較繞、不建議但可自行決定。
4. 第一版不接 TDX 即時 API。
5. 第一版不做定位功能。
6. 第一版不查即時班次。
7. 未經官方確認，一律標 Needs review。

## 2. 資料建模原則

第一版資料建模採保守原則：

1. 用「方向」取代「精準路線」。
2. 用「主要交通回收點」取代「固定站牌」。
3. 用「官方資訊優先」取代「確定班次」。
4. 用「Needs review」保留尚未確認的交通細節。
5. 用「分級建議」避免把旅人推往更遠、更危險或更不確定的方向。

第一版允許建模：

1. 旅遊圈名稱與圈類型。
2. 代表地點與辨識點。
3. 安全回收點候選。
4. 順路可玩方向。
5. 可玩但較繞方向。
6. 不建議硬接方向。
7. 天氣、體力、交通風險。
8. 官方資訊提醒文案。
9. Needs review 標記與來源文件。

第一版不得建模成確定值：

1. 固定路線。
2. 固定站牌。
3. 固定班距。
4. 固定末班。
5. 現在一定有車。
6. 一定趕得上。
7. 即時營運狀態。
8. 未驗證店家或商家排名。

## 3. 第一版資料模型總覽

| 資料模型 | 用途 | 第一版狀態 |
|---|---|---|
| `rescue-zones` | 定義旅遊圈與回收方向，供系統先判斷使用者在哪一圈 | 可轉 JSON 前需人工確認欄位 |
| `rescue-places` | 定義可辨識地點與其所屬旅遊圈 | 第一版可放核心辨識點，不放未驗證店家 |
| `rescue-hubs` | 定義交通回收點與官方資訊需求 | 只放回收點與方向，不放班次承諾 |
| `rescue-rules` | 定義位置、時間、天氣、體力、心情、跨縣市與未知地點規則 | 可做靜態規則，交通細節標 Needs review |
| `rescue-result` | 定義前台輸出結果結構 | 只輸出保守分級建議與官方資訊提醒 |

資料關係：

1. `rescue-places` 透過 `zoneId` 連到 `rescue-zones`。
2. `rescue-zones` 透過 `safeRecoveryHubs` 連到 `rescue-hubs`。
3. `rescue-rules` 根據使用者狀態與旅遊圈，產生 `rescue-result`。
4. 每個模型都必須可追溯到 `sourceDocs`。

## 4. `rescue-zones` 欄位設計

`rescue-zones` 用來定義旅遊圈。它不是景點清單，而是備援模式判斷「使用者現在大概在哪一圈，應該收斂還是繼續玩」的基礎資料。

| 欄位 | 型別草案 | 用途 | 第一版規則 |
|---|---|---|---|
| `zoneId` | string | 旅遊圈唯一 ID | 使用穩定英文 kebab-case，例如 `cijin-gushan` |
| `zoneName` | string | 旅遊圈名稱 | 使用前台可理解名稱，例如「旗津／鼓山渡輪」 |
| `zoneType` | string | 圈類型 | 例如 `urban-core`、`harbor`、`suburban`、`remote`、`cross-county` |
| `representativePlaces` | string[] | 代表地點 | 只放已知辨識點，不放未驗證店家 |
| `suitableUseCases` | string[] | 適合玩法 | 例如短停留、港邊散步、雨天收斂、回程前收斂 |
| `safeRecoveryHubs` | string[] | 安全回收點 | 放 `hubId`，不寫固定路線與班次 |
| `nearbySafeDirections` | string[] | 順路可玩方向 | 以方向描述，不寫精準轉乘 |
| `possibleButDetourDirections` | string[] | 可玩但較繞方向 | 必須提醒交通較繞或需先回主幹 |
| `notRecommendedDirections` | string[] | 不建議硬接方向 | 用於避免越走越遠 |
| `weatherRisks` | string[] | 天氣風險 | 雨天、風大、熱季中午、颱風、豪雨等 |
| `trafficRisks` | string[] | 交通風險 | 遠郊、跨縣市、渡輪、客運、台鐵銜接等 |
| `needsReview` | object | 未確認項目 | 以陣列列出欄位、原因與需查來源 |
| `sourceDocs` | string[] | 來源文件 | 連到本 repo 的規格或查證文件名稱 |

建模注意：

1. P0 遠郊與跨縣市圈必須把 `zoneType` 標成 `remote` 或 `cross-county`。
2. 旗津／鼓山渡輪可建模為港邊渡輪圈，但渡輪班距、船班與末班都要放在 `needsReview`。
3. 旗山／美濃、東港／華僑市場、恆春／墾丁、屏東市／潮州不能被當成高雄市區短線。

## 5. `rescue-places` 欄位設計

`rescue-places` 用來定義備援模式可辨識的地點。它不是前台景點推薦榜，也不是餐廳資料庫。

| 欄位 | 型別草案 | 用途 | 第一版規則 |
|---|---|---|---|
| `placeId` | string | 地點唯一 ID | 使用穩定英文 kebab-case |
| `placeName` | string | 地點名稱 | 使用使用者可辨識名稱 |
| `publicVisible` | boolean | 是否前台公開 | 可做內部辨識但不一定公開 |
| `zoneId` | string | 所屬旅遊圈 | 必須對應 `rescue-zones.zoneId` |
| `placeType` | string | 地點類型 | 例如 `station`、`market`、`harbor`、`mall`、`transfer`、`district` |
| `suitableUseCases` | string[] | 適合玩法 | 例如避雨、回收、短停留、吃飯、回程前 |
| `weatherRisk` | string[] | 天氣風險 | 不寫即時天氣，只寫靜態風險 |
| `energyRisk` | string[] | 體力風險 | 拖行李、長輩小孩、步行多、曝曬等 |
| `trafficRisk` | string[] | 交通風險 | 渡輪、遠郊、跨縣市、轉乘不確定等 |
| `safeRecoveryHubs` | string[] | 安全回收點 | 放 `hubId`，不寫詳細站牌與班次 |
| `nearbySafeDirections` | string[] | 順路可玩方向 | 只放方向，不承諾最短路線 |
| `possibleButDetourDirections` | string[] | 可玩但較繞方向 | 必須搭配保守提醒 |
| `notRecommendedDirections` | string[] | 不建議硬接方向 | 避免使用者越走越遠 |
| `needsReview` | object | 未確認項目 | 站牌、動線、班距、末班等需官方確認 |
| `sourceDocs` | string[] | 來源文件 | 指向 P0 或資料審核文件 |

建模注意：

1. `publicVisible: false` 可用於內部辨識點，例如轉運站或交通主幹候選。
2. 不得放未驗證餐廳、未驗證店家或店家排名。
3. 未知地點不得硬塞成已知景點；只能進入未知地點備援規則。

## 6. `rescue-hubs` 欄位設計

`rescue-hubs` 用來定義交通回收點。第一版只描述「回收方向」與「需要查官方資訊」，不描述確定班次。

| 欄位 | 型別草案 | 用途 | 第一版規則 |
|---|---|---|---|
| `hubId` | string | 回收點唯一 ID | 使用穩定英文 kebab-case |
| `hubName` | string | 回收點名稱 | 例如高雄車站、左營／高鐵左營、旗山轉運站 |
| `hubType` | string | 回收點類型 | 例如 `rail`、`mrt`、`ferry`、`bus-terminal`、`transfer` |
| `relatedZones` | string[] | 相關旅遊圈 | 對應 `rescue-zones.zoneId` |
| `recoveryDirection` | string | 回收方向 | 例如「先回高雄車站或左營方向」 |
| `officialInfoRequired` | string[] | 需要官方確認資料 | 路線、站牌、方向、班距、末班、營運公告等 |
| `allowedDisplayText` | string[] | 允許前台顯示文字 | 保守方向、查官方資訊、不要再加遠點 |
| `forbiddenDisplayText` | string[] | 禁止前台顯示文字 | 一定有車、一定趕得上、固定末班等 |
| `needsReview` | object | 未確認項目 | 高風險交通資料必填 |
| `sourceDocs` | string[] | 來源文件 | 指向 P0 查證文件或資料來源說明 |

建模注意：

1. P0 回收點可以納入第一版，但必須保留官方資訊提醒。
2. 渡輪、台鐵、客運、轉運站的時刻、方向與站牌不能猜。
3. 若回收點牽涉跨縣市，`allowedDisplayText` 必須包含「先確認今晚住哪裡或是否一定回高雄」。

## 7. `rescue-rules` 欄位設計

`rescue-rules` 用來定義備援情境規則。它不是 AI 排程，也不是 MaaS。

| 欄位 | 型別草案 | 用途 | 第一版規則 |
|---|---|---|---|
| `ruleId` | string | 規則唯一 ID | 例如 `weather-rain-risk`、`cross-county-recovery` |
| `scenario` | string | 備援情境 | 位置、時間、天氣、體力、心情、跨縣市、未知地點 |
| `triggerCondition` | string | 觸發條件 | 使用保守條件描述，不寫精準定位 |
| `requiredUserQuestion` | string[] | 必問問題 | 例如剩餘時間、體力、是否要回高雄、今晚住哪裡 |
| `priorityLogic` | string[] | 優先判斷順序 | 先安全回收，再判斷是否繼續玩 |
| `allowedOutput` | string[] | 允許輸出 | 分級方向、保守提醒、官方資訊優先 |
| `forbiddenOutput` | string[] | 禁止輸出 | 固定路線、固定站牌、末班、一定趕得上 |
| `conservativeReminder` | string | 保守提醒文案 | 用於結果卡或風險提醒 |
| `needsReview` | object | 未確認項目 | 涉及交通細節一律標記 |
| `sourceDocs` | string[] | 來源文件 | 指向規格、審核表或 P0 文件 |

建模注意：

1. 跨縣市備援規則要先問今晚住哪裡與是否一定回高雄。
2. 未知地點備援規則不得假裝知道使用者所在景點。
3. 天氣備援只能使用靜態風險或已接資料來源的保守判斷，第一版不承諾即時天氣準確。

## 8. `rescue-result` 欄位設計

`rescue-result` 是前台結果的輸出結構草案。第一版輸出應短、清楚、保守，不塞完整交通教學。

| 欄位 | 型別草案 | 用途 | 第一版規則 |
|---|---|---|---|
| `currentAssessment` | string | 當前狀況判斷 | 說明使用者大概在哪一圈與主要風險 |
| `riskReminder` | string | 風險提醒 | 聚焦天氣、體力、交通或跨縣市風險 |
| `nearbySafeOptions` | object[] | 順路可玩 | 每個項目只寫方向與短理由 |
| `possibleButDetourOptions` | object[] | 可玩但較繞 | 必須清楚標示較繞原因 |
| `notRecommendedButUserCanDecide` | object[] | 不建議但可自行決定 | 必須說明不建議原因 |
| `safeRecoveryDirection` | string | 安全回收方向 | 不寫固定路線與班次 |
| `officialInfoReminder` | string | 官方資訊提醒 | 明確要求查官方公告或現場資訊 |
| `needsReviewLabels` | string[] | Needs review 標籤 | 讓內部知道哪些資訊不可當承諾 |

輸出原則：

1. 第一句先降低風險，不鼓勵越走越遠。
2. 三級建議必須明確分區，不得把不建議方向包裝成推薦。
3. 涉及交通回收時，必須附官方資訊提醒。
4. 不得輸出固定班次、固定末班、固定站牌或一定趕得上的承諾。

## 9. 共用欄位規則

共用命名規則：

1. ID 欄位使用英文 kebab-case。
2. 顯示名稱使用繁體中文。
3. 方向類欄位使用短句，不寫長篇文章。
4. 風險類欄位使用陣列，方便未來前台挑選顯示。
5. `sourceDocs` 必須列出 repo 內文件名稱，不放外部網址作為唯一來源。

共用風險分類建議：

| 風險類型 | 可用值草案 |
|---|---|
| 天氣 | `rain`、`wind`、`heat`、`typhoon`、`outdoor-exposure` |
| 體力 | `long-walk`、`luggage`、`elderly`、`children`、`fatigue` |
| 交通 | `ferry`、`rail`、`bus`、`remote`、`cross-county`、`transfer-unclear` |
| 資訊 | `schedule-unverified`、`last-service-unverified`、`official-notice-required` |

共用來源文件規則：

1. 規格來源可引用 `rescue-mode-spec-v0.1.md`。
2. 資料審核來源可引用 `rescue-mode-data-review-v0.1.md`。
3. 優先清單可引用 `rescue-mode-needs-review-priority-v0.1.md`。
4. P0 施工摘要可引用 `rescue-mode-p0-summary-v0.1.md`。
5. P0 交通風險必須引用對應 P0 查證文件。

## 10. Needs review 標記規則

`needsReview` 建議使用一致結構，未來轉 JSON 前再確認實際格式。

欄位概念：

| 欄位 | 用途 |
|---|---|
| `hasNeedsReview` | 是否仍有未確認項目 |
| `items` | 未確認項目清單 |
| `reason` | 為什麼不能當成確定資料 |
| `requiredSource` | 需要查證的官方來源類型 |
| `blockingLevel` | 是否阻擋第一版施工 |

標記規則：

1. 路線編號未確認：Needs review。
2. 站牌名稱未確認：Needs review。
3. 上下車方向未確認：Needs review。
4. 班距未確認：Needs review。
5. 末班未確認：Needs review。
6. 是否即時營運未確認：Needs review。
7. 是否一定銜接高鐵、台鐵、客運或渡輪：Needs review。
8. 若資料會影響安全回收，`blockingLevel` 應標為 `blocks-confirmed-transport-detail`，但不一定阻擋第一版方向型施工。

第一版可施工但需標 Needs review 的情況：

1. 可描述「回收方向」。
2. 可描述「主要交通點」。
3. 可提醒「請查官方資訊」。
4. 不可描述「搭哪一路、哪一站、幾點末班」。

## 11. 不可進入 JSON 的資料

以下資料在未經官方確認前，不得進入 JSON 作為確定值：

1. 固定路線。
2. 固定站牌。
3. 固定上下車方向。
4. 固定班距。
5. 固定末班。
6. 即時到站。
7. 現在一定有車。
8. 現在一定有船。
9. 一定趕得上。
10. 固定步行時間。
11. 未驗證店家。
12. 未驗證餐廳排名。
13. 非官方來源整理出的高風險交通承諾。
14. 把小琉球船班包裝成東港回高雄路線。
15. 把遠郊或跨縣市地點包裝成高雄市區順路短線。

## 12. 第一版資料建模邊界

第一版只做：

1. 靜態旅遊圈。
2. 靜態辨識點。
3. 安全回收點候選。
4. 順路可玩、可玩但較繞、不建議但可自行決定。
5. 靜態風險提醒。
6. 官方資訊優先文案。
7. Needs review 標記。
8. 來源文件追溯。

第一版不做：

1. 即時定位。
2. Google Maps API。
3. TDX 即時 API。
4. 即時天氣判斷。
5. 即時班次。
6. 末班顯示。
7. 班距顯示。
8. 完整 MaaS。
9. AI 自動排完整行程。
10. 未驗證店家推薦。

第一版資料模型應支援未來擴充，但不得提前把未驗證資料放成確定欄位。

## 13. 未來轉 JSON 前檢查清單

轉 JSON 前必須確認：

1. 每個 `zoneId` 是否唯一且穩定。
2. 每個 `placeId` 是否唯一且對應正確 `zoneId`。
3. 每個 `hubId` 是否唯一且可被 `rescue-zones` 或 `rescue-places` 引用。
4. 每個 `sourceDocs` 是否對應 repo 內實際文件。
5. P0 項目是否都保留 Needs review。
6. 是否沒有寫入固定路線。
7. 是否沒有寫入固定站牌。
8. 是否沒有寫入固定班距。
9. 是否沒有寫入固定末班。
10. 是否沒有寫入現在一定有車或一定有船。
11. 是否沒有寫入一定趕得上。
12. 是否沒有把遠郊或跨縣市方向包裝成高雄市區短線。
13. 是否每個結果都可輸出三級建議。
14. 是否每個高風險交通結果都附官方資訊提醒。
15. 是否保留「不要害旅人越走越遠」。

轉 JSON 前建議由王王與阿梟檢查：

1. 檔案範圍是否只有資料檔。
2. 是否沒有改首頁主流程。
3. 是否沒有改已驗證功能。
4. 是否沒有新增即時 API 或定位。
5. 是否沒有新增前台假功能。

## 14. 王王結論

備援模式第一版可以進入資料建模討論，但只能做保守型資料模型。

王王判斷：

1. `rescue-zones` 負責旅遊圈與方向收斂。
2. `rescue-places` 負責辨識點，不負責推薦店家。
3. `rescue-hubs` 負責交通回收點，不負責班次承諾。
4. `rescue-rules` 負責保守判斷，不負責完整 AI 排程。
5. `rescue-result` 負責把結果分級說清楚，不負責保證最短路線或一定趕得上。

這份資料模型草案可以作為下一階段 Markdown-to-JSON 的討論基礎。

但在 TDX、台鐵、高鐵、客運、渡輪或其他官方資料確認前，任何路線編號、站牌、方向、班距、末班、即時到站與是否趕得上，都不得變成前台確定答案。

最終底線仍然是：不要害旅人越走越遠。
