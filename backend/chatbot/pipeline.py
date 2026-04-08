import os
import json
from pathlib import Path
from typing import Optional

import requests
from dotenv import load_dotenv
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings


load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
VECTORSTORE_CANDIDATES = [
    BASE_DIR / "vectorstore",
    BASE_DIR.parent / "vectorstore",
]
PORTFOLIO_DATA_CANDIDATES = [
    BASE_DIR / "data" / "portfolio.json",
    BASE_DIR / "chatbot" / "data" / "portfolio.json",
]
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
HF_API_URL = "https://router.huggingface.co/v1/chat/completions"
LLM_MODEL = "Qwen/Qwen2.5-7B-Instruct"

SYSTEM_PROMPT = """You are a portfolio assistant for the website owner.
Your job is to answer questions about the candidate using the provided portfolio context.

Rules:
- Be specific and concrete. Prefer names, roles, tools, project titles, timelines, and outcomes over generic summaries.
- When the question is broad, give a short summary first, then include 2-4 concrete supporting details from the context.
- If the question asks who the person is, summarize their background, strongest areas, and one or two notable projects or roles.
- If the context does not contain the requested fact, say so plainly instead of guessing.
- Do not invent personal details such as age, birth year, location, or full name unless they are present in the context.
- Keep answers concise, but not vague."""

_vectorstore: Optional[FAISS] = None
_portfolio_data: Optional[dict] = None


def get_embeddings() -> HuggingFaceEmbeddings:
    return HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)


def get_vectorstore() -> FAISS:
    global _vectorstore

    if _vectorstore is None:
        vectorstore_dir = next((path for path in VECTORSTORE_CANDIDATES if path.exists()), None)
        if vectorstore_dir is None:
            checked_paths = ", ".join(str(path) for path in VECTORSTORE_CANDIDATES)
            raise FileNotFoundError(
                f"Vector store not found. Checked: {checked_paths}. Build and copy your FAISS index there first."
            )

        _vectorstore = FAISS.load_local(
            str(vectorstore_dir),
            get_embeddings(),
            allow_dangerous_deserialization=True,
        )

    return _vectorstore


def get_portfolio_data() -> dict:
    global _portfolio_data

    if _portfolio_data is None:
        data_path = next((path for path in PORTFOLIO_DATA_CANDIDATES if path.exists()), None)
        if data_path is None:
            checked_paths = ", ".join(str(path) for path in PORTFOLIO_DATA_CANDIDATES)
            raise FileNotFoundError(f"Portfolio data not found. Checked: {checked_paths}.")

        with data_path.open("r", encoding="utf-8") as file:
            _portfolio_data = json.load(file)

    return _portfolio_data


def is_broad_profile_question(question: str) -> bool:
    broad_phrases = [
        "who is this person",
        "tell me about this person",
        "tell me about this candidate",
        "who is this candidate",
        "what does this person do",
        "summarize this candidate",
        "give me an overview",
        "introduce this person",
    ]
    question_lower = question.lower()
    return any(phrase in question_lower for phrase in broad_phrases)


def is_project_overview_question(question: str) -> bool:
    question_lower = question.lower()
    project_terms = ["project", "projects", "worked on", "built", "portfolio projects"]
    return "project" in question_lower or any(term in question_lower for term in project_terms)


def is_identity_question(question: str) -> bool:
    question_lower = question.lower()
    identity_terms = [
        "full name",
        "name of this person",
        "who is this guy",
        "who is this person",
        "what is his name",
        "what is this person's name",
    ]
    return any(term in question_lower for term in identity_terms)


def is_education_question(question: str) -> bool:
    question_lower = question.lower()
    education_terms = [
        "college",
        "university",
        "study",
        "studied",
        "education",
        "degree",
        "attend",
        "attended",
        "school",
    ]
    return any(term in question_lower for term in education_terms)


def build_profile_context() -> str:
    data = get_portfolio_data()
    top_projects = data.get("projects", [])[:3]
    top_experience = data.get("experience", [])[:3]
    education = data.get("education", [])

    project_lines = []
    for project in top_projects:
        project_lines.append(
            f"- {project['name']}: {project['solution']} Impact: {project['impact']}"
        )

    experience_lines = []
    for exp in top_experience:
        experience_lines.append(
            f"- {exp['role']} at {exp['company']} ({exp['timeline']}): {exp['impact']}"
        )

    education_lines = []
    for item in education[:2]:
        specialization = item.get("specialization")
        specialization_text = f", {specialization}" if specialization else ""
        education_lines.append(
            f"- {item['degree']}{specialization_text}, {item['institution']} ({item['timeline']})"
        )

    skills = data.get("skills", {})
    core_skills = []
    for category in ["backend_and_tools", "data_engineering", "machine_learning"]:
        core_skills.extend(skills.get(category, [])[:3])

    return (
        f"[Profile]\n"
        f"Name: {data.get('name', 'Not provided')}\n"
        f"Headline: {data.get('headline', 'Not provided')}\n"
        f"Summary: {data.get('summary', data.get('about', 'Not provided'))}\n\n"
        f"[Top Experience]\n" + "\n".join(experience_lines) + "\n\n"
        f"[Top Projects]\n" + "\n".join(project_lines) + "\n\n"
        f"[Education]\n" + "\n".join(education_lines) + "\n\n"
        f"[Core Skills]\n" + ", ".join(core_skills)
    )


def build_projects_context() -> str:
    data = get_portfolio_data()
    projects = data.get("projects", [])

    project_lines = []
    for project in projects:
        project_lines.append(
            f"- {project['name']}\n"
            f"  Problem: {project['problem']}\n"
            f"  Solution: {project['solution']}\n"
            f"  Tech: {', '.join(project['tech'])}\n"
            f"  Impact: {project['impact']}"
        )

    return "[All Projects]\n" + "\n".join(project_lines)


def build_projects_answer() -> str:
    data = get_portfolio_data()
    projects = data.get("projects", [])
    if not projects:
        return "The portfolio does not list any projects."

    lines = [f"This person has worked on {len(projects)} projects in the portfolio:"]
    for project in projects:
        lines.append(
            f"- {project['name']}: {project['solution']} "
            f"Tech: {', '.join(project['tech'])}. Impact: {project['impact']}"
        )
    return "\n".join(lines)


def build_identity_answer() -> str:
    data = get_portfolio_data()
    name = data.get("name")
    if not name:
        return "The portfolio does not provide the person's full name."
    return f"The person's full name is {name}."


def build_education_answer() -> str:
    data = get_portfolio_data()
    education = data.get("education", [])
    if not education:
        return "The portfolio does not provide education details."

    lines = ["This person attended the following colleges/universities:"]
    for item in education:
        specialization = item.get("specialization")
        specialization_text = f" in {specialization}" if specialization else ""
        lines.append(
            f"- {item['institution']}: {item['degree']}{specialization_text} ({item['timeline']})"
        )
    return "\n".join(lines)


def retrieve_context(question: str, k: int = 6) -> str:
    docs = get_vectorstore().similarity_search(question, k=k)
    formatted_chunks = []
    for index, doc in enumerate(docs, start=1):
        formatted_chunks.append(f"[Context {index}]\n{doc.page_content}")

    if is_broad_profile_question(question):
        return build_profile_context() + "\n\n" + "\n\n".join(formatted_chunks)

    if is_project_overview_question(question):
        return build_projects_context() + "\n\n" + "\n\n".join(formatted_chunks)

    return "\n\n".join(formatted_chunks)


def build_messages(question: str, context: str) -> list[dict[str, str]]:
    return [
        {"role": "system", "content": SYSTEM_PROMPT},
        {
            "role": "user",
            "content": (
                "Use only the portfolio context below to answer.\n\n"
                f"{context}\n\n"
                f"User question:\n{question}\n\n"
                "Answer format:\n"
                "- Start with a direct answer.\n"
                "- Include concrete details from the context when available.\n"
                "- If information is missing, say that it is not provided in the portfolio."
            ),
        },
    ]


def query_huggingface(messages: list[dict[str, str]]) -> str:
    api_token = os.getenv("HUGGINGFACE_API_TOKEN")
    if not api_token:
        raise ValueError("Missing HUGGINGFACE_API_TOKEN environment variable.")

    response = requests.post(
        HF_API_URL,
        headers={"Authorization": f"Bearer {api_token}"},
        json={
            "model": LLM_MODEL,
            "messages": messages,
            "max_tokens": 250,
            "temperature": 0.2,
        },
        timeout=60,
    )
    response.raise_for_status()

    payload = response.json()
    if payload.get("choices"):
        return payload["choices"][0]["message"]["content"].strip()

    raise ValueError(f"Unexpected Hugging Face response: {payload}")


def answer_question(question: str) -> dict:
    if is_identity_question(question) and is_education_question(question):
        return {
            "answer": build_identity_answer() + "\n" + build_education_answer(),
            "context": build_profile_context(),
        }
    if is_project_overview_question(question):
        return {
            "answer": build_projects_answer(),
            "context": build_projects_context(),
        }
    if is_identity_question(question):
        return {
            "answer": build_identity_answer(),
            "context": "[Profile]\nName: " + get_portfolio_data().get("name", "Not provided"),
        }
    if is_education_question(question):
        return {
            "answer": build_education_answer(),
            "context": build_profile_context(),
        }

    context = retrieve_context(question)
    messages = build_messages(question, context)
    answer = query_huggingface(messages)
    return {
        "answer": answer,
        "context": context,
    }
