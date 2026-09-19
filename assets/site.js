const body = document.body;
const language = document.documentElement.lang === "tr" ? "tr" : "en";
const page = body.dataset.page || "home";
const assetPrefix = language === "tr" ? "../" : "";
const currentYear = new Date().getFullYear();

const copy = {
  en: {
    nav: "Main navigation",
    home: "Home",
    services: "Services",
    about: "About",
    perspective: "Perspective",
    experience: "Experience",
    talk: "Talk to us",
    menu: "Open menu",
    company: "Company",
    reach: "Where we work",
    footerText: "Regulation, technology, risk and assurance advisory for financial institutions and regulated services.",
    regions: "Türkiye · United Kingdom · European Union · Malta · Bahrain · Saudi Arabia",
    rights: `© ${currentYear} Consultancy BA. All rights reserved.`,
    footerEnd: "Senior expertise · Proportionate controls · End-to-end solutions",
    ctaLabel: "A focused first conversation",
    ctaText: "Clarify the issue, decision context and expected outcome.",
    serviceNames: [
      "Financial Institution Licensing & Establishment",
      "Regulatory Compliance & Regulatory Processes",
      "Technology & Operational Resilience",
      "IT Risk, Regulation & Assurance",
      "Financial Crime Compliance",
      "Strategy & Transformation Advisory"
    ],
    serviceNotes: [
      "Authorisation and launch readiness",
      "Continuous compliance and response",
      "Architecture and resilience",
      "Control, testing and remediation",
      "AML/KYC, fraud and sanctions",
      "From strategy to executable roadmap"
    ]
  },
  tr: {
    nav: "Ana navigasyon",
    home: "Ana Sayfa",
    services: "Hizmetler",
    about: "Hakkımızda",
    perspective: "Perspektif",
    experience: "Deneyim",
    talk: "Bize ulaşın",
    menu: "Menüyü aç",
    company: "Kurumsal",
    reach: "Çalıştığımız bölgeler",
    footerText: "Finansal kuruluşlar ve regüle hizmetler için regülasyon, teknoloji, risk ve denetim danışmanlığı.",
    regions: "Türkiye · Birleşik Krallık · Avrupa Birliği · Malta · Bahreyn · Suudi Arabistan",
    rights: `© ${currentYear} Consultancy BA. Tüm hakları saklıdır.`,
    footerEnd: "Kıdemli uzmanlık · Ölçülü kontroller · Uçtan uca çözümler",
    ctaLabel: "Odaklı bir ilk görüşme",
    ctaText: "Konuyu, karar bağlamını ve beklenen sonucu birlikte netleştirelim.",
    serviceNames: [
      "Finansal Kuruluşlar İçin Lisans ve Kuruluş Süreçleri",
      "Regülasyon, Uyum ve Regülatör Süreçleri",
      "Teknoloji ve Operasyonel Dayanıklılık",
      "IT Risk, Regülasyon ve Denetim",
      "Finansal Suçlar Uyumu",
      "Strateji ve Dönüşüm Danışmanlığı"
    ],
    serviceNotes: [
      "Kuruluş ve faaliyet izni",
      "Sürekli uyum ve regülatör yanıtı",
      "Mimari ve dayanıklılık",
      "Kontrol, test ve bulgu",
      "AML/KYC, fraud ve yaptırımlar",
      "Stratejiden uygulanabilir yol haritasına"
    ]
  }
};

const servicePages = [
  "licensing-establishment.html",
  "regulatory-compliance.html",
  "technology-resilience.html",
  "it-risk-assurance.html",
  "financial-crime.html",
  "strategy-transformation.html"
];
const serviceIds = ["licensing", "regulatory", "technology", "it-risk", "financial-crime", "strategy"];
const companyPages = [
  ["about.html", "about"],
  ["perspective.html", "perspective"],
  ["experience.html", "experience"]
];
const t = copy[language];

const seoBase = "https://consultancyba.com";
const seoRoutes = {
  home: "",
  contact: "contact.html",
  about: "about.html",
  perspective: "perspective.html",
  experience: "experience.html",
  licensing: "licensing-establishment.html",
  regulatory: "regulatory-compliance.html",
  technology: "technology-resilience.html",
  "it-risk": "it-risk-assurance.html",
  "financial-crime": "financial-crime.html",
  strategy: "strategy-transformation.html"
};

function seoUrl(targetLanguage, route) {
  const languagePath = targetLanguage === "tr" ? "/tr" : "";
  return route ? `${seoBase}${languagePath}/${route}` : `${seoBase}${languagePath}/`;
}

function upsertSeoLink(rel, href, hreflang) {
  const languageSelector = hreflang ? `[hreflang="${hreflang}"]` : "";
  let link = document.head.querySelector(`link[rel="${rel}"]${languageSelector}`);
  if (!link) {
    link = document.createElement("link");
    link.rel = rel;
    document.head.append(link);
  }
  link.href = href;
  if (hreflang) link.hreflang = hreflang;
  return link;
}

function upsertSeoMeta(attribute, key, content) {
  let meta = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attribute, key);
    document.head.append(meta);
  }
  meta.content = content;
}

function renderSeo() {
  const route = seoRoutes[page];
  if (route === undefined) return;

  const enUrl = seoUrl("en", route);
  const trUrl = seoUrl("tr", route);
  const canonicalUrl = language === "tr" ? trUrl : enUrl;
  upsertSeoLink("canonical", canonicalUrl);
  upsertSeoLink("alternate", enUrl, "en");
  upsertSeoLink("alternate", trUrl, "tr");
  upsertSeoLink("alternate", enUrl, "x-default");
  upsertSeoLink("icon", `${assetPrefix}assets/images/CBA_LOGO_ICON.png`).type = "image/png";

  const description = document.head.querySelector('meta[name="description"]')?.content || t.footerText;
  upsertSeoMeta("property", "og:type", "website");
  upsertSeoMeta("property", "og:site_name", "Consultancy BA");
  upsertSeoMeta("property", "og:title", document.title);
  upsertSeoMeta("property", "og:description", description);
  upsertSeoMeta("property", "og:url", canonicalUrl);
  const socialImage = "CBA_SOCIAL_IMAGE.png";
  upsertSeoMeta("property", "og:image", `${seoBase}/assets/images/${socialImage}`);
  upsertSeoMeta("property", "og:locale", language === "tr" ? "tr_TR" : "en_GB");
  upsertSeoMeta("name", "twitter:card", "summary_large_image");
  upsertSeoMeta("name", "twitter:title", document.title);
  upsertSeoMeta("name", "twitter:description", description);
  upsertSeoMeta("name", "twitter:image", `${seoBase}/assets/images/${socialImage}`);

  let robots = document.head.querySelector('meta[name="robots"]');
  if (!robots) {
    robots = document.createElement("meta");
    robots.name = "robots";
    document.head.append(robots);
  }
  robots.content = "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

  let structuredData;
  if (page === "home" && language === "en") {
    structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${seoBase}/#website`,
          url: `${seoBase}/`,
          name: "Consultancy BA",
          inLanguage: ["en", "tr"]
        },
        {
          "@type": "Organization",
          "@id": `${seoBase}/#organization`,
          name: "Consultancy BA",
          url: `${seoBase}/`,
          logo: `${seoBase}/assets/images/CBA_LOGO_ICON.png`,
          email: "info@consultancyba.com",
          areaServed: ["Türkiye", "United Kingdom", "European Union", "Malta", "Germany", "Bahrain", "Saudi Arabia", "Laos", "Libya"]
        }
      ]
    };
  } else if (page !== "home") {
    structuredData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: t.home, item: seoUrl(language, "") },
        { "@type": "ListItem", position: 2, name: document.querySelector("h1")?.textContent.trim() || document.title, item: canonicalUrl }
      ]
    };
  }

  if (structuredData) {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.seo = "structured-data";
    script.textContent = JSON.stringify(structuredData);
    document.head.append(script);
  }
}

function renderHeader() {
  const header = document.querySelector("#site-header");
  if (!header) return;

  const serviceLinks = servicePages.map((href, index) => `
    <a class="service-nav-item" href="${href}" ${page === serviceIds[index] ? 'aria-current="page"' : ""}>
      <b>0${index + 1}</b><span><strong>${t.serviceNames[index]}</strong><span>${t.serviceNotes[index]}</span></span>
    </a>`).join("");
  const currentFile = location.pathname.split("/").pop() || "index.html";
  const trTarget = body.dataset.tr || (language === "tr" ? currentFile : `tr/${currentFile}`);
  const enTarget = body.dataset.en || (language === "en" ? currentFile : `../${currentFile}`);
  const languageQuery = page === "contact" ? location.search : "";

  header.innerHTML = `<nav class="nav" aria-label="${t.nav}">
    <a class="logo" href="index.html" aria-label="Consultancy BA ${t.home}"><img src="${assetPrefix}assets/images/CBA_LOGO_HORIZONTAL.png" alt="Consultancy BA" width="512" height="191" decoding="async"></a>
    <div class="nav-links" id="nav-links">
      <a class="nav-link" href="about.html" ${page === "about" ? 'aria-current="page"' : ""}>${t.about}</a>
      <div class="services-menu"><button class="services-trigger" type="button" aria-expanded="false">${t.services}<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4 7 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2"/></svg></button><div class="services-dropdown">${serviceLinks}</div></div>
      <a class="nav-link" href="perspective.html" ${page === "perspective" ? 'aria-current="page"' : ""}>${t.perspective}</a>
      <a class="nav-link" href="experience.html" ${page === "experience" ? 'aria-current="page"' : ""}>${t.experience}</a>
      <a class="nav-link mobile-talk" href="contact.html">${t.talk}</a>
    </div>
    <div class="nav-tools">
      <div class="language-switch" aria-label="Language"><a href="${enTarget}${languageQuery}" ${language === "en" ? 'aria-current="true"' : ""}>EN</a><a href="${trTarget}${languageQuery}" ${language === "tr" ? 'aria-current="true"' : ""}>TR</a></div>
      <a class="btn btn-primary header-talk" href="contact.html">${t.talk}</a>
      <button class="menu-toggle" type="button" aria-label="${t.menu}" aria-expanded="false" aria-controls="nav-links"><span aria-hidden="true"></span></button>
    </div>
  </nav>`;
}

function renderFooter() {
  const footer = document.querySelector("#site-footer");
  if (!footer) return;
  const serviceLinks = servicePages.map((href, index) => `<a href="${href}">${t.serviceNames[index]}</a>`).join("");
  const companyLinks = companyPages.map(([href, id]) => `<a href="${href}">${t[id]}</a>`).join("");
  const footerCta = page === "contact" ? "" : `<div class="footer-cta"><div class="footer-cta-copy"><span>${t.ctaLabel}</span><strong>${t.ctaText}</strong></div><a class="btn btn-secondary" href="contact.html">${t.talk}</a></div>`;
  footer.innerHTML = `${footerCta}<div class="footer-main footer-main-expanded">
    <div class="footer-brand"><img class="footer-logo" src="${assetPrefix}assets/images/CBA_LOGO_HORIZONTAL_LIGHT.png" alt="Consultancy BA" width="512" height="191" decoding="async"><p>${t.footerText}</p><div class="footer-reach"><p>${t.regions}</p></div></div>
    <div class="footer-company"><h3>${t.company}</h3><div class="footer-links">${companyLinks}<a href="contact.html">${t.talk}</a></div></div>
    <div class="footer-services"><h3>${t.services}</h3><div class="footer-links footer-service-links">${serviceLinks}</div></div>
  </div><div class="footer-bottom"><span>${t.rights}</span><span>${t.footerEnd}</span></div>`;
}

const askOptions = {
  en: [
    ["launch", "Launch or extend a regulated business", "Clarify the regulatory perimeter, licence route, operating model and readiness plan.", "licensing-establishment.html", "Explore licensing & establishment"],
    ["comply", "Run ongoing compliance", "Build a repeatable compliance calendar, obligation register, evidence model and management view.", "regulatory-compliance.html", "Explore regulatory compliance"],
    ["respond", "Respond to a regulator or remediate findings", "Structure requests, evidence, root cause, action ownership, validation and closure.", "regulatory-compliance.html", "Explore regulatory response"],
    ["resilience", "Improve technology or operational resilience", "Map critical services and dependencies, then test recovery assumptions and operating readiness.", "technology-resilience.html", "Explore technology resilience"],
    ["assure", "Prepare for IT audit or assurance", "Connect requirements, risks, controls, evidence, testing and sustainable finding closure.", "it-risk-assurance.html", "Explore IT risk & assurance"],
    ["crime", "Strengthen financial crime controls", "Assess AML/KYC, sanctions, monitoring, fraud, investigations, data and quality as one control system.", "financial-crime.html", "Explore financial crime compliance"],
    ["transform", "Make a strategy or transformation decision", "Test the business case, target operating model, architecture, roadmap and value logic.", "strategy-transformation.html", "Explore strategy & transformation"],
    ["learn", "Understand an emerging issue", "Start with our perspective themes, then move to the service area that best fits the decision.", "perspective.html", "Explore our perspective"],
    ["unsure", "I am not sure where the issue fits", "Use a focused first conversation to define the problem, urgency, stakeholders and useful output.", "contact.html", "Talk to us"]
  ],
  tr: [
    ["launch", "Regüle bir iş kurmak veya kapsamını genişletmek", "Regülasyon kapsamını, lisans rotasını, işletim modelini ve hazırlık planını netleştirin.", "licensing-establishment.html", "Lisans ve kuruluş hizmetini incele"],
    ["comply", "Sürekli uyumu işletmek", "Tekrarlanabilir bir uyum takvimi, yükümlülük envanteri, kanıt modeli ve yönetim görünümü kurun.", "regulatory-compliance.html", "Mevzuat uyumu hizmetini incele"],
    ["respond", "Regülatöre yanıt vermek veya bulguları kapatmak", "Talepleri, kanıtı, kök nedeni, aksiyon sahipliğini, doğrulamayı ve kapanışı yapılandırın.", "regulatory-compliance.html", "Regülatör süreçlerini incele"],
    ["resilience", "Teknoloji veya operasyonel dayanıklılığı geliştirmek", "Kritik hizmet ve bağımlılıkları haritalayın; kurtarma varsayımlarını ve operasyonel hazırlığı test edin.", "technology-resilience.html", "Teknoloji dayanıklılığını incele"],
    ["assure", "IT denetimi veya güvence çalışmasına hazırlanmak", "Gereklilik, risk, kontrol, kanıt, test ve sürdürülebilir bulgu kapanışını birbirine bağlayın.", "it-risk-assurance.html", "IT risk ve denetimi incele"],
    ["crime", "Finansal suçlar kontrollerini güçlendirmek", "AML/KYC, yaptırımlar, izleme, fraud, vaka, veri ve kaliteyi tek kontrol sistemi olarak değerlendirin.", "financial-crime.html", "Finansal suçlar uyumunu incele"],
    ["transform", "Strateji veya dönüşüm kararı almak", "İş planını, hedef işletim modelini, mimariyi, yol haritasını ve değer mantığını test edin.", "strategy-transformation.html", "Strateji ve dönüşümü incele"],
    ["learn", "Gelişen bir konuyu anlamak", "Önce perspektif başlıklarımızdan başlayın, ardından karara en uygun hizmet alanına ilerleyin.", "perspective.html", "Perspektifimizi incele"],
    ["unsure", "Konunun hangi alana girdiğinden emin değilim", "Odaklı bir ilk görüşmeyle problemi, aciliyeti, paydaşları ve faydalı çıktıyı tanımlayın.", "contact.html", "Bize ulaşın"]
  ]
};

const askTopicMap = {
  launch: "licensing",
  comply: "regulatory",
  respond: "regulatory",
  resilience: "technology",
  assure: "it-risk",
  crime: "financial-crime",
  transform: "strategy",
  learn: "emerging",
  unsure: "unsure"
};

function renderAsk() {
  const options = askOptions[language];
  const labels = language === "en" ? {
    button: "Ask ConsultancyBA",
    title: "What brings you here?",
    intro: "Choose the outcome closest to your current agenda. We will point you to a useful starting place.",
    close: "Close Ask ConsultancyBA",
    back: "Choose another objective",
    next: "Suggested starting point",
    talk: "Talk to us"
  } : {
    button: "Ask ConsultancyBA",
    title: "Buraya hangi amaçla geldiniz?",
    intro: "Gündeminize en yakın sonucu seçin. Sizi faydalı bir başlangıç noktasına yönlendirelim.",
    close: "Ask ConsultancyBA'yı kapat",
    back: "Başka bir amaç seç",
    next: "Önerilen başlangıç noktası",
    talk: "Bize ulaşın"
  };

  const shell = document.createElement("div");
  shell.className = "ask-shell";
  shell.innerHTML = `<button class="ask-launcher" type="button" aria-haspopup="dialog" aria-controls="ask-dialog">${labels.button}</button>
    <div class="ask-backdrop" hidden></div>
    <section class="ask-dialog" id="ask-dialog" role="dialog" aria-modal="true" aria-labelledby="ask-title" tabindex="-1" hidden>
      <div class="ask-head"><div><span>CONSULTANCY BA</span><h2 id="ask-title">${labels.title}</h2></div><button class="ask-close" type="button" aria-label="${labels.close}">×</button></div>
      <div class="ask-body"><p>${labels.intro}</p><div class="ask-options">${options.map(([id, label]) => `<button type="button" data-ask-option="${id}">${label}</button>`).join("")}</div></div>
    </section>`;
  body.append(shell);

  const launcher = shell.querySelector(".ask-launcher");
  const dialog = shell.querySelector(".ask-dialog");
  const backdrop = shell.querySelector(".ask-backdrop");
  const askBody = shell.querySelector(".ask-body");
  const initialMarkup = askBody.innerHTML;

  function bindOptions() {
    shell.querySelectorAll("[data-ask-option]").forEach((button) => button.addEventListener("click", () => {
      const option = options.find(([id]) => id === button.dataset.askOption);
      if (!option) return;
      const [id, label, summary, href, action] = option;
      const contactHref = `contact.html?topic=${encodeURIComponent(askTopicMap[id])}`;
      const primaryHref = href === "contact.html" ? contactHref : href;
      askBody.innerHTML = `<div class="ask-result"><div class="ask-result-kicker"><button class="ask-back" type="button" aria-label="${labels.back}" title="${labels.back}">←</button><span>${labels.next}</span></div><h3>${label}</h3><p>${summary}</p><div class="ask-actions"><a class="btn btn-primary" href="${primaryHref}">${action}</a>${href === "contact.html" ? "" : `<a class="text-link" href="${contactHref}">${labels.talk}</a>`}</div></div>`;
      askBody.querySelector(".ask-back")?.addEventListener("click", () => {
        askBody.innerHTML = initialMarkup;
        bindOptions();
      });
    }));
  }

  function openAsk() {
    dialog.hidden = false;
    backdrop.hidden = false;
    body.classList.add("ask-open");
    dialog.focus({ preventScroll: true });
  }

  function closeAsk() {
    dialog.hidden = true;
    backdrop.hidden = true;
    body.classList.remove("ask-open");
    launcher.focus();
  }

  bindOptions();
  launcher.addEventListener("click", openAsk);
  backdrop.addEventListener("click", closeAsk);
  shell.querySelector(".ask-close").addEventListener("click", closeAsk);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !dialog.hidden) closeAsk();
  });
}

function renderMobileDiagrams() {
  if (page === "home") {
    document.querySelector("#approach .diagram")?.remove();
  }

  const labels = language === "tr" ? {
    licenseTitle: "Başvuru tutarlılık modeli",
    licenseNote: "Altı alan aynı faaliyet modelini anlatmalıdır.",
    licenseCore: "Lisans hazırlığı",
    license: ["Faaliyet modeli", "Yönetişim", "Operasyon", "Teknoloji", "AML ve kontroller", "Finansal plan"]
  } : {
    licenseTitle: "Application consistency model",
    licenseNote: "Six domains must describe the same operating institution.",
    licenseCore: "License readiness",
    license: ["Business model", "Governance", "Operations", "Technology", "AML and controls", "Financial plan"]
  };

  if (page === "licensing") {
    const diagram = document.querySelector("main .diagram");
    const target = diagram?.closest(".section");
    if (target) {
      target.classList.add("has-mobile-alternative");
      const domains = labels.license.map((title, index) => `<article><b>${String(index + 1).padStart(2, "0")}</b><strong>${title}</strong></article>`).join("");
      target.insertAdjacentHTML("afterend", `<section class="mobile-diagram-section alt" aria-hidden="true"><div class="container"><div class="mobile-diagram-card mobile-consistency"><div class="mobile-diagram-title"><strong>${labels.licenseTitle}</strong><span>${labels.licenseNote}</span></div><div class="mobile-consistency-core"><span>${labels.licenseCore}</span></div><div class="mobile-consistency-grid">${domains}</div></div></div></section>`);
    }
  }
}

renderSeo();
renderHeader();
renderFooter();
renderMobileDiagrams();
renderAsk();

if (page === "contact") {
  const contactForm = document.querySelector("#contact-form");
  const formElapsed = contactForm?.querySelector("[data-form-elapsed]");
  const formOpenedAt = performance.now();
  contactForm?.addEventListener("submit", () => {
    if (formElapsed) {
      formElapsed.value = String(Math.max(0, Math.round(performance.now() - formOpenedAt)));
    }
  });

  const query = new URLSearchParams(location.search);
  const topic = query.get("topic");
  const topicSelect = document.querySelector("#service");
  const hasTopic = topicSelect && Array.from(topicSelect.options).some((option) => option.value === topic);
  if (topic && hasTopic) {
    topicSelect.value = topic;
  }

  const formStatus = document.querySelector("[data-form-status]");
  const status = query.get("status");
  const statusMessages = language === "tr" ? {
    success: "Talebiniz iletildi. En kısa sürede sizinle iletişime geçeceğiz.",
    invalid: "Form gönderilemedi. Lütfen alanları kontrol edip kısa bir süre sonra yeniden deneyin.",
    error: "Talebiniz şu anda iletilemedi. Lütfen daha sonra tekrar deneyin."
  } : {
    success: "Your request has been sent. We will contact you as soon as possible.",
    invalid: "The form could not be submitted. Please check the fields, wait a moment and try again.",
    error: "Your request could not be sent at this time. Please try again later."
  };
  if (formStatus && status && statusMessages[status]) {
    formStatus.textContent = statusMessages[status];
    formStatus.classList.toggle("is-error", status !== "success");
    formStatus.hidden = false;
    requestAnimationFrame(() => formStatus.scrollIntoView({ block: "nearest" }));
  }
}

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const servicesMenu = document.querySelector(".services-menu");
const servicesTrigger = document.querySelector(".services-trigger");

menuToggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(open));
  body.classList.toggle("nav-open", open);
});

servicesTrigger?.addEventListener("click", (event) => {
  event.stopPropagation();
  const open = servicesMenu.classList.toggle("is-open");
  servicesTrigger.setAttribute("aria-expanded", String(open));
});

document.addEventListener("click", (event) => {
  if (servicesMenu && !servicesMenu.contains(event.target)) {
    servicesMenu.classList.remove("is-open");
    servicesTrigger?.setAttribute("aria-expanded", "false");
  }
});

navLinks?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  navLinks.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  body.classList.remove("nav-open");
}));
