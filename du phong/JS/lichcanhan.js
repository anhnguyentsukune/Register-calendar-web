// Sự kiện chạy sau khi DOM đã load xong
document.addEventListener('DOMContentLoaded', function () {
    const role = document.body.getAttribute('data-role');
    const scheduleContainer = document.getElementById('scheduleContainer');

    // Bắt sự kiện khi nhấn nút "Lưu" để tạo lịch tạm
    document.getElementById('generateSchedule').addEventListener('click', function () {
        const userName = getUserName();
        const startDate = document.getElementById('selectDate').value;

        if (!userName || !startDate) {
            alert('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        generateScheduleTable(new Date(startDate));
        scheduleContainer.style.display = 'block';
    });

    // Bắt sự kiện khi nhấn "Lưu lịch"
    document.getElementById('saveSchedule').addEventListener('click', function () {
        saveSchedule();
    });

    // Bắt sự kiện khi nhấn "Xoá lịch"
    document.getElementById('clearSchedule').addEventListener('click', function () {
        if (confirm('Bạn chắc chắn muốn xoá lịch')) {
            clearSchedule();
        }
    });

    // Ẩn thông báo thành công ban đầu
    document.getElementById('successMessage').style.display = 'none';

    document.getElementById('loadScheduleBtn').addEventListener('click', function () {
        loadSchedule();
    });
});

// Hàm lấy tên người dùng từ input
function getUserName() {
    const input = document.getElementById('userName');
    return input ? input.value.trim() : '';
}

function normalizeName(name) {
    return name.trim().toLowerCase().replace(/\s+/g, '');
}

// Hàm tạo bảng lịch làm việc theo tuần bắt đầu từ startDate
function generateScheduleTable(startDate) {
    const userName = getUserName();
    const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const scheduleBody = document.getElementById('scheduleBody');
    scheduleBody.innerHTML = '';

    const startOfWeek = new Date(startDate);
    startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() + 6) % 7);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 5);

    document.getElementById('weekRange').textContent = `của ${userName} ${formatDate(startOfWeek)} đến ${formatDate(endOfWeek)}`;

    const optionFragment = document.createDocumentFragment();
    const shifts = [
        { value: "morning", text: "Ca sáng" },
        { value: "afternoon", text: "Ca chiều" },
        { value: "allday", text: "Cả ngày" },
        { value: "rest", text: "Nghỉ" }
    ];

    shifts.forEach(shift => {
        const option = document.createElement('option');
        option.value = shift.value;
        option.textContent = shift.text;
        optionFragment.appendChild(option);
    });

    for (let i = 0; i < 6; i++) {
        const currentDate = new Date(startOfWeek);
        currentDate.setDate(startOfWeek.getDate() + i);

        const row = document.createElement('tr');

        const dayCell = document.createElement('td');
        dayCell.textContent = daysOfWeek[currentDate.getDay()];
        row.appendChild(dayCell);

        const shiftCell = document.createElement('td');
        const shiftSelect = document.createElement('select');
        shiftSelect.className = 'shift-select';
        shiftSelect.appendChild(optionFragment.cloneNode(true));

        if (currentDate < startDate) {
            shiftSelect.value = 'rest';
            shiftSelect.disabled = true;
            shiftSelect.classList.add('disabled-shift');
        }

        shiftCell.appendChild(shiftSelect);
        row.appendChild(shiftCell);
        scheduleBody.appendChild(row);
    }
}

function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function clearSchedule() {
    const userName = getUserName();
    const role = document.body.getAttribute('data-role');
    const key = `schedule_${role}_${normalizeName(userName)}`;

    if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
    }

    document.getElementById('successMessage').style.display = 'none';
    alert('Đã xoá lịch làm việc!');
    document.getElementById('scheduleBody').innerHTML = '';
    document.getElementById('scheduleContainer').style.display = 'none';
}

function saveSchedule() {
    const userName = getUserName();
    const role = document.body.getAttribute('data-role');
    const startDateInput = document.getElementById('selectDate').value;
    const startDate = startDateInput ? new Date(startDateInput) : null;

    const shifts = [];
    document.querySelectorAll('.shift-select').forEach(select => {
        shifts.push(select.value);
    });

    const key = `schedule_${role}_${normalizeName(userName)}`;
    localStorage.setItem(key, JSON.stringify({
        role,
        userName,
        shifts,
        startDate: startDate ? startDate.toISOString() : null
    }));

    document.getElementById('successMessage').style.display = 'block';
    console.log('Đã lưu:', { key, shifts, startDate });
}

// Hàm tải dữ liệu lịch nếu đã có từ trước trong localStorage
function loadSchedule() {
    const userName = getUserName();
    const role = document.body.getAttribute('data-role');
    const key = `schedule_${role}_${normalizeName(userName)}`;
    const savedData = localStorage.getItem(key);

    if (savedData) {
        const { role: savedRole, shifts, startDate: savedStartDate } = JSON.parse(savedData);

        if (savedRole === role && savedStartDate) {
            const date = new Date(savedStartDate);
            document.getElementById('selectDate').value = savedStartDate.split('T')[0];
            generateScheduleTable(date);
            document.getElementById('scheduleContainer').style.display = 'block';

            const shiftSelects = document.querySelectorAll('.shift-select');
            shiftSelects.forEach((select, index) => {
                if (shifts[index]) select.value = shifts[index];
            });
        }
    } else {
        document.getElementById('scheduleContainer').style.display = 'none';
    }
}
