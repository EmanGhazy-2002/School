// Global variables
let studentsData = [];
let analysisCount = Number.parseInt(
  localStorage.getItem("analysisCount") || "0"
);
let reportCount = Number.parseInt(localStorage.getItem("reportCount") || "0");
const html2pdf = window.html2pdf;

// Function to convert English numbers to Arabic
function toArabicNumbers(number) {
  const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return number.toString().replace(/\d/g, (digit) => arabicNumbers[digit]);
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  updateCounters();

  const totalGradeInput = document.getElementById("totalGrade");
  if (totalGradeInput) {
    totalGradeInput.addEventListener("input", checkAnalyzeButton);
  }
});

// Update counters on main page
function updateCounters() {
  const analysisElement = document.getElementById("analysisCount");
  const reportElement = document.getElementById("reportCount");

  if (analysisElement) {
    analysisElement.textContent = toArabicNumbers(analysisCount);
  }
  if (reportElement) {
    reportElement.textContent = toArabicNumbers(reportCount);
  }
}

// Navigation functions
function goToAnalysis() {
  console.log("[v1] goToAnalysis function called");
  try {
    if (typeof window !== "undefined" && window.location) {
      window.location.href = "analysis.html"; // ✅ اللينك الجديد
    } else {
      document.location = "analysis.html";
    }
  } catch (error) {
    console.error("[v1] Error navigating to analysis page:", error);
    try {
      window.open("analysis.html", "_self");
    } catch (error2) {
      console.error("[v1] Fallback navigation also failed:", error2);
      alert("خطأ في الانتقال إلى صفحة التحليل. يرجى المحاولة مرة أخرى.");
    }
  }
}

function goHome() {
  console.log("[v1] goHome function called");
  try {
    if (typeof window !== "undefined" && window.location) {
      window.location.href = "index.html"; // ✅ الرئيسية من غير index.html
    } else {
      document.location = "index.html";
    }
  } catch (error) {
    console.error("[v1] Error navigating to home page:", error);
    try {
      window.open("index.html", "_self");
    } catch (error2) {
      console.error("[v1] Fallback navigation also failed:", error2);
      alert("خطأ في الانتقال إلى الصفحة الرئيسية. يرجى المحاولة مرة أخرى.");
    }
  }
}

function showReports() {
  console.log("[v0] showReports function called");
  try {
    if (typeof window !== "undefined" && window.location) {
      window.location.href = "performance-evidence.html";
    } else {
      document.location = "performance-evidence.html";
    }
  } catch (error) {
    console.error("[v0] Error navigating to performance evidence page:", error);
    try {
      window.open("performance-evidence.html", "_self");
    } catch (error2) {
      console.error("[v0] Fallback navigation also failed:", error2);
      alert("خطأ في الانتقال إلى صفحة شواهد الأداء. يرجى المحاولة مرة أخرى.");
    }
  }
}

// Show manual input section
function showManualInput() {
  document.getElementById("manualInputSection").style.display = "block";
  document.getElementById("manualInputButtonContainer").style.display = "none";
}

// Add student manually
function addStudent() {
  const nameInput = document.getElementById("studentName");
  const gradeInput = document.getElementById("studentGrade");
  const totalGrade = Number.parseFloat(
    document.getElementById("totalGrade").value
  );

  if (!gradeInput.value || !totalGrade) {
    alert("يرجى إدخال الدرجة والدرجة النهائية");
    return;
  }

  const studentName = nameInput.value.trim() || ` ${studentsData.length + 1}`;

  const studentGrade = Number.parseFloat(gradeInput.value);
  if (studentGrade > totalGrade) {
    alert("الدرجة لا يمكن أن تكون أكبر من الدرجة النهائية");
    return;
  }

  const student = {
    name: studentName,
    grade: studentGrade,
  };

  studentsData.push(student);

  nameInput.value = "";
  gradeInput.value = "";

  displayStudentsList();

  checkAnalyzeButton();
}

// Display students list
function displayStudentsList() {
  const container = document.getElementById("studentsList");
  container.innerHTML = "";

  studentsData.forEach((student, index) => {
    const div = document.createElement("div");
    div.className = "student-item";
    div.innerHTML = `
            <span>${student.name}</span>
            <div>
                <span class="me-2">${toArabicNumbers(student.grade)}</span>
                <button class="btn btn-sm btn-danger" onclick="removeStudent(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    container.appendChild(div);
  });
}

// Remove student
function removeStudent(index) {
  studentsData.splice(index, 1);
  displayStudentsList();

  checkAnalyzeButton();
}

// Handle Excel file upload
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = window.XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = window.XLSX.utils.sheet_to_json(firstSheet, {
        header: 1,
      });

      studentsData = [];

      const startRow = jsonData[0] && isNaN(jsonData[0][1]) ? 1 : 0;

      for (let i = startRow; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (row[0] && row[1] !== undefined) {
          studentsData.push({
            name: row[0].toString().trim(),
            grade: Number.parseFloat(row[1]),
          });
        }
      }

      console.log("[v0] Excel loaded, students count:", studentsData.length);

      if (studentsData.length > 0) {
        displayStudentsList();

        const totalGrade = document.getElementById("totalGrade").value;
        console.log("[v0] Total grade value:", totalGrade);

        checkAnalyzeButton();

        alert(
          `تم تحميل ${toArabicNumbers(
            studentsData.length
          )} طالب بنجاح من ملف Excel!\n${
            totalGrade
              ? "يمكنك الآن تحليل النتائج."
              : "يرجى إدخال الدرجة النهائية لتفعيل زر التحليل."
          }`
        );

        showManualInput();
      } else {
        alert("لم يتم العثور على بيانات صحيحة في الملف");
      }
    } catch (error) {
      console.error("[v0] Error reading Excel file:", error);
    }
  };

  reader.readAsArrayBuffer(file);
}

// Analyze results
function analyzeResults() {
  console.log("[v0] analyzeResults function called");
  console.log("[v0] studentsData length:", studentsData.length);

  if (studentsData.length === 0) {
    alert("يرجى إدخال بيانات الطلاب أولاً");
    return;
  }

  const totalGrade = Number.parseFloat(
    document.getElementById("totalGrade").value
  );
  console.log("[v0] totalGrade:", totalGrade);

  if (!totalGrade) {
    alert("يرجى إدخال الدرجة النهائية");
    return;
  }

  console.log("[v0] Starting analysis...");

  const stats = calculateStatistics(studentsData, totalGrade);
  console.log("[v0] Statistics calculated:", stats);

  updateStatisticsDisplay(stats);
  displayStudentsResults(studentsData, totalGrade);
  createChart(stats);

  document.getElementById("resultsSection").style.display = "block";

  analysisCount++;
  localStorage.setItem("analysisCount", analysisCount.toString());

  console.log("[v0] Analysis completed successfully");

  document
    .getElementById("resultsSection")
    .scrollIntoView({ behavior: "smooth" });
}

// Calculate statistics
function calculateStatistics(students, totalGrade) {
  const stats = {
    excellent: 0,
    veryGood: 0,
    good: 0,
    acceptable: 0,
    weak: 0,
    total: students.length,
    totalGrades: 0,
  };

  students.forEach((student) => {
    const percentage = (student.grade / totalGrade) * 100;
    stats.totalGrades += student.grade;

    if (percentage >= 90) stats.excellent++;
    else if (percentage >= 80) stats.veryGood++;
    else if (percentage >= 70) stats.good++;
    else if (percentage >= 50) stats.acceptable++;
    else stats.weak++;
  });

  stats.average = stats.totalGrades / stats.total;
  stats.averagePercentage = (stats.average / totalGrade) * 100;

  return stats;
}

// Update statistics display
function updateStatisticsDisplay(stats) {
  document.getElementById("excellentCount").textContent = toArabicNumbers(
    stats.excellent
  );
  document.getElementById("veryGoodCount").textContent = toArabicNumbers(
    stats.veryGood
  );
  document.getElementById("goodCount").textContent = toArabicNumbers(
    stats.good
  );
  document.getElementById("acceptableCount").textContent = toArabicNumbers(
    stats.acceptable
  );
  document.getElementById("weakCount").textContent = toArabicNumbers(
    stats.weak
  );
  document.getElementById("totalStudents").textContent = toArabicNumbers(
    stats.total
  );
  document.getElementById("averageGrade").textContent = toArabicNumbers(
    stats.average.toFixed(2)
  );
  document.getElementById("averagePercentage").textContent =
    toArabicNumbers(stats.averagePercentage.toFixed(1)) + "%";
}

// Display students results
function displayStudentsResults(students, totalGrade) {
  const container = document.getElementById("studentsResults");
  container.innerHTML = "";

  const sortedStudents = [...students].sort((a, b) => b.grade - a.grade);

  sortedStudents.forEach((student, index) => {
    const percentage = (student.grade / totalGrade) * 100;
    let gradeClass = "";
    let gradeText = "";

    if (percentage >= 90) {
      gradeClass = "grade-excellent";
      gradeText = "ممتاز";
    } else if (percentage >= 80) {
      gradeClass = "grade-very-good";
      gradeText = "جيد جداً";
    } else if (percentage >= 70) {
      gradeClass = "grade-good";
      gradeText = "جيد";
    } else if (percentage >= 50) {
      gradeClass = "grade-acceptable";
      gradeText = "مقبول";
    } else {
      gradeClass = "grade-weak";
      gradeText = "ضعيف";
    }

    const div = document.createElement("div");
    div.className = "student-item";
    div.innerHTML = `
            <span style="width: 40%; display: inline-block; text-align: right; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.9rem; padding: 0.1rem;">${
              student.name
            }</span>
            <div style="width: 60%; display: flex; justify-content: space-between; align-items: center; gap: 1px; font-size: 0.9rem;">
                <span class="me-2" style="width: 15%; text-align: center; padding: 0.1rem; font-size: 0.9rem;">${toArabicNumbers(
                  student.grade
                )}</span>
                <span class="student-grade ${gradeClass}" style="width: 35%; text-align: center; padding: 0.1rem 0.3rem; font-size: 0.9rem;">${gradeText}</span>
            </div>
        `;
    container.appendChild(div);
  });
}

// Create chart
function createChart(stats) {
  const ctx = document.getElementById("resultsChart").getContext("2d");

  if (
    window.resultsChart &&
    typeof window.resultsChart.destroy === "function"
  ) {
    try {
      window.resultsChart.destroy();
    } catch (error) {
      console.log("[v0] Error destroying previous chart:", error);
    }
  }

  if (typeof window.Chart === "undefined") {
    console.error("[v0] Chart.js library not loaded");
    alert("خطأ: مكتبة الرسوم البيانية غير محملة");
    return;
  }

  try {
    window.resultsChart = new window.Chart(ctx, {
      type: "bar",
      data: {
        labels: ["ممتاز", "جيد جداً", "جيد", "مقبول", "ضعيف"],
        datasets: [
          {
            label: "عدد الطلاب",
            data: [
              stats.excellent,
              stats.veryGood,
              stats.good,
              stats.acceptable,
              stats.weak,
            ],
            backgroundColor: [
              "#28a745",
              "#17a2b8",
              "#ffc107",
              "#fd7e14",
              "#dc3545",
            ],
            borderColor: [
              "#1e7e34",
              "#117a8b",
              "#e0a800",
              "#e55a00",
              "#bd2130",
            ],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "التوزيع حسب الفئات",
            font: {
              size: 16,
              weight: "bold",
            },
          },
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              callback: function (value) {
                return toArabicNumbers(value);
              },
            },
          },
          x: {
            ticks: {
              font: {
                size: 12,
              },
            },
          },
        },
      },
    });
    console.log("[v0] Chart created successfully");
  } catch (error) {
    console.error("[v0] Error creating chart:", error);
    alert("خطأ في إنشاء الرسم البياني");
  }
}

// Export to PDF
function exportToPDF() {
  console.log("[v0] Starting PDF export...");
  console.log("[v0] studentsData length:", studentsData.length);

  let dataToExport = studentsData;

  if (dataToExport.length === 0) {
    console.log("[v0] studentsData is empty, trying to read from DOM...");
    const studentsResults = document.getElementById("studentsResults");
    if (studentsResults && studentsResults.children.length > 0) {
      dataToExport = [];
      Array.from(studentsResults.children).forEach((item) => {
        const nameElement = item.querySelector("span:first-child");
        const gradeElement = item.querySelector("span.me-2");
        if (nameElement && gradeElement) {
          dataToExport.push({
            name: nameElement.textContent.trim(),
            grade: Number.parseFloat(gradeElement.textContent.trim()),
          });
        }
      });
      console.log("[v0] Read from DOM, found", dataToExport.length, "students");
    }
  }

  if (dataToExport.length === 0) {
    console.log("[v0] No data found for export");
    alert("لا توجد بيانات للتصدير. يرجى تحليل النتائج أولاً.");
    return;
  }

  console.log("[v0] Exporting", dataToExport.length, "students");

  const printWindow = window.open("", "_blank");

  const eduAdminName =
    document.getElementById("eduAdminName").value || "غير محدد";
  const schoolName = document.getElementById("schoolName").value || "غير محدد";
  const classLevel = document.getElementById("classLevel").value || "غير محدد";
  const classSection =
    document.getElementById("classSection").value || "غير محدد";
  const teacherType = document.getElementById("teacherType").value || "";
  const teacherName =
    document.getElementById("teacherName").value || "غير محدد";
  const subjectName =
    document.getElementById("subjectName").value || "غير محدد";
  const totalGrade = document.getElementById("totalGrade").value || "0";
  const semester = document.getElementById("semester").value || "غير محدد";
  const examType = document.getElementById("examType").value || "غير محدد";
  const directorType = document.getElementById("directorType").value || "";
  const directorName =
    document.getElementById("directorName").value || "غير محدد";

  const teacherLabel = teacherType === "معلمة" ? "اسم المعلمة" : "اسم المعلم";
  const directorLabel =
    directorType === "مديرة" ? "مديرة المدرسة" : "مدير المدرسة";

  const stats = calculateStatistics(
    dataToExport,
    Number.parseFloat(totalGrade)
  );

  const sortedStudents = [...dataToExport].sort((a, b) => b.grade - a.grade);

  let studentsListHTML = "";
  sortedStudents.forEach((student, index) => {
    const percentage = (student.grade / Number.parseFloat(totalGrade)) * 100;
    let gradeText = "";
    let gradeColor = "";

    if (percentage >= 90) {
      gradeText = "ممتاز";
      gradeColor = "#28a745";
    } else if (percentage >= 80) {
      gradeText = "جيد جداً";
      gradeColor = "#17a2b8";
    } else if (percentage >= 70) {
      gradeText = "جيد";
      gradeColor = "#ffc107";
    } else if (percentage >= 50) {
      gradeText = "مقبول";
      gradeColor = "#fd7e14";
    } else {
      gradeText = "ضعيف";
      gradeColor = "#dc3545";
    }

    studentsListHTML += `
      <tr style="border-bottom: 1px solid #dee2e6;">
        <td style="padding: 2px; text-align: center; font-weight: bold; width: 10%;">${toArabicNumbers(
          index + 1
        )}</td>
        <td style="padding: 2px; text-align: center; width: 40%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${
          student.name
        }</td>
        <td style="padding: 2px; text-align: center; font-weight: bold; color: #3c7db8; width: 15%;">${toArabicNumbers(
          student.grade
        )}</td>
        <td style="padding: 2px; text-align: center; width: 35%;">
          <span style="color: white !important; background: ${gradeColor} !important; padding: 2px 4px; border-radius: 12px; font-size: 0.9rem; font-weight: bold;">${gradeText}</span>
        </td>
      </tr>
    `;
  });

  const maxValue = Math.max(
    stats.excellent,
    stats.veryGood,
    stats.good,
    stats.acceptable,
    stats.weak,
    1
  );
  const chartHTML = `
    <svg width="100%" height="200" viewBox="0 0 500 200" style="background: linear-gradient(135deg, #3C7DB8, #06A869) !important; border-radius: 8px; margin: 10px 0;">
      <text x="250" y="20" text-anchor="middle" style="font-size: 12px; font-weight: bold; fill: white !important;">التوزيع حسب الفئات</text>
      
      <rect x="50" y="${
        180 - (stats.excellent / maxValue) * 140
      }" width="60" height="${
    (stats.excellent / maxValue) * 140
  }" fill="#28a745" rx="4"/>
      <text x="80" y="195" text-anchor="middle" style="font-size: 10px; fill: white !important;">ممتاز</text>
      <text x="80" y="${
        175 - (stats.excellent / maxValue) * 140
      }" text-anchor="middle" style="font-size: 10px; font-weight: bold; fill: white !important;">${toArabicNumbers(
    stats.excellent
  )}</text>
      
      <rect x="130" y="${
        180 - (stats.veryGood / maxValue) * 140
      }" width="60" height="${
    (stats.veryGood / maxValue) * 140
  }" fill="#17a2b8" rx="4"/>
      <text x="160" y="195" text-anchor="middle" style="font-size: 10px; fill: white !important;">جيد جداً</text>
      <text x="160" y="${
        175 - (stats.veryGood / maxValue) * 140
      }" text-anchor="middle" style="font-size: 10px; font-weight: bold; fill: white !important;">${toArabicNumbers(
    stats.veryGood
  )}</text>
      
      <rect x="210" y="${
        180 - (stats.good / maxValue) * 140
      }" width="60" height="${
    (stats.good / maxValue) * 140
  }" fill="#ffc107" rx="4"/>
      <text x="240" y="195" text-anchor="middle" style="font-size: 10px; fill: white !important;">جيد</text>
      <text x="240" y="${
        175 - (stats.good / maxValue) * 140
      }" text-anchor="middle" style="font-size: 10px; font-weight: bold; fill: white !important;">${toArabicNumbers(
    stats.good
  )}</text>
      
      <rect x="290" y="${
        180 - (stats.acceptable / maxValue) * 140
      }" width="60" height="${
    (stats.acceptable / maxValue) * 140
  }" fill="#fd7e14" rx="4"/>
      <text x="320" y="195" text-anchor="middle" style="font-size: 10px; fill: white !important;">مقبول</text>
      <text x="320" y="${
        175 - (stats.acceptable / maxValue) * 140
      }" text-anchor="middle" style="font-size: 10px; font-weight: bold; fill: white !important;">${toArabicNumbers(
    stats.acceptable
  )}</text>
      
      <rect x="370" y="${
        180 - (stats.weak / maxValue) * 140
      }" width="60" height="${
    (stats.weak / maxValue) * 140
  }" fill="#dc3545" rx="4"/>
      <text x="400" y="195" text-anchor="middle" style="font-size: 10px; fill: white !important;">ضعيف</text>
      <text x="400" y="${
        175 - (stats.weak / maxValue) * 140
      }" text-anchor="middle" style="font-size: 10px; font-weight: bold; fill: white !important;">${toArabicNumbers(
    stats.weak
  )}</text>
    </svg>
  `;

  const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>تقرير ${examType}</title>
      <style>
        * {
          print-color-adjust: exact !important;
          color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
        }
        body { 
          font-family: 'Segoe UI', Tahoma, Arial, sans-serif; 
          margin: 10px; 
          direction: rtl; 
          line-height: 1.3;
          color: #333 !important;
          font-size: 14px;
          overflow-x: hidden; /* Prevent horizontal scrolling */
          width: 100%;
          print-color-adjust: exact !important;
        }
        .header { 
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px;
          background: #14445A !important;
          color: white !important;
          border-radius: 8px;
          margin-bottom: 15px;
          print-color-adjust: exact !important;
        }
        .header-logo {
          width: 120px;
          height: auto;
          margin-left: 15px;
        }
        .header-text {
          flex: 1;
          text-align: center;
        }
        .header-text h2 { 
          margin: 0 0 5px 0; 
          font-size: 15px; 
          color: white !important; 
          font-weight: bold;
        }
        .header-text h3 { 
          margin: 0 0 5px 0; 
          font-size: 13px; 
          color: white !important; 
          font-weight: normal;
        }
        .header-text .report-title { 
          background: rgba(255,255,255,0.2) !important; 
          padding: 5px 10px; 
          border-radius: 6px; 
          font-size: 13px;
          font-weight: bold;
          color: white !important;
          print-color-adjust: exact !important;
        }
        .info-table { 
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
          background: #f8f9fa !important;
          border: 2px solid #14445A !important;
          border-radius: 6px;
          overflow: hidden;
          print-color-adjust: exact !important;
        }
        .info-table td { 
          padding: 6px 10px; 
          border-bottom: 1px solid #dee2e6 !important;
          font-size: 13px;
        }
        .info-table td:first-child { 
          font-weight: bold; 
          background: #14445A !important;
          color: white !important;
          width: 30%;
          print-color-adjust: exact !important;
        }
        .stats-table { 
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
          background: white !important;
          border: 2px solid #14445A !important;
          border-radius: 6px;
          overflow: hidden;
          print-color-adjust: exact !important;
        }
        .stats-table th { 
          background: #14445A !important; 
          color: white !important; 
          padding: 8px; 
          text-align: center;
          font-size: 12px;
          print-color-adjust: exact !important;
        }
        .stats-table td { 
          padding: 6px; 
          text-align: center; 
          font-weight: bold;
          font-size: 13px;
        }
        .stat-excellent { background: #d4edda !important; color: #155724 !important; print-color-adjust: exact !important; }
        .stat-very-good { background: #d1ecf1 !important; color: #0c5460 !important; print-color-adjust: exact !important; }
        .stat-good { background: #fff3cd !important; color: #856404 !important; print-color-adjust: exact !important; }
        .stat-acceptable { background: #ffeaa7 !important; color: #856404 !important; print-color-adjust: exact !important; }
        .stat-weak { background: #f8d7da !important; color: #721c24 !important; print-color-adjust: exact !important; }
        .students-table { 
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
          background: white !important;
          border: 2px solid #14445A !important;
          border-radius: 6px;
          overflow: hidden;
          print-color-adjust: exact !important;
        }
        .students-table th { 
          background: #14445A !important; 
          color: white !important; 
          padding: 6px; 
          text-align: center;
          font-size: 12px;
          print-color-adjust: exact !important;
        }
        .students-table td { 
          padding: 2px; 
          border-bottom: 1px solid #dee2e6 !important;
          font-size: 12px;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .section-title {
          color: #14445A !important;
          font-size: 15px;
          font-weight: bold;
          margin: 15px 0 8px 0;
          text-align: center;
          padding: 6px;
          background: linear-gradient(135deg, rgba(20,68,90,0.1), rgba(6,168,105,0.1)) !important;
          border-radius: 6px;
          print-color-adjust: exact !important;
        }
        .average-info {
          background: linear-gradient(135deg, rgba(20,68,90,0.1), rgba(6,168,105,0.1)) !important;
          padding: 8px;
          border-radius: 6px;
          margin: 10px 0;
          text-align: center;
          font-size: 14px;
          font-weight: bold;
          color: #14445A !important;
          print-color-adjust: exact !important;
        }
        .final-notes { 
          margin-top: 20px; 
          text-align: center;
          padding: 10px;
          background: #14445A !important;
          border-radius: 6px;
          border: 2px solid #14445A !important;
          print-color-adjust: exact !important;
        }
        .director-name {
          font-size: 14px;
          font-weight: bold;
          color: #14445A !important;
          margin-bottom: 5px;
        }
        .footer { 
          margin-top: 20px; 
          text-align: center;
          padding: 10px;
          background: #14445A !important;
          border-radius: 6px;
          border: 2px solid #14445A !important;
          print-color-adjust: exact !important;
        }
        @media print {
          * {
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }
          body { 
            margin: 0; 
            font-size: 11px; 
            print-color-adjust: exact !important;
          }
          .header { 
            break-inside: avoid; 
            background: #14445A !important;
            color: white !important;
            print-color-adjust: exact !important;
          }
          .header * { color: white !important; }
          .stats-table th { 
            background: #14445A !important; 
            color: white !important; 
            print-color-adjust: exact !important;
          }
          .students-table th { 
            background: #14445A !important; 
            color: white !important; 
            print-color-adjust: exact !important;
          }
          .info-table td:first-child { 
            background: #14445A !important;
            color: white !important;
            print-color-adjust: exact !important;
          }
          .footer { 
            background: #14445A !important;
            color: white !important;
            print-color-adjust: exact !important;
          }
        }
        @media (max-width: 768px) {
          .students-table td {
            padding: 1px;
            font-size: 11px;
          }
          .students-table th {
            padding: 4px;
            font-size: 11px;
          }
          .students-table td:nth-child(3) {
            width: 15%;
          }
          .students-table td:nth-child(4) {
            width: 35%;
          }
          body {
            margin: 5px;
          }
          .header {
            padding: 10px;
          }
          .header-logo {
            width: 100px;
          }
          .header-text h2 {
            font-size: 14px;
          }
          .header-text h3 {
            font-size: 12px;
          }
          .info-table td {
            padding: 4px 8px;
            font-size: 12px;
          }
          .stats-table th {
            padding: 6px;
            font-size: 11px;
          }
          .stats-table td {
            padding: 4px;
            font-size: 12px;
          }
          .section-title {
            font-size: 14px;
            margin: 10px 0 5px 0;
            padding: 4px;
          }
          .average-info {
            padding: 6px;
            font-size: 13px;
            margin: 8px 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="/images/ministry-logo-white.png" alt="لوجو وزارة التعليم" class="header-logo">
        <div class="header-text">
          <h3>${eduAdminName}</h3>
          <h3>${schoolName}</h3>
          <h3>تقرير ${examType}</h3>
        </div>
      </div>
      
      <div class="section-title">معلومات الاختبار</div>
      <table class="info-table">
        <tr><td>${teacherLabel}</td><td>${teacherName}</td></tr>
        <tr><td>المادة</td><td>${subjectName}</td></tr>
        <tr><td>الدرجة النهائية</td><td>${toArabicNumbers(totalGrade)}</td></tr>
        <tr><td>الفصل الدراسي</td><td>${semester}</td></tr>
        <tr><td>الصف</td><td>${classLevel}</td></tr>
        <tr><td>الفصل</td><td>${classSection}</td></tr>
     
      </table>
      
      <div class="section-title">الإحصائيات التفصيلية</div>
      <table class="stats-table">
        <tr>
          <th>ممتاز</th>
          <th>جيد جداً</th>
          <th>جيد</th>
          <th>مقبول</th>
          <th>ضعيف</th>
          <th>المجموع</th>
        </tr>
        <tr>
          <td class="stat-excellent">${toArabicNumbers(stats.excellent)}</td>
          <td class="stat-very-good">${toArabicNumbers(stats.veryGood)}</td>
          <td class="stat-good">${toArabicNumbers(stats.good)}</td>
          <td class="stat-acceptable">${toArabicNumbers(stats.acceptable)}</td>
          <td class="stat-weak">${toArabicNumbers(stats.weak)}</td>
          <td style="background: #14445A !important; color: white !important; print-color-adjust: exact !important;">${toArabicNumbers(
            stats.total
          )}</td>
        </tr>
      </table>
      
      <div class="average-info">
        متوسط الدرجات: ${toArabicNumbers(
          stats.average.toFixed(2)
        )} من ${toArabicNumbers(totalGrade)} (${toArabicNumbers(
    stats.averagePercentage.toFixed(1)
  )}%)
      </div>
      
      <div class="section-title">الرسم البياني</div>
      ${chartHTML}
      
      <div class="section-title"> الترتيب حسب الدرجات</div>
      <table class="students-table">
        <tr>
          <th style="width: 10%;">الترتيب</th>
          <th style="width: 40%;">الاسم </th>
          <th style="width: 15%;">الدرجة</th>
          <th style="width: 35%;">التقدير</th>
        </tr>
        ${studentsListHTML}
      </table>
      <div class="section-title">
      <div class="director-name">${directorLabel}: ${directorName}</div>
      </div>

      <div class="footer">
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  setTimeout(() => {
    printWindow.print();

    reportCount++;
    localStorage.setItem("reportCount", reportCount.toString());

    console.log("[v0] PDF exported successfully");
    alert(
      "تم فتح التقرير في نافذة جديدة. يمكنك طباعته أو حفظه كـ PDF من المتصفح."
    );
  }, 1000);
}

// Check analyze button status
function checkAnalyzeButton() {
  const analyzeBtn = document.getElementById("analyzeBtn");
  const totalGrade = document.getElementById("totalGrade").value;

  console.log(
    "[v0] checkAnalyzeButton called - students:",
    studentsData.length,
    "totalGrade:",
    totalGrade
  );

  if (analyzeBtn) {
    if (studentsData.length > 0 && totalGrade) {
      analyzeBtn.disabled = false;
      analyzeBtn.classList.remove("btn-secondary");
      analyzeBtn.classList.add("btn-primary");
      console.log("[v0] Analyze button enabled");
    } else {
      analyzeBtn.disabled = true;
      analyzeBtn.classList.remove("btn-primary");
      analyzeBtn.classList.add("btn-secondary");
      console.log(
        "[v0] Analyze button disabled - missing:",
        !studentsData.length ? "students data" : "total grade"
      );
    }
  }
}
