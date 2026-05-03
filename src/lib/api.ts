export async function analyzeError(
  errorText: string,
  mode: string
) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  const response = await fetch(`${apiUrl}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "devops-ai-secret-key",
    },
    body: JSON.stringify({
      errorText,
      mode,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to analyze error.");
  }

  return response.json();
}