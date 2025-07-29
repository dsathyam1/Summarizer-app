async function SummarizeText() {
  const inputText = document.getElementById('inputText').value.trim();
  const summaryOutput = document.getElementById('summaryOutput');

  if (!inputText) {
    alert("Please enter some text to summarize.");
    return;
  }

  summaryOutput.textContent = "Summarizing...";

  const HF_API_TOKEN = "PUT_YOUR_OWN_APIKEY_HERE";

  try {
    let response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HF_API_TOKEN}`
      },
      body: JSON.stringify({ inputs: inputText })
    });

    if (response.status === 403) {
      response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: inputText })
      });
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data && data[0] && data[0].summary_text) {
      summaryOutput.textContent = data[0].summary_text;
    } else {
      summaryOutput.textContent = "Failed to summarize. Try again.";
    }

  } catch (error) {
    console.error(error);
    summaryOutput.textContent = "Error occurred while summarizing.";
  }
}
