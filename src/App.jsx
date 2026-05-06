import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function diagnose(round) {
  let shortRight = 0;
  let penalties = 0;
  let threePutts = 0;
  let missedGIR = 0;

  round.forEach((h) => {
    if (h.tags.includes("Missed short")) shortRight++;
    if (h.tags.includes("Missed right")) shortRight++;
    if (h.tags.includes("Penalty")) penalties++;
    if (h.tags.includes("3-putt")) threePutts++;
    if (!h.tags.includes("GIR")) missedGIR++;
  });

  const leaks = [];

  if (shortRight >= 2) leaks.push({ key: "Approach play", detail: "Repeated short/right misses suggest under-clubbing." });
  if (penalties >= 1) leaks.push({ key: "Tee shots", detail: "Penalty shots are creating avoidable doubles." });
  if (threePutts >= 1) leaks.push({ key: "Putting", detail: "Distance control is costing you shots." });
  if (missedGIR >= 2) leaks.push({ key: "Greens in regulation", detail: "Missing greens is putting pressure on your short game." });

  return leaks.length ? leaks.slice(0, 2) : [{ key: "Course management", detail: "No major leak detected. Focus on simple decisions." }];
}

function getAdvice(leak) {
  if (leak.key === "Approach play") return ["Take +1 club, aim centre", "Your miss pattern suggests you are leaving shots short/right. Club up and aim at the safest part of the green."];
  if (leak.key === "Tee shots") return ["Use hybrid on tight holes", "When there is trouble right or the fairway feels narrow, keep driver in the bag."];
  if (leak.key === "Putting") return ["Lag to a 3ft zone", "Your first putt target is speed control, not holing everything."];
  if (leak.key === "Greens in regulation") return ["Aim centre of green", "Do not chase tucked pins. Hit the biggest safe target."];
  return ["Play simple", "Choose the shot that removes the worst miss."];
}

function Button({ children, onClick, secondary }) {
  return <button onClick={onClick} className={secondary ? "button secondary" : "button"}>{children}</button>;
}

function Card({ children, dark }) {
  return <div className={dark ? "card dark" : "card"}>{children}</div>;
}

function Phone({ children }) {
  return (
    <main className="page">
      <section className="phone">
        <div className="notch" />
        <div className="screen">{children}</div>
      </section>
    </main>
  );
}

function App() {
  const [screen, setScreen] = useState("home");
  const [currentHole, setCurrentHole] = useState(0);
  const [round, setRound] = useState([
    { hole: 1, tags: [] },
    { hole: 2, tags: [] },
    { hole: 3, tags: [] }
  ]);

  const leaks = useMemo(() => diagnose(round), [round]);

  function toggleTag(tag) {
    setRound((previous) => {
      const updated = previous.map((h) => ({ ...h, tags: [...h.tags] }));
      const tags = updated[currentHole].tags;
      updated[currentHole].tags = tags.includes(tag)
        ? tags.filter((t) => t !== tag)
        : [...tags, tag];
      return updated;
    });
  }

  function restart() {
    setScreen("home");
    setCurrentHole(0);
    setRound([{ hole: 1, tags: [] }, { hole: 2, tags: [] }, { hole: 3, tags: [] }]);
  }

  if (screen === "home") {
    return (
      <Phone>
        <div className="stack hero">
          <div className="appIcon">⛳</div>
          <h1>Smart Caddie Loop</h1>
          <p className="lead">Simulate three holes and get a practical Next Round Plan.</p>
          <Card>
            <p className="eyebrow">Prototype test</p>
            <p>Use realistic outcomes from your last few rounds. We’re testing whether the advice feels useful enough to try next time you play.</p>
          </Card>
          <Button onClick={() => setScreen("hole")}>Start simulation</Button>
        </div>
      </Phone>
    );
  }

  if (screen === "hole") {
    const hole = round[currentHole];
    const tags = ["GIR", "Missed short", "Missed right", "Penalty", "3-putt"];

    return (
      <Phone>
        <div className="stack">
          <p className="eyebrow">Hole {currentHole + 1} of 3</p>
          <h2>What happened?</h2>
          <p className="muted">Tap the things that applied to this hole.</p>

          <div className="tagGrid">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={hole.tags.includes(tag) ? "tag active" : "tag"}
              >
                {tag}
              </button>
            ))}
          </div>

          <Card>
            <p className="eyebrow">Selected</p>
            <p>{hole.tags.length ? hole.tags.join(", ") : "No tags selected yet"}</p>
          </Card>

          <Button onClick={() => currentHole < 2 ? setCurrentHole(currentHole + 1) : setScreen("summary")}>
            {currentHole < 2 ? "Next hole" : "Finish round"}
          </Button>
        </div>
      </Phone>
    );
  }

  if (screen === "summary") {
    return (
      <Phone>
        <div className="stack">
          <p className="eyebrow">Round summary</p>
          <h2>Here’s what cost you shots</h2>
          <p className="muted">The prototype identifies your top scoring leaks.</p>

          {leaks.map((leak) => (
            <Card key={leak.key}>
              <h3>{leak.key}</h3>
              <p>{leak.detail}</p>
            </Card>
          ))}

          <Button onClick={() => setScreen("plan")}>Create Next Round Plan</Button>
          <Button secondary onClick={restart}>Restart</Button>
        </div>
      </Phone>
    );
  }

  if (screen === "plan") {
    return (
      <Phone>
        <div className="stack">
          <p className="eyebrow">Next Round Plan</p>
          <h2>Three rules. No clutter.</h2>

          {leaks.map((leak, index) => {
            const [title, body] = getAdvice(leak);
            return (
              <Card dark key={leak.key}>
                <p className="eyebrow light">Rule {index + 1}</p>
                <h3>{title}</h3>
                <p>{body}</p>
              </Card>
            );
          })}

          <Card>
            <h3>Mindset rule</h3>
            <p>Protect against doubles. Your quickest route to lower scores is removing blow-up holes.</p>
          </Card>

          <Button onClick={() => setScreen("prompt")}>Simulate smart prompt</Button>
          <Button secondary onClick={restart}>Restart</Button>
        </div>
      </Phone>
    );
  }

  if (screen === "prompt") {
    const [title, body] = getAdvice(leaks[0]);

    return (
      <Phone>
        <div className="stack hero">
          <Card dark>
            <p className="eyebrow light">Smart prompt</p>
            <h2>{title}</h2>
            <p>{body}</p>
          </Card>

          <Card>
            <p className="eyebrow">Testing question</p>
            <p>Would you trust this enough to follow it in your next real round?</p>
          </Card>

          <Button onClick={restart}>Restart prototype</Button>
        </div>
      </Phone>
    );
  }
}

createRoot(document.getElementById("root")).render(<App />);
