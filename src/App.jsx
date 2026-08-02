import HTMLFlipBook from "react-pageflip";
import { useEffect, useRef, useState } from "react";
import "./App.css";

const BOOK_RATIO = 620 / 878;
const VIEWPORT_SIDE_GAP = 0;
const VIEWPORT_TOP_BOTTOM_GAP = 0;

const NOTEBOOK_TABS = [
  { label: "Wartekorb", pageIndex: 3, tone: "sage" },
  { label: "Kangrow", pageIndex: 6, tone: "rose" },
  { label: "Google Maps", pageIndex: 7, tone: "wheat" },
  { label: "Visual Design", pageIndex: 8, tone: "mint" },
  { label: "About", pageIndex: 9, tone: "peach" },
  { label: "Contact", pageIndex: 10, tone: "lilac" },
];

function App() {
  const bookRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedNotebook, setHasOpenedNotebook] = useState(false);
  const [closeOnNextClick, setCloseOnNextClick] = useState(false);
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

              <section className="page">
                <h2>Table of Contents</h2>
                <ul>
                  <li>Wartekorb</li>
                  <li>Kangrow</li>
                  <li>Google Maps</li>
                  <li>Visual Design Challenges</li>
                  <li>About me</li>
                  <li>Contact</li>
                </ul>
              </section>

              <section className="page">
                <h2>Mood Tracker</h2>
                <p>How are you feeling today?</p>
                <button>🌸 Happy</button>
                <button>🌿 Calm</button>
                <button>🍓 Inspired</button>
              </section>

              <section className="page wartekorbChallengePage" aria-label="Wartekorb page">
                <div className="wartekorbChallengeLayout">
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
                      friction with a positive, motivating, and gamified user experience.
                    </p>
                    <p className="wartekorbChallengeText">
                      The name Wartekorb combines &ldquo;Warenkorb&rdquo; (shopping cart) and
                      &ldquo;warten&rdquo; (to wait), reflecting the core idea of the app: creating a
                      deliberate waiting moment before purchasing.
                    </p>

                    <h3 className="wartekorbChallengeSubheading">
                      The Team Context &amp; The Hook
                    </h3>
                    <p className="wartekorbChallengeText">
                      To introduce our product team of five designers from FHGR University,
                      we decided to lean directly into the problem space. We presented
                      ourselves as a grid of &ldquo;impulse buys&rdquo; within a typical e-commerce
                      interface, immediately setting the thematic stage for the case study.
                      (Note: Team member identities have been intentionally obfuscated to
                      maintain professional privacy).
                    </p>
                  </div>
                  <div className="wartekorbChallengeMedia">
                    <img
                      src="/assets/Wartekorb app image.png"
                      alt="Wartekorb app mockups"
                      className="wartekorbChallengeImage"
                    />
                    <img
                      src="/assets/Team image.png"
                      alt="Team context image"
                      className="wartekorbChallengeImage wartekorbTeamImage"
                    />
                  </div>
                </div>
              </section>

              <section className="page" aria-label="Wartekorb page" />

              <section className="page" aria-label="Wartekorb page" />

              <section className="page">
                <h2>Kangrow</h2>
                <p>Case study preview.</p>
              </section>

              <section className="page">
                <h2>Google Maps</h2>
                <p>Case study preview.</p>
              </section>

              <section className="page">
                <h2>Visual Design Challenges</h2>
                <p>Show two visual design projects here.</p>
              </section>

              <section className="page">
                <h2>About Me</h2>
                <p>
                  I am a UX designer who enjoys research, visual storytelling,
                  accessibility, and thoughtful digital experiences.
                </p>
              </section>

              <section className="page">
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
    </main>
  );
}

export default App;