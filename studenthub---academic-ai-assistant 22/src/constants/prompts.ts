export const PROMPT_TEMPLATES = {
  notes: (topic: string) => 
    `Generate structured study notes about ${topic}. Include a detailed explanation, key points, practical examples, and a short summary. Format the output clearly with headings.`,
  
  quiz: (topic: string) => 
    `Create 5 multiple choice questions about ${topic}. For each question, provide 4 options (A, B, C, D) and clearly state the correct answer at the end of each question block.`,
  
  code: (code: string) => 
    `Explain the following code step by step:\n\n${code}\n\nInclude the purpose of the code and suggest 3 possible improvements for performance or readability.`,
  
  homework: (question: string) => 
    `Write a structured academic answer for the following question: "${question}". The response should be in a paragraph format suitable for a college-level assignment, including an introduction, main body, and conclusion.`,
  
  study: (topic: string) => 
    `You are an academic AI tutor. Generate a complete study package for the topic: "${topic}".
    
    Return the result using these EXACT section headers:
    ### Explanation
    ### Key Points
    ### Short Notes
    ### Examples
    ### Quiz Questions
    ### Flashcards
    ### Summary
    
    For Quiz Questions, provide 5 MCQs with answers.
    For Flashcards, provide 5 question-answer pairs in the format "Question → Answer".
    Keep explanations simple and easy for students.`,

  exam: (subject: string, difficulty: string, count: number) => 
    `You are an AI academic exam paper generator. Generate a structured question paper for students.
    
    Subject: ${subject}
    Difficulty Level: ${difficulty}
    Total Questions: ${count}
    
    Create the paper using the following format:
    
    SECTION A – Multiple Choice Questions
    Generate 5 MCQ questions with 4 options each. Provide the correct answer.
    
    SECTION B – Short Answer Questions
    Generate short questions that require 2–4 sentence answers.
    
    SECTION C – Long Answer Questions
    Generate descriptive questions suitable for exam preparation.
    
    Ensure:
    - Questions are relevant to the subject
    - Difficulty matches the level requested
    - Format looks like a real university exam paper
    
    Keep the output structured and clearly separated by sections.`,

  flashcards: (topic: string) => 
    `You are an AI study assistant.
    
    Generate 10 study flashcards for the topic: "${topic}".
    
    Each flashcard must include:
    Question
    Answer
    
    The flashcards should cover important concepts, definitions, and examples.
    Keep answers short and easy to remember.
    
    Format the output as follows:
    Flashcard 1
    Question: [Question text]
    Answer: [Answer text]
    
    Flashcard 2
    Question: [Question text]
    Answer: [Answer text]
    ... and so on up to 10.`,

  codeHelper: (language: string, code: string) => 
    `You are a programming tutor helping students understand code.
    
    Analyze the following code:
    
    Language: ${language}
    
    Code:
    ${code}
    
    Return the result using these sections:
    1. Code Explanation
    Explain what the code does step-by-step.
    
    2. Logic Breakdown
    Explain the logic behind the code.
    
    3. Possible Issues
    Identify bugs or mistakes if present.
    
    4. Optimization Suggestions
    Suggest improvements or better practices.
    
    5. Improved Version of the Code
    Provide a cleaner or optimized version if possible.
    
    Explain clearly so a beginner student can understand.`,

  lectureNotes: (lectureText: string) => 
    `You are an AI academic tutor helping students convert lectures into study materials.

Lecture Content:
${lectureText}

Generate structured study material using these sections:

### Summary
Provide a short summary of the lecture.

### Key Points
List the main ideas in bullet points.

### Detailed Notes
Convert the lecture into organized study notes.

### Flashcards
Generate 5 flashcards in the format:
Question → Answer

### Quiz Questions
Generate 5 multiple choice questions with answers.

### Revision Notes
Provide short revision notes for quick study.

Make explanations clear and easy for students.`,

  citation: (title: string, author: string, year: string, publisher: string) => 
    `You are an academic reference generator.

Source information:
Title: ${title}
Author: ${author}
Year: ${year}
Publisher: ${publisher}

Generate formatted citations in these styles:

### APA
### MLA
### IEEE
### Chicago

Ensure the formatting follows standard academic citation rules. Return only the formatted citations under each header.`,
};
