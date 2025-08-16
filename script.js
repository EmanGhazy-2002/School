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

  if (!gradeInput.value || !totalGrade) {
    alert("يرجى إدخال الدرجة والدرجة النهائية");
    return;
  }

  // إنشاء اسم افتراضي إذا لم يتم إدخال اسم
  const studentName =
    nameInput.value.trim() || `طالب ${studentsData.length + 1}`;

  const student = {
    name: studentName,
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

      console.log("[v0] Excel loaded, students count:", studentsData.length); // إضافة تسجيل للتحقق من تحميل البيانات

      if (studentsData.length > 0) {
        displayStudentsList();

        const totalGrade = document.getElementById("totalGrade").value;
        console.log("[v0] Total grade value:", totalGrade);

        checkAnalyzeButton();

        alert(
          `تم تحميل ${studentsData.length} طالب بنجاح من ملف Excel!\n${
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
      console.error("[v0] Error reading Excel file:", error); // إضافة تسجيل للأخطاء
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
  console.log("[v0] Starting PDF export...");
  console.log("[v0] studentsData length:", studentsData.length);

  let dataToExport = studentsData;

  // إذا كانت البيانات فارغة، حاول قراءتها من DOM
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

  // التأكد من وجود البيانات
  if (dataToExport.length === 0) {
    console.log("[v0] No data found for export");
    alert("لا توجد بيانات للتصدير. يرجى تحليل النتائج أولاً.");
    return;
  }

  console.log("[v0] Exporting", dataToExport.length, "students");

  // استخدام طريقة بسيطة وموثوقة
  const printWindow = window.open("", "_blank");

  // الحصول على بيانات النموذج
  const schoolName =
    document.getElementById("schoolName").value || "ثانوية دار التوحيد";
  const teacherName =
    document.getElementById("teacherName").value || "غير محدد";
  const subjectName =
    document.getElementById("subjectName").value || "غير محدد";
  const totalGrade = document.getElementById("totalGrade").value || "0";
  const semester = document.getElementById("semester").value || "غير محدد";
  const examType = document.getElementById("examType").value || "غير محدد";

  // حساب الإحصائيات
  const stats = calculateStatistics(
    dataToExport,
    Number.parseFloat(totalGrade)
  );

  // ترتيب الطلاب حسب الدرجة
  const sortedStudents = [...dataToExport].sort((a, b) => b.grade - a.grade);

  // إنشاء محتوى HTML للطباعة
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
    } else if (percentage >= 60) {
      gradeText = "مقبول";
      gradeColor = "#fd7e14";
    } else {
      gradeText = "ضعيف";
      gradeColor = "#dc3545";
    }

    studentsListHTML += `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; margin-bottom: 8px; background: ${
        index % 2 === 0 ? "#f8f9fa" : "white"
      }; border: 1px solid #e9ecef; border-radius: 8px;">
        <span style="font-weight: bold; color: #333; font-size: 16px;">${
          index + 1
        }. ${student.name}</span>
        <div style="display: flex; align-items: center; gap: 15px;">
          <span style="font-size: 18px; font-weight: bold; color: #0062CC;">${
            student.grade
          }</span>
          <span style="color: white; background: ${gradeColor}; padding: 6px 12px; border-radius: 20px; font-weight: bold; font-size: 14px;">${gradeText}</span>
        </div>
      </div>
    `;
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>تقرير تحليل النتائج</title>
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Arial, sans-serif; 
          margin: 20px; 
          direction: rtl; 
          line-height: 1.6;
          color: #333;
        }
        .header { 
          text-align: center; 
          margin-bottom: 40px; 
          padding: 20px;
          background: linear-gradient(135deg, #0062CC, #004499);
          color: white;
          border-radius: 15px;
        }
        .header h1 { margin: 0; font-size: 28px; }
        .header h2 { margin: 10px 0; font-size: 20px; font-weight: normal; }
        .header h3 { margin: 15px 0 0 0; font-size: 24px; }
        .info-section { 
          background: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 30px;
          border: 2px solid #0062CC;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding: 8px 0;
          border-bottom: 1px solid #dee2e6;
        }
        .info-row:last-child { border-bottom: none; }
        .stats-section {
          background: white;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 30px;
          border: 2px solid #0062CC;
        }
        .stats-grid { 
          display: grid; 
          grid-template-columns: repeat(3, 1fr); 
          gap: 15px; 
          margin: 20px 0; 
        }
        .stat-box { 
          padding: 20px; 
          border-radius: 10px; 
          text-align: center;
          color: white;
          font-weight: bold;
        }
        .stat-excellent { background: #28a745; }
        .stat-very-good { background: #17a2b8; }
        .stat-good { background: #ffc107; color: #333; }
        .stat-acceptable { background: #fd7e14; }
        .stat-weak { background: #dc3545; }
        .stat-total { background: #0062CC; }
        .stat-box h4 { margin: 0 0 10px 0; font-size: 16px; }
        .stat-box .number { font-size: 32px; margin: 0; }
        .students-section {
          background: white;
          padding: 20px;
          border-radius: 10px;
          border: 2px solid #0062CC;
        }
        .section-title {
          color: #0062CC;
          font-size: 22px;
          font-weight: bold;
          margin-bottom: 20px;
          text-align: center;
          padding-bottom: 10px;
          border-bottom: 3px solid #0062CC;
        }
        .average-info {
          background: #e3f2fd;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          color: #0062CC;
        }
        .footer { 
          margin-top: 40px; 
          text-align: center;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 10px;
          border: 2px solid #0062CC;
        }
        .footer p { margin: 5px 0; }
        .director-name {
          font-size: 18px;
          font-weight: bold;
          color: #0062CC;
        }
        @media print {
          body { margin: 0; }
          .header { break-inside: avoid; }
          .stats-section { break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>وزارة التعليم</h1>
        <h2>الإدارة العامة للتعليم بمحافظة الطائف</h2>
        <h3>${schoolName}</h3>
        <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; margin-top: 20px;">
          <h2 style="margin: 0;">📊 تقرير تحليل النتائج</h2>
        </div>
      </div>
      
      <div class="info-section">
        <h3 class="section-title">معلومات الاختبار</h3>
        <div class="info-row">
          <strong>👨‍🏫 اسم المعلم:</strong>
          <span>${teacherName}</span>
        </div>
        <div class="info-row">
          <strong>📚 المادة:</strong>
          <span>${subjectName}</span>
        </div>
        <div class="info-row">
          <strong>🎯 الدرجة النهائية:</strong>
          <span>${totalGrade}</span>
        </div>
        <div class="info-row">
          <strong>📅 الفصل الدراسي:</strong>
          <span>${semester}</span>
        </div>
        <div class="info-row">
          <strong>📝 نوع الاختبار:</strong>
          <span>${examType}</span>
        </div>
      </div>
      
      <div class="stats-section">
        <h3 class="section-title">📈 الإحصائيات التفصيلية</h3>
        <div class="stats-grid">
          <div class="stat-box stat-excellent">
            <h4>⭐ ممتاز</h4>
            <p class="number">${stats.excellent}</p>
          </div>
          <div class="stat-box stat-very-good">
            <h4>🌟 جيد جداً</h4>
            <p class="number">${stats.veryGood}</p>
          </div>
          <div class="stat-box stat-good">
            <h4>👍 جيد</h4>
            <p class="number">${stats.good}</p>
          </div>
          <div class="stat-box stat-acceptable">
            <h4>✅ مقبول</h4>
            <p class="number">${stats.acceptable}</p>
          </div>
          <div class="stat-box stat-weak">
            <h4>⚠️ ضعيف</h4>
            <p class="number">${stats.weak}</p>
          </div>
          <div class="stat-box stat-total">
            <h4>👥 المجموع</h4>
            <p class="number">${stats.total}</p>
          </div>
        </div>
        <div class="average-info">
          📊 متوسط الدرجات: ${stats.average.toFixed(
            2
          )} من ${totalGrade} (${stats.averagePercentage.toFixed(1)}%)
        </div>
      </div>
      
      <div class="students-section">
        <h3 class="section-title">👥 قائمة الطلاب مرتبة حسب الدرجات</h3>
        <div style="margin-top: 20px;">
          ${studentsListHTML}
        </div>
      </div>
      
      <div class="footer">
        <p class="director-name">👨‍💼 مدير المدرسة: فهد بن حسن القحطاني</p>
        <p>📅 تاريخ التقرير: ${new Date().toLocaleDateString("ar-SA")}</p>
        <p style="color: #666; font-size: 14px;">تم إنشاء هذا التقرير بواسطة نظام تحليل النتائج</p>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // طباعة النافذة الجديدة
  setTimeout(() => {
    printWindow.print();

    // تحديث عداد التقارير
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
  ); // إضافة تسجيل للتحقق من حالة الزر

  if (analyzeBtn) {
    if (studentsData.length > 0 && totalGrade) {
      analyzeBtn.disabled = false;
      analyzeBtn.classList.remove("btn-secondary");
      analyzeBtn.classList.add("btn-primary");
      console.log("[v0] Analyze button enabled"); // تسجيل تفعيل الزر
    } else {
      analyzeBtn.disabled = true;
      analyzeBtn.classList.remove("btn-primary");
      analyzeBtn.classList.add("btn-secondary");
      console.log(
        "[v0] Analyze button disabled - missing:",
        !studentsData.length ? "students data" : "total grade"
      ); // تسجيل سبب تعطيل الزر
    }
  }
}
