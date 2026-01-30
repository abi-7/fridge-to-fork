import { useState, useCallback, useRef } from "react";
import "./styles.css";

export default function App() {
  const [ingredients, setIngredients] = useState([]);
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [servings, setServings] = useState(2);
  const [recipes, setRecipes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // The Safety Lock: This persist across renders and prevents double-firing
  const isRequesting = useRef(false);

  const addIngredient = () => {
    if (
      currentIngredient.trim() &&
      !ingredients.includes(currentIngredient.trim().toLowerCase())
    ) {
      setIngredients([...ingredients, currentIngredient.trim().toLowerCase()]);
      setCurrentIngredient("");
    }
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addIngredient();
    }
  };

  const generateRecipes = useCallback(async () => {
    // GUARD 1: Prevent multiple clicks and ensure ingredients exist
    if (isRequesting.current || ingredients.length === 0) return;

    // Set the lock
    isRequesting.current = true;
    setLoading(true);
    setError(null);

    const prompt = `I have these ingredients available: ${ingredients.join(", ")}.

Please suggest 3 different recipes I can make for ${servings} people. For each recipe, provide:
1. Recipe name
2. Brief description (1-2 sentences)
3. Additional common pantry items I might need (salt, pepper, oil, etc.)
4. Step-by-step instructions
5. Estimated cooking time

Format your response as JSON with this structure:
{
  "recipes": [
    {
      "name": "Recipe Name",
      "description": "Brief description",
      "additionalIngredients": ["item1", "item2"],
      "instructions": ["Step 1", "Step 2"],
      "cookingTime": "30 minutes"
    }
  ]
}

Only respond with valid JSON, no additional text or markdown formatting.`;

    try {
      // Switched to Gemini 2.5 Flash Lite as it has higher RPM (10)
      const response = await fetch(`/.netlify/functions/gemini-proxy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            topK: 40,
          },
        }),
      });

      if (response.status === 429) {
        throw new Error(
          "Rate limit reached (Free Tier). Please wait 60 seconds before trying again.",
        );
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || "Failed to generate recipes.",
        );
      }

      console.log("Full API Response:", data);

      const data = await response.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "No recipe found";
      const cleanedContent = content.replace(/```json\n?|\n?```/g, "").trim();
      const parsed = JSON.parse(cleanedContent);
      setRecipes(parsed.recipes);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      // Release the lock and stop loading
      setLoading(false);
      isRequesting.current = false;
    }
  }, [ingredients, servings]);

  return (
    <>
      <div className="container">
        <div className="grain" />

        <header className="header">
          <div className="logoContainer">
            <span className="logoIcon">🍳</span>
            <h1 className="title">Fridge to Fork</h1>
          </div>
          <p className="subtitle">
            Transform your ingredients into delicious meals
          </p>
        </header>

        <main className="main">
          <section className="inputSection">
            <div className="card">
              <h2 className="cardTitle">What's in your kitchen?</h2>

              <div className="inputRow">
                <input
                  type="text"
                  value={currentIngredient}
                  onChange={(e) => setCurrentIngredient(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type an ingredient..."
                  className="input"
                />
                <button onClick={addIngredient} className="addButton">
                  Add
                </button>
              </div>

              {ingredients.length > 0 && (
                <div className="ingredientTags">
                  {ingredients.map((ing, index) => (
                    <span key={index} className="tag">
                      {ing}
                      <button
                        onClick={() => removeIngredient(index)}
                        className="tagRemove"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="servingsRow">
                <label className="servingsLabel">Servings:</label>
                <div className="servingsControl">
                  <button
                    onClick={() => setServings(Math.max(1, servings - 1))}
                    className="servingsButton"
                  >
                    −
                  </button>
                  <span className="servingsValue">{servings}</span>
                  <button
                    onClick={() => setServings(Math.min(12, servings + 1))}
                    className="servingsButton"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={generateRecipes}
                disabled={loading || ingredients.length === 0}
                className={`generateButton ${loading || ingredients.length === 0 ? "generateButtonDisabled" : ""}`}
              >
                {loading ? (
                  <span className="loadingText">
                    <span className="spinner">◌</span>
                    Cooking up ideas...
                  </span>
                ) : (
                  "✨ Generate Recipes ✨"
                )}
              </button>

              {error && <p className="error">{error}</p>}
            </div>
          </section>

          {recipes && (
            <section className="resultsSection">
              <h2 className="resultsTitle">Your Recipe Ideas</h2>
              <div className="recipeGrid">
                {recipes.map((recipe, index) => (
                  <article key={index} className="recipeCard">
                    <div className="recipeNumber">{index + 1}</div>
                    <h3 className="recipeName">{recipe.name}</h3>
                    <p className="recipeDescription">{recipe.description}</p>

                    <div className="recipeTime">
                      <span className="timeIcon">⏱</span>
                      {recipe.cookingTime}
                    </div>

                    {recipe.additionalIngredients?.length > 0 && (
                      <div className="additionalSection">
                        <h4 className="additionalTitle">You'll also need:</h4>
                        <p className="additionalList">
                          {recipe.additionalIngredients.join(", ")}
                        </p>
                      </div>
                    )}

                    <div className="instructionsSection">
                      <h4 className="instructionsTitle">Instructions</h4>
                      <ol className="instructionsList">
                        {recipe.instructions.map((step, stepIndex) => (
                          <li key={stepIndex} className="instructionStep">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </main>

        <footer className="footer">
          <p>Made with 💜 by Abi</p>
          <a
            href="https://www.linkedin.com/in/abigail-ferreira/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <span className="hidden sm:inline"> • </span>
          <a
            href="https://github.com/abi-7/"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <span className="hidden sm:inline"> • </span>
          <a
            href="https://www.instagram.com/devanddesigns/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <span className="hidden sm:inline"> • </span>
          <a
            href="https://www.buymeacoffee.com/abigailcodes"
            target="_blank"
            rel="noopener noreferrer"
          >
            Buy Me a Coffee
          </a>
        </footer>
      </div>
    </>
  );
}
