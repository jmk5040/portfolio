export type Locale = "en" | "ko";

export const LOCALES: Locale[] = ["en", "ko"];

export type EducationEntry = {
  period: string;
  school: string;
  detail: string;
};

export type Dictionary = {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    works: string;
    publications: string;
    cv: string;
    posts: string;
    contact: string;
  };
  home: {
    eyebrow: string;
    name: string;
    bio: string;
    worksLabel: string;
    prevLabel: string;
    nextLabel: string;
    pageOfLabel: (current: number, total: number) => string;
  };
  projectPage: {
    backToWorks: string;
    allProjectsLabel: string;
    overviewLabel: string;
    partsLabel: string;
    onlyInEnglish: string;
    onlyInKorean: string;
    onlyInEnglishNote: string;
    onlyInKoreanNote: string;
  };
  cvPage: {
    eyebrow: string;
    heading: string;
    intro: string;
    educationHeading: string;
    education: EducationEntry[];
    grantsHeading: string;
    grants: EducationEntry[];
    awardsHeading: string;
    awards: EducationEntry[];
    exhibitionsHeading: string;
    exhibitions: EducationEntry[];
    downloadHeading: string;
    downloadBody: string;
    downloadLabel: string;
  };
  publicationsPage: {
    eyebrow: string;
    heading: string;
    intro: string;
    journalHeading: string;
    firstAuthorHeading: string;
    coAuthorHeading: string;
    writingsHeading: string;
    pressHeading: string;
    doiLabel: string;
    arxivLabel: string;
    readLabel: string;
    contributionLabel: string;
    koOriginalNote: string;
    enOriginalNote: string;
    emptyJournal: string;
    emptyWritings: string;
    emptyPress: string;
    archive?: {
      heading: string;
      description: string;
      links: { label: string; href: string }[];
    };
  };
  contactPage: {
    eyebrow: string;
    heading: string;
    intro: string;
    emailLabel: string;
    email: string;
    locationLabel: string;
    location: string;
    socialLabel: string;
    social: { label: string; handle: string; href: string }[];
    pressNoteHeading: string;
    pressNoteBody: string;
  };
  postsPage: {
    eyebrow: string;
    heading: string;
    intro: string;
    searchPlaceholder: string;
    tagsLabel: string;
    clearTags: string;
    noResults: string;
    empty: string;
    countLabel: (n: number) => string;
    prevLabel: string;
    nextLabel: string;
    pageOfLabel: (current: number, total: number) => string;
    onlyInEnglish: string;
    onlyInKorean: string;
  };
  postPage: {
    backToPosts: string;
    tagsLabel: string;
    commentsHeading: string;
    commentsDisabledNote: string;
    commentsManageOnGitHub: string;
    onlyInEnglishNote: string;
    onlyInKoreanNote: string;
    allPostsLabel: string;
    prevLabel: string;
    nextLabel: string;
    pageOfLabel: (current: number, total: number) => string;
  };
  footer: {
    rights: string;
    builtWith: string;
  };
  toggle: {
    label: string;
    en: string;
    ko: string;
  };
};

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    meta: {
      title: "Mankeun Jeong — Astronomer & Artist",
      description:
        "Mankeun Jeong — Ph.D. student in astronomy at Seoul National University and multidisciplinary artist. Research, publications, studio works, and writing.",
    },
    nav: {
      works: "Works",
      publications: "Publications",
      cv: "C.V.",
      posts: "Posts",
      contact: "Contact",
    },
    home: {
      eyebrow: "Astronomy · Art",
      name: "Mankeun Jeong",
      bio: "Ph.D. student in the Department of Astronomy at Seoul National University and a multidisciplinary artist.",
      worksLabel: "Selected works",
      prevLabel: "Previous",
      nextLabel: "Next",
      pageOfLabel: (current, total) => `Page ${current} of ${total}`,
    },
    projectPage: {
      backToWorks: "Back to works",
      allProjectsLabel: "Projects",
      overviewLabel: "Overview",
      partsLabel: "In this project",
      onlyInEnglish: "EN only",
      onlyInKorean: "KO only",
      onlyInEnglishNote: "This project is only available in English for now.",
      onlyInKoreanNote: "This project is only available in Korean for now.",
    },
    cvPage: {
      eyebrow: "C.V.",
      heading: "Curriculum vitae",
      intro:
        "Education, grants, awards, selected exhibitions, and a downloadable PDF for the full record.",
      educationHeading: "Education",
      education: [
        {
          period: "2019 — Present",
          school: "Ph.D. Student, Department of Astronomy",
          detail: "Seoul National University.",
        },
        {
          period: "2015 — 2019",
          school: "B.A. in Astronomy",
          detail: "Seoul National University.",
        },
      ],
      grantsHeading: "Grants",
      grants: [
        {
          period: "2021",
          school: "Teaching & Research Assistantship Scholarship",
          detail: "Seoul National University.",
        },
        {
          period: "2020",
          school:
            "Next Generation Academic Scholarship (학문후속세대, NRF)",
          detail: "National Research Foundation of Korea.",
        },
      ],
      awardsHeading: "Awards",
      awards: [
        {
          period: "2020",
          school: "Excellence in Teaching Assistantship (우수 강의 조교)",
          detail:
            "Course: Human and the Universe (인간과 우주). Seoul National University.",
        },
      ],
      exhibitionsHeading: "Exhibitions",
      exhibitions: [
        {
          period: "2023",
          school: "The Blind Watchmaker (눈 먼 시계공)",
          detail: "Group exhibition/Participating Artist. SAPY (Youth Art Center), Seoul.",
        },
        {
          period: "2022",
          school: "Delivery Dancer’s Sphere (딜리버리 댄서의 구)",
          detail: "Ayoung Kim Solo exhibition/Physics Advisory. Gallery Hyundai, Seoul.",
        },
        {
          period: "2021",
          school: "Project Hashtag 2021 – The Duck Among Us",
          detail:
            "Group exhibition/Participating Artist. National Museum of Modern and Contemporary Art, Seoul.",
        },
      ],
      downloadHeading: "Full résumé",
      downloadBody:
        "The full CV is available as a PDF, including exhibitions, residencies, awards, and selected press.",
      downloadLabel: "Download PDF",
    },
    publicationsPage: {
      eyebrow: "Publications",
      heading: "Papers & writing",
      intro:
        "Astronomy papers and published reviews, essays, and commentary.",
      journalHeading: "Journal papers",
      firstAuthorHeading: "First-author",
      coAuthorHeading: "Co-authored",
      writingsHeading: "Essays & criticism",
      pressHeading: "Press",
      doiLabel: "DOI",
      arxivLabel: "arXiv",
      readLabel: "Read",
      contributionLabel: "Contribution",
      koOriginalNote: "Originally published in Korean.",
      enOriginalNote: "Originally published in English.",
      emptyJournal: "No journal papers yet.",
      emptyWritings: "No essays yet.",
      emptyPress: "No press mentions yet.",
      archive: {
        heading: "External archives",
        description:
          "For a continuously updated list of papers and citations, see:",
        links: [
          {
            label: "NASA ADS Library",
            href: "https://ui.adsabs.harvard.edu/user/libraries/78n4mGQETZm7-E63xj9oJQ",
          },
          {
            label: "ORCID 0009-0003-1280-0099",
            href: "https://orcid.org/0009-0003-1280-0099",
          },
        ],
      },
    },
    contactPage: {
      eyebrow: "Contact",
      heading: "Get in touch",
      intro:
        "Please reach out by email. I try to reply within a week or two.",
      emailLabel: "Email",
      email: "jmk5040@gmail.com",
      locationLabel: "Studio",
      location: "Seoul, South Korea",
      socialLabel: "Elsewhere",
      social: [
        {
          label: "Instagram",
          handle: "@emkay.jeong",
          href: "https://www.instagram.com/emkay.jeong/",
        },
        {
          label: "GitHub",
          handle: "jmk5040",
          href: "https://github.com/jmk5040",
        },
        {
          label: "ORCID",
          handle: "0009-0003-1280-0099",
          href: "https://orcid.org/0009-0003-1280-0099",
        },
        {
          label: "ADS Library",
          handle: "Publications archive",
          href: "https://ui.adsabs.harvard.edu/user/libraries/78n4mGQETZm7-E63xj9oJQ",
        },
      ],
      pressNoteHeading: "Press & inquiries",
      pressNoteBody:
        "Please write to jmk5040@gmail.com with as much context as you can comfortably share.",
    },
    postsPage: {
      eyebrow: "Posts",
      heading: "Notes & writing",
      intro:
        "A casual journal of studio notes, reading, and rough drafts. Use the search to filter by title, excerpt, or tag.",
      searchPlaceholder: "Search posts…",
      tagsLabel: "Tags",
      clearTags: "Clear",
      noResults: "No posts match that search.",
      empty: "No posts yet — they will appear here once added to content/posts.",
      countLabel: (n) => (n === 1 ? "1 post" : `${n} posts`),
      prevLabel: "Previous",
      nextLabel: "Next",
      pageOfLabel: (current, total) => `Page ${current} of ${total}`,
      onlyInEnglish: "EN only",
      onlyInKorean: "KO only",
    },
    postPage: {
      backToPosts: "All posts",
      tagsLabel: "Tags",
      commentsHeading: "Comments",
      commentsDisabledNote:
        "Comments are not configured. See the README to enable Giscus.",
      commentsManageOnGitHub: "Manage on GitHub",
      onlyInEnglishNote: "This post is only available in English.",
      onlyInKoreanNote: "This post is only available in Korean.",
      allPostsLabel: "Posts",
      prevLabel: "Previous",
      nextLabel: "Next",
      pageOfLabel: (current, total) => `Page ${current} of ${total}`,
    },
    footer: {
      rights: "All works © Mankeun Jeong.",
      builtWith: "Mankeun Jeong Portfolio",
    },
    toggle: {
      label: "Language",
      en: "EN",
      ko: "KO",
    },
  },
  ko: {
    meta: {
      title: "정만근 — 천문학자 · 작가",
      description:
        "서울대학교 천문학과 박사과정이자 다원예술 작가 정만근. 연구·출판·작업실 작업과 글.",
    },
    nav: {
      works: "작업",
      publications: "출판",
      cv: "약력",
      posts: "포스트",
      contact: "연락",
    },
    home: {
      eyebrow: "천문학 · 예술",
      name: "정만근",
      bio: "서울대학교 천문학과 박사과정에 재학 중인 동시에 다원예술 작가로 활동한다.",
      worksLabel: "주요 작업",
      prevLabel: "이전",
      nextLabel: "다음",
      pageOfLabel: (current, total) => `${current} / ${total} 쪽`,
    },
    projectPage: {
      backToWorks: "작업 목록으로",
      allProjectsLabel: "프로젝트",
      overviewLabel: "개요",
      partsLabel: "이 프로젝트의 구성",
      onlyInEnglish: "EN 전용",
      onlyInKorean: "KO 전용",
      onlyInEnglishNote: "이 프로젝트는 현재 영문 버전만 제공됩니다.",
      onlyInKoreanNote: "이 프로젝트는 현재 한국어 버전만 제공됩니다.",
    },
    cvPage: {
      eyebrow: "약력",
      heading: "이력",
      intro:
        "학력·장학금·수상·선별 전시와 전체 약력 PDF 안내.",
      educationHeading: "학력",
      education: [
        {
          period: "2019 — 현재",
          school: "천문학과 박사과정",
          detail: "서울대학교.",
        },
        {
          period: "2015 — 2019",
          school: "천문학 학사",
          detail: "서울대학교.",
        },
      ],
      grantsHeading: "장학금",
      grants: [
        {
          period: "2021",
          school: "교수학습조교 장학금 (Teaching & Research Assistantship)",
          detail: "서울대학교.",
        },
        {
          period: "2020",
          school: "학문후속세대 장학금",
          detail: "한국연구재단.",
        },
      ],
      awardsHeading: "수상",
      awards: [
        {
          period: "2020",
          school: "우수 강의 조교",
          detail: "과목: 인간과 우주. 서울대학교.",
        },
      ],
      exhibitionsHeading: "전시",
      exhibitions: [
        {
          period: "2023",
          school: "눈 먼 시계공 (The Blind Watchmaker)",
          detail: "단체전/참여 작가. 청년 예술청 SAPY, 서울.",
        },
        {
          period: "2022",
          school: "딜리버리 댄서의 구 (Delivery Dancer’s Sphere)",
          detail: "김아영 개인전/물리학 자문. 갤러리 현대, 서울.",
        },
        {
          period: "2021",
          school: "Project Hashtag 2021 – The Duck Among Us",
          detail: "단체전/참여 작가. 국립현대미술관, 서울.",
        },
      ],
      downloadHeading: "전체 약력",
      downloadBody:
        "전시 이력, 레지던시, 수상, 주요 보도 자료를 포함한 전체 약력은 PDF로 제공됩니다.",
      downloadLabel: "PDF 내려받기",
    },
    publicationsPage: {
      eyebrow: "출판",
      heading: "논문 및 글",
      intro:
        "천문학 논문 및 게재된 비평·에세이 자료.",
      journalHeading: "학술 논문",
      firstAuthorHeading: "주저자",
      coAuthorHeading: "공저자",
      writingsHeading: "에세이 및 평론",
      pressHeading: "보도 자료",
      doiLabel: "DOI",
      arxivLabel: "arXiv",
      readLabel: "읽기",
      contributionLabel: "기여",
      koOriginalNote: "한국어로 처음 발표된 글.",
      enOriginalNote: "영어로 처음 발표된 글.",
      emptyJournal: "아직 등록된 논문이 없습니다.",
      emptyWritings: "아직 등록된 글이 없습니다.",
      emptyPress: "아직 등록된 보도 자료가 없습니다.",
      archive: {
        heading: "외부 아카이브",
        description:
          "지속적으로 업데이트되는 전체 논문 및 인용 목록은 다음에서 확인하실 수 있습니다.",
        links: [
          {
            label: "NASA ADS 라이브러리",
            href: "https://ui.adsabs.harvard.edu/user/libraries/78n4mGQETZm7-E63xj9oJQ",
          },
          {
            label: "ORCID 0009-0003-1280-0099",
            href: "https://orcid.org/0009-0003-1280-0099",
          },
        ],
      },
    },
    contactPage: {
      eyebrow: "연락",
      heading: "연락처",
      intro:
        "모든 문의는 이메일로 연락해 주세요. 보통 1–2주 이내에 답신을 드립니다.",
      emailLabel: "이메일",
      email: "jmk5040@gmail.com",
      locationLabel: "작업실",
      location: "대한민국 서울",
      socialLabel: "다른 채널",
      social: [
        {
          label: "Instagram",
          handle: "@emkay.jeong",
          href: "https://www.instagram.com/emkay.jeong/",
        },
        {
          label: "GitHub",
          handle: "jmk5040",
          href: "https://github.com/jmk5040",
        },
        {
          label: "ORCID",
          handle: "0009-0003-1280-0099",
          href: "https://orcid.org/0009-0003-1280-0099",
        },
        {
          label: "ADS 라이브러리",
          handle: "논문 아카이브",
          href: "https://ui.adsabs.harvard.edu/user/libraries/78n4mGQETZm7-E63xj9oJQ",
        },
      ],
      pressNoteHeading: "보도 및 문의",
      pressNoteBody:
        "문의는 jmk5040@gmail.com 으로 보내 주세요.",
    },
    postsPage: {
      eyebrow: "포스트",
      heading: "노트 & 글",
      intro:
        "작업실 메모, 읽은 글, 다듬어지지 않은 초고들을 모아 두는 가벼운 저널. 제목·요약·태그로 검색할 수 있습니다.",
      searchPlaceholder: "포스트 검색…",
      tagsLabel: "태그",
      clearTags: "전체",
      noResults: "검색 결과가 없습니다.",
      empty: "아직 포스트가 없습니다. content/posts 폴더에 글을 추가하면 이곳에 나타납니다.",
      countLabel: (n) => `${n}개의 글`,
      prevLabel: "이전",
      nextLabel: "다음",
      pageOfLabel: (current, total) => `${current} / ${total} 쪽`,
      onlyInEnglish: "영어 전용",
      onlyInKorean: "한국어 전용",
    },
    postPage: {
      backToPosts: "전체 포스트",
      tagsLabel: "태그",
      commentsHeading: "댓글",
      commentsDisabledNote: "댓글이 설정되어 있지 않습니다. README에서 Giscus 설정 방법을 확인해 주세요.",
      commentsManageOnGitHub: "GitHub에서 관리",
      onlyInEnglishNote: "이 글은 영어로만 제공됩니다.",
      onlyInKoreanNote: "이 글은 한국어로만 제공됩니다.",
      allPostsLabel: "포스트",
      prevLabel: "이전",
      nextLabel: "다음",
      pageOfLabel: (current, total) => `${current} / ${total} 쪽`,
    },
    footer: {
      rights: "모든 작업의 저작권은 정만근에게 있습니다.",
      builtWith: "정만근 포트폴리오",
    },
    toggle: {
      label: "언어",
      en: "EN",
      ko: "KO",
    },
  },
};
