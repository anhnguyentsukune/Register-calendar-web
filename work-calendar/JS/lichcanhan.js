// Sự kiện chạy sau khi DOM đã load xong
document.addEventListener('DOMContentLoaded', function () {
    const role = document.body.getAttribute('data-role');
    const scheduleContainer = document.getElementById('scheduleContainer');

    // Bắt sự kiện khi nhấn nút "Lưu" để tạo lịch tạm
    document.getElementById('generateSchedule').addEventListener('click', function (event) {

        const userName = getUserName();
        const startDate = document.getElementById('selectDate').value;

        if (!startDate) {
            alert('Vui lòng nhập đầy đủ thông tin');
            return;
        }
   
        generateScheduleTable(startDate);
        scheduleContainer.style.display = 'block';
        
    });

    // Bắt sự kiện khi nhấn "Lưu lịch"
    document.getElementById('saveSchedule').addEventListener('click', function (event) {
        event.preventDefault();
    document.getElementById('formAction').value = 'save';

        saveSchedule();
    });

    // Bắt sự kiện khi nhấn "Xoá lịch"
    document.getElementById('clearSchedule').addEventListener('click', function () {
        if (confirm('Bạn chắc chắn muốn xoá lịch')) {
            document.getElementById('formAction').value = 'delete';
            clearSchedule();
        }
    });  
});

// Hàm lấy tên người dùng từ input
function getUserName() {
    const span = document.getElementById('loggedInUserName');
    return span ? span.textContent.trim() : '';
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
                shiftSelect.classList.add('disabled-shift');// hàm này có vấn đề
            }

            shiftCell.appendChild(shiftSelect);
            row.appendChild(shiftCell);
            scheduleBody.appendChild(row);
        }
    }

function formatDate(date) {
    return date.toLocaleDateString('vi-VN', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function clearSchedule() {
    document.getElementById('hiddenShifts').value = ''; // Xoá dữ liệu shifts (trong trường hợp xoá lịch không cần thiết phải có shifts)

    // Submit form
    document.querySelector("#scheduleFormdata").submit();
    // document.getElementById('scheduleBody').innerHTML = '';
    // document.getElementById('scheduleContainer').style.display = 'none';
}

function saveSchedule() {
    const shiftsvalue = [];
    document.querySelectorAll('.shift-select').forEach(select => {
        shiftsvalue.push(select.value);
    });
    document.getElementById('hiddenUserName').value = getUserName();
    document.getElementById('hiddenSelectDate').value = document.getElementById('selectDate').value;
console.log(shiftsvalue);

    document.getElementById('hiddenShifts').value = JSON.stringify(shiftsvalue);
    document.querySelector("#scheduleFormdata").submit();
}
