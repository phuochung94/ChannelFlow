# Changelog

## ChannelFlow 1.3.2

Continuous playback controls for YouTube and YouTube Music, with separate settings and an English/Vietnamese light interface.

### Features
- **YouTube:** same-uploader video switching, highest available quality up to 4K, recognized inactivity-prompt confirmation.
- **Music:** queue/playlist, same-artist or verified same-uploader selection; replay matching loaded tracks when needed.
- **Independent settings:** separate switching and inactivity-confirmation controls for YouTube and Music.
- **Compact popup:** YouTube above Music, content-sized height, scaling for smaller screens, and side-by-side Next now / Clear history buttons.

### Install
Prefer the [Chrome Web Store listing](https://chromewebstore.google.com/detail/channelflow/lalhkogbfignmboodhenagmjmciaainc) for normal installation.

For manual installation, download **ChannelFlow.zip** below, extract it into a permanent folder, open `chrome://extensions`, enable Developer mode, and choose Load unpacked for the folder containing `manifest.json`. Reload existing YouTube/Music tabs. This asset is the installable extension package; GitHub's automatically generated Source code archives contain the whole repository.

### Notes and validation
Music selection depends on the loaded queue; open Up next when needed. Artist and uploader matching are different modes. The 4K preference applies only to standard YouTube video playback. No Premium features are unlocked and manual Pause remains available.

Logic and browser-fixture checks cover matching, queue fallback/wrap, settings isolation, and responsive English/Vietnamese layouts. These tests are not live-service verification. Full compatibility with the live, signed-in YouTube Music service remains unverified; playback also depends on the network, browser, content availability and YouTube's implementation.

See [README](https://github.com/phuochung94/ChannelFlow#readme) and [privacy policy](https://github.com/phuochung94/ChannelFlow/blob/main/PRIVACY.md).

---

### Tiếng Việt
YouTube và Music có hai mục cài đặt riêng. Hỗ trợ chuyển video cùng kênh, chọn chất lượng tối đa 4K, xác nhận thông báo tạm dừng; Music có ba chế độ hàng đợi, cùng nghệ sĩ và cùng kênh đăng tải. Giao diện sáng Anh–Việt, tự co theo màn hình; hai nút cuối nằm cùng hàng.

Tải **ChannelFlow.zip**, giải nén, vào `chrome://extensions` và chọn Load unpacked thư mục chứa `manifest.json`, sau đó tải lại các tab. Hoặc cài qua link Chrome Web Store bên trên.

Đã kiểm thử logic và giao diện bằng dữ liệu mô phỏng trên Chrome; chưa xác minh đầy đủ trên YouTube Music thật. Nếu hàng đợi chưa tải, mở Tiếp theo. Không bảo đảm phát vô hạn khi mất mạng, bài không còn khả dụng hoặc bị giới hạn bởi trình duyệt/tài khoản.

