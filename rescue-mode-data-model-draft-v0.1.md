# 備援模式資料建模草案 v0.1

本文件整理「一路玩高雄 / 高雄不開車自由行助手」備援模式第一版的資料模型草案。

本文件不是 JSON、不是功能施工、不是 API 設計、不是即時定位設計。它只用來把備援模式研究資料收斂成未來可轉 JSON 的資料結構。

## 1. 文件目的

本文件目的：

1. 定義備援模式第一版最小資料模型。
2. 把第一批 JSON 收斂成 5 張資料表。
3. 明確排除第一版用不到、重複、容易誤導交通判斷或會讓 JSON 過肥的欄位。
4. 保留「不要害旅人越走越遠」作為資料建模最高原則。
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

推薦行程可以存在，但不能假設使用者一定照走。

第一版核心不是固定行程表，而是：

> 推薦行程 + 不開車旅遊接續引擎。

備援模式是接續引擎中的一種狀況：當使用者太累、下雨、時間晚、交通不順或想收回行程時使用。

使用者可能前後顛倒、南北東西亂跑、臨時換更遠景點。因此資料模型不能只知道單點在哪裡，也要能判斷旅遊圈之間能不能接。

系統必須能判斷：

1. `currentZone`
2. `targetZone`
3. 中間交通主幹
4. 是否順路
5. 是否較繞
6. 是否不建議
7. 替代方向
8. 安全回收方向

第一版資料建模採保守原則：

1. 用「方向」取代「精準路線」。
2. 用「主要交通回收點」取代「固定站牌」。
3. 用「官方資訊優先」取代「確定班次」。
4. 用「Needs review」保留尚未確認的交通細節。
5. 用「分級建議」避免把旅人推往更遠、更危險或更不確定的方向。
6. 第一版用不到的欄位先刪除。
7. 不能直接產生前台結果的欄位先刪除。
8. 重複表達的欄位合併。
9. 會誘導 Codex 猜交通資訊的欄位刪除。
10. 會讓 JSON 太肥的欄位刪除。

第一版允許建模：

1. 旅遊圈名稱與圈類型。
2. 核心辨識點。
3. 安全回收點候選。
4. 順路可玩方向。
5. 可玩但較繞方向。
6. 不建議硬接方向。
7. 天氣、體力、交通風險標籤。
8. 保守提醒文案。
9. Needs review 標記與來源文件。

第一版不得建模成確定值：

1. 固定路線。
2. 固定站牌。
3. 固定班距。
4. 固定末班。
5. 現在一定有車。
6. 現在一定有船。
7. 一定趕得上。
8. 即時營運狀態。
9. 未驗證店家或商家排名。

## 3. 第一版資料模型總覽

第一批 JSON 最少需要 5 張資料表：

| 資料表 | 用途 | 第一版定位 |
|---|---|---|
| `rescue-zones` | 定義旅遊圈、回收點與三種分級方向 | 核心表 |
| `rescue-places` | 定義備援辨識點與所屬旅遊圈 | 輔助辨識表 |
| `rescue-hubs` | 定義交通回收點與回收方向 | 安全回收表 |
| `zone-connections` | 定義旅遊圈之間的接續關係與推薦等級 | 接續引擎核心表 |
| `rescue-rules` | 定義備援情境、必問問題與保守提醒 | 判斷規則表 |

`rescue-result` 不做靜態資料表。

`rescue-result` 只作為前台輸出格式，由 `rescue-zones`、`rescue-places`、`rescue-hubs`、`zone-connections` 與 `rescue-rules` 組合產生。

資料關係：

1. `rescue-places` 透過 `zoneId` 連到 `rescue-zones`。
2. `rescue-zones` 透過 `safeRecoveryHubs` 連到 `rescue-hubs`。
3. `zone-connections` 透過 `fromZoneId` 與 `toZoneId` 判斷旅遊圈之間的接續等級。
4. `rescue-rules` 根據使用者情境、目前旅遊圈與目標旅遊圈，決定輸出分級建議。
5. 每筆資料都必須可追溯到 `sourceDocs`。

## 4. `rescue-zones` 欄位設計

`rescue-zones` 用來定義旅遊圈。它不是景點清單，而是備援模式判斷「使用者現在大概在哪一圈，應該收斂還是繼續玩」的基礎資料。

第一版欄位：

| 欄位 | 型別草案 | 用途 | 第一版規則 |
|---|---|---|---|
| `zoneId` | string | 旅遊圈唯一 ID | 使用穩定英文 kebab-case，例如 `cijin-gushan` |
| `zoneName` | string | 旅遊圈名稱 | 使用前台可理解名稱，例如「旗津／鼓山渡輪」 |
| `zoneType` | string | 圈類型 | 例如 `urban-core`、`harbor`、`suburban`、`remote`、`cross-county` |
| `safeRecoveryHubs` | string[] | 安全回收點 | 放 `hubId`，不寫固定路線與班次 |
| `nearbySafeDirections` | string[] | 順路可玩方向 | 產生「順路可玩」結果 |
| `possibleButDetourDirections` | string[] | 可玩但較繞方向 | 產生「可玩但較繞」結果 |
| `notRecommendedDirections` | string[] | 不建議硬接方向 | 產生「不建議但可自行決定」結果 |
| `riskTags` | string[] | 風險標籤 | 合併天氣、交通、體力與資訊風險 |
| `needsReview` | object | 未確認項目 | 交通細節、官方來源與高風險承諾必須標記 |
| `sourceDocs` | string[] | 來源文件 | 只存文件 id 或檔名，不存長篇來源說明 |

本表移除欄位：

| 移除欄位 | 移除原因 |
|---|---|
| `representativePlaces` | 可由 `rescue-places` 反查，避免重複存一份 |
| `suitableUseCases` | 太泛，容易變成標籤牆，不能直接保護旅人安全 |
| `weatherRisks` | 合併為 `riskTags` |
| `trafficRisks` | 合併為 `riskTags` |

建模注意：

1. P0 遠郊與跨縣市圈必須把 `zoneType` 標成 `remote` 或 `cross-county`。
2. 旗津／鼓山渡輪可建模為港邊渡輪圈，但渡輪班距、船班與末班都要放在 `needsReview`。
3. 旗山／美濃、東港／華僑市場、恆春／墾丁、屏東市／潮州不能被當成高雄市區短線。

## 5. `rescue-places` 欄位設計

`rescue-places` 用來定義備援模式可辨識的地點。它不是前台景點推薦榜，也不是餐廳資料庫。

第一版欄位：

| 欄位 | 型別草案 | 用途 | 第一版規則 |
|---|---|---|---|
| `placeId` | string | 地點唯一 ID | 使用穩定英文 kebab-case |
| `placeName` | string | 地點名稱 | 使用使用者可辨識名稱 |
| `zoneId` | string | 所屬旅遊圈 | 必須對應 `rescue-zones.zoneId` |
| `placeType` | string | 地點類型 | 例如 `station`、`market`、`harbor`、`mall`、`transfer`、`district` |
| `riskTags` | string[] | 風險標籤 | 合併天氣、體力、交通與資訊風險 |
| `overrideRecoveryHubs` | string[] | 例外回收點 | 預設跟 zone 的 `safeRecoveryHubs`，只有例外才填 |
| `needsReview` | object | 未確認項目 | 站牌、動線、班距、末班等需官方確認 |
| `sourceDocs` | string[] | 來源文件 | 只存文件 id 或檔名 |

本表移除欄位：

| 移除欄位 | 移除原因 |
|---|---|
| `publicVisible` | 第一版不做複雜前後台資料分流 |
| `suitableUseCases` | 和方向、風險與規則重複，先刪 |
| `weatherRisk` | 合併為 `riskTags` |
| `energyRisk` | 合併為 `riskTags` |
| `trafficRisk` | 合併為 `riskTags` |
| `safeRecoveryHubs` | 預設跟 zone 的 `safeRecoveryHubs`，只保留例外欄位 `overrideRecoveryHubs` |
| `nearbySafeDirections` | 由 zone 層級處理，避免每個 place 重複塞方向 |
| `possibleButDetourDirections` | 由 zone 層級處理 |
| `notRecommendedDirections` | 由 zone 層級處理 |

建模注意：

1. place 預設跟 zone 的 `safeRecoveryHubs`。
2. 只有地點回收點和所屬旅遊圈不同時，才填 `overrideRecoveryHubs`。
3. 不得放未驗證餐廳、未驗證店家或店家排名。
4. 未知地點不得硬塞成已知景點；只能進入未知地點備援規則。

## 6. `rescue-hubs` 欄位設計

`rescue-hubs` 用來定義交通回收點。第一版只描述「回收方向」，不描述確定班次。

第一版欄位：

| 欄位 | 型別草案 | 用途 | 第一版規則 |
|---|---|---|---|
| `hubId` | string | 回收點唯一 ID | 使用穩定英文 kebab-case |
| `hubName` | string | 回收點名稱 | 例如高雄車站、左營／高鐵左營、旗山轉運站 |
| `hubType` | string | 回收點類型 | 例如 `rail`、`mrt`、`ferry`、`bus-terminal`、`transfer` |
| `relatedZones` | string[] | 相關旅遊圈 | 對應 `rescue-zones.zoneId` |
| `recoveryDirection` | string | 回收方向 | 例如「先回高雄車站或左營方向」 |
| `needsReview` | object | 未確認項目 | 高風險交通資料必填 |
| `sourceDocs` | string[] | 來源文件 | 只存文件 id 或檔名 |

本表移除欄位：

| 移除欄位 | 移除原因 |
|---|---|
| `officialInfoRequired` | 和 `needsReview` 重複，且容易誘導塞路線、站牌、末班等交通細節 |
| `allowedDisplayText` | 太像文案庫，會讓 JSON 肥大 |
| `forbiddenDisplayText` | 和 Needs review、不可寫死規則重複，適合留在文件，不適合每筆 JSON |

建模注意：

1. P0 回收點可以納入第一版，但必須保留官方資訊提醒。
2. 渡輪、台鐵、客運、轉運站的時刻、方向與站牌不能猜。
3. 若回收點牽涉跨縣市，前台結果必須先問今晚住哪裡或是否一定回高雄。

## 7. `zone-connections` 欄位設計

`zone-connections` 用來定義旅遊圈之間的接續關係。

這是接續引擎核心表。沒有這張表，系統只能做單點備援；有這張表，才能處理使用者亂走、跳點、臨時改行程、前後顛倒或從某一區突然想接更遠景點的情境。

第一版欄位：

| 欄位 | 型別草案 | 用途 | 第一版規則 |
|---|---|---|---|
| `connectionId` | string | 接續關係唯一 ID | 建議用 `fromZoneId-toZoneId` 的穩定命名 |
| `fromZoneId` | string | 目前旅遊圈 | 對應 `rescue-zones.zoneId` |
| `toZoneId` | string | 目標旅遊圈 | 對應 `rescue-zones.zoneId` |
| `connectionType` | string | 接續類型 | 例如 `same-area`、`mrt-mainline`、`harbor-transfer`、`cross-county`、`remote-return` |
| `mainTransferHubs` | string[] | 中間交通主幹 | 放 `hubId`，不寫固定站牌、班距或末班 |
| `recommendedLevel` | string | 推薦等級 | 只允許 `nearby-safe`、`possible-detour`、`not-recommended` |
| `reason` | string | 判斷理由 | 短句說明為什麼順路、較繞或不建議 |
| `warning` | string | 風險提醒 | 用於提醒天氣、體力、時間晚、跨縣市或交通不確定 |
| `fallbackZoneIds` | string[] | 替代方向 | 當目標不建議時，可回收或替代的旅遊圈 |
| `needsReview` | object | 未確認項目 | 涉及交通主幹、銜接方向或官方資料時必填 |
| `sourceDocs` | string[] | 來源文件 | 只存文件 id 或檔名 |

`recommendedLevel` 只允許三種：

1. `nearby-safe`：順路可玩。
2. `possible-detour`：可玩但較繞。
3. `not-recommended`：不建議但可自行決定。

建模注意：

1. `zone-connections` 不寫固定路線。
2. `zone-connections` 不寫固定站牌。
3. `zone-connections` 不寫固定班距。
4. `zone-connections` 不寫固定末班。
5. `mainTransferHubs` 只能放交通主幹候選，不得包裝成確定轉乘。
6. 遠郊與跨縣市接回高雄時，通常應優先標 `possible-detour` 或 `not-recommended`，除非官方資料已確認且符合安全回收。
7. 若 `recommendedLevel` 是 `not-recommended`，必須填 `warning` 與 `fallbackZoneIds`。

## 8. `rescue-rules` 欄位設計

`rescue-rules` 用來定義備援情境規則。它不是 AI 排程，也不是 MaaS。

第一版欄位：

| 欄位 | 型別草案 | 用途 | 第一版規則 |
|---|---|---|---|
| `ruleId` | string | 規則唯一 ID | 例如 `weather-rain-risk`、`cross-county-recovery` |
| `scenario` | string | 備援情境 | 位置、時間、天氣、體力、心情、跨縣市、未知地點 |
| `triggerCondition` | string | 觸發條件 | 使用保守條件描述，不寫精準定位 |
| `requiredUserQuestion` | string[] | 必問問題 | 例如剩餘時間、體力、是否要回高雄、今晚住哪裡 |
| `priorityLogic` | string[] | 優先判斷順序 | 先安全回收，再判斷是否繼續玩 |
| `conservativeReminder` | string | 保守提醒文案 | 用於結果卡或風險提醒 |
| `needsReview` | object | 未確認項目 | 涉及交通細節一律標記 |
| `sourceDocs` | string[] | 來源文件 | 只存文件 id 或檔名 |

本表移除欄位：

| 移除欄位 | 移除原因 |
|---|---|
| `allowedOutput` | 太抽象，和三級建議結果重複 |
| `forbiddenOutput` | 太抽象，和 Needs review、不可寫死規則重複 |

建模注意：

1. 跨縣市備援規則要先問今晚住哪裡與是否一定回高雄。
2. 未知地點備援規則不得假裝知道使用者所在景點。
3. 天氣備援只能使用靜態風險或已接資料來源的保守判斷，第一版不承諾即時天氣準確。

## 9. `rescue-result` 輸出格式

`rescue-result` 不做靜態資料表，不進第一批 JSON。

它只是一個前台輸出格式，由 5 張資料表組合產生。

輸出格式概念：

| 輸出區塊 | 來源 | 用途 |
|---|---|---|
| 當前狀況判斷 | zone / place / rule | 說明使用者大概在哪一圈與主要風險 |
| 風險提醒 | riskTags / rule | 聚焦天氣、體力、交通或跨縣市風險 |
| 順路可玩 | zone / zone-connections | 第一級建議 |
| 可玩但較繞 | zone / zone-connections | 第二級建議 |
| 不建議但可自行決定 | zone / zone-connections | 第三級建議 |
| 安全回收方向 | hub / zone | 不寫固定路線與班次 |
| 官方資訊提醒 | rule / needsReview | 明確要求查官方公告或現場資訊 |
| Needs review 標籤 | needsReview | 內部知道哪些資訊不可當承諾 |

不進第一批 JSON 的原欄位：

1. `currentAssessment`
2. `riskReminder`
3. `nearbySafeOptions`
4. `possibleButDetourOptions`
5. `notRecommendedButUserCanDecide`
6. `safeRecoveryDirection`
7. `officialInfoReminder`
8. `needsReviewLabels`

這些都是 runtime 結果，不是靜態資料。

輸出原則：

1. 第一句先降低風險，不鼓勵越走越遠。
2. 三級建議必須明確分區，不得把不建議方向包裝成推薦。
3. 涉及交通回收時，必須附官方資訊提醒。
4. 不得輸出固定班次、固定末班、固定站牌或一定趕得上的承諾。

## 10. 共用欄位規則

共用命名規則：

1. ID 欄位使用英文 kebab-case。
2. 顯示名稱使用繁體中文。
3. 方向類欄位使用短句，不寫長篇文章。
4. `riskTags` 統一處理天氣、體力、交通與資訊風險。
5. `sourceDocs` 只存文件 id 或檔名，不存長篇來源說明。

`riskTags` 建議值草案：

| 風險類型 | 可用值草案 |
|---|---|
| 天氣 | `rain`、`wind`、`heat`、`typhoon`、`outdoor-exposure` |
| 體力 | `long-walk`、`luggage`、`elderly`、`children`、`fatigue` |
| 交通 | `ferry`、`rail`、`bus`、`remote`、`cross-county`、`transfer-unclear` |
| 資訊 | `schedule-unverified`、`last-service-unverified`、`official-notice-required` |

`sourceDocs` 規則：

1. 只存 repo 內文件 id 或檔名。
2. 不存長篇來源說明。
3. P0 交通風險必須引用對應 P0 查證文件。

## 11. Needs review 標記規則

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

## 12. 不可進入 JSON 的資料

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

以下欄位不進第一批 JSON：

1. `representativePlaces`
2. `suitableUseCases`
3. `publicVisible`
4. `officialInfoRequired`
5. `allowedDisplayText`
6. `forbiddenDisplayText`
7. `allowedOutput`
8. `forbiddenOutput`
9. `currentAssessment`
10. `riskReminder`
11. `nearbySafeOptions`
12. `possibleButDetourOptions`
13. `notRecommendedButUserCanDecide`
14. `safeRecoveryDirection`
15. `officialInfoReminder`
16. `needsReviewLabels`

## 13. 第一版資料建模邊界

第一版只做：

1. 靜態旅遊圈。
2. 靜態辨識點。
3. 安全回收點候選。
4. 順路可玩、可玩但較繞、不建議但可自行決定。
5. 靜態風險標籤。
6. 保守提醒文案。
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
11. `rescue-result` 靜態資料表。

第一版資料模型應支援未來擴充，但不得提前把未驗證資料放成確定欄位。

## 14. 未來轉 JSON 前檢查清單

轉 JSON 前必須確認：

1. 是否只建立 `rescue-zones`、`rescue-places`、`rescue-hubs`、`zone-connections`、`rescue-rules` 五張資料表。
2. 是否沒有建立 `rescue-result` 靜態資料表。
3. 每個 `zoneId` 是否唯一且穩定。
4. 每個 `placeId` 是否唯一且對應正確 `zoneId`。
5. 每個 `hubId` 是否唯一且可被 `rescue-zones` 或 `rescue-places` 引用。
6. 每個 `connectionId` 是否唯一且可連回 `fromZoneId` 與 `toZoneId`。
7. 每個 `recommendedLevel` 是否只使用 `nearby-safe`、`possible-detour`、`not-recommended`。
8. 每個 `sourceDocs` 是否對應 repo 內實際文件。
9. P0 項目是否都保留 Needs review。
10. 是否沒有寫入固定路線。
11. 是否沒有寫入固定站牌。
12. 是否沒有寫入固定班距。
13. 是否沒有寫入固定末班。
14. 是否沒有寫入現在一定有車或一定有船。
15. 是否沒有寫入一定趕得上。
16. 是否沒有把遠郊或跨縣市方向包裝成高雄市區順路短線。
17. 是否每個高風險交通結果都附官方資訊提醒。
18. 是否保留「不要害旅人越走越遠」。

轉 JSON 前建議由王王與阿梟檢查：

1. 檔案範圍是否只有資料檔。
2. 是否沒有改首頁主流程。
3. 是否沒有改已驗證功能。
4. 是否沒有新增即時 API 或定位。
5. 是否沒有新增前台假功能。

## 15. 王王結論

備援模式第一版可以進入資料建模，但第一批 JSON 必須瘦。

王王判斷：

1. 第一批 JSON 需要 `rescue-zones`、`rescue-places`、`rescue-hubs`、`zone-connections`、`rescue-rules`。
2. `zone-connections` 是接續引擎核心表，負責判斷 currentZone 到 targetZone 是否順路、較繞或不建議。
3. `rescue-result` 不做靜態資料表，只作為前台輸出格式。
4. `riskTags` 統一收斂天氣、體力、交通與資訊風險。
5. place 預設跟 zone 的 `safeRecoveryHubs`，只有例外才用 `overrideRecoveryHubs`。
6. `sourceDocs` 只存文件 id 或檔名，不存長篇來源說明。

這份資料模型草案可以作為下一階段 Markdown-to-JSON 的討論基礎。

但在 TDX、台鐵、高鐵、客運、渡輪或其他官方資料確認前，任何路線編號、站牌、方向、班距、末班、即時到站與是否趕得上，都不得變成前台確定答案。

最終底線仍然是：不要害旅人越走越遠。
