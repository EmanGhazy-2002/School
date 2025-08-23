function showSelectionPage() {
  document.getElementById("selectionPage").style.display = "block";
  document.getElementById("exchangeVisitSection").style.display = "none";
  document.getElementById("strategiesSection").style.display = "none";
  document.getElementById("programExecutionSection").style.display = "none";
}

function showExchangeVisitForm() {
  document.getElementById("selectionPage").style.display = "none";
  document.getElementById("exchangeVisitSection").style.display = "block";
  document.getElementById("strategiesSection").style.display = "none";
  document.getElementById("programExecutionSection").style.display = "none";
}

function showStrategiesForm() {
  document.getElementById("selectionPage").style.display = "none";
  document.getElementById("exchangeVisitSection").style.display = "none";
  document.getElementById("strategiesSection").style.display = "block";
  document.getElementById("programExecutionSection").style.display = "none";
}

function showProgramExecutionForm() {
  document.getElementById("selectionPage").style.display = "none";
  document.getElementById("exchangeVisitSection").style.display = "none";
  document.getElementById("strategiesSection").style.display = "none";
  document.getElementById("programExecutionSection").style.display = "block";
}

function goToExchangeVisit() {
  window.location.href = "exchange-visit.html";
}

function goToStrategies() {
  window.location.href = "strategies.html";
}

function goBack() {
  window.location.href = "performance-index.html";
}

function goHome() {
  window.location.href = "index.html";
}

function setupImageUpload(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);

  if (!input || !preview) return;

  input.addEventListener("change", (e) => {
    const files = Array.from(e.target.files);
    preview.innerHTML = "";

    files.forEach((file, index) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageContainer = document.createElement("div");
          imageContainer.className = "image-preview-item";

          imageContainer.innerHTML = `
                        <img src="${e.target.result}" alt="صورة ${index + 1}">
                        <button type="button" class="remove-image" onclick="removeImage(this, '${inputId}', ${index})">
                            <i class="fas fa-times"></i>
                        </button>
                    `;

          preview.appendChild(imageContainer);
        };
        reader.readAsDataURL(file);
      }
    });
  });
}

function removeImage(button, inputId, index) {
  const input = document.getElementById(inputId);
  const preview = button.closest(".image-preview");

  button.closest(".image-preview-item").remove();

  const dt = new DataTransfer();
  const files = Array.from(input.files);

  files.forEach((file, i) => {
    if (i !== index) {
      dt.items.add(file);
    }
  });

  input.files = dt.files;
}

function printForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  const elementsToHide = form.querySelectorAll(
    ".btn-group, .back-btn, .header-section, .footer-section"
  );
  elementsToHide.forEach((el) => (el.style.display = "none"));

  window.print();

  setTimeout(() => {
    elementsToHide.forEach((el) => (el.style.display = ""));
  }, 1000);
}

function clearFormData(formId) {
  localStorage.removeItem(formId + "_data");
  const form = document.getElementById(formId);
  if (form) {
    form.reset();
    const previews = form.querySelectorAll(".image-preview");
    previews.forEach((preview) => {
      preview.innerHTML = "";
    });
  }
}

function clearAllData() {
  localStorage.removeItem("exchangeVisitForm_data");
  localStorage.removeItem("strategiesForm_data");
  localStorage.removeItem("programExecutionForm_data");

  const forms = document.querySelectorAll("form[id]");
  forms.forEach((form) => {
    form.reset();
    const previews = form.querySelectorAll(".image-preview");
    previews.forEach((preview) => {
      preview.innerHTML = "";
    });
  });

  showNotification("تم مسح جميع البيانات", "success");
}

function printExchangeVisit() {
  const formData = getFormData("exchangeVisitForm");
  const evidence1 = document
    .getElementById("evidence1-preview")
    .querySelector("img");
  const evidence2 = document
    .getElementById("evidence2-preview")
    .querySelector("img");

  const printWindow = window.open("", "_blank");
  const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
          <meta charset="UTF-8">
          <title>نموذج الزيارة التبادلية</title>
          <style>
              * { 
                  print-color-adjust: exact !important; 
                  color-adjust: exact !important; 
                  margin: 0; 
                  padding: 0; 
                  box-sizing: border-box;
              }
              body { 
                  font-family: 'Segoe UI', Tahoma, Arial, sans-serif; 
                  margin: 10px; 
                  direction: rtl; 
                  line-height: 1.3;
                  color: #333;
                  font-size: 12px;
                  background: white !important;
              }
              .header { 
                  background: #15445A !important;
                  color: white !important;
                  padding: 1rem;
                  text-align: center;
                  border-radius: 8px;
                  margin-bottom: 0.8rem;
                  print-color-adjust: exact !important;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 1.5rem;
              }
              .ministry-logo { 
                  width: 150px;
                  height: 112.5px;
                  display: flex; 
                  align-items: center; 
                  justify-content: center; 
                  print-color-adjust: exact !important;
                  flex-shrink: 0;
              }
              .ministry-logo img {
                  width: 150px;
                  height: 112.5px;
                  object-fit: contain;
              }
              .header-text { 
                  text-align: center;
                  flex: 1;
              }
              .header-text h1 { margin: 0 0 0.2rem 0; font-size: 1.1rem; }
              .header-text h2 { margin: 0 0 0.2rem 0; font-size: 0.9rem; }
              .header-text h3 { margin: 0; font-size: 0.8rem; }
              .form-section {
                  background: white !important;
                  border-radius: 8px;
                  padding: 0.8rem;
                  margin-bottom: 0.8rem;
              }
              .section-title {
                  background: white !important;
                  color: #3D7EB9 !important;
                  padding: 0.4rem;
                  border-radius: 6px;
                  text-align: center;
                  font-weight: bold;
                  font-size: 0.9rem;
                  margin-bottom: 0.6rem;
                  border: 1px solid #3D7EB9 !important;
                  print-color-adjust: exact !important;
              }
              .info-grid { 
                  display: grid; 
                  grid-template-columns: repeat(2, 1fr); 
                  gap: 0;
                  margin-bottom: 0.8rem;
                  border: 1px solid #3D7EB9 !important;
                  border-radius: 6px;
                  background: white !important;
                  border-collapse: collapse;
              }
              .info-item { 
                  background: white !important; 
                  border: 1px solid #3D7EB9 !important;
                  padding: 0.3rem;
                  display: flex; 
                  align-items: center;
                  print-color-adjust: exact !important;
              }
              .info-item:nth-child(3n) {
                  border-right: none;
              }
              .info-item:nth-last-child(-n+3) {
                  border-bottom: none;
              }
              .info-label { 
                  background: white !important;
                  color: #3D7EB9 !important; 
                  padding: 0.2rem 0.4rem;
                  border-radius: 3px;
                  font-weight: bold; 
                  margin-left: 0.3rem;
                  min-width: 60px;
                  text-align: center; 
                  font-size: 0.65rem;
                  border: 1px solid #3D7EB9 !important;
                  print-color-adjust: exact !important;
              }
              .info-value { 
                  flex: 1; 
                  font-size: 0.7rem; 
              }
              .text-section {
                  background: white !important;
                  border: 1px solid #3D7EB9 !important;
                  border-radius: 6px;
                  padding: 0.6rem;
                  margin-bottom: 0.8rem;
                  print-color-adjust: exact !important;
              }
              .text-title {
                  background: white !important;
                  color: #3D7EB9 !important;
                  font-weight: bold;
                  font-size: 0.8rem;
                  margin-bottom: 0.4rem;
                  padding: 0.2rem;
                  border-radius: 4px;
                  text-align: center;
                  border: 1px solid #3D7EB9 !important;
                  print-color-adjust: exact !important;
              }
              .objectives-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 0.8rem;
                  margin-bottom: 0.8rem;
                  align-items: stretch;
              }
              .objectives-list { 
                  background: white !important; 
                  border-radius: 6px; 
                  padding: 0.6rem; 
                  border: 1px solid #3D7EB9 !important; 
                  print-color-adjust: exact !important;
                  max-height: 150px;
                  overflow-y: auto;
              }
              .objective-item { 
                  margin-bottom: 0.4rem; 
                  font-size: 0.65rem; 
                  line-height: 1.4; 
                  padding: 0.3rem 0.2rem;
                  border-bottom: 1px solid #3D7EB9 !important; 
                  overflow: hidden;
                  text-overflow: ellipsis;
              }
              .objective-item:last-child {
                  border-bottom: none;
                  margin-bottom: 0;
              }
              .evidence-section {
                  margin-top: 0.8rem;
                  padding: 0.6rem;
                  border: 1px solid #3D7EB9 !important;
                  border-radius: 6px;
                  background: white !important;
                  print-color-adjust: exact !important;
              }
              .evidence-title {
                  background: white !important;
                  color: #3D7EB9 !important;
                  font-weight: bold;
                  font-size: 0.8rem;
                  margin-bottom: 0.4rem;
                  text-align: center;
                  padding: 0.2rem;
                  border-radius: 4px;
                  border: 1px solid #3D7EB9 !important;
                  print-color-adjust: exact !important;
              }
              .evidence-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 0.8rem;
              }
              .evidence-item {
                  text-align: center;
              }
              .evidence-item img {
                  max-width: 100%;
                  max-height: 300px;
                  border-radius: 4px;
                  border: 1px solid #3D7EB9 !important;
              }
              .evidence-label {
                  margin-top: 0.2rem;
                  font-weight: bold;
                  color: #333;
                  font-size: 0.65rem;
              }
              .signature-section { 
                  display: flex;
                  justify-content: flex-end;
                  margin-top: 0.8rem; 
                  padding-top: 0.8rem; 
                  border-top: 1px solid #3D7EB9 !important; 
              }
              .signature-item { 
                  text-align: center; 
                  padding: 0.4rem; 
                  background: white !important;
                  border: 1px solid #3D7EB9 !important;
                  border-radius: 6px;
                  print-color-adjust: exact !important;
                  width: 50%;
              }
              .signature-title { 
                  background: white !important;
                  color: #3D7EB9 !important; 
                  margin-bottom: 0.2rem; 
                  font-size: 0.7rem;
                  padding: 0.2rem;
                  border-radius: 3px;
                  border: 1px solid #3D7EB9 !important;
                  print-color-adjust: exact !important;
              }
              .signature-name { 
                  font-size: 0.8rem; 
                  font-weight: bold; 
                  color: #333; 
              }
              .footer {
                  background: #15445A !important;
                  color: white !important;
                  padding: 0.5rem;
                  text-align: center;
                  font-size: 0.7rem;
                  border-radius: 0 0 8px 8px;
                  margin-top: 0.8rem;
                  print-color-adjust: exact !important;
              }
              @media print {
                  * { print-color-adjust: exact !important; }
                  body { margin: 0; font-size: 10px; background: white !important; }
                  @page { margin: 0.5cm; }
                  .objectives-list::-webkit-scrollbar { display: none; }
              }
          </style>
      </head>
      <body>
          <div class="header">
              <div class="ministry-logo">
                  <img src="/images/ministry-logo-white.png" alt="وزارة التعليم">
              </div>
              <div class="header-text">
                  <h1>الإدارة العامة للتعليم بمحافظة الطائف</h1>
                  <h2>دار التوحيد الثانوية</h2>
                  <h3>تقرير الزيارات التبادلية</h3>
              </div>
          </div>
          
          <div class="form-section">
              <div class="section-title"> ${
                formData.programName || "غير محدد"
              }</div>
              
              <div class="info-grid">
                  <div class="info-item"><div class="info-label">اسم المعلم المزار:</div><div class="info-value">${
                    formData.teacherNameExchange || "غير محدد"
                  }</div></div>
                  <div class="info-item"><div class="info-label">الحصة:</div><div class="info-value">${getPeriodText(
                    formData.period
                  )}</div></div>
                  <div class="info-item"><div class="info-label">التاريخ الهجري:</div><div class="info-value">${
                    formData.hijriDate || "غير محدد"
                  }</div></div>
              </div>
                   <div class="objectives-grid">
                      <div class="objectives-list">
                          <div class="text-title">الزائرون</div>
                          ${generateObjectivesList(formData.visitors)}
                      </div>
                      <div class="objectives-list">
                          <div class="text-title">أهداف البرنامج</div>
                          ${generateObjectivesList(formData.programObjectives)}
                      </div>
                  </div>
              
              <div class="text-section">
                  <div class="text-title">التوصيات</div>
                  <div class="text-content">${
                    formData.recommendations || "غير محدد"
                  }</div>
              </div>
              
              ${
                evidence1 || evidence2
                  ? `
              <div class="evidence-section">
                  <div class="evidence-title">الشواهد والصور</div>
                  <div class="evidence-grid">
                      ${
                        evidence1
                          ? `
                      <div class="evidence-item">
                          <img src="${evidence1.src}" alt="الشاهد الأول">
                          <div class="evidence-label">الشاهد الأول</div>
                      </div>
                      `
                          : ""
                      }
                      ${
                        evidence2
                          ? `
                      <div class="evidence-item">
                          <img src="${evidence2.src}" alt="الشاهد الثاني">
                          <div class="evidence-label">الشاهد الثاني</div>
                      </div>
                      `
                          : ""
                      }
                  </div>
              </div>
              `
                  : ""
              }
              
              <div class="signature-section">
                  <div class="signature-item">
                      <div class="signature-title">مدير المدرسة</div>
                      <div class="signature-name">فهد بن حسن القحطاني</div>
                  </div>
              </div>
          </div>
          <div class="footer"></div>
      </body>
      </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
    clearFormData("exchangeVisitForm");
  }, 1000);
}

function printStrategiesReport() {
  const formData = getFormData("strategiesForm");
  const selectedTools = getSelectedTools();
  const evidence1 = document
    .getElementById("strategyEvidence1-preview")
    .querySelector("img");
  const evidence2 = document
    .getElementById("strategyEvidence2-preview")
    .querySelector("img");

  const printWindow = window.open("", "_blank");
  const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
          <meta charset="UTF-8">
          <title>تقرير تطبيق استراتيجية تدريسية</title>
          <style>
              * { 
                  print-color-adjust: exact !important; 
                  color-adjust: exact !important; 
                  margin: 0; 
                  padding: 0; 
                  box-sizing: border-box;
              }
              body { 
                  font-family: 'Segoe UI', Tahoma, Arial, sans-serif; 
                  margin: 10px; 
                  direction: rtl; 
                  line-height: 1.3;
                  color: #333;
                  font-size: 12px;
                  background: white !important;
              }
              .header { 
                  background: #15445A !important;
                  color: white !important;
                  padding: 1.5rem;
                  text-align: center;
                  border-radius: 8px;
                  margin-bottom: 1rem;
                  print-color-adjust: exact !important;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 2rem;
              }
              .ministry-logo { 
                  width: 160px;
                  height: 120px;
                  display: flex; 
                  align-items: center; 
                  justify-content: center; 
                  print-color-adjust: exact !important;
                  flex-shrink: 0;
              }
              .ministry-logo img {
                  width: 160px;
                  height: 120px;
                  object-fit: contain;
              }
              .header-text { 
                  text-align: center;
                  flex: 1;
              }
              .header-text h3 { margin: 0 0 0.2rem 0; font-size: 1.1rem; }
              .header-text h4 { margin: 0 0 0.2rem 0; font-size: 0.9rem; }
              .header-text h5 { margin: 0; font-size: 0.8rem; }
              .info-grid { 
                  display: grid; 
                  grid-template-columns: repeat(3, 1fr); 
                  gap: 0;
                  margin-bottom: 0.8rem;
                  border: 1px solid #3D7EB9 !important;
                  border-radius: 6px;
                  background: white !important;
                  border-collapse: collapse;
              }
              .info-item { 
                  background: white !important; 
                  border: 1px solid #3D7EB9 !important;
                  padding: 0.3rem;
                  display: flex; 
                  align-items: center;
                  print-color-adjust: exact !important;
              }
              .info-item:nth-child(3n) {
                  border-right: none;
              }
              .info-item:nth-last-child(-n+3) {
                  border-bottom: none;
              }
              .info-label { 
                  background: white !important;
                  color: #3D7EB9 !important; 
                  padding: 0.2rem 0.4rem;
                  border-radius: 3px;
                  font-weight: bold; 
                  margin-left: 0.3rem;
                  min-width: 60px;
                  text-align: center; 
                  font-size: 0.65rem;
                  border: 1px solid #3D7EB9 !important;
                  print-color-adjust: exact !important;
              }
              .info-value { flex: 1; font-size: 0.7rem; }
              .lesson-section {
                  background: white !important;
                  border: 1px solid #3D7EB9 !important;
                  border-radius: 6px;
                  padding: 0.3rem;
                  margin-bottom: 0.8rem;
                  display: flex;
                  align-items: center;
                  print-color-adjust: exact !important;
              }
              .objectives-section { margin: 0.8rem 0; }
              .section-title { 
                  background: white !important;
                  color: #3D7EB9 !important; 
                  padding: 0.4rem;
                  border-radius: 6px;
                  text-align: center; 
                  font-weight: bold; 
                  margin-bottom: 0.6rem;
                  font-size: 0.8rem;
                  border: 1px solid #3D7EB9 !important;
                  print-color-adjust: exact !important;
              }
              .objectives-grid { 
                  display: grid; 
                  grid-template-columns: 1fr 1fr; 
                  gap: 0.8rem; 
              }
              .objectives-list { 
                  background: white !important; 
                  border-radius: 6px; 
                  padding: 0.6rem; 
                  border: 1px solid #3D7EB9 !important; 
                  print-color-adjust: exact !important;
              }
              .objective-item { 
                  margin-bottom: 0.3rem; 
                  font-size: 0.65rem; 
                  line-height: 1.3; 
                  padding: 0.15rem 0;
                  border-bottom: 1px solid #3D7EB9 !important;
              }
              .objective-item:last-child {
                  border-bottom: none;
              }
              .tools-section { 
                  background: white !important; 
                  border-radius: 6px; 
                  padding: 0.6rem; 
                  border: 1px solid #3D7EB9 !important; 
                  print-color-adjust: exact !important;
              }
              .tools-title { 
                  background: white !important;
                  color: #3D7EB9 !important; 
                  font-weight: bold; 
                  margin-bottom: 0.4rem; 
                  text-align: center; 
                  font-size: 0.7rem;
                  padding: 0.2rem;
                  border-radius: 3px;
                  border: 1px solid #3D7EB9 !important;
                  print-color-adjust: exact !important;
              }
              .tools-list { 
                  display: grid; 
                  grid-template-columns: repeat(2, 1fr); 
                  gap: 0.2rem; 
              }
              .tool-item { 
                  font-size: 0.65rem; 
                  padding: 0.15rem 0; 
              }
              .evidence-section {
                  margin-top: 0.8rem;
                  padding: 0.6rem;
                  border: 1px solid #3D7EB9 !important;
                  border-radius: 6px;
                  background: white !important;
                  print-color-adjust: exact !important;
              }
              .evidence-title {
                  background: white !important;
                  color: #3D7EB9 !important;
                  font-weight: bold;
                  font-size: 0.8rem;
                  margin-bottom: 0.4rem;
                  text-align: center;
                  padding: 0.2rem;
                  border-radius: 4px;
                  border: 1px solid #3D7EB9 !important;
                  print-color-adjust: exact !important;
              }
              .evidence-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 0.8rem;
              }
              .evidence-item {
                  text-align: center;
              }
              .evidence-item img {
                  max-width: 100%;
                  max-height: 350px;
                  border-radius: 4px;
                  border: 1px solid #3D7EB9 !important;
              }
              .evidence-label {
                  margin-top: 0.2rem;
                  font-weight: bold;
                  color: #333;
                  font-size: 0.65rem;
              }
              .signature-section { 
                  display: grid; 
                  grid-template-columns: 1fr 1fr; 
                  gap: 0.8rem; 
                  margin-top: 0.8rem; 
                  padding-top: 0.8rem; 
                  border-top: 1px solid #3D7EB9 !important; 
              }
              .signature-item { 
                  text-align: center; 
                  padding: 0.4rem; 
                  background: white !important;
                  border: 1px solid #3D7EB9 !important;
                  border-radius: 6px;
                  print-color-adjust: exact !important;
              }
              .signature-title { 
                  background: white !important;
                  color: #3D7EB9 !important; 
                  margin-bottom: 0.2rem; 
                  font-size: 0.7rem;
                  padding: 0.2rem;
                  border-radius: 3px;
                  border: 1px solid #3D7EB9 !important;
                  print-color-adjust: exact !important;
              }
              .signature-name { 
                  font-size: 0.8rem; 
                  font-weight: bold; 
                  color: #333; 
              }
              .footer {
                  background: #15445A !important;
                  color: white !important;
                  padding: 0.5rem;
                  text-align: center;
                  font-size: 0.7rem;
                  border-radius: 0 0 8px 8px;
                  margin-top: 1rem;
                  print-color-adjust: exact !important;
              }
              @media print {
                  * { print-color-adjust: exact !important; }
                  body { margin: 0; font-size: 10px; background: white !important; }
                  @page { margin: 0.5cm; }
              }
          </style>
      </head>
      <body>
          <div class="header">
              <div class="ministry-logo">
                  <img src="/images/ministry-logo-white.png" alt="وزارة التعليم">
              </div>
              <div class="header-text">
                  <h3>الإدارة العامة للتعليم بمحافظة الطائف</h3>
                  <h4>دار التوحيد الثانوية</h4>
                  <h5>تقرير تطبيق استراتيجية تدريسية</h5>
              </div>
          </div>
          
          <div class="info-grid">
              <div class="info-item"><div class="info-label">الاستراتيجية:</div><div class="info-value">${
                formData.strategy || "غير محدد"
              }</div></div>
              <div class="info-item"><div class="info-label">المادة:</div><div class="info-value">${
                formData.subject || "غير محدد"
              }</div></div>
              <div class="info-item"><div class="info-label">تاريخ التنفيذ:</div><div class="info-value">${
                formData.implementationDate || "غير محدد"
              }</div></div>
              <div class="info-item"><div class="info-label">عدد الطلاب:</div><div class="info-value">${
                formData.studentsCount || "غير محدد"
              }</div></div>
              <div class="info-item"><div class="info-label">الفصل:</div><div class="info-value">${getPeriodText(
                formData.classroom || "غير محدد"
              )}</div></div>
              <div class="info-item"><div class="info-label">المرحلة الدراسية:</div><div class="info-value">${
                formData.grade || "غير محدد"
              }</div></div>
          </div>
          
          <div class="lesson-section">
              <div class="info-label">الدرس:</div>
              <div class="info-value">${formData.lesson || "غير محدد"}</div>
          </div>
          
          <div class="objectives-section">
              <div class="section-title">الأهداف والأدوات والوسائل التعليمية</div>
              <div class="objectives-grid">
                  <div class="objectives-list">
                      ${generateObjectivesList(formData.objectives)}
                  </div>
                  <div class="tools-section">
                      <div class="tools-title">الأدوات والوسائل التعليمية</div>
                      <div class="tools-list">
                          ${
                            selectedTools.length > 0
                              ? selectedTools
                                  .map(
                                    (tool) =>
                                      `<div class="tool-item">✓ ${tool}</div>`
                                  )
                                  .join("")
                              : '<div class="tool-item">لا توجد أدوات محددة</div>'
                          }
                      </div>
                  </div>
              </div>
          </div>
          
          ${
            evidence1 || evidence2
              ? `
          <div class="evidence-section">
              <div class="evidence-title">الشواهد</div>
              <div class="evidence-grid">
                  ${
                    evidence1
                      ? `
                  <div class="evidence-item">
                      <img src="${evidence1.src}" alt="الشاهد الأول">
                      <div class="evidence-label">صورة الشاهد الأول</div>
                  </div>
                  `
                      : ""
                  }
                  ${
                    evidence2
                      ? `
                  <div class="evidence-item">
                      <img src="${evidence2.src}" alt="الشاهد الثاني">
                      <div class="evidence-label">صورة الشاهد الثاني</div>
                  </div>
                  `
                      : ""
                  }
              </div>
          </div>
          `
              : ""
          }
          
          <div class="signature-section">
              <div class="signature-item">
                  <div class="signature-title">اسم المعلم</div>
                  <div class="signature-name">${
                    formData.teacherNameStrategy || "غير محدد"
                  }</div>
              </div>
              <div class="signature-item">
                  <div class="signature-title">مدير المدرسة</div>
                  <div class="signature-name">فهد بن حسن القحطاني</div>
              </div>
          </div>
          <div class="footer"></div>
      </body>
      </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
    clearFormData("strategiesForm");
  }, 1000);
}

function printProgramExecution() {
  const formData = getFormData("programExecutionForm");
  const evidence1 = document
    .getElementById("evidence1Report-preview")
    .querySelector("img");
  const evidence2 = document
    .getElementById("evidence2Report-preview")
    .querySelector("img");

  const printWindow = window.open("", "_blank");
  const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
          <meta charset="UTF-8">
          <title>تقرير تنفيذ البرنامج</title>
          <style>
              * { 
                  print-color-adjust: exact !important; 
                  color-adjust: exact !important; 
                  margin: 0; 
                  padding: 0; 
                  box-sizing: border-box;
              }
              body { 
                  font-family: 'Segoe UI', Tahoma, Arial, sans-serif; 
                  margin: 10px; 
                  direction: rtl; 
                  line-height: 1.3;
                  color: #333;
                  font-size: 12px;
                  background: white !important;
              }
              .header { 
                  background: #15445A !important;
                  color: white !important;
                  padding: 1rem;
                  text-align: center;
                  border-radius: 8px;
                  margin-bottom: 0.8rem;
                  print-color-adjust: exact !important;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 1.5rem;
              }
              .ministry-logo { 
                  width: 150px;
                  height: 112.5px;
                  display: flex; 
                  align-items: center; 
                  justify-content: center; 
                  print-color-adjust: exact !important;
                  flex-shrink: 0;
              }
              .ministry-logo img {
                  width: 150px;
                  height: 112.5px;
                  object-fit: contain;
              }
              .header-text { 
                  text-align: center;
                  flex: 1;
              }
              .header-text h1 { margin: 0 0 0.2rem 0; font-size: 1.1rem; }
              .header-text h2 { margin: 0 0 0.2rem 0; font-size: 0.9rem; }
              .header-text h3 { margin: 0; font-size: 0.8rem; }
              .form-section {
                  background: white !important;
                  border-radius: 8px;
                  padding: 0.8rem;
                  margin-bottom: 0.8rem;
              }
              .section-title {
                  background: white !important;
                  color: #3D7EB9 !important;
                  padding: 0.4rem;
                  border-radius: 6px;
                  text-align: center;
                  font-weight: bold;
                  font-size: 0.9rem;
                  margin-bottom: 0.6rem;
                  border: 1px solid #3D7EB9 !important;
                  print-color-adjust: exact !important;
              }
              .info-grid { 
                  display: grid; 
                  grid-template-columns: repeat(3, 1fr); 
                  gap: 0;
                  margin-bottom: 0.8rem;
                  border: 1px solid #3D7EB9 !important;
                  border-radius: 6px;
                  background: white !important;
                  border-collapse: collapse;
              }
              .info-item { 
                  background: white !important; 
                  border: 1px solid #3D7EB9 !important;
                  padding: 0.3rem;
                  display: flex; 
                  align-items: center;
                  print-color-adjust: exact !important;
              }
              .info-item:nth-child(3n) {
                  border-right: none;
              }
              .info-item:nth-last-child(-n+3) {
                  border-bottom: none;
              }
              .info-item.empty {
                  border-right: none;
                  border-bottom: none;
              }
              .info-label { 
                  background: white !important;
                  color: #3D7EB9 !important; 
                  padding: 0.2rem 0.4rem;
                  border-radius: 3px;
                  font-weight: bold; 
                  margin-left: 0.3rem;
                  min-width: 60px;
                  text-align: center; 
                  font-size: 0.65rem;
                  border: 1px solid #3D7EB9 !important;
                  print-color-adjust: exact !important;
              }
              .info-value { 
                  flex: 1; 
                  font-size: 0.7rem; 
              }
              .text-section {
                  background: white !important;
                  border: 1px solid #3D7EB9 !important;
                  border-radius: 6px;
                  padding: 0.6rem;
                  margin-bottom: 0.8rem;
                  print-color-adjust: exact !important;
              }
              .text-title {
                  background: white !important;
                  color: #3D7EB9 !important;
                  font-weight: bold;
                  font-size: 0.8rem;
                  margin-bottom: 0.4rem;
                  padding: 0.2rem;
                  border-radius: 4px;
                  text-align: center;
                  border: 1px solid #3D7EB9 !important;
                  print-color-adjust: exact !important;
              }
              .text-content {
                  line-height: 1.4;
                  font-size: 0.7rem;
                  background: white !important;
              }
              .objectives-list { 
                  background: white !important; 
                  border-radius: 6px; 
                  padding: 0.6rem; 
                  border: 1px solid #3D7EB9 !important; 
                  print-color-adjust: exact !important;
              }
              .objective-item { 
                  margin-bottom: 0.3rem; 
                  font-size: 0.65rem; 
                  line-height: 1.3; 
                  padding: 0.15rem 0;
                  border-bottom: 1px solid #3D7EB9 !important;
              }
              .objective-item:last-child {
                  border-bottom: none;
              }
              .evidence-section {
                  margin-top: 0.8rem;
                  padding: 0.6rem;
                  border: 1px solid #3D7EB9 !important;
                  border-radius: 6px;
                  background: white !important;
                  print-color-adjust: exact !important;
              }
              .evidence-title {
                  background: white !important;
                  color: #3D7EB9 !important;
                  font-weight: bold;
                  font-size: 0.8rem;
                  margin-bottom: 0.4rem;
                  text-align: center;
                  padding: 0.2rem;
                  border-radius: 4px;
                  border: 1px solid #3D7EB9 !important;
                  print-color-adjust: exact !important;
              }
              .evidence-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 0.8rem;
              }
              .evidence-item {
                  text-align: center;
              }
              .evidence-item img {
                  max-width: 100%;
                  max-height: 350px;
                  border-radius: 4px;
                  border: 1px solid #3D7EB9 !important;
              }
              .evidence-label {
                  margin-top: 0.2rem;
                  font-weight: bold;
                  color: #333;
                  font-size: 0.65rem;
              }
              .signature-section { 
                  display: grid; 
                  grid-template-columns: 1fr 1fr; 
                  gap: 0.8rem; 
                  margin-top: 0.8rem; 
                  padding-top: 0.8rem; 
                  border-top: 1px solid #3D7EB9 !important; 
              }
              .signature-item { 
                  text-align: center; 
                  padding: 0.4rem; 
                  background: white !important;
                  border: 1px solid #3D7EB9 !important;
                  border-radius: 6px;
                  print-color-adjust: exact !important;
              }
              .signature-title { 
                  background: white !important;
                  color: #3D7EB9 !important; 
                  margin-bottom: 0.2rem; 
                  font-size: 0.7rem;
                  padding: 0.2rem;
                  border-radius: 3px;
                  border: 1px solid #3D7EB9 !important;
                  print-color-adjust: exact !important;
              }
              .signature-name { 
                  font-size: 0.8rem; 
                  font-weight: bold; 
                  color: #333; 
              }
              .footer {
                  background: #15445A !important;
                  color: white !important;
                  padding: 0.5rem;
                  text-align: center;
                  font-size: 0.7rem;
                  border-radius: 0 0 8px 8px;
                  margin-top: 0.8rem;
                  print-color-adjust: exact !important;
              }
              @media print {
                  * { print-color-adjust: exact !important; }
                  body { margin: 0; font-size: 10px; background: white !important; }
                  @page { margin: 0.5cm; }
              }
          </style>
      </head>
      <body>
          <div class="header">
              <div class="ministry-logo">
                  <img src="/images/ministry-logo-white.png" alt="وزارة التعليم">
              </div>
              <div class="header-text">
                  <h1>الإدارة العامة للتعليم بمحافظة الطائف</h1>
                  <h2>دار التوحيد الثانوية</h2>
                  <h3>تقرير تنفيذ برنامج</h3>
              </div>
          </div>
          
          <div class="form-section">
              <div class="section-title">${
                formData.programNameReport || "نموذج تنفيذ برنامج"
              }</div>
              
              <div class="info-grid">
                  <div class="info-item"><div class="info-label">اسم البرنامج:</div><div class="info-value">${
                    formData.programNameReport || "غير محدد"
                  }</div></div>
                  <div class="info-item"><div class="info-label">المنفذ:</div><div class="info-value">${
                    formData.implementer || "غير محدد"
                  }</div></div>
                  <div class="info-item"><div class="info-label">مكان التنفيذ:</div><div class="info-value">${
                    formData.location || "غير محدد"
                  }</div></div>
                  <div class="info-item"><div class="info-label">المستفيدون:</div><div class="info-value">${getBeneficiariesText(
                    formData.beneficiaries
                  )}</div></div>
                  <div class="info-item"><div class="info-label">عدد المستفيدين:</div><div class="info-value">${
                    formData.beneficiariesCount || "غير محدد"
                  }</div></div>
                  <div class="info-item"><div class="info-label">تاريخ التنفيذ الهجري:</div><div class="info-value">${
                    formData.implementationDateReport || "غير محدد"
                  }</div></div>
              </div>
              
              <div class="text-section">
                  <div class="text-title">الأهداف:</div>
                  <div class="objectives-list">
                      ${generateObjectivesList(
                        formData.programObjectivesReport
                      )}
                  </div>
              </div>
              
              ${
                evidence1 || evidence2
                  ? `
              <div class="evidence-section">
                  <div class="evidence-title">الشواهد والصور</div>
                  <div class="evidence-grid">
                      ${
                        evidence1
                          ? `
                      <div class="evidence-item">
                          <img src="${evidence1.src}" alt="الشاهد الأول">
                          <div class="evidence-label">الشاهد الأول</div>
                      </div>
                      `
                          : ""
                      }
                      ${
                        evidence2
                          ? `
                      <div class="evidence-item">
                          <img src="${evidence2.src}" alt="الشاهد الثاني">
                          <div class="evidence-label">الشاهد الثاني</div>
                      </div>
                      `
                          : ""
                      }
                  </div>
              </div>
              `
                  : ""
              }
              
              <div class="signature-section">
                  <div class="signature-item">
                      <div class="signature-title">المنفذ</div>
                      <div class="signature-name">${
                        formData.implementer || "غير محدد"
                      }</div>
                  </div>
                  <div class="signature-item">
                      <div class="signature-title">مدير المدرسة</div>
                      <div class="signature-name">فهد بن حسن القحطاني</div>
                  </div>
              </div>
          </div>
          <div class="footer"></div>
      </body>
      </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
    clearFormData("programExecutionForm");
  }, 1000);
}

function saveFormData(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  const formData = new FormData(form);
  const data = {};

  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }

  localStorage.setItem(formId + "_data", JSON.stringify(data));
  showNotification("تم حفظ البيانات بنجاح", "success");
}

function loadFormData(formId) {
  const savedData = localStorage.getItem(formId + "_data");
  if (!savedData) return;

  const data = JSON.parse(savedData);
  const form = document.getElementById(formId);
  if (!form) return;

  Object.keys(data).forEach((key) => {
    const input = form.querySelector(`[name="${key}"]`);
    if (input) {
      input.value = data[key];
    }
  });
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <i class="fas fa-${
          type === "success" ? "check-circle" : "info-circle"
        }"></i>
        <span>${message}</span>
    `;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return false;

  const requiredFields = form.querySelectorAll("[required]");
  let isValid = true;

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      field.classList.add("is-invalid");
      isValid = false;
    } else {
      field.classList.remove("is-invalid");
    }
  });

  if (!isValid) {
    showNotification("يرجى ملء جميع الحقول المطلوبة", "error");
  }

  return isValid;
}

document.addEventListener("DOMContentLoaded", () => {
  clearAllData();
  setupImageUpload("evidence1", "evidence1-preview");
  setupImageUpload("evidence2", "evidence2-preview");
  setupImageUpload("strategyEvidence1", "strategyEvidence1-preview");
  setupImageUpload("strategyEvidence2", "strategyEvidence2-preview");
  setupImageUpload("evidence1Report", "evidence1Report-preview");
  setupImageUpload("evidence2Report", "evidence2Report-preview");
  loadFormData("exchangeVisitForm");
  loadFormData("strategiesForm");
  loadFormData("programExecutionForm");

  const forms = document.querySelectorAll("form[id]");
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (validateForm(form.id)) {
        saveFormData(form.id);
        if (form.id === "programExecutionForm") {
          printProgramExecution();
        } else if (form.id === "strategiesForm") {
          printStrategiesReport();
        } else if (form.id === "exchangeVisitForm") {
          printExchangeVisit();
        }
      }
    });
  });
});

function toggleSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.classList.toggle("collapsed");
  }
}

function updateHijriDate() {
  const hijriDateInputs = [
    document.getElementById("hijriDate"),
    document.getElementById("implementationDate"),
    document.getElementById("implementationDateReport"),
  ];
  hijriDateInputs.forEach((input) => {
    if (input && !input.value) {
      const today = new Date();
      const hijriDate = `${today.getFullYear() - 579}/${
        today.getMonth() + 1
      }/${today.getDate()}`;
      input.value = hijriDate;
    }
  });
}

function exportData(formId) {
  const savedData = localStorage.getItem(formId + "_data");
  if (savedData) {
    const blob = new Blob([savedData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formId}_data.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

function importData(formId, file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      localStorage.setItem(formId + "_data", JSON.stringify(data));
      loadFormData(formId);
      showNotification("تم استيراد البيانات بنجاح", "success");
    } catch (error) {
      showNotification("خطأ في استيراد البيانات", "error");
    }
  };
  reader.readAsText(file);
}

function getFormData(formId) {
  const form = document.getElementById(formId);
  const formData = new FormData(form);
  const data = {};

  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }

  return data;
}

function getBeneficiariesText(value) {
  switch (value) {
    case "students":
      return "طلاب";
    case "teachers":
      return "معلمين";
    default:
      return value || "غير محدد";
  }
}

function toArabicNumbers(str) {
  return String(str).replace(/[0-9]/g, function (d) {
    return "٠١٢٣٤٥٦٧٨٩"[d];
  });
}

function getPeriodText(value) {
  return value ? ` ${toArabicNumbers(value)}` : "غير محدد";
}

function getSelectedTools() {
  const checkboxes = document.querySelectorAll('input[name="tools"]:checked');
  return Array.from(checkboxes).map((cb) => cb.value);
}

function generateObjectivesList(objectives) {
  if (!objectives || objectives.trim() === "") {
    return '<div class="objective-item">لا توجد أهداف</div>';
  }

  const lines = objectives
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  let objectivesHtml = "";
  lines.forEach((line, index) => {
    const cleanObjective = line.replace(/^\d+[.\-\)\s]*/, "").trim();
    if (cleanObjective) {
      objectivesHtml += `<div class="objective-item">${toArabicNumbers(
        index + 1
      )}. ${cleanObjective}</div>`;
    }
  });

  return objectivesHtml || '<div class="objective-item">لا توجد أهداف</div>';
}
