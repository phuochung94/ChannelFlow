# ChannelFlow

<img src="extension/icons/icon128.png" width="80" height="80" alt="ChannelFlow icon">

Continuous playback controls for **YouTube** and **YouTube Music**, in English and Vietnamese.

[Install from the Chrome Web Store](https://chromewebstore.google.com/detail/channelflow/lalhkogbfignmboodhenagmjmciaainc) · [Download a release](https://github.com/phuochung94/ChannelFlow/releases) · [Tiếng Việt](#tiếng-việt)

## Features

### YouTube

- Automatically open another video from the current uploader channel when a video ends.
- Prefer the highest available quality up to **4K / 2160p**.
- Confirm recognized inactivity prompts while keeping manual Pause available.

### YouTube Music

- Continue the current **queue or playlist**.
- Select a track sharing an **artist ID**, or verify a matching **uploader channel**.
- Replay matching loaded tracks after unvisited matches are exhausted.
- Control Music switching and inactivity confirmation independently of YouTube.

### Interface

- Separate YouTube and Music settings, always visible in that order.
- Light appearance, content-sized popup and scaling for smaller screens.
- Side-by-side **Next now** and **Clear history** actions for the active tab.
- English or Vietnamese selected through Chrome's UI language.

## Install

Use the [Chrome Web Store listing](https://chromewebstore.google.com/detail/channelflow/lalhkogbfignmboodhenagmjmciaainc) for normal installation.

To install a GitHub release manually:

1. Download `ChannelFlow.zip` from [Releases](https://github.com/phuochung94/ChannelFlow/releases).
2. Extract it into a permanent folder. Open `chrome://extensions` and enable Developer mode.
3. Click **Load unpacked** and select the folder containing `manifest.json`.
4. Reload existing YouTube and YouTube Music tabs. Start playback once when required by Chrome.

To run from source, select this repository's **extension** folder in Load unpacked. On updates, reload the extension and the site tabs, and review any requested new site access.

## Usage and limits

In Music, open **Up next** if the queue has not loaded. Queue mode lets Music advance first, then attempts a fallback after playback remains ended. Artist/channel modes select from loaded queue entries and may wrap through matching tracks.

Artist mode uses public artist identifiers; it does not guess from similar names. Uploader mode verifies public YouTube watch metadata and considers up to 30 loaded entries per attempt. Artist and uploader are different identities.

Regular YouTube selection uses the channel's initial loaded Videos list, not its entire library. Shorts, embedded players and live streams are not supported by that selection mode. The 4K option does not upscale the source, change Music audio quality or unlock Premium features.

Continuous playback depends on content availability, network, browser restrictions and YouTube's current player implementation. Disabling ChannelFlow switching does not disable YouTube Music's own queue progression. The extension does not skip ads or force playback after a manual pause.

## Privacy and permissions

See [PRIVACY.md](PRIVACY.md) for the English and Vietnamese privacy policy.

- `storage` saves playback preferences locally.
- Bundled content scripts run only on `www.youtube.com` and `music.youtube.com`.
- The `www.youtube.com` host permission lets the worker verify public uploader IDs for Music without including account credentials.
- Up to 1,000 opened IDs per site tab session are kept in site-origin sessionStorage; **Clear history** clears the active tab's history. Site-origin storage is not private extension-only storage.
- Settings and processed metadata are not sent to the developer, advertising services or analytics providers. YouTube receives the direct requests made to its service.
- All executable code is bundled locally. There is no `activeTab`, general browser-history or all-sites permission.

If this repository remains private, its privacy file is not a public policy URL. Publish the policy to an accessible HTTPS page before using it as a Store policy URL.

## Development

The extension itself has no build step or runtime package dependencies. Developer tests require Node.js; packaging uses Python 3's standard library.

```sh
node tests/test-extension.cjs
node tests/test-locales.cjs
node tests/test-keep-watching.cjs
node tests/test-quality.cjs
node tests/test-music-background.cjs
```

Or run all of the above with `npm test`.

For browser fixture tests:

```sh
npm install
npx playwright install chromium
npm run test:browser
```

Package a Chrome Web Store ZIP:

```sh
python scripts/package.py
```

The resulting `dist/ChannelFlow.zip` contains `manifest.json` at the ZIP root. Never upload the entire repository as the Store package.

Browser fixtures test Music modes and responsive popup behavior; they do **not** prove compatibility with the live, signed-in YouTube Music service. Live-service verification remains pending. Internal YouTube APIs and markup can change.

## Project layout

- `extension/`: installable Manifest V3 source, locale catalogs and icons.
- `tests/`: logic and browser fixture checks.
- `scripts/package.py`: ZIP builder with package validation.
- `docs/`: Vietnamese guide and Store listing text.
- `CHANGELOG.md`: release notes in English and Vietnamese.

## Tiếng Việt

ChannelFlow giúp phát tiếp video và nhạc trên YouTube, YouTube Music. Cài đặt **YouTube ở trên**, **Music ở dưới**, có công tắc riêng cho tự chuyển và chống tạm dừng.

- YouTube: video tiếp theo cùng kênh, tùy chọn chất lượng cao nhất tối đa 4K.
- Music: hàng đợi/playlist, cùng nghệ sĩ hoặc cùng kênh đăng tải; lặp bài phù hợp đã tải khi cần.
- Giao diện sáng Anh–Việt theo Chrome, tự co theo màn hình; hai nút Chuyển ngay và Xóa lịch sử cùng hàng.

Cài qua [Chrome Web Store](https://chromewebstore.google.com/detail/channelflow/lalhkogbfignmboodhenagmjmciaainc), hoặc tải `ChannelFlow.zip` trong Releases rồi giải nén và Load unpacked. Khi chạy từ mã nguồn, chọn thư mục `extension`. Tải lại tab sau khi cập nhật.

Music cần hàng đợi đã tải; mở **Tiếp theo** nếu tiện ích chưa đọc được danh sách. Cùng nghệ sĩ và cùng kênh là hai chế độ khác nhau. 4K chỉ áp dụng cho YouTube thường, không tăng chất lượng âm thanh Music hay mở khóa Premium. Phát liên tục còn phụ thuộc mạng, nội dung, tài khoản và trình duyệt.

Xem [hướng dẫn](docs/HUONG-DAN.md), [chính sách riêng tư](PRIVACY.md) và [nội dung hồ sơ Store](docs/store-listing.md).

ChannelFlow is independent and is not affiliated with or endorsed by YouTube or Google.
