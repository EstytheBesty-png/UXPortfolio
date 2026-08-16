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

const MOOD_OPTIONS = [
  { label: "Happy", icon: "😊" },
  { label: "Excited", icon: "🤩" },
  { label: "Inspired", icon: "💡" },
  { label: "Amused", icon: "😄" },
  { label: "Content", icon: "😌" },
  { label: "Tired", icon: "😴" },
  { label: "Anxious", icon: "😰" },
  { label: "Frustrated", icon: "😤" },
  { label: "Stressed", icon: "😣" },
  { label: "Overwhelmed", icon: "🌊" },
  { label: "Sad", icon: "😢" },
];

function App() {
  const bookRef = useRef();
  const frontCoverRef = useRef(null);
  const lightboxCloseButtonRef = useRef(null);
  const lastFocusedElementRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedNotebook, setHasOpenedNotebook] = useState(false);
  const [closeOnNextClick, setCloseOnNextClick] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
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

  useEffect(() => {
    const cover = frontCoverRef.current;
    if (!cover) {
      return;
    }

    const stopCoverGesture = (event) => {
      event.stopPropagation();
    };
    const captureOptions = { capture: true };
    const gestureEvents = ["pointerdown", "mousedown", "touchstart"];

    gestureEvents.forEach((eventName) => {
      cover.addEventListener(eventName, stopCoverGesture, captureOptions);
    });

    return () => {
      gestureEvents.forEach((eventName) => {
        cover.removeEventListener(eventName, stopCoverGesture, captureOptions);
      });
    };
  }, []);

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

  const handleCoverClick = (event) => {
    event.stopPropagation();
    const pageFlip = bookRef.current?.pageFlip();
    if (!pageFlip) {
      return;
    }
    pageFlip.turnToPage(1);
    setHasOpenedNotebook(true);
    setIsOpen(true);
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

  const handleBookPointerDown = (event) => {
    const interactiveTarget = event.target.closest?.("button, a, input, textarea, select");
    const frontCover = event.target.closest?.('[aria-label="Journal cover"]');
    if (interactiveTarget || frontCover) {
      return;
    }

    const touchPoint = event.touches?.[0] || event.changedTouches?.[0];
    const clientX = touchPoint?.clientX ?? event.clientX;
    const clientY = touchPoint?.clientY ?? event.clientY;
    if (clientX === undefined || clientY === undefined) {
      return;
    }

    const bookFrameBounds = event.currentTarget.getBoundingClientRect();
    const pointerX = clientX - bookFrameBounds.left;
    const pointerY = clientY - bookFrameBounds.top;
    const cornerSize = 120;
    const isLeftEdge = pointerX <= 56;
    const isRightEdge = pointerX >= bookFrameBounds.width - 56;
    const isTopCorner =
      pointerY <= cornerSize && (pointerX <= cornerSize || pointerX >= bookFrameBounds.width - cornerSize);
    const isBottomCorner =
      pointerY >= bookFrameBounds.height - cornerSize &&
      (pointerX <= cornerSize || pointerX >= bookFrameBounds.width - cornerSize);

    if (!isLeftEdge && !isRightEdge && !isTopCorner && !isBottomCorner) {
      event.stopPropagation();
    }
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const availableWidth = Math.max(320, viewport.width - VIEWPORT_SIDE_GAP);
  const availableHeight = Math.max(320, viewport.height - VIEWPORT_TOP_BOTTOM_GAP);
  const availablePageWidth = isOpen ? availableWidth / 2 : availableWidth;

  const widthLimitedHeight = availablePageWidth / BOOK_RATIO;
  const fitByWidth = widthLimitedHeight <= availableHeight;

  const fittedWidth = Math.floor(fitByWidth ? availablePageWidth : availableHeight * BOOK_RATIO);
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
            onPointerDownCapture={handleBookPointerDown}
            onMouseDownCapture={handleBookPointerDown}
            onTouchStartCapture={handleBookPointerDown}
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
              <section
                ref={frontCoverRef}
                className="page cover"
                aria-label="Journal cover"
                onClick={handleCoverClick}
              >
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
                <h2>Intro</h2>
                <div className="aboutMeLayout">
                  <div className="aboutMeSection">
                    <div className="aboutMePhotoFrame">
                      <img
                        src="/assets/estk_photo_display.jpg"
                        alt="Estelle Kohler"
                        className="aboutMePhotoPlaceholder"
                      />
                    </div>

                    <div className="aboutMeIntroCopy">
                      <p>
                        <span className="aboutMeIntroGreeting">Hi, I&apos;m Estelle</span>
                        <span className="aboutMeIntroStatement">
                          A UX Designer creating human-centred experiences for whatever comes next.
                        </span>
                      </p>
                      <p>
                        My background in event management and IT support taught me how to untangle
                        complex logistics and anticipate people&apos;s needs. Today, I translate that
                        practical empathy into my design process. Whether I am mapping out a
                        customer journey, prototyping a wearable interface, or exploring new
                        digital tools, I want to build adaptable products that thrive beyond
                        traditional screens.
                      </p>
                    </div>
                  </div>

                  <div className="moodTrackerPanel">
                    <h3>Mood Tracker</h3>
                    <p>How are you feeling today?</p>
                    <div className="moodTrackerGrid" aria-label="Mood tracker options">
                      {MOOD_OPTIONS.map((mood) => (
                        <button
                          type="button"
                          className="moodOption"
                          key={mood.label}
                          onPointerDownCapture={stopBookFlipEvent}
                          onMouseDownCapture={stopBookFlipEvent}
                          onTouchStartCapture={stopBookFlipEvent}
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedMood(mood);
                          }}
                          aria-pressed={selectedMood?.label === mood.label}
                        >
                          <span className="moodIcon" aria-hidden="true">{mood.icon}</span>
                          <span>{mood.label}</span>
                        </button>
                      ))}
                    </div>
                    <div className="moodResult" aria-live="polite">
                      {selectedMood ? (
                        <>
                          <span className="moodResultIcon" aria-hidden="true">{selectedMood.icon}</span>
                          <span>You are feeling {selectedMood.label.toLowerCase()}.</span>
                        </>
                      ) : (
                        <span>Select a mood to check in.</span>
                      )}
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

                  <h2 className="wartekorbChallengeTitle">Visual Strategy &amp; Art Direction</h2>
                  <h3 className="wartekorbChallengeSubheading">Strategic Visual Divergence</h3>
                  <p className="wartekorbChallengeText">
                    To establish our brand identity, we explored two starkly divergent visual
                    paths: a calm, minimalist aesthetic (typical for mindfulness tools) and a
                    highly vibrant, stimulating direction.
                  </p>

                  <h3 className="wartekorbChallengeSubheading">The Design Rationale</h3>
                  <p className="wartekorbChallengeText">
                    We strategically selected the Vibrant direction. We realized that to
                    successfully intercept a user during an impulse-buying high, our app could
                    not feel like a boring, restrictive financial tool. It needed to be just as
                    visually engaging and energetic as the e-commerce platforms they were
                    browsing. This allowed us to build a fresh, gamified, and distinct design
                    system that makes intentional friction feel rewarding.
                  </p>

                  <h3 className="wartekorbChallengeSubheading">
                    Brand Identity: Disrupting &ldquo;Eco&rdquo; Tropes
                  </h3>
                  <p className="wartekorbChallengeText">
                    We intentionally avoided the muted, nature-based aesthetics typical of
                    sustainability tools. To effectively intercept impulse buyers, the app needed
                    to mirror the high-energy, dopamine-driven environment of e-commerce. We
                    developed a bold, expressive identity that reframes &ldquo;restraint&rdquo; not as a
                    restriction, but as a playful, empowering choice.
                  </p>
                </div>
              </section>

              <section
                className="page pageFourCaseStudy pageSevenDesignPage"
                aria-label="Wartekorb concept page"
                data-page-number="7"
              >
                <div className="wartekorbChallengeCopy pageFourTextFlow">
                  <h3 className="wartekorbChallengeSubheading">
                    The Design System: Form Meets Function
                  </h3>
                  <p className="wartekorbChallengeText">
                    To ensure this vibrant direction remained highly usable, we established a
                    strict design system to control the chaos.
                  </p>

                  <h3 className="wartekorbChallengeSubheading">Functional Color</h3>
                  <p className="wartekorbChallengeText">
                    We utilized Neon Green exclusively for primary actions and positive
                    reinforcement, while grounding the main interface in deep Violet.
                  </p>

                  <h3 className="wartekorbChallengeSubheading">Typography</h3>
                  <p className="wartekorbChallengeText">
                    We separated brand expression from usability by using an expressive display
                    font for large headers and logos, paired with a highly legible sans-serif
                    (Plus Jakarta Sans) for all UI components and navigation.
                  </p>
                </div>

                <div className="pageSevenDesignImages" aria-label="Design system visuals">
                  <button
                    type="button"
                    className="wartekorbImageButton pageSevenDesignImageButton"
                    onPointerDownCapture={stopBookFlipEvent}
                    onMouseDownCapture={stopBookFlipEvent}
                    onTouchStartCapture={stopBookFlipEvent}
                    onClick={(event) => {
                      event.stopPropagation();
                      openLightbox("/assets/Visuelle Leitidee.png", "Visuelle Leitidee");
                    }}
                    aria-label="Open larger Visuelle Leitidee image"
                  >
                    <img
                      src="/assets/Visuelle Leitidee.png"
                      alt="Visuelle Leitidee"
                      className="wartekorbChallengeImage pageSevenDesignImage"
                    />
                  </button>

                  <button
                    type="button"
                    className="wartekorbImageButton pageSevenDesignImageButton"
                    onPointerDownCapture={stopBookFlipEvent}
                    onMouseDownCapture={stopBookFlipEvent}
                    onTouchStartCapture={stopBookFlipEvent}
                    onClick={(event) => {
                      event.stopPropagation();
                      openLightbox("/assets/Final Design System.png", "Final Design System");
                    }}
                    aria-label="Open larger Final Design System image"
                  >
                    <img
                      src="/assets/Final Design System.png"
                      alt="Final Design System"
                      className="wartekorbChallengeImage pageSevenDesignImage"
                    />
                  </button>
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