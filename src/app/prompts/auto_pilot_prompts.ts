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

// const emailWriterPrompt = ({ role }: {role: string}) => `
// You are an assistant that writes short professional job application emails.

// Return ONLY a valid JSON object. No explanation, no prose, no markdown, no extra text.

// Format exactly:
// {
//   "subject": "Application for {role}",
//   "body": "..."
// }

// Job Role: ${role}
// Candidate
// `;

// const postAnalyzerPrompt = ({
//   post_content,
//   summary,
// }: {
//   post_content: string;
//   summary: string;
// }) => `
// You are an AI that analyzes LinkedIn job posts.

// Inputs:
// - Job post: ${post_content}
// - Candidate summary: ${summary}

// Your task:
// 1. Extract the HR email (if present).
// 2. From the job roles mentioned in the post, choose ONLY those roles that are suitable for the candidate based on experience and skills.
// 3. Format roles like: "Job Title (X yrs)" where X is the required experience mentioned in the post.

// Output ONLY in this JSON format (no extra fields, no explanation):

// {
//   "hr_email": "example@company.com",
//   "roles": ["Frontend Developer (2 yrs)", "Full Stack Developer (1.5 yrs)"]
// }
// `;

// const testSummary = `### Summary of Govind Kumar's Resume\n\n**Overview**: Govind Kumar is a Full Stack Web Developer based in Himachal Pradesh, India, with a strong technical background and a diverse skill set in web development, database management, and DevOps. His resume highlights his professional experience, technical and soft skills, education, real-world projects, and personal interests. Below is a detailed summary of each section of his resume.\n\n---\n\n#### **Coding Profiles**\n- Govind maintains active profiles on coding platforms such as **Leetcode** and **HackerRank**, showcasing his problem-solving abilities and coding expertise.\n\n---\n\n#### **Technical Skills**\nGovind possesses a wide range of technical skills, including:\n- **Frontend Development**: ReactJS, Redux, Material UI\n- **Backend Development**: NodeJS, ExpressJS, FastAPI\n- **Databases**: MySQL, MongoDB\n- **Programming Languages**: TypeScript, ES6, Python3\n- **Frameworks and Tools**: Langchain, DSA (Data Structures and Algorithms), Docker\n- **Cloud and DevOps**: AWS EC2, DevOps\n- **Other**: Prompt Engineering\n\n---\n\n#### **Soft Skills**\n- **Team Collaboration**: Effective in working with teams to achieve common goals.\n- **Remote Work**: Experienced in working remotely, demonstrating adaptability and independence.\n- **Problem Solving**: Strong analytical skills to address and resolve challenges.\n- **Quick Learner**: Ability to rapidly acquire new skills and knowledge.\n\n---\n\n#### **Languages**\n- Proficient in **English** and **Hindi**.\n\n---\n\n#### **Professional Experience**\n1. **Full Stack Developer at BoffinBlocks**  \n   - **Duration**: April 2023 – Present  \n   - **Location**: Mohali, India  \n   - Engaged in full-stack development tasks, contributing to the design and implementation of web applications.\n\n2. **Open Source Contributor at FlowiseAI**  \n   - **Duration**: May 2023 – Present  \n   - **Location**: Remote  \n   - Contributed to FlowiseAI, a no-code tool for developing LLM (Large Language Model) applications, by adding important integrations to enhance functionality.\n\n---\n\n#### **Real-World Projects**\n1. **Selfcad (3D Design Software)**  \n   - Role: Developer  \n   - Responsibilities: Writing new APIs, maintaining existing code, and creating test cases using Chai and Mocha to ensure the reliability of critical code components.\n\n2. **AIAAS (AI as a Service)**  \n   - Role: Sole Developer  \n   - Description: Fully developed a platform enabling users to chat with their documents (of any type) through a chat widget accessible after successful sign-in.\n\n3. **EdgeDB Adapter for FeatherJS**  \n   - Role: Developer  \n   - Description: Created a database adapter to connect FeatherJS (a web framework for REST APIs) with EdgeDB, facilitating seamless integration.\n\n4. **FlowiseAI (No-Code LLM App Development Tool)**  \n   - Role: Open Source Contributor  \n   - Contribution: Added significant integrations to enhance the platform's capabilities for developing LLM applications.\n\n---\n\n#### **Education**\n1. **Full-Stack Web Development (Full-Time)**  \n   - Institution: Masai School  \n   - Duration: May 2022 – March 2023  \n   - Focus: Comprehensive training in full-stack web development.\n\n2. **Bachelor of Computer Applications (BCA)**  \n   - Institution: Laureate Institute of Information Technology  \n   - Duration: May 2019 – July 2021  \n   - Degree in computer applications, providing a strong foundation in IT and programming.\n\n3. **Intermediate (PCM - Physics, Chemistry, Mathematics)**  \n   - Location: Dehra  \n   - Duration: March 2018 – April 2019  \n   - Percentage: 85%  \n   - Completed intermediate education with a focus on science and mathematics.\n\n---\n\n#### **Interests**\n- Govind has a keen interest in **Geopolitics**, **Esports**, **History**, and **Problem Solving**, reflecting a well-rounded personality with diverse intellectual pursuits.\n\n---\n\n#### **Contact Information and Online Presence**\n- **Name**: Govind Kumar  \n- **Email**: gk4051668@gmail.com  \n- **Phone**: 8219189058  \n- **Location**: Himachal Pradesh, India  \n- **Portfolio**: Available (specific link not provided in the document)  \n- **LinkedIn**: Profile available (specific link not provided)  \n- **GitHub**: Profile available (specific link not provided)  \n- **Leetcode**: Profile available (specific link not provided)\n\n---\n\n### Conclusion\nGovind Kumar is a skilled Full Stack Web Developer with expertise in a wide array of technologies, including ReactJS, NodeJS, and cloud tools like AWS EC2. His professional experience includes working as a Full Stack Developer at BoffinBlocks and contributing to open-source projects like FlowiseAI. He has independently developed impactful projects such as AIAAS and EdgeDB Adapter for FeatherJS, demonstrating his ability to handle end-to-end development. With a solid educational background in full-stack development and computer applications, complemented by strong problem-solving and collaboration skills, Govind is a versatile and capable professional in the tech industry.`;

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

export { postAnalyzerPrompt, emailWriterPrompt };
