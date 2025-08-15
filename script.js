// Global variables
let studentsData = [];
let analysisCount = Number.parseInt(
  localStorage.getItem("analysisCount") || "0"
);
let reportCount = Number.parseInt(localStorage.getItem("reportCount") || "0");
const html2pdf = window.html2pdf; // Declare the html2pdf variable

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
    analysisElement.textContent = analysisCount;
  }
  if (reportElement) {
    reportElement.textContent = reportCount;
  }
}

// Navigation functions
function goToAnalysis() {
  console.log("[v0] goToAnalysis function called");
  try {
    if (typeof window !== "undefined" && window.location) {
      window.location.href = "analysis.html";
    } else {
      document.location = "analysis.html";
    }
  } catch (error) {
    console.error("[v0] Error navigating to analysis page:", error);
    try {
      window.open("analysis.html", "_self");
    } catch (error2) {
      console.error("[v0] Fallback navigation also failed:", error2);
      alert("خطأ في الانتقال إلى صفحة التحليل. يرجى المحاولة مرة أخرى.");
    }
  }
}

function goHome() {
  console.log("[v0] goHome function called");
  try {
    if (typeof window !== "undefined" && window.location) {
      window.location.href = "index.html";
    } else {
      document.location = "index.html";
    }
  } catch (error) {
    console.error("[v0] Error navigating to home page:", error);
    try {
      window.open("index.html", "_self");
    } catch (error2) {
      console.error("[v0] Fallback navigation also failed:", error2);
      alert("خطأ في الانتقال إلى الصفحة الرئيسية. يرجى المحاولة مرة أخرى.");
    }
  }
}

function showReports() {
  alert("ميزة شواهد الأداء قيد التطوير");
}

// Show manual input section
function showManualInput() {
  document.getElementById("manualInputSection").style.display = "block";
}

// Add student manually
function addStudent() {
  const nameInput = document.getElementById("studentName");
  const gradeInput = document.getElementById("studentGrade");
  const totalGrade = Number.parseFloat(
    document.getElementById("totalGrade").value
  );

  if (!nameInput.value || !gradeInput.value || !totalGrade) {
    alert("يرجى إدخال جميع البيانات المطلوبة");
    return;
  }

  const student = {
    name: nameInput.value.trim(),
    grade: Number.parseFloat(gradeInput.value),
  };

  if (student.grade > totalGrade) {
    alert("درجة الطالب لا يمكن أن تكون أكبر من الدرجة النهائية");
    return;
  }

  studentsData.push(student);

  // Clear inputs
  nameInput.value = "";
  gradeInput.value = "";

  // Update display
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
                <span class="me-2">${student.grade}</span>
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

      // Skip header row if exists
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

      if (studentsData.length > 0) {
        checkAnalyzeButton();
        alert(`تم تحميل ${studentsData.length} طالب بنجاح`);
      } else {
        alert("لم يتم العثور على بيانات صحيحة في الملف");
      }
    } catch (error) {
      alert("خطأ في قراءة الملف. يرجى التأكد من صحة تنسيق الملف");
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

  // Calculate statistics
  const stats = calculateStatistics(studentsData, totalGrade);
  console.log("[v0] Statistics calculated:", stats);

  // Update UI
  updateStatisticsDisplay(stats);
  displayStudentsResults(studentsData, totalGrade);
  createChart(stats);

  // Show results section
  document.getElementById("resultsSection").style.display = "block";

  // Update analysis count
  analysisCount++;
  localStorage.setItem("analysisCount", analysisCount.toString());

  console.log("[v0] Analysis completed successfully");

  // Scroll to results
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
    else if (percentage >= 60) stats.acceptable++;
    else stats.weak++;
  });

  stats.average = stats.totalGrades / stats.total;
  stats.averagePercentage = (stats.average / totalGrade) * 100;

  return stats;
}

// Update statistics display
function updateStatisticsDisplay(stats) {
  document.getElementById("excellentCount").textContent = stats.excellent;
  document.getElementById("veryGoodCount").textContent = stats.veryGood;
  document.getElementById("goodCount").textContent = stats.good;
  document.getElementById("acceptableCount").textContent = stats.acceptable;
  document.getElementById("weakCount").textContent = stats.weak;
  document.getElementById("totalStudents").textContent = stats.total;
  document.getElementById("averageGrade").textContent =
    stats.average.toFixed(2);
  document.getElementById("averagePercentage").textContent =
    stats.averagePercentage.toFixed(1) + "%";
}

// Display students results
function displayStudentsResults(students, totalGrade) {
  const container = document.getElementById("studentsResults");
  container.innerHTML = "";

  // Sort students by grade (descending)
  const sortedStudents = [...students].sort((a, b) => b.grade - a.grade);

  sortedStudents.forEach((student) => {
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
    } else if (percentage >= 60) {
      gradeClass = "grade-acceptable";
      gradeText = "مقبول";
    } else {
      gradeClass = "grade-weak";
      gradeText = "ضعيف";
    }

    const div = document.createElement("div");
    div.className = "student-item";
    div.innerHTML = `
            <span>${student.name}</span>
            <div>
                <span class="me-2">${student.grade}</span>
                <span class="student-grade ${gradeClass}">${gradeText}</span>
            </div>
        `;
    container.appendChild(div);
  });
}

// Create chart
function createChart(stats) {
  const ctx = document.getElementById("resultsChart").getContext("2d");

  // Destroy existing chart if it exists
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

  // Check if Chart.js library is loaded
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
        plugins: {
          title: {
            display: true,
            text: "توزيع الطلاب حسب الفئات",
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
  // التأكد من وجود البيانات
  if (studentsData.length === 0) {
    alert("لا توجد بيانات للتصدير");
    return;
  }

  // الحصول على بيانات النموذج
  const schoolName = document.getElementById("schoolName").value || "غير محدد";
  const teacherName =
    document.getElementById("teacherName").value || "غير محدد";
  const subjectName =
    document.getElementById("subjectName").value || "غير محدد";
  const totalGrade = document.getElementById("totalGrade").value || "0";
  const semester = document.getElementById("semester").value || "غير محدد";
  const examType = document.getElementById("examType").value || "غير محدد";

  // حساب الإحصائيات
  const stats = calculateStatistics(
    studentsData,
    Number.parseFloat(totalGrade)
  );

  // تحديث template الـ PDF
  document.getElementById("pdfSchoolName").textContent = schoolName;
  document.getElementById("pdfTeacherName").textContent = teacherName;
  document.getElementById("pdfSubjectName").textContent = subjectName;
  document.getElementById("pdfTotalGrade").textContent = totalGrade;
  document.getElementById("pdfSemester").textContent = semester;
  document.getElementById("pdfExamType").textContent = examType;

  // تحديث الإحصائيات
  document.getElementById("pdfExcellent").textContent = stats.excellent;
  document.getElementById("pdfVeryGood").textContent = stats.veryGood;
  document.getElementById("pdfGood").textContent = stats.good;
  document.getElementById("pdfAcceptable").textContent = stats.acceptable;
  document.getElementById("pdfWeak").textContent = stats.weak;
  document.getElementById("pdfTotal").textContent = stats.total;
  document.getElementById("pdfAverage").textContent = stats.average.toFixed(2);

  // إنشاء قائمة الطلاب
  const studentsList = document.getElementById("pdfStudentsList");
  studentsList.innerHTML = "";

  const sortedStudents = [...studentsData].sort((a, b) => b.grade - a.grade);

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
    } else if (percentage >= 60) {
      gradeText = "مقبول";
      gradeColor = "#fd7e14";
    } else {
      gradeText = "ضعيف";
      gradeColor = "#dc3545";
    }

    const studentDiv = document.createElement("div");
    studentDiv.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      margin: 5px 0;
      background: white;
      border-radius: 5px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    `;

    studentDiv.innerHTML = `
      <span style="font-weight: bold;">${index + 1}. ${student.name}</span>
      <span>
        <span style="margin-left: 10px; font-weight: bold;">${
          student.grade
        }</span>
        <span style="color: ${gradeColor}; font-weight: bold; padding: 5px 10px; background: ${gradeColor}20; border-radius: 15px;">
          ${gradeText}
        </span>
      </span>
    `;

    studentsList.appendChild(studentDiv);
  });

  // إعدادات html2pdf
  const element = document.getElementById("pdfTemplate");
  const opt = {
    margin: 1,
    filename: `تحليل-النتائج-${subjectName}-${new Date().toLocaleDateString(
      "ar-SA"
    )}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      allowTaint: true,
    },
    jsPDF: {
      unit: "in",
      format: "a4",
      orientation: "portrait",
      putOnlyUsedFonts: true,
      floatPrecision: 16,
    },
  };

  // إظهار العنصر مؤقتاً للتصدير
  element.style.display = "block";

  // تصدير PDF
  html2pdf()
    .set(opt)
    .from(element)
    .save()
    .then(() => {
      // إخفاء العنصر مرة أخرى
      element.style.display = "none";

      // تحديث عداد التقارير
      reportCount++;
      localStorage.setItem("reportCount", reportCount.toString());

      alert("تم تصدير التقرير بنجاح!");
    })
    .catch((error) => {
      console.error("خطأ في تصدير PDF:", error);
      element.style.display = "none";
      alert("حدث خطأ أثناء تصدير التقرير. يرجى المحاولة مرة أخرى.");
    });
}

function checkAnalyzeButton() {
  const analyzeBtn = document.getElementById("analyzeBtn");
  const totalGrade = document.getElementById("totalGrade").value;

  if (analyzeBtn) {
    if (studentsData.length > 0 && totalGrade) {
      analyzeBtn.disabled = false;
      analyzeBtn.classList.remove("btn-secondary");
      analyzeBtn.classList.add("btn-primary");
    } else {
      analyzeBtn.disabled = true;
      analyzeBtn.classList.remove("btn-primary");
      analyzeBtn.classList.add("btn-secondary");
    }
  }
}
