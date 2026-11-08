# ChannelFlow — 1.3.2

Phiên bản 1.3.2 hiển thị đồng thời hai mục cài đặt: YouTube ở trên, YouTube Music ở dưới. Tự chuyển và chống tạm dừng của hai dịch vụ được lưu riêng. Hai nút cuối điều khiển tab đang mở; tên dịch vụ được ghi ở dòng trạng thái. Giữ giao diện sáng, đo chiều cao theo nội dung và co khi màn hình nhỏ, không thanh cuộn.

Phiên bản 1.3.1 bỏ chiều cao cố định và vùng trạng thái tự giãn. Popup tự đo chiều cao theo nội dung, thu gọn khoảng trắng dư và co theo màn hình khi cần. Thông báo dài sẽ làm bảng cao thêm vừa đủ, không đẩy hai nút xuống cuối một vùng trống lớn.

## YouTube Music
Hỗ trợ https://music.youtube.com/ trên máy tính. Bảng tiện ích luôn hiện riêng cài đặt YouTube và Music; nút Chuyển ngay/Xóa lịch sử áp dụng cho tab đang mở.

- **Hàng đợi / playlist**: ưu tiên cơ chế chuyển bài sẵn có của Music. Nếu bài đã hết mà Music chưa chuyển sau khoảng 2 giây, thử nút Tiếp theo. Nếu không có bài kế tiếp, quay lại đầu danh sách đã tải.
- **Cùng nghệ sĩ**: chọn bài trong hàng đợi có chung ID nghệ sĩ với bài đang nghe; không đoán bằng tên gần giống. Có thể phát lại bài phù hợp khi hết lượt.
- **Cùng kênh**: kiểm tra ID kênh đăng tải từ trang video công khai trên YouTube; không coi nghệ sĩ và kênh đăng tải là một. Chỉ chọn bài đã xác minh cùng kênh. Mỗi lần xét tối đa 30 mục trong hàng đợi đã tải.
- Nếu chỉ còn bài hiện tại phù hợp và bài đã hết, tiện ích thử phát lại bài đó. Nếu không đọc được hàng đợi hoặc không có bài phù hợp, hiện thông báo; mở **Tiếp theo / Up next** để Music tải danh sách, hoặc thêm bài.
- Xử lý hộp thoại tạm dừng do không tương tác bằng tiếng Anh/Việt trên Music. Bạn vẫn có thể bấm Pause. Tắt tự chuyển của ChannelFlow không tắt cơ chế phát tiếp sẵn có của Music.
- Độ phân giải 4K chỉ dành cho YouTube thường, không đổi chất lượng âm thanh hay mở khóa tính năng Premium của Music.
- Không bảo đảm phát vô hạn khi mất mạng, bị giới hạn tài khoản, bài bị gỡ, trình duyệt chặn phát hoặc YouTube đổi giao diện. Chưa xác minh trực tiếp trên dịch vụ thật.

Music support uses the current queue, same-artist matching by public artist IDs, or same-uploader matching verified through public YouTube watch pages. Queue mode defers to Music first to avoid double skips, then attempts to advance or wrap the loaded list. Matching modes may replay matching loaded tracks. An empty or unreadable queue shows a status message. Open Up next to populate it. Music settings are independent of regular YouTube. The 4K preference is not applied to Music. Manual pause remains available. Continuous playback still depends on connectivity, availability, account/browser restrictions and YouTube's implementation.

## Giao diện / Interface
Giao diện sáng, hai nút Chuyển ngay và Xóa lịch sử nằm cùng hàng. Bảng điều khiển tự co theo vùng màn hình khả dụng, tối đa 380×530 px; không có thanh cuộn. Trên màn hình rất nhỏ, chữ và điều khiển cũng được thu nhỏ.

The light popup places Next now and Clear history side by side. It scales to the available display area up to 380×530 CSS pixels without a scrollbar. Text and controls also scale on very small displays.

Phiên bản 1.2.2 dùng giao diện sáng, nền trắng, chữ tối và điểm nhấn đỏ; giữ kích thước cố định không có thanh cuộn.

Phiên bản 1.2.1 cố định popup 380×510 px, thu gọn khoảng cách và cỡ chữ để hiển thị đủ điều khiển Anh–Việt mà không cần thanh cuộn.

## Độ phân giải cao nhất, tối đa 4K / Highest quality up to 4K
Tùy chọn mặc định bật, độc lập với tự chuyển video. Yêu cầu trình phát chọn mức cao nhất có sẵn tối đa 2160p: 4K → 1440p → 1080p → 720p → các mức thấp hơn. Không chọn 5K/8K và không nâng độ phân giải nguồn. Khi bật, tiện ích kiểm tra lại định kỳ và yêu cầu trở về mức cao nhất nếu bạn đổi xuống thấp. Tắt công tắc để tự chọn chất lượng; mức đang chọn không tự đổi về Auto. Mức chất lượng thực tế còn phụ thuộc trình phát, mạng và thiết bị. Không yêu cầu quyền mới. Dùng phương thức nội bộ của YouTube, có thể cần sửa khi YouTube thay đổi. Chưa xác minh trực tiếp trên Chrome.

Enabled by default, independently of video switching. Requests the highest available quality up to 2160p; excludes 5K/8K and does not upscale the source. While enabled, periodically reapplies the preference if quality is lowered. Disable to choose quality manually; disabling leaves the current quality in place. Actual playback quality depends on YouTube, network and device support. No new permissions. Uses internal player methods that may change. Live Chrome verification is pending.

## Chặn tạm dừng do không tương tác / Inactivity pauses
Tùy chọn mới mặc định bật, hoạt động độc lập với tự chuyển video. Tự xác nhận hộp thoại “Video paused. Continue watching?” / “Video đã tạm dừng. Tiếp tục xem?” khi video đang tạm dừng. Không ép phát khi bạn bấm Pause, không vượt giới hạn tự phát của trình duyệt. Hiện nhận diện hộp thoại tiếng Anh và tiếng Việt; phụ thuộc cấu trúc giao diện YouTube. Chưa xác minh hộp thoại thật trên Chrome.

The new option is enabled by default and independent of automatic video switching. It confirms recognized English/Vietnamese inactivity prompts while the video is paused. It does not force playback after a manual pause or bypass browser autoplay restrictions. Support depends on YouTube's dialog structure; live Chrome verification is still pending.

Phiên bản 1.0.4 bỏ quyền activeTab không cần thiết. Chỉ yêu cầu storage và chạy content script trên https://www.youtube.com/*.

ChannelFlow — Xem tiếp đúng kênh.

Phiên bản 1.0.2 đổi tên từ YouTube Cùng Kênh thành ChannelFlow; giữ nguyên chức năng và icon của bản 1.0.1.

## Cập nhật từ bản 1.0.0
Giải nén bản mới. Trong chrome://extensions, gỡ bản 1.0.0 rồi Load unpacked thư mục mới. Sau đó tải lại tất cả tab YouTube đang mở. Phiên bản 1.0.1 bổ sung đọc danh sách video kiểu lockupViewModel, kiểm tra dự phòng khi video đã kết thúc, sửa hủy tác vụ lúc mới mở trang và thêm icon 16/32/48/128 px.

## Cài vào Chrome
1. Giải nén ZIP và giữ thư mục ở vị trí cố định.
2. Mở chrome://extensions rồi bật **Developer mode / Chế độ dành cho nhà phát triển**.
3. Chọn **Load unpacked / Tải tiện ích đã giải nén**, chọn thư mục chứa manifest.json.
4. Tải lại tab YouTube. Ghim tiện ích để mở bảng điều khiển.
5. Mở một video thường, bấm phát lần đầu. Tự chuyển mặc định được bật.

## Cách hoạt động
- Khi video hết, đọc trang Video của chính kênh, chọn video đầu tiên chưa xem trong danh sách tải được, kiểm tra lại ID kênh trước khi chuyển.
- Ưu tiên thứ tự trang Video trả về (thường mới nhất trước). Không đảm bảo là video liền kề theo ngày đăng của video đang xem.
- Chỉ lấy danh sách đầu tiên YouTube gửi về, thường khoảng 30 video; chưa tải toàn bộ video của kênh. Khi hết danh sách, tiện ích dừng và hiện thông báo trong popup.
- Lịch sử theo tab, lưu tối đa 1.000 ID trong sessionStorage. Xóa lịch sử nếu muốn xem lại.
- Có nút bật/tắt và **Chuyển ngay** (nút này vẫn dùng được khi tự chuyển đã tắt).
- Khi đang bật, tiện ích tắt công tắc Autoplay gốc của YouTube để giảm xung đột. Khi tắt hoặc gỡ tiện ích, muốn dùng Autoplay gốc thì bật lại thủ công trên YouTube.
- YouTube thường chỉ hỗ trợ www.youtube.com/watch trên máy tính, chưa hỗ trợ Shorts, livestream hay trang nhúng. Hỗ trợ YouTube Music theo phần riêng bên trên.
- Không bỏ qua quảng cáo; không yêu cầu API key, không gửi dữ liệu tới máy chủ bên ngoài. Chỉ đọc trang YouTube và lưu cài đặt cục bộ.
- Chrome có thể chặn phát tự động có âm thanh: bấm Play khi cần. Playlist YouTube, tiện ích khác hoặc thay đổi giao diện YouTube có thể gây xung đột.

## Kiểm tra thực tế sau khi cài
1. Mở video ở kênh có nhiều video công khai. Tua gần cuối, để video tự chạy hết. Video mới phải thuộc cùng kênh.
2. Thử Chuyển ngay, bật/tắt, xóa lịch sử; đổi sang kênh khác rồi thử lại.
3. Khi tắt, tiện ích không tự điều hướng khi video kết thúc.
4. Thử cùng quảng cáo và khi chuyển video bằng giao diện YouTube.

Đã kiểm tra cú pháp và logic phân tích dữ liệu bằng kiểm thử tự động. Chưa xác minh chạy trực tiếp trên YouTube trong Chrome của bạn. Cấu trúc dữ liệu nội bộ YouTube có thể thay đổi.

Tài liệu cài extension: https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world

## Ngôn ngữ / Language
Giao diện, thông báo và mô tả tiện ích tự dùng tiếng Việt khi ngôn ngữ giao diện Chrome là tiếng Việt; các ngôn ngữ khác mặc định tiếng Anh. Không phụ thuộc ngôn ngữ đang chọn trên YouTube. Khởi động lại Chrome sau khi đổi ngôn ngữ giao diện, rồi tải lại tab YouTube.

The interface, status messages, and extension description follow Chrome’s UI language: Vietnamese for Vietnamese locales, English otherwise. This is independent of the YouTube language setting. Restart Chrome after changing its UI language, then reload YouTube tabs.
