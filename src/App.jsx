import HTMLFlipBook from "react-pageflip";
import { useRef, useState } from "react";
import "./App.css";

function App() {
  const bookRef = useRef();
  const [isOpen, setIsOpen] = useState(false);

  const handleFlip = (e) => {
    // If on cover page (0), center it. Otherwise, shift it to the side
    setIsOpen(e.data !== 0);
  };

  const bookWidth = isOpen ? 420 : 546;
  const bookHeight = isOpen ? 594 : 772.2;
  const bookMinWidth = isOpen ? 300 : 390;
  const bookMaxWidth = isOpen ? 500 : 650;
  const bookMinHeight = isOpen ? 430 : 559;
  const bookMaxHeight = isOpen ? 720 : 936;

  return (
    <main className="scene">
      <h1 className="title">Estelle&apos;s Portfolio</h1>

      <div className={`book-container ${isOpen ? "open" : "closed"}`}>
        <HTMLFlipBook
          ref={bookRef}
          width={bookWidth}
          height={bookHeight}
          size="stretch"
          minWidth={bookMinWidth}
          maxWidth={bookMaxWidth}
          minHeight={bookMinHeight}
          maxHeight={bookMaxHeight}
          showCover={true}
          drawShadow={true}
          flippingTime={500}
          useMouseEvents={true}
          showPageCorners={true}
          mobileScrollSupport={true}
          className="book"
          onFlip={handleFlip}
        >
          <section className="page cover" aria-label="Journal cover">
            <img
              src="/assets/journal-cover-image.jpg"
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

          <section className="page">
            <h2>Wartekorb</h2>
            <p>Case study preview.</p>
          </section>

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
        </HTMLFlipBook>
      </div>
    </main>
  );
}

export default App;