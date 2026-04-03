const axios = require("axios")
const puppeteer = require("puppeteer")

function callOpenRouter(messages) {
    return axios.post("https://openrouter.ai/api/v1/chat/completions", {
        model: "mistralai/mistral-7b-instruct:free",
        messages,
        response_format: { type: "json_object" }
    }, {
        headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://interview-ai-2jf6.onrender.com",
            "X-Title": "Interview AI"
        }
    })
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate an interview report for a candidate with the following details:
        Resume: ${resume}
        Self Description: ${selfDescription}
        Job Description: ${jobDescription}
        
        Respond ONLY with a valid JSON object with these exact fields:
        {
            "matchScore": <number 0-100>,
            "title": "<job title>",
            "technicalQuestions": [{"question": "", "intention": "", "answer": ""}],
            "behavioralQuestions": [{"question": "", "intention": "", "answer": ""}],
            "skillGaps": [{"skill": "", "severity": "low|medium|high"}],
            "preparationPlan": [{"day": 1, "focus": "", "tasks": [""]}]
        }`

    const response = await callOpenRouter([{ role: "user", content: prompt }])
    return JSON.parse(response.data.choices[0].message.content)
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    })
    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })
    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" }
    })
    await browser.close()
    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate a resume for a candidate with the following details:
        Resume: ${resume}
        Self Description: ${selfDescription}
        Job Description: ${jobDescription}

        Respond ONLY with a valid JSON object with a single field "html" containing the full HTML content of the resume.
        The resume should be tailored for the given job description, ATS friendly, simple and professional design, 1-2 pages long.
        The content should not sound AI-generated.
    `

    try {
        const response = await callOpenRouter([{ role: "user", content: prompt }])
        const content = response.data.choices[0].message.content
        const jsonContent = JSON.parse(content)
        return await generatePdfFromHtml(jsonContent.html)
    } catch (error) {
        // Log the full OpenRouter error response
        console.error("OpenRouter error status:", error.response?.status)
        console.error("OpenRouter error data:", JSON.stringify(error.response?.data))
        throw error
    }
}

module.exports = { generateInterviewReport, generateResumePdf }