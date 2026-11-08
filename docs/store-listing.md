# ChannelFlow 1.3.2 — Chrome Web Store copy

## Chrome Web Store link
User-provided listing: https://chromewebstore.google.com/detail/channelflow/lalhkogbfignmboodhenagmjmciaainc
Extension ID: lalhkogbfignmboodhenagmjmciaainc
Use this link in the GitHub README and release notes. The listing version and publication status have not been independently verified.

## English short description
Continuous playback on YouTube and YouTube Music, with same-channel, queue and artist controls.

## English full description
Keep videos and music flowing with ChannelFlow.

On YouTube, automatically open another video from the same channel when the current video ends. Prefer the highest available video quality up to 4K and confirm recognized inactivity prompts.

On YouTube Music, choose how to continue listening:
- Queue / playlist: continue your current queue and wrap through loaded tracks when needed.
- Same artist: select a loaded queued track sharing an artist ID with the current song.
- Same channel: verify the uploader channel and select a matching loaded track.

Matching modes can replay matching loaded tracks when no unvisited match remains. Queue availability and playback are still subject to YouTube, browser and network restrictions. Open Up next if queue data is unavailable. The extension does not bypass Premium restrictions. The 4K preference applies to regular YouTube, not Music audio quality.

Features include independent video/music switching settings, manual Next now, a clear-history control, English/Vietnamese interface localization, and a light popup that scales to the available screen area.

Settings stay in local extension storage. Up to 1,000 opened track/video IDs per site tab session are stored in site-origin sessionStorage. In Music same-channel mode, public YouTube watch pages are requested without account credentials to verify uploader identities. Data is not sent to the developer or analytics services. See the published privacy policy for details.

ChannelFlow is independent and is not affiliated with or endorsed by YouTube or Google.

## Single purpose
ChannelFlow helps users continue watching videos and listening to music on YouTube services by selecting the next item according to the current queue, artist or uploader channel, with playback preferences supporting that continuous listening and viewing experience.

## Storage permission justification
ChannelFlow uses chrome.storage.local to save automatic video/music switching preferences, the Music playback mode, the inactivity-prompt confirmation preference and the automatic video quality preference. Settings persist locally between sessions and are not sent to the developer.

## Host access justification
ChannelFlow runs on https://www.youtube.com/* and https://music.youtube.com/* to detect playback completion, read public player and loaded queue metadata, and activate existing playback controls. Music same-channel mode requests public www.youtube.com watch pages without account credentials to verify uploader channel IDs before selecting a matching track. No access to unrelated sites is requested.

## Remote code
No remotely hosted executable code is used. All JavaScript is bundled with the extension. YouTube HTML is parsed only for public JSON metadata.

## Vietnamese short description
Phát liên tục trên YouTube và YouTube Music; chọn cùng kênh, hàng đợi hoặc cùng nghệ sĩ.

## Mô tả tiếng Việt
ChannelFlow giúp xem video và nghe nhạc liền mạch trên YouTube và YouTube Music.

Trên YouTube, tự mở video khác cùng kênh khi video hiện tại kết thúc; có tùy chọn chất lượng cao nhất tối đa 4K và tự xác nhận thông báo tạm dừng do không tương tác.

Trên YouTube Music, chọn phát tiếp theo hàng đợi/playlist, cùng nghệ sĩ hoặc cùng kênh đăng tải. Tiện ích tìm trong danh sách đã tải và có thể phát lại bài phù hợp khi hết lượt. Mở Tiếp theo để Music tải hàng đợi nếu chưa đọc được dữ liệu.

Có nút Chuyển ngay và Xóa lịch sử, cài đặt chuyển video/nhạc riêng, giao diện sáng Anh–Việt tự theo ngôn ngữ Chrome và tự co theo màn hình.

Không nâng độ phân giải nguồn hay mở khóa Premium. Chất lượng 4K chỉ áp dụng cho YouTube thường. Phát liên tục còn phụ thuộc mạng, trình duyệt, tài khoản, nội dung và giao diện YouTube.

Cài đặt được lưu cục bộ. Tối đa 1.000 ID video/bài đã mở mỗi phiên tab được lưu trong sessionStorage thuộc nguồn trang. Chế độ cùng kênh trên Music yêu cầu trang YouTube công khai không kèm thông tin đăng nhập để kiểm tra kênh đăng tải. Không gửi dữ liệu tới nhà phát triển hay dịch vụ phân tích. Xem chính sách riêng tư công khai để biết chi tiết.

ChannelFlow là tiện ích độc lập, không liên kết hay được bảo trợ bởi YouTube hoặc Google.

## Publishing notes
- Upload ChannelFlow.zip version 1.3.2 with manifest.json at the archive root.
- The update adds Music site access and a background worker for public uploader verification. Review the new permission declarations against the current implementation.
- Update the public privacy policy using channelflow-privacy-policy.md; the local file is not itself a public URL.
- Browser tests used local fixtures and a real Chrome rendering engine. Live verification on the actual signed-in YouTube Music service remains pending.
