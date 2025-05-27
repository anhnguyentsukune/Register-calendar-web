<?php
require_once($_SERVER['DOCUMENT_ROOT'] . '/wordpress/wp-load.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $userName = $_POST['userName'] ?? '';
    $startDate = $_POST['startDate'] ?? '';
    error_log('Dữ liệu startDate request: ' .$$_POST['startDate']);
    $shifts_json = $_POST['shifts'] ?? '[]';
    $shifts_json = stripslashes($shifts_json);
    $shifts = json_decode($shifts_json, true); // chuyển thành mảng PHP
    error_log('Dữ liệu shifts_json: ' .$shifts_json);
    error_log('Dữ liệu userName: ' .$userName);
    error_log('Dữ liệu startDate: ' .$startDate);

global $wpdb;
    $table = $wpdb->prefix . 'work_calenda';
    error_log('Dữ liệu table: ' .$table);

    $current_user = wp_get_current_user();
    $userid = $current_user->ID;

    if ($action === 'delete') {
        // Xoá lịch
        error_log('Dữ liệu deleteeeeeeeeeeeeeeeeeeeeeeeeeeee: ' .$action);
        $deleted = $wpdb->delete(
            $table,
            [
                'userID' => $userid,
                'DateSelected' => $startDate
            ],
            ['%d', '%s']
        );
        error_log('Dữ liệu deleteeeeeeeeeeeeeeeeeeeeeeeeeeee: ' .$deleted);
    } else if ($action === 'save') {

        $shift_data = [
            'Mo' => sanitize_text_field($shifts[0]),
            'Tue' => sanitize_text_field($shifts[1]),
            'Wed' => sanitize_text_field($shifts[2]),
            'Th' => sanitize_text_field($shifts[3]),
            'Fr' => sanitize_text_field($shifts[4]),
            'Sa' => sanitize_text_field($shifts[5]),
        ];
       
        $exists = $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM $table WHERE userID = %s AND DateSelected = %s",
            $userid, $startDate
        ));
        error_log('Dữ liệu exists: ' .$exists);
        // Nếu chưa có thì thêm mới
        if ($exists == 0) {
            $wpdb->insert($table, array_merge([
                'userID' => $userid,
                'DateSelected' => $startDate,
            ], $shift_data));
        } else {
            // Nếu đã có thì cập nhật ca làm
            $wpdb->update(
                $table,
                $shift_data,
                [
                    'userID' => $userid,
                    'DateSelected' => $startDate
                ]
            );
        }
    }   
    wp_redirect(home_url());
    exit();
} 
?>

