# 香港社福導航

幫家屬、社工同長者由日常需要（例如「沖涼要人幫」）出發，搵到可能相關嘅香港長者服務、仲要核實嘅條件，同埋下一個可以聯絡嘅人。

## 網站

網站放喺 [`docs/`](docs/)，係純 HTML/CSS 加少量 JavaScript，唔使 build。

| 頁面 | 用途 |
|---|---|
| `index.html` | 首頁：開始問答、急事電話、唔知點開始就搵長者中心 |
| `need.html` | 需要問答：揀需要同資助／自費 |
| `results.html` | 結果：點解可能啱、仲要核實、下一步打俾邊個 |
| `services.html` | 所有長者服務、統一評估流程、虐老求助熱線 |

**更新服務資料**：全部喺 [`docs/data.js`](docs/data.js)。每項都附社署來源網址；改完記得更新 `CHECKED` 日期。

**本機預覽**

```bash
python3 -m http.server 8765 --directory docs
```

然後開 http://localhost:8765/

**自動檢查**（要先開住上面個伺服器）

```bash
node tests/site-check.js
```

**發布（GitHub Pages）**：喺 GitHub repo 嘅 Settings → Pages，Source 揀「Deploy from a branch」，Branch 揀 `main`、資料夾揀 `/docs`，撳 Save。之後每次 push 去 `main` 都會自動更新網站。

## 研究資料

| 檔案 | 內容 |
|---|---|
| [Claude 交接報告](香港社福導航_Claude交接報告.md) | 測試範圍、逐站比較、設計優先次序及結果卡示例 |
| [六站 UX 實測報告](香港社福導航_六站UX實測報告.html) | 下載 HTML 後喺瀏覽器打開，內含 12 張截圖 |
| [PRODUCT.md](PRODUCT.md) | 產品定位、用家、原則（impeccable 設計流程用） |

服務資格及安排以社署或服務單位最新資料為準。
