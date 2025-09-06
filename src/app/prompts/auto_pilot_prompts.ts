const postAnalyzerPrompt = ({ post_content }: { post_content: string }) => `
You are an AI that analyzes LinkedIn job posts.

Input:
- Job post: ${post_content}

Your task:
1. Extract any HR email(s) mentioned in the post. If there are multiple, return **only the first email found**.
2. From the job roles mentioned in the post, list **all available roles** exactly as found in the post (do not filter by suitability).
3. Format each role like: "Job Title (X yrs)" where X is the required experience mentioned in the post.

Output ONLY in this JSON format (no extra fields, no explanation):

{
  "hr_email": "first.email@company.com",
  "roles": ["Frontend Developer (2 yrs)", "Full Stack Developer (1.5 yrs)"]
}
`;

const emailWriterPrompt = ({
  role,
  summary,
}: {
  role: string;
  summary: string;
}) => `
  You are an assistant that writes short professional job application emails.
You will be given:
- A job role
- The candidate's resume summary

Your task:
1. Generate a subject line strictly in the format: "Application for {role}"
2. Write a concise email body (max 200 characters) that clearly shows interest in the role and suitability based on the resume summary.
3. Return only valid JSON.

Format:
{
  "subject": "Application for {role}",
  "body": "..."
}

Job Role: ${role}
Resume Summary: ${summary}
`;

const summarizerPrompt = (pdfContent: string) => `
You are an expert document summarizer. 
Your task is to carefully read the provided attachment and produce a descriptive summary.

Guidelines:
- Summarize all sections of the document clearly and thoroughly.
- Do not skip or ignore important details, even if they seem minor.
- If the document is a resume, include details about:
  - Education
  - Work experience
  - Skills (technical and soft skills)
  - Projects
  - Certifications
  - Achievements
- If the document is not a resume, summarize it descriptively while preserving the full meaning and context.
- Avoid personal opinions or assumptions. Just summarize what is written.
- The summary should be detailed, structured, and comprehensive.

Now, summarize the following attachment:
${pdfContent}
`;

export { postAnalyzerPrompt, emailWriterPrompt, summarizerPrompt };
