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
                    <h1>TRANG QUẢN TRỊ LỊCH LÀM VIỆC</h1>
                </header>

                <div class="admin-options">
                    <button id="personalBtn" class="active">Cá nhân</button>
                    <button id="allUsersBtn">Xem tất cả</button>
                </div>

                <!-- Phần cá nhân -->
                <section id="personalView" class="view-section active-view">
            
                        <form action="/wordpress/" method="get" class="form-container">
                            <div class="form-group">
                                <label for="userName">Họ và tên:</label>
                                <input type="text" id="userName" value="Y.H" readonly name="userName">
                            </div>
                
                            <div class="form-group">
                                <label for="selectDate">Chọn ngày bắt đầu tuần:</label>
                                <input type="date" id="selectDate" name="selectDate" value="<?php echo isset($_GET['selectDate']) ? esc_attr($_GET['selectDate']) : ''; ?>">
                            </div>
                
                            <button id="generateSchedule">Lưu</button>
                            <button type="submit" id="loadScheduleBtn">Xem lịch</button>
                        </form>
                
                        <div id="scheduleContainer" style="display: none;">
                            <div class="form-container">
                                <h2>Lịch làm việc tuần từ <span id="weekRange"></span></h2>
                                <table class="schedule-table" id="scheduleTable">
                                    <thead>
                                        <tr>
                                            <th>Thứ</th>
                                            <th>Ca làm việc</th>
                                        </tr>
                                    </thead>
                                    <tbody id="scheduleBody">
                                        <!-- Dùng mã PHP get value trên form submit selectDate -->
                                        <!-- Kết nối database và select thông tin đã đăng ksy theo giá trị form submit -->
                                        <!-- Sau khi có kết quả lấy lên từ database thì hiển thị ra table -->
                                        <?php 
                                        
                                        ?>
                                    </tbody>
                                </table>
                                <form id="scheduleFormdata" action="/wordpress/submit-form" method="POST">
                                    <input type="hidden" id="formAction" name="action" value="">
                                    <input type="hidden" id="hiddenUserName" name="userName">
                                    <input type="hidden" id="hiddenSelectDate" name="startDate">
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
            <script src="<?php echo get_template_directory_uri(); ?>/work-calendar/JS/lichcanhan.js"></script>
        </div>
        <?php if ( get_edit_post_link() ) : ?>
            <footer class="entry-footer">
                <?php edit_post_link(); ?>
            </footer>
        <?php endif; ?>
    </article>
</main>
<?php get_footer(); ?>