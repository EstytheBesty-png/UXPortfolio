import HTMLFlipBook from "react-pageflip";
import { useEffect, useRef, useState } from "react";
import "./App.css";

const BOOK_RATIO = 620 / 878;
const VIEWPORT_SIDE_GAP = 0;
const VIEWPORT_TOP_BOTTOM_GAP = 0;

const NOTEBOOK_TABS = [
  { label: "Intro", pageIndex: 2, tone: "sun" },
  { label: "Wartekorb", pageIndex: 3, tone: "sage" },
  { label: "Kangrow", pageIndex: 9, tone: "rose" },
  { label: "Google Maps", pageIndex: 10, tone: "sky" },
  { label: "Visual Design", pageIndex: 11, tone: "mint" },
  { label: "Hobbies", pageIndex: 12, tone: "peach" },
  { label: "Contact", pageIndex: 13, tone: "lilac" },
];

const TOC_ITEMS = [
  { label: "Intro", pageIndex: 2, pageNumber: 2 },
  { label: "Wartekorb", pageIndex: 3, pageNumber: 3 },
  { label: "Kangrow", pageIndex: 9, pageNumber: 9 },
  { label: "Google Maps", pageIndex: 10, pageNumber: 10 },
  { label: "Visual Design Challenges", pageIndex: 11, pageNumber: 11 },
  { label: "Hobbies", pageIndex: 12, pageNumber: 12 },
  { label: "Contact", pageIndex: 13, pageNumber: 13 },
];

function App() {
  const bookRef = useRef();
  const lightboxCloseButtonRef = useRef(null);
  const lastFocusedElementRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedNotebook, setHasOpenedNotebook] = useState(false);
  const [closeOnNextClick, setCloseOnNextClick] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setLightboxImage(null);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    if (lightboxImage) {
      lightboxCloseButtonRef.current?.focus();
      document.body.style.overflow = "hidden";
      return;
    }

    document.body.style.overflow = "";
    lastFocusedElementRef.current?.focus?.();
  }, [lightboxImage]);

  const handleFlip = (e) => {
    const pageIndex = e.data;
    const pageFlip = bookRef.current?.pageFlip();
    const lastPageIndex = pageFlip ? pageFlip.getPageCount() - 1 : -1;
    const contactPageIndex = lastPageIndex - 1;
    const isCoverPage = pageIndex === 0 || pageIndex === lastPageIndex;

    setIsOpen(!isCoverPage);
    if (pageIndex !== 0) {
      setHasOpenedNotebook(true);
    }
    setCloseOnNextClick(pageIndex === contactPageIndex);
  };

  const handleBookClick = () => {
    if (!closeOnNextClick) {
      return;
    }
    const pageFlip = bookRef.current?.pageFlip();
    if (!pageFlip) {
      return;
    }
    pageFlip.flipNext("top");
    setCloseOnNextClick(false);
  };

  const handleTabJump = (pageIndex) => {
    const pageFlip = bookRef.current?.pageFlip();
    if (!pageFlip) {
      return;
    }

    pageFlip.flip(pageIndex, "top");
    setCloseOnNextClick(false);
    setHasOpenedNotebook(true);
    setIsOpen(true);
  };

  const openLightbox = (src, alt) => {
    lastFocusedElementRef.current = document.activeElement;
    setLightboxImage({ src, alt: alt || "Expanded image preview" });
  };

  const stopBookFlipEvent = (event) => {
    event.stopPropagation();
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const availableWidth = Math.max(320, viewport.width - VIEWPORT_SIDE_GAP);
  const availableHeight = Math.max(320, viewport.height - VIEWPORT_TOP_BOTTOM_GAP);

  const widthLimitedHeight = availableWidth / BOOK_RATIO;
  const fitByWidth = widthLimitedHeight <= availableHeight;

  const fittedWidth = Math.floor(fitByWidth ? availableWidth : availableHeight * BOOK_RATIO);
  const fittedHeight = Math.floor(fitByWidth ? widthLimitedHeight : availableHeight);

  const bookWidth = fittedWidth;
  const bookHeight = fittedHeight;
  const bookFrameWidth = bookWidth * 2;
  const bookMinWidth = Math.floor(fittedWidth * 0.72);
  const bookMaxWidth = fittedWidth;
  const bookMinHeight = Math.floor(fittedHeight * 0.72);
  const bookMaxHeight = fittedHeight;

  return (
    <main className="scene">
      <div className={`book-container ${isOpen ? "open" : "closed"}`}>
        <div className="bookShell" onClick={handleBookClick}>
          <div
            className="bookFrame"
            style={{ width: `${bookFrameWidth}px`, height: `${bookHeight}px` }}
          >
            <HTMLFlipBook
              ref={bookRef}
              width={bookWidth}
              height={bookHeight}
              size="fixed"
              usePortrait={false}
              minWidth={bookMinWidth}
              maxWidth={bookMaxWidth}
              minHeight={bookMinHeight}
              maxHeight={bookMaxHeight}
              showCover={true}
              startPage={0}
              drawShadow={false}
              flippingTime={500}
              useMouseEvents={true}
              showPageCorners={true}
              mobileScrollSupport={true}
              className="book"
              onFlip={handleFlip}
            >
              <section className="page cover" aria-label="Journal cover">
                <img
                  src="/assets/notebook cover brunch newspaper.jpeg"
                  alt="Journal cover"
                  className="coverImage"
                />
              </section>

              <section className="page tocPage" data-page-number="1">
                <h2>Table of Contents</h2>
                <ul className="tocList">
                  {TOC_ITEMS.map((item) => (
                    <li key={item.label}>
                      <button
                        type="button"
                        className="tocLink"
                        onClick={() => handleTabJump(item.pageIndex)}
                      >
                        <span>{item.label}</span>
                        <span className="tocPageNumber">{item.pageNumber}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="page aboutMePage" data-page-number="2">
                <h2>Introduction</h2>
                <div className="aboutMeLayout">
                  <div className="aboutMeSection">
                    <div className="aboutMePhotoPlaceholder" aria-label="Profile photo placeholder">
                      Photo Placeholder
                    </div>

                    <p>
                      Hi, I&apos;m Estelle — a UX designer focused on creating meaningful,
                      human-centered experiences that blend clarity, emotion, and function.
                    </p>
                    <p>
                      My work is guided by curiosity, research, and a love for turning complex
                      ideas into intuitive interactions. I enjoy exploring how thoughtful design
                      can make digital products feel more useful, accessible, and memorable.
                    </p>
                  </div>

                  <div className="moodTrackerPanel">
                    <h3>Mood Tracker</h3>
                    <p>How are you feeling today?</p>
                    <div className="moodTrackerGrid" aria-label="Mood tracker options">
                      <button type="button" className="moodOption">
                        🌸 Happy
                      </button>
                      <button type="button" className="moodOption">
                        🌿 Calm
                      </button>
                      <button type="button" className="moodOption">
                        🍓 Inspired
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <section
                className="page wartekorbChallengePage"
                aria-label="Wartekorb page"
                data-page-number="3"
              >
                <div className="wartekorbChallengeLayout grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className="wartekorbChallengeCopy">
                    <h2 className="wartekorbChallengeTitle">
                      The Challenge: Designing Against the Flow
                    </h2>
                    <p className="wartekorbChallengeText">
                      In the modern e-commerce landscape, interfaces are engineered to trigger
                      impulsive, immediate action (countdown timers, scarcity tactics,
                      high-pressure &apos;BUY NOW&apos; buttons). This frictionless experience leads
                      to unsustainable consumption, budget stress, and high return rates.
                    </p>

                    <h3 className="wartekorbChallengeSubheading">Project Goal</h3>
                    <p className="wartekorbChallengeText">
                      Develop an anti-impulse shopping app that introduces intentional
                      friction at the point of sale, aligning with SDG 12 (Sustainable
                      Consumption) goals. The challenge was to balance necessary design
                      friction with a positive and motivating user experience.
                    </p>
                    <p className="wartekorbChallengeText">
                      The name Wartekorb combines &ldquo;Warenkorb&rdquo; (shopping cart) and
                      &ldquo;warten&rdquo; (to wait), reflecting the core idea of the app: creating a
                      deliberate waiting moment before purchasing.
                    </p>

                    <h3 className="wartekorbChallengeSubheading">
                      The Team &amp; The Hook
                    </h3>
                    <p className="wartekorbChallengeText">
                      Developed during my Master of User Experience Design at FHGR, this project was a highly collaborative effort by a product team of five. Rather than dividing into specialized roles, each of us actively participated in every step of the end-to-end design process. To introduce ourselves, we leaned directly into the problem space, presenting our team as a grid of "impulse buys" within a typical e-commerce interface to immediately set the thematic stage.
                    </p>
                  </div>
                  <div className="wartekorbChallengeMedia flex flex-col gap-6 items-start">
                    <button
                      type="button"
                      className="wartekorbImageButton"
                      onPointerDownCapture={stopBookFlipEvent}
                      onMouseDownCapture={stopBookFlipEvent}
                      onTouchStartCapture={stopBookFlipEvent}
                      onClick={(event) => {
                        event.stopPropagation();
                        openLightbox("/assets/Wartekorb app image.png", "Wartekorb app mockups");
                      }}
                      aria-label="Open larger Wartekorb app mockups image"
                    >
                      <img
                        src="/assets/Wartekorb app image.png"
                        alt="Wartekorb app mockups"
                        className="wartekorbChallengeImage"
                      />
                    </button>
                    <button
                      type="button"
                      className="wartekorbImageButton"
                      onPointerDownCapture={stopBookFlipEvent}
                      onMouseDownCapture={stopBookFlipEvent}
                      onTouchStartCapture={stopBookFlipEvent}
                      onClick={(event) => {
                        event.stopPropagation();
                        openLightbox("/assets/Team image.png", "Team context image");
                      }}
                      aria-label="Open larger team context image"
                    >
                      <img
                        src="/assets/Team image.png"
                        alt="Team context image"
                        className="wartekorbChallengeImage wartekorbTeamImage"
                      />
                    </button>
                    <p className="text-sm italic mt-2">
                      (Note: Team member identities have been intentionally obfuscated to
                      maintain professional privacy).
                    </p>
                  </div>
                </div>
              </section>

              <section className="page pageFourCaseStudy" aria-label="Wartekorb page" data-page-number="4">
                <div className="wartekorbChallengeCopy pageFourTextFlow">
                  <h2 className="wartekorbChallengeTitle">The Pivot</h2>
                  <p className="wartekorbChallengeText">
                    Our initial focus was on mitigating impulsive buying to support SDG 12
                    (Sustainable Consumption). While we developed a Value Proposition Canvas
                    mapping out eco-impact dashboards and sustainable partnerships, we
                    recognized that to effectively change user behavior, we had to intervene
                    at the exact moment of friction. We strategically pivoted our primary
                    focus to the user&apos;s emotional state during a purchase impulse.
                  </p>

                  <h3 className="wartekorbChallengeSubheading">The Core User Needs (JTBD)</h3>
                  <p className="wartekorbChallengeText">
                    We utilized the Jobs-To-Be-Done framework to shift our focus from "who"
                    the user is to "why" they act. We synthesized our research into a
                    single, guiding job statement:
                  </p>
                  <p className="wartekorbChallengeText">
                    &ldquo;When I shop online and feel the urge to buy something, I want to
                    rethink whether I really need the product, so I can save money and avoid
                    burdening the environment further.&rdquo;
                  </p>

                  <h3 className="wartekorbChallengeSubheading">
                    Key Insights from the Value Proposition Canvas
                  </h3>
                  <p className="wartekorbChallengeText">
                    By mapping the user&apos;s pains and gains against our proposed solutions,
                    we uncovered a critical insight: our app should not act merely as a
                    blocker. Instead, it must replace the dopamine hit of an impulse buy
                    with a conscious, rewarding pause, allowing the user to regain control
                    over their budget and environmental impact without feeling restricted.
                  </p>
                </div>

                <div className="pageFourImageGrid" aria-label="Value proposition and canvas visuals">
                  <div className="pageFourImageColumn pageFourImageColumn-left">
                    <button
                      type="button"
                      className="wartekorbImageButton pageFourImageButton"
                      onPointerDownCapture={stopBookFlipEvent}
                      onMouseDownCapture={stopBookFlipEvent}
                      onTouchStartCapture={stopBookFlipEvent}
                      onClick={(event) => {
                        event.stopPropagation();
                        openLightbox("/assets/Value Proposition A.png", "Value Proposition A");
                      }}
                      aria-label="Open larger Value Proposition A image"
                    >
                      <img
                        src="/assets/Value Proposition A.png"
                        alt="Value Proposition A"
                        className="wartekorbChallengeImage pageFourImage pageFourImage-small"
                      />
                    </button>

                    <button
                      type="button"
                      className="wartekorbImageButton pageFourImageButton"
                      onPointerDownCapture={stopBookFlipEvent}
                      onMouseDownCapture={stopBookFlipEvent}
                      onTouchStartCapture={stopBookFlipEvent}
                      onClick={(event) => {
                        event.stopPropagation();
                        openLightbox("/assets/Value Proposition B.png", "Value Proposition B");
                      }}
                      aria-label="Open larger Value Proposition B image"
                    >
                      <img
                        src="/assets/Value Proposition B.png"
                        alt="Value Proposition B"
                        className="wartekorbChallengeImage pageFourImage pageFourImage-small"
                      />
                    </button>
                  </div>

                  <div className="pageFourImageColumn pageFourImageColumn-right">
                    <button
                      type="button"
                      className="wartekorbImageButton pageFourImageButton"
                      onPointerDownCapture={stopBookFlipEvent}
                      onMouseDownCapture={stopBookFlipEvent}
                      onTouchStartCapture={stopBookFlipEvent}
                      onClick={(event) => {
                        event.stopPropagation();
                        openLightbox("/assets/Value Canvas A.png?v=2", "Value Canvas A");
                      }}
                      aria-label="Open larger Value Canvas A image"
                    >
                      <img
                        src="/assets/Value Canvas A.png?v=2"
                        alt="Value Canvas A"
                        className="wartekorbChallengeImage pageFourImage pageFourImage-large"
                      />
                    </button>

                    <button
                      type="button"
                      className="wartekorbImageButton pageFourImageButton"
                      onPointerDownCapture={stopBookFlipEvent}
                      onMouseDownCapture={stopBookFlipEvent}
                      onTouchStartCapture={stopBookFlipEvent}
                      onClick={(event) => {
                        event.stopPropagation();
                        openLightbox("/assets/Value Canvas B.png", "Value Canvas B");
                      }}
                      aria-label="Open larger Value Canvas B image"
                    >
                      <img
                        src="/assets/Value Canvas B.png"
                        alt="Value Canvas B"
                        className="wartekorbChallengeImage pageFourImage pageFourImage-large"
                      />
                    </button>
                  </div>
                </div>
              </section>

              <section className="page pageFourCaseStudy" aria-label="Wartekorb page" data-page-number="5">
                <div className="wartekorbChallengeCopy pageFourTextFlow">
                  <h2 className="wartekorbChallengeTitle">The Core Challenge (How Might We)</h2>
                  <p className="wartekorbChallengeText">
                    &ldquo;How might we help consumption-oriented people sustainably reduce their
                    impulse purchases without eliminating the joy of shopping?&rdquo;
                  </p>

                  <h3 className="wartekorbChallengeSubheading">Testable Hypothesis</h3>
                  <p className="wartekorbChallengeText">
                    We hypothesized that introducing a mandatory &lsquo;decision-pause&rsquo;
                    (friction) before a purchase would interrupt the emotional buying cycle and
                    significantly reduce impulse acquisitions.
                  </p>

                  <h3 className="wartekorbChallengeSubheading">
                    Rapid Sketching &amp; Concept Exploration
                  </h3>
                  <p className="wartekorbChallengeText">
                    Through rapid, individual sketching rounds, we explored diverse mechanisms
                    for creating meaningful friction—from reflective questionnaires to visual
                    budget impact charts—before converging on the most effective concepts for
                    prototyping.
                  </p>

                  <button
                    type="button"
                    className="wartekorbImageButton wartekorbImageButton-left"
                    onPointerDownCapture={stopBookFlipEvent}
                    onMouseDownCapture={stopBookFlipEvent}
                    onTouchStartCapture={stopBookFlipEvent}
                    onClick={(event) => {
                      event.stopPropagation();
                      openLightbox("/assets/Crazy 8 Sketches.png", "Crazy 8 sketches");
                    }}
                    aria-label="Open larger Crazy 8 sketches image"
                  >
                    <img
                      src="/assets/Crazy 8 Sketches.png"
                      alt="Crazy 8 sketches"
                      className="wartekorbChallengeImage pageFourImage pageFourImage-large"
                    />
                  </button>

                  <button
                    type="button"
                    className="wartekorbImageButton wartekorbImageButton-left"
                    onPointerDownCapture={stopBookFlipEvent}
                    onMouseDownCapture={stopBookFlipEvent}
                    onTouchStartCapture={stopBookFlipEvent}
                    onClick={(event) => {
                      event.stopPropagation();
                      openLightbox("/assets/Hypothesis.png", "Hypothesis visual");
                    }}
                    aria-label="Open larger Hypothesis image"
                  >
                    <img
                      src="/assets/Hypothesis.png"
                      alt="Hypothesis visual"
                      className="wartekorbChallengeImage pageFourImage pageFourImage-large"
                    />
                  </button>
                </div>
              </section>

              <section className="page pageFourCaseStudy" aria-label="Wartekorb research page" data-page-number="6">
                <div className="wartekorbChallengeCopy pageFourTextFlow">
                  <h3 className="wartekorbChallengeSubheading">Defining the Critical Path (Storyboard)</h3>
                  <p className="wartekorbChallengeText">
                    We synthesized our individual concepts into a single, unified user journey. We
                    mapped out the critical path required to intervene during an impulse purchase,
                    carefully defining the onboarding experience and the difference between online
                    and offline shopping contexts.
                  </p>

                  <h3 className="wartekorbChallengeSubheading">Scoping the MVP (Storymapping)</h3>
                  <p className="wartekorbChallengeText">
                    To translate our visual flow into a buildable architecture, we created a User
                    Story Map. By aligning features with our core Jobs-To-Be-Done, we were able to
                    strictly prioritize essential functions for the prototype and intentionally scope
                    out secondary features.
                  </p>

                  <button
                    type="button"
                    className="wartekorbImageButton wartekorbImageButton-left"
                    onPointerDownCapture={stopBookFlipEvent}
                    onMouseDownCapture={stopBookFlipEvent}
                    onTouchStartCapture={stopBookFlipEvent}
                    onClick={(event) => {
                      event.stopPropagation();
                      openLightbox("/assets/Storyboard.png", "Storyboard");
                    }}
                    aria-label="Open larger Storyboard image"
                  >
                    <img
                      src="/assets/Storyboard.png"
                      alt="Storyboard"
                      className="wartekorbChallengeImage pageFourImage pageFourImage-storyboard"
                    />
                  </button>
                </div>
              </section>

              <section className="page pageFourCaseStudy" aria-label="Wartekorb concept page" data-page-number="7">
                <div className="wartekorbChallengeCopy pageFourTextFlow">
                  <h2 className="wartekorbChallengeTitle">Concept Development</h2>
                  <p className="wartekorbChallengeText">
                    We translated research insights into a design concept that introduces a brief
                    reflective moment before checkout. This pause encourages users to reconsider
                    their emotional urgency and gives them a clearer view of the trade-offs.
                  </p>
                  <p className="wartekorbChallengeText">
                    The design language focused on clarity, warmth, and supportive prompts rather
                    than guilt or restriction. The experience was meant to feel intentional,
                    calm, and empowering rather than punitive.
                  </p>
                </div>
              </section>

              <section className="page pageFourCaseStudy" aria-label="Wartekorb testing page" data-page-number="8">
                <div className="wartekorbChallengeCopy pageFourTextFlow">
                  <h2 className="wartekorbChallengeTitle">Prototype &amp; Testing</h2>
                  <p className="wartekorbChallengeText">
                    We prototyped the decision-pause flow and tested it with participants who
                    regularly shopped online. The strongest feedback was that the pause felt helpful
                    when it was framed as self-control, not as an obstacle.
                  </p>
                  <p className="wartekorbChallengeText">
                    The final concept balanced friction and delight: users were given a thoughtful
                    checkpoint, quick budgeting feedback, and a feeling of agency before completing
                    the purchase.
                  </p>
                </div>
              </section>

              <section className="page" data-page-number="9">
                <h2>Kangrow</h2>
                <p>Case study preview.</p>
              </section>

              <section className="page" data-page-number="10">
                <h2>Google Maps</h2>
                <p>Case study preview.</p>
              </section>

              <section className="page" data-page-number="11">
                <h2>Visual Design Challenges</h2>
                <p>Show two visual design projects here.</p>
              </section>

              <section className="page aboutMePage" data-page-number="12">
                <h2>Hobbies</h2>
                <div className="aboutMeLayout">
                  <div className="aboutMeSection">
                    <p>
                      Outside of design, I love exploring creative hobbies that keep me curious,
                      inspired, and grounded.
                    </p>
                    <p>
                      I enjoy photography, discovering new cafés, reading, traveling, and spending
                      time in nature. These moments often spark ideas for more thoughtful,
                      human-centered design work.
                    </p>
                  </div>
                </div>
              </section>

              <section className="page" data-page-number="13">
                <h2>Contact</h2>
                <p>Add your email, LinkedIn, portfolio links, or CV here.</p>
              </section>

              <section className="page cover" aria-label="Journal back cover">
                <img
                  src="/assets/notebook back.jpeg"
                  alt="Journal back cover"
                  className="coverImage"
                />
              </section>
            </HTMLFlipBook>

            {hasOpenedNotebook && isOpen && (
              <aside className="sideTabs" aria-label="Notebook sections">
                {NOTEBOOK_TABS.map((tab) => (
                  <button
                    key={tab.label}
                    type="button"
                    className={`sideTab sideTab-${tab.tone}`}
                    onClick={() => handleTabJump(tab.pageIndex)}
                  >
                    {tab.label}
                  </button>
                ))}
              </aside>
            )}
          </div>
        </div>
      </div>

      {lightboxImage && (
        <div
          className="lightboxOverlay"
          role="dialog"
          aria-modal="true"
          aria-label="Expanded image preview"
          onClick={closeLightbox}
        >
          <div className="lightboxBackdrop" aria-hidden="true" />
          <div
            className="lightboxPanel"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              ref={lightboxCloseButtonRef}
              className="lightboxCloseButton"
              onClick={closeLightbox}
              aria-label="Close image preview"
            >
              Close
            </button>
            <img
              src={lightboxImage.src}
              alt={lightboxImage.alt}
              className="lightboxImage"
              onClick={(event) => {
                event.stopPropagation();
                closeLightbox();
              }}
            />
          </div>
        </div>
      )}
    </main>
  );
}

export default App;