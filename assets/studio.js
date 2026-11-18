document.documentElement.classList.add("js");
const nav=document.querySelector(".nav"),menu=document.querySelector(".menu");
if(menu&&nav){
 const header=menu.closest(".header"),mobile=window.matchMedia("(max-width: 860px)"),label=menu.querySelector(".menu-label");
 const setMenu=(open,restoreFocus=false)=>{
  nav.classList.toggle("open",open);
  menu.setAttribute("aria-expanded",String(open));
  menu.setAttribute("aria-label",open?"Menüyü kapat":"Menüyü aç");
  if(label)label.textContent=open?"Kapat":"Menü";
  if(restoreFocus)menu.focus();
 };
 menu.addEventListener("click",()=>setMenu(!nav.classList.contains("open")));
 nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>setMenu(false)));
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&nav.classList.contains("open"))setMenu(false,true)});
 document.addEventListener("click",e=>{if(nav.classList.contains("open")&&!header.contains(e.target))setMenu(false)});
 document.addEventListener("focusin",e=>{if(nav.classList.contains("open")&&!header.contains(e.target))setMenu(false)});
 const reset=()=>setMenu(false);
 if(mobile.addEventListener)mobile.addEventListener("change",reset);else mobile.addListener(reset);
 window.addEventListener("pageshow",reset);
}
if("IntersectionObserver"in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:0,rootMargin:"0px 0px -24px 0px"});document.querySelectorAll(".reveal").forEach(x=>io.observe(x))}else{document.querySelectorAll(".reveal").forEach(x=>x.classList.add("in"))}document.querySelectorAll("[data-year]").forEach(x=>x.textContent=new Date().getFullYear());
const projectForm = document.querySelector("[data-project-form]");

if (projectForm) {
  const topic = projectForm.elements.namedItem("topic");
  const topicParam = new URLSearchParams(location.search).get("konu");
  const submit = projectForm.querySelector('[type="submit"]');
  const panel = projectForm.querySelector("[data-brief-panel]");
  const heading = panel.querySelector("h3");
  const summary = panel.querySelector("[data-brief-output]");
  const status = panel.querySelector("[data-brief-status]");
  const whatsappLink = panel.querySelector("[data-brief-whatsapp]");
  const emailLink = panel.querySelector("[data-brief-email]");

  if (topicParam) {
    const requested = topicParam.toLocaleLowerCase("tr");
    const match = [...topic.options].find(option =>
      option.value && option.value.toLocaleLowerCase("tr").includes(requested)
    );
    if (match) topic.value = match.value;
  }

  projectForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!projectForm.reportValidity()) return;

    const fields = new FormData(projectForm);
    const value = field => String(fields.get(field) ?? "").trim();
    const details = [
      ["Ad", value("name")],
      ["E-posta", value("email")],
      ["Konu", value("topic")],
      ["Firma", value("company")],
      ["Hedef zaman", value("timing") === "Henüz net değil" ? "" : value("timing")],
      ["Öncelik", value("priority")]
    ];
    const summaryLines = details.filter(([, text]) => text).map(([label, text]) => label + ": " + text);
    const brief = summaryLines.join("\n") + "\n\n" + value("message");

    summary.textContent = brief;
    whatsappLink.href = "https://wa.me/905075385671?text=" + encodeURIComponent("Merhaba ALAT Medya,\n\n" + brief);
    emailLink.href = "mailto:destek@alatmedya.tech?subject=" + encodeURIComponent("ALAT Medya — " + value("topic")) + "&body=" + encodeURIComponent(brief);
    status.textContent = "";
    panel.hidden = false;
    submit.setAttribute("aria-expanded", "true");
    heading.focus();
  });

  projectForm.addEventListener("input", () => {
    panel.hidden = true;
    submit.setAttribute("aria-expanded", "false");
  });

  panel.querySelector("[data-brief-copy]").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(summary.textContent);
      status.textContent = "Proje özeti kopyalandı.";
    } catch {
      status.textContent = "Önizleme metnini seçip kopyalayabilirsin.";
    }
  });
}

document.querySelectorAll("[data-demo]").forEach(demo => {
  const navigation = demo.querySelector("[data-demo-nav]");
  const buttons = [...navigation.querySelectorAll("[data-demo-button]")];
  const panels = [...demo.querySelectorAll("[data-demo-panel]")];

  function selectDemoPanel(panelId) {
    buttons.forEach(button => {
      const selected = button.getAttribute("aria-controls") === panelId;
      button.setAttribute("aria-pressed", String(selected));
    });
    panels.forEach(panel => { panel.hidden = panel.id !== panelId; });
  }

  buttons.forEach(button => {
    button.addEventListener("click", () => selectDemoPanel(button.getAttribute("aria-controls")));
  });
  demo.classList.add("product-demo--active");
  selectDemoPanel(panels[0].id);
  navigation.hidden = false;
});

document.querySelectorAll("[data-copy-email]").forEach(btn=>{btn.addEventListener("click",async()=>{const email=btn.getAttribute("data-copy-email")||"destek@alatmedya.tech";const copyStatus=document.querySelector("[data-copy-status]");try{await navigator.clipboard.writeText(email);if(copyStatus)copyStatus.textContent="E-posta adresi panoya kopyalandı: "+email;btn.textContent="Kopyalandı ✓";}catch{if(copyStatus)copyStatus.textContent="Adres: "+email;}})});

document.querySelectorAll('.nav a').forEach(a=>{if(a.pathname===location.pathname||(location.pathname==='/'&&a.getAttribute('href')==='index.html'))a.setAttribute('aria-current','page')});
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(x=>{const active=x===b;x.classList.toggle('active',active);x.setAttribute('aria-pressed',String(active))});document.querySelectorAll('[data-category]').forEach(x=>x.hidden=b.dataset.filter!=='all'&&x.dataset.category!==b.dataset.filter)}));
const word=document.querySelector('#lab-word'),output=document.querySelector('#lab-output'),color=document.querySelector('#lab-color');if(word&&output)word.addEventListener('input',()=>output.textContent=word.value.trim()||'MERAK');if(color)color.addEventListener('change',()=>document.querySelector('.type-playground').dataset.tone=color.value);
const motionButtons = document.querySelectorAll("[data-motion]");

motionButtons.forEach(button => {
  button.addEventListener("click", () => {
    const paused = document.body.classList.toggle("motion-paused");

    motionButtons.forEach(control => {
      control.querySelector("[data-motion-label]").textContent =
        paused ? "Hareketi sürdür" : "Hareketi durdur";
    });
  });
});
