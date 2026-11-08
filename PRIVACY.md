# ChannelFlow Privacy Policy

Last updated: November 8, 2026

ChannelFlow automatically opens another video from the same YouTube channel when the current video ends. It also provides controls to enable or disable automatic switching and to switch videos manually.

## Data used by the extension

YouTube Music support: ChannelFlow reads the active track ID, public artist identifiers and loaded queue entries on music.youtube.com to continue the queue or select a matching artist/uploader. It stores a separate Music switching preference and playback mode locally, and up to 1,000 opened Music track IDs in Music-origin sessionStorage. The same storage/deletion limitations described below apply to Music-origin data. In same-channel mode, the extension requests public www.youtube.com watch pages without including account credentials to verify uploader channel IDs. Up to 200 lookup results are cached temporarily in the extension content script's memory and removed when that context closes/reloads. No account information is requested by this lookup.

ChannelFlow reads the current YouTube video ID, channel ID, playback state, and public video metadata to find and verify another video from the same channel. It requests video and channel pages directly from YouTube using the browser's existing YouTube session. YouTube receives these requests and handles them under its own privacy policy: https://policies.google.com/privacy.

ChannelFlow saves the automatic switching preference locally using chrome.storage.local. It stores up to 1,000 opened video IDs in the YouTube tab's sessionStorage to avoid repeating videos during that tab session. This session history is not the browser's general browsing history. Because sessionStorage belongs to the YouTube origin, it is not private extension-only storage.

The extension uses Chrome's interface language to display English or Vietnamese. It does not send this language setting to the developer.

## Sharing and tracking

The inactivity-confirmation preferences for regular YouTube and YouTube Music are stored separately. Changing one service's setting does not change the other service's setting.

ChannelFlow stores the automatic quality preference locally in chrome.storage.local. When enabled, it reads the player's available quality levels and requests the highest supported level up to 2160p. The preference is passed as a boolean to a bundled script running in the YouTube page context; no video history or account data is passed through this settings message. Quality data is not sent to the developer.

ChannelFlow also stores the inactivity-prompt confirmation preference locally using chrome.storage.local. When enabled, it reads the visible YouTube confirmation dialog text and clicks the confirmation button only for recognized English or Vietnamese “Video paused. Continue watching?” prompts. This does not require additional permissions and the dialog text is not sent to the developer.

ChannelFlow does not send the video IDs, settings, or page content it processes to the developer or to analytics or advertising services. It does not sell user data, use analytics trackers, or load remotely hosted executable code. It does not read passwords, payment details, or browsing activity on other websites.

## Storage and user controls

The automatic switching preference remains on the device until it is changed or extension data is removed. Use “Clear this tab’s history” in the extension popup to remove the session video history. Closing the tab normally ends that session; browser session restoration may restore sessionStorage. Removing the extension does not itself guarantee removal of data stored under the YouTube origin. You can remove remaining session history using the popup before uninstalling or clear YouTube site data through browser settings.

## Permissions

- storage: saves the automatic switching preference locally.
- Access to https://www.youtube.com/*: detects playback completion, reads video and channel data, verifies the next video's channel, and opens the next video.
- Access to https://music.youtube.com/* through bundled content scripts: reads the active track and loaded queue, controls playback using existing Music player controls, and confirms recognized inactivity prompts. The extension's service worker uses its www.youtube.com host permission only for public uploader verification requested from a Music tab.

## Questions and updates

For questions, use the support or developer contact listed on ChannelFlow's Chrome Web Store listing. This policy may be updated when the extension's data practices change.

---

# Chính sách quyền riêng tư của ChannelFlow

Cập nhật lần cuối: 08/11/2026

ChannelFlow tự mở video khác trong cùng kênh YouTube khi video hiện tại kết thúc. Tiện ích có nút bật/tắt tự chuyển và chuyển video thủ công.

## Dữ liệu tiện ích sử dụng

Trên YouTube Music, ChannelFlow đọc ID bài đang phát, ID nghệ sĩ công khai và các mục hàng đợi đã tải để phát tiếp hoặc lọc theo nghệ sĩ/kênh đăng tải. Tiện ích lưu riêng lựa chọn bật/tắt chuyển nhạc và chế độ phát trên thiết bị; tối đa 1.000 ID bài đã mở được lưu trong sessionStorage thuộc nguồn Music. Giới hạn lưu trữ và xóa dữ liệu trình bày bên dưới cũng áp dụng cho nguồn Music. Ở chế độ cùng kênh, tiện ích yêu cầu các trang video công khai từ www.youtube.com mà không kèm thông tin đăng nhập để xác minh ID kênh đăng tải. Tối đa 200 kết quả tra cứu được giữ tạm trong bộ nhớ của content script và mất khi ngữ cảnh này đóng hoặc tải lại. Không yêu cầu thông tin tài khoản cho việc tra cứu này.

ChannelFlow đọc ID video, ID kênh, trạng thái phát và thông tin video công khai để tìm và kiểm tra video kế tiếp thuộc cùng kênh. Tiện ích yêu cầu trực tiếp các trang video và kênh từ YouTube, sử dụng phiên YouTube sẵn có của trình duyệt. YouTube nhận các yêu cầu này và xử lý theo chính sách riêng của Google: https://policies.google.com/privacy.

Tiện ích lưu lựa chọn bật/tắt bằng chrome.storage.local trên thiết bị. Tối đa 1.000 ID video đã mở được lưu trong sessionStorage của tab YouTube để hạn chế lặp video trong phiên. Đây không phải lịch sử duyệt web tổng quát của trình duyệt. sessionStorage thuộc nguồn YouTube, không phải vùng lưu trữ riêng chỉ extension truy cập được.

Tiện ích dùng ngôn ngữ giao diện Chrome để hiển thị tiếng Anh hoặc tiếng Việt, không gửi cài đặt ngôn ngữ cho nhà phát triển.

## Chia sẻ và theo dõi

Lựa chọn tự xác nhận thông báo tạm dừng được lưu riêng cho YouTube thường và YouTube Music. Thay đổi cài đặt của một dịch vụ không đổi cài đặt của dịch vụ còn lại.

ChannelFlow lưu lựa chọn tự chọn chất lượng bằng chrome.storage.local. Khi bật, tiện ích đọc các mức chất lượng trình phát cung cấp và yêu cầu mức cao nhất tối đa 2160p. Chỉ giá trị bật/tắt được chuyển tới mã đóng gói sẵn chạy trong ngữ cảnh trang YouTube; thông điệp cài đặt này không chứa lịch sử video hay dữ liệu tài khoản. Không gửi dữ liệu chất lượng tới nhà phát triển.

ChannelFlow cũng lưu lựa chọn tự xác nhận thông báo tạm dừng bằng chrome.storage.local. Khi bật, tiện ích đọc nội dung hộp thoại xác nhận đang hiển thị trên YouTube và chỉ bấm xác nhận thông báo tạm dừng do không tương tác được nhận diện bằng tiếng Anh hoặc Việt. Không cần quyền bổ sung và không gửi nội dung hộp thoại cho nhà phát triển.

ChannelFlow không gửi ID video, cài đặt hay nội dung trang mà tiện ích xử lý tới nhà phát triển hoặc dịch vụ phân tích, quảng cáo. Tiện ích không bán dữ liệu, không dùng công cụ theo dõi phân tích và không tải mã thực thi từ xa. Tiện ích không đọc mật khẩu, thông tin thanh toán hoặc hoạt động duyệt web trên các trang khác.

## Lưu trữ và quyền kiểm soát

Lựa chọn bật/tắt được giữ trên thiết bị cho đến khi thay đổi hoặc xóa dữ liệu tiện ích. Dùng nút “Xóa lịch sử tab này” để xóa lịch sử ID video trong phiên. Đóng tab thông thường sẽ kết thúc phiên; chức năng khôi phục phiên của trình duyệt có thể khôi phục sessionStorage. Gỡ tiện ích không bảo đảm xóa dữ liệu thuộc nguồn YouTube. Bạn có thể xóa lịch sử qua bảng tiện ích trước khi gỡ, hoặc xóa dữ liệu trang YouTube trong cài đặt trình duyệt.

## Các quyền

- storage: lưu lựa chọn bật/tắt trên thiết bị.
- Truy cập https://www.youtube.com/*: nhận biết lúc video kết thúc, đọc dữ liệu video và kênh, kiểm tra kênh của video đích và mở video kế tiếp.
- Chạy content script trên https://music.youtube.com/*: đọc bài đang nghe và hàng đợi đã tải, điều khiển phát bằng nút có sẵn trên Music và xác nhận thông báo tạm dừng được nhận diện. Service worker chỉ dùng quyền máy chủ www.youtube.com để kiểm tra kênh đăng tải công khai theo yêu cầu từ tab Music.

## Liên hệ và cập nhật

Nếu có câu hỏi, sử dụng thông tin hỗ trợ hoặc liên hệ nhà phát triển trên trang ChannelFlow tại Chrome Web Store. Chính sách có thể được cập nhật khi cách xử lý dữ liệu của tiện ích thay đổi.
