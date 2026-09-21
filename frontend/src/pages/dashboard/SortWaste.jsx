import React, { useRef, useState } from "react";
import { api } from "../../api.js";
import { colorFor } from "../../categoryColors.js";
import Icon from "../../components/Icons.jsx";

const suggestions = [
  "plastic bottle",
  "banana peel",
  "old phone battery",
  "cardboard box",
  "glass jar",
  "used cooking oil",
  "LED bulb",
  "newspaper",
];

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read image"));

    reader.readAsDataURL(file);
  });
}

export default function SortWaste() {
  const [item, setItem] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState(null);

  const inputRef = useRef(null);

  const submit = async (e) => {
    e?.preventDefault();

    if (!item.trim() && !file) {
      setError("Please describe the waste item or upload an image.");
      return;
    }

    setBusy(true);
    setError("");
    setResult(null);

    try {
      let image = null;

      if (file) {
        image = await fileToBase64(file);
      }

      const response = await api.classify(
        item.trim(),
        image
      );

      setResult(response);

      // Keep image visible after classification.
      // Clear only text when an image was used.
      if (!file) {
        setItem("");
      }
    } catch (err) {
      setError(err.message || "Classification failed.");
    } finally {
      setBusy(false);
    }
  };

  const onFile = (e) => {
    const f = e.target.files?.[0];

    if (!f) return;

    // Basic client-side validation.
    if (!["image/png", "image/jpeg"].includes(f.type)) {
      setError("Please upload a JPG or PNG image.");
      return;
    }

    if (f.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB.");
      return;
    }

    setFile(f);
    setError("");
    setResult(null);

    // If user uploaded an image without typing anything,
    // let the AI identify the item from the image itself.

  };

  const removeImage = () => {
    setFile(null);
    setResult(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="inner-page">

      <div className="page-hero">
        <div>
          <div className="eyebrow">
            <span className="live-dot" />
            AI CLASSIFICATION WORKSPACE
          </div>

          <h1>Sort Waste with AI</h1>

          <p>
            Identify the right waste stream, understand why,
            and get a practical disposal action.
          </p>
        </div>

        <div className="page-hero-art">♻️</div>
      </div>

      <div className="sort-layout">

        <section className="panel classifier-main">

          <div className="panel-head">
            <div>
              <h2>
                <Icon name="spark" size={20} />
                Waste Classifier
              </h2>

              <p>
                Describe the item or attach a photo as your
                classification input.
              </p>
            </div>

            <span className="engine-chip">
              AI ENGINE • ONLINE
            </span>
          </div>

          <form onSubmit={submit} className="classifier-form">

            <div className="input-shell">
              <Icon name="search" size={19} />

              <input
                value={item}
                onChange={(e) => setItem(e.target.value)}
                placeholder="e.g. plastic water bottle, banana peel, battery..."
              />

              <button
                type="submit"
                disabled={busy}
              >
                {busy ? "Analyzing…" : "Analyze"}
              </button>
            </div>

          </form>

          <div
            className="upload-box"
            onClick={() => inputRef.current?.click()}
          >

            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg"
              hidden
              onChange={onFile}
            />

            <div className="upload-orb">
              <Icon name="camera" size={24} />
            </div>

            <strong>
              {file
                ? file.name
                : "Upload a waste image"}
            </strong>

            <span>
              {file
                ? "Image attached — use Analyze to classify the item"
                : "JPG or PNG • max 5 MB"}
            </span>

            <div className="upload-actions">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
              >
                <Icon name="upload" size={16} />
                Choose Image
              </button>

              <span>or drag & drop</span>
            </div>

          </div>

          {file && (
            <div className="image-preview-wrap">

              <img
                src={URL.createObjectURL(file)}
                alt="Waste preview"
                className="image-preview"
              />

              <button
                type="button"
                className="remove-image"
                onClick={removeImage}
              >
                Remove image
              </button>

            </div>
          )}

          <div className="suggestions">
            <span>Try:</span>

            {suggestions.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => {
                  setItem(s);
                  setFile(null);
                  setResult(null);
                  setError("");
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {error && (
            <div className="error-strip">
              <Icon name="alert" size={18} />
              {error}
            </div>
          )}

          {result && (
            <div
              className="classification-result"
              style={{
                "--cat": colorFor(result.category),
              }}
            >

              <div className="result-top">

                <div>
                  <span className="result-kicker">
                    CLASSIFICATION RESULT
                  </span>

                  <h3>{result.item_name}</h3>
                </div>

                <span className="result-category">
                  {result.category}
                </span>

              </div>

              <div className="result-grid">

                <div>
                  <span>Confidence</span>

                  <strong>
                    {result.confidence}%
                  </strong>

                  <div className="confidence-bar">
                    <i
                      style={{
                        width: `${result.confidence}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <span>Recommended action</span>

                  <p>
                    {result.disposal_tip}
                  </p>
                </div>

                <div>
                  <span>
                    Why EcoSort chose this
                  </span>

                  <p>
                    {result.reasoning}
                  </p>
                </div>

              </div>

              <div className="safe-note">
                <Icon name="check" size={17} />

                Always follow your local municipal
                waste rules for final disposal.
              </div>

            </div>
          )}

        </section>

        <aside className="panel side-guide">

          <h2>Segregation Guide</h2>

          <p>
            Four everyday streams to remember.
          </p>

          {[
            [
              "Organic / Compostable",
              "Food scraps, peels & garden waste",
              "🍃",
              "organic",
            ],
            [
              "Recyclable",
              "Clean plastic, paper, glass & metal",
              "♻",
              "recycle",
            ],
            [
              "E-Waste",
              "Batteries, electronics & cables",
              "🔋",
              "ewaste",
            ],
            [
              "Hazardous",
              "Chemicals, medicines & sharps",
              "⚠",
              "hazard",
            ],
          ].map((x) => (
            <div
              className="guide-card"
              key={x[0]}
            >
              <span
                className={`guide-icon ${x[3]}`}
              >
                {x[2]}
              </span>

              <div>
                <strong>{x[0]}</strong>
                <small>{x[1]}</small>
              </div>
            </div>
          ))}

          <div className="mini-callout">
            <Icon name="leaf" size={20} />

            <div>
              <strong>
                Small action, real impact
              </strong>

              <p>
                Correct segregation keeps recoverable
                materials out of landfill.
              </p>
            </div>
          </div>

        </aside>

      </div>

    </div>
  );
}