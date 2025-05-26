document.addEventListener('DOMContentLoaded', function () {
    if (document.body.getAttribute('data-role') !== 'admin') return;

    const personalBtn = document.getElementById('personalBtn');
    const allUsersBtn = document.getElementById('allUsersBtn');
    const personalView = document.getElementById('personalView');
    const allUsersView = document.getElementById('allUsersView');

    // Kiểm tra đường dẫn hash và mở đúng view
    const currentHash = location.hash;
    if (currentHash === '#all') {
        showAllUsersView();
    } else {
        showPersonalView();
    }

    personalBtn.addEventListener('click', () => {
        location.hash = '#personal';
        showPersonalView();
    });

    allUsersBtn.addEventListener('click', () => {
        location.hash = '#all';
        showAllUsersView();
    });

    function showPersonalView() {
        // Ẩn và reset allUsersView
        allUsersView.style.display = 'none';
        allUsersView.innerHTML = `
            <div class="filter-container">
                <label for="filterWeek">Lọc theo tuần:</label>
                <input type="week" id="filterWeek">
                <button id="applyFilter">Áp dụng</button>
            </div>
            <h2>Tổng hợp lịch làm việc</h2>
            <div id="allSchedulesContainer"></div>
        `;

        personalView.style.display = 'block';
        personalBtn.classList.add('active');
        allUsersBtn.classList.remove('active');
    }

    function showAllUsersView() {
        personalView.style.display = 'none';
        allUsersView.style.display = 'block';

        allUsersView.innerHTML = `
            <div class="filter-container">
                <label for="weekDate">Chọn ngày bất kỳ trong tuần:</label>
                <input type="date" id="weekDate">
                <button id="loadSchedulesBtn">Xem lịch</button>
            </div>
            <div id="schedulesResult">Chọn ngày và nhấn "Xem lịch" để hiển thị</div>
        `;

        const today = new Date();
        document.getElementById('weekDate').valueAsDate = today;

        document.getElementById('loadSchedulesBtn').addEventListener('click', () => {
            loadAndDisplaySchedules();
        });

        allUsersBtn.classList.add('active');
        personalBtn.classList.remove('active');
    }

    function loadAndDisplaySchedules() {
        const dateInput = document.getElementById('weekDate');
        const selectedDate = new Date(dateInput.value);
        if (isNaN(selectedDate.getTime())) {
            alert('Vui lòng chọn ngày hợp lệ');
            return;
        }

        const weekData = calculateWeekRange(selectedDate);
        const schedules = getSchedulesForWeek(weekData.startDate);
        displaySchedulesTable(schedules, weekData);
    }

    function calculateWeekRange(date) {
        const startDate = new Date(date);
        startDate.setDate(date.getDate() - ((date.getDay() + 6) % 7));
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 5);
        endDate.setHours(23, 59, 59, 999);

        return {
            startDate,
            endDate,
            days: generateWeekDays(startDate)
        };
    }

    function generateWeekDays(startDate) {
        const days = [];
        for (let i = 0; i < 6; i++) {
            const day = new Date(startDate);
            day.setDate(startDate.getDate() + i);
            days.push({
                name: getDayName(day),
                date: formatDate(day)
            });
        }
        return days;
    }

    function getSchedulesForWeek(weekStartDate) {
        const weekEndDate = new Date(weekStartDate);
        weekEndDate.setDate(weekStartDate.getDate() + 5);

        const schedules = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('schedule_')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (!data || !data.startDate) continue;

                    const scheduleDate = new Date(data.startDate);
                    scheduleDate.setHours(0, 0, 0, 0);

                    if (scheduleDate >= weekStartDate && scheduleDate <= weekEndDate) {
                        if (!data.shifts || data.shifts.length !== 6) {
                            data.shifts = Array(6).fill('rest');
                        }
                        schedules.push(data);
                    }
                } catch (e) {
                    console.error('Lỗi đọc dữ liệu:', key, e);
                }
            }
        }

        return schedules;
    }

    function displaySchedulesTable(schedules, weekData) {
        const shiftText = {
            'morning': 'Ca sáng',
            'afternoon': 'Ca chiều',
            'allday': 'Cả ngày',
            'rest': 'Nghỉ'
        };

        let tableHTML = `
            <h3>Lịch làm việc tuần từ ${formatDate(weekData.startDate)} đến ${formatDate(weekData.endDate)}</h3>
            <table class="all-schedules-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        ${weekData.days.map(day => `<th>${day.name}<br>${day.date}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
        `;

        if (schedules.length === 0) {
            tableHTML += `<tr><td colspan="7" style="text-align:center;">Không có lịch làm việc nào trong tuần này</td></tr>`;
        } else {
            schedules.forEach(schedule => {
                tableHTML += `
                    <tr>
                        <td>${schedule.userName || 'Không tên'}</td>
                        ${schedule.shifts.map(shift => `<td>${shiftText[shift] || 'Nghỉ'}</td>`).join('')}
                    </tr>
                `;
            });
        }

        tableHTML += `</tbody></table>`;

        const resultContainer = document.getElementById('schedulesResult');
        if (resultContainer) {
            resultContainer.innerHTML = tableHTML;
        } else {
            console.error("Không tìm thấy container để hiển thị kết quả");
        }
    }

    function getDayName(date) {
        const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
        return days[date.getDay()];
    }

    function formatDate(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    document.body.style.display = 'block';
});
