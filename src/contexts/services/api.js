export const fetchQuizData = async () => {
    try {
        const response = await fetch('/Uw5CrX');
      if (!response.ok) throw new Error("Failed to fetch quiz data");
      const data = await response.json();
      return data.questions; // Return parsed questions array
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };