<?php
/**
 * Template for displaying pages
 *
 * @package flex-theme
 */
get_header();
?>
<style>
    #headerimg, #footer {
        display: none;
    }
    #header ~ hr {
        display: none;
    }
</style>
<main id="primary" class="site-main">
    <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
        <header class="entry-header">
            <?php get_template_part( 'template-parts/content/entry-header' ); ?>
        </header>
        <div class="entry-content">
            <?php
            the_content();
            wp_link_pages();
            ?>
            <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/work-calendar/CSS/Style.css">
                <header>
                    <h1>ĐĂNG KÝ LỊCH LÀM VIỆC </h1>
                </header>

                <div class="admin-options">
                    <button id="personalBtn" class="active">Cá nhân</button>
                    <button id="allUsersBtn">Tổng hợp lịch</button>
                </div>

                <!-- Phần cá nhân -->
                <section id="personalView" class="view-section active-view">
                <span id="loggedInUserName" style="display: none;"><?php echo wp_get_current_user()->display_name; ?></span>
                        <form action="/wordpress/" method="get" class="form-container">
               
                            <div class="form-group">
                                <label for="selectDate">Chọn ngày bắt đầu tuần:</label>
                                <input type="date" id="selectDate" name="selectDate" value="<?php echo isset($_GET['selectDate']) ? esc_attr($_GET['selectDate']) : ''; ?>">
                            </div>
                
                            <button type="button" id="generateSchedule">Tạo lịch</button>
                            <button type="submit" id="loadScheduleBtn">Xem lịch</button>
                        </form>
                
                        <div id="scheduleContainer" style="display: none;">
                            <div class="form-container">
                                <h2>Lịch làm việc tuần <span id="weekRange"></span></h2>
                                <table class="schedule-table" id="scheduleTable">
                                    <thead>
                                        <tr>
                                            <th>Thứ</th>
                                            <th>Ca làm việc</th>
                                        </tr>
                                    </thead>
                                    <tbody id="scheduleBody">
                                        <!-- Dùng mã PHP get value trên form submit selectDate -->
                                        <!-- Kết nối database và select thông tin đã đăng ký theo giá trị form submit -->
                                        <!-- Sau khi có kết quả lấy lên từ database thì hiển thị ra table -->
                                        <?php 
                                        if (isset($_GET['selectDate'])) {
                                            
                                                $current_user = wp_get_current_user();
                                                $user_id = $current_user->ID;

                                                // Ngày được chọn
                                                $startDate = sanitize_text_field($_GET['selectDate']);

                                                $date = new DateTime($selectDate);
                                                $dayOfWeek = $date->format('w'); // Chủ nhật = 0, Thứ 2 = 1, ..., Thứ 7 = 6
                                                $startOfWeek = clone $date;
                                                $startOfWeek->modify('-' . ($dayOfWeek == 0 ? 6 : $dayOfWeek - 1) . ' days');
                                                $endOfWeek = clone $startOfWeek;
                                                $endOfWeek->modify('+5 days');

                                                $startWeekStr = $startOfWeek->format('Y-m-d');
                                                $endWeekStr = $endOfWeek->format('Y-m-d');

                                                // Tên bảng trong database
                                                $table_name = $wpdb->prefix . 'work_calenda';

                                                // Truy vấn lịch theo user_id + ngày
                                                $row = $wpdb->get_row(
                                                    $wpdb->prepare(
                                                        "SELECT * FROM $table_name WHERE userID = %d AND StartWeek = %s AND EndWeek = %s",
                                                        $user_id,
                                                        $startWeekStr,
                                                        $endWeekStr
                                                    )
                                                );

                                                if ($row) {
                
                                                    // $shifts1 = $row->Mo;
                                                    // $shifts2 = $row->Tue;
                                                    // $shifts3 = $row->Wed;
                                                    // $shifts4 = $row->Th;
                                                    // $shifts5 = $row->Fr;
                                                    // $shifts6 = $row->Sa;
                                                    // echo "<tr><td>Thứ 2</td><td>$shifts1</td></tr>";
                                                    // echo "<tr><td>Thứ 3</td><td>$shifts2</td></tr>";
                                                    // echo "<tr><td>Thứ 4</td><td>$shifts3</td></tr>";
                                                    // echo "<tr><td>Thứ 5</td><td>$shifts4</td></tr>";
                                                    // echo "<tr><td>Thứ 6</td><td>$shifts5</td></tr>";
                                                    // echo "<tr><td>Thứ 7</td><td>$shifts6</td></tr>";

                                                        $days = ['Mo' => 'Thứ 2', 'Tue' => 'Thứ 3', 'Wed' => 'Thứ 4', 'Th' => 'Thứ 5', 'Fr' => 'Thứ 6', 'Sa' => 'Thứ 7'];

                                                        foreach ($days as $key => $label) {
                                                            $shift = isset($row->$key) ? esc_html($row->$key) : '—';
                                                            echo "<tr><td>$label</td><td>$shift</td></tr>";
                                                        }
                                                        echo "<script>  
                                                        document.getElementById('scheduleContainer').style.display = 'block';
                                                        document.getElementById('weekRange').innerText ='lịch làm việc tuần của bạn';
                                                        </script>";
                                                } else {
                                                    echo "<tr><td colspan='2'>Không có dữ liệu lịch làm việc.</td></tr>";
                                                }
                                            }
                                        ?>
                                    </tbody>
                                </table>
                                <form id="scheduleFormdata" action="/wordpress/submit-form" method="POST">
                                    <input type="hidden" id="formAction" name="action" value="">
                                    <input type="hidden" id="hiddenUserID" name="user_id" value="<?php echo get_current_user_id(); ?>">
                                    <input type="hidden" id="hiddenSelectDate" name="startDate" value="<?php echo isset($_GET['selectDate']) ? esc_attr($_GET['selectDate']) : ''; ?>">
                                    <input type="hidden" id="hiddenStartOfWeek" name="startOfWeek" value="">
                                    <input type="hidden" id="hiddenEndOfWeek" name="endOfWeek" value="">
                                    <input type="hidden" id="hiddenShifts" name="shifts">
                                    <button type="submit" id="saveSchedule">Lưu lịch</button>
                                    <button type="submit" id="clearSchedule">Xoá lịch</button>
                                    <!-- <div class="success-message" id="successMessage">Lịch đã được lưu!</div> -->
                                </form>
                            </div>
                        </div>
                </section>

                <!-- Phần xem tất cả -->
                <section id="allUsersView" style="display:none;">
                    <div class="filter-container">
                        <label for="filterWeek">Lọc theo tuần:</label>
                        <input type="week" id="filterWeek">
                        <button id="applyFilter">Áp dụng</button>
                    </div>
                    
                    <h2>Tổng hợp lịch làm việc</h2>
                    <div id="allSchedulesContainer">
                    </div>
                </section>
        </div>
        <script src="<?php echo get_template_directory_uri(); ?>/work-calendar/JS/lichcanhan.js"></script>
        <?php if ( get_edit_post_link() ) : ?>
            <footer class="entry-footer">
                <?php edit_post_link(); ?>
            </footer>
        <?php endif; ?>
    </article>
</main>
<?php get_footer(); ?>