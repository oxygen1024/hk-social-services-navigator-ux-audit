# 社福懶人包

幫家屬、社工同長者由日常需要（例如「沖涼要人幫」）出發，搵到可能相關嘅香港長者服務、仲要核實嘅條件，同埋下一個可以聯絡嘅人。

## 網站

網站以 React 及 [Astryx](https://github.com/meta/astryx) 設計系統編寫，原始碼在 [`web/`](web/)，建置後輸出至 [`docs/`](docs/)，由 GitHub Pages 發布。

| 頁面 | 用途 |
|---|---|
| `index.html` | 首頁：開始問答、緊急求助電話、不知從何開始時聯絡長者中心 |
| `need.html` | 需要問答：選擇所需協助及資助／自費 |
| `results.html` | 結果：可能相關的服務、門檻、下一步及電話 |
| `services.html` | 所有服務目錄及搜尋 |
| `service.html?id=…` | 每項服務一頁：門檻、適合人士、服務內容、申請步驟、收費、聯絡 |

**更新服務資料**：全部在 [`web/src/data.js`](web/src/data.js)，每項均附社署來源網址；修改後請更新核實日期，然後重新建置。

**建置及預覽**

```bash
cd web && npm install && npx vite build
```

```bash
python3 -m http.server 8765 --directory docs
```

**自動檢查**（須先開啟上面的伺服器）

```bash
node tests/site-check.js
```

**發布**：把建置後的 `docs/` commit 並 push 至 `main`，GitHub Pages 會自動更新。

## 研究資料

| 檔案 | 內容 |
|---|---|
| [Claude 交接報告](社福懶人包_Claude交接報告.md) | 測試範圍、逐站比較、設計優先次序及結果卡示例 |
| [六站 UX 實測報告](社福懶人包_六站UX實測報告.html) | 下載 HTML 後喺瀏覽器打開，內含 12 張截圖 |
| [PRODUCT.md](PRODUCT.md) | 產品定位、用家、原則（impeccable 設計流程用） |

服務資格及安排以社署或服務單位最新資料為準。
